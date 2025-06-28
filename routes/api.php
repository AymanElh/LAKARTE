<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::post('/register', [\App\Http\Controllers\Api\Auth\RegistredUserController::class, 'store'])->name('register');
Route::post('/login', [\App\Http\Controllers\Api\Auth\AuthenticatedSessionController::class, 'store'])->name('login');

// Forgot and reset password routes
Route::post('/forgot-password', [\App\Http\Controllers\Api\Auth\PasswordResetLinkController::class, 'store']);
Route::post('/reset-password', [\App\Http\Controllers\Api\Auth\NewPasswordController::class, 'resetPassword'])->name('password.reset');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [\App\Http\Controllers\Api\Auth\AuthenticatedSessionController::class, 'show']);
    Route::post('/logout', [\App\Http\Controllers\Api\Auth\AuthenticatedSessionController::class, 'destroy']);
});
