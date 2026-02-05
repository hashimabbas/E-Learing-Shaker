<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Routing\Controller;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\Instructor\CourseStoreRequest; // NEW USE
use App\Http\Requests\Instructor\CourseUpdateRequest; // NEW USE

class InstructorCourseController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:instructor|admin']);
        // Use the CoursePolicy for fine-grained control
    }

    /**
     * Display a listing of the instructor's courses.
     */
    public function index(Request $request): Response
    {
        $courses = $request->user()->courses()
            ->with(['category:id,name'])
            ->withCount(['students', 'reviews'])
            ->latest()
            ->paginate(10);

        // Calculate revenue for each course
        $courses->getCollection()->transform(function ($course) {
            $course->revenue = \App\Models\OrderItem::where('course_id', $course->id)
                ->whereHas('order', fn($q) => $q->where('status', 'paid'))
                ->sum(DB::raw('price * quantity'));
            return $course;
        });

        return Inertia::render('Instructor/Courses/Index', [
            'courses' => $courses,
        ]);
    }

    /**
     * Show the form for creating a new course.
     */
    public function create(): Response
    {
        // $this->authorize('create', Course::class); // Check policy if needed

        return Inertia::render('Instructor/Courses/Create', [
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created course.
     */
    public function store(CourseStoreRequest $request): RedirectResponse
    {
        // Validation is handled by CourseStoreRequest
        $validated = $request->validated();

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail_file')) {
            $thumbnailPath = $request->file('thumbnail_file')->store('courses/thumbnails', 'public');
        }

        $course = Course::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'title_ar' => $validated['title_ar'] ?? null,
            'slug' => Str::slug($validated['title']) . '-' . Str::random(5),
            'description' => $validated['description'],
            'description_ar' => $validated['description_ar'] ?? null,
            'category_id' => $validated['category_id'],
            'price' => $validated['price'],
            'is_published' => false,
            'thumbnail' => $thumbnailPath,
            'preview_video_url' => $validated['preview_video_url'] ?? null,
            'learning_outcomes' => $validated['learning_outcomes'] ?? null,
            'learning_outcomes_ar' => $validated['learning_outcomes_ar'] ?? null,
            'discount_percentage' => $validated['discount_percentage'] ?? 0,
            'discount_start_date' => $validated['discount_start_date'] ?? null,
            'discount_end_date' => $validated['discount_end_date'] ?? null,
        ]);

        return redirect()->route('instructor.courses.edit', $course)->with('success', 'Course created! Now add lessons.');
    }

    /**
     * Show the form for editing the course.
     */
    public function edit(Course $course): Response
    {
        // $this->authorize('update', $course); // Check if instructor owns course

         // Fix: Ensure we eager load the Quiz ID
        $course->load([
            'lessons' => fn($query) => $query->orderBy('order')->with([
                'video',
                // Eager load the quiz, selecting ONLY the ID and lesson_id
                'quiz:id,lesson_id',
                'quiz' => fn($q) => $q->with('questions.answers') // <-- CRUCIAL: Load nested questions and answers

            ]),
        ]);

        // Loop through lessons and create a Quiz record if one is missing
        foreach ($course->lessons as $lesson) {
            if ($lesson->type === 'quiz' && is_null($lesson->quiz)) {
                // Manually create the Quiz record and re-load the relationship on the lesson object
                $lesson->quiz()->create([
                    'title' => 'Quiz for ' . $lesson->title, // Simple default title
                    'description' => 'Quiz questions for this lesson.',
                ]);
                $lesson->load('quiz:id,lesson_id');
            }
        }

        return Inertia::render('Instructor/Courses/Edit', [
            'course' => $course,
            'categories' => Category::all(['id', 'name']),
        ]);
    }

    public function update(CourseUpdateRequest $request, Course $course): RedirectResponse
    {
        // Optional: ownership / policy check
        // $this->authorize('update', $course);

        $course->update([
            'title' => $request->title,
            'title_ar' => $request->title_ar,
            'description' => $request->description,
            'description_ar' => $request->description_ar,
            'category_id' => $request->category_id,
            'price' => $request->price,
            'learning_outcomes' => $request->learning_outcomes,
            'learning_outcomes_ar' => $request->learning_outcomes_ar,
            'discount_percentage' => $request->discount_percentage,
            'discount_start_date' => $request->discount_start_date,
            'discount_end_date' => $request->discount_end_date,
        ]);

        return back()->with('success', 'Course updated successfully.');
    }
    // ... (update, destroy methods would follow similar logic)

     /**
     * Update the course's publication status (Admin Approval).
     */
    public function togglePublish(Course $course): RedirectResponse
    {
        // This method assumes it's behind the 'role:admin' middleware
        $course->update([
            'is_published' => !$course->is_published,
        ]);

        // **Later Improvement: Send notification to instructor about approval/unapproval.**

        $status = $course->is_published ? 'published' : 'unpublished';

        return back()->with('success', "Course '{$course->title}' successfully {$status}.");
    }
}
