<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Order;
use App\Models\Pack;
use App\Models\Template;
use App\Models\User;

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
            'user_id' => User::factory(),
            'pack_id' => Pack::factory(),
            'template_id' => Template::factory(),
            'client_name' => fake()->word(),
            'client_email' => fake()->word(),
            'phone' => fake()->phoneNumber(),
            'city' => fake()->city(),
            'neighborhood' => fake()->word(),
            'orientation' => fake()->word(),
            'color' => fake()->word(),
            'quantity' => fake()->numberBetween(-10000, 10000),
            'status' => fake()->randomElement(["pending","in_progress","paid","shipped","canceled"]),
            'logo_path' => fake()->word(),
            'brief_path' => fake()->word(),
            'payment_proof_path' => fake()->word(),
            'channel' => fake()->randomElement(["whatsapp","form"]),
            'order_id' => Order::factory(),
        ];
    }
}
