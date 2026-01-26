// resources/js/pages/Discussions/Show.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, User as UserIcon, ArrowLeft, Send, ShieldCheck, Crown, Clock, MoreHorizontal } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { useEffect, useState, useRef } from 'react';
import { route } from 'ziggy-js';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function DiscussionShow({ discussion, course }: any) {
    const { auth } = usePage().props as any;
    const [comments, setComments] = useState(discussion.comments);

    // For auto-scrolling to new comments if needed
    const bottomRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (!auth.user) return;

        // @ts-ignore
        window.Echo.channel(`discussion.${discussion.id}`)
            .listen('.comment.added', (e: any) => {
                setComments((prevComments: any) => [e.comment, ...prevComments]);
                // Optional: Play a sound or show a toast
            })
        return () => {
            // @ts-ignore
            window.Echo.leaveChannel(`discussion.${discussion.id}`);
        };
    }, [discussion.id, auth.user.id]);

    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('discussions.comment.add', discussion.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset('content');
                // Could scroll to top of list if that's where new comments are added
            },
        });
    };

    const isInstructor = (user: any) => user.role === 'instructor';
    const isOwner = (user: any) => user.id === discussion.user_id;

    console.log(discussion.user.name);

    return (
        <AppLayout title={discussion.title}>
            <Head title={discussion.title} />

            <div className="bg-background min-h-screen pb-10">
                {/* Header Navigation */}
                <div className="border-b bg-card py-6 sticky top-0 z-10 shadow-sm backdrop-blur-xl bg-card/80">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <Link href={route('discussions.index', course.slug)} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group">
                            <div className="p-1 rounded-full bg-muted group-hover:bg-primary/10 mr-2 transition-colors">
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                            </div>
                            Back to {course.title} Forum
                        </Link>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 max-w-4xl grid gap-8">
                    {/* Main Discussion Post */}
                    <div className="relative">
                        <Card className="border-none shadow-lg overflow-hidden ring-1 ring-muted">
                            <div className="bg-primary/5 p-6 sm:p-8 border-b border-primary/10">
                                <div className="flex items-start justify-between gap-4">
                                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-foreground">
                                        {discussion.title}
                                    </h1>
                                    <Button variant="ghost" size="icon" className="shrink-0 -mr-2">
                                        <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-4 mt-6">
                                    <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                        <AvatarFallback className="bg-primary text-primary-foreground font-black text-lg">
                                            {discussion.user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-foreground text-lg">{discussion.user.name}</span>
                                            {isInstructor(discussion.user) && (
                                                <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200 gap-1 pl-1 pr-2">
                                                    <ShieldCheck className="h-3 w-3" /> Instructor
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-xs font-medium text-muted-foreground flex items-center gap-2 mt-0.5">
                                            <span>Original Poster</span>
                                            <span>•</span>
                                            <span className="flex items-center"><Clock className="h-3 w-3 mr-1" /> {new Date(discussion.created_at).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <CardContent className="p-6 sm:p-8 text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                                {discussion.content}
                            </CardContent>
                        </Card>

                        {/* Connection Line */}
                        <div className="absolute left-10 top-full bottom-0 w-0.5 bg-muted-foreground/20 h-8 -mb-8 z-0 hidden sm:block" />
                    </div>

                    {/* Reply Input Area */}
                    <Card className="border-2 border-muted/60 shadow-none bg-muted/10 relative z-1">
                        <CardContent className="p-4 sm:p-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                <MessageCircle className="h-4 w-4" /> Contribute to the conversation
                            </h3>
                            <form onSubmit={handleSubmit} className="relative">
                                <Textarea
                                    placeholder="Type your helpful reply here..."
                                    rows={4}
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className="resize-none bg-background text-base p-4 pr-32 shadow-sm border-muted-foreground/20 focus-visible:ring-primary/20 min-h-[120px]"
                                />
                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground font-medium hidden sm:inline-block mr-2">
                                        Markdown supported
                                    </span>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        size="sm"
                                        className="rounded-lg font-bold shadow-lg shadow-primary/20 px-4"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Post Reply
                                    </Button>
                                </div>
                            </form>
                            <InputError message={errors.content} className="mt-2" />
                        </CardContent>
                    </Card>

                    {/* Comments Stream */}
                    <div className="space-y-6 relative">
                        <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-muted-foreground/10 hidden sm:block" />

                        <div className="flex items-center gap-4 mb-2 relative z-1">
                            <span className="text-xl font-bold">{comments.length} Replies</span>
                            <Separator className="flex-1" />
                        </div>

                        {comments.length > 0 ? (
                            comments.map((comment: any) => (
                                <div key={comment.id} className="relative z-1 group">
                                    <div className="flex gap-4 sm:gap-6">
                                        <div className="hidden sm:flex flex-col items-center">
                                            <Avatar className={cn("h-10 w-10 border-2 shadow-sm z-10",
                                                isInstructor(comment.user) ? "border-indigo-100 ring-2 ring-indigo-50" : "border-background",
                                                isOwner(comment.user) ? "border-primary/20" : ""
                                            )}>
                                                <AvatarFallback className={cn("text-sm font-bold",
                                                    isInstructor(comment.user) ? "bg-indigo-100 text-indigo-700" : "bg-muted text-muted-foreground"
                                                )}>
                                                    {comment.user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>

                                        <Card className="flex-1 border-none shadow-sm hover:shadow-md transition-shadow ring-1 ring-muted bg-card">
                                            <CardContent className="p-5">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-bold text-sm">{comment.user.name}</span>
                                                            {isInstructor(comment.user) && (
                                                                <Badge variant="secondary" className="h-5 px-1.5 bg-indigo-50 text-indigo-700 border-indigo-100 text-[10px]">
                                                                    Instructor
                                                                </Badge>
                                                            )}
                                                            {isOwner(comment.user) && (
                                                                <Badge variant="outline" className="h-5 px-1.5 text-primary border-primary/20 bg-primary/5 text-[10px]">
                                                                    <Crown className="w-3 h-3 mr-0.5" /> OP
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-muted-foreground block mt-0.5">
                                                            {new Date(comment.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
                                                    {comment.content}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-muted-foreground italic">
                                No replies yet. Be the first to help out!
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
