<?php

namespace App\Filament\Resources\Blog\BlogArticleResource\Pages;

use App\Filament\Resources\Blog\BlogArticleResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListBlogArticles extends ListRecords
{
    protected static string $resource = BlogArticleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
