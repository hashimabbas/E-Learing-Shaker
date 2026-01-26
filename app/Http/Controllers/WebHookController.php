<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

class WebHookController extends Controller
{
    /**
     * Handle incoming webhooks from Thawani (e.g., successful subscription payment, failure, renewal).
     */
    public function handleSubscription(Request $request): Response
    {
        // 1. Webhook Signature Verification (CRITICAL SECURITY STEP)
        // Thawani sends a unique signature/secret in the request header.
        // You MUST compare this to your stored THAWANI_WEBHOOK_SECRET to confirm
        // the request is genuinely from Thawani and not a malicious third party.
        $signature = $request->header('Thawani-Signature');
        $secret = config('services.thawani.webhook_secret');

        // This is a placeholder check. The real logic involves HMAC hashing of the payload.
        if (!$signature || $signature !== $secret) {
            Log::error("Thawani Webhook: Signature Mismatch/Missing.", ['ip' => $request->ip()]);
            return response('Unauthorized.', 403);
        }

        // 2. Process the Event Payload
        $payload = $request->json()->all();
        $eventType = $payload['event_type'] ?? null; // e.g., 'subscription.created', 'subscription.renewal_success'

        if ($eventType === 'subscription.renewal_success') {
            // Retrieve user/subscription based on metadata sent during checkout initiation
            $userId = $payload['metadata']['user_id'] ?? null;
            $user = User::find($userId);

            if ($user) {
                // Logic to update the user's subscription record (e.g., extend renews_at date)
                $user->subscriptions()->update(['status' => 'active', 'renews_at' => now()->addMonth()]);
                Log::info("Subscription Renewal Success for User: {$userId}");
            }
        }

        // ... handle subscription.creation (first payment) and subscription.failed events ...

        return response('Webhook Handled', 200);
    }
}
