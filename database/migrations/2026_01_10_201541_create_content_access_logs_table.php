<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('content_access_logs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete();
        $table->foreignId('lesson_id')->nullable()->constrained()->nullOnDelete();

        $table->string('action', 50);
        $table->string('ip_address', 45);
        $table->string('session_id', 100)->nullable();
        $table->string('device_fingerprint', 64)->nullable();
        $table->string('user_agent')->nullable();

        $table->timestamp('accessed_at');
        $table->timestamps();

        $table->index(['user_id', 'accessed_at']);
        $table->index(['user_id', 'ip_address']);
    });

    }

    public function down(): void
    {
        Schema::dropIfExists('content_access_logs');
    }
};
