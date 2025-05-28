<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Pack;
use App\Models\PackOffer;

class PackOfferFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PackOffer::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'pack_id' => Pack::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->text(),
            'type' => fake()->randomElement(["discount","free_item","bundle"]),
            'value' => fake()->word(),
            'starts_at' => fake()->dateTime(),
            'ends_at' => fake()->dateTime(),
            'is_active' => fake()->boolean(),
        ];
    }
}
