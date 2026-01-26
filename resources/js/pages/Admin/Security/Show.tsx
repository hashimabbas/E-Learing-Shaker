import AppLayout from '@/layouts/app-layout'
import { Head, Link, useForm, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { route } from 'ziggy-js'
import { ChevronLeft, ShieldAlert, Monitor, Globe, Activity, Clock, Trash2, RotateCcw, AlertOctagon } from 'lucide-react'

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
import { RiskResetBadge } from './components/RiskResetBadge'

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
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-xl bg-muted/30">
                <Activity className="h-10 w-10 mb-2 opacity-50" />
                <p>No risk events recorded yet</p>
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
                borderColor: 'rgb(239, 68, 68)', // red-500
                backgroundColor: 'rgba(239, 68, 68, 0.5)',
                borderWidth: 2,
                tension: 0.3,
                pointRadius: 3,
                pointBackgroundColor: 'rgb(239, 68, 68)',
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
                backgroundColor: 'rgba(0,0,0,0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
            },
        },
        scales: {
            x: {
                type: 'time' as const,
                time: {
                    unit: 'minute' as const,
                },
                grid: {
                    display: false,
                }
            },
            y: {
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 20,
                },
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                }
            },
        },
    }

    return (
        <div className="h-80 w-full">
            <Line data={chartData} options={options} />
        </div>
    )
}

export default function SecurityShow({ sessionId, logs, summary, riskTimeline, userId }: any) {

    return (
        <AppLayout>
            <Head title={`Security – Session Details`} />

            <div className="bg-background min-h-screen pb-20">
                {/* Header */}
                <div className="border-b bg-muted/30 py-8">
                    <div className="container mx-auto px-4">
                        <Link
                            href={route('admin.security.index')}
                            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Sessions
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3">
                                    <Activity className="h-8 w-8 text-primary" /> Session Analysis
                                </h1>
                                <p className="text-muted-foreground font-medium text-lg">
                                    Detailed breakdown of user activity and risk factors.
                                </p>
                            </div>

                            <Button
                                variant="destructive"
                                size="lg"
                                className="shadow-lg shadow-destructive/20 font-bold"
                                onClick={() => {
                                    if (confirm('Reset risk score and logout all sessions?')) {
                                        router.post(
                                            route('admin.security.reset-risk', userId)
                                        )
                                    }
                                }}
                            >
                                <RotateCcw className="mr-2 h-5 w-5" /> Reset Risk & Logout
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 space-y-8">
                    {/* Charts & Graphs */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <Activity className="h-5 w-5 text-destructive" /> Risk Timeline
                            </CardTitle>
                            <CardDescription>Risk score fluctuation over time</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RiskTimelineChartJS data={riskTimeline} />

                            {riskTimeline?.filter((r: any) => r.reset).length > 0 && (
                                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                                    <h3 className="font-bold text-sm text-foreground mb-2">Admin Interventions</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {riskTimeline
                                            .filter((r: any) => r.reset)
                                            .map((r: any, i: number) => (
                                                <RiskResetBadge key={i} time={r.time} />
                                            ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Summary Cards */}
                        <Card className="border-none shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">IP Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                                        <Globe className="h-5 w-5" />
                                    </div>
                                    <div className="font-mono text-xl font-bold">{summary.ip_address}</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Device Fingerprint</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                                        <Monitor className="h-5 w-5" />
                                    </div>
                                    <div className="font-mono text-xs font-medium break-all text-muted-foreground">
                                        {summary.device_fingerprint}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Session Duration</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-bold">
                                            {new Date(summary.first_seen).toLocaleTimeString()}
                                            <span className="text-muted-foreground mx-1">→</span>
                                            {new Date(summary.last_seen).toLocaleTimeString()}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(summary.last_seen).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Risk Analysis */}
                        <Card className="col-span-1 border-none shadow-md bg-destructive/5">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-destructive">
                                    <AlertOctagon className="h-5 w-5" /> Risk Factors
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {logs.map((l: any) => l.ip_address).filter((v: any, i: number, a: any[]) => a.indexOf(v) !== i).length > 0 && (
                                        <li className="flex items-start gap-2 text-sm font-medium text-destructive">
                                            <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                                            Multiple IP addresses detected in single session
                                        </li>
                                    )}

                                    {logs.length > 30 && (
                                        <li className="flex items-start gap-2 text-sm font-medium text-destructive">
                                            <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                                            Abnormally high activity volume ({logs.length} actions)
                                        </li>
                                    )}

                                    {logs.filter((l: any) => l.action === 'login').length > 2 && (
                                        <li className="flex items-start gap-2 text-sm font-medium text-destructive">
                                            <span className="h-1.5 w-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                                            Repeated login attempts detected
                                        </li>
                                    )}

                                    {logs.length <= 30 && logs.filter((l: any) => l.action === 'login').length <= 2 && (
                                        <li className="flex items-start gap-2 text-sm font-medium text-green-600">
                                            <span className="h-1.5 w-1.5 rounded-full bg-green-600 mt-1.5 shrink-0" />
                                            No major anomalies detected.
                                        </li>
                                    )}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Activity Timeline */}
                        <Card className="md:col-span-2 border-none shadow-md">
                            <CardHeader>
                                <CardTitle>Activity Log</CardTitle>
                                <CardDescription>Chronological list of all user actions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
                                    {logs.map((log: any) => (
                                        <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            {/* Icon/Dot */}
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-muted shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                                <Activity className="h-4 w-4 text-primary" />
                                            </div>

                                            {/* Content */}
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border bg-card shadow-sm">
                                                <div className="flex items-center justify-between space-x-2 mb-1">
                                                    <div className="font-bold text-sm text-foreground">{log.action}</div>
                                                    <time className="font-mono text-xs text-muted-foreground">{new Date(log.accessed_at).toLocaleTimeString()}</time>
                                                </div>
                                                <div className="text-xs text-muted-foreground font-mono">
                                                    {new Date(log.accessed_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
