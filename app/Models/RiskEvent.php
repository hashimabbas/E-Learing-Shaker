<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiskEvent extends Model
{
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'score',
        'level',
        'reason',
        'is_reset',
        'created_at',
    ];

}
