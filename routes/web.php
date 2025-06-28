<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['laravel' => Application::VERSION]);
});

// Admin redirect route for Filament authentication
Route::get('/admin-redirect', [\App\Http\Controllers\AdminRedirectController::class, 'redirect'])->name('admin.redirect');
