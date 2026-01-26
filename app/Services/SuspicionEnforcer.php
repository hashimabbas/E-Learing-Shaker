<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class SuspicionEnforcer
{
    public static function enforce(User $user): void
    {
        if ($user->banned_at) {
            return;
        }

        if ($user->suspicion_score >= 220) {
            $user->update([
                'banned_at' => now(),
                'admin_notes' => ($user->admin_notes ? $user->admin_notes . "\n" : "") . 'Auto-ban: extreme account sharing detected (Score: ' . $user->suspicion_score . ').',
            ]);
            
            // Kill all sessions
            DB::table('sessions')->where('user_id', $user->id)->delete();
            
            Log::critical("SECURITY ENFORCEMENT: User {$user->id} permanently banned. Score: {$user->suspicion_score}");
            return;
        }

        if ($user->suspicion_score >= 160) {
            if (!$user->is_suspicious) {
                $user->update([
                    'is_suspicious' => true,
                    'admin_notes' => ($user->admin_notes ? $user->admin_notes . "\n" : "") . 'Flagged for admin review (high suspicion score: ' . $user->suspicion_score . ').',
                ]);
                Log::warning("SECURITY ENFORCEMENT: User {$user->id} flagged for review. Score: {$user->suspicion_score}");
            }
            return;
        }

        if ($user->suspicion_score >= 100) {
            if (!$user->locked_until || $user->locked_until->isPast()) {
                $user->update([
                    'locked_until' => now()->addHours(24),
                    'admin_notes' => ($user->admin_notes ? $user->admin_notes . "\n" : "") . 'Temporary lock: 24h cooldown after reaching score 100.',
                ]);
                Log::info("SECURITY ENFORCEMENT: User {$user->id} temporarily locked. Score: {$user->suspicion_score}");
            }
        }
    }
}
