// resources/js/components/public/AppNavbar.tsx (FINAL VERSION)
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { GraduationCap } from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';

// --- NEW IMPORTS ---
import { NotificationBell } from '@/components/notification-bell'; // Assumed to be created
import { LanguageSwitcher } from '@/components/language-switcher'; // Assumed to be created
// -------------------

interface AppNavbarProps {
    canRegister: boolean;
}

export default function AppNavbar({ canRegister }: AppNavbarProps) {
    const { auth } = usePage<SharedData>().props;

    const navItems = [
        { name: 'Features', href: '#features' },
        { name: 'Categories', href: '#categories' },
        { name: 'About Us', href: '/about' },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b dark:bg-black/95">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
                    {/* <GraduationCap className="w-6 h-6 mr-2 text-primary" /> */}
                    {/* <img src="/images/identity.jpeg" alt="Logo" className="w-8 h-8 mr-2 rounded-full object-cover border border-gray-200 dark:border-gray-700" /> */}
                    <img src="/images/logo.svg" alt="مهندس شاكر" className="h-10 w-auto mr-2" />
                    {/* E-Learning */}
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-6 text-sm">
                    {navItems.map(item => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-gray-600 hover:text-primary transition-colors dark:text-gray-300 dark:hover:text-white"
                        >
                            {item.name}
                        </a>
                    ))}
                </nav>

                {/* Auth Buttons & Utilities (CRITICAL INTEGRATION POINT) */}
                <nav className="flex items-center gap-2">

                    {/* 1. Language Switcher (Always visible) */}
                    <LanguageSwitcher />

                    {auth.user ? (
                        <>
                            {/* 2. Notification Bell (Only for logged-in users) */}
                            <NotificationBell />

                            <Link href={dashboard()}>
                                <Button variant="secondary" size="sm">
                                    Dashboard
                                </Button>
                            </Link>
                        </>
                    ) : (
                        // Guest Buttons
                        <>
                            <Link href={login()}>
                                <Button variant="ghost" size="sm">
                                    Log In
                                </Button>
                            </Link>
                            {canRegister && (
                                <Link href={register()}>
                                    <Button size="sm">Sign Up</Button>
                                </Link>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header >
    );
}
