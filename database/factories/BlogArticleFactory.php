<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BlogArticle>
 */
class BlogArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categoryNames = [
            [
                'fr' => 'Actualités Tech',
                'ar' => 'أخبار التقنية',
                'en' => 'Tech News'
            ],
            [
                'fr' => 'Design & Créativité',
                'ar' => 'التصميم والإبداع',
                'en' => 'Design & Creativity'
            ],
            [
                'fr' => 'Business & Marketing',
                'ar' => 'الأعمال والتسويق',
                'en' => 'Business & Marketing'
            ],
            [
                'fr' => 'Développement Web',
                'ar' => 'تطوير الويب',
                'en' => 'Web Development'
            ],
            [
                'fr' => 'Intelligence Artificielle',
                'ar' => 'الذكاء الاصطناعي',
                'en' => 'Artificial Intelligence'
            ],
            [
                'fr' => 'E-commerce',
                'ar' => 'التجارة الإلكترونية',
                'en' => 'E-commerce'
            ],
            [
                'fr' => 'Mobile & Apps',
                'ar' => 'الهاتف المحمول والتطبيقات',
                'en' => 'Mobile & Apps'
            ],
            [
                'fr' => 'Sécurité Informatique',
                'ar' => 'الأمن السيبراني',
                'en' => 'Cybersecurity'
            ],
            [
                'fr' => 'Startups & Innovation',
                'ar' => 'الشركات الناشئة والابتكار',
                'en' => 'Startups & Innovation'
            ],
            [
                'fr' => 'Formation & Éducation',
                'ar' => 'التدريب والتعليم',
                'en' => 'Training & Education'
            ],
            [
                'fr' => 'Réseaux Sociaux',
                'ar' => 'وسائل التواصل الاجتماعي',
                'en' => 'Social Media'
            ],
            [
                'fr' => 'Cloud Computing',
                'ar' => 'الحوسبة السحابية',
                'en' => 'Cloud Computing'
            ],
            [
                'fr' => 'Data Science',
                'ar' => 'علم البيانات',
                'en' => 'Data Science'
            ],
            [
                'fr' => 'UX/UI Design',
                'ar' => 'تصميم تجربة المستخدم',
                'en' => 'UX/UI Design'
            ],
            [
                'fr' => 'Blockchain & Crypto',
                'ar' => 'البلوك تشين والعملات المشفرة',
                'en' => 'Blockchain & Crypto'
            ],
        ];

        $categoryDescriptions = [
            [
                'fr' => 'Les dernières actualités du monde de la technologie et innovations',
                'ar' => 'آخر أخبار عالم التكنولوجيا والابتكارات',
                'en' => 'Latest news from the tech world and innovations'
            ],
            [
                'fr' => 'Inspirations et conseils en design graphique et créativité',
                'ar' => 'إلهامات ونصائح في التصميم الجرافيكي والإبداع',
                'en' => 'Inspirations and tips in graphic design and creativity'
            ],
            [
                'fr' => 'Stratégies et conseils pour entreprises et marketing digital',
                'ar' => 'استراتيجيات ونصائح للشركات والتسويق الرقمي',
                'en' => 'Strategies and advice for businesses and digital marketing'
            ],
            [
                'fr' => 'Tutoriels et techniques de développement web moderne',
                'ar' => 'دروس وتقنيات تطوير الويب الحديثة',
                'en' => 'Tutorials and modern web development techniques'
            ],
            [
                'fr' => 'Exploration des technologies d\'intelligence artificielle',
                'ar' => 'استكشاف تقنيات الذكاء الاصطناعي',
                'en' => 'Exploring artificial intelligence technologies'
            ],
        ];

        $icons = [
            'heroicon-o-computer-desktop',
            'heroicon-o-camera',
            'heroicon-o-briefcase',
            'heroicon-o-code-bracket',
            'heroicon-o-cpu-chip',
            'heroicon-o-shopping-cart',
            'heroicon-o-device-phone-mobile',
            'heroicon-o-shield-check',
            'heroicon-o-light-bulb',
            'heroicon-o-academic-cap',
            'heroicon-o-megaphone',
            'heroicon-o-cloud',
            'heroicon-o-chart-bar',
            'heroicon-o-paint-brush',
            'heroicon-o-currency-bitcoin',
        ];

        $colors = [
            '#3B82F6', // Blue
            '#8B5CF6', // Purple
            '#10B981', // Green
            '#F59E0B', // Yellow
            '#EF4444', // Red
            '#6366F1', // Indigo
            '#EC4899', // Pink
            '#14B8A6', // Teal
            '#F97316', // Orange
            '#84CC16', // Lime
            '#06B6D4', // Cyan
            '#8B5A2B', // Brown
            '#6B7280', // Gray
            '#DC2626', // Red-600
            '#7C3AED', // Violet
        ];

        $selectedCategory = fake()->randomElement($categoryNames);
        $selectedDescription = fake()->randomElement($categoryDescriptions);

        return [
            'name' => $selectedCategory,
            'slug' => [
                'fr' => Str::slug($selectedCategory['fr']),
                'ar' => Str::slug($selectedCategory['ar']),
                'en' => Str::slug($selectedCategory['en'])
            ],
            'description' => $selectedDescription,
            'icon' => fake()->randomElement($icons),
            'is_active' => fake()->boolean(85),
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    /**
     * Indicate that the category is active.
     */
    public function active(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_active' => true,
        ]);
    }

    /**
     * Indicate that the category is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Create a tech-focused category.
     */
    public function tech(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => [
                'fr' => 'Technologie',
                'ar' => 'التكنولوجيا',
                'en' => 'Technology'
            ],
            'slug' => [
                'fr' => 'technologie',
                'ar' => 'altiknulujia',
                'en' => 'technology'
            ],
            'description' => [
                'fr' => 'Tout sur les dernières innovations technologiques',
                'ar' => 'كل شيء عن أحدث الابتكارات التكنولوجية',
                'en' => 'Everything about the latest technological innovations'
            ],
            'icon' => 'heroicon-o-computer-desktop',
            'color' => '#3B82F6',
        ]);
    }

    /**
     * Create a design-focused category.
     */
    public function design(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => [
                'fr' => 'Design',
                'ar' => 'التصميم',
                'en' => 'Design'
            ],
            'slug' => [
                'fr' => 'design',
                'ar' => 'altasmim',
                'en' => 'design'
            ],
            'description' => [
                'fr' => 'Inspirations et tendances en design graphique',
                'ar' => 'إلهامات واتجاهات التصميم الجرافيكي',
                'en' => 'Inspirations and trends in graphic design'
            ],
            'icon' => 'heroicon-o-camera',
            'color' => '#8B5CF6',
        ]);
    }

    /**
     * Create a business-focused category.
     */
    public function business(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => [
                'fr' => 'Business',
                'ar' => 'الأعمال',
                'en' => 'Business'
            ],
            'slug' => [
                'fr' => 'business',
                'ar' => 'alaaemal',
                'en' => 'business'
            ],
            'description' => [
                'fr' => 'Conseils et stratégies pour entrepreneurs',
                'ar' => 'نصائح واستراتيجيات لرجال الأعمال',
                'en' => 'Tips and strategies for entrepreneurs'
            ],
            'icon' => 'heroicon-o-briefcase',
            'color' => '#10B981',
        ]);
    }
}
