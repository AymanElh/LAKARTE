<?php

namespace App\Filament\Resources\PackOfferResource\Pages;

use App\Filament\Resources\PackOfferResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewPackOffer extends ViewRecord
{
    protected static string $resource = PackOfferResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
