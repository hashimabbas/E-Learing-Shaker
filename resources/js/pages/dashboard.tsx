// resources/js/pages/Dashboard.tsx (FINAL VERSION - Redirect Component)
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard, student_learning } from '@/routes'; // Assume student_learning() is defined in your routes.ts
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

// Use a simple useEffect to trigger the redirect on load
export default function Dashboard() {

    // Final UX Fix: Redirect the user to their actual learning dashboard
    useEffect(() => {
        router.replace(route('student.learning'));
    }, []);

    // Display a loading message during the redirect process
    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-semibold mb-4">Redirecting to My Learning...</h1>
                <PlaceholderPattern className="size-32 stroke-primary/50" />
            </div>
        </AppLayout>
    );
}
