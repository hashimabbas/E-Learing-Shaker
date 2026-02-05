<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Ensure the authenticated user owns the course being updated
        $course = $this->route('course');
        return ($this->user()->isInstructor() && $this->user()->id === $course->user_id) || $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $courseId = $this->route('course')->id;

        return [
            'title' => ['required', 'string', 'max:255', Rule::unique('courses', 'title')->ignore($courseId)],
            'title_ar' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'description_ar' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'price' => 'required|numeric|min:0',
            'thumbnail_file' => ['nullable', 'image', 'max:5000'],
            'learning_outcomes' => 'nullable|array',
            'learning_outcomes_ar' => 'nullable|array',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'discount_start_date' => 'nullable|date',
            'discount_end_date' => 'nullable|date|after_or_equal:discount_start_date',
        ];
    }
}
