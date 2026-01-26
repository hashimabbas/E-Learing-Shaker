<?php

namespace App\Providers;

use App\Listeners\LoginMonitorListener;
use App\Listeners\RedirectIfAuthenticated;
use App\Models\Course;        // Import the Course model
use App\Models\Discussion;
use App\Policies\CoursePolicy; // Import the CoursePolicy
use App\Policies\DiscussionPolicy;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Course::class, CoursePolicy::class);
        Gate::policy(Discussion::class, DiscussionPolicy::class);
        Event::listen(
            Login::class,
            RedirectIfAuthenticated::class, // Bind Login event to your listener
            LoginMonitorListener::class,
        );
    }
}
