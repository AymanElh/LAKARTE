<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Template;
use App\Models\Pack;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class TemplateUsageWidget extends ChartWidget
{
    protected static ?string $heading = 'Utilisation des Templates';
    protected static ?int $sort = 7;
    protected static ?string $pollingInterval = '120s';
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

        // Get template usage statistics
        $templateStats = Order::select('template_id', DB::raw('count(*) as usage_count'))
            ->with(['template.pack'])
            ->whereBetween('created_at', $dateRange)
            ->where('status', '!=', 'canceled')
            ->whereNotNull('template_id')
            ->groupBy('template_id')
            ->orderBy('usage_count', 'desc')
            ->limit(10)
            ->get();

        // Calculate revenue per template
        $templateData = [];
        foreach ($templateStats as $stat) {
            if ($stat->template && $stat->template->pack) {
                $orders = Order::where('template_id', $stat->template_id)
                    ->whereBetween('created_at', $dateRange)
                    ->where('status', '!=', 'canceled')
                    ->with('pack')
                    ->get();

                $revenue = $orders->sum('total_amount');

                $templateData[] = [
                    'name' => $stat->template->name,
                    'pack_name' => $stat->template->pack->name,
                    'pack_type' => $stat->template->pack->type,
                    'usage_count' => $stat->usage_count,
                    'revenue' => $revenue,
                ];
            }
        }

        $labels = array_map(function($template) {
            return $template['name'] . ' (' . $template['pack_name'] . ')';
        }, $templateData);

        $usageCounts = array_column($templateData, 'usage_count');
        $revenues = array_column($templateData, 'revenue');

        // Color coding by pack type
        $colors = array_map(function($template) {
            return match($template['pack_type']) {
                'standard' => '#3B82F6', // Blue
                'pro' => '#10B981',       // Green
                'sur_mesure' => '#F59E0B', // Orange
                default => '#6B7280'      // Gray
            };
        }, $templateData);

        return [
            'datasets' => [
                [
                    'label' => 'Nombre d\'utilisations',
                    'data' => $usageCounts,
                    'backgroundColor' => $colors,
                    'borderColor' => $colors,
                    'borderWidth' => 2,
                ],
            ],
            'labels' => $labels,
            'revenueData' => $revenues,
            'templateData' => $templateData,
        ];
    }

    protected function getType(): string
    {
        return 'horizontalBar';
    }

    protected function getOptions(): array
    {
        return [
            'responsive' => true,
            'indexAxis' => 'y',
            'plugins' => [
                'legend' => [
                    'display' => false,
                ],
                'tooltip' => [
                    'callbacks' => [
                        'label' => "function(context) {
                            const revenues = context.chart.data.revenueData;
                            const revenue = revenues[context.dataIndex] || 0;
                            const templateData = context.chart.data.templateData[context.dataIndex];
                            return [
                                'Utilisations: ' + context.parsed.x,
                                'Revenus: ' + Math.round(revenue) + ' DH',
                                'Pack: ' + templateData.pack_name + ' (' + templateData.pack_type + ')'
                            ];
                        }"
                    ],
                ],
            ],
            'scales' => [
                'x' => [
                    'display' => true,
                    'title' => [
                        'display' => true,
                        'text' => 'Nombre d\'utilisations',
                    ],
                    'beginAtZero' => true,
                ],
                'y' => [
                    'display' => true,
                    'title' => [
                        'display' => true,
                        'text' => 'Templates',
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
