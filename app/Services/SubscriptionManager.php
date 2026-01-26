<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;

class SubscriptionManager
{
    protected $thawaniService;

    public function __construct(ThawaniService $thawaniService)
    {
        $this->thawaniService = $thawaniService;
    }

    /**
     * Initiates the payment process for a new subscription.
     * @param User $user The subscribing user.
     * @param string $planId The ID of the Thawani subscription plan.
     * @return RedirectResponse Redirects the user to the Thawani payment page.
     */
    public function subscribe(User $user, string $planId): RedirectResponse
    {
        // 1. Get the price/details of the plan (Mock)
        $planDetails = $this->getThawaniPlanDetails($planId);
        if (!$planDetails) {
            return back()->with('error', 'Subscription plan not found.');
        }

        // 2. Prepare the payload for Thawani Subscription API
        $payload = [
            'client_reference_id' => 'SUB-' . $user->id . '-' . time(),
            // Thawani's API for subscriptions requires specific fields:
            // - plan_id (The recurring charge plan ID)
            // - metadata, success_url, cancel_url (Same as one-time purchase)
            // - amount, currency (often part of the plan details)
            'items' => [/* recurring plan item */],
            'success_url' => route('subscription.success', ['plan' => $planId, 'user' => $user->id]),
            'cancel_url' => route('subscription.cancel.view'),
            // ...
        ];

        // 3. Mock/Call Thawani to create a RECURRING checkout session
        // NOTE: This call is different from the one-time purchase session API
        $sessionData = $this->thawaniService->createSubscriptionSession($payload);

        if (!$sessionData || !$sessionData['success']) {
             return back()->with('error', 'Could not start subscription checkout.');
        }

        // 4. Create a temporary 'pending' subscription record (optional)

        // 5. Redirect
        return redirect()->away($sessionData['redirect_url']);
    }

    /**
     * Handles the webhook/success callback from Thawani after a *successful* recurring payment.
     * @param string $thawaniSubscriptionId The subscription ID from Thawani.
     * @param string $planId The plan ID.
     * @param User $user The user.
     */
    public function handleSuccess(string $thawaniSubscriptionId, string $planId, User $user): void
    {
        // 1. Verify the payment via Thawani API (Crucial)
        if (!$this->thawaniService->verifySubscriptionStatus($thawaniSubscriptionId)) {
            Log::error("Failed to verify Thawani subscription status.", ['sub_id' => $thawaniSubscriptionId]);
            return;
        }

        // 2. Provision Access (Create/Update Subscription Record)
        $user->subscriptions()->updateOrCreate(
            ['thawani_plan_id' => $planId], // Match existing by plan ID
            [
                'name' => $planId === 'pro_plan' ? 'Pro Plan' : 'Basic Plan',
                'status' => 'active',
                'renews_at' => now()->addMonth(), // Based on the plan's billing cycle
            ]
        );

        // 3. Grant access to subscription-only courses/content (e.g., set user property)
        $user->is_subscribed = true;
        $user->save();

        // 4. Send welcome email, etc.
        Log::info("User {$user->id} successfully subscribed to {$planId}.");
    }

    // Mock helper for Plan Details
    private function getThawaniPlanDetails(string $planId): array|null {
        return ['price' => 5.99, 'name' => 'Pro Plan'];
    }
}
