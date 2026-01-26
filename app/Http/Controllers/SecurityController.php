<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SecurityController extends Controller
{
    public function index()
    {
        $users = User::query()
            ->where('suspicion_score', '>=', 50)
            ->withCount([
                'accessLogs as ip_count' => function ($q) {
                    $q->distinct('ip_address');
                },
                'accessLogs as device_count' => function ($q) {
                    $q->distinct('device_fingerprint');
                },
            ])
            ->latest('suspicion_score')
            ->paginate(20);

        return Inertia::render('Admin/Security/FlaggedUsers', [
            'users' => $users,
        ]);
    }

    public function show(User $user)
    {
        $logs = $user->accessLogs()
            ->latest('accessed_at')
            ->limit(300)
            ->get();

        return Inertia::render('Admin/Security/Show', [
            'user' => $user,
            'grouped' => [
                'by_ip' => $logs->groupBy('ip_address')->map(fn ($g) => [
                    'count' => $g->count(),
                    'last_seen' => $g->first()->accessed_at,
                    'devices' => $g->pluck('device_fingerprint')->unique()->count(),
                ]),
                'by_device' => $logs->groupBy('device_fingerprint')->map(fn ($g) => [
                    'count' => $g->count(),
                    'last_seen' => $g->first()->accessed_at,
                    'ips' => $g->pluck('ip_address')->unique()->count(),
                ]),
                'timeline' => $logs->groupBy(fn ($l) =>
                    $l->accessed_at->format('Y-m-d H:i')
                )->map->count(),
            ],
            'logs' => $logs,
        ]);
    }


    public function unflag(User $user)
    {
        $user->update([
            'suspicion_score' => 0,
            'is_suspicious' => false,
            'warned_at' => null,
        ]);

        return back()->with('success', 'User unflagged successfully.');
    }

    public function forceLogout(User $user)
    {
        DB::table('sessions')->where('user_id', $user->id)->delete();

        return back()->with('success', 'User has been logged out from all sessions.');
    }
}
