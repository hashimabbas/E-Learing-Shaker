<?php

// app/Http/Middleware/LogContentAccess.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\ContentAccessLog;
use App\Services\RiskEventRecorder;
use App\Services\AccountSharingDetector;
use Illuminate\Support\Facades\DB;

class LogContentAccess
{
    public function handle(Request $request, Closure $next)
    {

        if (auth()->check()) {
             $route = $request->route();
             $routeName = $route->getName();

             // 🎯 ONLY LOG VIDEO PLAYER ACTIONS
             if (in_array($routeName, ['courses.learn', 'secure.video'])) {
                 $user = $request->user();
                 
                 // Try to resolve course/lesson from route parameters
                 $course = $route->parameter('course');
                 $lesson = $route->parameter('lesson');
                 
                 // Handle if $course is an object (Slug binding) or ID
                 if ($course instanceof \App\Models\Course) {
                     $courseId = $course->id;
                 } else {
                     // Try to find course by slug or ID
                     $courseModel = is_numeric($course) 
                        ? \App\Models\Course::find($course) 
                        : \App\Models\Course::where('slug', $course)->first();
                     $courseId = $courseModel?->id;
                 }

                 // Handle if $lesson is an object or ID
                 if ($lesson instanceof \App\Models\Lesson) {
                     $lessonId = $lesson->id;
                 } elseif ($lesson) {
                      // Try to find lesson by slug or ID
                      $lessonModel = is_numeric($lesson)
                        ? \App\Models\Lesson::find($lesson)
                        : \App\Models\Lesson::where('slug', $lesson)->first();
                      $lessonId = $lessonModel?->id;
                 } else {
                     $lessonId = null;
                 }

                 ContentAccessLog::create([
                     'user_id' => $user->id,
                     'course_id' => $courseId,
                     'lesson_id' => $lessonId, 
                     'action' => $routeName,
                     'ip_address' => $request->ip(),
                     'session_id' => session()->getId(),
                     'user_agent' => $request->userAgent(),
                     'accessed_at' => now(),
                 ]);
             }
        }

        $response = $next($request);



        if (auth()->check()) {
            AccountSharingDetector::check(auth()->user());
        }

        return $response;
    }
}
