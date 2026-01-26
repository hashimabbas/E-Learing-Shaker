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
        // 1. Check for a language parameter in the session/cookie
        $locale = Session::get('locale', config('app.locale', 'en'));

        // 2. Set the application locale
        App::setLocale($locale);

        return $next($request);
    }
}
