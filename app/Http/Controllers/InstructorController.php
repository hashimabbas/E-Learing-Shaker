<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Discussion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\OrderItem; // NEW USE
use Illuminate\Support\Facades\DB; // NEW USE
use Illuminate\Routing\Controller;

class InstructorController extends Controller
{
    public function __construct()
    {
        // Use the custom middleware to ensure only instructors or admins access this
        $this->middleware(['auth', 'role:instructor|admin']);
    }

    /**
     * Display the Instructor Dashboard.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Total Courses
        $totalCourses = $user->courses()->count();

        // Total Students (Enrollments)
        $totalStudents = $user->courses()->withCount('students')->get()->sum('students_count');

        // Real Revenue calculation
        $totalRevenue = OrderItem::whereHas('course', fn($q) => $q->where('user_id', $user->id))
            ->whereHas('order', fn($q) => $q->where('status', 'paid'))
            ->sum(DB::raw('price * quantity'));

        // Revenue Chart Data (Last 7 Days)
        $revenueData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayName = now()->subDays($i)->format('D');
            
            $dayRevenue = OrderItem::whereHas('course', fn($q) => $q->where('user_id', $user->id))
                ->whereHas('order', fn($q) => $q->where('status', 'paid')
                ->whereDate('created_at', $date))
                ->sum(DB::raw('price * quantity'));

            $revenueData[] = [
                'name' => $dayName,
                'revenue' => (float) $dayRevenue,
            ];
        }

        // Performance Metrics
        $avgRating = $user->courses()->where('reviews_count', '>', 0)->avg('average_rating') ?: 0;
        $certificatesCount = \App\Models\Certificate::whereHas('course', fn($q) => $q->where('user_id', $user->id))->count();

        $latestCourses = $user->courses()->with(['category'])->latest()->take(5)->get()->map(function($course) {
            // Add some stats for each course in the list
            $course->students_count = $course->students()->count();
            $course->revenue = OrderItem::where('course_id', $course->id)
                ->whereHas('order', fn($q) => $q->where('status', 'paid'))
                ->sum(DB::raw('price * quantity'));
            return $course;
        });

        return Inertia::render('Instructor/Dashboard', [
            'stats' => [
                'totalCourses' => $totalCourses,
                'totalStudents' => $totalStudents,
                'totalRevenue' => $totalRevenue,
                'avgRating' => round($avgRating, 1),
                'certificatesCount' => $certificatesCount,
                'revenueData' => $revenueData,
            ],
            'latestCourses' => $latestCourses,
        ]);
    }

     /**
     * Show the detailed sales and revenue report.
     */
    public function sales(Request $request): Response
    {
        $user = $request->user();

        // Query for sales of courses owned by this instructor
        $salesData = OrderItem::select(
            DB::raw('DATE(order_items.created_at) as date'),
            DB::raw('COUNT(order_items.id) as total_sales'),
            DB::raw('SUM(order_items.price) as total_revenue')
        )
        ->join('courses', 'order_items.course_id', '=', 'courses.id')
        ->where('courses.user_id', $user->id) // Only courses owned by the instructor
        ->whereHas('order', fn($q) => $q->where('status', 'paid')) // Only paid orders
        ->groupBy('date')
        ->orderBy('date', 'desc')
        ->paginate(30);

        return Inertia::render('Instructor/Sales/Index', [
            'salesData' => $salesData,
        ]);
    }

    /**
     * Show all discussions for all courses taught by the instructor.
     */
    public function discussions(Request $request): Response
    {
        $user = $request->user();

        // Get all discussions for courses owned by this instructor
        $discussions = Discussion::whereHas('course', function ($query) use ($user) {
            $query->where('user_id', $user->id); // Where course owner is the current user
        })
        ->with('user:id,name', 'course:id,title,slug')
        ->latest()
        ->paginate(15);

        return Inertia::render('Instructor/Discussions/Index', [
            'discussions' => $discussions,
        ]);
    }
}
