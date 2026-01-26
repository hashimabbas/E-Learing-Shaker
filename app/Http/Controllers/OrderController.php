<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Routing\Controller;

class OrderController extends Controller
{
    public function __construct()
    {
        // All order actions should require authentication
        $this->middleware('auth');
    }

    /**
     * Display a listing of the user's past orders (Order History).
     */
    public function index(Request $request): Response
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->withCount('items') // Get a count of items in the order
            ->latest() // Show most recent orders first
            ->paginate(10); // Paginate the results

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified order.
     * Note: This method already exists in PaymentController, but
     * for a clean architecture, it's better to move it here.
     * I will assume PaymentController@show is moved/removed.
     */
    public function show(Order $order): Response
    {
        $user = auth()->user(); // Get the authenticated user

        $order->load([
            'items.course:id,title,slug',
            'user:id' // For the check
        ]);

        // CRITICAL FIX: Allow Admin/Instructor to view the order
        $isOwner = $order->user_id === $user->id;
        $isAdminOrInstructor = $user->isAdmin() || $user->isInstructor(); // Allow instructor to see their sales' orders

        if (!$isOwner && !$isAdminOrInstructor) {
             // If not the owner AND not an admin/instructor, deny access
             abort(404, 'Order not found or access denied.');
        }

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
