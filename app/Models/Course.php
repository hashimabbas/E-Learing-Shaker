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
    
    protected $appends = ['thumbnail_url', 'localized_title', 'localized_description', 'localized_learning_outcomes'];

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'title_ar',
        'slug',
        'description',
        'description_ar',
        'learning_outcomes',
        'learning_outcomes_ar',
        'price',
        'is_published',
        'thumbnail',
        'preview_video_url',
        'average_rating',
        'reviews_count',
    ];
    
    // Add localized_title to appends so it's always available in JSON
    // Note: We need to update $appends property which is defined earlier
    
    public function getLocalizedTitleAttribute()
    {
        if (app()->getLocale() === 'ar' && $this->title_ar) {
            return $this->title_ar;
        }
        return $this->title;
    }

    public function getLocalizedDescriptionAttribute()
    {
        if (app()->getLocale() === 'ar' && $this->description_ar) {
            return $this->description_ar;
        }
        return $this->description;
    }

    public function getLocalizedLearningOutcomesAttribute()
    {
        if (app()->getLocale() === 'ar' && $this->learning_outcomes_ar) {
            return $this->learning_outcomes_ar;
        }
        return $this->learning_outcomes;
    }

    protected $casts = [
        'learning_outcomes' => 'array', // Cast to array for JSON column
        'learning_outcomes_ar' => 'array',
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
            if (str_starts_with($this->thumbnail, 'http')) {
                return $this->thumbnail;
            }
            // If it starts with images/, it's likely in the public/images folder
            if (str_starts_with($this->thumbnail, 'images/')) {
                return '/' . $this->thumbnail;
            }
            return \Illuminate\Support\Facades\Storage::disk('public')->url($this->thumbnail);
        }
        return null;
    }
}
