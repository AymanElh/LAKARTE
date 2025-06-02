<?php

namespace App\Filament\Resources\PackOfferResource\Pages;

use App\Filament\Resources\PackOfferResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPackOffer extends EditRecord
{
    protected static string $resource = PackOfferResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
