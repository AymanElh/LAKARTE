<?php

namespace App\Filament\Resources\PaymentValidationResource\Pages;

use App\Filament\Resources\PaymentValidationResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreatePaymentValidation extends CreateRecord
{
    protected static string $resource = PaymentValidationResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
