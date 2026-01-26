<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class DecaySuspicionScores extends Command
{
    protected $signature = 'security:decay-suspicion';
    protected $description = 'Decay suspicion scores for well-behaved users';

    public function handle()
    {
        User::where('suspicion_score', '>', 0)
            ->whereNotNull('last_suspicious_at')
            ->chunkById(100, function ($users) {

                foreach ($users as $user) {
                    $hours = now()->diffInHours($user->last_suspicious_at);

                    if ($hours >= 72) {
                        $user->decrement('suspicion_score', 30);
                    } elseif ($hours >= 24) {
                        $user->decrement('suspicion_score', 10);
                    }

                    // Floor at zero
                    if ($user->suspicion_score <= 0) {
                        $user->clearSuspicion();
                    }

                    // Auto-unflag
                    if ($user->suspicion_score < 50) {
                        $user->update(['is_suspicious' => false]);
                    }
                }
            });

        $this->info('Suspicion scores decayed successfully.');
    }
}
