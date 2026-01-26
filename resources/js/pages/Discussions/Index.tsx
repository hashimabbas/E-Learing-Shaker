// resources/js/pages/Discussions/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaginatedData } from '@/types';
import {
    MessageCircle,
    ArrowLeft,
    PlusCircle,
    Search,
    Filter,
    MessageSquare,
    Clock,
    User,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { route } from 'ziggy-js';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Discussion {
    id: number;
    title: string;
    content: string;
    user: { name: string };
    comments_count: number;
    created_at: string;
}

interface DiscussionsIndexProps {
    course: { id: number, title: string, slug: string };
    discussions: PaginatedData<Discussion>;
}

// --- New Component: Discussion Form ---
function NewDiscussionForm({ courseId, closeModal }: { courseId: number, closeModal: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        course_id: courseId,
        title: '',
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route('discussions.store'), {
            onSuccess: () => {
                closeModal();
                reset();
            },
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-bold">Topic Title</Label>
                <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    required
                    placeholder="e.g., How do I resolve the API error in Module 3?"
                    className="h-12 text-lg"
                />
                <InputError message={errors.title} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-bold">Detailed Question</Label>
                <Textarea
                    id="content"
                    value={data.content}
                    onChange={(e) => setData('content', e.target.value)}
                    rows={8}
                    required
                    placeholder="Describe your issue or thought in detail..."
                    className="resize-none p-4 leading-relaxed"
                />
                <InputError message={errors.content} />
                <p className="text-xs text-muted-foreground">
                    Be specific and clear to get the best answers from instructors and peers.
                </p>
            </div>

            <DialogFooter>
                <Button type="button" variant="ghost" onClick={closeModal} className="font-bold">Cancel</Button>
                <Button type="submit" disabled={processing} className="font-bold shadow-lg shadow-primary/20">
                    {processing ? 'Posting...' : 'Post Topic'}
                </Button>
            </DialogFooter>
        </form>
    );
}

export default function DiscussionsIndex({ course, discussions }: DiscussionsIndexProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AppLayout title={`Forum: ${course.title}`}>
            <Head title={`Discussions - ${course.title}`} />

            <div className="bg-background min-h-screen pb-20">
                {/* Course Header Context */}
                <div className="border-b bg-muted/30 py-8">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <Link href={route('courses.show', course.slug)} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6 group">
                            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Back to Course Content
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
                                    <MessageSquare className="h-4 w-4" /> Course Forum
                                </div>
                                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl text-foreground">
                                    {course.title}
                                </h1>
                            </div>
                            <Button
                                size="lg"
                                onClick={() => setIsModalOpen(true)}
                                className="h-12 rounded-full px-8 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105"
                            >
                                <PlusCircle className="h-5 w-5 mr-2" /> Start New Topic
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 max-w-5xl">
                    {/* Search & Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input
                                placeholder="Search discussions..."
                                className="pl-12 h-12 bg-background border-muted-foreground/20 rounded-xl shadow-sm focus-visible:ring-primary/20"
                            />
                        </div>
                        <Button variant="outline" className="h-12 rounded-xl px-6 border-muted-foreground/20 text-muted-foreground font-bold hover:text-foreground">
                            <Filter className="mr-2 h-4 w-4" /> Filter
                        </Button>
                    </div>

                    {/* Discussion List */}
                    <div className="grid gap-4">
                        {discussions.data.length > 0 ? (
                            discussions.data.map((discussion) => (
                                <Link
                                    key={discussion.id}
                                    href={route('discussions.show', discussion.id)}
                                    className="block group"
                                >
                                    <Card className="border-none shadow-sm group-hover:shadow-md transition-all bg-card/50 group-hover:bg-card border-l-4 border-l-transparent group-hover:border-l-primary overflow-hidden">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="hidden sm:block">
                                                    <Avatar className="h-12 w-12 border shadow-sm">
                                                        <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                            {discussion.user.name.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                                            Discussion
                                                        </span>
                                                        <span className="text-xs text-muted-foreground flex items-center">
                                                            <span className="mx-1">•</span>
                                                            Posted by <span className="font-semibold text-foreground ml-1">{discussion.user.name}</span>
                                                        </span>
                                                        <span className="text-xs text-muted-foreground flex items-center">
                                                            <span className="mx-1">•</span>
                                                            {new Date(discussion.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2">
                                                        {discussion.title}
                                                    </h3>

                                                    <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                                                        {discussion.content}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col items-end justify-center shrink-0 pl-4 border-l border-dashed border-muted">
                                                    <div className="flex items-center gap-1.5 text-foreground group-hover:text-primary transition-colors font-black text-lg">
                                                        <MessageCircle className="h-5 w-5" />
                                                        {discussion.comments_count}
                                                    </div>
                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                                                        Replies
                                                    </span>
                                                    <ChevronRight className="h-5 w-5 text-muted-foreground/30 mt-2 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-muted/20 border-2 border-dashed rounded-3xl">
                                <div className="mx-auto h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <HelpCircle className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">No discussions yet</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                                    Be the first to ask a question or start a conversation about this course!
                                </p>
                                <Button onClick={() => setIsModalOpen(true)} variant="outline" className="font-bold border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                                    Start the Conversation
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Visual Pagination Placeholder */}
                    {discussions.data.length > 0 && (
                        <div className="mt-8 flex justify-center">
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                                Load More Topics
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                    <DialogHeader className="p-6 bg-muted/30 border-b">
                        <DialogTitle className="text-xl font-black flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-primary" /> Start New Discussion
                        </DialogTitle>
                        <DialogDescription className="text-base">
                            Ask a question or share a thought with your classmates and instructors.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-6">
                        <NewDiscussionForm
                            courseId={course.id}
                            closeModal={() => setIsModalOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
