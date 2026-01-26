<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_number',
        'thawani_session_id',
        'total_amount',
        'currency',
        'status',
        'payment_method',
        'paid_at',
    ];

    protected $casts = [
        'total_amount' => 'float',
        'paid_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Check if the order is successfully paid
    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    /**
     * Generate a unique, readable Order Number (e.g., LRN-001234)
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (!$model->order_number) {
                // Generate a simple unique number. In a real app, you'd use a transaction lock.
                $model->order_number = 'LRN-' . now()->format('Ymd') . '-' . str_pad(Order::count() + 1, 4, '0', STR_PAD_LEFT);
            }
        });
    }
}
