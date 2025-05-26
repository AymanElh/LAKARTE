<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class PasswordResetService
{
    public function sendResetLink(string $email): string
    {
        $status = Password::sendResetLink(['email' => $email]);
        if($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages([
                'email' => [trans($status)]
            ]);
        }
        return trans($status);
    }

    public function resetPassword(array $credentials): string
    {
        $status = Password::reset($credentials, function(User $user, string $password) {
            $this->updatePassword($user, $password);
        });

        if($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [trans($status)],
            ]);
        }
        return trans($status);
    }

    private function updatePassword(User $user, string $password): void
    {
        $user->forceFill([
            'password' => Hash::make($password),
            'remember_token' => Str::random(60)
        ])->save();

        $user->tokens()->delete();
    }

    public function isValidToken(string $email, string $token): bool
    {
        return Password::tokenExists(Password::broker()->getUser(['email' => $email]), $token);
    }
}
