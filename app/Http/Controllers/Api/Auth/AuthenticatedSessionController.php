<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthenticatedSessionController extends Controller
{
    use ApiResponse;

    public function __construct(
        private AuthService $authService
    )
    {
    }

    /**
     * Handle incoming authentication request
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function store(LoginRequest $request): JsonResponse
    {
        try {
            $request->authenticate();
            $result = $this->authService->login(Auth::user(), $request->boolean('remember'));


            return $this->successResponse([
                'user' => $result['user'],
                'token' => $result['token'],
                'expires_at' => $result['expires_at']
            ], "Login successfully", 201);
        } catch (ValidationException $e) {
            return $this->errorResponse("Login failed", 422, $e->errors());
        } catch (\Exception $e) {
            return $this->errorResponse("Login failed", 500, $e->getMessage());
        }
    }

    /**
     * Destroy an authenticated session
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function destroy(Request $request): JsonResponse
    {
        try {
            $this->authService->logout($request->user(), $request->boolean('all_devices') ? null : 'current');
            return $this->successResponse(null, "Logout successfully", 200);
        } catch (\Exception $e) {
            return $this->errorResponse("Logout Failed", 400, $e->getMessage());
        }
    }

    /**
     * Get authenticated user infos
     * @param Request $request
     * @return JsonResponse
     */
    public function show(Request $request): JsonResponse
    {
        return $this->successResponse(['user' => $request->user()]);
    }

    /**
     * Refresh the token of the auth user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $result = $this->authService->refreshToken($request->user());
            return $this->successResponse([
                'token' => $result['token'],
                'expires_at' => $result['expires_at']
            ], "Token refreshed successfully");
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Token refresh failed',
                500,
                config('app.debug') ? $e->getMessage() : 'Token refresh failed'
            );
        }
    }
}
