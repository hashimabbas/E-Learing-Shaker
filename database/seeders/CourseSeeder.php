<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get an existing instructor or create a new one
        $instructor = User::where('role', 'instructor')->first();
        if (!$instructor) {
            // Create an instructor if one doesn't exist
            $instructor = User::factory()->create(['email' => 'instructor@example.com', 'role' => 'instructor']);
        }

        // 2. Get categories
        $categories = Category::all();

        if ($categories->isEmpty()) {
            $this->call(CategorySeeder::class); // Run category seeder if not run
            $categories = Category::all();
        }

        // 3. Create dummy courses
        Course::factory(10)->create([
            'user_id' => $instructor->id,
            'category_id' => $categories->random()->id,
            'is_published' => true,
        ]);

        // Create a specific, highly rated course
        $title = 'Mastering Laravel 12 & React with Inertia';
        $slug = Str::slug($title);

        // Check if the slug already exists, and append a unique identifier if necessary
        if (Course::where('slug', $slug)->exists()) {
            $slug = $slug . '-' . time(); // Append a timestamp to ensure uniqueness
        }

        Course::create([
            'user_id' => $instructor->id,
            'category_id' => $categories->where('name', 'Web Development')->first()?->id,
            'title' => $title,
            'slug' => $slug, // Use the unique slug here
            'description' => 'A comprehensive course on building modern full-stack applications using the Laravel 12 API backend and a React/Inertia frontend.',
            'learning_outcomes' => ['Build a full-stack app', 'Use Inertia forms', 'Implement TDD in Laravel'],
            'price' => 99.99,
            'is_published' => true,
            'thumbnail' => '/images/default-thumbnail.jpg',
            'preview_video_url' => 'https://www.youtube.com/embed/dQw4w9WgXcQ', // a placeholder URL
            'average_rating' => 4.8,
            'reviews_count' => 125,
        ]);
    }
}
