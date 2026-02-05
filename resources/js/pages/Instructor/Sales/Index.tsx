// resources/js/pages/Instructor/Sales/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PaginatedData } from '@/types';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    CreditCard,
    Calendar,
    Download,
    ChevronRight,
    ArrowUpRight,
    Search,
    Filter,
    ArrowLeft,
    PieChart,
    BarChart3
} from 'lucide-react';
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';

interface SalesData {
    date: string;
    total_sales: number;
    total_revenue: number;
}

interface InstructorSalesIndexProps {
    salesData: PaginatedData<SalesData>;
}

const formatCurrency = (amount: number | string | null | undefined) => {
    const numericAmount = parseFloat(amount as any) || 0;
    return `USD ${numericAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
    <Card className="border-none shadow-xl overflow-hidden group">
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-600 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="h-6 w-6" />
                </div>
                {trend && (
                    <Badge className={cn(
                        "font-bold text-[10px] tracking-widest",
                        trend === 'up' ? "bg-green-500 hover:bg-green-600" : "bg-rose-500 hover:bg-rose-600"
                    )}>
                        {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                        {trendValue}%
                    </Badge>
                )}
            </div>
            <div className="mt-6">
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
                <h3 className="text-3xl font-black mt-1 tracking-tight text-foreground">{value}</h3>
            </div>
        </CardContent>
    </Card>
);

export default function InstructorSalesIndex({ salesData }: InstructorSalesIndexProps) {
    // Calculate Summary Stats from salesData
    const totalEarnings = salesData.data.reduce((sum, s) => sum + (parseFloat(s.total_revenue as any) || 0), 0);
    const totalTransactions = salesData.data.reduce((sum, s) => sum + s.total_sales, 0);
    const avgOrderValue = totalTransactions > 0 ? totalEarnings / totalTransactions : 0;

    // Prepare Chart Data
    const chartData = [...salesData.data].reverse().map(sale => ({
        name: new Date(sale.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        revenue: parseFloat(sale.total_revenue as any) || 0,
        transactions: sale.total_sales
    }));

    return (
        <AppLayout title="Sales & Revenue">
            <Head title="Sales & Revenue Report" />

            <div className="bg-background min-h-screen pb-20">
                {/* Financial Header */}
                <div className="border-b bg-muted/30 py-10">
                    <div className="container mx-auto px-4">
                        <Link href={route('instructor.dashboard')} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Link>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl flex items-center gap-3 italic uppercase">
                                    <BarChart3 className="h-10 w-10 text-primary" /> Financial Reports
                                </h1>
                                <p className="text-muted-foreground font-medium text-lg">
                                    Analysis of your earnings and transaction performance.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Button variant="outline" className="h-12 rounded-full px-6 font-bold border-muted-foreground/20 hover:bg-muted/50">
                                    <Calendar className="mr-2 h-4 w-4" /> Custom Period
                                </Button>
                                <Button className="h-12 rounded-full px-6 font-bold shadow-lg shadow-primary/20">
                                    <Download className="mr-2 h-5 w-5" /> Export Statement
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {/* Summary Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <StatCard
                            title="Gross Earnings"
                            value={formatCurrency(totalEarnings)}
                            icon={DollarSign}
                            trend="up"
                            trendValue="14.2"
                            color="blue"
                        />
                        <StatCard
                            title="Total Sales"
                            value={totalTransactions.toLocaleString()}
                            icon={CreditCard}
                            trend="up"
                            trendValue="8.1"
                            color="purple"
                        />
                        <StatCard
                            title="Avg. Transaction"
                            value={formatCurrency(avgOrderValue)}
                            icon={PieChart}
                            trend="down"
                            trendValue="2.4"
                            color="emerald"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Revenue Trends Chart */}
                        <Card className="lg:col-span-2 border-none shadow-2xl overflow-hidden bg-white dark:bg-card">
                            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10 p-8">
                                <div>
                                    <CardTitle className="text-2xl font-black italic uppercase tracking-tight">Revenue Trends</CardTitle>
                                    <CardDescription className="text-base font-medium">Daily income visualization</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-full">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        <span className="text-[10px] font-black uppercase text-blue-600">Revenue</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="h-[400px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" opacity={0.5} />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 700 }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 700 }}
                                                tickFormatter={(value) => `USD ${value}`}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '20px',
                                                    border: 'none',
                                                    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                                                    padding: '16px'
                                                }}
                                                formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#3b82f6"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                                animationDuration={2000}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Performance Table Component */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="border-none shadow-xl overflow-hidden min-h-full">
                                <CardHeader className="bg-muted/30 pb-6 rounded-t-xl">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl font-bold">Daily Breakdown</CardTitle>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="divide-y divide-muted-foreground/10">
                                        {salesData.data.map((sale) => (
                                            <div key={sale.date} className="flex items-center justify-between p-5 hover:bg-muted/20 transition-colors group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-2xl bg-muted/50 flex flex-col items-center justify-center border border-muted-foreground/10 shadow-sm transition-transform group-hover:scale-105">
                                                        <span className="text-[10px] font-black uppercase text-muted-foreground leading-none">
                                                            {new Date(sale.date).toLocaleDateString(undefined, { month: 'short' })}
                                                        </span>
                                                        <span className="text-lg font-black leading-tight text-foreground">
                                                            {new Date(sale.date).getDate()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-black block">{sale.total_sales} Successfull Sales</span>
                                                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Transaction Verified</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-base font-black text-primary leading-tight">
                                                        {formatCurrency(sale.total_revenue)}
                                                    </div>
                                                    <div className="text-[10px] font-bold text-green-500 uppercase tracking-widest flex items-center justify-end">
                                                        Settled <ArrowUpRight className="ml-0.5 h-2.5 w-2.5" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {salesData.data.length === 0 && (
                                        <div className="py-20 text-center text-muted-foreground italic px-10">
                                            No performance data available for the selected period.
                                        </div>
                                    )}
                                </CardContent>
                                <div className="p-6 bg-muted/10 border-t">
                                    <Button variant="link" className="w-full font-bold group">
                                        View Full Statement <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

const MoreHorizontal = ({ className }: { className?: string }) => (
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
        <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
    </svg>
);
