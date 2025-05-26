<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [\App\Http\Controllers\Api\Auth\RegistredUserController::class, 'store'])->name('register');
Route::post('/login', [\App\Http\Controllers\Api\Auth\AuthenticatedSessionController::class, 'store'])->name('login');

Route::middleware('auth:sanctum')->group(function() {
    Route::post('/logout', [\App\Http\Controllers\Api\Auth\AuthenticatedSessionController::class, 'destroy']);
});
