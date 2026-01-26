<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('instructor_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('bio'); // Short bio/experience summary
            $table->string('specialties'); // e.g., 'Laravel, React, PHP'
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable(); // For the admin to add feedback
            $table->timestamps();

            $table->unique('user_id'); // One active application per user
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('instructor_applications');
    }
};
