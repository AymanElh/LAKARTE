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
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('testimonial_categories')->onDelete('cascade');
            $table->string('client_name');
            $table->string('client_title')->nullable();
            $table->string('client_company')->nullable();
            $table->text('content');
            $table->enum('type', ['text', 'image', 'video'])->default('text');
            $table->string('media_path')->nullable();
            $table->string('thumbnail_path')->nullable();
            $table->integer('rating')->nullable()->comment('1-5 stars rating');
            $table->string('source')->nullable()->comment('Google, Facebook, Direct, etc.');
            $table->string('source_url')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false);
            $table->integer('sort_order')->default(0);
            $table->json('metadata')->nullable()->comment('Additional data like Google review ID, etc.');
            $table->timestamp('review_date')->nullable();
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
