<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplateResource extends JsonResource
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
            'pack_id' => $this->pack_id,
            'name' => $this->name,
            'description' => $this->description,
            'recto_path' => $this->recto_path,
            'recto_url' => $this->recto_path ? asset('storage/' . $this->recto_path) : null,
            'verso_path' => $this->verso_path,
            'verso_url' => $this->verso_path ? asset('storage/' . $this->verso_path) : null,
            'is_active' => $this->is_active,
            'preview_path' => $this->preview_path,
            'preview_url' => $this->preview_path ? asset('storage/' . $this->preview_path) : null,
            'tags' => $this->tags,
            'pack' => new PackResource($this->whenLoaded('pack')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
