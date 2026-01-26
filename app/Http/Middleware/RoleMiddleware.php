<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (! $request->user()) {
            // User is not authenticated
            abort(401, 'Unauthenticated.');
        }

        // Check for specific roles
        if ($role === 'admin' && ! $request->user()->isAdmin()) {
            abort(403, 'Unauthorized. Admins only.');
        }

        if ($role === 'instructor' && ! $request->user()->isInstructor()) {
            abort(403, 'Unauthorized. Instructors only.');
        }

        if ($role === 'student' && ! $request->user()->isStudent()) {
            abort(403, 'Unauthorized. Students only.');
        }

        // You could also accept multiple roles: `string $roles` and explode it
        // $requiredRoles = explode('|', $role);
        // if (! $request->user()->hasAnyRole($requiredRoles)) { ... }
        // (This would require a `hasAnyRole` method on your User model)

        return $next($request);
    }
}
