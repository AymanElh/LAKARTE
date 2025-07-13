<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pack;
use App\Models\PackOffer;
use Illuminate\Http\Request;

class PackOfferController extends Controller
{
    /**
     * Get all active pack offers
     */
    public function index(Request $request)
    {
        try {
            $query = PackOffer::query();

            // Filter by active status
            if ($request->has('active') && $request->boolean('active')) {
                $query->where('is_active', true)
                    ->where('starts_at', '<=', now())
                    ->where('ends_at', '>=', now());
            }

            // Filter by type
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            $packOffers = $query->with('pack')->get();

            return response()->json([
                'success' => true,
                'data' => $packOffers,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching pack offers',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific pack offer
     */
    public function show($id)
    {
        try {
            $packOffer = PackOffer::with('pack')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $packOffer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching pack offer',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get offers for a specific pack
     */
    public function byPack($packId)
    {
        try {
            // Find the pack
            $pack = Pack::findOrFail($packId);

            // Get active offers for this pack
            $packOffers = $pack->packOffers()
                ->where('is_active', true)
                ->where('starts_at', '<=', now())
                ->where('ends_at', '>=', now())
                ->get();

            return response()->json([
                'success' => true,
                'data' => $packOffers,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching pack offers',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
