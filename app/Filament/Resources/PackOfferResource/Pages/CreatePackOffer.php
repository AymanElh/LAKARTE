<?php

namespace App\Filament\Resources\PackOfferResource\Pages;

use App\Filament\Resources\PackOfferResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\CreateRecord;

class CreatePackOffer extends CreateRecord
{
    protected static string $resource = PackOfferResource::class;

    public function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getCreatedNotification(): ?Notification
    {
        return Notification::make()
            ->title('Offre cree avec success')
            ->body('L\'offre a ete ajoute dans la liste')
            ->success();
    }
}
