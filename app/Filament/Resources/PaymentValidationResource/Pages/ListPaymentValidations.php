<?php

namespace App\Filament\Resources\PaymentValidationResource\Pages;

use App\Filament\Resources\PaymentValidationResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListPaymentValidations extends ListRecords
{
    protected static string $resource = PaymentValidationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
