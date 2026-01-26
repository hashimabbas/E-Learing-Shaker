import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend,
} from 'chart.js'

import 'chartjs-adapter-date-fns'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    LineElement,
    PointElement,
    LinearScale,
    TimeScale,
    Tooltip,
    Legend
)

export function RiskTimelineChartJS({ data = [] }: { data?: any[] }) {
    if (!Array.isArray(data) || data.length === 0) {
        return (
            <div className="mt-6 text-sm text-muted-foreground">
                📉 No risk events recorded yet
            </div>
        )
    }

    const chartData = {
        datasets: [
            {
                label: 'Risk Score',
                data: data.map((e) => ({
                    x: e.time,
                    y: e.score,
                })),
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3,
            },
        ],
    }

    const resetLines = data
        .filter((d) => d.reset)
        .map((d) => ({
            value: d.time,
            label: 'Admin Reset',
        }))

    const options = {
        responsive: true,
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: 'minute' as const,
                },
            },
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 10,
                },
            },
        },
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
        },
    }

    return (
        <div className="h-72 mt-6 border rounded-lg p-4">
            <h2 className="font-semibold mb-3">📈 Risk Timeline (Chart.js)</h2>

            <Line data={chartData} options={options} />

            {/* Reset markers */}
            <div className="mt-2 text-xs space-y-1">
                {resetLines.map((r, i) => (
                    <div key={i} className="text-red-600">
                        🔄 Reset at {new Date(r.value).toLocaleString()}
                    </div>
                ))}
            </div>
        </div>
    )
}
