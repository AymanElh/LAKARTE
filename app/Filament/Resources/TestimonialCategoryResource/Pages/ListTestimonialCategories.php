<?php

namespace App\Filament\Resources\TestimonialCategoryResource\Pages;

use App\Filament\Resources\TestimonialCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTestimonialCategories extends ListRecords
{
    protected static string $resource = TestimonialCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
