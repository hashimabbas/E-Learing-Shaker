<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;

class ChunkUploadController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:instructor|admin']);
    }

    /**
     * Receive a single chunk and store it temporarily.
     */
    public function uploadChunk(Request $request)
    {
        $request->validate([
            'file' => 'required|file',
            'file_id' => 'required|string',
            'chunk_index' => 'required|integer',
            'total_chunks' => 'required|integer',
        ]);

        $file = $request->file('file');
        $fileId = $request->input('file_id');
        $chunkIndex = $request->input('chunk_index');

        // Temporary folder per file in storage/app/chunks
        $chunkDir = "chunks/{$fileId}";
        
        // Save chunk as chunk_0, chunk_1, ...
        Storage::disk('local')->putFileAs($chunkDir, $file, "chunk_{$chunkIndex}");

        return response()->json(['status' => 'ok']);
    }

    /**
     * Assemble all chunks into a final file.
     */
    public function finishUpload(Request $request, Lesson $lesson)
    {
        set_time_limit(0); // Prevent timeouts for large file reassembly

        $request->validate([
            'file_id' => 'required|string',
            'total_chunks' => 'required|integer',
            'original_name' => 'required|string',
            'lesson_type' => ['required', Rule::in(['video', 'downloadable'])],
        ]);

        $fileId = $request->input('file_id');
        $totalChunks = $request->input('total_chunks');
        $originalName = $request->input('original_name');
        $lessonType = $request->input('lesson_type');

        $chunkDir = storage_path("app/private/chunks/{$fileId}");
        
        // Final destination path logic matching InstructorLessonController
        $finalRelativePath = "courses/{$lesson->course_id}/lessons/{$lesson->id}/{$originalName}";
        $finalAbsolutePath = storage_path("app/private/{$finalRelativePath}");

        if (!is_dir(dirname($finalAbsolutePath))) {
            mkdir(dirname($finalAbsolutePath), 0775, true);
        }

        // Open final file for appending
        $out = fopen($finalAbsolutePath, 'wb');

        if (!$out) {
            return response()->json(['error' => 'Failed to open output file for writing'], 500);
        }

        for ($i = 0; $i < $totalChunks; $i++) {
            $chunkFile = "{$chunkDir}/chunk_{$i}";
            if (!file_exists($chunkFile)) {
                fclose($out);
                return response()->json(['error' => "Missing chunk {$i}"], 400);
            }

            $in = fopen($chunkFile, 'rb');
            stream_copy_to_stream($in, $out);
            fclose($in);

            // Delete chunk after merging to save space
            unlink($chunkFile);
        }

        fclose($out);
        
        // Remove the temporary chunks directory
        if (is_dir($chunkDir)) {
            rmdir($chunkDir);
        }

        // Database Update Logic (matching InstructorLessonController@uploadResource)
        DB::beginTransaction();
        try {
            if ($lessonType === 'video') {
                // Mock duration if getid3 is not available, or keep existing logic
                $duration = 1800; 
                $lesson->video()->updateOrCreate(
                    ['lesson_id' => $lesson->id],
                    ['path' => $finalRelativePath, 'duration' => $duration]
                );
            } elseif ($lessonType === 'downloadable') {
                $lesson->update(['downloadable_path' => $finalRelativePath]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Chunked Upload Reassembly Failed: " . $e->getMessage(), ['lesson_id' => $lesson->id]);
            return response()->json(['error' => 'Database update failed'], 500);
        }

        return response()->json([
            'status' => 'completed',
            'file_path' => $finalRelativePath,
        ]);
    }
}
