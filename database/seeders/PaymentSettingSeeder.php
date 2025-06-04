<?php

namespace Database\Seeders;

use App\Models\PaymentSetting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PaymentSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PaymentSetting::firstOrCreate([
                'rib_number' => '123 456 789 0000'
            ], [
                'bank_name' => 'Attijariwafa Bank',
                'account_holder' => 'LAKARTE SARL',
                'iban' => 'MA64 1234 5678 9101 1121 3141',
                'swift_code' => 'ABCDMA10',
                'payment_instructions' => 'Please include your order number in the transfer note.',
                'is_active' => true,
        ]);
    }
}
