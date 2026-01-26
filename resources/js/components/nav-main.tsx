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
    return (
        <SidebarGroup className="px-3 py-4">
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 mb-2 px-2">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1">
                {items.map((item) => {
                    const isActive = page.url.startsWith(resolveUrl(item.href));
                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                tooltip={{ children: item.title }}
                                className={cn(
                                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group/item",
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold shadow-[inset_0_0_20px_rgba(var(--primary),0.05)]"
                                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <Link href={item.href} prefetch className="w-full h-full flex items-center">
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                    )}
                                    {item.icon && (
                                        <item.icon className={cn(
                                            "size-5 transition-transform duration-200 group-hover/item:scale-110",
                                            isActive ? "text-primary" : "text-muted-foreground/70 group-hover/item:text-sidebar-accent-foreground"
                                        )} />
                                    )}
                                    <span className="truncate">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
