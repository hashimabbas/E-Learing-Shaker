// resources/js/components/public/AppNavbar.tsx (FINAL VERSION)
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { GraduationCap, Menu } from 'lucide-react';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { route } from 'ziggy-js';
import { useState } from 'react';

// --- NEW IMPORTS ---
import { NotificationBell } from '@/components/notification-bell';
import { LanguageSwitcher } from '@/components/language-switcher';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
// -------------------

interface AppNavbarProps {
    canRegister: boolean;
}

export default function AppNavbar({ canRegister }: AppNavbarProps) {
    const { auth, translations, locale } = (usePage().props as unknown) as SharedData & { translations: any, locale: string };
    const isRtl = locale === 'ar';
    const [open, setOpen] = useState(false);

    const navItems = [
        { name: translations.home || 'Home', href: route('welcome') },
        { name: translations.nav_portfolio || 'Portfolio', href: route('portfolio') },
        { name: translations.nav_about || 'About Me', href: route('about') },
    ];

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-black/10"
            dir={isRtl ? 'rtl' : 'ltr'}
        >
            <div className="absolute inset-0  dark:bg-black/70 backdrop-blur-md -z-10" style={{ backgroundColor: '#efe5dc' }} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
                {/* Mobile Menu Trigger */}
                <div className="flex md:hidden items-center gap-2">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-[#3e3838] hover:bg-black/5">
                                <Menu className="size-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={isRtl ? "right" : "left"} className="w-[300px] p-0 flex flex-col bg-background/95 backdrop-blur-xl">
                            <SheetHeader className="p-6 border-b border-border/50 text-left">
                                <SheetTitle className="font-black text-xl tracking-tight">
                                    {translations.navbar_logo_text || "Shaker Shams"}
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-2 p-4 pt-6">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setOpen(false)}
                                        className="flex items-center px-4 py-4 text-base font-bold text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-auto p-6 border-t border-border/50 bg-muted/30 dark:text-white">
                                {!auth.user ? (
                                    <div className="flex flex-col gap-3 bg-primary">
                                        <Link href={login().url} onClick={() => setOpen(false)}>
                                            <Button variant="outline" className="w-full h-12 rounded-xl font-bold dark:text-white dark:bg-white">
                                                {translations.nav_login || "Log In"}
                                            </Button>
                                        </Link>
                                        {canRegister && (
                                            <Link href={register().url} onClick={() => setOpen(false)}>
                                                <Button className="w-full h-12 rounded-xl font-black shadow-lg shadow-primary/20 dark:text-white dark:bg-white">
                                                    {translations.nav_signup || "Sign Up"}
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <Link href={dashboard().url} onClick={() => setOpen(false)}>
                                        <Button className="w-full h-12 rounded-xl font-black dark:text-white dark:bg-white">
                                            {translations.nav_dashboard || "Go to Dashboard"}
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <LanguageSwitcher />
                </div>

                {/* Logo and Workshop Name */}
                <Link href="/" className="hidden md:flex items-center gap-3 group">
                    <div className="flex flex-col">
                        <span className="text-base md:text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors text-[#3e3838]">
                            {translations.navbar_logo_text || "Shaker Shams Engineering Workshop"}
                        </span>
                        {/* <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-[#3e3838]/60">
                            {isRtl ? "ورشة تعليمية متكاملة" : "Integrated Educational Workshop"}
                        </span> */}
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm font-bold text-[#3e3838]/80 hover:text-primary transition-all relative py-2 group"
                        >
                            {item.name}
                            <span className="absolute bottom-0 text-[#3e3838]/80 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                        </Link>
                    ))}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="hidden md:flex items-center text-[#3e3838]/80 gap-4" >
                        <LanguageSwitcher />
                        <div className="h-6 w-px bg-black/10 mx-2" />
                    </div>

                    {auth.user ? (
                        <div className="flex items-center gap-3 md:gap-4 text-[#3e3838]/80">
                            <NotificationBell />
                            <Link href={dashboard().url}>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="rounded-xl font-black h-9 md:h-11 px-4 md:px-6 hover:scale-105 transition-transform"

                                >
                                    <span className="hidden sm:inline" >{translations.nav_dashboard || "Dashboard"}</span>
                                    <span className="sm:hidden" >{isRtl ? "الرئيسية" : "Dash"}</span>
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link href={login().url}>
                                <Button variant="ghost" size="sm" className="font-bold rounded-xl px-4 h-11 text-[#3e3838] hover:bg-black/5">
                                    {translations.nav_login || "Log In"}
                                </Button>
                            </Link>
                            {canRegister && (
                                <Link href={register().url}>
                                    <Button size="sm" className="font-black rounded-xl px-6 h-11 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                        {translations.nav_signup || "Sign Up"}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
