// resources/js/components/nav-main.tsx
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const isRtl = page.props.locale === 'ar';

    return (
        <SidebarGroup className="px-0 py-0">
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-2 px-3">
                {isRtl ? 'المنصة' : 'Platform Navigation'}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1.5">
                {items.map((item) => {
                    const isActive = page.url.startsWith(resolveUrl(item.href));
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    "relative flex items-center gap-3 px-3 py-3 md:py-5 rounded-2xl transition-all duration-300 group/item overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.05)]"
                                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent"
                                )}
                            >
                                <Link href={item.href} prefetch className="w-full h-full flex items-center">
                                    {/* Active State Indicator Glower */}
                                    {isActive && (
                                        <div className={cn(
                                            "absolute top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full blur-[2px] shadow-[0_0_15px_rgba(var(--primary),0.8)]",
                                            isRtl ? "right-0" : "left-0"
                                        )} />
                                    )}

                                    {item.icon && (
                                        <item.icon className={cn(
                                            "size-5 transition-all duration-300 group-hover/item:scale-110",
                                            isActive ? "text-primary" : (item.isHighlighted ? "text-red-500 animate-pulse" : "text-muted-foreground/70 group-hover/item:text-sidebar-accent-foreground")
                                        )} />
                                    )}
                                    <span className={cn(
                                        "truncate group-hover/item:translate-x-1 transition-transform duration-300",
                                        item.isHighlighted && !isActive && "text-red-600 font-black"
                                    )}>
                                        {item.title}
                                    </span>

                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-1 ring-white/10">
                                            {item.badge}
                                        </span>
                                    )}

                                    {/* Hover Shine Effect - subtle and theme-aware */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover/item:animate-[shimmer_1.5s_infinite]" />
                                </Link>

                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
