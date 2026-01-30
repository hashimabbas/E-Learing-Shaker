// resources/js/components/app-sidebar.tsx
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
    useSidebar,
} from '@/components/ui/sidebar';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
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
    Award,
    CheckCircle2,
    Sparkles,
    Hammer,
    X
} from 'lucide-react';
import { route } from 'ziggy-js';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function AppSidebar() {
    const { auth, translations, locale } = (usePage().props as unknown) as SharedData & { translations: any, locale: string };
    const user = auth.user;
    const { state, isMobile, setOpenMobile } = useSidebar();
    const isRtl = locale === 'ar';

    // --- Student Nav Items ---
    const studentNavItems: NavItem[] = [
        {
            title: translations.my_learning,
            href: route('student.learning'),
            icon: BookOpen,
        },
        {
            title: translations.course_catalog,
            href: route('courses.index'),
            icon: GraduationCap,
        },
        {
            title: translations.shopping_cart,
            href: route('cart.index'),
            icon: ShoppingCart,
        },
        {
            title: translations.wishlist,
            href: route('wishlist_index'),
            icon: Heart,
        },
        {
            title: translations.my_orders,
            href: route('orders.index'),
            icon: DollarSign,
        },
    ];

    // --- Instructor Nav Items ---
    const instructorNavItems: NavItem[] = [
        {
            title: translations.instructor_dashboard,
            href: route('instructor.dashboard'),
            icon: LayoutGrid,
        },
        {
            title: translations.my_courses,
            href: route('instructor.courses.index'),
            icon: ClipboardList,
        },
        {
            title: translations.sales_revenue,
            href: route('instructor.sales.index'),
            icon: DollarSign,
        },
        {
            title: translations.discussions_management || 'Student Discussions',
            href: route('instructor.discussions.index'),
            icon: MessageCircle,
        },
    ];

    // --- Admin Nav Items ---
    const adminNavItems: NavItem[] = [
        {
            title: translations.admin_dashboard,
            href: route('admin.dashboard'),
            icon: Wrench,
        },
        {
            title: translations.user_management,
            href: route('admin.users.index'),
            icon: Users,
        },
        {
            title: translations.course_approval,
            href: route('admin.courses.pending'),
            icon: ClipboardList,
        },
        {
            title: translations.financial_reports,
            href: route('admin.reports'),
            icon: DollarSign,
        },
        {
            title: translations.categories_management || 'Categories',
            href: route('admin.categories.index'),
            icon: LayoutGrid,
        },
        {
            title: translations.pending_payments || 'Pending Payments',
            href: route('admin.payments.pending'),
            icon: ClipboardList,
        },
        {
            title: translations.security_management || 'Security',
            href: route('admin.security.index'),
            icon: Shield,
        }
    ];

    let mainNavItems: NavItem[] = [];
    let userRole = 'Student';

    if (user) {
        if (user.is_admin) {
            mainNavItems = adminNavItems;
            userRole = isRtl ? 'مشرف' : 'Administrator';
        } else if (user.is_instructor) {
            mainNavItems = instructorNavItems;
            userRole = isRtl ? 'مدرس' : 'Instructor';
        } else {
            mainNavItems = studentNavItems;
            userRole = isRtl ? 'طالب' : 'Student';
        }
    } else {
        mainNavItems = [
            {
                title: translations.course_catalog,
                href: route('courses.index'),
                icon: GraduationCap,
            },
        ];
    }

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="sidebar-position border-r border-sidebar-border bg-sidebar"
        >
            {/* Sidebar Branding & Identity */}
            <SidebarHeader className="p-4 relative overflow-hidden">
                {/* Mobile Close Button */}
                {isMobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 z-20 h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm text-foreground hover:bg-background md:hidden"
                        onClick={() => setOpenMobile(false)}
                    >
                        <X className="size-4" />
                    </Button>
                )}

                {/* Visual Identity Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />

                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent h-auto px-1 py-2">
                            <Link
                                href={user ? route('courses.index') : route('welcome')}
                                prefetch
                                className="flex items-center gap-3 group"
                            >
                                <div className="relative flex aspect-square size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-amber-600 shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/40">
                                    <Hammer className="size-6 text-primary-foreground fill-current" />
                                    <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background text-[8px] text-foreground shadow-sm ring-2 ring-sidebar animate-pulse">
                                        <Award className="size-2.5" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0.5 leading-tight transition-all duration-300 group-data-[collapsible=icon]:opacity-0">
                                    <span className="font-black text-foreground text-sm tracking-tight leading-tight">
                                        Shaker Shams
                                    </span>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary leading-none">
                                            Workshop
                                        </span>
                                        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter hidden group-data-[state=expanded]:block">
                                            {userRole}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="scrollbar-hide py-2 px-3">
                {/* Identity Spotlight Card - Only shown when expanded */}
                <div className="mb-4 md:mb-6 group-data-[collapsible=icon]:hidden px-1">
                    <div className="p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] bg-sidebar-accent/50 border border-sidebar-border relative overflow-hidden group/card hover:bg-sidebar-accent transition-colors">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity" />
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <CheckCircle2 className="size-4" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/80">Expert Verified</span>
                        </div>
                        <p className="text-xs font-bold leading-tight text-foreground mb-3">
                            Learn Engineering From the Best
                        </p>
                        <Link href={route('courses.index')}>
                            <Button size="sm" variant="outline" className="h-8 w-full rounded-xl border-primary/20 bg-background text-[10px] font-black uppercase hover:bg-primary hover:text-primary-foreground transition-all">
                                View Catalog <Sparkles className="size-3 ml-1.5" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="p-4 border-t border-sidebar-border">
                {user ? (
                    <div className="rounded-2xl bg-sidebar-accent/50 p-1 ring-1 ring-sidebar-border transition-all hover:bg-sidebar-accent hover:ring-primary/20">
                        <NavUser />
                    </div>
                ) : (
                    <div className="p-1 w-full transition-opacity group-data-[collapsible=icon]:opacity-0">
                        <Link href={route('login')} className="block">
                            <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-amber-600 text-primary-foreground font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/10 hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95">
                                Login Now
                            </Button>
                        </Link>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
