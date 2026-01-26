<?php

namespace Database\Factories;

use App\Models\Lesson;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    public function definition(): array
    {
        return [
            // lesson_id will be set by the seeder to avoid conflicts
            'title' => $this->faker->words(3, true) . ' Quiz',
            'description' => $this->faker->sentence(),
            'pass_percentage' => $this->faker->randomElement([60, 70, 80]),
            'max_attempts' => $this->faker->randomElement([null, 3, 5]),
        ];
    }
}
