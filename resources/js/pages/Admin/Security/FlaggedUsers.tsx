import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { route } from 'ziggy-js';
import { AlertTriangle, ShieldOff, Search, Monitor, Globe, UserX, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function FlaggedUsers({ users }: any) {
    return (
        <AppLayout>
            <Head title="Security · Flagged Users" />

            <div className="bg-background min-h-screen pb-20">
                {/* Header */}
                <div className="border-b bg-destructive/10 py-10">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3 text-destructive">
                                    <AlertTriangle className="h-8 w-8" /> Flagged Users
                                </h1>
                                <p className="text-muted-foreground font-medium text-lg">
                                    Users flagged for suspicious behavior or security violations.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <Card className="border-none shadow-md overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold">Suspicious Activity Monitor</CardTitle>
                                <CardDescription>Review and manage flagged accounts</CardDescription>
                            </div>
                            <div className="relative w-full max-w-sm hidden md:block">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    className="pl-9 rounded-full bg-muted/50 border-none focus-visible:ring-1"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {users.data.length > 0 ? (
                                users.data.map((user: any) => (
                                    <div
                                        key={user.id}
                                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-xl border bg-card hover:shadow-sm transition-all gap-4"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                                                <UserX className="h-6 w-6 text-destructive" />
                                            </div>
                                            <div>
                                                <Link
                                                    href={route('admin.security.user', user.id)}
                                                    className="font-bold text-lg hover:underline flex items-center gap-2"
                                                >
                                                    {user.name}
                                                </Link>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>

                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    <Badge variant="secondary" className="font-mono">
                                                        Score: {user.suspicion_score}
                                                    </Badge>
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Globe className="h-3 w-3" /> {user.ip_count} IPs
                                                    </Badge>
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        <Monitor className="h-3 w-3" /> {user.device_count} Devices
                                                    </Badge>

                                                    {user.is_suspicious && (
                                                        <Badge variant="destructive" className="font-bold">Blocked</Badge>
                                                    )}
                                                    {user.warned_at && !user.is_suspicious && (
                                                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">Warned</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="font-bold"
                                                onClick={() => router.post(route('admin.security.force-logout', user.id))}
                                            >
                                                <ShieldOff className="mr-2 h-4 w-4" /> Force Logout
                                            </Button>

                                            {user.is_suspicious && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="font-bold text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                                                    onClick={() => router.post(route('admin.security.unflag', user.id))}
                                                >
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Unflag
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>No flagged users found. Good job!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
