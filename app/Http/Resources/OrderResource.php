<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'user_id' => $this->user_id,
            'pack_id' => $this->pack_id,
            'template_id' => $this->template_id,
            'client_name' => $this->client_name,
            'client_email' => $this->client_email,
            'phone' => $this->phone,
            'city' => $this->city,
            'neighborhood' => $this->neighborhood,
            'orientation' => $this->orientation,
            'color' => $this->color,
            'quantity' => $this->quantity,
            'status' => $this->status,
            'logo_path' => $this->logo_path,
            'logo_url' => $this->logo_path ? asset('storage/' . $this->logo_path) : null,
            'brief_path' => $this->brief_path,
            'brief_url' => $this->brief_path ? asset('storage/' . $this->brief_path) : null,
            'payment_proof_path' => $this->payment_proof_path,
            'payment_proof_url' => $this->payment_proof_path ? asset('storage/' . $this->payment_proof_path) : null,
            'channel' => $this->channel,
            'pack' => new PackResource($this->whenLoaded('pack')),
            'template' => new TemplateResource($this->whenLoaded('template')),
            'user' => $this->whenLoaded('user', function () {
                return [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
