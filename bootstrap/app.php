<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\LocalizationMiddleware;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Middleware\AuthenticateSession;
use App\Http\Middleware\BlockSuspiciousUsers;
use App\Http\Middleware\DetectAccountSharing;
use App\Http\Middleware\LogContentAccess;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            LocalizationMiddleware::class, // <-- Moved UP: Must run before HandleInertiaRequests
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            \Illuminate\Session\Middleware\AuthenticateSession::class,

        ]);
        $middleware->alias([
            'role' => RoleMiddleware::class,
            'block.suspicious' => BlockSuspiciousUsers::class,
            'log.content' => LogContentAccess::class,
            'detect.account.sharing' => DetectAccountSharing::class,

        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
        // if (! app()->environment('local') && in_array($response->getStatusCode(), [500, 503, 404, 403])) {
        //         return Inertia::render('error', ['status' => $response->getStatusCode()])
        //             ->toResponse($request)
        //             ->setStatusCode($response->getStatusCode());
        //     }

        //     return $response;
        // });


        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {

            // FIX: Remove the environment check 'if (! app()->environment('local')'
            // if (in_array($response->getStatusCode(), [500, 503, 404, 403])) {
            //     return Inertia::render('error', ['status' => $response->getStatusCode()])
            //         ->toResponse($request)
            //         ->setStatusCode($response->getStatusCode());
            // }

            return $response;
        });
    })->create();
