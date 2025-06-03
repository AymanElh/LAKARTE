<?php

namespace App\Filament\Resources\PaymentSettingResource\Pages;

use App\Filament\Resources\PaymentSettingResource;
use App\Models\PaymentSetting;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreatePaymentSetting extends CreateRecord
{
    protected static string $resource = PaymentSettingResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        if($data['is_active'] ?? false) {
            PaymentSetting::where('is_active', true)->update(['is_active' => false]);
        }
        return $data;
    }

    public function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
