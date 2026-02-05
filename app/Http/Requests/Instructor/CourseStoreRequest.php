<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CourseStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only an instructor or admin can create a course
        return $this->user()->isInstructor() || $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255', 'unique:courses,title'],
            'title_ar' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'description_ar' => ['nullable', 'string'],
            'category_id' => ['required', 'exists:categories,id'],
            'price' => 'required|numeric|min:0',
            'thumbnail_file' => ['nullable', 'image', 'max:5000'],
            'preview_video_url' => 'nullable|string',
            'learning_outcomes' => 'nullable|array',
            'learning_outcomes_ar' => 'nullable|array',
            'discount_percentage' => 'nullable|integer|min:0|max:100',
            'discount_start_date' => 'nullable|date',
            'discount_end_date' => 'nullable|date|after_or_equal:discount_start_date',
        ];
    }
}
