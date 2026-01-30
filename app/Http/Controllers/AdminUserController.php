<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rule;
use Illuminate\Routing\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;

class AdminUserController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    /**
     * Display a listing of all users (with filtering for role/pending).
     */
    public function index(Request $request): Response
    {
        $users = User::query()
            ->when($request->input('role'), function ($query, $role) {
                $query->where('role', $role);
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $request->only('role'),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['required', Rule::in(['student', 'instructor', 'admin'])],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'email_verified_at' => now(), // Auto-verify admin-created users
        ]);

        return back()->with('success', 'User created successfully.');
    }

    /**
     * Update a user's role (used for approving instructors).
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', Rule::in(['student', 'instructor', 'admin'])],
        ]);

        // This is the approval logic: A user requests an instructor role, admin changes it here.
        $user->update($validated);

        return back()->with('success', "User {$user->name}'s details and role updated successfully.");
    }

    /**
     * Delete a user's account.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting the main admin account
        if ($user->id === auth()->id() && $user->isAdmin()) {
             return back()->with('error', 'Cannot delete the primary admin account.');
        }

        $user->delete();

        return back()->with('success', 'User account and all associated data deleted.');
    }
}
