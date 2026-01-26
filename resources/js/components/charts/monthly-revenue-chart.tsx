// resources/js/components/charts/monthly-revenue-chart.tsx
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from 'recharts';

interface ChartData {
    name: string;
    total: number;
    is_current: boolean;
}

export function MonthlyRevenueChart({ data }: { data: ChartData[] }) {
    // Custom label to show OMR
    const formatYAxis = (tick: number) => `OMR ${tick.toLocaleString()}`;

    // Color to highlight the current month's bar
    const getBarColor = (item: ChartData) => item.is_current ? '#10B981' : '#3B82F6';

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis
                    stroke="#6b7280"
                    tickFormatter={formatYAxis}
                    style={{ fontSize: '12px' }}
                />
                <Tooltip
                    formatter={(value: number) => [formatYAxis(value), 'Revenue']}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{ border: 'none', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="total">
                    {data.map((entry, index) => (
                        <Bar key={`bar-${index}`} fill={getBarColor(entry)} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
