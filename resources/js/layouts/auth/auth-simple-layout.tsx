import AppLogoIcon from '@/components/app-logo-icon';
import { welcome } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { type SharedData } from '@/types';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { locale } = usePage<SharedData>().props;
    const isRtl = locale === 'ar';

    return (
        <div
            className="flex min-h-svh flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950 p-6 md:p-10 relative overflow-hidden"
            dir={isRtl ? "rtl" : "ltr"}
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-6">
                        <Link
                            href={welcome()}
                            className="flex flex-col items-center gap-2 group transition-transform hover:scale-105"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 shadow-xl shadow-primary/10 border border-slate-100 dark:border-slate-800 transition-all group-hover:shadow-primary/20">
                                <AppLogoIcon className="size-10 fill-primary" />
                            </div>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400">
                                {title}
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none p-8 md:p-10 rounded-3xl">
                        {children}
                    </div>

                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} Shaker Shams Workshops. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
