<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\User;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class CustomerGeographyWidget extends ChartWidget
{
    protected static ?string $heading = 'Répartition Géographique des Clients';
    protected static ?int $sort = 6;
    protected static ?string $pollingInterval = '120s';
    protected int | string | array $columnSpan = 'full';
    protected static ?string $maxHeight = '400px';

    public ?string $filter = 'orders';

    protected function getFilters(): ?array
    {
        return [
            'orders' => 'Par commandes',
            'users' => 'Par utilisateurs',
        ];
    }

    protected function getData(): array
    {
        if ($this->filter === 'users') {
            return $this->getUserGeographyData();
        }

        return $this->getOrderGeographyData();
    }

    private function getOrderGeographyData(): array
    {
        // Get city distribution from orders
        $cityStats = Order::select('city', DB::raw('count(*) as count'))
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->groupBy('city')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        // Calculate revenue per city
        $cityData = [];
        foreach ($cityStats as $stat) {
            $orders = Order::where('city', $stat->city)
                ->where('status', '!=', 'canceled')
                ->with('pack')
                ->get();

            $revenue = $orders->sum('total_amount');

            $cityData[] = [
                'city' => $stat->city,
                'orders' => $stat->count,
                'revenue' => $revenue,
            ];
        }

        $labels = array_column($cityData, 'city');
        $orderCounts = array_column($cityData, 'orders');
        $revenues = array_column($cityData, 'revenue');

        // Generate colors
        $colors = $this->generateColors(count($labels));

        return [
            'datasets' => [
                [
                    'label' => 'Nombre de commandes',
                    'data' => $orderCounts,
                    'backgroundColor' => $colors,
                    'borderColor' => $colors,
                    'borderWidth' => 2,
                ],
            ],
            'labels' => $labels,
            'revenueData' => $revenues,
        ];
    }

    private function getUserGeographyData(): array
    {
        // Get city distribution from users
        $cityStats = User::select('city', DB::raw('count(*) as count'))
            ->whereNotNull('city')
            ->where('city', '!=', '')
            ->groupBy('city')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->get();

        $labels = $cityStats->pluck('city')->toArray();
        $counts = $cityStats->pluck('count')->toArray();

        // Generate colors
        $colors = $this->generateColors(count($labels));

        return [
            'datasets' => [
                [
                    'label' => 'Nombre d\'utilisateurs',
                    'data' => $counts,
                    'backgroundColor' => $colors,
                    'borderColor' => $colors,
                    'borderWidth' => 2,
                ],
            ],
            'labels' => $labels,
        ];
    }

    private function generateColors(int $count): array
    {
        $baseColors = [
            '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
            '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6366F1'
        ];

        $colors = [];
        for ($i = 0; $i < $count; $i++) {
            $colors[] = $baseColors[$i % count($baseColors)];
        }

        return $colors;
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'responsive' => true,
            'plugins' => [
                'legend' => [
                    'display' => false,
                ],
                'tooltip' => [
                    'callbacks' => [
                        'label' => $this->filter === 'orders'
                            ? "function(context) {
                                const revenues = context.chart.data.revenueData;
                                const revenue = revenues[context.dataIndex] || 0;
                                return context.dataset.label + ': ' + context.parsed.y + ' (' + Math.round(revenue) + ' DH)';
                            }"
                            : "function(context) {
                                return context.dataset.label + ': ' + context.parsed.y;
                            }"
                    ],
                ],
            ],
            'scales' => [
                'x' => [
                    'display' => true,
                    'title' => [
                        'display' => true,
                        'text' => 'Villes',
                    ],
                ],
                'y' => [
                    'display' => true,
                    'title' => [
                        'display' => true,
                        'text' => $this->filter === 'orders' ? 'Nombre de commandes' : 'Nombre d\'utilisateurs',
                    ],
                    'beginAtZero' => true,
                ],
            ],
        ];
    }

    public static function canView(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'gestionnaire']);
    }
}
