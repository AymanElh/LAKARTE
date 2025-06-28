<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;

class AdminRedirectController extends Controller
{
    public function redirect(Request $request)
    {
        // Try to get user from Sanctum auth first
        $user = $request->user();

        // If not authenticated via headers, try token from query parameter
        if (!$user && $request->has('_token')) {
            $token = $request->get('_token');
            $accessToken = PersonalAccessToken::findToken($token);
            if ($accessToken) {
                $user = $accessToken->tokenable;
            }
        }

        if (!$user) {
            // If accessed directly without token, redirect to React login
            return redirect()->to('http://localhost:5173/login')
                ->with('message', 'Please login to access the admin panel');
        }

        // Log the user into the session for Filament
        Auth::login($user);

        // Redirect to the admin panel
        return redirect()->to('/admin');
    }
}
