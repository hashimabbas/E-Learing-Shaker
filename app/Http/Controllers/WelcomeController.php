<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function __invoke()
    {
        $categories = Cache::remember('homepage_categories', 3600, function () {
            return Category::select('id', 'name', 'name_ar', 'slug')->limit(8)->get();
        });

        $featuredCourses = Course::where('is_published', true)
            ->with(['instructor:id,name', 'category:id,name,name_ar,slug'])
            ->orderBy('reviews_count', 'desc')
            ->get()
            ->groupBy('category_id');


        return Inertia::render('Welcome', [
            'categories' => $categories,
            'featuredCourses' => $featuredCourses,
        ]);
    }
}

