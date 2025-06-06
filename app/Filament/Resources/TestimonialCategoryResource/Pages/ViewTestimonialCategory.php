<?php

namespace App\Filament\Resources\TestimonialCategoryResource\Pages;

use App\Filament\Resources\TestimonialCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewTestimonialCategory extends ViewRecord
{
    protected static string $resource = TestimonialCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
