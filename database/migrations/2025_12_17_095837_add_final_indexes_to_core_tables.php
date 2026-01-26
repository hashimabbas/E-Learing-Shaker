<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            // Index the user_id (instructor) for fast lookups in instructor dashboard
            $table->index('user_id');
            // Index the published status for the main catalog query
            $table->index('is_published');
            // Index for sorting by rating
            $table->index('average_rating');
        });

        Schema::table('course_user', function (Blueprint $table) {
            // Index for progress lookups (e.g., in My Learning dashboard)
            $table->index('progress');
        });

        Schema::table('recently_viewed', function (Blueprint $table) {
            // Index for ordering by view time
            $table->index('updated_at');
        });

        Schema::table('reviews', function (Blueprint $table) {
            // Index for fetching reviews by rating (filtering, calculating average)
            $table->index('rating');
        });

        // Add more indices as slow queries are identified in the logs!
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'is_published', 'average_rating']);
        });

        Schema::table('course_user', function (Blueprint $table) {
            $table->dropIndex(['progress']);
        });

        Schema::table('recently_viewed', function (Blueprint $table) {
            $table->dropIndex(['updated_at']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['rating']);
        });
    }
};
