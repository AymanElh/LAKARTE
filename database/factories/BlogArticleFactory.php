<?php

namespace Database\Factories;

use App\Models\BlogCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\BlogArticle>
 */
class BlogArticleFactory extends Factory
{
    public function definition()
    {
        $articleTitles = [
            [
                'fr' => 'L\'avenir de l\'Intelligence Artificielle au Maroc',
                'ar' => 'مستقبل الذكاء الاصطناعي في المغرب',
                'en' => 'The Future of AI in Morocco'
            ],
            [
                'fr' => 'Tendances Design 2025 : Ce qu\'il faut retenir',
                'ar' => 'اتجاهات التصميم 2025: ما يجب تذكره',
                'en' => 'Design Trends 2025: What to Remember'
            ],
            [
                'fr' => 'Comment développer une startup tech réussie',
                'ar' => 'كيفية تطوير شركة تقنية ناشئة ناجحة',
                'en' => 'How to Build a Successful Tech Startup'
            ],
            [
                'fr' => 'Les meilleures pratiques du développement web moderne',
                'ar' => 'أفضل ممارسات تطوير الويب الحديث',
                'en' => 'Best Practices in Modern Web Development'
            ],
            [
                'fr' => 'E-commerce au Maroc : Opportunités et défis',
                'ar' => 'التجارة الإلكترونية في المغرب: الفرص والتحديات',
                'en' => 'E-commerce in Morocco: Opportunities and Challenges'
            ],
            [
                'fr' => 'Sécurité informatique : Protéger votre entreprise',
                'ar' => 'الأمن السيبراني: حماية شركتك',
                'en' => 'Cybersecurity: Protecting Your Business'
            ],
            [
                'fr' => 'L\'importance du branding pour les PME',
                'ar' => 'أهمية العلامة التجارية للشركات الصغيرة والمتوسطة',
                'en' => 'The Importance of Branding for SMEs'
            ],
            [
                'fr' => 'Applications mobiles : Tendances et innovations',
                'ar' => 'تطبيقات الهاتف المحمول: الاتجاهات والابتكارات',
                'en' => 'Mobile Apps: Trends and Innovations'
            ],
            [
                'fr' => 'Cloud Computing : Révolutionner l\'entreprise',
                'ar' => 'الحوسبة السحابية: ثورة في عالم الأعمال',
                'en' => 'Cloud Computing: Revolutionizing Business'
            ],
            [
                'fr' => 'Marketing digital : Stratégies gagnantes 2025',
                'ar' => 'التسويق الرقمي: استراتيجيات رابحة 2025',
                'en' => 'Digital Marketing: Winning Strategies 2025'
            ],
        ];

        $selectedTitle = fake()->randomElement($articleTitles);

        $frenchParagraphs = [
            'L\'innovation technologique transforme rapidement notre façon de travailler et de vivre. Les entreprises marocaines doivent s\'adapter à ces changements pour rester compétitives.',
            'Dans un monde de plus en plus connecté, la digitalisation devient une nécessité plutôt qu\'un luxe. Les organisations qui embrassent le changement prospèrent.',
            'La créativité et l\'innovation sont au cœur de toute stratégie réussie. Il est essentiel de repenser nos approches traditionnelles.',
            'Les technologies émergentes offrent des opportunités sans précédent pour les entrepreneurs visionnaires.',
            'L\'expérience utilisateur reste primordiale dans le développement de tout produit ou service numérique.',
        ];

        $arabicParagraphs = [
            'تحول الابتكار التقني بسرعة طريقة عملنا وحياتنا. يجب على الشركات المغربية التكيف مع هذه التغييرات للبقاء قادرة على المنافسة.',
            'في عالم متصل بشكل متزايد، تصبح الرقمنة ضرورة وليس رفاهية. المنظمات التي تتبنى التغيير تزدهر.',
            'الإبداع والابتكار في قلب أي استراتيجية ناجحة. من الضروري إعادة التفكير في مناهجنا التقليدية.',
            'التقنيات الناشئة توفر فرصًا غير مسبوقة لرجال الأعمال ذوي الرؤية.',
            'تجربة المستخدم تبقى أساسية في تطوير أي منتج أو خدمة رقمية.',
        ];

        $englishParagraphs = [
            'Technological innovation is rapidly transforming how we work and live. Moroccan companies must adapt to these changes to remain competitive.',
            'In an increasingly connected world, digitalization becomes a necessity rather than a luxury. Organizations that embrace change thrive.',
            'Creativity and innovation are at the heart of any successful strategy. It\'s essential to rethink our traditional approaches.',
            'Emerging technologies offer unprecedented opportunities for visionary entrepreneurs.',
            'User experience remains paramount in developing any digital product or service.',
        ];

        $content = [
            'fr' => '<p>' . implode('</p><p>', fake()->randomElements($frenchParagraphs, fake()->numberBetween(3, 5))) . '</p>',
            'ar' => '<p>' . implode('</p><p>', fake()->randomElements($arabicParagraphs, fake()->numberBetween(3, 5))) . '</p>',
            'en' => '<p>' . implode('</p><p>', fake()->randomElements($englishParagraphs, fake()->numberBetween(3, 5))) . '</p>',
        ];

        $excerpt = [
            'fr' => fake()->text(200),
            'ar' => 'هذا نص تجريبي باللغة العربية يوضح محتوى المقال والأفكار الرئيسية التي يتناولها.',
            'en' => fake()->text(200),
        ];

        $tags = [
            'Technologie', 'Innovation', 'Design', 'Business', 'Marketing',
            'Développement', 'Startup', 'Digital', 'IA', 'Mobile',
            'Web', 'E-commerce', 'Sécurité', 'Cloud', 'UX/UI'
        ];

        $status = fake()->randomElement(['draft', 'published', 'scheduled']);
        $publishedAt = null;
        $scheduledAt = null;

        if ($status === 'published') {
            $publishedAt = fake()->dateTimeBetween('-6 months', 'now');
        } else {
            $publishedAt = fake()->dateTimeBetween('now', '+1 month');
        }

        return [
            'category_id' => BlogCategory::factory(),
            'author_id' => User::factory(),
            'title' => $selectedTitle,
            'slug' => [
                'fr' => Str::slug($selectedTitle['fr']),
                'ar' => Str::slug($selectedTitle['ar']),
                'en' => Str::slug($selectedTitle['en']),
            ],
            'excerpt' => $excerpt,
            'content' => $content,
            'meta_title' => [
                'fr' => Str::limit($selectedTitle['fr'], 55),
                'ar' => Str::limit($selectedTitle['ar'], 55),
                'en' => Str::limit($selectedTitle['en'], 55),
            ],
            'meta_description' => [
                'fr' => Str::limit($excerpt['fr'], 155),
                'ar' => Str::limit($excerpt['ar'], 155),
                'en' => Str::limit($excerpt['en'], 155),
            ],
            'featured_image' => null, // Will be set by states if needed
            'status' => $status,
            'published_at' => $publishedAt,
            'scheduled_at' => $scheduledAt,
            'is_featured' => fake()->boolean(15), // 15% chance of being featured
            'allow_comments' => fake()->boolean(80), // 80% allow comments
            'tags' => fake()->randomElements($tags, fake()->numberBetween(2, 6)),
            'views_count' => $status === 'published' ? fake()->numberBetween(0, 5000) : 0,
            'reading_time' => fake()->numberBetween(2, 15), // 2-15 minutes
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    /**
     * Indicates the article is published
     *
     * @return $this
     */
    public function published(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
            'scheduled_at' => null,
            'views_count' => fake()->numberBetween(50, 5000)
        ]);
    }

