<?php

namespace App\Services;

use App\Models\RiskEvent;
use App\Models\User;

class RiskEventRecorder
{
    public static function record(
        User $user,
        int $score,
        string $level,
        ?string $reason = null,
        bool $reset = false
    ): void {
        RiskEvent::create([
            'user_id' => $user->id,
            'score'   => $score,
            'level'   => $level,
            'is_reset'=> $reset,
            'reason'  => $reason,
        ]);
    }
}
