// resources/js/pages/CoursePlayer/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useCallback, useState, useRef } from 'react';
import { Course, Lesson } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
    Video,
    ChevronRight,
    CheckCircle,
    Clock,
    ArrowLeft,
    Play,
    FileText,
    HelpCircle,
    Award,
    ChevronDown,
    Menu,
    X,
    ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MovingWatermark } from '@/components/moving-watermark';
import { route } from 'ziggy-js';

interface CoursePlayerProps {
    course: Course;
    lessons: Lesson[];
    currentLesson: Lesson;
    bookmarkTime: number;
    enrollment: {
        progress: number;
        completed_at: string | null;
    };
}

const PROGRESS_SAVE_INTERVAL = 10;
const AUTO_RESUME_KEY = 'video:auto-resume';

export default function CoursePlayerIndex({
    course,
    lessons,
    currentLesson,
    bookmarkTime,
    enrollment,
}: CoursePlayerProps) {
    const [lastSavedTime, setLastSavedTime] = useState(0);
    const [videoHasFinished, setVideoHasFinished] = useState(false);
    const [showResumePrompt, setShowResumePrompt] = useState(false);
    const [resumeTime, setResumeTime] = useState<number | null>(null);
    const [autoResume, setAutoResume] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hasAutoResumedRef = useRef(false);

    const currentLessonIndex = lessons.findIndex(l => l.id === currentLesson.id);
    const nextLesson = lessons.find((lesson, index) => {
        if (index <= currentLessonIndex) return false;
        return !lesson.is_completed;
    }) ?? null;

    useEffect(() => {
        setAutoResume(localStorage.getItem(AUTO_RESUME_KEY) === 'true');
    }, []);

    useEffect(() => {
        hasAutoResumedRef.current = false;
        setVideoHasFinished(false);
        setLastSavedTime(0);
        setShowResumePrompt(false);
        setResumeTime(null);
    }, [currentLesson.id]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || currentLesson.type !== 'video' || !bookmarkTime || bookmarkTime <= 1 || hasAutoResumedRef.current) return;

        const resume = () => {
            if (!video.duration || video.duration <= 0) return;
            const safeTime = Math.min(bookmarkTime, video.duration - 2);
            hasAutoResumedRef.current = true;

            if (autoResume) {
                video.pause();
                video.currentTime = safeTime;
                requestAnimationFrame(() => video.play().catch(() => { }));
            } else {
                setResumeTime(safeTime);
                setShowResumePrompt(true);
            }
        };

        video.addEventListener('loadeddata', resume, { once: true });
        return () => video.removeEventListener('loadeddata', resume);
    }, [currentLesson.id, bookmarkTime, autoResume]);

    const handleVideoTimeUpdate = useCallback(() => {
        const video = videoRef.current;
        if (!video || video.duration === 0) return;

        const currentTime = Math.floor(video.currentTime);
        if (currentTime - lastSavedTime < PROGRESS_SAVE_INTERVAL) return;

        const progressPercentage = Math.round((currentTime / video.duration) * 100);

        saveProgress(currentTime, progressPercentage);
    }, [currentLesson.id, lastSavedTime]);

    const saveProgress = (seconds: number, percentage: number) => {
        fetch(route('api.progress.update'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')!.getAttribute('content')!,
            },
            body: JSON.stringify({
                lesson_id: currentLesson.id,
                time_bookmark_seconds: seconds,
                progress_percentage: Math.max(percentage, 100), // Ensure at least it marks as complete if wanted
            }),
        }).then(res => {
            if (res.ok) setLastSavedTime(seconds);
        }).catch(() => { });
    };

    const markAsComplete = () => {
        // Send 100% progress for text/other lessons
        fetch(route('api.progress.update'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')!.getAttribute('content')!,
            },
            body: JSON.stringify({
                lesson_id: currentLesson.id,
                time_bookmark_seconds: 0,
                progress_percentage: 100,
            }),
        }).then(res => {
            if (res.ok) {
                router.reload(); // Refresh to update sidebar icons
                if (nextLesson) handleLessonClick(nextLesson);
            }
        });
    };

    const handleLessonClick = (lesson: Lesson) => {
        if (lesson.type === 'quiz' && lesson.quiz?.id) {
            router.get(route('quizzes.show', lesson.quiz.id));
            return;
        }
        router.visit(
            route('courses.learn', { course: course.slug, lesson: lesson.slug }),
            { preserveState: false, replace: true }
        );
    };

    const getLessonIcon = (lesson: Lesson, active: boolean) => {
        if (lesson.is_completed) return <CheckCircle className="size-5 text-green-500" />;
        if (active) return <Play className="size-5 text-primary animate-pulse fill-primary/20" />;

        switch (lesson.type) {
            case 'video': return <Video className="size-5 text-slate-400" />;
            case 'text': return <FileText className="size-5 text-slate-400" />;
            case 'quiz': return <HelpCircle className="size-5 text-slate-400" />;
            default: return <Clock className="size-5 text-slate-400" />;
        }
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Learning', href: route('student.learning') }, { title: course.title, href: route('courses.show', course.slug) }]}>
            <Head title={`Learning: ${currentLesson.title}`} />

            <div className="flex h-[calc(100vh-theme(spacing.16))] w-full bg-slate-50 dark:bg-slate-900/50">
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    {/* Top Bar for Mobile/Tablet */}
                    <div className="lg:hidden p-4 border-b flex items-center justify-between bg-white dark:bg-slate-900 sticky top-0 z-30">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            {isSidebarOpen ? <X /> : <Menu />}
                        </Button>
                        <h2 className="text-sm font-bold truncate px-4">{currentLesson.title}</h2>
                        <div className="w-10" />
                    </div>

                    <div className="flex-1">
                        {/* THE PLAYER / CONTENT AREA */}
                        <div className="w-full bg-black relative group/player">
                            {currentLesson.type === 'video' ? (
                                <div className="aspect-video max-h-[75vh] mx-auto relative overflow-hidden">
                                    <video
                                        key={currentLesson.id}
                                        ref={videoRef}
                                        src={currentLesson.secure_video_url ?? ''}
                                        controls
                                        controlsList="nodownload"
                                        onTimeUpdate={handleVideoTimeUpdate}
                                        poster={course.thumbnail || ''}
                                        className="w-full h-full object-contain"
                                        onEnded={() => setVideoHasFinished(true)}
                                    />
                                    {showResumePrompt && resumeTime !== null && (
                                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40">
                                            <Card className="max-w-xs border-none bg-slate-900 text-white shadow-2xl">
                                                <div className="p-6 text-center space-y-4">
                                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                                                        <Clock className="size-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg">Resume Learning?</h3>
                                                        <p className="text-slate-400 text-sm mt-1">Pick up where you left off at {new Date(resumeTime * 1000).toISOString().substr(14, 5)}</p>
                                                    </div>
                                                    <div className="space-y-2 pt-2">
                                                        <Button className="w-full" onClick={() => {
                                                            if (videoRef.current) videoRef.current.currentTime = resumeTime;
                                                            setShowResumePrompt(false);
                                                        }}>Continue Watching</Button>
                                                        <Button variant="ghost" className="w-full text-slate-400 hover:text-white" onClick={() => setShowResumePrompt(false)}>Start Over</Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    )}
                                    <MovingWatermark />
                                </div>
                            ) : (
                                <div className="aspect-video max-h-[50vh] flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 p-8">
                                    <div className="text-center max-w-lg">
                                        <div className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-xl mb-6 ring-1 ring-white/20">
                                            {currentLesson.type === 'text' ? <FileText className="size-12 text-blue-400" /> : <HelpCircle className="size-12 text-amber-400" />}
                                        </div>
                                        <h2 className="text-3xl font-bold text-white mb-4">{currentLesson.title}</h2>
                                        <p className="text-slate-300">This is a {currentLesson.type} based lesson. Please review the content below.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CONTENT DESCRIPTION */}
                        <div className="max-w-4xl mx-auto px-6 py-12">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-primary font-semibold mb-2 uppercase tracking-wider">
                                        <Award className="size-4" />
                                        Lesson {currentLessonIndex + 1} of {lessons.length}
                                    </div>
                                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">{currentLesson.title}</h1>
                                </div>
                                {currentLesson.type !== 'video' && !currentLesson.is_completed && (
                                    <Button size="lg" onClick={markAsComplete} className="shadow-lg shadow-primary/20">
                                        <ClipboardCheck className="mr-2 size-5" />
                                        Mark as Complete
                                    </Button>
                                )}
                                {videoHasFinished && nextLesson && (
                                    <Button size="lg" onClick={() => handleLessonClick(nextLesson)} className="shadow-xl shadow-primary/30">
                                        Next Lesson
                                        <ChevronRight className="ml-2 size-5" />
                                    </Button>
                                )}
                            </div>

                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200/50 dark:border-slate-800/50 leading-relaxed text-lg whitespace-pre-wrap">
                                    {currentLesson.description || "No description provided for this lesson."}
                                </div>
                            </div>

                            {currentLesson.type === 'quiz' && currentLesson.quiz && (
                                <div className="mt-12 p-8 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/50 flex flex-col items-center text-center">
                                    <HelpCircle className="size-16 text-amber-500 mb-6" />
                                    <h3 className="text-2xl font-bold mb-2">Quiz Time!</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm">Test your knowledge on the concepts covered in this section.</p>
                                    <Button size="lg" variant="default" className="bg-amber-600 hover:bg-amber-700 px-12" asChild>
                                        <Link href={route('quizzes.show', currentLesson.quiz.id)}>Start Quiz Now</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* LESSON SIDEBAR */}
                <aside className={cn(
                    "w-80 bg-white dark:bg-slate-900 border-l border-slate-200/50 dark:border-slate-800/50 flex flex-col transition-all duration-300 z-40 lg:static fixed inset-y-0 right-0",
                    isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
                )}>
                    <div className="p-6 border-b flex items-center justify-between">
                        <div className="flex flex-col">
                            <h3 className="font-bold text-lg">Curriculum</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-2 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${enrollment?.progress || 0}%` }} />
                                </div>
                                <span className="text-xs font-bold text-muted-foreground">{Math.round(enrollment?.progress || 0)}%</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
                            <X className="size-5" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                        {lessons.map((lesson, idx) => {
                            const isActive = lesson.id === currentLesson.id;
                            return (
                                <button
                                    key={lesson.id}
                                    onClick={() => handleLessonClick(lesson)}
                                    className={cn(
                                        "w-full group px-6 py-4 flex items-start gap-3 transition-colors text-left",
                                        isActive ? "bg-primary/5 active-lesson border-r-4 border-primary" : "hover:bg-slate-50 dark:hover:bg-slate-800/30"
                                    )}
                                >
                                    <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                                        {getLessonIcon(lesson, isActive)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Lesson {idx + 1}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                                                <Clock className="size-3" />
                                                Video
                                            </span>
                                        </div>
                                        <h4 className={cn(
                                            "text-sm font-bold line-clamp-2 transition-colors",
                                            isActive ? "text-primary" : "text-slate-700 dark:text-slate-300"
                                        )}>
                                            {lesson.title}
                                        </h4>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-6 border-t bg-slate-50/50 dark:bg-slate-800/20">
                        <Link href={route('courses.show', course.slug)}>
                            <Button variant="outline" className="w-full border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                                <ArrowLeft className="mr-2 size-4" />
                                Return to Details
                            </Button>
                        </Link>
                    </div>
                </aside>
            </div>
        </AppLayout>
    );
}

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("bg-white rounded-2xl shadow-xl", className)}>
        {children}
    </div>
);
