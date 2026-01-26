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
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');

            // Item details (polymorphic relation is complex, sticking to courses for now)
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('name'); // Name of the course at the time of purchase
            $table->decimal('price', 8, 2); // Price paid for the item
            $table->unsignedSmallInteger('quantity')->default(1);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
