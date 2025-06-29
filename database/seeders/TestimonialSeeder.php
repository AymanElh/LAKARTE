<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use App\Models\TestimonialCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    /**
     * Run the database seeds
     */
    public function run(): void
    {
        $this->command->info('Creating testimonial categories...');

        // Create testimonial categories
        $categories = [
            [
                'name' => 'NFC Cards',
                'slug' => 'nfc-cards',
                'description' => 'Testimonials about our NFC business cards',
                'icon' => 'credit-card',
                'color' => '#3B82F6',
                'sort_order' => 1,
            ],
            [
                'name' => 'Google Reviews',
                'slug' => 'google-reviews',
                'description' => 'Testimonials about our Google review services',
                'icon' => 'star',
                'color' => '#10B981',
                'sort_order' => 2,
            ],
            [
                'name' => 'General Service',
                'slug' => 'general-service',
                'description' => 'General service testimonials',
                'icon' => 'thumbs-up',
                'color' => '#8B5CF6',
                'sort_order' => 3,
            ],
        ];

        foreach ($categories as $category) {
            TestimonialCategory::create($category);
        }

        $this->command->info('Creating testimonials...');

        // Get admin user
        $adminUser = User::where('email', 'ayman@gmail.com')->first();
        if (!$adminUser) {
            $adminUser = User::first();
        }

        // Get categories
        $nfcCategory = TestimonialCategory::where('slug', 'nfc-cards')->first();
        $googleCategory = TestimonialCategory::where('slug', 'google-reviews')->first();
        $generalCategory = TestimonialCategory::where('slug', 'general-service')->first();

        // Create testimonials
        $testimonials = [
            // NFC Cards Testimonials
            [
                'category_id' => $nfcCategory->id,
                'client_name' => 'Ahmed Bennani',
                'client_title' => 'CEO',
                'client_company' => 'TechStart Maroc',
                'content' => 'Les cartes NFC de Lakarte ont révolutionné notre façon de faire du networking. Plus besoin de cartes papier, tout se passe en un simple tap!',
                'type' => 'text',
                'rating' => 5,
                'source' => 'Direct',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 1,
                'created_by' => $adminUser->id,
                'review_date' => now()->subDays(5),
            ],
            [
                'category_id' => $nfcCategory->id,
                'client_name' => 'Fatima Zahra',
                'client_title' => 'Marketing Manager',
                'client_company' => 'Digital Agency Casa',
                'content' => 'Service impeccable et produit de qualité. Les cartes NFC sont devenues indispensables pour notre équipe commerciale.',
                'type' => 'text',
                'rating' => 5,
                'source' => 'Google',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 2,
                'created_by' => $adminUser->id,
                'review_date' => now()->subDays(12),
            ],
            [
                'category_id' => $nfcCategory->id,
                'client_name' => 'Youssef Alami',
                'client_title' => 'Entrepreneur',
                'client_company' => 'StartupRabat',
                'content' => 'Innovation au top! Mes clients sont impressionnés par la technologie NFC. Merci Lakarte pour cette solution moderne.',
                'type' => 'text',
                'rating' => 4,
                'source' => 'Facebook',
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 3,
                'created_by' => $adminUser->id,
                'review_date' => now()->subDays(8),
            ],

            // Google Reviews Testimonials
            [
                'category_id' => $googleCategory->id,
                'client_name' => 'Rachid Benjelloun',
                'client_title' => 'Restaurant Owner',
                'client_company' => 'Restaurant Atlas',
                'content' => 'Grâce au service Google Reviews de Lakarte, nous avons multiplié nos avis clients par 5! Notre visibilité en ligne a explosé.',
                'type' => 'text',
                'rating' => 5,
                'source' => 'Google',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 1,
                'created_by' => $adminUser->id,
                'review_date' => now()->subDays(15),
            ],
            [
                'category_id' => $googleCategory->id,
                'client_name' => 'Laila Cherif',
                'client_title' => 'Dentist',
                'client_company' => 'Cabinet Dentaire Sourire',
                'content' => 'Excellent service pour collecter les avis Google. Mes patients trouvent maintenant facilement mon cabinet en ligne.',
                'type' => 'text',
                'rating' => 5,
                'source' => 'Direct',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 2,
                'created_by' => $adminUser->id,
                'review_date' => now()->subDays(10),
            ],

            // General Service Testimonials
            [
                'category_id' => $generalCategory->id,
                'client_name' => 'Omar Benali',
                'client_title' => 'Business Consultant',
                'client_company' => 'ConseilPro',
                'content' => 'Service client exceptionnel chez Lakarte. Toujours à l\'écoute et très réactifs. Je recommande vivement!',
                'type' => 'text',
                'rating' => 5,
                'source' => 'Direct',
                'is_featured' => true,
                'is_published' => true,
                'sort_order' => 1,
                'created_by' => $adminUser->id,
                'review_date' => now()->subDays(3),
            ],
            [
                'category_id' => $generalCategory->id,
                'client_name' => 'Samira Tazi',
                'client_title' => 'Freelance Designer',
                'client_company' => null,
                'content' => 'Lakarte m\'a aidée à moderniser mon image de marque. Leurs solutions digitales sont parfaites pour les freelances.',
                'type' => 'text',
                'rating' => 4,
                'source' => 'Facebook',
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 2,
                'created_by' => $adminUser->id,
                'review_date' => now()->subDays(20),
            ],
            [
                'category_id' => $generalCategory->id,
                'client_name' => 'Karim Radi',
                'client_title' => 'Sales Manager',
                'client_company' => 'TechSolutions Maroc',
                'content' => 'Partenaire de confiance pour notre transformation digitale. Équipe professionnelle et solutions innovantes.',
                'type' => 'text',
                'rating' => 5,
                'source' => 'Google',
                'is_featured' => false,
                'is_published' => true,
                'sort_order' => 3,
                'created_by' => $adminUser->id,
                'review_date' => now()->subDays(25),
            ],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::create($testimonial);
        }

        $this->command->info('Testimonials seeded successfully!');
    }
}
