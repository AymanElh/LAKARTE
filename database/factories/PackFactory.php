<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Pack;

class PackFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Pack::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'slug' => fake()->slug(),
            'description' => fake()->text(),
            'type' => fake()->randomElement(["standard","pro","sur_mesure"]),
            'price' => fake()->randomFloat(2, 0, 999999.99),
            'delivery_time_days' => fake()->numberBetween(-10000, 10000),
            'is_active' => fake()->boolean(),
            'highlight' => fake()->boolean(),
            'image_path' => fake()->word(),
            'features' => '{}',
        ];
    }
}
