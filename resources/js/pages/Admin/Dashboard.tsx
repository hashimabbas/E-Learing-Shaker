import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Users, GraduationCap, ClipboardList, ArrowUpRight, Activity, TrendingUp, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface AdminDashboardProps {
    stats: {
        totalRevenue: number;
        totalStudents: number;
        totalInstructors: number;
        pendingCourses: number;
    };
    latestOrders: any[];
    latestRegistrations: any[];
}

const formatCurrency = (amount: number | string | null | undefined) => {
    const numericAmount = parseFloat(amount as any) || 0;
    return `OMR ${numericAmount.toFixed(2)}`;
};

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

// Reusable StatCard Component matching Instructor Dashboard
const StatCard = ({ title, value, icon: Icon, description, color, trend }: any) => (
    <Card className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
        {/* Background Decorative Circle */}
        <div className={cn("absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 opacity-10 rounded-full", `bg-${color}-500`)} />

        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
            <div className={cn("p-2 rounded-lg", `bg-${color}-500/10 text-${color}-600`)}>
                <Icon className="h-4 w-4" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-black tracking-tight">{value}</div>
            <div className="mt-2 flex items-center gap-1 text-xs font-bold text-muted-foreground">
                {description}
            </div>
        </CardContent>
    </Card>
);

export default function AdminDashboard({ stats, latestOrders, latestRegistrations }: AdminDashboardProps) {
    const { auth } = usePage<any>().props;

    return (
        <AppLayout>
            <Head title="Admin Dashboard" />

            <div className="bg-background min-h-screen pb-20">
                {/* Header Section */}
                <div className="border-b bg-muted/30 py-10">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3">
                                    <ShieldCheck className="h-8 w-8 text-primary" /> Admin Overview
                                </h1>
                                <p className="text-muted-foreground font-medium text-lg">
                                    Welcome back, <span className="text-foreground font-bold">{auth.user.name}</span>. System performance at a glance.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <a href="/telescope" target="_blank">
                                    <Button variant="outline" className="h-12 rounded-full px-6 font-bold">
                                        <Activity className="mr-2 h-5 w-5" /> System Health
                                    </Button>
                                </a>
                                <Link href={route('admin.reports')}>
                                    <Button className="h-12 rounded-full px-6 font-bold shadow-lg shadow-primary/20">
                                        <DollarSign className="mr-2 h-5 w-5" /> Financial Reports
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                        <StatCard
                            title="Total Revenue"
                            value={formatCurrency(stats.totalRevenue)}
                            icon={DollarSign}
                            description="All time revenue"
                            color="emerald"
                        />
                        <StatCard
                            title="Total Students"
                            value={stats.totalStudents.toLocaleString()}
                            icon={Users}
                            description="Active learners"
                            color="blue"
                        />
                        <StatCard
                            title="Instructors"
                            value={stats.totalInstructors}
                            icon={GraduationCap}
                            description="Course creators"
                            color="violet"
                        />
                        <Card className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer group" onClick={() => route('admin.courses.index', { published: 'false' })}>
                            <div className="absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 opacity-10 rounded-full bg-orange-500" />
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Pending Courses</CardTitle>
                                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
                                    <ClipboardList className="h-4 w-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black tracking-tight">{stats.pendingCourses}</div>
                                <div className="mt-2 flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:underline">
                                    Review Now <ArrowUpRight className="h-3 w-3" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                        {/* Recent Orders */}
                        <Card className="lg:col-span-4 border-none shadow-md overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
                                <CardDescription>Latest financial transactions on the platform</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className="w-[80px] pl-6">Order</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right pr-6">Amount</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {latestOrders && latestOrders.length > 0 ? (
                                            latestOrders.map((order) => (
                                                <TableRow key={order.id} className="hover:bg-muted/50 border-b border-muted/60 last:border-0">
                                                    <TableCell className="font-medium pl-6">#{order.id}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={order.user.profile_photo_url} alt={order.user.name} />
                                                                <AvatarFallback>{getInitials(order.user.name)}</AvatarFallback>
                                                            </Avatar>
                                                            <span className="font-medium">{order.user.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-bold">
                                                            Paid
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-black pr-6 text-foreground">
                                                        {formatCurrency(order.total_amount)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                                    No recent orders found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>

                        {/* Recent Registrations */}
                        <Card className="lg:col-span-3 border-none shadow-md overflow-hidden h-fit">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold">New Users</CardTitle>
                                <CardDescription>Recently registered accounts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {latestRegistrations && latestRegistrations.length > 0 ? (
                                        latestRegistrations.map((user) => (
                                            <div key={user.id} className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                                        <AvatarImage src={user.profile_photo_url} />
                                                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-bold leading-none">{user.name}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center h-24 text-muted-foreground flex items-center justify-center">
                                            No recent registrations.
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
