<?php

namespace Database\Seeders;

use App\Models\BlogArticle;
use App\Models\BlogCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds
     */
    public function run(): void
    {
        // Create Blog categories
        $this->command->info('Creating random blog categories...');

        $blogCategoriesToCreate = 10;
        $progressBar = $this->command->getOutput()->createProgressBar($blogCategoriesToCreate);
        $progressBar->start();

        $techCategory = BlogCategory::factory()->tech()->create();
        $progressBar->advance();

        $designCategory = BlogCategory::factory()->design()->create();
        $progressBar->advance();

        $businessCategory = BlogCategory::factory()->business()->create();
        $progressBar->advance();

        for ($i = 0; $i < $blogCategoriesToCreate; $i++) {
            BlogCategory::factory()->create();
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->command->info(PHP_EOL . 'Blog categories created successfully');

        // Create Blog Articles
        $this->command->info('Seeding Blog Articles...');

        // Pre-count the number of articles to be seeded
        $staticCount = 15 + 8 + 5 + 6 + 10 + 3; // Fixed-count batches
        $dynamicCount = BlogCategory::count() * 5; // Assume average 5 per category
        $totalArticles = $staticCount + $dynamicCount;

        $bar = $this->command->getOutput()->createProgressBar($totalArticles);
        $bar->start();

        // Helper to get random user id
        $randomAuthor = fn() => User::inRandomOrder()->value('id');

        // Published articles
        BlogArticle::factory(15)
            ->published()
            ->withFeaturedImage()
            ->create([
                'category_id' => $techCategory->id,
                'author_id' => $randomAuthor(),
            ])
            ->each(fn() => $bar->advance());

        // Draft articles
        BlogArticle::factory(8)
            ->draft()
            ->create([
                'category_id' => $designCategory->id,
                'author_id' => $randomAuthor(),
            ])
            ->each(fn() => $bar->advance());

        // Scheduled articles
        BlogArticle::factory(5)
            ->scheduled()
            ->withFeaturedImage()
            ->create([
                'category_id' => $businessCategory->id,
                'author_id' => $randomAuthor(),
            ])
            ->each(fn() => $bar->advance());

        // Featured articles
        BlogArticle::factory(6)
            ->featured()
            ->published()
            ->popular()
            ->withFeaturedImage()
            ->create([
                'author_id' => $randomAuthor(),
            ])
            ->each(fn() => $bar->advance());

        // Recent articles
        BlogArticle::factory(10)
            ->recent()
            ->withFeaturedImage()
            ->create([
                'author_id' => $randomAuthor(),
            ])
            ->each(fn() => $bar->advance());

        // Articles for all categories
        BlogCategory::all()->each(function ($category) use ($bar, $randomAuthor) {
            $count = fake()->numberBetween(2, 8);
            BlogArticle::factory($count)
                ->create([
                    'category_id' => $category->id,
                    'author_id' => $randomAuthor(),
                ])
                ->each(fn() => $bar->advance());
        });

        // Specific themed articles
        BlogArticle::factory()->tech()->published()->featured()->create([
            'category_id' => $techCategory->id,
            'author_id' => $randomAuthor(),
        ]);
        $bar->advance();

        BlogArticle::factory()->design()->published()->withFeaturedImage()->create([
            'category_id' => $designCategory->id,
            'author_id' => $randomAuthor(),
        ]);
        $bar->advance();

        BlogArticle::factory()->business()->scheduled()->create([
            'category_id' => $businessCategory->id,
            'author_id' => $randomAuthor(),
        ]);
        $bar->advance();

        $bar->finish();

        $this->command->info(PHP_EOL . 'Blog Articles seeded successfully!');
    }
}
