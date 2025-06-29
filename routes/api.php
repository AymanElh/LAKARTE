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

// Blog API routes (public)
Route::prefix('blog')->group(function () {

    // Blog Categories
    Route::get('/categories', [\App\Http\Controllers\Api\BlogCategoryController::class, 'index']);
    Route::get('/categories/{slug}', [\App\Http\Controllers\Api\BlogCategoryController::class, 'show']);

    // Blog Articles
    Route::get('/articles', [\App\Http\Controllers\Api\BlogArticleController::class, 'index']);
    Route::get('/articles/featured', [\App\Http\Controllers\Api\BlogArticleController::class, 'featured']);
    Route::get('/articles/latest', [\App\Http\Controllers\Api\BlogArticleController::class, 'latest']);
    Route::get('/articles/popular', [\App\Http\Controllers\Api\BlogArticleController::class, 'popular']);
    Route::get('/articles/search', [\App\Http\Controllers\Api\BlogArticleController::class, 'search']);
    Route::get('/articles/{slug}', [\App\Http\Controllers\Api\BlogArticleController::class, 'show']);

    // Blog Stats and Metadata
    Route::get('/stats', [\App\Http\Controllers\Api\BlogStatsController::class, 'stats']);
    Route::get('/tags', [\App\Http\Controllers\Api\BlogStatsController::class, 'tags']);
    Route::get('/trending', [\App\Http\Controllers\Api\BlogStatsController::class, 'trending']);
    Route::get('/archive', [\App\Http\Controllers\Api\BlogStatsController::class, 'archive']);
    Route::get('/archive/{year}/{month}', [\App\Http\Controllers\Api\BlogStatsController::class, 'archiveArticles']);
    Route::get('/authors', [\App\Http\Controllers\Api\BlogStatsController::class, 'authors']);
    Route::get('/authors/{authorId}/articles', [\App\Http\Controllers\Api\BlogStatsController::class, 'authorArticles']);
});

// Testimonials API routes (public)
Route::prefix('testimonials')->group(function () {

    // Get all testimonials with filtering
    Route::get('/', [\App\Http\Controllers\Api\TestimonialController::class, 'index']);

    // Get featured testimonials for homepage
    Route::get('/featured', [\App\Http\Controllers\Api\TestimonialController::class, 'featured']);

    // Get testimonials by category
    Route::get('/category/{categorySlug}', [\App\Http\Controllers\Api\TestimonialController::class, 'byCategory']);

    // Get testimonial categories
    Route::get('/categories', [\App\Http\Controllers\Api\TestimonialController::class, 'categories']);

    // Get testimonials stats
    Route::get('/stats', [\App\Http\Controllers\Api\TestimonialController::class, 'stats']);
});
