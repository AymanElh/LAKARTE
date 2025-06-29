<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Http\Resources\TestimonialCategoryResource;
use App\Models\Testimonial;
use App\Models\TestimonialCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    /**
     * Get all published testimonials with optional filtering
     */
    public function index(Request $request): JsonResponse
    {
        $query = Testimonial::with(['category', 'creator'])
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc');

        // Filter by category if provided
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by type if provided
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by rating if provided
        if ($request->filled('min_rating')) {
            $query->where('rating', '>=', $request->min_rating);
        }

        // Pagination
        $perPage = $request->get('per_page', 12);
        $testimonials = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => TestimonialResource::collection($testimonials->items()),
            'pagination' => [
                'current_page' => $testimonials->currentPage(),
                'total_pages' => $testimonials->lastPage(),
                'per_page' => $testimonials->perPage(),
                'total' => $testimonials->total(),
                'has_more_pages' => $testimonials->hasMorePages(),
            ],
        ]);
    }

    /**
     * Get featured testimonials for homepage
     */
    public function featured(Request $request): JsonResponse
    {
        $limit = $request->get('limit', 6);

        $testimonials = Testimonial::with(['category', 'creator'])
            ->where('is_published', true)
            ->where('is_featured', true)
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => TestimonialResource::collection($testimonials),
            'total' => $testimonials->count(),
        ]);
    }

    /**
     * Get testimonials by category
     */
    public function byCategory(string $categorySlug, Request $request): JsonResponse
    {
        $category = TestimonialCategory::where('slug', $categorySlug)
            ->where('is_active', true)
            ->firstOrFail();

        $perPage = $request->get('per_page', 12);

        $testimonials = Testimonial::with(['category', 'creator'])
            ->where('category_id', $category->id)
            ->where('is_published', true)
            ->orderBy('sort_order')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => TestimonialResource::collection($testimonials->items()),
            'category' => new TestimonialCategoryResource($category),
            'pagination' => [
                'current_page' => $testimonials->currentPage(),
                'total_pages' => $testimonials->lastPage(),
                'per_page' => $testimonials->perPage(),
                'total' => $testimonials->total(),
                'has_more_pages' => $testimonials->hasMorePages(),
            ],
        ]);
    }

    /**
     * Get all active testimonial categories
     */
    public function categories(Request $request): JsonResponse
    {
        $withCounts = $request->boolean('with_counts', false);

        $query = TestimonialCategory::active()->ordered();

        if ($withCounts) {
            $query->withCount(['testimonials', 'publishedTestimonials']);
        }

        $categories = $query->get();

        return response()->json([
            'success' => true,
            'data' => TestimonialCategoryResource::collection($categories),
            'total' => $categories->count(),
        ]);
    }

    /**
     * Get testimonials stats (for dashboard or info display)
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_testimonials' => Testimonial::where('is_published', true)->count(),
            'featured_testimonials' => Testimonial::where('is_published', true)->where('is_featured', true)->count(),
            'total_categories' => TestimonialCategory::where('is_active', true)->count(),
            'average_rating' => round(Testimonial::where('is_published', true)->whereNotNull('rating')->avg('rating'), 1),
            'testimonials_by_type' => [
                'text' => Testimonial::where('is_published', true)->where('type', 'text')->count(),
                'image' => Testimonial::where('is_published', true)->where('type', 'image')->count(),
                'video' => Testimonial::where('is_published', true)->where('type', 'video')->count(),
            ],
            'testimonials_by_source' => Testimonial::where('is_published', true)
                ->selectRaw('source, COUNT(*) as count')
                ->groupBy('source')
                ->pluck('count', 'source')
                ->toArray(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
