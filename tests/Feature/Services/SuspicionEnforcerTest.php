<?php

namespace Tests\Feature\Services;

use App\Models\User;
use App\Services\SuspicionEnforcer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class SuspicionEnforcerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_bans_user_with_score_greater_than_or_equal_to_220()
    {
        Log::shouldReceive('critical')
            ->once()
            ->withArgs(fn($message) => str_contains($message, 'SECURITY ENFORCEMENT: User'));

        $user = User::factory()->create([
            'suspicion_score' => 220,
            'admin_notes' => 'Existing note.',
        ]);

        // Mock sessions
        DB::table('sessions')->insert([
            'id' => 'session1',
            'user_id' => $user->id,
            'ip_address' => '127.0.0.1',
            'user_agent' => 'test',
            'payload' => 'payload',
            'last_activity' => time(),
        ]);

        SuspicionEnforcer::enforce($user);

        $user->refresh();

        $this->assertNotNull($user->banned_at);
        $this->assertStringContainsString('Auto-ban: extreme account sharing detected', $user->admin_notes);
        $this->assertStringContainsString('Existing note.', $user->admin_notes);
        $this->assertDatabaseMissing('sessions', ['user_id' => $user->id]);
    }

    public function test_it_flags_user_with_score_greater_than_or_equal_to_160()
    {
        Log::shouldReceive('warning')
            ->once()
            ->withArgs(fn($message) => str_contains($message, 'SECURITY ENFORCEMENT: User'));

        $user = User::factory()->create([
            'suspicion_score' => 160,
            'is_suspicious' => false,
        ]);

        SuspicionEnforcer::enforce($user);

        $user->refresh();

        $this->assertTrue($user->is_suspicious);
        $this->assertStringContainsString('Flagged for admin review', $user->admin_notes);
    }

    public function test_it_locks_user_with_score_greater_than_or_equal_to_100()
    {
        Log::shouldReceive('info')
            ->once()
            ->withArgs(fn($message) => str_contains($message, 'SECURITY ENFORCEMENT: User'));

        $user = User::factory()->create([
            'suspicion_score' => 100,
            'locked_until' => null,
        ]);

        SuspicionEnforcer::enforce($user);

        $user->refresh();

        $this->assertNotNull($user->locked_until);
        $this->assertTrue($user->locked_until->isFuture());
        $this->assertStringContainsString('Temporary lock: 24h cooldown', $user->admin_notes);
    }

    public function test_it_does_not_reset_existing_active_lock()
    {
        Log::shouldReceive('info')->never();

        $futureDate = now()->addHours(48);
        $user = User::factory()->create([
            'suspicion_score' => 100,
            'locked_until' => $futureDate,
        ]);

        SuspicionEnforcer::enforce($user);

        $user->refresh();

        // Use a small margin for comparison if needed, but here it should be exactly the same
        $this->assertEquals($futureDate->toDateTimeString(), $user->locked_until->toDateTimeString());
    }

    public function test_it_does_nothing_for_low_scores()
    {
        Log::shouldReceive('critical')->never();
        Log::shouldReceive('warning')->never();
        Log::shouldReceive('info')->never();

        $user = User::factory()->create([
            'suspicion_score' => 50,
        ]);

        SuspicionEnforcer::enforce($user);

        $user->refresh();

        $this->assertNull($user->banned_at);
        $this->assertFalse($user->is_suspicious);
        $this->assertNull($user->locked_until);
    }

    public function test_it_returns_early_if_already_banned()
    {
        Log::shouldReceive('critical')->never();

        $user = User::factory()->create([
            'banned_at' => now()->subDay(),
            'suspicion_score' => 250,
        ]);

        SuspicionEnforcer::enforce($user);

        // No changes should happen
        $this->assertEquals(250, $user->suspicion_score);
    }
}
