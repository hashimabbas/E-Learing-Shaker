<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Inertia\Inertia;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'icon',
    ];

    // Relationship: A category can have many courses
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    public function __invoke()
    {
        $categories = Cache::remember('homepage_categories', 3600, function () {
            // Only get the top 8 categories or so
            return Category::select('name', 'slug')->limit(8)->get();
        });

        return Inertia::render('Welcome', [
            'categories' => $categories,
            // ... other props
        ]);
    }
}
