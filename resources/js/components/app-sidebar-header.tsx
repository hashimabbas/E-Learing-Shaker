import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { LanguageSwitcher } from '@/components/language-switcher';
import { NotificationBell } from './notification-bell';
import { usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { cn } from '@/lib/utils';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { translations } = (usePage().props as SharedData & { translations?: Record<string, string>; locale: string }) || {};
    const { count: cartCount } = useCart();

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex flex-1 items-center gap-2 min-w-0">
                <SidebarTrigger className="-ml-1 shrink-0" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <Link
                    href={route('cart.index')}
                    className={cn(
                        "relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                        cartCount > 0 && "text-primary"
                    )}
                    title={translations?.shopping_cart || "Shopping Cart"}
                >
                    <ShoppingCart className="size-5" />
                    {cartCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground ring-2 ring-background">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </Link>
                <NotificationBell />
                <LanguageSwitcher />
            </div>
        </header>
    );
}
