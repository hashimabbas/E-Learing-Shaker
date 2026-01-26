import { Head, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';

import AppNavbar from '@/components/public/AppNavbar';
import AppFooter from '@/components/public/AppFooter';

interface PublicLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function PublicLayout({
    children,
    title,
}: PublicLayoutProps) {
    const { props } = usePage<SharedData>();

    // Safe default
    const canRegister =
        typeof props.canRegister === 'boolean'
            ? props.canRegister
            : true;

    return (
        <>
            <Head title={title ? `${title} | E-Learning` : 'E-Learning'} />

            <div className="min-h-screen antialiased flex flex-col bg-white dark:bg-gray-900">
                {/* Navbar */}
                <AppNavbar canRegister={canRegister} />

                {/* Main content */}
                <main className="flex-1 pt-16">
                    {children}
                </main>

                {/* Footer */}
                <AppFooter />
            </div>
        </>
    );
}
