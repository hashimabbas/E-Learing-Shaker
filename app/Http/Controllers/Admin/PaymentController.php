<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User; // Import User model
use App\Notifications\NewPurchaseNotification; // Reuse existing notification or create a new one for approval
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Notification; // Import Notification facade

class PaymentController extends Controller
{
    public function index(): Response
    {
        $pendingOrders = Order::query()
            ->where('status', 'pending')
            ->where('payment_method', 'Bank Transfer')
            ->with('user:id,name,email')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Payments/PendingIndex', [
            'pendingOrders' => $pendingOrders,
        ]);
    }

    public function approve(Order $order)
    {
        if ($order->status !== 'pending') {
            return back()->with('error', 'Order is not pending.');
        }

        $order->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        // Enroll user in courses
        foreach ($order->items as $item) {
             $order->user->enrolledCourses()->syncWithoutDetaching([
                $item->course_id => [
                    'progress' => 0,
                ]
            ]);
        }
        
        // Notify admin (optional, maybe not needed since they just approved it)
        // But crucially, you might want to notify the USER that their order is approved.
        // For now, we'll just stick to the critical enrollment logic.

        return back()->with('success', 'Order approved and user enrolled.');
    }

    public function reject(Order $order)
    {
        if ($order->status !== 'pending') {
            return back()->with('error', 'Order is not pending.');
        }

        $order->update([
            'status' => 'failed', // Or 'cancelled'
        ]);

        return back()->with('success', 'Order rejected.');
    }
}
