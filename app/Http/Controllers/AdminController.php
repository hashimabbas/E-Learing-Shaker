<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function __construct()
    {
        // Use the custom middleware to ensure only admins access this
        $this->middleware(['auth', 'role:admin']);
    }

    /**
     * Display the Admin Dashboard.
     */
    public function index(): Response
    {
        // Category 8: View all sales reports and revenue generated
        $totalRevenue = Order::where('status', 'paid')->sum('total_amount');
        $totalStudents = User::where('role', 'student')->count();
        $totalInstructors = User::where('role', 'instructor')->count();
        $pendingCourses = Course::where('is_published', false)->count();

        // Latest activities for quick review
        $latestOrders = Order::with('user:id,name')->latest()->take(5)->get();
        $latestRegistrations = User::latest()->take(5)->get(['id', 'name', 'email', 'created_at']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalStudents' => $totalStudents,
                'totalInstructors' => $totalInstructors,
                'pendingCourses' => $pendingCourses,
            ],
            'latestOrders' => $latestOrders,
            'latestRegistrations' => $latestRegistrations,
        ]);
    }

    /**
    * Display a listing of courses awaiting admin approval (pending courses).
    */
    public function pendingCourses(Request $request): Response
    {
        // $this->middleware('role:admin') is already applied in the constructor.

        $pendingCourses = Course::query()
            ->where('is_published', false) // Only courses that are not yet published
            ->with('instructor:id,name', 'category:id,name')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Courses/PendingIndex', [
            'pendingCourses' => $pendingCourses,
        ]);
    }

     /**
     * Display the platform's overall financial reports.
     */
    public function financialReports(Request $request): Response
    {
        // 1. Overall Key Metrics
        $metrics = [
            'totalRevenue' => Order::where('status', 'paid')->sum('total_amount'),
            'totalSales' => Order::where('status', 'paid')->count(),
            'monthlyRevenue' => Order::where('status', 'paid')
                ->whereYear('paid_at', now()->year)
                ->whereMonth('paid_at', now()->month)
                ->sum('total_amount'),
        ];

        // 2. Top Performing Courses (Example of a breakdown report)
        $topCourses = OrderItem::select('name', DB::raw('SUM(price * quantity) as revenue'))
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', 'paid')
            ->groupBy('name')
            ->orderBy('revenue', 'desc')
            ->limit(5)
            ->get();

        // 3. Revenue over Time (Monthly Summary)
        $monthlySummary = Order::select(
                DB::raw('MONTH(paid_at) as month'),
                // FIX: Cast the SUM result to DECIMAL with 2 places
                DB::raw('CAST(SUM(total_amount) AS DECIMAL(10, 2)) as total')
            )
            ->where('status', 'paid')
            ->whereYear('paid_at', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $monthlySummary = $monthlySummary->map(function ($item) {
            $item->total = (float)$item->total;
            return $item;
        });
        return Inertia::render('Admin/FinancialReports', [
            'metrics' => $metrics,
            'topCourses' => $topCourses,
            'monthlySummary' => $monthlySummary,
        ]);
    }
}
