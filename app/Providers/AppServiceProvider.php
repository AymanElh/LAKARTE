<?php

namespace App\Providers;

use App\Services\AuthService;
use App\Services\PasswordResetService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(AuthService::class, function($app) {
            return new AuthService();
        });
        $this->app->singleton(PasswordResetService::class, function($app) {
            return new PasswordResetService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
