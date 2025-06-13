<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Closure;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Symfony\Component\Console\Helper\ProgressBar;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('Seeding database...');

        // Create super_admin role if it doesn't exist
        $this->command->info('Creating super_admin role if not exists...');
        if(!Role::where('name', 'super_admin')->exists()) {
            Role::create(['name' => 'super_admin']);
            $this->command->info('super_admin role created.');
        } else {
            $this->command->info('super_admin role already exists.');
        }

        // Create a super_admin user if it doesn't exist
        $this->command->info('Creating super_admin user if not exists...');
        $adminEmail = 'ayman@gmail.com';

        if(!User::where('email', $adminEmail)->exists()) {
            $user = User::create([
                'name' => 'ayman',
                'email' => $adminEmail,
                'password' => Hash::make('12345678'),
            ]);

            $adminRole = Role::where('name', 'super_admin')->first();
            $user->assignRole($adminRole);

            $this->command->info('super_admin user created.');
        } else {
            $this->command->info('super_admin user already exists.');
        }

        // Create random users with factory and progress bar
        $this->command->info(PHP_EOL . 'Creating random users...');

        $usersToCreate = 9;
        $progressBar = $this->command->getOutput()->createProgressBar($usersToCreate);
        $progressBar->start();

        $users = new Collection();
        for ($i = 0; $i < $usersToCreate; $i++) {
            $users->push(User::factory()->create());
            $progressBar->advance();
        }

        $progressBar->finish();
        $this->command->info(PHP_EOL . 'Random users created successfully.');

        // Call other seeders
        $this->call([
            PackSeeder::class,
        ]);

        $this->command->info('Database seeding completed successfully!');
    }
}
