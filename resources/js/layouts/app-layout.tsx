import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { usePage, Head } from '@inertiajs/react';
import { toast } from "sonner";

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    title?: string;
}

export default ({ children, breadcrumbs, title, ...props }: AppLayoutProps) => {
    // 1. Get the shared locale prop
    const { locale } = usePage().props as any;
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
        // NOTE: The flash messages must be cleared after being read
        // Inertia's share logic (in HandleInertiaRequests.php) should handle this automatically.
    }, [flash]);
    // 2. Add the useEffect hook to watch the locale and update document direction
    useEffect(() => {
        const isRtl = locale === 'ar';
        const htmlElement = document.documentElement;

        // Set direction
        htmlElement.dir = isRtl ? 'rtl' : 'ltr';

        // Optionally set language for better accessibility
        htmlElement.lang = locale;

    }, [locale]); // The effect runs on mount and every time the locale prop changes

    return (
        <>
            {title && <Head title={title} />}
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
        </>
    );
}
