<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentAccessLog extends Model
{
    protected $fillable = [
        'user_id',
        'course_id',
        'lesson_id',
        'action',
        'ip_address',
        'session_id',
        'device_fingerprint',
        'user_agent',
        'accessed_at',
    ];

    protected $casts = [
        'accessed_at' => 'datetime',
    ];
}

