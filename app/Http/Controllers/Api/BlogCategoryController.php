<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogCategoryController extends Controller
{
    /**
     * Display a listing of active blog categories.
     */    public function index(Request $request): JsonResponse
    {
        $locale = $request->input('locale', 'en');

        $query = BlogCategory::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderByJson('name', $locale);

        // Add optional search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereJsonLike('name', $search);
        }

        // Add with articles count
        if ($request->boolean('with_count')) {
            $query->withCount(['articles' => function ($q) {
                $q->where('status', 'published')
                    ->where(function ($query) {
                        $query->whereNull('published_at')
                            ->orWhere('published_at', '<=', now());
                    });
            }]);
        }

        $categories = $query->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    /**
     * Display the specified blog category.
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $locale = $request->input('locale', 'en');

        $category = BlogCategory::query()
            ->where('is_active', true)
            ->whereJsonEquals('slug', $slug)
            ->first();

        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found',
            ], 404);
        }

        // Load articles if requested
        if ($request->boolean('with_articles')) {
            $articlesQuery = $category->articles()
                ->with(['author:id,name', 'category:id,name,slug,color'])
                ->where('status', 'published')
                ->where(function ($query) {
                    $query->whereNull('published_at')
                        ->orWhere('published_at', '<=', now());
                })
                ->orderBy('is_featured', 'desc')
                ->orderBy('published_at', 'desc');

            // Pagination for articles
            $perPage = $request->input('per_page', 10);
            $articles = $articlesQuery->paginate($perPage);

            $category->setAttribute('articles', $articles);
        }

        return response()->json([
            'success' => true,
            'data' => $category,
        ]);
    }
}
