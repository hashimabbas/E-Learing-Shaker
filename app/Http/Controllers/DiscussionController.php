<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Discussion;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Events\InstructorRepliedToDiscussion;
use Illuminate\Routing\Controller;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\StoreDiscussionRequest; // <-- NEW USE
use App\Models\User; // NEW USE
use App\Notifications\DiscussionCommented; // NEW USE

class DiscussionController extends Controller
{
    public function __construct()
    {
        // Only authenticated users (students) can access the forums
        $this->middleware('auth');
    }

    /**
     * Helper to authorize if a user can view course discussions.
     */
    private function authorizeAccess(Course $course)
    {
        $user = auth()->user();
        // Allow if the user is enrolled OR is the course instructor OR is an admin
        if (!$user->enrolledCourses()->where('course_id', $course->id)->exists() && $course->user_id !== $user->id && !$user->isAdmin()) {
            abort(403, 'You must be enrolled in this course to access the discussion forum.');
        }
    }

    /**
     * Display the list of discussions for a course.
     */
    public function index(Course $course): Response
    {
        $this->authorizeAccess($course); // <-- SECURITY FIX

        $discussions = $course->discussions()
            ->with('user:id,name')
            ->latest()
            ->paginate(10);

        return Inertia::render('Discussions/Index', [
            'course' => $course->only('id', 'title', 'slug'),
            'discussions' => $discussions,
        ]);
    }

    /**
     * Store a new discussion thread.
     */
    public function store(StoreDiscussionRequest $request): RedirectResponse // <-- THE NEW FUNCTION
    {
        // Validation and Enrollment Authorization are handled by StoreDiscussionRequest
        // Note: The StoreDiscussionRequest should verify the user is enrolled in $request->course_id

        $course = Course::findOrFail($request->course_id);

        $discussion = $course->discussions()->create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'content' => $request->content,
        ]);

        // Redirect the user to the newly created discussion thread
        return redirect()->route('discussions.show', $discussion->id)->with('success', 'Discussion topic created! You can now receive real-time replies.');
    }

    /**
     * Display a single discussion thread.
     */
    public function show(Discussion $discussion): Response
    {
        $this->authorizeAccess($discussion->course); // <-- SECURITY FIX

        $discussion->load([
            'user:id,name,role',
            'comments' => fn($query) => $query->with('user:id,name,role')->latest(),
        ]);

        return Inertia::render('Discussions/Show', [
            'discussion' => $discussion,
            'course' => $discussion->course->only('id', 'title', 'slug'),
        ]);
    }

    /**
     * Add a comment/reply to a discussion.
     */
    public function addComment(Request $request, Discussion $discussion): RedirectResponse
    {
        // ... authorization check ...

        $validated = $request->validate(['content' => 'required|string|max:1000']);

        $comment = $discussion->comments()->create([
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'is_instructor_reply' => auth()->user()->isInstructor(), // Check role
        ]);

        // --- NEW: Broadcast Event ---
        // --- NEW: Broadcast Event ---
        if ($comment->is_instructor_reply) {
            // This event will trigger the real-time update in the student's browser
            InstructorRepliedToDiscussion::dispatch($comment);
        }

        // --- Notifications Logic ---

        // 1. Notify the Discussion Author (if they are not the one commenting)
        if ($discussion->user_id !== auth()->id()) {
             $discussion->user->notify(new DiscussionCommented($comment));
        }

        // 2. Notify the Course Instructor (if they are not the one commenting AND they are not the discussion author - avoiding double notification)
        $courseInstructor = $discussion->course->instructor;
        
        if ($courseInstructor && $courseInstructor->id !== auth()->id() && $courseInstructor->id !== $discussion->user_id) {
            $courseInstructor->notify(new DiscussionCommented($comment));
        }

        return back()->with('success', 'Your comment has been posted.');
    }
}
