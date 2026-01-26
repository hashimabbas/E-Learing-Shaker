<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Routing\Controller;

class AdminCourseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Course::query()
            ->with(['instructor:id,name', 'category:id,name']);

        // Optional filter based on the 'published' query parameter from the dashboard link
        if ($request->input('published') === 'false') {
             $query->where('is_published', false);
        }

        $courses = $query->latest()->paginate(10);

        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            // You'll need to create this Admin/Courses/Index.tsx view
        ]);
    }
}
