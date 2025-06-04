<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\PaymentValidation;

class PaymentValidationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PaymentValidation::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'order_id' => fake()->word(),
            'payment_proof_path' => fake()->word(),
            'amount_paid' => fake()->randomFloat(2, 0, 999999.99),
            'client_notes' => fake()->word(),
            'validation_status' => fake()->randomElement(["pending","approved","rejected"]),
            'admin_notes' => fake()->text(),
            'validated_by' => fake()->word(),
            'validate_at' => fake()->dateTime(),
        ];
    }
}
