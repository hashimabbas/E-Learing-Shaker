<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class LocalizationMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Check for a language parameter in the session/cookie, default to 'ar'
        $locale = Session::get('locale', 'ar');

        // 2. Set the application locale
        App::setLocale($locale);

        // 3. Optional: Ensure the locale is in the session if not already there
        if (!Session::has('locale')) {
            Session::put('locale', $locale);
        }

        return $next($request);
    }
}
