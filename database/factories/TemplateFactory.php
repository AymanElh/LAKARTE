<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Pack;
use App\Models\Template;

class TemplateFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Template::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'pack_id' => Pack::factory(),
            'type' => fake()->randomElement(["standard","pro","custom"]),
            'is_active' => fake()->boolean(),
            'front_image' => fake()->word(),
            'back_image' => fake()->word(),
        ];
    }
}
