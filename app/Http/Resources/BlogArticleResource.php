<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'content' => $this->when($request->routeIs('api.blog.articles.show'), $this->content),
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'featured_image' => $this->featured_image,
            'featured_image_url' => $this->featured_image ? asset('storage/' . $this->featured_image) : null,
            'status' => $this->status,
            'published_at' => $this->published_at?->toISOString(),
            'is_featured' => $this->is_featured,
            'allow_comments' => $this->allow_comments,
            'tags' => $this->tags,
            'views_count' => $this->views_count,
            'reading_time' => $this->reading_time,
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Relationships
            'author' => $this->whenLoaded('author', function () {
                return [
                    'id' => $this->author->id,
                    'name' => $this->author->name,
                ];
            }),
            'category' => $this->whenLoaded('category', new BlogCategoryResource($this->category)),

            // Additional computed fields
            'published_at_human' => $this->published_at?->diffForHumans(),
            'estimated_reading_time' => $this->reading_time ? $this->reading_time . ' min read' : null,

            // Conditional fields
            'related_articles' => $this->when(isset($this->related_articles), $this->related_articles),
        ];
    }
}
