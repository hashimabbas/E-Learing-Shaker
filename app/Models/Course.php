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
    
    protected $appends = ['thumbnail_url', 'preview_video_link', 'localized_title', 'localized_description', 'localized_learning_outcomes', 'has_active_discount', 'discounted_price'];

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
        'discount_percentage',
        'discount_start_date',
        'discount_end_date',
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
        'discount_percentage' => 'integer',
        'discount_start_date' => 'datetime',
        'discount_end_date' => 'datetime',
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
        return $this->getCdnUrl($this->thumbnail);
    }

    public function getPreviewVideoLinkAttribute(): ?string
    {
        return $this->getCdnUrl($this->preview_video_url);
    }

    /**
     * Helper to generate CDN-compatible URLs.
     */
    protected function getCdnUrl($path)
    {
        if (!$path) return null;

        // 1. External URLs are returned as-is
        if (str_starts_with($path, 'http')) {
            return $path;
        }

        // 2. Local fallback/base generation
        $url = "";
        if (str_starts_with($path, 'images/')) {
            $url = asset($path);
        } else {
            $url = \Illuminate\Support\Facades\Storage::disk('public')->url($path);
        }

        // 3. CDN Transformation
        if (config('services.bunny.enabled') && config('services.bunny.domain')) {
            $cdnDomain = config('services.bunny.domain');
            $appUrl = config('app.url');
            
            // Replace local APP_URL with CDN domain
            $cdnUrl = str_replace($appUrl, "https://{$cdnDomain}", $url);
            
            // Fix potential non-https local URLs being replaced
            if (!str_starts_with($cdnUrl, 'https://')) {
                $cdnUrl = str_replace('http://', 'https://', $cdnUrl);
            }

            return $cdnUrl;
        }

        return $url;
    }

    public function getHasActiveDiscountAttribute(): bool
    {
        if ($this->discount_percentage <= 0) {
            return false;
        }

        $now = now();
        
        if ($this->discount_start_date && $now->lt($this->discount_start_date)) {
            return false;
        }

        if ($this->discount_end_date && $now->gt($this->discount_end_date)) {
            return false;
        }

        return true;
    }

    public function getDiscountedPriceAttribute()
    {
        if ($this->getHasActiveDiscountAttribute()) {
            return round($this->price * (1 - ($this->discount_percentage / 100)), 2);
        }
        return $this->price;
    }
}
