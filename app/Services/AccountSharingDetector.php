<?php

namespace App\Services;

use App\Models\ContentAccessLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Services\SuspicionEnforcer;

class AccountSharingDetector
{
    // --- Tunable thresholds ---
    private const WARNING_THRESHOLD = 70;
    private const ALERT_THRESHOLD   = 160;
    private const BAN_THRESHOLD     = 220;

    private const COOLDOWN_MINUTES = 5;

    public static function check(User $user): void
    {
        // Already banned or fully processed recently
        if ($user->banned_at) {
            return;
        }

        // Cooldown to prevent spamming updates
        if (
            $user->last_suspicious_at &&
            $user->last_suspicious_at->gt(now()->subMinutes(self::COOLDOWN_MINUTES))
        ) {
            return;
        }

        $scoreDelta = 0;

        // 1️⃣ Multiple IPs (short window)
        $ipCount = ContentAccessLog::where('user_id', $user->id)
            ->where('accessed_at', '>=', now()->subHours(2))
            ->distinct('ip_address')
            ->count('ip_address');

        if ($ipCount >= 4) {
            $scoreDelta += 30;
        }

        // 2️⃣ Parallel sessions (strong signal)
        $sessionCount = ContentAccessLog::where('user_id', $user->id)
            ->where('accessed_at', '>=', now()->subMinutes(10))
            ->whereNotNull('session_id')
            ->distinct('session_id')
            ->count('session_id');

        if ($sessionCount >= 2) {
            $scoreDelta += 40;
        }

        // 3️⃣ Device hopping
        $deviceCount = ContentAccessLog::where('user_id', $user->id)
            ->where('accessed_at', '>=', now()->subDay())
            ->whereNotNull('device_fingerprint')
            ->distinct('device_fingerprint')
            ->count('device_fingerprint');

        if ($deviceCount >= 3) {
            $scoreDelta += 30;
        }

        if ($scoreDelta === 0) {
            return;
        }

        // 4️⃣ Apply score (increment, don't cap here, let Enforcer handle it)
        $user->increment('suspicion_score', $scoreDelta);
        $user->last_suspicious_at = now();

        // 5️⃣ Soft warning
        if (
            $user->suspicion_score >= self::WARNING_THRESHOLD &&
            !$user->warned_at
        ) {
            $user->warned_at = now();
            Log::warning("SECURITY WARNING: User {$user->id} approaching block threshold. Score: {$user->suspicion_score}");
        }

        $user->save();

        // 6️⃣ Update behavioral risk score (decaying) - Production only
        if (app()->isProduction()) {
            app(RiskScoringService::class)->score($user);
        }

        // 7️⃣ Delegate enforcement to dedicated service
        SuspicionEnforcer::enforce($user);
    }

    /**
     * Hard block user + invalidate sessions
     */
    private static function hardBlock(User $user): void
    {
        $user->is_suspicious = true;

        // Kill all sessions
        DB::table('sessions')->where('user_id', $user->id)->delete();

        Log::critical("ACCOUNT BLOCKED: User {$user->id} flagged for account sharing.");
    }
}
