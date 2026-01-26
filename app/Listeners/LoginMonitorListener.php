<?php

namespace App\Listeners;

use App\Services\RiskEventRecorder;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LoginMonitorListener
{
    protected $request;

    // Inject the current request to get the IP address
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        $user = $event->user;
        $currentIp = $this->request->ip();
        $previousIp = $user->last_login_ip;

        $riskIncrease = 0;
        $reason = null;
        // --- 1. Check for Impossible Travel (The main deterrent logic) ---
        if ($previousIp && $previousIp !== $currentIp) {
            // In a production environment, you would use a GEO-IP API
            // (e.g., ipdata.co) to check the distance between the two IPs.
            $riskIncrease += 30;
            $reason = 'ip_change';
            // For now, we will use a simple proxy detection and log.
            $isProxyLogin = $this->request->header('X-Forwarded-For') !== null;

            if ($isProxyLogin) {
                 $user->is_suspicious = true;
                 Log::warning("SECURITY ALERT: User {$user->email} logged in via suspected proxy/VPN.");

                 // You could add logic here to redirect the user to a verification page
                 // or send a warning email to the user's primary address.
            }

            // Log the IP change for admin review
            Log::info("User {$user->email} logged in from a new IP address. Previous: {$previousIp}, Current: {$currentIp}");
        }

        if ($riskIncrease > 0) {
            $user->increment('risk_score', $riskIncrease);

            $level = match (true) {
                $user->risk_score >= 70 => 'high',
                $user->risk_score >= 30 => 'medium',
                default => 'low',
            };

            RiskEventRecorder::record(
                $user,
                $user->risk_score,
                $level,
                $reason
            );

            $user->update([
                'is_suspicious' => $user->risk_score >= 70,
                'last_suspicious_at' => now(),
            ]);
        }
        // --- 2. Update the tracking columns ---
        $user->forceFill([
            'last_login_ip' => $currentIp,
            'last_login_at' => now(),
        ])->save();
    }
}
