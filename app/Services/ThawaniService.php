<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str; // Import Str

class ThawaniService
{
    private $baseUrl;
    private $secretKey;
    private $publishableKey;

    public function __construct()
    {
        $this->baseUrl = config('services.thawani.url');
        $this->secretKey = config('services.thawani.secret_key');
        $this->publishableKey = config('services.thawani.publishable_key');

        if (!$this->secretKey || !$this->baseUrl) {
             throw new \Exception("Thawani service is not configured.");
        }
    }

      public function createCheckoutSession(Order $order): ?array
    {
        // 1. Prepare products array
        $products = $order->items->map(fn($item) => [
            // FIX: Truncate name to 40 chars maximum to satisfy Thawani API
            // The third argument '' removes the default '...' so we maximize readable text
            'name' => Str::limit($item->name, 40, ''),

            'quantity' => $item->quantity,
            'unit_amount' => (int) round($item->price * 1000),
        ])->toArray();

        // 2. Endpoint
        $endpoint = "{$this->baseUrl}/api/v1/checkout/session";

        // 3. Payload
        $payload = [
            'client_reference_id' => $order->order_number,
            'products' => $products,
            'success_url' => route('payment.success', ['order' => $order->order_number], absolute: true),
            'cancel_url' => route('payment.cancel', ['order' => $order->order_number], absolute: true),
            'metadata' => [
                'order_id' => $order->id,
                'user_id' => $order->user_id,
            ],
        ];

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'thawani-api-key' => $this->secretKey,
            ])->post($endpoint, $payload);

            if ($response->failed()) {
                Log::error("Thawani HTTP Request Failed", [
                    'order' => $order->order_number,
                    'status_code' => $response->status(),
                    'body' => $response->json(),
                    'payload' => $payload,
                ]);
                return null;
            }

            $data = $response->json();

            if ($data['success'] === true) {
                $session = $data['data'];
                return [
                    'success' => true,
                    'session_id' => $session['session_id'],
                    'redirect_url' => "{$this->baseUrl}/pay/{$session['session_id']}?key={$this->publishableKey}",
                ];
            }

            Log::error("Thawani API Logic Failure", ['response' => $data]);
            return null;

        } catch (\Throwable $e) {
            Log::error("Thawani API Exception: " . $e->getMessage());
            return null;
        }
    }

    public function verifySessionStatus(string $sessionId): bool
    {
        // Verification endpoint is also singular usually, but check your specific docs.
        // Usually: GET /api/v1/checkout/session/{session_id}
        $endpoint = "{$this->baseUrl}/api/v1/checkout/session/{$sessionId}";

        try {
            $response = Http::withHeaders([
                'thawani-api-key' => $this->secretKey,
            ])->get($endpoint);

            $data = $response->json();

            if ($response->successful() && isset($data['data'])) {
                $status = $data['data']['payment_status'] ?? '';
                return $status === 'paid';
            }

            return false;

        } catch (\Throwable $e) {
            Log::error("Thawani Verification Exception: " . $e->getMessage());
            return false;
        }
    }
}
