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
        $userId = $user->id;


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

        // 2️⃣ LOG ACCESS (THIS IS THE KEY PART)
        // ContentAccessLog::create([
        //     'user_id' => $user->id,
        //     'course_id' => $lesson->course_id,
        //     'lesson_id' => $lesson->id,
        //     'action' => 'video_play',
        //     'ip_address' => $request->ip(),
        //     'session_id' => session()->getId(),
        //     'device_fingerprint' => hash('sha256',
        //         $request->userAgent() . '|' . $request->header('Accept-Language')
        //     ),
        //     'user_agent' => $request->userAgent(),
        //     'accessed_at' => now(),
        // ]);

        // AccountSharingDetector::check($user);


        $path = $lesson->video->path;

        if (!Storage::exists($path)) {
            abort(404);
        }

        $size   = Storage::size($path);
        $mime   = Storage::mimeType($path);
        $start  = 0;
        $end    = $size - 1;

        $headers = [
            'Content-Type'  => $mime,
            'Accept-Ranges' => 'bytes',
            'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma'        => 'no-cache',
            'Expires'       => '0',
        ];


        // 🔒 Handle range requests (VERY IMPORTANT)
        if ($request->headers->has('Range')) {
            $range = $request->header('Range');
            preg_match('/bytes=(\d+)-(\d+)?/', $range, $matches);

            $start = intval($matches[1]);
            if (isset($matches[2])) {
                $end = intval($matches[2]);
            }

            $headers['Content-Range'] = "bytes $start-$end/$size";
            $headers['Content-Length'] = $end - $start + 1;

            return response()->stream(function () use ($path, $start, $end) {
                $stream = Storage::readStream($path);
                fseek($stream, $start);

                $buffer = 1024 * 8;
                while (!feof($stream) && ftell($stream) <= $end) {
                    echo fread($stream, $buffer);
                    flush();
                }

                fclose($stream);
            }, 206, $headers);
        }

        $headers['Content-Length'] = $size;

        return response()->stream(function () use ($path) {
            $stream = Storage::readStream($path);
            fpassthru($stream);
            fclose($stream);
        }, 200, $headers);
    }
}
