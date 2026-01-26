<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Store a new review or update an existing one for a course.
     */
    public function store(Request $request, Course $course): RedirectResponse
    {
        $user = auth()->user();

        // 1. Authorization: User must be enrolled in the course
        $isEnrolled = $user->enrolledCourses()->where('course_id', $course->id)->exists();
        if (!$isEnrolled) {
            return back()->with('error', 'You can only review courses you are enrolled in.');
        }

        // 2. Validation
        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        DB::beginTransaction();
        try {
            // 3. Create or Update the Review
            $review = Review::updateOrCreate(
                ['user_id' => $user->id, 'course_id' => $course->id],
                [
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'],
                ]
            );

            // 4. Recalculate Course's Average Rating (CRITICAL)
            $newAverageRating = Review::where('course_id', $course->id)->avg('rating');
            $newReviewCount = Review::where('course_id', $course->id)->count();

            $course->update([
                'average_rating' => round($newAverageRating, 1),
                'reviews_count' => $newReviewCount,
            ]);

            DB::commit();

        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to submit review. Please try again.');
        }

        return back()->with('success', 'Thank you for your review! The course rating has been updated.');
    }
}
