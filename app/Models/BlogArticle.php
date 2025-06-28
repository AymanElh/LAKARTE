<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Translatable\HasTranslations;
use App\Traits\JsonQueryHelper;

class BlogArticle extends Model
{
    use HasFactory, HasTranslations, JsonQueryHelper;

    protected $fillable = [
        'category_id',
        'author_id',
        'title',
        'slug',
        'excerpt',
        'content',
        'meta_title',
        'meta_description',
        'featured_image',
        'status',
        'published_at',
        'scheduled_at',
        'is_featured',
        'allow_comments',
        'tags',
        'views_count',
        'reading_time',
        'sort_order',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'scheduled_at' => 'datetime',
        'is_featured' => 'boolean',
        'allow_comments' => 'boolean',
        'tags' => 'array',
        'views_count' => 'integer',
        'reading_time' => 'integer',
        'sort_order' => 'integer',
    ];

    public $translatable = ['title', 'slug', 'excerpt', 'content', 'meta_title', 'meta_description'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
