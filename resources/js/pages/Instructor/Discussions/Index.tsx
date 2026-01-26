// resources/js/pages/Instructor/Discussions/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PaginatedData } from '@/types';
import {
    MessageCircle,
    ArrowRight,
    Users,
    MessageSquare,
    Clock,
    Search,
    Filter,
    LayoutGrid,
    User,
    BookOpen,
    ArrowLeft,
    TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Discussion {
    id: number;
    title: string;
    comments_count: number;
    created_at: string;
    user: { name: string };
    course: { title: string; slug: string };
}

interface InstructorDiscussionsIndexProps {
    discussions: PaginatedData<Discussion>;
}

const SummaryCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <Card className="border-none shadow-xl overflow-hidden relative group">
        <div className={`absolute top-0 right-0 w-24 h-24 -mt-8 -mr-8 opacity-10 rounded-full bg-${color}-500 transition-transform duration-500 group-hover:scale-110`} />
        <CardContent className="p-6">
            <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-600 inline-flex mb-4`}>
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-3xl font-black tracking-tight">{value}</h3>
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mt-1">{title}</p>
            <p className="text-xs text-muted-foreground italic mt-2">{subtitle}</p>
        </CardContent>
    </Card>
);

export default function InstructorDiscussionsIndex({ discussions }: InstructorDiscussionsIndexProps) {
    const totalDiscussions = discussions.meta?.total ?? discussions.data.length;
    const totalReplies = discussions.data.reduce((sum: number, d: Discussion) => sum + d.comments_count, 0);

    const handleViewDiscussion = (discussionId: number) => {
        router.get(route('discussions.show', discussionId));
    };

    return (
        <AppLayout title="Student Discussions">
            <Head title="Instructor Community Hub" />

            <div className="bg-background min-h-screen pb-20">
                {/* Header / Hero Section */}
                <div className="border-b bg-muted/30 py-12 lg:py-16">
                    <div className="container mx-auto px-4">
                        <Link href={route('instructor.dashboard')} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Link>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                            <div className="max-w-2xl space-y-4">
                                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl flex items-center gap-4 italic uppercase">
                                    <MessageSquare className="h-10 w-10 text-primary" /> Community Hub
                                </h1>
                                <p className="text-muted-foreground font-medium text-xl leading-relaxed">
                                    Engage with your students, answer their queries, and build a thriving learning environment across all your courses.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="p-1.5 rounded-2xl bg-muted border flex items-center gap-1">
                                    <Button variant="ghost" size="sm" className="rounded-xl px-4 font-bold bg-background shadow-sm text-primary">Topics List</Button>
                                    <Button variant="ghost" size="sm" className="rounded-xl px-4 font-bold text-muted-foreground">Community Stats</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {/* Summary Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <SummaryCard
                            title="Active Topics"
                            value={totalDiscussions.toLocaleString()}
                            icon={MessageCircle}
                            color="blue"
                            subtitle="Open threads across courses"
                        />
                        <SummaryCard
                            title="Total Contributions"
                            value={totalReplies.toLocaleString()}
                            icon={Users}
                            color="purple"
                            subtitle="Total student participation"
                        />
                        <SummaryCard
                            title="Engagement Index"
                            value={`${totalDiscussions > 0 ? (totalReplies / totalDiscussions).toFixed(1) : '0'}`}
                            icon={TrendingUp}
                            color="emerald"
                            subtitle="Avg. replies per topic"
                        />
                    </div>

                    {/* Controls Bar */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-muted/20 p-5 rounded-3xl border border-dashed border-muted-foreground/20">
                        <div className="relative w-full max-w-xl group">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                placeholder="Search entire discussion archive..."
                                className="pl-12 h-14 bg-background border-none shadow-inner rounded-2xl text-lg font-medium ring-1 ring-muted-foreground/10 focus-visible:ring-primary/40 focus-visible:ring-2"
                            />
                        </div>
                        <div className="flex w-full md:w-auto gap-4">
                            <Button variant="outline" className="h-14 rounded-2xl px-6 font-bold border-muted-foreground/20 italic uppercase tracking-widest text-xs">
                                <Filter className="mr-2 h-4 w-4" /> Filter Courses
                            </Button>
                            <Button variant="outline" className="h-14 w-14 rounded-2xl p-0 border-muted-foreground/20">
                                <LayoutGrid className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Discussions Feed */}
                    <div className="grid gap-6">
                        {discussions.data.length > 0 ? (
                            discussions.data.map((discussion: Discussion) => (
                                <Card
                                    key={discussion.id}
                                    className="group border-none shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer bg-card hover:bg-muted/5"
                                    onClick={() => handleViewDiscussion(discussion.id)}
                                >
                                    <CardContent className="p-0">
                                        <div className="flex flex-col lg:flex-row items-stretch">
                                            {/* Left accent */}
                                            <div className="hidden lg:block w-1 bg-primary/20 group-hover:bg-primary transition-colors" />

                                            <div className="flex-1 p-8">
                                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                                                    <div className="space-y-4 flex-1">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-10 w-10 border-2 border-primary/10 shadow-sm">
                                                                <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                                    {discussion.user.name.charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="text-sm font-black tracking-tight">{discussion.user.name}</p>
                                                                <p className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-1.5 tracking-widest mt-0.5">
                                                                    <Clock className="h-3 w-3" /> {new Date(discussion.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <h3 className="text-2xl font-black tracking-tight leading-snug group-hover:text-primary transition-colors">
                                                            {discussion.title}
                                                        </h3>

                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 hover:bg-primary/10 px-3 py-1 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                                                                <BookOpen className="h-3 w-3" /> {discussion.course.title}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-6 shrink-0 pt-6 lg:pt-0 border-t lg:border-t-0 border-dashed">
                                                        <div className="flex items-center gap-10">
                                                            <div className="text-center group-hover:scale-105 transition-transform">
                                                                <p className="text-2xl font-black leading-none">{discussion.comments_count}</p>
                                                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mt-1">Replies</p>
                                                            </div>
                                                            <Button
                                                                variant="outline"
                                                                className="rounded-full h-14 w-14 p-0 border-primary group-hover:bg-primary group-hover:text-primary-foreground transform group-hover:rotate-45 transition-all duration-500 shadow-lg shadow-primary/5"
                                                            >
                                                                <ArrowRight className="h-6 w-6" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="py-24 border-2 border-dashed rounded-[3rem] text-center space-y-6 bg-muted/10">
                                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center border-4 border-dashed border-muted-foreground/20">
                                    <MessageCircle className="h-10 w-10 text-muted-foreground/30" />
                                </div>
                                <div className="max-w-md mx-auto space-y-2 px-6">
                                    <h2 className="text-2xl font-black tracking-tight">The community is quiet... for now.</h2>
                                    <p className="text-muted-foreground font-medium text-lg leading-relaxed">
                                        Once your students start asking questions or sharing insights, they'll appear here in your community feed.
                                    </p>
                                </div>
                                <Button className="h-14 rounded-full px-8 font-black tracking-tight shadow-xl shadow-primary/20">
                                    Browse Your Courses
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


