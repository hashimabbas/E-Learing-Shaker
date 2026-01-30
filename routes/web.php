<?php

use App\Http\Controllers\Admin\SecurityController;
use App\Http\Controllers\AdminCategoryController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\Api\ProgressController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CertificatesController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseEnrollmentController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\InstructorApplicationController;
use App\Http\Controllers\InstructorController;
use App\Http\Controllers\InstructorCourseController;
use App\Http\Controllers\InstructorLessonController;
use App\Http\Controllers\InstructorQuizController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\SecureVideoController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\SupportController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\WishlistController;
use App\Models\Notification;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', WelcomeController::class)->name('welcome');


// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

// Public Route for Language Switching
Route::get('language/{locale}', [LanguageController::class, 'switch'])->name('language.switch');

Route::get('/courses', [CourseController::class, 'index'])->name('courses.index');
Route::get('/courses/{course:slug}', [CourseController::class, 'show'])->name('courses.show');

// Public Routes for Support/FAQ/Legal
Route::get('/about', [SupportController::class, 'about'])->name('about');
Route::get('/portfolio', [SupportController::class, 'portfolio'])->name('portfolio');
Route::get('/faq', [SupportController::class, 'faq'])->name('support.faq');
Route::get('/privacy', [SupportController::class, 'privacy'])->name('support.privacy');
Route::get('/terms-of-use', [SupportController::class, 'terms'])->name('support.terms');
Route::get('/contact', [SupportController::class, 'contact'])->name('support.contact');
Route::post('/contact', [SupportController::class, 'submitContact'])->name('support.contact.submit');

// routes/web.php
Route::post('/courses/{course:slug}/enroll-free', [CourseEnrollmentController::class, 'enrollFree'])
    ->middleware('auth')
    ->name('courses.enroll.free');


