<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class RegistredUserController extends Controller
{
    use ApiResponse;
    public function __construct(
        private AuthService $authService
    )
    {
    }

    /**
     * Handle incoming registration request
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function store(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated());
            if(!$result) {
                return $this->errorResponse("The email has already been taken", 409);
            }
            return $this->successResponse([
                'user' => $result['user'],
                'token' => $result['token'],
                'expires_at' => $result['expires_at']
            ], "Registration Successfully", 201);
        } catch (\Exception $e) {
            return $this->errorResponse("Registration error", 500, $e->getMessage());
        }
    }
}
