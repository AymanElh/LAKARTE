<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Pack;
use App\Models\Template;
use App\Models\PaymentValidation;
use App\Models\BlogArticle;
use App\Models\Testimonial;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Carbon;

class BusinessOverviewWidget extends BaseWidget
{
    protected static ?string $pollingInterval = '60s';
    protected static bool $isLazy = false;
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth();

        // Total Orders This Month
        $ordersThisMonth = Order::whereDate('created_at', '>=', $thisMonth)->count();
        $ordersLastMonth = Order::whereBetween('created_at', [$lastMonth->startOfMonth(), $lastMonth->endOfMonth()])->count();
        $ordersChange = $ordersLastMonth > 0 ? (($ordersThisMonth - $ordersLastMonth) / $ordersLastMonth) * 100 : 0;

        // Revenue This Month (using accessor)
        $revenueOrders = Order::whereDate('created_at', '>=', $thisMonth)
            ->where('status', '!=', 'canceled')
            ->with('pack')
            ->get();
        $revenueThisMonth = $revenueOrders->sum('total_amount');

        $lastMonthRevenueOrders = Order::whereBetween('created_at', [$lastMonth->startOfMonth(), $lastMonth->endOfMonth()])
            ->where('status', '!=', 'canceled')
            ->with('pack')
            ->get();
        $revenueLastMonth = $lastMonthRevenueOrders->sum('total_amount');
        $revenueChange = $revenueLastMonth > 0 ? (($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100 : 0;

        // Pending Payments
        $pendingPayments = PaymentValidation::where('validation_status', 'pending')->count();
        $totalPayments = PaymentValidation::count();
        $paymentsPendingPercent = $totalPayments > 0 ? ($pendingPayments / $totalPayments) * 100 : 0;

        // Active Content
        $activePacks = Pack::where('is_active', true)->count();
        $activeTemplates = Template::where('is_active', true)->count();
        $publishedArticles = BlogArticle::where('status', 'published')->count();
        $publishedTestimonials = Testimonial::where('is_published', true)->count();

        return [
            Stat::make('Commandes ce mois', $ordersThisMonth)
                ->description($ordersChange >= 0 ? '+' . number_format($ordersChange, 1) . '% vs mois dernier' : number_format($ordersChange, 1) . '% vs mois dernier')
                ->descriptionIcon($ordersChange >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($ordersChange >= 0 ? 'success' : 'danger')
                ->chart($this->getOrdersChart(30)),

            Stat::make('Revenus ce mois', number_format($revenueThisMonth, 0) . ' DH')
                ->description($revenueChange >= 0 ? '+' . number_format($revenueChange, 1) . '% vs mois dernier' : number_format($revenueChange, 1) . '% vs mois dernier')
                ->descriptionIcon($revenueChange >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($revenueChange >= 0 ? 'success' : 'danger')
                ->chart($this->getRevenueChart(30)),

            Stat::make('Paiements en attente', $pendingPayments)
                ->description(number_format($paymentsPendingPercent, 1) . '% du total')
                ->descriptionIcon('heroicon-m-clock')
                ->color($pendingPayments > 0 ? 'warning' : 'success')
                ->extraAttributes([
                    'class' => 'cursor-pointer',
                ])
                ->url(route('filament.admin.resources.payment-validations.index', ['tableFilters[validation_status][value]' => 'pending'])),

            Stat::make('Contenu actif', $activePacks . ' packs • ' . $activeTemplates . ' templates')
                ->description($publishedArticles . ' articles • ' . $publishedTestimonials . ' témoignages')
                ->descriptionIcon('heroicon-m-document-text')
                ->color('info'),
        ];
    }

    private function getOrdersChart(int $days): array
    {
        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->toDateString();
            $count = Order::whereDate('created_at', $date)->count();
            $data[] = $count;
        }
        return $data;
    }

    private function getRevenueChart(int $days): array
    {
        $data = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->toDateString();
            $orders = Order::whereDate('created_at', $date)
                ->where('status', '!=', 'canceled')
                ->with('pack')
                ->get();
            $revenue = $orders->sum('total_amount');
            $data[] = $revenue;
        }
        return $data;
    }

    public static function canView(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'gestionnaire']);
    }
}
