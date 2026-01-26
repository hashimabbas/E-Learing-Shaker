// resources/js/pages/Instructor/Dashboard.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    DollarSign,
    BookOpen,
    Users,
    ArrowRight,
    PlusCircle,
    TrendingUp,
    Activity,
    Award,
    Star,
    LayoutDashboard,
    PieChart,
    ChevronRight,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

interface InstructorDashboardProps {
    stats: {
        totalCourses: number;
        totalStudents: number;
        totalRevenue: number;
        avgRating: number;
        certificatesCount: number;
        revenueData: { name: string, revenue: number }[];
    };
    latestCourses: any[];
}

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <Card className="relative overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
        <div className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 opacity-10 rounded-full bg-${color}-500`} />
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</CardTitle>
            <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-600`}>
                <Icon className="h-4 w-4" />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-3xl font-black tracking-tight">{value}</div>
            <div className={`mt-2 flex items-center gap-1 text-xs font-bold text-green-500`}>
                <TrendingUp className="h-3 w-3" /> {trend}% <span className="text-muted-foreground font-normal ml-1">vs last week</span>
            </div>
        </CardContent>
    </Card>
);

export default function InstructorDashboard({ stats, latestCourses }: InstructorDashboardProps) {
    const { auth } = usePage<any>().props;

    return (
        <AppLayout>
            <Head title="Instructor Dashboard" />

            <div className="bg-background min-h-screen pb-20">
                {/* Header Section */}
                <div className="border-b bg-muted/30 py-10">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3">
                                    <LayoutDashboard className="h-8 w-8 text-primary" /> Instructor Overview
                                </h1>
                                <p className="text-muted-foreground font-medium text-lg">
                                    Welcome back, <span className="text-foreground font-bold">{auth.user.name}</span>. Here's how your courses are performing.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href={route('instructor.courses.create')}>
                                    <Button className="h-12 rounded-full px-6 font-bold shadow-lg shadow-primary/20">
                                        <PlusCircle className="mr-2 h-5 w-5" /> Create New Course
                                    </Button>
                                </Link>
                                <Link href={route('instructor.sales.index')}>
                                    <Button variant="outline" className="h-12 rounded-full px-6 font-bold">
                                        <Activity className="mr-2 h-5 w-5" /> Performance Reports
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Primary Stats */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
                        <StatCard
                            title="Total Revenue"
                            value={`OMR ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            icon={DollarSign}
                            trend="12.5"
                            color="blue"
                        />
                        <StatCard
                            title="Total Enrollments"
                            value={stats.totalStudents.toLocaleString()}
                            icon={Users}
                            trend="8.1"
                            color="purple"
                        />
                        <StatCard
                            title="Courses Created"
                            value={stats.totalCourses}
                            icon={BookOpen}
                            trend="2.4"
                            color="teal"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Revenue Chart Section */}
                        <Card className="lg:col-span-2 border-none shadow-md overflow-hidden bg-card">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold">Revenue Analytics</CardTitle>
                                    <CardDescription>Daily revenue performance for the current week</CardDescription>
                                </div>
                                <SelectDateRange />
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="h-[300px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={stats.revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                                tickFormatter={(value) => `OMR ${value}`}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                                }}
                                                formatter={(value) => [`OMR ${value}`, 'Revenue']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#3b82f6"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Secondary Stats/Actions Column */}
                        <div className="space-y-6">
                            {/* Performance Overview */}
                            <Card className="border-none shadow-md bg-primary text-primary-foreground overflow-hidden relative">
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Top Performing</CardTitle>
                                    <CardDescription className="text-primary-foreground/70">Metrics based on all time</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white/20">
                                                <Star className="h-5 w-5 fill-current" />
                                            </div>
                                            <span className="font-medium">Avg. Rating</span>
                                        </div>
                                        <span className="text-xl font-black">{stats.avgRating || '0.0'} / 5.0</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white/20">
                                                <Award className="h-5 w-5" />
                                            </div>
                                            <span className="font-medium">Certificates Issued</span>
                                        </div>
                                        <span className="text-xl font-black">{stats.certificatesCount?.toLocaleString() || 0}</span>
                                    </div>
                                </CardContent>
                                <Separator className="bg-white/10" />
                                <div className="p-4">
                                    <Button variant="ghost" className="w-full text-white hover:bg-white/10 font-bold group">
                                        View Badges <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </Card>

                            <Card className="border-none shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Quick Tips</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-4 items-start p-3 bg-muted/40 rounded-xl">
                                        <div className="bg-blue-500/10 p-2 rounded-lg text-blue-600">
                                            <PieChart className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold tracking-tight">Expand Your Reach</p>
                                            <p className="text-xs text-muted-foreground mt-1">Courses in "Data Science" are trending 40% higher this month.</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Course Management Table/List Section */}
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Recent Courses</h2>
                                <p className="text-muted-foreground text-sm font-medium">Manage and monitor your latest content at a glance.</p>
                            </div>
                            <Link href={route('instructor.courses.index')}>
                                <Button variant="link" className="font-bold text-primary group">
                                    Manager All Courses <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid gap-4">
                            {latestCourses.length > 0 ? latestCourses.map((course) => (
                                <Card key={course.id} className="group border-none shadow-sm hover:shadow-md transition-all overflow-hidden">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row items-center p-4 gap-6">
                                            <div className="h-16 w-24 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                                                <BookOpen className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                            <div className="flex-1 space-y-1 text-center md:text-left">
                                                <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
                                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 text-xs font-medium text-muted-foreground">
                                                    <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {course.students_count?.toLocaleString()} Students</span>
                                                    <span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> OMR {course.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                                    <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" /> {course.average_rating || '0.0'}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <Badge variant="outline" className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-bold transition-colors group-hover:bg-primary/5",
                                                    course.is_published
                                                        ? 'text-green-600 border-green-200 bg-green-50'
                                                        : 'text-yellow-600 border-yellow-200 bg-yellow-50'
                                                )}>
                                                    {course.is_published ? 'Published' : 'Draft'}
                                                </Badge>
                                                <Link href={route('instructor.courses.edit', course.id)}>
                                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                                        <ArrowRight className="h-5 w-5" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="py-12 border-2 border-dashed rounded-3xl text-center space-y-4">
                                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                        <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                                    </div>
                                    <p className="text-muted-foreground font-bold">You haven't created any courses yet.</p>
                                    <Link href={route('instructor.courses.create')}>
                                        <Button variant="ghost" className="font-bold text-primary">Start your first course</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

const SelectDateRange = () => (
    <Button variant="outline" size="sm" className="h-9 px-4 font-bold rounded-lg border-muted/60">
        This Week <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
    </Button>
);

const ChevronDown = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="m6 9 6 6 6-6" />
    </svg>
);
