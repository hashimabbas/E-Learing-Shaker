<?php

namespace App\Policies;

use App\Models\Course;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class CoursePolicy
{
    use HandlesAuthorization;

    // Admin can bypass all checks
    public function before(User $user, string $ability): bool|null
    {
        if ($user->isAdmin()) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view the course content (the "learn" route).
     */
    public function viewContent(User $user, Course $course): bool
    {
        // 1. Check if the user is enrolled
        $isEnrolled = $user->enrolledCourses()->where('course_id', $course->id)->exists();

        // 2. Allow if enrolled
        if ($isEnrolled) {
            return true;
        }

        // 3. Allow if the user is the instructor who created the course
        return $user->id === $course->user_id && $user->isInstructor();
    }

    /**
     * Determine whether the user can create models (Course creation is for Instructors/Admins).
     */
    public function create(User $user): bool
    {
        return $user->isInstructor();
    }

    /**
     * Determine whether the user can update/delete the model.
     */
    public function manage(User $user, Course $course): bool
    {
        // Only the instructor who owns the course can manage it
        return $user->id === $course->user_id && $user->isInstructor();
    }
}
