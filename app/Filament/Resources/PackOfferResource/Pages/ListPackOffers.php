<?php

namespace App\Filament\Resources\PackOfferResource\Pages;

use App\Filament\Resources\PackOfferResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPackOffers extends ListRecords
{
    protected static string $resource = PackOfferResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()
                ->label('Nouveau Offre')
        ];
    }
}
