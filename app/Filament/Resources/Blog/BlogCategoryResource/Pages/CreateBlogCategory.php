<?php

namespace App\Filament\Resources\Blog\BlogCategoryResource\Pages;

use App\Filament\Resources\Blog\BlogCategoryResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateBlogCategory extends CreateRecord
{
    protected static string $resource = BlogCategoryResource::class;
}
