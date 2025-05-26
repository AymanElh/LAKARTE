<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Register user on the database
     *
     * @param array $data
     * @return array
     */
    public function register(array $data): array|bool
    {
        $user = User::where('email', $data['email'])->exists();
        if($user) {
            return false;
        }
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'])
        ]);

        $tokenData = $this->createTokenForUser($user);

        return [
            'user' => $user,
            'token' => $tokenData['token'],
            'expires_at' => $tokenData['expires_at']
        ];
    }

    /**
     * Authenticate and create token for user
     *
     * @param User|null $user
     * @param bool $remember
     * @return array
     */
    public function login(?User $user, bool $remember = false): array
    {
        $tokenData = $this->createTokenForUser($user, $remember);
        return [
            'user' => $user,
            'token' => $tokenData['token'],
            'expires_at' => $tokenData['expires_at']
        ];
    }

    /**
     * Logout and delete the token
     *
     * @param User $user
     * @param string|null $scope
     * @return void
     */
    public function logout(User $user, ?string $scope = 'current'): void
    {
        if($scope === 'current') {
            $user->currentAccessToken()?->delete();
        }
        else {
            $user->tokens()->delete();
        }
    }

    /**
     * Refresh user token
     *
     * @param User $user
     * @return array
     */
    public function refreshToken(User $user): array
    {
        $user->currentAccessToken()?->delete();
        $tokenData = $this->createTokenForUser($user);
        return [
            'user' => $user,
            'token' => $tokenData['token'],
            'expirest_at' => $tokenData['expirest_at']
        ];
    }

    /**
     * Create token for user with optional remember functionality
     *
     * @param User $user
     * @param bool $remember
     * @return array
     */
    private function createTokenForUser(User $user, bool $remember = false): array
    {
        $expires_at = $remember ? now()->addDays(30) : now()->addHours(24);
        $token = $user->createToken('auth_token', ['*'], $expires_at)->plainTextToken;
        return [
            'token' => $token,
            'expires_at' => $expires_at->toISOString()
        ];
    }
}

