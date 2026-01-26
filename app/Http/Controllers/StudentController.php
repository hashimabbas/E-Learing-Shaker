<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Routing\Controller;
use App\Models\Lesson;
use App\Models\UserLessonProgress;
use App\Services\RecommendationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse; // NEW USE

class StudentController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:student|admin']);
    }

    /**
     * Display the My Learning dashboard (enrolled courses).
     */
    public function index(Request $request, RecommendationService $recommender): Response
    {
        $user = $request->user();

        // Load enrolled courses along with progress data from the pivot table
        $enrolledCourses = $user->enrolledCourses()
            ->with(['instructor:id,name'])
            ->withPivot('progress', 'completed_at')
            ->orderBy('pivot_updated_at', 'desc') // Show recently active courses first
            ->paginate(12);

        // Also fetch recently viewed courses (you'd track this in a separate log later)
        $recentlyViewed = $user->enrolledCourses()
            ->inRandomOrder() // Mock for now
            ->take(3)
            ->get();

            // --- NEW: Course Recommendations (Category 6) ---
        // NEW: Course Recommendations (Category 6)
        $recommendations = $recommender->getRecommendations($user, 4);
        // --- END NEW RECOMMENDATIONS ---
            return Inertia::render('MyLearning/Index', [
                'enrolledCourses' => $enrolledCourses,
                'recentlyViewed' => $recentlyViewed,
                'recommendations' => $recommendations,

            ]);
    }

    /**
     * Generates a secure, temporary link for downloading an e-book.
     */
    public function generateEbookLink(Lesson $lesson): RedirectResponse
    {
        $user = auth()->user();

        // 1. Authorization: Check if the user is enrolled in the course
        $isEnrolled = $user->enrolledCourses()->where('course_id', $lesson->course_id)->exists();

        // Allow if enrolled OR the lesson is a free preview OR user is an instructor/admin
        if (!$isEnrolled && !$lesson->is_free_preview && !$user->isInstructor() && !$user->isAdmin()) {
            return back()->with('error', 'You are not authorized to download this resource.');
        }

        $filePath = $lesson->downloadable_path;

        if (!$filePath || !Storage::disk('local')->exists($filePath)) { // Assuming 'local' is your private disk
            return back()->with('error', 'File not found on the server.');
        }

        // 2. Generate a temporary, signed, and time-limited URL
        $signedUrl = URL::temporarySignedRoute(
            'student.resource.serve',
            now()->addMinutes(5), // Link valid for 5 minutes
            ['filePath' => base64_encode($filePath)]
        );

        return redirect($signedUrl);
    }

    /**
     * Serves the protected file if the signed URL is valid.
     */
    public function serveProtectedResource(string $filePath): BinaryFileResponse
    {
        // The 'signed' middleware handles the URL validity check.

        try {
            $decodedFilePath = base64_decode($filePath);

            if (!Storage::disk('local')->exists($decodedFilePath)) {
                 abort(404, 'Resource not found.');
            }

            // Return the file stream directly for download
            return response()->download(Storage::disk('local')->path($decodedFilePath), basename($decodedFilePath));

        } catch (\Exception $e) {
            abort(404, 'Invalid resource path.');
        }
    }

     /**
     * Checks if a course is 100% complete and generates a certificate.
     */
    public function generateCertificate(Course $course): RedirectResponse
    {
        $user = auth()->user();

        // 1. Authorization: User must be enrolled and not already have a certificate
        $enrollment = $user->enrolledCourses()->where('course_id', $course->id)->first()?->pivot;

        if (!$enrollment) {
            return back()->with('error', 'You must be enrolled in this course.');
        }

        // 2. Check Completion Status
        if ($enrollment->progress < 100) {
            return back()->with('error', 'You must complete the course (100% progress) to receive the certificate.');
        }

        // 3. Create/Fetch Certificate Record
        $certificate = Certificate::firstOrCreate(
            ['user_id' => $user->id, 'course_id' => $course->id],
            [
                'unique_code' => Str::random(12),
                'file_path' => null, // Will be generated below
            ]
        );

        // 4. MOCK PDF GENERATION (In a real app, use Dompdf/Snappy)
        if (!$certificate->file_path) {
            // Logic to render a view with user/course data into a PDF and save to private disk
            $mockPath = "certificates/{$certificate->unique_code}.pdf";
            Storage::disk('local')->put($mockPath, "Mock Certificate for {$user->name} in {$course->title}.");
            $certificate->update(['file_path' => $mockPath]);
        }

        // 5. Generate secure, temporary download link for the certificate
        $signedUrl = URL::temporarySignedRoute(
            'student.resource.serve',
            now()->addMinutes(15),
            ['filePath' => base64_encode($certificate->file_path)]
        );

        return redirect($signedUrl);
    }

    // app/Http/Controllers/StudentController.php (Add this method)
// Assumes this is where the link from My Learning Dashboard points to

    public function resumeCourse(Course $course): RedirectResponse
    {
        $user = auth()->user();

        // 1. Get all lesson IDs for the course
        $lessonIds = $course->lessons()->pluck('id');

        // 2. Get all lesson IDs the user has completed
        $completedLessonIds = UserLessonProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', $lessonIds)
            ->where('is_completed', true)
            ->pluck('lesson_id');

        // 3. Find the first lesson ID in the course sequence that is NOT completed
        $nextLesson = Lesson::where('course_id', $course->id)
            ->whereNotIn('id', $completedLessonIds)
            ->orderBy('order')
            ->first();

        if ($nextLesson) {
            // Redirect to the course player with the next lesson's slug
            return redirect()->route('courses.learn', [
                'course' => $course->slug,
                'lesson' => $nextLesson->slug // You'll need to update your routing to accept lesson slug
            ]);
        }

        // If no uncompleted lessons are found (i.e., course is finished)
        return redirect()->route('student.learning')->with('success', 'Congratulations! You have completed this course.');
    }
}
