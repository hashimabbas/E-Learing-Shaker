<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\Lesson;
use App\Models\User;
use App\Models\Video;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SecureVideoControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $course;
    protected $lesson;
    protected $videoPath = 'courses/1/lessons/1/test.mp4';

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->course = Course::factory()->create(['user_id' => $this->user->id]);
        $this->lesson = Lesson::factory()->create(['course_id' => $this->course->id, 'type' => 'video']);
        
        Storage::disk('local')->put($this->videoPath, 'fake video content');
        
        Video::create([
            'lesson_id' => $this->lesson->id,
            'path' => $this->videoPath,
            'duration' => 100
        ]);

        $this->user->enrolledCourses()->attach($this->course->id);
    }

    public function test_stream_returns_optimized_php_response()
    {
        config(['services.video.streaming_method' => 'php']);

        $response = $this->actingAs($this->user)->get(route('secure.video', $this->lesson));

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'video/mp4');
    }

    public function test_stream_returns_x_sendfile_response()
    {
        config(['services.video.streaming_method' => 'x-sendfile']);

        $response = $this->actingAs($this->user)->get(route('secure.video', $this->lesson));

        $response->assertStatus(200);
        $response->assertHeader('X-Sendfile');
    }

    public function test_stream_handles_range_requests()
    {
        config(['services.video.streaming_method' => 'php']);

        $response = $this->actingAs($this->user)->get(route('secure.video', $this->lesson), [
            'Range' => 'bytes=0-5'
        ]);

        $response->assertStatus(206);
        $response->assertHeader('Content-Range', 'bytes 0-5/' . strlen('fake video content'));
    }
}
