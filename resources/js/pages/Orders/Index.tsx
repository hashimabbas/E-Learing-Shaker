// resources/js/pages/Orders/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Order, PaginatedData, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    Eye,
    Receipt,
    Calendar,
    Package,
    CheckCircle2,
    Clock,
    AlertCircle,
    History,
    ArrowRight,
    ShoppingBag
} from 'lucide-react';
import { route } from 'ziggy-js';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrdersIndexProps {
    orders: PaginatedData<Order & { items_count: number }>;
}

export default function OrdersIndex({ orders }: OrdersIndexProps) {
    const { translations, locale } = usePage<SharedData & { translations: any, locale: string }>().props;
    const isRtl = locale === 'ar';

    const statusConfig = {
        pending: {
            label: translations.orders_status_pending || 'Pending',
            color: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
            icon: Clock,
        },
        paid: {
            label: translations.orders_status_paid || 'Completed',
            color: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
            icon: CheckCircle2,
        },
        failed: {
            label: translations.orders_status_failed || 'Failed',
            color: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800',
            icon: AlertCircle,
        },
        refunded: {
            label: translations.orders_status_refunded || 'Refunded',
            color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
            icon: History,
        },
    };

    return (
        <AppLayout title={translations.orders_page_title || "Order History"}>
            <Head title={translations.orders_meta_title || "My Order History"} />

            <div className="bg-background min-h-screen pb-20" dir={isRtl ? "rtl" : "ltr"}>
                {/* Modern Header */}
                <div className="border-b bg-muted/30 py-10">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3">
                                    <Receipt className="h-8 w-8 text-primary" /> {translations.orders_purchase_history || "Purchase History"}
                                </h1>
                                <p className="mt-2 text-muted-foreground font-medium">
                                    {translations.orders_subtitle || "View and manage all your past course enrollments and receipts."}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Card className="px-6 py-3 border-none bg-background shadow-sm">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{translations.orders_total_count || "Total Orders"}</p>
                                    <p className="text-2xl font-black">{orders.total}</p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {orders.data.length > 0 ? (
                        <div className="space-y-4">
                            {/* Desktop Table-like header for list */}
                            <div className="hidden md:grid grid-cols-6 gap-4 px-6 text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                                <div className="col-span-1">{translations.orders_number || "Order #"}</div>
                                <div className="col-span-1">{translations.orders_date || "Date"}</div>
                                <div className="col-span-1 text-center">{translations.orders_courses_count || "Courses"}</div>
                                <div className="col-span-1">{translations.orders_total_amount || "Total Amount"}</div>
                                <div className="col-span-1">{translations.orders_status || "Status"}</div>
                                <div className={cn("col-span-1", isRtl ? "text-left" : "text-right")}>{translations.orders_actions || "Actions"}</div>
                            </div>

                            {orders.data.map((order) => {
                                const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
                                const StatusIcon = config.icon;

                                return (
                                    <Card key={order.id} className="group overflow-hidden border-none shadow-md hover:shadow-xl transition-all">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:grid md:grid-cols-6 gap-4 p-6 items-center">
                                                {/* Mobile Header */}
                                                <div className="flex w-full items-center justify-between md:hidden mb-4 border-b pb-4">
                                                    <span className="font-bold text-primary">{order.order_number}</span>
                                                    <Badge variant="outline" className={cn("flex items-center gap-1.5", config.color)}>
                                                        <StatusIcon className="h-3 w-3" /> {config.label}
                                                    </Badge>
                                                </div>

                                                {/* Desktop Fields */}
                                                <div className="hidden md:block col-span-1 font-bold text-primary tracking-tight">
                                                    {order.order_number}
                                                </div>

                                                <div className="flex w-full md:w-auto items-center md:col-span-1 text-sm text-muted-foreground font-medium">
                                                    <Calendar className={cn("h-4 w-4 md:hidden", isRtl ? "ml-2" : "mr-2")} />
                                                    {new Date(order.created_at).toLocaleDateString(locale === 'ar' ? 'ar-OM' : 'en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>

                                                <div className="flex w-full md:w-auto items-center justify-between md:justify-center md:col-span-1 text-sm">
                                                    <span className="md:hidden text-muted-foreground font-medium flex items-center">
                                                        <Package className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} /> {translations.orders_courses_count || "Courses"}:
                                                    </span>
                                                    <Badge variant="secondary" className="rounded-full">
                                                        {order.items_count} {order.items_count === 1 ? (translations.orders_course_singular || 'Course') : (translations.orders_course_plural || 'Courses')}
                                                    </Badge>
                                                </div>

                                                <div className="flex w-full md:w-auto items-center justify-between md:col-span-1">
                                                    <span className="md:hidden text-muted-foreground font-medium">{translations.orders_total_amount || "Total"}:</span>
                                                    <span className="text-lg font-black tracking-tight">{order.total_amount.toFixed(2)} {translations.course_price_currency || 'OMR'}</span>
                                                </div>

                                                <div className="hidden md:flex md:col-span-1">
                                                    <Badge variant="outline" className={cn("flex items-center gap-1.5 transition-colors group-hover:bg-primary/5", config.color)}>
                                                        <StatusIcon className="h-3.5 w-3.5" /> {config.label}
                                                    </Badge>
                                                </div>

                                                <div className={cn("flex w-full md:w-auto md:col-span-1 gap-2", isRtl ? "justify-start" : "justify-end")}>
                                                    <Link href={route('orders.show', order.order_number)} className="w-full md:w-auto">
                                                        <Button variant="outline" className="w-full md:w-auto group/btn">
                                                            {translations.orders_view_details || "View Details"} <ArrowRight className={cn("h-4 w-4 transition-transform", isRtl ? "mr-2 rotate-180 group-hover/btn:-translate-x-1" : "ml-2 group-hover/btn:translate-x-1")} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="py-24 text-center animate-in fade-in slide-in-from-bottom-5 duration-1000">
                            <div className="mx-auto mb-8 flex h-48 w-48 items-center justify-center rounded-full bg-muted/50 shadow-inner">
                                <ShoppingBag className="h-24 w-24 text-muted-foreground/20" />
                            </div>
                            <h2 className="mb-4 text-4xl font-black tracking-tight">{translations.orders_empty_title || "No purchases yet."}</h2>
                            <p className="mx-auto mb-12 max-w-lg text-lg text-muted-foreground">
                                {translations.orders_empty_desc || "You haven't started your learning journey yet. Dive into our catalog and find your first course!"}
                            </p>
                            <Link href={route('courses.index')}>
                                <Button size="lg" className="h-14 rounded-full px-12 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                                    {translations.orders_browse_catalog || "Browse Catalog"} <ArrowRight className={cn("h-5 w-5", isRtl ? "mr-2 rotate-180" : "ml-2")} />
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
