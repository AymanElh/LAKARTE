<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogArticle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BlogArticleController extends Controller
{
    /**
     * Display a listing of published blog articles.
     */
    public function index(Request $request): JsonResponse
    {

        $query = BlogArticle::query()
            ->with(['author:id,name', 'category:id,name,slug,color'])
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            });

        // Search functionality
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->whereJsonLike('title', $search)
                    ->orWhereJsonLike('excerpt', $search);
            });
        }

        // Filter by category
        if ($request->has('category')) {
            $categorySlug = $request->input('category');
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->whereJsonEquals('slug', $categorySlug);
            });
        }

        // Filter by author
        if ($request->has('author')) {
            $query->where('author_id', $request->input('author'));
        }

        // Filter by tags
        if ($request->has('tags')) {
            $tags = is_array($request->input('tags'))
                ? $request->input('tags')
                : explode(',', $request->input('tags'));

            foreach ($tags as $tag) {
                $query->whereJsonContains('tags', $tag);
            }
        }

        // Filter featured articles
        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        // Ordering
        $sortBy = $request->input('sort_by', 'published_at');
        $sortOrder = $request->input('sort_order', 'desc');

        if ($sortBy === 'popular') {
            $query->orderBy('views_count', 'desc');
        } elseif ($sortBy === 'featured') {
            $query->orderBy('is_featured', 'desc')
                ->orderBy('published_at', 'desc');
        } else {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $request->input('per_page', 10);
        $articles = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }

    /**
     * Display the specified blog article.
     */
    public function show(string $slug, Request $request): JsonResponse
    {
        $article = BlogArticle::query()
            ->with(['author:id,name', 'category:id,name,slug,color'])
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->whereJsonEquals('slug', $slug)
            ->first();

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found',
            ], 404);
        }

        // Increment views count
        $article->increment('views_count');

        // Get related articles if requested
        if ($request->boolean('with_related')) {
            $relatedCount = $request->input('related_count', 3);

            $relatedArticles = BlogArticle::query()
                ->with(['author:id,name', 'category:id,name,slug,color'])
                ->where('status', 'published')
                ->where('id', '!=', $article->id)
                ->where(function ($q) {
                    $q->whereNull('published_at')
                        ->orWhere('published_at', '<=', now());
                })
                ->where(function ($query) use ($article) {
                    // Same category or shared tags
                    $query->where('category_id', $article->category_id);

                    if ($article->tags) {
                        foreach ($article->tags as $tag) {
                            $query->orWhereJsonContains('tags', $tag);
                        }
                    }
                })
                ->orderBy('is_featured', 'desc')
                ->orderBy('published_at', 'desc')
                ->limit($relatedCount)
                ->get();

            $article->setAttribute('related_articles', $relatedArticles);
        }

        return response()->json([
            'success' => true,
            'data' => $article,
        ]);
    }

    /**
     * Get featured articles.
     */
    public function featured(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 5);

        $articles = BlogArticle::query()
            ->with(['author:id,name', 'category:id,name,slug,color'])
            ->where('status', 'published')
            ->where('is_featured', true)
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }

    /**
     * Get latest articles.
     */
    public function latest(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 5);

        $articles = BlogArticle::query()
            ->with(['author:id,name', 'category:id,name,slug,color'])
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }

    /**
     * Get popular articles (by views).
     */
    public function popular(Request $request): JsonResponse
    {
        $limit = $request->input('limit', 5);
        $timeframe = $request->input('timeframe', 'all'); // all, week, month

        $query = BlogArticle::query()
            ->with(['author:id,name', 'category:id,name,slug,color'])
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            });

        // Apply timeframe filter
        if ($timeframe === 'week') {
            $query->where('published_at', '>=', now()->subWeek());
        } elseif ($timeframe === 'month') {
            $query->where('published_at', '>=', now()->subMonth());
        }

        $articles = $query->orderBy('views_count', 'desc')
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $articles,
        ]);
    }

    /**
     * Search articles.
     */
    public function search(Request $request): JsonResponse
    {
        $search = $request->input('query', '');
        $perPage = $request->input('per_page', 10);

        if (empty($search)) {
            return response()->json([
                'success' => false,
                'message' => 'Search query is required',
            ], 400);
        }

        $articles = BlogArticle::query()
            ->with(['author:id,name', 'category:id,name,slug,color'])
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->where(function ($q) use ($search) {
                $q->whereJsonLike('title', $search)
                    ->orWhereJsonLike('content', $search)
                    ->orWhereJsonLike('excerpt', $search);
            })
            ->orderBy('is_featured', 'desc')
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $articles,
            'query' => $search,
        ]);
    }
}
