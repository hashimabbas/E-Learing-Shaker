<?php

namespace App\Http\Controllers;

use App\Mail\ContactSupportMail;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Mail; // For contact form
use Illuminate\Http\RedirectResponse;

class SupportController extends Controller
{
    /**
     * Display the FAQ page.
     */
    public function about()
    {
        return Inertia::render('About');
    }

    public function portfolio()
    {
        // Get all images from the Portfolio directory
        $portfolioPath = public_path('images/Portfolio');
        $images = [];

        if (is_dir($portfolioPath)) {
            $files = scandir($portfolioPath);
            foreach ($files as $file) {
                if ($file !== '.' && $file !== '..' && preg_match('/\.(jpg|jpeg|png|gif|webp)$/i', $file)) {
                    $images[] = [
                        'filename' => $file,
                        'path' => '/images/Portfolio/' . $file,
                    ];
                }
            }
        }

        return Inertia::render('Portfolio', [
            'images' => $images,
        ]);
    }

    public function privacy()
    {
        return Inertia::render('PrivacyPolicy');
    }

    public function terms()
    {
        return Inertia::render('TermsOfUse');
    }

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
