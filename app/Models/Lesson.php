<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany; // Add this

class Lesson extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'title',
        'slug',
        'description',
        'order',
        'type',
        'is_free_preview',
    ];

    protected $casts = [
        'is_free_preview' => 'boolean',
    ];

    // Relationship: A lesson belongs to a course
    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    // Relationship: A lesson can have one video (if type is video)
    public function video(): HasOne
    {
        return $this->hasOne(Video::class);
    }

    // Relationship: A lesson can have one quiz (if type is quiz)
    public function quiz(): HasOne
    {
        return $this->hasOne(Quiz::class);
    }

    // Relationship: To track user progress on this lesson
    public function userProgress(): HasMany
    {
        return $this->hasMany(UserLessonProgress::class);
    }
}
