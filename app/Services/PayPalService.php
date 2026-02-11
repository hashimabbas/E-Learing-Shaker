<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class PayPalService
{
    protected $baseUrl;
    protected $clientId;
    protected $clientSecret;

    public function __construct()
    {
        $this->clientId = config('services.paypal.client_id');
        $this->clientSecret = config('services.paypal.secret');
        $this->baseUrl = config('services.paypal.mode') === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    /**
     * Get Access Token
     */
    protected function getAccessToken()
    {
        $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->asForm()
            ->post("{$this->baseUrl}/v1/oauth2/token", [
                'grant_type' => 'client_credentials',
            ]);

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        Log::error('PayPal Authentication Failed', [
            'status' => $response->status(),
            'body' => $response->body()
        ]);

        throw new Exception('PayPal Authentication Failed: ' . $response->body());
    }

    /**
     * Create Order
     */
    public function createOrder($order)
    {
        $accessToken = $this->getAccessToken();

        $response = Http::withToken($accessToken)
            ->post("{$this->baseUrl}/v2/checkout/orders", [
                'intent' => 'CAPTURE',
                'purchase_units' => [
                    [
                        'reference_id' => $order->order_number,
                        'custom_id' => $order->order_number,
                        'amount' => [
                            'currency_code' => $order->currency ?? 'USD',
                            'value' => number_format($order->total_amount, 2, '.', ''),
                        ],
                    ],
                ],
                'application_context' => [
                    'return_url' => route('payment.paypal.return'),
                    'cancel_url' => route('payment.paypal.cancel'),
                    'brand_name' => config('app.name'),
                    'user_action' => 'PAY_NOW',
                ],
            ]);

        if ($response->successful()) {
            Log::info('PayPal Order Created', [
                'order_number' => $order->order_number,
                'paypal_order_id' => $response->json()['id'] ?? 'N/A'
            ]);
            return $response->json();
        }

        Log::error('PayPal Create Order Failed', [
            'order_number' => $order->order_number,
            'status' => $response->status(),
            'body' => $response->body()
        ]);

        throw new Exception('PayPal Create Order Failed: ' . $response->body());
    }

    /**
     * Capture Order
     */
    public function captureOrder($paypalOrderId)
    {
        $accessToken = $this->getAccessToken();

        $response = Http::withToken($accessToken)
            ->withHeaders([
                'Content-Type' => 'application/json',
                'PayPal-Request-Id' => uniqid(),
            ])
            ->post("{$this->baseUrl}/v2/checkout/orders/{$paypalOrderId}/capture", (object)[]);

        if ($response->successful()) {
            Log::info('PayPal Order Captured Successfully', [
                'paypal_order_id' => $paypalOrderId,
                'response' => $response->json()
            ]);
            return $response->json();
        }

        Log::error('PayPal Capture Failed', [
            'paypal_order_id' => $paypalOrderId,
            'status' => $response->status(),
            'body' => $response->body()
        ]);

        throw new Exception('PayPal Capture Failed: ' . $response->body());
    }
}
