import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    GraduationCap,
    DollarSign,
    Users,
    ClipboardList,
    Wrench,
    ShoppingCart,
    Heart,
    MessageCircle,
    Shield,
} from 'lucide-react';
import AppLogoIcon from './app-logo-icon';
import { route } from 'ziggy-js';
import { Button } from './ui/button';

export function AppSidebar() {
    const { auth, translations } = usePage<SharedData & { translations: any }>().props;
    const user = auth.user;

    // --- Shared Nav Items ---
    const footerNavItems: NavItem[] = [
        // {
        //     title: translations.repository, // Access translation as property
        //     href: 'https://github.com/laravel/react-starter-kit',
        //     icon: Folder,
        // },
        // {
        //     title: translations.documentation, // Access translation as property
        //     href: 'https://laravel.com/docs/starter-kits#react',
        //     icon: BookOpen,
        // },
    ];

    // --- Student Nav Items ---
    const studentNavItems: NavItem[] = [
        {
            title: translations.my_learning, // Access translation as property
            href: route('student.learning'),
            icon: BookOpen,
        },
        // {
        //     title: translations.my_dashboard, // Access translation as property
        //     href: route('dashboard'),
        //     icon: LayoutGrid,
        // },
        {
            title: translations.course_catalog, // Access translation as property
            href: route('courses.index'),
            icon: GraduationCap,
        },
        {
            title: translations.shopping_cart, // Access translation as property
            href: route('cart.index'),
            icon: ShoppingCart,
        },
        {
            title: translations.wishlist, // Access translation as property
            href: route('wishlist_index'),
            icon: Heart,
        },
        {
            title: translations.my_orders, // Access translation as property
            href: route('orders.index'),
            icon: DollarSign,
        },
    ];

    // --- Instructor Nav Items ---
    const instructorNavItems: NavItem[] = [
        {
            title: translations.instructor_dashboard, // Access translation as property
            href: route('instructor.dashboard'),
            icon: LayoutGrid,
        },
        {
            title: translations.my_courses, // Access translation as property
            href: route('instructor.courses.index'),
            icon: ClipboardList,
        },
        {
            title: translations.sales_revenue, // Access translation as property
            href: route('instructor.sales.index'),
            icon: DollarSign,
        },
        // --- NEW: LINK TO DISCUSSIONS ---
        {
            title: translations.discussions_management || 'Student Discussions', // You need to add this string to your lang files
            href: route('instructor.discussions.index'),
            icon: MessageCircle,
        },
    ];

    // --- Admin Nav Items ---
    const adminNavItems: NavItem[] = [
        {
            title: translations.admin_dashboard, // Access translation as property
            href: route('admin.dashboard'),
            icon: Wrench,
        },
        {
            title: translations.user_management, // Access translation as property
            href: route('admin.users.index'),
            icon: Users,
        },
        {
            title: translations.course_approval, // Access translation as property
            href: route('admin.courses.pending'),
            icon: ClipboardList,
        },
        {
            title: translations.financial_reports, // Access translation as property
            href: route('admin.reports'),
            icon: DollarSign,
        },
        {
            title: 'Security',
            href: route('admin.security.index'),
            icon: Shield,
        }

    ];

    let mainNavItems: NavItem[] = [];

    if (user) {
        if (user.is_admin) {
            mainNavItems = adminNavItems;
        } else if (user.is_instructor) {
            mainNavItems = instructorNavItems;
        } else {
            mainNavItems = studentNavItems;
        }
    } else {
        // Guest navigation
        mainNavItems = [
            {
                title: translations.course_catalog, // Access translation as property
                href: route('courses.index'),
                icon: GraduationCap,
            },
        ];
    }

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="sidebar-position border-r-0 bg-slate-950/50 backdrop-blur-xl"
        >
            <SidebarHeader className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent px-2">
                            <Link
                                href={user ? mainNavItems[0].href : route('courses.index')}
                                prefetch
                                className="flex items-center gap-2 group"
                            >
                                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
                                    <AppLogoIcon className="size-6 text-white fill-current" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none transition-opacity group-data-[collapsible=icon]:opacity-0">
                                    <span className="font-bold text-white text-lg">Morpho</span>
                                    <span className="text-xs text-primary/80 font-medium">Academy</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="scrollbar-hide">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="p-4">
                <NavFooter items={footerNavItems} className="mt-auto" />

                {user ? (
                    <div className="rounded-2xl bg-white/5 p-1 ring-1 ring-white/10 transition-colors hover:bg-white/10">
                        <NavUser />
                    </div>
                ) : (
                    <div className="p-1 w-full transition-opacity group-data-[collapsible=icon]:opacity-0">
                        <Link href={route('login')} className="block">
                            <Button className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
