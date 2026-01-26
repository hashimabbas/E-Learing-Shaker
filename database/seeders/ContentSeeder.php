<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use App\Models\Video;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure essential users and categories exist
        $instructor = User::firstOrCreate(['email' => 'instructor@example.com'], ['name' => 'John Instructor', 'password' => 'password', 'role' => 'instructor']);
        $student = User::firstOrCreate(['email' => 'student@example.com'], ['name' => 'Sarah Student', 'password' => 'password', 'role' => 'student']);

        $this->call([
            CategorySeeder::class, // Ensure this runs first
            CourseSeeder::class,   // Ensure this runs first (creates 10-11 courses)
        ]);

        $courses = Course::all();
        $this->command->info('Starting content seeding for ' . $courses->count() . ' courses...');

        foreach ($courses as $course) {
            // Ensure the instructor is the correct owner
            $course->update(['user_id' => $instructor->id]);

            // Create 10 lessons for each course
            $lessons = Lesson::factory(10)->create(['course_id' => $course->id]);

            // Enroll the student in the course (required for testing progress tracking)
            $student->enrolledCourses()->attach($course->id, ['progress' => 0]);

            // Add content to each lesson
            foreach ($lessons as $index => $lesson) {
                if ($lesson->type === 'video') {
                    // Create a Video record (Category 4)
                    Video::create([
                        'lesson_id' => $lesson->id,
                        'path' => 'videos/mock-lesson-' . $lesson->id . '.mp4', // Placeholder path
                        'duration' => rand(300, 1800), // 5 to 30 minutes
                    ]);
                } elseif ($lesson->type === 'quiz') {
                    // Create a Quiz and Questions (Category 4)
                    $quiz = Quiz::factory()->create(['lesson_id' => $lesson->id]);
                    $lesson->update(['title' => 'Quiz: ' . $lesson->title]);

                    $questions = Question::factory(4)->create(['quiz_id' => $quiz->id]);

                    foreach ($questions as $question) {
                        // Create 4 answers, one of which is correct
                        $answers = Answer::factory(3)->create(['question_id' => $question->id, 'is_correct' => false]);
                        Answer::factory()->create(['question_id' => $question->id, 'is_correct' => true]);
                    }
                }
            }

            // Create 5 reviews for each course (Category 2)
            for ($i = 0; $i < 5; $i++) {
                Review::factory()->create([
                    'course_id' => $course->id,
                    // Ensure the reviewer is a unique student user
                    'user_id' => User::factory()->create(['role' => 'student'])->id,
                    'rating' => rand(3, 5),
                ]);
            }
        }
    }
}
