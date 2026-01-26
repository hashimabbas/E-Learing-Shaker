<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin Account
        User::updateOrCreate(
            ['email' => 'admin@test.com'],
            ['name' => 'System Admin', 'password' => Hash::make('password'), 'role' => 'admin']
        );

        // 2. Instructor Account
        User::updateOrCreate(
            ['email' => 'instructor@test.com'],
            ['name' => 'Test Instructor', 'password' => Hash::make('password'), 'role' => 'instructor']
        );

        // 3. Student Account
        User::updateOrCreate(
            ['email' => ' '],
            ['name' => 'Test Student', 'password' => Hash::make('password'), 'role' => 'student']
        );
    }
}
