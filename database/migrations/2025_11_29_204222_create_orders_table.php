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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('order_number')->unique(); // Custom, readable order ID
            $table->string('thawani_session_id')->nullable()->unique(); // ID from Thawani API
            $table->decimal('total_amount', 8, 2);
            $table->string('currency', 3)->default('OMR');

            // Status: pending, paid, failed, refunded
            $table->enum('status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');

            $table->string('payment_method')->default('Thawani');
            $table->timestamp('paid_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
