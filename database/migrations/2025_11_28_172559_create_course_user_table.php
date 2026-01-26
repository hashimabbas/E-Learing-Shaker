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
        Schema::create('course_user', function (Blueprint $table) {
            $table->id(); // Optional, but can be useful for unique enrollment tracking
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Student ID
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->decimal('progress', 5, 2)->default(0.00); // Percentage of course completed
            $table->timestamp('completed_at')->nullable(); // When the course was completed
            $table->unique(['user_id', 'course_id']); // A user can only enroll in a course once
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_user');
    }
};
