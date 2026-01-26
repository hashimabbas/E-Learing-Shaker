<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany; // Add this

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'role', // Added role
        'password',
        'suspicion_score',
        'risk_score',
        'is_suspicious',
        'warned_at',
        'last_suspicious_at',
        'locked_until',
        'banned_at',
        'last_risk_at',
        'admin_notes',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'locked_until' => 'datetime',
            'banned_at' => 'datetime',
            'warned_at' => 'datetime',
            'last_suspicious_at' => 'datetime',
            'last_risk_at' => 'datetime',
            'is_suspicious' => 'boolean',
        ];
    }

    /**
     * Helper to check if the user is an administrator.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Helper to check if the user is an instructor.
     */
    public function isInstructor(): bool
    {
        return $this->role === 'instructor';
    }

    /**
     * Helper to check if the user is a student.
     */
    public function isStudent(): bool
    {
        return $this->role === 'student';
    }

    // Define relationship for courses created by this user (instructor)
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class, 'user_id'); // 'user_id' is the foreign key in 'courses' table
    }

    // Define relationship for courses the student is enrolled in
    public function enrolledCourses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_user', 'user_id', 'course_id')
                    ->withTimestamps()
                    ->withPivot('progress', 'completed_at'); // If you add pivot data
    }

    // Define relationship for wishlisted courses
    public function wishlistItems(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    // Define relationship for reviews given by this user
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function accessLogs(): HasMany
    {
        return $this->hasMany(ContentAccessLog::class);
    }


    public function canDecaySuspicion(): bool
    {
        return $this->last_suspicious_at !== null;
    }

    public function clearSuspicion()
    {
        $this->update([
            'suspicion_score' => 0,
            'is_suspicious' => false,
            'warned_at' => null,
            'last_suspicious_at' => null,
        ]);
    }

}
