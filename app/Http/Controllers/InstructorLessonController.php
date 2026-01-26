<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class InstructorLessonController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:instructor|admin']);
        // Add a policy middleware to ensure the user owns the course:
        // $this->middleware('can:manage,lesson')->except(['store']);
    }

    // ... create, store, edit, update, destroy methods would go here ...

    /**
     * Store a newly created lesson.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'type' => ['required', Rule::in(['video', 'quiz', 'text', 'downloadable'])],
            'order' => 'nullable|integer',
        ]);

        // Authorization: Ensure instructor owns the course
        $course = Course::findOrFail($validated['course_id']);
        if ($course->user_id !== auth()->id()) {
            abort(403);
        }

        $lesson = Lesson::create(array_merge($validated, ['slug' => Str::slug($validated['title']) . '-' . Str::random(5)]));

        // Optional: Create the Video/Quiz record immediately for the newly created lesson
        if ($lesson->type === 'video') {
             Video::create(['lesson_id' => $lesson->id, 'path' => '']);
        }

        return back()->with('success', 'Lesson created! You can now upload content.');
    }

    /**
     * Update the specified lesson.
     */
    public function update(Request $request, Lesson $lesson): RedirectResponse
    {
        // $this->authorize('manage', $lesson); // Policy check

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'order' => 'required|integer',
            'is_free_preview' => 'boolean',
        ]);

        $lesson->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(5),
            'order' => $validated['order'],
            'is_free_preview' => $validated['is_free_preview'],
        ]);

        return back()->with('success', 'Lesson updated successfully.');
    }

    /**
     * Remove the specified lesson and all associated content.
     */
    public function destroy(Lesson $lesson): RedirectResponse
    {
        // $this->authorize('manage', $lesson); // Policy check

        // The 'onDelete('cascade')' in migrations should handle the deletion of
        // related Video/Quiz/UserLessonProgress records automatically.
        $lesson->delete();

        return back()->with('success', 'Lesson deleted successfully.');
    }

    /**
     * Handle the file upload for a lesson (video or e-book).
     */
    public function uploadResource(Request $request, Lesson $lesson): RedirectResponse
    {
        // 1. Authorization Check (already handled by constructor, but good to have a policy)
        // $this->authorize('manage', $lesson);

        $validated = $request->validate([
            // Enforce file type based on the lesson type
            'resource_file' => [
                'required',
                'file',
                'max:500000', // 500MB
                Rule::when($lesson->type === 'video', ['mimetypes:video/mp4,video/quicktime', 'max:100000']), // Smaller max for test environment
                Rule::when($lesson->type === 'downloadable', ['mimetypes:application/pdf']),
            ],
        ]);

        DB::beginTransaction();
        try {
            // Store file in private local disk
            $path = $request->file('resource_file')->store("courses/{$lesson->course_id}/lessons/{$lesson->id}", 'local');

            if ($lesson->type === 'video') {
                // Get video duration for bookmarking logic
                // **DEPENDENCY: require getid3/getid3** or similar
                $duration = 1800; // Mock 30 minutes
                $lesson->video->update(['path' => $path, 'duration' => $duration]);
            } elseif ($lesson->type === 'downloadable') {
                $lesson->update(['downloadable_path' => $path]);
            } else {
                 // Should not happen, but a safety measure
                 throw new \Exception("Lesson type is not a valid resource container.");
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Resource Upload Failed: " . $e->getMessage(), ['lesson_id' => $lesson->id]);
            return back()->with('error', 'File upload failed. Please ensure the file type is correct.');
        }

        return back()->with('success', 'Resource uploaded successfully.');
    }
}
