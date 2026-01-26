<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_lesson_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('lesson_id')->constrained('lessons')->onDelete('cascade');

            // Core Progress Data 
            $table->unsignedSmallInteger('progress_percentage')->default(0); // 0-100%
            $table->unsignedInteger('time_bookmark_seconds')->default(0); // The exact time to resume video (for the "remember where I left off" requirement)

            // Completion Status
            $table->boolean('is_completed')->default(false);
            $table->timestamp('completed_at')->nullable();

            // Unique key to prevent duplicate entries
            $table->unique(['user_id', 'lesson_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_lesson_progress');
    }
};
