<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\AccountSharingDetector;

class DetectAccountSharing
{
    public function handle(Request $request, Closure $next)
    {
        if (
            auth()->check()
            && !app()->isLocal() // 🔕 disabled on localhost
        ) {
            AccountSharingDetector::check(auth()->user());
        }

        return $next($request);
    }
}
