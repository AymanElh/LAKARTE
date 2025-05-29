<?php

namespace App\Filament\Resources\PackResource\Pages;

use App\Filament\Resources\PackResource;

use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Filament\Resources\Pages\ListRecords\Tab;
use Illuminate\Database\Eloquent\Builder;

class ListPacks extends ListRecords
{
    protected static string $resource = PackResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('Nouveau Pack'),
        ];
    }

    public function getTabs(): array
    {
        return [
            'All' => Tab::make('Tous')
                ->label('Tous')
                ->icon('heroicon-m-squares-2x2')
                ->badge(fn() => $this->getModel()::withTrashed()->count())
                ->modifyQueryUsing(fn(Builder $query) => $query->withTrashed()),

            'active' => Tab::make('Actifs')
                ->label('Actifs')
                ->icon('heroicon-m-eye')
                ->badge(fn() => $this->getModel()::whereNull('deleted_at')->count())
                ->modifyQueryUsing(fn(Builder $query) => $query->withoutTrashed()),

            'archived' => Tab::make('Archivés')
                ->label('Archivés')
                ->icon('heroicon-m-archive-box')
                ->badge(fn() => $this->getModel()::onlyTrashed()->count())
                ->modifyQueryUsing(fn(Builder $query) => $query->onlyTrashed()),
        ];
    }

    public function getDefaultActiveTab(): string|int|null
    {
        return 'active';
    }
}
