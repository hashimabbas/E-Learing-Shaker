<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Routing\Controller;
use Illuminate\Http\RedirectResponse;
use App\Services\SubscriptionManager;

class SubscriptionController extends Controller
{
    public function __construct(SubscriptionManager $subscriptionManager)
    {
        $this->middleware('auth');
        $this->subscriptionManager = $subscriptionManager;
    }

    /**
     * Display the user's active subscription management page.
     */
    public function index(Request $request): Response
    {
        $subscription = $request->user()->subscriptions()->latest()->first();

        return Inertia::render('Settings/Subscription', [
            'subscription' => $subscription,
        ]);
    }

    /**
     * Handles the cancellation of an active subscription.
     */
    public function cancel(Subscription $subscription): RedirectResponse
    {
        // 1. Authorization: Ensure the user owns the subscription
        if ($subscription->user_id !== auth()->id()) {
            abort(403);
        }

        // 2. Gateway Interaction (Mock):
        // In a real app, you call Thawani/Cashier/Stripe to cancel the recurring charge.
        // ThawaniService::cancelSubscription($subscription->thawani_plan_id);

        // 3. Update local database record
        $subscription->update([
            'status' => 'cancelled',
            'ends_at' => $subscription->renews_at, // Access remains until the renewal date
        ]);

        return redirect()->back()->with('success', 'Your subscription has been successfully cancelled and will remain active until ' . $subscription->ends_at->format('M d, Y') . '.');
    }

    /**
     * Initiate the checkout for a specific subscription plan.
     */
    public function initiateCheckout(Request $request, string $planId): RedirectResponse
    {
        // Add validation to ensure $planId is valid
        $request->validate(['planId' => 'required']);

        return $this->subscriptionManager->subscribe($request->user(), $planId);
    }

    /**
     * Handles the success redirect from Thawani.
     */
    public function successCallback(Request $request, string $planId): RedirectResponse
    {
        $thawaniSubscriptionId = $request->input('thawani_sub_id'); // Assume Thawani returns this

        // Find user by session/metadata if possible, otherwise rely on the 'auth'
        $user = $request->user();

        // Crucial: Use a background job/webhook to handle the full verification (avoiding timeouts)
        // For now, we will call the manager directly.
        $this->subscriptionManager->handleSuccess($thawaniSubscriptionId, $planId, $user);

        return redirect()->route('subscription.index')->with('success', 'Subscription activated! Welcome to the Pro Plan.');
    }
}
