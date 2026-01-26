<?php

namespace App\Services;

use App\Models\Course;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RecommendationService
{
    /**
     * Get a list of recommended courses for a user.
     */
    public function getRecommendations(User $user, int $limit = 4): Collection
    {
        // 1. Identify the user's most engaged categories based on enrollment/view history
        $mostViewedCategoryIds = DB::table('recently_viewed')
            ->join('courses', 'recently_viewed.course_id', '=', 'courses.id')
            ->where('recently_viewed.user_id', $user->id)
            ->select('courses.category_id')
            ->groupBy('courses.category_id')
            ->orderByRaw('COUNT(courses.category_id) DESC')
            ->pluck('courses.category_id')
            ->take(3); // Get top 3 categories

        // 2. Identify courses the user is already enrolled in
        $enrolledCourseIds = $user->enrolledCourses()->pluck('course_id');

        // 3. Build the final recommendation query
        $recommendations = Course::query()
            ->where('is_published', true)
            ->whereNotIn('id', $enrolledCourseIds) // Exclude already purchased courses
            ->when($mostViewedCategoryIds->isNotEmpty(), function ($query) use ($mostViewedCategoryIds) {
                // Prioritize courses from the user's top categories
                $query->whereIn('category_id', $mostViewedCategoryIds);
            })
            ->inRandomOrder() // Randomize the final set
            ->limit($limit)
            ->get();

        return $recommendations;
    }
}
