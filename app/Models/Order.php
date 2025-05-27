<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'client_name',
        'client_email',
        'client_phone',
        'client_city',
        'client_district',
        'pack_id',
        'template_id',
        'orientation',
        'color',
        'quantity',
        'status',
        'channel',
        'logo_path',
        'brief_pdf_path',
        'payment_capture_path',
        'offered_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'id' => 'integer',
            'pack_id' => 'integer',
            'template_id' => 'integer',
            'offered_at' => 'timestamp',
        ];
    }

    public function pack(): BelongsTo
    {
        return $this->belongsTo(Pack::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }
}
