<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TemplateResource;
use App\Models\Template;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    /**
     * Get all active templates with optional filtering
     */
    public function index(Request $request)
    {
        try {
            $query = Template::where('is_active', true)->with('pack');

            // Filter by pack if provided
            if ($request->has('pack_id')) {
                $query->where('pack_id', $request->pack_id);
            }

            // Filter by pack slug if provided
            if ($request->has('pack_slug')) {
                $query->whereHas('pack', function ($q) use ($request) {
                    $q->where('slug', $request->pack_slug);
                });
            }

            // Search by name if provided
            if ($request->has('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }

            $templates = $query->orderBy('created_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => TemplateResource::collection($templates),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching templates',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get a specific template
     */
    public function show($id)
    {
        try {
            $template = Template::where('is_active', true)
                ->with('pack')
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => new TemplateResource($template),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Template not found',
            ], 404);
        }
    }

    /**
     * Get templates by pack slug
     */
    public function byPack($packSlug)
    {
        try {
            $templates = Template::where('is_active', true)
                ->with('pack')
                ->whereHas('pack', function ($query) use ($packSlug) {
                    $query->where('slug', $packSlug);
                })
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => TemplateResource::collection($templates),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error fetching templates for pack',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
