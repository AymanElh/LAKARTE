<?php

namespace App\Filament\Widgets;

use App\Models\BlogArticle;
use App\Models\BlogCategory;
use App\Models\Testimonial;
use App\Models\TestimonialCategory;
use App\Models\Template;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class ContentManagementWidget extends BaseWidget
{
//    protected static ?string $heading = 'Gestion de Contenu';
    protected static ?int $sort = 5;
    protected static ?string $pollingInterval = '120s';

    protected function getStats(): array
    {
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth();

        // Blog Statistics
        $publishedArticles = BlogArticle::where('status', 'published')->count();
        $draftArticles = BlogArticle::where('status', 'draft')->count();
        $scheduledArticles = BlogArticle::where('status', 'scheduled')->count();

        $articlesThisMonth = BlogArticle::whereDate('created_at', '>=', $thisMonth)->count();
        $articlesLastMonth = BlogArticle::whereBetween('created_at', [$lastMonth->startOfMonth(), $lastMonth->endOfMonth()])->count();
        $articlesChange = $articlesLastMonth > 0 ? (($articlesThisMonth - $articlesLastMonth) / $articlesLastMonth) * 100 : 0;

        // Testimonial Statistics
        $publishedTestimonials = Testimonial::where('is_published', true)->count();
        $pendingTestimonials = Testimonial::where('is_published', false)->count();
        $featuredTestimonials = Testimonial::where('is_featured', true)->count();

        $testimonialsThisMonth = Testimonial::whereDate('created_at', '>=', $thisMonth)->count();
        $testimonialsLastMonth = Testimonial::whereBetween('created_at', [$lastMonth->startOfMonth(), $lastMonth->endOfMonth()])->count();
        $testimonialsChange = $testimonialsLastMonth > 0 ? (($testimonialsThisMonth - $testimonialsLastMonth) / $testimonialsLastMonth) * 100 : 0;

        // Template Statistics
        $activeTemplates = Template::where('is_active', true)->count();
        $inactiveTemplates = Template::where('is_active', false)->count();
        $totalTemplates = $activeTemplates + $inactiveTemplates;

        // Average Rating from Testimonials
        $averageRating = Testimonial::where('is_published', true)
            ->whereNotNull('rating')
            ->avg('rating') ?? 0;

        return [
            Stat::make('Articles de Blog', $publishedArticles)
                ->description($draftArticles . ' brouillons • ' . $scheduledArticles . ' programmés')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('info')
                ->extraAttributes([
                    'class' => 'cursor-pointer',
                ])
                ->url(route('filament.admin.resources.blog-articles.index'))
                ->chart($this->getBlogChart(30)),

            Stat::make('Témoignages', $publishedTestimonials)
                ->description($pendingTestimonials . ' en attente • ' . $featuredTestimonials . ' en vedette')
                ->descriptionIcon('heroicon-m-star')
                ->color($pendingTestimonials > 0 ? 'warning' : 'success')
                ->extraAttributes([
                    'class' => 'cursor-pointer',
                ])
                ->url(route('filament.admin.resources.testimonials.index')),

            Stat::make('Templates Actifs', $activeTemplates . '/' . $totalTemplates)
                ->description($inactiveTemplates . ' inactifs')
                ->descriptionIcon('heroicon-m-photo')
                ->color($inactiveTemplates > 0 ? 'warning' : 'success')
                ->extraAttributes([
                    'class' => 'cursor-pointer',
                ])
                ->url(route('filament.admin.resources.templates.index')),

            Stat::make('Note Moyenne', number_format($averageRating, 1) . '/5 ⭐')
                ->description('Basée sur ' . Testimonial::where('is_published', true)->whereNotNull('rating')->count() . ' avis')
                ->descriptionIcon('heroicon-m-heart')
                ->color($averageRating >= 4 ? 'success' : ($averageRating >= 3 ? 'warning' : 'danger')),
        ];
    }

    private function getBlogChart(int $days): array
    {
        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->toDateString();
            $count = BlogArticle::whereDate('created_at', $date)->count();
            $data[] = $count;
        }
        return $data;
    }

    public static function canView(): bool
    {
        return auth()->user()->hasAnyRole(['admin', 'gestionnaire']);
    }
}
