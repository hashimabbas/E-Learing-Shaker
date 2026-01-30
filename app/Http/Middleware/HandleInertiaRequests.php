<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Support\Facades\App; // <-- ENSURE THIS IS IMPORTED

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        $ziggy = class_exists(Ziggy::class) ? (new Ziggy)->toArray() : null;

        $user = $request->user();
        $translations = trans('app');  // Load all translations from lang/{locale}/app.php

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                // Only provide user and role data if $user is not null (i.e., user is logged in)
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role, // Safe now because of the $user check
                    'is_admin' => $user->isAdmin(), // Safe now
                    'is_instructor' => $user->isInstructor(), // Safe now
                    'is_student' => $user->isStudent(), // Safe now
                    'email_verified_at' => $user->email_verified_at, // Include this if needed
                ] : null,
            ],
            'ziggy' => $ziggy,
            'flash' => [ // Assuming you have flash messages
                'message' => fn () => $request->session()->get('message'),
                'error' => fn () => $request->session()->get('error'),
                'success' => fn () => $request->session()->get('success'),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',

            'locale' => fn () => app()->getLocale(),
            'translations' => $translations, // Share all translations
            'gateways' => [
                'thawani' => config('services.thawani.enabled'),
                'paypal' => true, // Assuming PayPal is always enabled for now
                'bank_transfer' => true,
            ],
            'notifications' => $user
                ? $user->unreadNotifications()->get(['id', 'data', 'created_at'])
                : [],
        ];
    }
}