    /**
     * Indicate the article is draft
     *
     * @return $this
     */
    public function draft(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
            'scheduled_at' => null,
            'views_count' => 0,
        ]);
    }

    /**
     * Indicate that the article is scheduled.
     */
    public function scheduled(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'scheduled',
            'published_at' => null,
            'scheduled_at' => fake()->dateTimeBetween('now', '+2 months'),
            'views_count' => 0,
        ]);
    }

    /**
     * Indicate that the article is featured.
     */
    public function featured(): static
    {
        return $this->state(fn(array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Add a featured image to the article.
     */
    public function withFeaturedImage(): static
    {
        return $this->state(fn(array $attributes) => [
            'featured_image' => 'blog/featured-images/' . fake()->uuid() . '.jpg',
        ]);
    }

    /**
     * Create a tech-focused article.
     */
    public function tech(): static
    {
        return $this->state(fn(array $attributes) => [
            'title' => [
                'fr' => 'Intelligence Artificielle : Révolution Technologique',
                'ar' => 'الذكاء الاصطناعي: ثورة تقنية',
                'en' => 'Artificial Intelligence: Technological Revolution'
            ],
            'slug' => [
                'fr' => 'intelligence-artificielle-revolution-technologique',
                'ar' => 'aldhaka-alaisnaeii-thawra-tiqnia',
                'en' => 'artificial-intelligence-technological-revolution'
            ],
            'tags' => ['IA', 'Technologie', 'Innovation', 'Futur', 'Machine Learning'],
        ]);
    }

    /**
     * Create a design-focused article.
     */
    public function design(): static
    {
        return $this->state(fn(array $attributes) => [
            'title' => [
                'fr' => 'Tendances Design : L\'Art du Visuel Moderne',
                'ar' => 'اتجاهات التصميم: فن البصري الحديث',
                'en' => 'Design Trends: The Art of Modern Visuals'
            ],
            'slug' => [
                'fr' => 'tendances-design-art-visuel-moderne',
                'ar' => 'aitijahat-altasmim-fan-albasarii-alhadith',
                'en' => 'design-trends-art-modern-visuals'
            ],
            'tags' => ['Design', 'Créativité', 'Tendances', 'Visual', 'UX/UI'],
        ]);
    }

    /**
     * Create a business-focused article.
     */
    public function business(): static
    {
        return $this->state(fn(array $attributes) => [
            'title' => [
                'fr' => 'Stratégies Business : Réussir en 2025',
                'ar' => 'استراتيجيات الأعمال: النجاح في 2025',
                'en' => 'Business Strategies: Succeeding in 2025'
            ],
            'slug' => [
                'fr' => 'strategies-business-reussir-2025',
                'ar' => 'aistratijiiat-alaaemal-alnajah-fi-2025',
                'en' => 'business-strategies-succeeding-2025'
            ],
            'tags' => ['Business', 'Stratégie', 'Entrepreneuriat', 'Marketing', 'Croissance'],
        ]);
    }

    /**
     * Create an article with high engagement.
     */
    public function popular(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-3 months', '-1 month'),
            'is_featured' => true,
            'views_count' => fake()->numberBetween(2000, 10000),
            'allow_comments' => true,
        ]);
    }

    /**
     * Create a recent article.
     */
    public function recent(): static
    {
        return $this->state(fn(array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-1 week', 'now'),
            'views_count' => fake()->numberBetween(10, 500),
        ]);
    }
}
