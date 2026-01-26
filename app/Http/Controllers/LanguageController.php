<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Illuminate\Routing\Controller;
use Illuminate\Http\RedirectResponse;

class LanguageController extends Controller
{
    /**
     * Set the application language in the session and redirect back.
     */
    public function switch(string $locale): RedirectResponse
    {
        // Optional: Validate the locale against allowed values (e.g., config('app.available_locales'))
        $allowedLocales = ['en', 'ar'];

        if (!in_array($locale, $allowedLocales)) {
            $locale = 'en'; // Default to a safe value
        }

        // Save the chosen locale to the session
        Session::put('locale', $locale);

        // This causes Inertia to reload the current page, which will then use
        // the LocalizationMiddleware to apply the new locale.
        return back();
    }
}
