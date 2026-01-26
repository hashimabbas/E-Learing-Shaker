<?php

// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WebHookController; // NEW USE
// Thawani Webhook Endpoint (Must be outside the 'auth' group)
Route::post('/webhooks/thawani', [WebHookController::class, 'handleSubscription'])->name('webhooks.thawani');
