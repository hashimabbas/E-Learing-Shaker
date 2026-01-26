<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Lesson;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class LessonFactory extends Factory
{
    protected $model = Lesson::class;

    public function definition(): array
    {
        $title = $this->faker->sentence(4);
        $type = $this->faker->randomElement(['video', 'quiz', 'downloadable']);

        return [
            'course_id' => Course::factory(),
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(5),
            'description' => $this->faker->paragraph(2),
            // FIX: Remove unique() because the pool of unique two-digit numbers (0-99)
            // is too small for the number of lessons being created.
            'order' => $this->faker->randomNumber(2),
            'type' => $type,
            'is_free_preview' => $this->faker->boolean(20), // 20% chance of a free preview
            'downloadable_path' => $type === 'downloadable' ? 'test_resources/' . Str::slug($title) . '.pdf' : null,
        ];
    }
}
