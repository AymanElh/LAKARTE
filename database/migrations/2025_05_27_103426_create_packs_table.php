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
        Schema::create('packs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->decimal('price', 8, 2);
            $table->string('duration');
            $table->text('description');
            $table->string('image')->nullable();
            $table->boolean('is_active')->default(true);
            $table->string('special_offer')->nullable();
            $table->timestamp('promotion_start')->nullable();
            $table->timestamp('promotion_end')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packs');
    }
};
