<?php

namespace App\Http\Controllers;

use App\Models\ContentAccessLog;
use App\Models\Lesson;
use App\Services\AccountSharingDetector;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SecureVideoController extends Controller
{
    public function stream(Request $request, Lesson $lesson)
    {
        $user = $request->user();

        // ✅ Authorization check
        if (
            !$user->enrolledCourses()->where('course_id', $lesson->course_id)->exists()
            && !$user->isAdmin()
            && !$user->isInstructor()
        ) {
            abort(403);
        }

        if (!$lesson->video || !$lesson->video->path) {
            abort(404);
        }

        $path = $lesson->video->path;

        if (!Storage::disk('local')->exists($path)) {
            abort(404);
        }

        $fullPath = Storage::disk('local')->path($path);
        $size = filesize($fullPath);
        $mime = Storage::disk('local')->mimeType($path);

        // 🚀 Offload to Web Server if configured (X-Sendfile for Apache/Litespeed, X-Accel-Redirect for Nginx)
        $method = config('services.video.streaming_method', env('VIDEO_STREAMING_METHOD', 'php'));

        if ($method === 'x-sendfile') {
            return response()->make('', 200, [
                'Content-Type' => $mime,
                'X-Sendfile' => $fullPath,
                'Content-Disposition' => 'inline',
            ]);
        }

        if ($method === 'x-accel-redirect') {
            // Nginx requires a relative path to an internal location
            $internalPath = '/internal-storage/' . $path;
            return response()->make('', 200, [
                'Content-Type' => $mime,
                'X-Accel-Redirect' => $internalPath,
                'Content-Disposition' => 'inline',
            ]);
        }

        // 🛠 PHP Streaming Fallback (Optimized)
        set_time_limit(0);
        ini_set('memory_limit', '512M');

        // Disable output buffering to avoid memory issues with large files
        while (ob_get_level()) ob_end_clean();

        $start = 0;
        $end = $size - 1;

        $headers = [
            'Content-Type' => $mime,
            'Accept-Ranges' => 'bytes',
            'Cache-Control' => 'public, max-age=3600',
        ];

        if ($request->headers->has('Range')) {
            $range = $request->header('Range');
            if (preg_match('/bytes=(\d+)-(\d+)?/', $range, $matches)) {
                $start = intval($matches[1]);
                if (isset($matches[2])) {
                    $end = intval($matches[2]);
                }
            }

            $headers['Content-Range'] = "bytes $start-$end/$size";
            $headers['Content-Length'] = $end - $start + 1;

            return response()->stream(function () use ($fullPath, $start, $end) {
                $stream = fopen($fullPath, 'rb');
                fseek($stream, $start);

                $buffer = 1024 * 64; // 64KB chunks for better throughput
                while (!feof($stream) && ftell($stream) <= $end) {
                    echo fread($stream, $buffer);
                    flush();
                }
                fclose($stream);
            }, 206, $headers);
        }

        $headers['Content-Length'] = $size;

        return response()->stream(function () use ($fullPath) {
            $stream = fopen($fullPath, 'rb');
            fpassthru($stream);
            fclose($stream);
        }, 200, $headers);
    }
}
