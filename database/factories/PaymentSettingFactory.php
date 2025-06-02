<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\PaymentSetting;

class PaymentSettingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PaymentSetting::class;

    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        return [
            'bank_name' => fake()->word(),
            'account_holder' => fake()->word(),
            'rib_number' => fake()->word(),
            'iban' => fake()->word(),
            'swift_code' => fake()->word(),
            'payment_instructions' => fake()->text(),
            'is_active' => fake()->boolean(),
        ];
    }
}
