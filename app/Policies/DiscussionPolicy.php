<?php

namespace App\Policies;

use App\Models\Discussion;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Auth\Access\HandlesAuthorization;

class DiscussionPolicy
{
    use HandlesAuthorization;

    // Admin/Instructor can delete any comment/discussion in their course
    public function before(User $user, string $ability): bool|null
    {
        if ($user->isAdmin()) {
            return true;
        }

        // Check if the user is the instructor of the course to which the discussion belongs
        if ($ability === 'delete' || $ability === 'update') {
             // We need to eager load the course owner here for the check if it's not available
             // $discussion->load('course.instructor');
             // Assuming the course is loaded on the discussion object for the check
             $courseInstructorId = $discussion->course->user_id ?? null;

             if ($user->id === $courseInstructorId && $user->isInstructor()) {
                return true;
             }
        }

        return null;
    }

    /**
     * Determine whether the user can view discussions in this course.
     */
    public function view(User $user, Discussion $discussion): bool
    {
        // Check if the user is enrolled in the course
        return $user->enrolledCourses()->where('course_id', $discussion->course_id)->exists();
    }

    /**
     * Determine whether the user can delete the discussion (must be the creator).
     */
    public function delete(User $user, Discussion $discussion): bool
    {
        return $user->id === $discussion->user_id;
    }

    // Policy for adding comments will be handled in the controller (isEnrolled check)
}
