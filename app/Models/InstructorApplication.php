<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // <-- Make sure this is imported

class InstructorApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bio',
        'specialties',
        'status',
        'admin_notes',
    ];

    /**
     * Get the user that owns the instructor application.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
