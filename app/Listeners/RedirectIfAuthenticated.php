<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;

class RedirectIfAuthenticated
{
    /**
     * Handle the event.
     */
    public function handle(Login $event): RedirectResponse|null
    {
        $user = $event->user;
        $intendedUrl = session()->pull('url.intended');

        // Define the redirect destination based on role
        if ($user->isAdmin() && Route::has('admin.dashboard')) {
            $home = route('admin.dashboard');
        } elseif ($user->isInstructor() && Route::has('instructor.dashboard')) {
            $home = route('instructor.dashboard');
        } else {
            // Default: Student dashboard
            $home = '/my-learning';
        }

        // Fortify's default redirection logic will apply if we return null here.
        // We can force the redirect by setting the 'url.intended' session key.
        session()->put('url.intended', $home);

        return null; // Return null to let the default Fortify response handle the redirection
    }
}
