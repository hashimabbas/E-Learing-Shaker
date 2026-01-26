<?php

namespace App\Services;

use App\Models\User;
use App\Models\ContentAccessLog;
use Carbon\Carbon;

class RiskScoringService
{
    public function score(User $user): int
    {
        if ($user->banned_at) {
            return 100;
        }

        $baseScore = max(
            (int) $user->risk_score,
            $this->calculateRawRisk($user)
        );

        $decayedScore = $this->applyDecay($user, $baseScore);

        // Persist score
        $user->update([
            'risk_score'   => $decayedScore,
            'last_risk_at' => $decayedScore > 0 ? now() : $user->last_risk_at,
        ]);

        return $decayedScore;
    }

    /**
     * Raw behavioral risk
     */
    protected function calculateRawRisk(User $user): int
    {
        $score = 0;

        $logs = ContentAccessLog::where('user_id', $user->id)
            ->where('accessed_at', '>=', now()->subMinutes(10))
            ->get();

        if ($logs->isEmpty()) {
            return 0;
        }

        if ($logs->pluck('ip_address')->unique()->count() > 1) {
            $score += 40;
        }

        if ($logs->pluck('device_fingerprint')->unique()->count() > 1) {
            $score += 30;
        }

        if ($logs->count() > 20) {
            $score += 20;
        }

        return min($score, 100);
    }

    /**
     * 🔽 Time-based decay
     */
    protected function applyDecay(User $user, int $newScore): int
    {
        if (!$user->last_risk_at) {
            return $newScore;
        }

        $minutesPassed = now()->diffInMinutes($user->last_risk_at);

        // −10 points every 10 minutes
        $decay = intdiv($minutesPassed, 10) * 10;

        return max($newScore - $decay, 0);
    }
}
