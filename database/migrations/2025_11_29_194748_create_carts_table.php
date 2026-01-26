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
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            // A cart belongs to a user (logged-in state). We'll keep it simple for now.
            // For guest carts, you would add a nullable `session_id` column.
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->unique('user_id'); // Each user has only one cart
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
