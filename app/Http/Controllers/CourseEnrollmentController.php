<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

// app/Http/Controllers/CourseEnrollmentController.php

class CourseEnrollmentController extends Controller
{
    public function enrollFree(Course $course)
    {
        if ($course->price > 0) {
            abort(403, 'This course is not free.');
        }

        $user = auth()->user();

        // Prevent duplicate enrollment
        if ($user->enrolledCourses()->where('course_id', $course->id)->exists()) {
            return redirect()
                ->route('courses.learn', $course->slug);
        }

        $user->enrolledCourses()->attach($course->id);

        return redirect()
            ->route('student.resume-course', $course->slug)
            ->with('success', 'You are now enrolled 🎉');
    }
}
