<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PackResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'type' => $this->type,
            'price' => (float) $this->price,
            'delivery_time_days' => $this->delivery_time_days,
            'is_active' => $this->is_active,
            'highlight' => $this->highlight,
            'image_path' => $this->image_path,
            'image_url' => $this->image_path ? asset('storage/' . $this->image_path) : null,
            'features' => $this->features,
            'templates_count' => $this->whenLoaded('templates', function () {
                return $this->templates->count();
            }),
            'templates' => TemplateResource::collection($this->whenLoaded('templates')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
