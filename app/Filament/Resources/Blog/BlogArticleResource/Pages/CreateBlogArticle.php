<?php

namespace App\Filament\Resources\Blog\BlogArticleResource\Pages;

use App\Filament\Resources\Blog\BlogArticleResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateBlogArticle extends CreateRecord
{
    protected static string $resource = BlogArticleResource::class;
}
