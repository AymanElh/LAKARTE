<?php

namespace App\Filament\Resources\TestimonialCategoryResource\Pages;

use App\Filament\Resources\TestimonialCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditTestimonialCategory extends EditRecord
{
    protected static string $resource = TestimonialCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): ?string
    {
        return $this->getResource()::getUrl('index');
    }
}
