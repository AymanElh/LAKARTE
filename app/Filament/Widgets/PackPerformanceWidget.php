<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Pack;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PackPerformanceWidget extends ChartWidget
{
    protected static ?string $heading = 'Performance des Packs';
    protected static ?int $sort = 3;
    protected static ?string $pollingInterval = '60s';
    protected int | string | array $columnSpan = 'full';
    protected static ?string $maxHeight = '400px';

    public ?string $filter = 'this_month';

    protected function getFilters(): ?array
    {
        return [
            'this_week' => 'Cette semaine',
            'this_month' => 'Ce mois',
            'last_month' => 'Mois dernier',
            'this_year' => 'Cette année',
        ];
    }

    protected function getData(): array
    {
        $dateRange = $this->getDateRange();

        // Get pack statistics
        $packStats = Order::select('pack_id', DB::raw('count(*) as order_count'))
            ->with('pack')
            ->whereBetween('created_at', $dateRange)
            ->where('status', '!=', 'canceled')
            ->groupBy('pack_id')
            ->get();

        // Calculate revenue for each pack using accessor
        $packData = [];
        foreach ($packStats as $stat) {
            if ($stat->pack) {
                $orders = Order::where('pack_id', $stat->pack_id)
                    ->whereBetween('created_at', $dateRange)
                    ->where('status', '!=', 'canceled')
                    ->with('pack')
                    ->get();

                $revenue = $orders->sum('total_amount');

                $packData[] = [
                    'name' => $stat->pack->name,
                    'type' => $stat->pack->type,
                    'orders' => $stat->order_count,
                    'revenue' => $revenue,
                    'avg_order_value' => $stat->order_count > 0 ? $revenue / $stat->order_count : 0,
                ];
            }
        }

        // Sort by revenue
        usort($packData, fn($a, $b) => $b['revenue'] <=> $a['revenue']);

        $labels = array_column($packData, 'name');
        $orderCounts = array_column($packData, 'orders');
        $revenues = array_column($packData, 'revenue');

        // Color coding by pack type
        $colors = array_map(function($pack) {
            return match($pack['type']) {
                'standard' => '#3B82F6', // Blue
                'pro' => '#10B981',       // Green
                'sur_mesure' => '#F59E0B', // Orange
                default => '#6B7280'      // Gray
            };
        }, $packData);

        return [
            'datasets' => [
                [
                    'label' => 'Revenus (DH)',
                    'data' => $revenues,
                    'backgroundColor' => $colors,
                    'borderColor' => $colors,
                    'borderWidth' => 2,
                ],
                [
                    'label' => 'Nombre de commandes',
                    'data' => $orderCounts,
                    'backgroundColor' => array_map(fn($color) => $color . '80', $colors), // Semi-transparent
                    'borderColor' => $colors,
                    'borderWidth' => 1,
                    'type' => 'line',
                    'yAxisID' => 'y1',
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array
    {
        return [
            'responsive' => true,
            'interaction' => [
                'mode' => 'index',
                'intersect' => false,
            ],
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'top',
                ],
                'tooltip' => [
                    'mode' => 'index',
                    'intersect' => false,
                ],
            ],
            'scales' => [
                'x' => [
                    'display' => true,
                    'title' => [
                        'display' => true,
                        'text' => 'Packs',
                    ],
                ],
                'y' => [
                    'type' => 'linear',
                    'display' => true,
                    'position' => 'left',
                    'title' => [
                        'display' => true,
                        'text' => 'Revenus (DH)',
                    ],
                ],
                'y1' => [
                    'type' => 'linear',
                    'display' => true,
                    'position' => 'right',
                    'title' => [
                        'display' => true,
                        'text' => 'Nombre de commandes',
                    ],
                    'grid' => [
                        'drawOnChartArea' => false,
                    ],
                ],
            ],
        ];
    }

    private function getDateRange(): array
    {
        return match ($this->filter) {
            'this_week' => [Carbon::now()->startOfWeek(), Carbon::now()],
            'this_month' => [Carbon::now()->startOfMonth(), Carbon::now()],
            'last_month' => [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()],
            'this_year' => [Carbon::now()->startOfYear(), Carbon::now()],
            default => [Carbon::now()->startOfMonth(), Carbon::now()],
        };
    }

    public static function canView(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'gestionnaire']);
    }
}
