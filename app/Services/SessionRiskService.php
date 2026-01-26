<?php

namespace App\Services;

use App\Models\ContentAccessLog;
use Illuminate\Support\Facades\DB;

class SessionRiskService
{
    public static function calculate(string $sessionId): array
    {
        $logs = ContentAccessLog::where('session_id', $sessionId)->get();

        if ($logs->isEmpty()) {
            return ['score' => 0, 'level' => 'low'];
        }

        $score = 0;
        $userId = $logs->first()->user_id;

        // 1️⃣ Multiple IPs in same session
        if ($logs->pluck('ip_address')->unique()->count() > 1) {
            $score += 30;
        }

        // 2️⃣ Same IP used by other users
        $sharedIpCount = ContentAccessLog::whereIn(
            'ip_address',
            $logs->pluck('ip_address')->unique()
        )
            ->where('user_id', '!=', $userId)
            ->distinct('user_id')
            ->count();

        if ($sharedIpCount > 0) {
            $score += 40;
        }

        // 3️⃣ Burst activity (same minute)
        $burst = $logs
            ->groupBy(fn ($l) => $l->accessed_at->format('Y-m-d H:i'))
            ->filter(fn ($g) => $g->count() > 3)
            ->count();

        if ($burst > 0) {
            $score += 20;
        }

        // 4️⃣ Large number of actions
        if ($logs->count() > 30) {
            $score += 20;
        }

        // 5️⃣ Login spam
        if ($logs->where('action', 'login')->count() > 2) {
            $score += 10;
        }

        $ips = $logs->pluck('ip_address')->unique();
        if ($ips->count() === 1 && in_array($ips->first(), ['127.0.0.1', '::1'])) {
            return [
                'score' => 0,
                'level' => 'low',
            ];
        }
        return [
            'score' => $score,
            'level' => match (true) {
                $score >= 60 => 'high',
                $score >= 30 => 'medium',
                default => 'low',
            },
        ];
    }
}
