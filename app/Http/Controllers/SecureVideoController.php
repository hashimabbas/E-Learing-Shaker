<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SecureVideoController extends Controller
{
    /**
     * Handle video streaming with optional Bunny CDN support.
     */
    public function stream(Request $request, Lesson $lesson)
    {
        // 🚀 THE ULTIMATE SPEED FIX: DIRECT CDN REDIRECTION
        // We bypass the Hostinger server completely and send the user straight to Bunny.
        // This eliminates all PHP/LiteSpeed buffering delays.

        // 1. Authorization check (Same as before)
        $user = $request->user();
        if (!$user && $request->header('X-Bunny-Origin-Secret') !== config('services.bunny.origin_secret')) {
            abort(401, 'Unauthorized');
        }

        if ($user && 
            !$user->enrolledCourses()->where('course_id', $lesson->course_id)->exists() && 
            !$user->isAdmin() && !$user->isInstructor()
        ) {
            abort(403, 'Forbidden');
        }

        // 2. Generate Signed URL for Bunny Storage
        if (config('services.bunny.enabled') && config('services.bunny.domain')) {
            $redirectUrl = $this->generateBunnyUrl($lesson);
            
            \Log::info("Redirecting student directly to Bunny CDN Storage", [
                'lesson_id' => $lesson->id,
                'user_id' => auth()->id(),
                'url' => $redirectUrl
            ]);

            return redirect($redirectUrl);
        }

        // 3. Fallback to direct server streaming
        if (!$lesson->video || !$lesson->video->path) {
            abort(404, 'Video record missing');
        }

        return $this->serveFileFromPath($request, $lesson->video->path, 'local');
    }

    /**
     * Handle course preview streaming.
     */
    public function preview(Request $request, Course $course)
    {
        $path = $course->preview_video_url;

        if (!$path) {
            abort(404, 'Preview video not found');
        }

        // 1. External URLs (YouTube/Vimeo)
        if (str_starts_with($path, 'http')) {
            return redirect($path);
        }

        // 2. Bunny CDN Redirection (Public folder)
        if (config('services.bunny.enabled') && config('services.bunny.domain')) {
            $domain = config('services.bunny.domain');

            $bunnyPath = '/public/' . ltrim($path, '/');
            // Ensure path has a video extension – Bunny CDN requires exact filename match (e.g. preview.mp4)
            $ext = strtolower(pathinfo($bunnyPath, PATHINFO_EXTENSION));
            $videoExts = ['mp4', 'webm', 'm4v', 'mov', 'ogv'];
            if (!in_array($ext, $videoExts)) {
                $bunnyPath .= '.mp4';
            }

            return redirect("https://{$domain}{$bunnyPath}");
        }

        // 3. Local streaming fallback (Public disk for previews)
        return $this->serveFileFromPath($request, $path, 'public');
    }

    /**
     * Generate a Secure Signed URL for Bunny CDN.
     * This uses the standard Bunny Token Authentication (SHA256).
     */
    protected function generateBunnyUrl(Lesson $lesson)
    {
        $domain = config('services.bunny.domain');
        $tokenKey = config('services.bunny.token_key'); // Your "Security Key" from Bunny dashboard

        // 🛡️ SECURITY: Generate Token (SHA256)
        // We prepend 'private/' because that is how the folder structure is set up in Bunny Storage.
        $path = $lesson->video->path;
        if (!str_starts_with($path, 'private/')) {
            $path = 'private/' . ltrim($path, '/');
        }
        
        // Ensure path starts with a single slash for Bunny
        $formattedPath = '/' . ltrim($path, '/');

        $baseUrl = "https://{$domain}{$formattedPath}";
        
        if (!$tokenKey) {
            return $baseUrl;
        }

        $expires = time() + 3600; // Link valid for 1 hour
        $hashableBase = $tokenKey . $formattedPath . $expires;
        
        // Bunny algorithm: Base64(Sha256(Key + Path + Expiry))
        $token = base64_encode(hash('sha256', $hashableBase, true));
        $token = str_replace(['+', '/', '='], ['-', '_', ''], $token); // URL Safe Base64

        return "{$baseUrl}?token={$token}&expires={$expires}";
    }

    /**
     * Serve a file directly from the server with anti-buffering headers.
     */
    protected function serveFileFromPath(Request $request, string $path, string $diskName)
    {
        $disk = Storage::disk($diskName);

        if (!$disk->exists($path)) {
            \Log::error("File missing on disk [{$diskName}]: {$path}");
            abort(404, 'Video file missing on server');
        }

        $fullPath = $disk->path($path);
        $size = filesize($fullPath);
        
        // 🚀 OPTIMIZED MIME-TYPE DETECTION
        $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
        $mimes = [
            'mp4'  => 'video/mp4',
            'webm' => 'video/webm',
            'm4v'  => 'video/x-m4v',
            'mov'  => 'video/quicktime',
        ];
        $mime = $mimes[$extension] ?? 'video/mp4';

        $method = config('services.video.streaming_method', env('VIDEO_STREAMING_METHOD', 'php'));

        // Common Headers
        $headers = [
            'Content-Type' => $mime,
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, HEAD, OPTIONS',
            'Access-Control-Expose-Headers' => 'Content-Range, Content-Length, Accept-Ranges',
            'Accept-Ranges' => 'bytes',
            'Content-Encoding' => 'identity',
            'X-Accel-Buffering' => 'no',
            'X-LiteSpeed-No-Buffering' => '1',
            'Cache-Control' => 'no-cache, private, no-store, must-revalidate',
        ];

        // 🚀 HANDLE HEAD REQUESTS FAST
        if ($request->isMethod('HEAD')) {
            $headers['Content-Length'] = $size;
            return response()->make('', 200, $headers);
        }

        if (function_exists('apache_setenv')) {
            @apache_setenv('no-gzip', '1');
            @apache_setenv('dont-vary', '1');
            @apache_setenv('LITESPEED_NO_GZIP', '1');
        }

        set_time_limit(0);
        ignore_user_abort(true);
        
        if (function_exists('ini_set')) {
            ini_set('memory_limit', '512M');
            ini_set('zlib.output_compression', 'Off');
            ini_set('output_buffering', 'Off');
            ini_set('implicit_flush', 'On');
        }
        
        // 🚀 CLEAR ALL OUTPUT BUFFERS
        while (ob_get_level()) ob_end_clean();
        if (function_exists('ob_implicit_flush')) {
            ob_implicit_flush(true);
        }

        $start = 0;
        $end = $size - 1;

        if ($request->headers->has('Range')) {
            $range = $request->header('Range');
            if (preg_match('/bytes=(\d+)-(\d+)?/', $range, $matches)) {
                $start = (float) $matches[1];
                if (isset($matches[2]) && !empty($matches[2])) {
                    $end = (float) $matches[2];
                }
            }

            $headers['Content-Range'] = "bytes $start-$end/$size";
            $headers['Content-Length'] = $end - $start + 1;

            return response()->stream(function () use ($fullPath, $start, $end) {
                if (function_exists('ini_set')) {
                    ini_set('output_buffering', 'Off');
                    ini_set('zlib.output_compression', 'Off');
                }
                
                $stream = fopen($fullPath, 'rb');
                if (!$stream) return;
                
                fseek($stream, $start);
                $bytesToRead = $end - $start + 1;
                $bufferSize = 262144; // 256KB chunks
                
                while ($bytesToRead > 0 && !feof($stream)) {
                    $chunkSize = (int) min($bufferSize, $bytesToRead);
                    $data = fread($stream, $chunkSize);
                    if ($data === false) break;
                    
                    echo $data;
                    $bytesToRead -= strlen($data);
                    
                    if (ob_get_level() > 0) ob_flush();
                    flush();
                }
                fclose($stream);
            }, 206, $headers);
        }

        $headers['Content-Length'] = $size;
        
        return response()->stream(function () use ($fullPath) {
            if (function_exists('ini_set')) {
                ini_set('output_buffering', 'Off');
                ini_set('zlib.output_compression', 'Off');
            }

            $stream = fopen($fullPath, 'rb');
            if (!$stream) return;

            $bufferSize = 262144; // 256KB chunks
            while (!feof($stream)) {
                $data = fread($stream, $bufferSize);
                if ($data === false) break;

                echo $data;
                if (ob_get_level() > 0) ob_flush();
                flush();
            }
            fclose($stream);
        }, 200, $headers);
    }
}

