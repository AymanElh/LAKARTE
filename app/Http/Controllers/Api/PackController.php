<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PackResource;
use App\Models\Pack;
use Illuminate\Http\Request;

class PackController extends Controller
{
    /**
     * Get all active packs
     */
    public function index(Request $request)
    {
        try {
            $query = Pack::where('is_active', true);

            // Filter by type if provided
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Filter by highlighted packs
            if ($request->boolean('highlight')) {
                $query->where('highlight', true);
            }

            $packs = $query->orderBy('highlight', 'desc')
                ->orderBy('price', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => PackResource::collection($packs),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching packs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific pack by slug
     */
    public function show($slug)
    {
        try {
            $pack = Pack::where('slug', $slug)
                ->where('is_active', true)
                ->with(['templates' => function ($query) {
                    $query->where('is_active', true);
                }])
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => new PackResource($pack),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Pack not found',
            ], 404);
        }
    }
}
