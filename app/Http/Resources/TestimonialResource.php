<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
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
            'client_name' => $this->client_name,
            'client_title' => $this->client_title,
            'client_company' => $this->client_company,
            'content' => $this->content,
            'type' => $this->type,
            'media_path' => $this->media_path,
            'media_url' => $this->media_path ? asset('storage/' . $this->media_path) : null,
            'thumbnail_path' => $this->thumbnail_path,
            'thumbnail_url' => $this->thumbnail_path ? asset('storage/' . $this->thumbnail_path) : null,
            'rating' => $this->rating,
            'source' => $this->source,
            'source_url' => $this->source_url,
            'is_featured' => $this->is_featured,
            'review_date' => $this->review_date?->format('Y-m-d H:i:s'),
            'review_date_human' => $this->review_date?->diffForHumans(),
            'sort_order' => $this->sort_order,
            'metadata' => $this->metadata,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at->format('Y-m-d H:i:s'),

            // Relationships
            'category' => new TestimonialCategoryResource($this->whenLoaded('category')),
            'creator' => [
                'id' => $this->creator?->id,
                'name' => $this->creator?->name,
            ],
        ];
    }
}
