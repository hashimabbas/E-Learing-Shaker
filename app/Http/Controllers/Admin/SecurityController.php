<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContentAccessLog;
use App\Models\RiskEvent;
use App\Models\User;
use App\Services\RiskEventRecorder;
use Illuminate\Support\Facades\DB;
use App\Services\SessionRiskService;
use Illuminate\Support\Str;

class SecurityController extends Controller
{
    /**
     * Show User Security Profile
     */
    public function userDetail(User $user)
    {
        $ipStats = ContentAccessLog::where('user_id', $user->id)
            ->select('ip_address')
            ->selectRaw('count(*) as count')
            ->groupBy('ip_address')
            ->pluck('count', 'ip_address');

        $deviceStats = ContentAccessLog::where('user_id', $user->id)
            ->select('device_fingerprint')
            ->selectRaw('count(*) as count')
            ->groupBy('device_fingerprint')
            ->pluck('count', 'device_fingerprint');

        // Check for currently active concurrent sessions
        $concurrentSessions = DB::table('sessions')
            ->where('user_id', $user->id)
            ->get();

        return inertia('Admin/Security/UserDetail', [
            'user' => $user,
            'ipStats' => $ipStats,
            'deviceStats' => $deviceStats,
            'concurrentSessions' => $concurrentSessions,
        ]);
    }

    /**
     * List flagged users
     */
    public function flaggedUsers()
    {
        $users = User::query()
            ->where('suspicion_score', '>', 0)
            ->orWhere('is_suspicious', true)
            ->addSelect(['ip_count' => ContentAccessLog::selectRaw('count(distinct ip_address)')
                ->whereColumn('user_id', 'users.id')
            ])
            ->addSelect(['device_count' => ContentAccessLog::selectRaw('count(distinct device_fingerprint)')
                ->whereColumn('user_id', 'users.id')
            ])
            ->latest('updated_at')
            ->paginate(20);

        return inertia('Admin/Security/FlaggedUsers', [
            'users' => $users,
        ]);
    }

    /**
     * List grouped sessions
     */
    public function index()
    {
        $sessions = ContentAccessLog::query()
            ->select([
                'session_id',
                'user_id',
                'ip_address',
                'device_fingerprint',
                DB::raw('COUNT(*) as actions_count'),
                DB::raw('MIN(accessed_at) as first_seen'),
                DB::raw('MAX(accessed_at) as last_seen'),
            ])
            ->whereNotNull('session_id')
            ->groupBy('session_id', 'user_id', 'ip_address', 'device_fingerprint')
            ->latest('last_seen')
            ->paginate(20);

        $sessions->getCollection()->transform(function ($session) {
            $risk = \App\Services\SessionRiskService::calculate($session->session_id);

            $session->risk_score = $risk['score'];
            $session->risk_level = $risk['level'];

            return $session;
        });

        return inertia('Admin/Security/Index', [
            'sessions' => $sessions,
        ]);
    }

    /**
     * Drill-down for a single session
     */
    public function show(string $sessionId)
    {
        $logs = ContentAccessLog::query()
            ->where('session_id', $sessionId)
            ->orderBy('accessed_at')
            ->get();

        abort_if($logs->isEmpty(), 404);

        $userId = $logs->first()->user_id;

        $riskTimeline = RiskEvent::where('user_id', $userId)
            ->orderBy('created_at')
            ->get()
            ->map(fn ($e) => [
                'time'  => $e->created_at->toIso8601String(),
                'score' => $e->score,
                'reset' => $e->is_reset,
            ]);

        return inertia('Admin/Security/Show', [
            'sessionId' => $sessionId,
            'logs' => $logs,
            'summary' => [
                'user_id' => $userId,
                'ip_address' => $logs->first()->ip_address,
                'device_fingerprint' => $logs->first()->device_fingerprint,
                'first_seen' => $logs->first()->accessed_at,
                'last_seen' => $logs->last()->accessed_at,
            ],
            'riskTimeline' => $riskTimeline,
            'userId' => $userId,
        ]);
    }

    public function forceLogout(int $userId)
    {
        // 1️⃣ Delete all sessions for this user
        DB::table('sessions')
            ->where('user_id', $userId)
            ->delete();

        // 2️⃣ Kill remember-me tokens
        $user = User::findOrFail($userId);
        $user->forceFill([
            'remember_token' => Str::random(60),
        ])->save();

        // 3️⃣ Log admin action (optional but recommended)
        ContentAccessLog::create([
            'user_id' => $userId,
            'action' => 'admin.force_logout',
            'ip_address' => request()->ip(),
            'session_id' => null,
            'device_fingerprint' => null,
            'user_agent' => request()->userAgent(),
            'accessed_at' => now(),
        ]);

        return back()->with('success', 'User has been logged out from all devices.');
    }

    public function revokeSession(string $sessionId)
    {
        DB::table('sessions')
            ->where('id', $sessionId)
            ->delete();

        return back()->with('success', 'Session revoked.');
    }

    public function resetRisk(User $user)
    {
        // 🧹 Reset security flags
        $user->update([
            'risk_score'     => 0,
            'last_risk_at'   => null,
            'locked_until'   => null,
            'is_suspicious'  => false,
        ]);

        // 🚪 Optional: kill active sessions
        DB::table('sessions')
            ->where('user_id', $user->id)
            ->delete();

        // 📝 Audit log (recommended)
        activity('security')
            ->performedOn($user)
            ->causedBy(auth()->user())
            ->log('Admin reset risk score');

        RiskEventRecorder::record(
            $user,
            0,
            'low',
            'Admin reset',
            true // 👈 this creates the red vertical line
        );
        return back()->with('success', 'Risk score reset successfully.');
    }
}
