<?php

namespace App\Filament\Widgets;

use App\Models\PaymentValidation;
use App\Models\Order;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PaymentStatusWidget extends ChartWidget
{
    protected static ?string $heading = 'Statut des Paiements';
    protected static ?int $sort = 4;
    protected static ?string $pollingInterval = '30s';
    protected int | string | array $columnSpan = 'full';
    protected static ?string $maxHeight = '350px';

    public ?string $filter = 'this_month';

    protected function getFilters(): ?array
    {
        return [
            'today' => 'Aujourd\'hui',
            'this_week' => 'Cette semaine',
            'this_month' => 'Ce mois',
            'last_month' => 'Mois dernier',
        ];
    }

    protected function getData(): array
    {
        $dateRange = $this->getDateRange();

        // Payment validation statistics
        $paymentStats = PaymentValidation::select('validation_status', DB::raw('count(*) as count'))
            ->whereBetween('created_at', $dateRange)
            ->groupBy('validation_status')
            ->get();

        // Calculate amounts for each status
        $statusData = [];
        foreach ($paymentStats as $stat) {
            $payments = PaymentValidation::where('validation_status', $stat->validation_status)
                ->whereBetween('created_at', $dateRange)
                ->get();

            $totalAmount = $payments->sum('amount_paid');

            $statusData[$stat->validation_status] = [
                'count' => $stat->count,
                'amount' => $totalAmount,
            ];
        }

        // Prepare chart data
        $labels = [];
        $counts = [];
        $amounts = [];
        $colors = [];

        $statusConfig = [
            'pending' => ['label' => '⏳ En attente', 'color' => '#F59E0B'],
            'approved' => ['label' => '✅ Approuvé', 'color' => '#10B981'],
            'rejected' => ['label' => '❌ Rejeté', 'color' => '#EF4444'],
        ];

        foreach (['pending', 'approved', 'rejected'] as $status) {
            if (isset($statusData[$status])) {
                $labels[] = $statusConfig[$status]['label'];
                $counts[] = $statusData[$status]['count'];
                $amounts[] = $statusData[$status]['amount'];
                $colors[] = $statusConfig[$status]['color'];
            }
        }

        return [
            'datasets' => [
                [
                    'label' => 'Nombre de paiements',
                    'data' => $counts,
                    'backgroundColor' => $colors,
                    'borderColor' => $colors,
                    'borderWidth' => 2,
                ],
            ],
            'labels' => $labels,
            'amountData' => $amounts, // Additional data for tooltips
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getOptions(): array
    {
        return [
            'responsive' => true,
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'bottom',
                ],
                'tooltip' => [
                    'callbacks' => [
                        'label' => "function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const amounts = context.chart.data.amountData;
                            const amount = amounts[context.dataIndex] || 0;
                            return label + ': ' + value + ' paiements (' + Math.round(amount) + ' DH)';
                        }"
                    ],
                ],
            ],
            'maintainAspectRatio' => false,
        ];
    }

    private function getDateRange(): array
    {
        return match ($this->filter) {
            'today' => [Carbon::today(), Carbon::now()],
            'this_week' => [Carbon::now()->startOfWeek(), Carbon::now()],
            'this_month' => [Carbon::now()->startOfMonth(), Carbon::now()],
            'last_month' => [Carbon::now()->subMonth()->startOfMonth(), Carbon::now()->subMonth()->endOfMonth()],
            default => [Carbon::now()->startOfMonth(), Carbon::now()],
        };
    }

    public static function canView(): bool
    {
        return auth()->user()->hasAnyRole(['super_admin', 'gestionnaire']);
    }
}
