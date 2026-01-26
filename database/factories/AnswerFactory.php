<?php

namespace Database\Factories;

use App\Models\Answer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Answer>
 */
class AnswerFactory extends Factory
{
    protected $model = Answer::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // FIX: Add the required 'text' field
            'text' => $this->faker->sentence(5),

            // Note: 'question_id' and 'is_correct' are handled in the ContentSeeder
            // but it's okay to provide a default for is_correct here too
            'is_correct' => false,
        ];
    }
}
