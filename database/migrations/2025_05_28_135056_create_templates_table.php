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
        Schema::create('templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pack_id');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('recto_path')->nullable();
            $table->string('verso_path')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('preview_path')->nullable();
            $table->json('tags')->nullable();
            $table->softDeletes('softDeletes');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('templates');
    }
};
