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
            'title' => fake()->sentence(4),
            'price' => fake()->randomFloat(2, 0, 999999.99),
            'duration' => fake()->word(),
            'description' => fake()->text(),
            'image' => fake()->word(),
            'is_active' => fake()->boolean(),
            'special_offer' => fake()->word(),
            'promotion_start' => fake()->dateTime(),
            'promotion_end' => fake()->dateTime(),
        ];
    }
}
