<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Wishlist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Routing\Controller;

class WishlistController extends Controller
{
    public function __construct()
    {
        // All Wishlist actions require authentication
        $this->middleware('auth');
    }

    /**
     * Display a listing of the user's wishlisted courses.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $wishlistItems = Wishlist::where('user_id', $user->id)
            ->with(['course']) // Eager load course details fully for appends
            ->get();

        return Inertia::render('Wishlist/Index', [
            'wishlistItems' => $wishlistItems,
        ]);
    }

    /**
     * Store a newly created wishlist item in storage.
     */
    public function store(Course $course): RedirectResponse
    {
        $user = auth()->user();

        // Prevent adding a course that is already there or already purchased (optional)
        $isExisting = Wishlist::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->exists();

        if ($isExisting) {
            return back()->with('message', 'This course is already in your wishlist.');
        }

        Wishlist::create([
            'user_id' => $user->id,
            'course_id' => $course->id,
        ]);

        return back()->with('success', 'Course added to your wishlist successfully.');
    }

    /**
     * Remove the specified wishlist item from storage.
     * We'll use the course slug/ID for simplicity in the URL, but find the Wishlist item to delete.
     */
    public function destroy(Course $course): RedirectResponse
    {
        Wishlist::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->delete();

        return back()->with('success', 'Course removed from your wishlist successfully.');
    }
}
