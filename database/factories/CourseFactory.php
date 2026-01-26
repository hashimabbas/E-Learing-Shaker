<?php

namespace Database\Factories;

use App\Models\Course;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Faker\Generator as Faker;

class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(),  // Creates a new instructor user for each course
            'category_id' => Category::factory(), // Links a random category
            'title' => $this->faker->sentence(5),
            'slug' => $this->faker->slug,
            'description' => $this->faker->paragraph,
            'learning_outcomes' => $this->faker->words(5),
            'price' => $this->faker->randomFloat(2, 10, 100),
            'is_published' => $this->faker->boolean,
            'thumbnail' => '/images/default-thumbnail.jpg',  // Placeholder for a thumbnail image
            'preview_video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ',  // Placeholder video URL
            'average_rating' => $this->faker->randomFloat(1, 1, 5),
            'reviews_count' => $this->faker->numberBetween(0, 500),
        ];
    }
}
