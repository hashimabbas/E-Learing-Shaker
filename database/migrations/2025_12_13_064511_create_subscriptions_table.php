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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name'); // e.g., 'Pro Plan', 'All Access'
            $table->string('thawani_plan_id')->nullable(); // ID from payment gateway
            $table->string('status')->default('active'); // active, cancelled, past_due
            $table->timestamp('renews_at')->nullable();
            $table->timestamp('ends_at')->nullable(); // For cancelled subscriptions
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
