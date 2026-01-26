<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmationMail;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\ThawaniService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Mail;
use App\Notifications\NewPurchaseNotification; // NEW USE
use App\Models\User; // NEW USE

class PaymentController extends Controller
{
    protected $thawaniService;

    public function __construct(ThawaniService $thawaniService)
    {
        $this->middleware('auth');
        $this->thawaniService = $thawaniService;
    }

    /**
     * Step 1: Converts the user's cart into a PENDING order and initiates payment.
     */
       public function initiatePayment(Request $request): \Symfony\Component\HttpFoundation\Response
        {
            $user = $request->user();
            $cart = Cart::with('items.course')->where('user_id', $user->id)->first();

            if (!$cart || $cart->items->isEmpty()) {
                return redirect()->route('cart.index')->with('error', 'Your cart is empty.');
            }

            $order = null;

            try {
                DB::beginTransaction();

                // ... (Order creation logic remains the same) ...
                $totalAmount = $cart->items->sum(fn($item) => $item->price_at_purchase * $item->quantity);

                $order = Order::create([
                    'user_id' => $user->id,
                    'total_amount' => $totalAmount,
                    'status' => 'pending',
                    'payment_method' => 'Thawani',
                ]);

                // ... (OrderItem creation remains the same) ...
                foreach ($cart->items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'course_id' => $item->course_id,
                        'name' => $item->course->title,
                        'price' => $item->price_at_purchase,
                        'quantity' => $item->quantity,
                    ]);
                }

                // ... (Thawani Service call) ...
                $sessionData = $this->thawaniService->createCheckoutSession($order);

                if (!$sessionData || !$sessionData['success']) {
                    DB::rollBack();
                    return redirect()->route('cart.index')->with('error', 'Payment initiation failed.');
                }

                $order->update([
                    'thawani_session_id' => $sessionData['session_id'],
                ]);

                $cart->items()->delete();

                DB::commit();

                // This returns a generic Response, not a RedirectResponse
                return Inertia::location($sessionData['redirect_url']);

            } catch (Exception $e) {
                DB::rollBack();
                return redirect()->route('cart.index')->with('error', 'An unexpected error occurred.');
            }
        }
    /**
     * Step 2: Handles the callback after successful payment from Thawani.
     */
    public function paymentSuccess(string $orderNumber): RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        // 1. Verify Payment Status (Crucial for security)
        // In a real application, you'd rely primarily on a THAWANI WEBHOOK
        // Here we'll call the mock verify service, but this is less secure than a webhook.
        $isPaid = $this->thawaniService->verifySessionStatus($order->thawani_session_id);

        if ($isPaid && $order->status !== 'paid') {
            // 2. Finalize the Order
            $order->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            // 3. Grant Access to Courses (Enrollment)
            foreach ($order->items as $item) {
                // Attach user to course in the `course_user` pivot table
                $order->user->enrolledCourses()->syncWithoutDetaching([
                    $item->course_id => [
                        'progress' => 0,
                    ]
                ]);
            }

            // --- NEW: NOTIFY ADMIN OF PURCHASE (FINAL FIX) ---
            // Find all users with the 'admin' role
            $admins = User::where('role', 'admin')->get();
            \Illuminate\Support\Facades\Notification::send($admins, new NewPurchaseNotification($order));
            // ----------------------------------------------------

            // 4. Send Confirmation Email (Category 3 requirement)
            // Mail::to($order->user)->send(new OrderConfirmationMail($order));
            Mail::to($order->user->email)->send(new OrderConfirmationMail($order));
            return redirect()->route('orders.show', $order->order_number)->with('success', 'Payment successful! You have been enrolled in your new courses.');
        }

        // If verification fails or status is not as expected
        return redirect()->route('orders.show', $order->order_number)->with('error', 'Payment status could not be confirmed. Please contact support.');
    }

    /**
     * Step 2: Handles the callback after a failed or cancelled payment.
     */
    public function paymentCancel(string $orderNumber): RedirectResponse
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        if ($order->status === 'pending') {
             // You can update the status to 'failed' or keep it 'pending'
             $order->update(['status' => 'failed']);
        }

        return redirect()->route('cart.index')->with('message', 'Payment was cancelled or failed. You can try again from your cart.');
    }

    /**
     * Display a single order after a purchase.
     */
    public function show(string $orderNumber): Response
    {
        $order = Order::where('order_number', $orderNumber)
                      ->where('user_id', auth()->id()) // Ensure user owns the order
                      ->with('items.course:id,title,slug')
                      ->firstOrFail();

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
