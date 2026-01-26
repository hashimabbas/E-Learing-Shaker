// resources/js/components/notification-bell.tsx
import { Bell, Award, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePage, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { route } from 'ziggy-js';

// Extend window object for Echo
declare global {
    interface Window {
        Echo: any;
        Pusher: any;
    }
}

interface Notification {
    id: string;
    data: { message: string; type: string; url: string };
    created_at: string;
}

export function NotificationBell() {
    const { notifications = [], auth } = usePage().props as any;
    const unreadCount = notifications.length;

    useEffect(() => {
        if (!auth.user || !window.Echo) {
            if (window.Echo) window.Echo.leave('App.Models.User.*');
            return;
        }

        const channelName = `App.Models.User.${auth.user.id}`;

        window.Echo.private(channelName)
            .notification((notification: any) => {
                // notification payload from Laravel often wraps things in 'data' or 'message'
                const msg = notification.message || notification.data?.message || "New notification received";
                toast.info(msg);
                router.reload({ only: ['notifications'] });
            });

        return () => {
            window.Echo.leave(channelName);
        };
    }, [auth.user?.id]);

    const handleMarkAsRead = () => {
        if (!auth.user) {
            router.get(route('login'));
            return;
        }

        router.post(route('notifications.mark-read'), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Notifications marked as read.'),
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 rounded-2xl shadow-xl border-slate-200 dark:border-slate-800" align="end">
                <div className="flex justify-between items-center p-4">
                    <span className="font-bold text-sm">Notifications ({unreadCount})</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAsRead}
                            disabled={!auth.user}
                            className="text-xs h-7 px-2 font-bold text-primary hover:text-primary hover:bg-primary/5"
                        >
                            Mark All Read
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator className="mx-2" />

                <div className="max-h-[400px] overflow-y-auto py-2">
                    {unreadCount > 0 ? (
                        notifications.map((notif: Notification) => (
                            <DropdownMenuItem key={notif.id} asChild className="focus:bg-slate-50 dark:focus:bg-slate-800/50 cursor-pointer mx-2 rounded-xl">
                                <Link href={notif.data.url} className="w-full">
                                    <div className="flex items-start space-x-3 py-2 px-1">
                                        <div className="size-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            {notif.data.type === 'certificate' ? <Award className="w-4 h-4 text-amber-500" /> : <MessageCircle className="w-4 h-4 text-primary" />}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-semibold leading-tight">{notif.data.message}</p>
                                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        ))
                    ) : (
                        <div className="py-8 px-4 text-center">
                            <p className="text-sm text-muted-foreground font-medium">No new notifications.</p>
                        </div>
                    )}
                </div>

                <DropdownMenuSeparator className="mx-2" />
                <div className="p-2">
                    <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-slate-500 hover:text-primary rounded-xl" asChild>
                        <Link href={route('notifications.index')}>View All History</Link>
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
