<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Order;
use App\Models\Pack;
use App\Models\Template;

class OrderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'client_name' => fake()->word(),
            'client_email' => fake()->word(),
            'client_phone' => fake()->word(),
            'client_city' => fake()->word(),
            'client_district' => fake()->word(),
            'pack_id' => Pack::factory(),
            'template_id' => Template::factory(),
            'orientation' => fake()->word(),
            'color' => fake()->word(),
            'quantity' => fake()->numberBetween(-10000, 10000),
            'status' => fake()->randomElement(["pending","processing","paid","shipped","cancelled"]),
            'channel' => fake()->randomElement(["whatsapp","form"]),
            'logo_path' => fake()->word(),
            'brief_pdf_path' => fake()->word(),
            'payment_capture_path' => fake()->word(),
            'offered_at' => fake()->dateTime(),
        ];
    }
}