Route::middleware(['auth', 'block.suspicious', 'log.content'])->group(function () {
    // ... existing settings routes ...

    Route::get('/dashboard', [StudentController::class, 'index'])->name('dashboard');
    // Wishlist Routes (Category 3)
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist_index');
    // We use a POST request to store a new item, passing the course slug
    Route::post('/wishlist/add/{course:slug}', [WishlistController::class, 'store'])->name('wishlist.store');
    // We use a DELETE request to remove an item, passing the course slug
    Route::delete('/wishlist/remove/{course:slug}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');

    // Cart Routes (Category 3)
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add/{course:slug}', [CartController::class, 'store'])->name('cart.store');
    Route::delete('/cart/remove/{course:slug}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Payment & Order Routes (Category 3)
    Route::post('/checkout/initiate', [PaymentController::class, 'initiatePayment'])->name('payment.initiate');

    // Redirect/Callback Routes from Thawani
    Route::get('/checkout/success/{order:order_number}', [PaymentController::class, 'paymentSuccess'])->name('payment.success');
    Route::get('/checkout/cancel/{order:order_number}', [PaymentController::class, 'paymentCancel'])->name('payment.cancel');

    // PayPal Callbacks
    Route::get('/checkout/paypal/return', [PaymentController::class, 'paypalReturn'])->name('payment.paypal.return');
    Route::get('/checkout/paypal/cancel', [PaymentController::class, 'paypalCancel'])->name('payment.paypal.cancel');

    // User Order History/View
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order:order_number}', [OrderController::class, 'show'])->name('orders.show');

    Route::get('/secure/video/{lesson}', [SecureVideoController::class, 'stream'])->name('secure.video');

    Route::post('/progress/update', [ProgressController::class, 'update'])->name('api.progress.update');

    // Resume Course Route (C4)
    Route::get('/my-learning/resume/{course:slug}', [StudentController::class, 'resumeCourse'])->name('student.resume-course');

    // Quiz Routes (Category 4)
    Route::get('/quizzes/{quiz:id}', [QuizController::class, 'show'])->name('quizzes.show');
    Route::post('/quizzes/{quiz:id}/submit', [QuizController::class, 'submit'])->name('quizzes.submit');

    // E-book Download Link Generator (Category 4)
    Route::post('/lesson/{lesson}/download', [StudentController::class, 'generateEbookLink'])->name('student.ebook.download');

    // TEMPORARY, SIGNED ROUTE (must use the 'signed' middleware)
    Route::get('/protected/serve/{filePath}', [StudentController::class, 'serveProtectedResource'])
        ->middleware('signed') // This is the only barrier against direct download
        ->name('student.resource.serve');

    // Certificate Generator (Category 4)
    Route::post('/course/{course}/certificate', [StudentController::class, 'generateCertificate'])->name('student.certificate.generate');

    // Discussion Forum Routes (Category 5)
    Route::get('/courses/{course:slug}/discussions', [DiscussionController::class, 'index'])->name('discussions.index');
    Route::post('/discussions', [DiscussionController::class, 'store'])->name('discussions.store');
    Route::get('/discussions/{discussion}', [DiscussionController::class, 'show'])->name('discussions.show');
    Route::post('/discussions/{discussion}/comments', [DiscussionController::class, 'addComment'])->name('discussions.comment.add');

    Route::post('/courses/{course:slug}/reviews', [ReviewController::class, 'store'])->name('reviews.store');

    // Certificate List View (Category 4)
    Route::get('/my-certificates', [CertificatesController::class, 'index'])->name('certificates.index');

    // Subscription Management (Category 6)
    Route::get('settings/subscription', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::post('settings/subscription/{subscription}/cancel', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');

    Route::get('/subscribe', [SubscriptionController::class, 'purchase'])->name('subscription.purchase');
    Route::post('/subscribe/initiate/{planId}', [SubscriptionController::class, 'initiateCheckout'])->name('subscription.initiate');
    Route::get('/subscribe/success/{planId}', [SubscriptionController::class, 'successCallback'])->name('subscription.success');

    // STUDENT/GENERAL AUTHENTICATED ROUTES
    // Application Form (for students who want to become instructors)
    Route::get('/apply-instructor', [InstructorApplicationController::class, 'create'])->name('applications.create');
    Route::post('/apply-instructor', [InstructorApplicationController::class, 'store'])->name('applications.store');


    // Notifications Management (C5)
    Route::get('/notifications', function (Request $request) {
        // Simple Inertia page to list all notifications (optional, for history)
        return Inertia::render('Notifications/Index', [
            'notifications' => $request->user()->notifications()->paginate(20),
        ]);
    })->name('notifications.index');
    // Route to mark all as read (used by the button in NotificationBell.tsx)
    Route::post('/notifications/read', function (Request $request) {
        $request->user()->unreadNotifications->markAsRead();
        return back()->with('success', 'Notifications marked as read.');
    })->name('notifications.mark-read');

    // Route to mark a single notification as read (optional)
    Route::patch('/notifications/{notification}', function (Notification $notification) {
        $notification->markAsRead();
        return back();
    })->name('notifications.read');

});

Route::middleware(['auth', 'block.suspicious', 'log.content', 'detect.account.sharing'])->group(function () {
    Route::get('/my-learning', [StudentController::class, 'index'])
        ->name('student.learning');

    Route::get('/courses/{course:slug}/learn/{lesson?}', [CourseController::class, 'learn'])
    ->name('courses.learn');

});
// TEMPORARY, SIGNED ROUTE (must use the 'signed' middleware)
Route::get('/protected/serve/{filePath}', [StudentController::class, 'serveProtectedResource'])
    ->middleware('signed') // CRUCIAL: Protects the resource
    ->name('student.resource.serve');



// starting Instructor area
Route::middleware(['auth', 'log.content', 'role:instructor|admin'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::get('/dashboard', [InstructorController::class, 'index'])->name('dashboard');
    // Course Management Routes will go here (Action Item 2)
    // Sales/Reports Routes will go here (Action Item 3)
    // Course Management
    Route::resource('courses', InstructorCourseController::class)->except(['show']);
    Route::get('/courses', [InstructorCourseController::class, 'index'])->name('courses.index');

    // Lesson/Content Management (CRUD for lessons, videos, quizzes)
    // These would be nested resources under the course
    // Route::resource('courses.lessons', InstructorLessonController::class)->except(['index', 'show']);

    Route::get('/sales', [InstructorController::class, 'sales'])->name('sales.index');
    // Nested Lesson/Content Management (CRUD for lessons, videos, quizzes)
    // We use a shallow route to keep URLs clean: /instructor/lessons/{lesson}

    // Lesson/Content Management
    Route::resource('lessons', InstructorLessonController::class)->except(['index', 'show']);
    // Custom route for video/resource upload handling
    Route::post('lessons/{lesson}/upload-resource', [InstructorLessonController::class, 'uploadResource'])->name('lessons.upload_resource');

    // Quiz Management (Nested under Instructor scope)
    Route::post('quizzes', [InstructorQuizController::class, 'store'])->name('quizzes.store');
    Route::post('quizzes/{quiz}/question', [InstructorQuizController::class, 'addQuestion'])->name('quizzes.question.add');
    // ... add delete/update routes for quizzes/questions as needed
    // <--- FIX: ADD THE UPDATE ROUTE HERE --->
    Route::put('quizzes/{question}/question', [InstructorQuizController::class, 'updateQuestion'])->name('quizzes.question.update');
    // Deletes a specific question by ID
    Route::delete('quizzes/{question}/question', [InstructorQuizController::class, 'destroyQuestion'])->name('quizzes.question.destroy');

    Route::get('/discussions', [InstructorController::class, 'discussions'])->name('discussions.index');

});

// Starting Admin Area
Route::middleware(['auth', 'log.content',  'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('dashboard');

    // User, Course, Category Management (Action Item 2 & 3) will go here
    // Financial Reports (Action Item 4) will go here
    Route::resource('users', AdminUserController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::resource('categories', AdminCategoryController::class)->except(['show']);

    // Course Approval
    Route::post('/courses/{course}/toggle-publish', [InstructorCourseController::class, 'togglePublish'])->name('courses.publish');
    // FIX: Add the full course index route
    Route::get('/courses', [InstructorCourseController::class, 'index'])->name('courses.index'); // <-- ADD THIS LINE

    // ADMIN APPLICATION REVIEW
    Route::get('/applications', [InstructorApplicationController::class, 'index'])->name('applications.index');
    Route::patch('/applications/{application}', [InstructorApplicationController::class, 'update'])->name('applications.update');

    Route::get('/courses/pending', [AdminController::class, 'pendingCourses'])->name('courses.pending');

    Route::get('/reports', [AdminController::class, 'financialReports'])->name('reports');


    // Security Routes
    Route::prefix('security')->name('security.')->group(function () {
        Route::get('/', [SecurityController::class, 'index'])->name('index');
        
        Route::get('/flagged-users', [SecurityController::class, 'flaggedUsers'])->name('flagged');

        Route::get('/users/{user}', [SecurityController::class, 'userDetail'])->name('user'); // Replaces 'show' or 'admin.security.user'
        
        // Session Actions
        Route::get('/session/{sessionId}', [SecurityController::class, 'show'])->name('show'); // Session detail
        Route::post('/session/{sessionId}/revoke', [SecurityController::class, 'revokeSession'])->name('session.revoke');
        
        // User Actions
        Route::post('/{user}/unflag', [SecurityController::class, 'unflag'])->name('unflag');
        Route::post('/{user}/force-logout', [SecurityController::class, 'forceLogout'])->name('force-logout');
        Route::post('/{user}/reset-risk', [SecurityController::class, 'resetRisk'])->name('reset-risk');
        
        Route::post('/{user}/note', [SecurityController::class, 'addNote'])->name('note');
        Route::post('/{user}/unlock', [SecurityController::class, 'unlock'])->name('unlock');
        Route::post('/{user}/ban', [SecurityController::class, 'ban'])->name('ban');
    });

    // Payment Management Routes
    Route::prefix('payments')->name('payments.')->group(function () {
        Route::get('/pending', [\App\Http\Controllers\Admin\PaymentController::class, 'index'])->name('pending');
        Route::post('/{order}/approve', [\App\Http\Controllers\Admin\PaymentController::class, 'approve'])->name('approve');
        Route::post('/{order}/reject', [\App\Http\Controllers\Admin\PaymentController::class, 'reject'])->name('reject');
    });
});

require __DIR__.'/settings.php';
