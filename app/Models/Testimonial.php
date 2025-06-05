<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'client_name',
        'client_title',
        'client_company',
        'content',
        'type',
        'media_path',
        'thumbnail_path',
        'rating',
        'source',
        'source_url',
        'is_featured',
        'is_published',
        'sort_order',
        'metadata',
        'review_date',
        'created_by',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'rating' => 'integer',
        'sort_order' => 'integer',
        'metadata' => 'array',
        'review_date' => 'datetime',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(TestimonialCategory::class, 'category_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
