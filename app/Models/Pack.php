<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Pack extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'slug',
        'description',
        'type',
        'price',
        'delivery_time_days',
        'is_active',
        'highlight',
        'image_path',
        'features',
    ];

    /**
     * Cast the 'features' attribute to an array for automatic serialization/deserialization
     *
     * @var array
     */
    protected $casts = [
        'features' => 'array',
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
            'price' => 'decimal:2',
            'is_active' => 'boolean',
            'highlight' => 'boolean',
            'features' => 'array',
        ];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function templates(): HasMany
    {
        return $this->hasMany(Template::class);
    }

    public function packOffers(): HasMany
    {
        return $this->hasMany(PackOffer::class);
    }
}
