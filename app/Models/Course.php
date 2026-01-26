<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany; // Add this

class Course extends Model
{
    use HasFactory;
    
    protected $appends = ['thumbnail_url'];

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'description',
        'learning_outcomes',
        'price',
        'is_published',
        'thumbnail',
        'preview_video_url',
        'average_rating',
        'reviews_count',
    ];

    protected $casts = [
        'learning_outcomes' => 'array', // Cast to array for JSON column
        'is_published' => 'boolean',
        'average_rating' => 'float',
    ];

    // Relationship: A course belongs to an instructor (user)
    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relationship: A course belongs to a category
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Relationship: A course has many lessons
    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    // Relationship: A course can have many reviews
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // Relationship: Many students can be enrolled in a course
    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'course_user', 'course_id', 'user_id')
                    ->withTimestamps()
                    ->withPivot('progress', 'completed_at');
    }

    // Relationship: Many users can wishlist a course (if Wishlist model links directly)
    public function wishlistedByUsers(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    // --- FINAL FIX: Discussions Relationship (Category 5) ---
    public function discussions(): HasMany
    {
        return $this->hasMany(Discussion::class);
    }

    // --- Accessor for Thumbnail URL ---
    public function getThumbnailUrlAttribute(): ?string
    {
        if ($this->thumbnail) {
            return \Illuminate\Support\Facades\Storage::url($this->thumbnail);
        }
        return null; // Or return a default image path if desired
    }
}
