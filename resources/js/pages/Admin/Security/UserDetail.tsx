import AppLayout from '@/layouts/app-layout'
import { Head, Link, router } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, User, ShieldAlert, Globe, Monitor, Zap, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function UserDetail({
    user,
    ipStats,
    deviceStats,
    concurrentSessions,
}: any) {
    return (
        <AppLayout>
            <Head title={`Security · ${user.name}`} />

            <div className="bg-background min-h-screen pb-20">
                {/* Header */}
                <div className="border-b bg-muted/30 py-8">
                    <div className="container mx-auto px-4">
                        <Link
                            href={route('admin.security.flagged')}
                            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-4 transition-colors"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Flagged Users
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3">
                                    <User className="h-8 w-8 text-primary" /> {user.name}
                                </h1>
                                <p className="text-muted-foreground font-medium text-lg">
                                    Security profile and risk assessment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 space-y-8">
                    {/* Summary */}
                    <Card className="border-none shadow-md overflow-hidden bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-primary" /> Account Security Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-3">
                            <Badge variant={user.suspicion_score > 50 ? 'destructive' : 'secondary'} className="text-sm py-1 px-3">
                                Score: {user.suspicion_score}
                            </Badge>
                            <Badge variant="outline" className="text-sm py-1 px-3 bg-background">
                                <Globe className="h-3 w-3 mr-1" /> {Object.keys(ipStats).length} Known IPs
                            </Badge>
                            <Badge variant="outline" className="text-sm py-1 px-3 bg-background">
                                <Monitor className="h-3 w-3 mr-1" /> {Object.keys(deviceStats).length} Known Devices
                            </Badge>
                            {user.is_suspicious && (
                                <Badge variant="destructive" className="text-sm py-1 px-3 animate-pulse">
                                    Blocked / Suspicious
                                </Badge>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* IPs */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-blue-500" /> IP Addresses
                                </CardTitle>
                                <CardDescription>Detected IP history</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(ipStats).map(([ip, count]: any) => (
                                    <div key={ip} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                        <span className="font-mono text-sm">{ip}</span>
                                        <Badge variant="secondary" className="font-mono">{count} hits</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Devices */}
                        <Card className="border-none shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Monitor className="h-5 w-5 text-purple-500" /> Devices
                                </CardTitle>
                                <CardDescription>Device fingerprints</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {Object.entries(deviceStats).map(([device, count]: any) => (
                                    <div key={device} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                                        <span className="truncate w-2/3 text-xs font-mono text-muted-foreground" title={device}>
                                            {device}
                                        </span>
                                        <Badge variant="outline">{count}</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Concurrent */}
                        <Card className="border-none shadow-md h-fit">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-yellow-500" /> Concurrent Access
                                </CardTitle>
                                <CardDescription>Overlapping sessions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {Object.keys(concurrentSessions).length === 0 ? (
                                    <div className="p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm font-medium flex items-center gap-2">
                                        <div className="h-2 w-2 bg-green-500 rounded-full" />
                                        No overlapping access detected.
                                    </div>
                                ) : (
                                    <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm font-medium flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4" />
                                        Multiple sessions detected
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
