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
            $table->foreignId('user_id');
            $table->foreignId('pack_id');
            $table->foreignId('template_id');
            $table->string('client_name');
            $table->string('client_email');
            $table->string('phone');
            $table->string('city');
            $table->string('neighborhood');
            $table->string('orientation')->nullable();
            $table->string('color')->nullable();
            $table->integer('quantity');
            $table->enum('status', ["pending","in_progress","paid","shipped","canceled"])->default('pending');
            $table->string('logo_path')->nullable();
            $table->string('brief_path')->nullable();
            $table->string('payment_proof_path')->nullable();
            $table->enum('channel', ["whatsapp","form"])->default('form');
            $table->timestamps();
            $table->softDeletes();
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
