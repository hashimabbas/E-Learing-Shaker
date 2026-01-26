// resources/js/pages/Notifications/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Award, MessageCircle, Bell, ChevronRight, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Breadcrumbs } from '@/components/breadcrumbs';

interface Notification {
  id: string;
  data: { message: string; type: string; url: string };
  created_at: string;
  read_at: string | null;
}

interface Props {
  notifications: {
    data: Notification[];
    links: any[];
    meta: any;
  };
}

export default function Index({ notifications }: Props) {
  const breadcrumbs = [
    { title: 'Notifications', href: '/notifications' },
  ];

  return (
    <AppLayout>
      <Head title="Notifications" />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbs} />
          <h1 className="text-3xl font-black mt-2">Notification History</h1>
          <p className="text-muted-foreground mt-1">Keep track of your latest updates and interactions.</p>
        </div>

        <div className="space-y-4">
          {notifications.data.length > 0 ? (
            notifications.data.map((notif) => (
              <Link
                key={notif.id}
                href={notif.data.url}
                className="block group"
              >
                <Card className={cn(
                  "p-5 rounded-[2rem] transition-all duration-300 border-slate-200/50 dark:border-slate-800/50 group-hover:shadow-lg group-hover:shadow-primary/5 group-hover:border-primary/20",
                  notif.read_at ? "bg-white dark:bg-slate-900" : "bg-primary/5 dark:bg-primary/10 border-primary/20 shadow-sm shadow-primary/10"
                )}>
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "size-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                      notif.read_at ? "bg-slate-100 dark:bg-slate-800 text-slate-400" : "bg-primary text-white"
                    )}>
                      {notif.data.type === 'certificate' ? <Award className="size-6" /> :
                        notif.data.type === 'discussion_reply' ? <MessageCircle className="size-6" /> :
                          <Bell className="size-6" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={cn(
                          "font-bold truncate",
                          notif.read_at ? "text-slate-700 dark:text-slate-300" : "text-slate-900 dark:text-white"
                        )}>
                          {notif.data.message}
                        </h3>
                        {!notif.read_at && (
                          <span className="shrink-0 size-2.5 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                        </div>
                        <div className="size-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                        <div className="capitalize">{notif.data.type?.replace('_', ' ') || 'Notification'}</div>
                      </div>
                    </div>

                    <ChevronRight className="size-5 text-slate-300 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            ))
          ) : (
            <Card className="p-16 text-center rounded-[3rem] border-dashed border-2 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                <Bell className="size-8 text-slate-300" />
              </div>
              <h2 className="text-xl font-black mb-2">Inbox Zen</h2>
              <p className="text-muted-foreground max-w-xs mx-auto">You're all caught up! When you receive new notifications, they'll appear here.</p>
            </Card>
          )}
        </div>

        {/* Pagination (Simplified as we don't have the full Pagination component structure here) */}
        {notifications.links.length > 3 && (
          <div className="mt-12 flex justify-center gap-2">
            {notifications.links.map((link, i) => (
              <Link
                key={i}
                href={link.url || '#'}
                dangerouslySetInnerHTML={{ __html: link.label }}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                  link.active ? "bg-primary text-white shadow-lg shadow-primary/20" :
                    !link.url ? "text-slate-300 cursor-not-allowed" :
                      "hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
