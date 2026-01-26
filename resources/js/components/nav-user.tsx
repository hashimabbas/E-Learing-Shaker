import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { route } from 'ziggy-js'; // <-- CRITICAL FIX: Ensure 'route' is imported for helper components


export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group flex items-center gap-3 p-2 rounded-xl border border-transparent hover:bg-sidebar-accent/50 hover:border-sidebar-border/50 transition-all duration-300 data-[state=open]:bg-sidebar-accent/80 data-[state=open]:backdrop-blur-md"
                            data-test="sidebar-menu-button"
                        >
                            <div className="flex-1 flex items-center min-w-0">
                                {auth.user ? (
                                    <UserInfo user={auth.user} />
                                ) : (
                                    <Link href={route('login')} className="text-sm font-medium">Log In</Link>
                                )}
                            </div>
                            <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl p-1"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                    ? 'left'
                                    : 'top'
                        }
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
