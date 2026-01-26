import AppLayout from '@/layouts/app-layout'
import { Head, Link, router } from '@inertiajs/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { route } from 'ziggy-js'
import { ShieldAlert, Globe, Monitor, Activity, Eye, AlertTriangle, Shield, Search } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input' // Assuming Input exists or we use standard input

export default function SecurityIndex({ sessions }: any) {
    const riskVariant = (level: string) => {
        switch (level) {
            case 'high':
                return 'destructive'
            case 'medium':
                return 'warning' // Assuming warning variant exists, otherwise default/outline
            default:
                return 'outline'
        }
    }

    const riskColorClass = (level: string) => {
        switch (level) {
            case 'high':
                return 'bg-red-50 text-red-700 border-red-200'
            case 'medium':
                return 'bg-yellow-50 text-yellow-700 border-yellow-200'
            default:
                return 'bg-green-50 text-green-700 border-green-200'
        }
    }

    return (
        <AppLayout>
            <Head title="Security Dashboard" />

            <div className="bg-background min-h-screen pb-20">
                {/* Header */}
                <div className="border-b bg-muted/30 py-10">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3">
                                    <ShieldAlert className="h-8 w-8 text-primary" /> Security Dashboard
                                </h1>
                                <p className="text-muted-foreground font-medium text-lg">
                                    Monitor active sessions and potential security risks.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Link href={route('admin.security.flagged')}>
                                    <Button className="h-12 rounded-full px-6 font-bold shadow-lg shadow-destructive/20" variant="destructive">
                                        <AlertTriangle className="mr-2 h-5 w-5" /> View Flagged Users
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">

                    {/* Active Sessions Card */}
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">Active Sessions</CardTitle>
                                <CardDescription>Real-time monitoring of user activity</CardDescription>
                            </div>
                            <div className="relative w-full max-w-sm hidden md:block">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search by IP or User ID..."
                                    className="pl-9 rounded-full bg-muted/50 border-none focus-visible:ring-1"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent bg-muted/30">
                                        <TableHead className="pl-6">User ID</TableHead>
                                        <TableHead>IP Address</TableHead>
                                        <TableHead>Device</TableHead>
                                        <TableHead className="text-center">Actions</TableHead>
                                        <TableHead>Last Seen</TableHead>
                                        <TableHead className="text-center">Risk Level</TableHead>
                                        <TableHead className="text-right pr-6">Controls</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sessions.data.map((s: any) => (
                                        <TableRow key={s.session_id} className="hover:bg-muted/50 border-b border-muted/60 last:border-0">
                                            <TableCell className="font-medium pl-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                        {s.user_id}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-3 w-3" /> {s.ip_address}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Monitor className="h-3 w-3" />
                                                    <span className="truncate max-w-[150px]" title={s.device_fingerprint}>
                                                        {s.device_fingerprint ? s.device_fingerprint.slice(0, 20) + '...' : 'Unknown'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary" className="font-mono">{s.actions_count}</Badge>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {new Date(s.last_seen).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline" className={riskColorClass(s.risk_level)}>
                                                    {s.risk_level.toUpperCase()} ({s.risk_score})
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right pr-6 space-x-2">
                                                <Link href={route('admin.security.show', s.session_id)}>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 text-orange-600 hover:text-orange-700 hover:bg-orange-50 font-bold text-xs"
                                                    onClick={() => router.post(route('admin.security.session.revoke', s.session_id))}
                                                >
                                                    Kill
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 font-bold text-xs"
                                                    onClick={() => router.post(route('admin.security.force-logout', s.user_id))}
                                                >
                                                    Force Logout
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
