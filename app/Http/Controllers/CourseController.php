<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Category;
use App\Models\Lesson;
use App\Models\RecentlyViewed;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;
use App\Models\UserLessonProgress;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Traits\GeneratesSignedUrls; // <--- NEW USE
use Illuminate\Http\RedirectResponse;


class CourseController extends Controller
{
    use AuthorizesRequests, GeneratesSignedUrls;
    /**
     * Display a listing of the courses (The Catalog).
     */
    // public function index(Request $request): Response
    // {
    //     // 1. Get query parameters
    //     $search = $request->input('search');
    //     $categorySlug = $request->input('category');
    //     $minPrice = $request->input('min_price');
    //     $maxPrice = $request->input('max_price');
    //     $sortBy = $request->input('sort_by', 'created_at'); // Default sort
    //     $sortDirection = $request->input('sort_direction', 'desc'); // Default direction

    //     // 2. Build the query
    //     $courses = Course::query()
    //         ->where('is_published', true)
    //         ->with(['instructor:id,name', 'category:id,name,slug']) // Eager load necessary relationships

    //         // Apply Search Filter
    //         ->when($search, function ($query, $search) {
    //             $query->where('title', 'like', "%{$search}%")
    //                   ->orWhere('description', 'like', "%{$search}%");
    //         })

    //         // Apply Category Filter
    //         ->when($categorySlug, function ($query, $categorySlug) {
    //             $query->whereHas('category', function ($q) use ($categorySlug) {
    //                 $q->where('slug', $categorySlug);
    //             });
    //         })

    //         // Apply Price Filter
    //         ->when($minPrice, fn ($query) => $query->where('price', '>=', $minPrice))
    //         ->when($maxPrice, fn ($query) => $query->where('price', '<=', $maxPrice));

    //     // 3. Apply Sorting
    //     // For simplicity, we assume valid $sortBy and $sortDirection, production code should validate this
    //     $courses->orderBy($sortBy, $sortDirection);

    //     // 4. Get all categories for the filter sidebar
    //     $categories = Cache::rememberForever('course_categories', function () {
    //         return Category::select('id', 'name', 'slug')->get();
    //     });

