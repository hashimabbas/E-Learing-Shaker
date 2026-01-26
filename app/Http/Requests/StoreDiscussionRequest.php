<?php

namespace App\Http\Requests;

use App\Models\Course;
use Illuminate\Foundation\Http\FormRequest;

class StoreDiscussionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user();

        // 1. Must be logged in (Handled by the 'auth' middleware)
        if (!$user) {
            return false;
        }

        // 2. Must ensure the course_id is provided
        if (!$this->has('course_id')) {
            return false;
        }

        $course = Course::find($this->course_id);

        if (!$course) {
            return false;
        }

        // 3. Authorization Check: Must be enrolled, OR be the instructor, OR be an admin
        $isEnrolled = $user->enrolledCourses()->where('course_id', $course->id)->exists();
        $isCourseOwner = $course->user_id === $user->id;

        return $isEnrolled || $isCourseOwner || $user->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // We rely on the authorization for the existence check of the course,
            // but keep the existence check here for general validation safety.
            'course_id' => ['required', 'exists:courses,id'],
            'title' => ['required', 'string', 'max:255'],
            'content' => ['required', 'string', 'max:5000'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     */
    public function messages(): array
    {
        return [
            'course_id.required' => 'The course is required to start a discussion.',
            'course_id.exists' => 'The selected course does not exist.',
            'title.required' => 'A topic title is required.',
        ];
    }
}
