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
            'pack_id' => Pack::factory(),
            'name' => fake()->name(),
            'description' => fake()->text(),
            'recto_path' => fake()->word(),
            'verso_path' => fake()->word(),
            'is_active' => fake()->boolean(),
            'preview_path' => fake()->word(),
            'tags' => '{}',
            'softDeletes' => fake()->word(),
        ];
    }
}
