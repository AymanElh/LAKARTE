<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['laravel' => Application::VERSION]);
});
