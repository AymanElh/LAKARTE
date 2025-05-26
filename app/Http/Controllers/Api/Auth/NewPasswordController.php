<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Services\PasswordResetService;
use App\Traits\ApiResponse;
use Dotenv\Exception\ValidationException;
use Illuminate\Http\JsonResponse;

class NewPasswordController extends Controller
{
    use ApiResponse;
    public function __construct(private PasswordResetService $passwordResetService) {}

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        try {
            $message = $this->passwordResetService->resetPassword($request->validated());
            return $this->successResponse(null, $message, 200);
        } catch(ValidationException $e) {
            return $this->errorResponse("Password reset failed", 422, $e->errors());
        } catch(\Exception $e) {
            return $this->errorResponse("Password reset failed", 500, $e->getMessage());
        }
    }
}
