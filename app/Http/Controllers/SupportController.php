<?php

namespace App\Http\Controllers;

use App\Mail\ContactSupportMail;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Mail; // For contact form

class SupportController extends Controller
{
    /**
     * Display the FAQ page.
     */
    public function faq(): Response
    {
        $faqs = Faq::orderBy('category')->orderBy('order')->get()->groupBy('category');

        return Inertia::render('Support/FAQ', [
            'faqs' => $faqs,
        ]);
    }

    /**
     * Display the Contact Support page.
     */
    public function contact(): Response
    {
        return Inertia::render('Support/Contact');
    }

    /**
     * Handle the submission of the Contact Support form.
     */
    public function submitContact(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'email' => ['required', 'email'],
            // Add CAPTCHA/honeypot for production environment
        ]);

        // 1. Send the email to the platform admin/support team
        // This requires a Mailable class (e.g., new ContactSupportMail($validated))
        // Mail::to(config('mail.support_address'))->send(new ContactSupportMail($validated));
        Mail::to(config('mail.support_address', env('MAIL_FROM_ADDRESS')))->send(new ContactSupportMail($validated));
        // 2. Log the request or save to a tickets table (optional)

        return redirect()->back()->with('success', 'Your message has been sent to our support team. We will respond to your query shortly!');
    }
}
