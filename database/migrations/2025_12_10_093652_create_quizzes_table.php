<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade'); // Quiz is attached to a lesson
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('pass_percentage')->default(70); // Minimum score to pass
            $table->unsignedSmallInteger('max_attempts')->nullable(); // Null for unlimited attempts
            $table->timestamps();

            $table->unique('lesson_id'); // Only one quiz per lesson
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
