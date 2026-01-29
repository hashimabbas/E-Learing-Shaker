<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TextLesson extends Model
{
    protected $fillable = ['lesson_id', 'content'];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }
}
