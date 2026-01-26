<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use App\Models\UserLessonProgress;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    /**
     * Update the user's progress for a specific lesson and calculate overall course progress.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'lesson_id' => ['required', 'exists:lessons,id'],
            'time_bookmark_seconds' => ['required', 'integer', 'min:0'],
            'progress_percentage' => ['required', 'integer', 'min:0', 'max:100'],
            'is_completed' => ['nullable', 'boolean'], // optional
        ]);

        $user = $request->user();
        $lesson = Lesson::with('course.lessons')->findOrFail($validated['lesson_id']);
        $isCompleted = $validated['is_completed'] ?? ($validated['progress_percentage'] >= 95);

        // Update or create lesson progress
        UserLessonProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'lesson_id' => $lesson->id,
            ],
            [
                'progress_percentage' => $validated['progress_percentage'],
                'time_bookmark_seconds' => $validated['time_bookmark_seconds'],
                'is_completed' => $isCompleted,
                'completed_at' => $isCompleted ? now() : null,
            ]
        );

        // Calculate course progress
        $mandatoryLessonTypes = ['video', 'quiz', 'text', 'downloadable'];
        $mandatoryLessonIds = $lesson->course->lessons
            ->whereIn('type', $mandatoryLessonTypes)
            ->pluck('id');

        $courseLessonsCount = $mandatoryLessonIds->count();
        $completedLessonsCount = UserLessonProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', $mandatoryLessonIds)
            ->where('is_completed', true)
            ->count();

        $courseProgress = $courseLessonsCount > 0
            ? round(($completedLessonsCount / $courseLessonsCount) * 100)
            : 0;

        // Update course progress on pivot table
        $user->enrolledCourses()->updateExistingPivot($lesson->course->id, [
            'progress' => $courseProgress,
            'completed_at' => $courseProgress >= 100 ? now() : null,
        ]);

        return response()->json([
            'message' => 'Progress saved',
            'course_progress' => $courseProgress,
        ]);
    }
}
