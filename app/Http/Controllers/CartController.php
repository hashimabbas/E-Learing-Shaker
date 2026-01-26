<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Course;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Routing\Controller;

class CartController extends Controller
{
    public function __construct()
    {
        // All Cart actions require authentication for now (database-backed)
        // You would adjust this if you implement guest cart support
        $this->middleware('auth');
    }

    /**
     * Retrieve the user's cart, creating one if it doesn't exist.
     */
    private function getUserCart(int $userId): Cart
    {
        // Use firstOrCreate to ensure the user has a cart record
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    /**
     * Display the contents of the cart.
     */
    public function index(Request $request): Response
    {
        $cart = $this->getUserCart($request->user()->id);

        $cart->load(['items.course:id,title,slug,price,thumbnail']); // Load course details for items

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
        ]);
    }

    /**
     * Add a course to the cart. (From Course Show or Wishlist)
     */
    public function store($slug)
    {
        $course = Course::where('slug', $slug)->firstOrFail(); // Get course by slug

        $cart = $this->getUserCart(auth()->id());

        // Check if item is already in the cart
        $cartItem = $cart->items()->where('course_id', $course->id)->first();

        if ($cartItem) {
            // Course is already in cart, just return a message
            return back()->with('message', 'This course is already in your cart.');
        }

        $cart->items()->create([
            'course_id' => $course->id,
            'price_at_purchase' => $course->price, // Use current price
            'quantity' => 1,
        ]);

        return back()->with('success', 'Course added to cart successfully.');
    }


    /**
     * Remove an item from the cart.
     */
    public function destroy(Course $course): RedirectResponse
    {
        $cart = $this->getUserCart(auth()->id());

        $cart->items()
            ->where('course_id', $course->id)
            ->delete();

        return back()->with('success', 'Course removed from cart.');
    }
}
