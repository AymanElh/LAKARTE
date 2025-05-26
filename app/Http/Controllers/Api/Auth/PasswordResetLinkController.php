<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Services\PasswordResetService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    use ApiResponse;
    public function __construct(private PasswordResetService $passwordResetService) {}

    public function store(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $message = $this->passwordResetService->sendResetLink($request->validated('email'));
            return $this->successResponse(null, $message, 200);
        } catch (ValidationException $e) {
            return $this->errorResponse("Failed to sent reset link", 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse("Failed to sent reset link", 500, config('app.debug') ? $e->getMessage() : "Something went wrong");
        }
    }
}
