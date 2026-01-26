<?php

namespace App\Providers;

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\ServiceProvider;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Broadcast::routes(['middleware' => ['auth:web']]);

        // Authorization for the private discussion channel (Category 5)
        Broadcast::channel('discussion.{discussionId}', function ($user, $discussionId) {
            // A user can listen if they are the course instructor OR if they are enrolled in the course.
            $discussion = \App\Models\Discussion::find($discussionId);
            if (!$discussion) {
                return false;
            }

            $course = $discussion->course;

            // Allow if the user is the instructor of the course
            if ($course->user_id === $user->id) {
                return true;
            }

            // Allow if the user is enrolled
            return $user->enrolledCourses()->where('course_id', $course->id)->exists();
        });
         // Authorization for the private user channel (for notification bell)
        Broadcast::channel('App.Models.User.{userId}', function ($user, $userId) {
            return (int) $user->id === (int) $userId;
        });
    }
}
