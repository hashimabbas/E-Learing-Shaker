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
                                    item.isHighlighted
                                        ? "bg-red-600/10 text-red-500 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                                        : (isActive
                                            ? "bg-primary/10 text-primary font-bold border border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.05)]"
                                            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border border-transparent")
                                )}
                            >
                                <Link
                                    href={item.href}
                                    prefetch={item.title.toLowerCase().includes('cart') ? false : undefined}
                                    className="w-full h-full flex items-center gap-3"
                                >
                                    {/* Active/Highlight State Indicator Glower */}
                                    {(isActive || item.isHighlighted) && (
                                        <div className={cn(
                                            "absolute top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full blur-[2px]",
                                            item.isHighlighted
                                                ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"
                                                : "bg-primary shadow-[0_0_15px_rgba(var(--primary),0.8)]",
                                            isRtl ? "right-0" : "left-0"
                                        )} />
                                    )}

                                    {item.icon && (
                                        <div className="relative">
                                            <item.icon className={cn(
                                                "size-5 transition-all duration-300 group-hover/item:scale-110",
                                                item.isHighlighted ? "text-red-500" : (isActive ? "text-primary" : "text-muted-foreground/70 group-hover/item:text-sidebar-accent-foreground")
                                            )} />
                                            {item.isHighlighted && (
                                                <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    <span className={cn(
                                        "truncate group-hover/item:translate-x-1 transition-transform duration-300 font-bold",
                                        item.isHighlighted ? "text-red-500 font-black" : (isActive && "text-primary")
                                    )}>
                                        {item.title}
                                    </span>

                                    {item.badge !== undefined && item.badge > 0 && (
                                        <span className={cn(
                                            "ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black text-white shadow-lg ring-1 ring-white/20 transition-transform duration-500 group-hover/item:scale-110",
                                            item.isHighlighted ? "bg-red-600 animate-bounce" : "bg-primary"
                                        )}>
                                            {item.badge}
                                        </span>
                                    )}

                                    {/* Hover Shine Effect */}
                                    <div className={cn(
                                        "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/item:animate-[shimmer_2s_infinite]",
                                        item.isHighlighted && "via-red-500/10"
                                    )} />
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
