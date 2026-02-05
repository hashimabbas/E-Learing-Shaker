// resources/js/pages/Admin/FinancialReports.tsx
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, BarChart3, TrendingUp, Download, Calendar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { MonthlyRevenueChart } from '@/components/charts/monthly-revenue-chart';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Metrics {
    totalRevenue: number;
    totalSales: number;
    monthlyRevenue: number;
}

interface TopCourse {
    name: string;
    revenue: number;
}

interface MonthlySummary {
    month: number;
    total: number;
}

interface AdminFinancialReportsProps {
    metrics: Metrics;
    topCourses: TopCourse[];
    monthlySummary: MonthlySummary[];
}

const formatCurrency = (amount: number | string | null | undefined): string => {
    const numericAmount = parseFloat(amount as string) || 0;
    return `USD ${numericAmount.toFixed(2).toLocaleString()}`;
};

const getMonthName = (monthNumber: number) => {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString('en-US', { month: 'short' });
};

const processMonthlySummary = (summary: MonthlySummary[]): { name: string, total: number, is_current: boolean }[] => {
    const currentMonth = new Date().getMonth() + 1;
    const revenueMap = summary.reduce((acc, item) => {
        acc[item.month] = parseFloat(item.total.toString());
        return acc;
    }, {} as Record<number, number>);

    const processedData = [];
    for (let monthNum = 1; monthNum <= 12; monthNum++) {
        const total = revenueMap[monthNum] || 0;
        processedData.push({
            name: getMonthName(monthNum),
            total: total,
            is_current: monthNum === currentMonth,
        });
    }
    return processedData;
};

export default function AdminFinancialReports({ metrics, topCourses, monthlySummary }: AdminFinancialReportsProps) {
    const statCards = [
        {
            title: "Total Revenue",
            value: formatCurrency(metrics.totalRevenue),
            icon: DollarSign,
            description: "Total paid sales across all time",
            trend: "+12% from last month", // Mock trend
            color: "text-green-600",
        },
        {
            title: "Total Sales",
            value: metrics.totalSales.toLocaleString(),
            icon: BarChart3,
            description: "Total successful orders",
            trend: "+5 new today",
            color: "text-blue-600",
        },
        {
            title: "Monthly Revenue",
            value: formatCurrency(metrics.monthlyRevenue),
            icon: TrendingUp,
            description: "Revenue in current month",
            trend: "On track",
            color: "text-indigo-600",
        },
    ];

    const chartData = processMonthlySummary(monthlySummary);
    const maxCourseRevenue = Math.max(...topCourses.map(c => c.revenue), 1);

    return (
        <AppLayout>
            <Head title="Financial Reports" />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Financial Overview</h2>
                        <p className="text-muted-foreground">
                            Monitor your platform's financial performance and sales.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <Calendar className="mr-2 h-4 w-4" />
                            {new Date().getFullYear()}
                        </Button>
                        <Button size="sm">
                            <Download className="mr-2 h-4 w-4" /> Export Report
                        </Button>
                    </div>
                </div>

                {/* 1. Key Metrics Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {statCards.map((card) => (
                        <Card key={card.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {card.title}
                                </CardTitle>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{card.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    {card.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Monthly Revenue Chart */}
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Revenue Overview</CardTitle>
                            <CardDescription>Monthly revenue breakdown for the current year.</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[350px] w-full">
                                {chartData.length > 0 ? (
                                    <MonthlyRevenueChart data={chartData} />
                                ) : (
                                    <div className="h-full flex items-center justify-center">
                                        <p className="text-muted-foreground">No data available.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Courses Report */}
                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Top Performing Courses</CardTitle>
                            <CardDescription>Courses with the highest total revenue.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Rank</TableHead>
                                        <TableHead>Course</TableHead>
                                        <TableHead className="text-right">Revenue</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {topCourses.map((course, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">
                                                #{index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col space-y-1">
                                                    <span className="font-medium truncate max-w-[150px]" title={course.name}>{course.name}</span>
                                                    {/* Simple visual bar */}
                                                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary"
                                                            style={{ width: `${(course.revenue / maxCourseRevenue) * 100}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                {formatCurrency(course.revenue)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {topCourses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-muted-foreground">
                                                No sales data yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
