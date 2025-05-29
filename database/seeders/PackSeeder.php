<?php

namespace Database\Seeders;

use App\Models\Pack;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PackSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packs = [
            [
                'name' => 'Pack Standard',
                'type' => 'standard',
                'description' => 'This pack includes a ready-made design with PDF file delivery.',
                'price' => 100.00,
                'delivery_time_days' => 2,
                'is_active' => true,
                'highlight' => false,
                'image_path' => 'packs/standard.jpg',
                'features' => json_encode([
                    'PDF included',
                    'Basic design templates',
                    '2-day delivery'
                ]),
            ],
            [
                'name' => 'Pack Pro',
                'type' => 'pro',
                'description' => 'Includes design modifications and print-ready files.',
                'price' => 200.00,
                'delivery_time_days' => 3,
                'is_active' => true,
                'highlight' => true,
                'image_path' => 'packs/pro.jpg',
                'features' => json_encode([
                    'Editable source file',
                    'Design modifications included',
                    'Print-ready file'
                ]),
            ],
            [
                'name' => 'Pack Sur Mesure',
                'type' => 'sur_mesure',
                'description' => 'A fully custom design created from scratch.',
                'price' => 350.00,
                'delivery_time_days' => 5,
                'is_active' => true,
                'highlight' => false,
                'image_path' => 'packs/sur_mesure.jpg',
                'features' => json_encode([
                    'One-on-one consultation',
                    'Tailor-made design',
                    'Unlimited revisions (within reason)'
                ]),
            ],
        ];

        foreach ($packs as $pack) {
            $pack['slug'] = Str::slug($pack['name']);
            Pack::firstOrCreate(
                ['slug' => $pack['slug']],
                $pack
            );
        }
    }
}
