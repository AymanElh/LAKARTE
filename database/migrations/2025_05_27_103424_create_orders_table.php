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
            $table->string('client_name');
            $table->string('client_email');
            $table->string('client_phone');
            $table->string('client_city');
            $table->string('client_district');
            $table->foreignId('pack_id');
            $table->foreignId('template_id')->nullable();
            $table->string('orientation');
            $table->string('color');
            $table->integer('quantity');
            $table->enum('status', ["pending","processing","paid","shipped","cancelled"])->default('pending');
            $table->enum('channel', ["whatsapp","form"])->default('form');
            $table->string('logo_path')->nullable();
            $table->string('brief_pdf_path')->nullable();
            $table->string('payment_capture_path')->nullable();
            $table->timestamp('offered_at')->nullable();
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
