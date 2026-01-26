<?php

namespace App\Http\Controllers;

use App\Models\InstructorApplication;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Illuminate\Routing\Controller;
use App\Notifications\InstructorApplicationNotification; // NEW USE

class InstructorApplicationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display the application form for a student.
     */
    public function create(): Response|RedirectResponse
    {
        // Prevent submission if already an instructor or already applied
        if (auth()->user()->isInstructor() || auth()->user()->isAdmin()) {
            return redirect()->route('instructor.dashboard');
        }

        $application = auth()->user()->application; // Assuming relationship is defined

        return Inertia::render('Student/InstructorApplication', [
            'hasApplied' => !!$application,
            'applicationStatus' => $application?->status,
        ]);
    }

    /**
     * Store the new instructor application.
     */
    public function store(Request $request): RedirectResponse
    {
        // Prevent resubmission
        if (auth()->user()->application) {
            return back()->with('error', 'You already have a pending application.');
        }

        $validated = $request->validate([
            'bio' => ['required', 'string', 'max:2000'],
            'specialties' => ['required', 'string', 'max:255'],
        ]);

        $application = InstructorApplication::create([
            'user_id' => auth()->id(),
            'bio' => $validated['bio'],
            'specialties' => $validated['specialties'],
            'status' => 'pending',
        ]);

        // Optional: Notify Admin
        // User::where('role', 'admin')->first()->notify(new NewInstructorApplicationNotification());

         // --- NEW: NOTIFY ADMIN OF APPLICATION (FINAL FIX) ---
        $admins = User::where('role', 'admin')->get();
        \Illuminate\Support\Facades\Notification::send($admins, new InstructorApplicationNotification($application));
        // ----------------------------------------------------

        return redirect()->route('dashboard')->with('success', 'Your instructor application has been submitted and is under review.');
    }

    // --- ADMIN MANAGEMENT METHODS ---

    /**
     * Display a listing of all applications (Admin View).
     */
    public function index(Request $request): Response
    {
        // Authorization is handled by middleware
        // $this->middleware('role:admin'); // already in routes generally, but good to keep if not group wrapped

        $query = InstructorApplication::with('user:id,name,email'); // Removed profile_photo_path for safety

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
             // Default to pending if no filter provided? Or show all ordered by pending first?
             // Let's defaulted to showing all but ordered by status (pending first)
             // Actually, usually admin wants to see Pending first.
             // But if we want a default filter in UI, we can set it there.
        }

        $applications = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Applications/Index', [
            'applications' => $applications,
            'filters' => $request->only('status'),
        ]);
    }

    /**
     * Approve or Reject an application (Admin Action).
     */
    public function update(Request $request, InstructorApplication $application): RedirectResponse
    {
        // Authorization is handled by middleware
        $this->middleware('role:admin');

        $validated = $request->validate([
            'status' => ['required', Rule::in(['approved', 'rejected'])],
            'admin_notes' => ['nullable', 'string'],
        ]);

        $application->update($validated);

        if ($validated['status'] === 'approved') {
            // CRUCIAL STEP: Promote the user to instructor role
            $application->user->update(['role' => 'instructor']);
            $message = "Application approved! {$application->user->name} is now an instructor.";
        } else {
            $message = "Application rejected. User notified.";
        }

        // Optional: Notify the user of the decision

        return back()->with('success', $message);
    }
}