    //     // 5. Paginate and return to Inertia
    //     return Inertia::render('Courses/Index', [
    //         'courses' => $courses->paginate(12)->withQueryString(),
    //         'categories' => $categories,
    //         'filters' => $request->only(['search', 'category', 'min_price', 'max_price', 'sort_by', 'sort_direction']),
    //     ]);
    // }
    public function index(Request $request): Response
    {
        $courses = Course::query()
            ->where('is_published', true)
            ->with([
                'instructor:id,name',
                'category:id,name,slug'
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        $categories = Cache::rememberForever('course_categories', function () {
            return Category::select('id', 'name', 'slug')->get();
        });

        return Inertia::render('Courses/Index', [
            'courses' => $courses, // 👈 ARRAY
            'categories' => $categories,
        ]);
    }


    /**
     * Display the specified course. (The Course Detail Page)
     */
    public function show(Course $course): Response
    {
        // Ensure the course is published unless the user is the instructor or admin
        if (!$course->is_published) {
            $user = auth()->user();
            if (!$user || (!$user->isAdmin() && $user->id !== $course->user_id)) {
                abort(404); // Or 403, depending on preference
            }
        }
        // --- NEW: Track Recently Viewed (Category 6) ---
        if (auth()->check()) {
            RecentlyViewed::updateOrCreate(
                ['user_id' => auth()->id(), 'course_id' => $course->id],
                // The timestamps will be automatically updated on existing records
                []
            );
        }
        // --- END NEW TRACKING ---
        // Load deep relationships for the detail page
        $course->load([
            'instructor:id,name,email', // Load instructor's details
            'lessons' => fn($query) => $query->orderBy('order'), // Load lessons
            'reviews' => fn($query) => $query->with('user:id,name')->latest()->take(5), // Load some recent reviews
        ]);

        // Prepare a minimal Instructor profile object (e.g., if you had a separate Profile model)
        // For now, we'll just use the User model data loaded above
        $instructor = $course->instructor;

        // Check if the current user is enrolled (Crucial for the front end)
        $isEnrolled = false;
        if (auth()->check()) {
            $isEnrolled = auth()->user()->enrolledCourses()->where('course_id', $course->id)->exists();
        }

        $inWishlist = auth()->check() ? auth()->user()->wishlistItems()->where('course_id', $course->id)->exists() : false;

        return Inertia::render('Courses/Show', [
            'course' => $course,
            'instructor' => $instructor,
            'isEnrolled' => $isEnrolled,
            'inWishlist' => $inWishlist,
        ]);
    }

     /**
     * Display the course player page for an enrolled student.
     */
    public function learn(Course $course, $lessonSlug = null): Response
    {
        $user = auth()->user();

        // Authorization check
        $isAuthorized = $user->enrolledCourses()->where('course_id', $course->id)->exists()
            || $user->isInstructor()
            || $user->isAdmin();
        if (!$isAuthorized) {
            return redirect()->route('courses.show', $course->slug)
                ->with('error', 'You must be enrolled in this course to access the content.');
        }

        // Load lessons
        $course->load(['lessons' => fn($q) => $q->orderBy('order')->with('video', 'quiz:id,lesson_id')]);
        $lessonsCollection = $course->lessons;

        $bookmarkSeconds = 0;
        $currentLesson = $lessonsCollection->first();

        // --- Step 1: Use requested lesson slug if present ---
        if ($lessonSlug) {
            $currentLesson = $lessonsCollection->first(fn($lesson) => $lesson->slug === $lessonSlug) ?? $currentLesson;
            $lastProgress = UserLessonProgress::where('user_id', $user->id)
                ->where('lesson_id', $currentLesson->id)
                ->first();
            if ($lastProgress) {
                $bookmarkSeconds = $lastProgress->time_bookmark_seconds;
            }
        } else {
            // --- Step 2: No slug -> use last progress if exists ---
            $lastProgress = UserLessonProgress::where('user_id', $user->id)
                ->whereIn('lesson_id', $lessonsCollection->pluck('id'))
                ->orderBy('updated_at', 'desc')
                ->first();
            if ($lastProgress) {
                $currentLesson = $lessonsCollection->first(fn($lesson) => $lesson->id === $lastProgress->lesson_id) ?? $currentLesson;
                $bookmarkSeconds = $lastProgress->time_bookmark_seconds;
            } else {
                // --- Step 3: Fallback to first video lesson ---
                $currentLesson = $lessonsCollection->first(fn($lesson) => $lesson->type === 'video') ?? $currentLesson;
            }
        }

        // Attach secure video URLs
        $completedLessonIds = UserLessonProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', $lessonsCollection->pluck('id'))
            ->where('is_completed', true)
            ->pluck('lesson_id')
            ->toArray();

        $lessonsWithUrls = $lessonsCollection->map(function ($lesson) use ($completedLessonIds) {
            $lessonArray = $lesson->toArray();

            // completion flag
            $lessonArray['is_completed'] = in_array($lesson->id, $completedLessonIds);

            // secure video
            if ($lesson->type === 'video' && $lesson->video && $lesson->video->path) {
                $lessonArray['secure_video_url'] = $this->generateSignedResourceUrl($lesson->video->path, 5);
            } else {
                $lessonArray['secure_video_url'] = null;
            }

            return $lessonArray;
        });

        $currentLessonWithUrl = $lessonsWithUrls->first(fn($lesson) => $lesson['id'] === $currentLesson->id);

        return Inertia::render('CoursePlayer/Index', [
            'course' => $course,
            'lessons' => $lessonsWithUrls,
            'currentLesson' => $currentLessonWithUrl,
            'bookmarkTime' => $bookmarkSeconds,
            'enrollment' => $user->enrolledCourses()->where('course_id', $course->id)->first()?->pivot,
        ]);
    }



}
