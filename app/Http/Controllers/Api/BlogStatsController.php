<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BlogArticle;
use App\Models\BlogCategory;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BlogStatsController extends Controller
{
    /**
     * Get blog statistics and metadata.
     */
    public function stats(): JsonResponse
    {
        $totalArticles = BlogArticle::where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->count();

        $totalCategories = BlogCategory::where('is_active', true)->count();

        $totalViews = BlogArticle::where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->sum('views_count');

        $featuredArticles = BlogArticle::where('status', 'published')
            ->where('is_featured', true)
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->count();

        $totalAuthors = User::whereHas('blogArticles', function ($q) {
            $q->where('status', 'published')
                ->where(function ($query) {
                    $query->whereNull('published_at')
                        ->orWhere('published_at', '<=', now());
                });
        })->count();

        return response()->json([
            'success' => true,
            'data' => [
                'total_articles' => $totalArticles,
                'total_categories' => $totalCategories,
                'total_views' => $totalViews,
                'featured_articles' => $featuredArticles,
                'total_authors' => $totalAuthors,
            ],
        ]);
    }

    /**
     * Get all unique tags from published articles.
     */
    public function tags(): JsonResponse
    {
        $articles = BlogArticle::where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->whereNotNull('tags')
            ->select('tags')
            ->get();

        $allTags = [];
        foreach ($articles as $article) {
            if (is_array($article->tags)) {
                $allTags = array_merge($allTags, $article->tags);
            }
        }

        $uniqueTags = array_unique($allTags);
        $tagCounts = array_count_values($allTags);

        // Sort by usage count
        arsort($tagCounts);

        $tagsWithCounts = array_map(function ($tag) use ($tagCounts) {
            return [
                'name' => $tag,
                'count' => $tagCounts[$tag],
            ];
        }, array_keys($tagCounts));

        return response()->json([
            'success' => true,
            'data' => $tagsWithCounts,
        ]);
    }

    /**
     * Get popular articles for a specific time period.
     */
    public function trending(Request $request): JsonResponse
    {
        $timeframe = $request->input('timeframe', 'week'); // week, month, year
        $limit = $request->input('limit', 10);

        $query = BlogArticle::query()
            ->with(['author:id,name', 'category:id,name,slug,color'])
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            });

        // Apply timeframe filter
        switch ($timeframe) {
            case 'week':
                $query->where('published_at', '>=', now()->subWeek());
                break;
            case 'month':
                $query->where('published_at', '>=', now()->subMonth());
                break;
            case 'year':
                $query->where('published_at', '>=', now()->subYear());
                break;
        }

        $articles = $query->orderBy('views_count', 'desc')
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $articles,
            'timeframe' => $timeframe,
        ]);
    }

    /**
     * Get blog archive (articles grouped by month/year).
     */
    public function archive(): JsonResponse
    {
        $archive = BlogArticle::select(
            DB::raw('YEAR(published_at) as year'),
            DB::raw('MONTH(published_at) as month'),
            DB::raw('COUNT(*) as count')
        )
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->whereNotNull('published_at')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'year' => $item->year,
                    'month' => $item->month,
                    'month_name' => date('F', mktime(0, 0, 0, $item->month, 1)),
                    'count' => $item->count,
                    'slug' => $item->year . '-' . str_pad($item->month, 2, '0', STR_PAD_LEFT),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $archive,
        ]);
    }

    /**
     * Get articles for a specific archive period.
     */
    public function archiveArticles(Request $request, string $year, string $month): JsonResponse
    {
        $perPage = $request->input('per_page', 10);

        $articles = BlogArticle::query()
            ->with(['author:id,name', 'category:id,name,slug,color'])
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->whereYear('published_at', $year)
            ->whereMonth('published_at', $month)
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $articles,
            'archive_period' => [
                'year' => (int) $year,
                'month' => (int) $month,
                'month_name' => date('F', mktime(0, 0, 0, $month, 1)),
            ],
        ]);
    }

    /**
     * Get authors with their article counts.
     */
    public function authors(): JsonResponse
    {
        $authors = User::select('id', 'name')
            ->withCount(['blogArticles' => function ($q) {
                $q->where('status', 'published')
                    ->where(function ($query) {
                        $query->whereNull('published_at')
                            ->orWhere('published_at', '<=', now());
                    });
            }])
            ->having('blog_articles_count', '>', 0)
            ->orderBy('blog_articles_count', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $authors,
        ]);
    }

    /**
     * Get articles by a specific author.
     */
    public function authorArticles(Request $request, int $authorId): JsonResponse
    {
        $perPage = $request->input('per_page', 10);

        $author = User::select('id', 'name')->find($authorId);

        if (!$author) {
            return response()->json([
                'success' => false,
                'message' => 'Author not found',
            ], 404);
        }

        $articles = BlogArticle::query()
            ->with(['author:id,name', 'category:id,name,slug,color'])
            ->where('author_id', $authorId)
            ->where('status', 'published')
            ->where(function ($q) {
                $q->whereNull('published_at')
                    ->orWhere('published_at', '<=', now());
            })
            ->orderBy('published_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $articles,
            'author' => $author,
        ]);
    }
}
