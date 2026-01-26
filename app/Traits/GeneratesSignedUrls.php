<?php

namespace App\Traits;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;

trait GeneratesSignedUrls
{
    /**
     * Generates a temporary, signed URL for a file to be served by the web server.
     *
     * @param string $path The file path on the local disk.
     * @param int $minutes The expiration time in minutes.
     * @return string
     */
    protected function generateSignedResourceUrl(string $path, int $minutes = 5): string
    {
         // 1. Generate the FULL signed URL using the named route
         return URL::temporarySignedRoute(
            'student.resource.serve',
            Carbon::now()->addMinutes($minutes),
            ['filePath' => base64_encode($path)] // Path is base64-encoded for safety
        );
    }
}
