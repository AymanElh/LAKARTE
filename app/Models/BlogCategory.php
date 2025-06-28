<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;
use App\Traits\JsonQueryHelper;

class BlogCategory extends Model
{
    use HasFactory, HasTranslations, JsonQueryHelper;
    protected $fillable = [
        'name',
        'slug',
        'description',
        'color',
        'icon',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'name' => 'array',
        'slug' => 'array',
        'description' => 'array',
        'is_active' => 'boolean',
        'sort_order' => 'integer'
    ];

    public array $translatable = ['name', 'slug', 'description'];

    public function articles(): HasMany
    {
        return $this->hasMany(BlogArticle::class, 'category_id');
    }
}
