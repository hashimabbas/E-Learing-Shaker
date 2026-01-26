<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class BlockSuspiciousUsers
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        // 🚧 Skip enforcement in local & testing
        if (! app()->isProduction()) {
            return $next($request);
        }

        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        if ($user->locked_until && now()->lessThan($user->locked_until)) {
            abort(429, 'Your account is temporarily locked due to suspicious activity.');
        }

        if ($user->is_suspicious) {
            abort(403, 'Your account has been flagged for suspicious activity.');
        }

        if ($user->banned_at) {
            abort(403, 'Your account has been permanently banned.');
        }

        return $next($request);
    }


}
