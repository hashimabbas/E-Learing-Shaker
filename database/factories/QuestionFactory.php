<?php

namespace Database\Factories;

use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    protected $model = Question::class; // (Optional, but good practice)

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // FIX: Add the required 'text' field (and 'type' and 'order' if they are also non-nullable)
            'text' => $this->faker->sentence(10) . '?', // Generates a random sentence ending with a question mark
            'type' => $this->faker->randomElement(['single_choice', 'multiple_choice', 'true_false']),
            'order' => $this->faker->numberBetween(1, 10), // Assuming an order field is needed
        ];
    }
}
