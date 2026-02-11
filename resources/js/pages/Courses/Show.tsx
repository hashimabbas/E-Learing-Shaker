// resources/js/pages/Courses/Show.tsx
import AppLayout from '@/layouts/app-layout';
import { Course, Instructor, Lesson, type SharedData } from '@/types';
import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import {
    Star,
    Video,
    Download,
    User as UserIcon,
    ShoppingCart,
    MessageCircle,
    ArrowRight,
    Heart,
    CheckCircle2,
    Clock,
    Globe,
    FileText,
    Users,
    Unlock,
    PlayCircle,
    Award,
    BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { route } from 'ziggy-js';
import { useCart } from '@/hooks/use-cart';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { Textarea } from '@/components/ui/textarea';
import { toast } from "sonner";
import { cn } from '@/lib/utils';

interface CoursesShowProps {
    course: Course & {
        lessons: Lesson[],
        reviews: any[],
        instructor: Instructor,
        discussions: any[],
        reviews_count: number,
        average_rating: number,
        learning_outcomes: string[],
        preview_video_url?: string
    };
    instructor: Instructor;
    isEnrolled: boolean;
    inWishlist: boolean;
    lockedUntil: string | null;
}

const StarRating = ({ rating, size = 4 }: { rating: number, size?: number }) => {
    return (
        <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    className={cn(i < Math.floor(rating) ? "fill-amber-500" : "fill-transparent", `size-${size}`)}
                />
            ))}
        </div>
    );
};

function ReviewForm({ courseSlug, hasSubmittedReview }: { courseSlug: string, hasSubmittedReview: boolean }) {
    const [hoverRating, setHoverRating] = useState(0);
    const { translations } = usePage<SharedData & { translations: any, locale: string }>().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 0,
        comment: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (data.rating === 0) {
            toast.error(translations.review_rating_error);
            return;
        }

        post(route('reviews.store', { course: courseSlug }), {
            onSuccess: () => {
                reset();
                toast.success(hasSubmittedReview ? translations.review_update_success : translations.review_success);
            },
            preserveScroll: true,
        });
    };

    return (
        <Card className="p-6 border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl shadow-sm">
            <h4 className="text-xl font-bold mb-4">{hasSubmittedReview ? translations.update_review : translations.write_review}</h4>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col gap-2">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{translations.rating_label || 'Rating'}</Label>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "size-8 cursor-pointer transition-all duration-200",
                                        i < (hoverRating || data.rating) ? "fill-amber-500 text-amber-500" : "text-slate-300 dark:text-slate-700 hover:text-amber-400"
                                    )}
                                    onClick={() => setData('rating', i + 1)}
                                    onMouseEnter={() => setHoverRating(i + 1)}
                                    onMouseLeave={() => setHoverRating(0)}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-bold text-slate-500">{data.rating > 0 ? `${data.rating}/5` : ''}</span>
                    </div>
                    <InputError message={errors.rating} />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground text-foreground">{translations.message_label || 'Message'}</Label>
                    <Textarea
                        placeholder={translations.review_placeholder}
                        value={data.comment}
                        onChange={(e) => setData('comment', e.target.value)}
                        rows={4}
                        className="rounded-2xl border-slate-200 dark:border-slate-800"
                    />
                    <InputError message={errors.comment} />
                </div>

                <Button type="submit" disabled={processing || data.rating === 0} className="w-full py-6 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                    {processing ? translations.submitting : hasSubmittedReview ? translations.update_review_btn : translations.post_review}
                </Button>
            </form>
        </Card>
    );
}

const getEmbedUrl = (url?: string) => {
    if (!url) return "";

    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/);
    if (vimeoMatch && vimeoMatch[3]) {
        return `https://player.vimeo.com/video/${vimeoMatch[3]}`;
    }

    return url;
};

export default function CoursesShow({ course, instructor, isEnrolled, inWishlist, lockedUntil }: CoursesShowProps) {
    const [activeTab, setActiveTab] = useState<'description' | 'curriculum' | 'reviews' | 'instructor' | 'discussions'>('description');
    const { auth, translations, locale } = usePage<SharedData & { translations: any, locale: string }>().props;
    const outcomes = Array.isArray(course.learning_outcomes) ? course.learning_outcomes : [];
    const userHasReviewed = (course as any).user_has_reviewed || false;

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleWishlistToggle = () => {
        if (!auth.user) { router.get(route('login')); return; }
        if (inWishlist) {
            router.delete(route('wishlist.destroy', course.slug), { preserveScroll: true });
        } else {
            router.post(route('wishlist.store', course.slug), {}, { preserveScroll: true });
        }
    };

    const [processing, setProcessing] = useState(false);
    const { increment } = useCart();

    const handleEnrollOrPurchase = () => {
        if (!auth.user) { router.get(route('login')); return; }
        const price = Number(course.price);

        if (isNaN(price) || price === 0) {
            setProcessing(true);
            router.post(route('courses.enroll.free', { course: course.slug }), {}, {
                onSuccess: () => toast.success(translations.enrollment_success),
                onFinish: () => setProcessing(false)
            });
            return;
        }

        setProcessing(true);
        increment(); // Optimistic update
        router.post(route('cart.store', { course: course.slug }), {}, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(translations.added_to_cart);
            },
            onFinish: () => setProcessing(false)
        });
    };


    return (
        <AppLayout>
            <Head title={course.title} />

            {/* PREMIUM HERO SECTION */}
            <div className="relative overflow-hidden bg-slate-950 text-white pb-32 pt-16 lg:pb-48 lg:pt-24 border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/course-details-hero-bg.png"
                        className="w-full h-full object-cover opacity-60"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary ring-1 ring-inset ring-primary/30 uppercase tracking-widest">
                                    {translations.course_license}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-slate-300">
                                    <Globe className="size-4" /> {translations.course_language}
                                </span>
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                {locale === 'ar' ? course.title_ar : course.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-8 text-sm">

                                <div className="text-slate-400">
                                    {translations.course_instructor}: <span className="text-white font-bold underline decoration-primary underline-offset-4">{instructor.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STICKY ENROLLMENT CARD */}
            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative -mt-32 lg:-mt-48 z-20 pb-24">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8 items-start">
                    {/* Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* REDESIGNED PREMIUM TABS NAVIGATION */}
                        <div className="sticky top-24 z-30 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            <div className="relative group/tabs">
                                {/* Glow Background */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-500/20 to-primary/20 rounded-[2.5rem] blur-xl opacity-0 group-hover/tabs:opacity-100 transition duration-1000" />

                                <div className="relative bg-slate-950/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-2 shadow-2xl flex items-center gap-1 overflow-x-auto scrollbar-hide" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                                    {[
                                        { id: 'description', label: translations.tab_description || 'Description', icon: BookOpen },
                                        { id: 'curriculum', label: translations.tab_curriculum || 'Curriculum', icon: PlayCircle, count: course.lessons.length },
                                        { id: 'instructor', label: translations.tab_instructor || 'Instructor', icon: UserIcon },
                                        { id: 'discussions', label: translations.tab_community || 'Community', icon: MessageCircle },
                                    ].map((tab) => {
                                        const isActive = activeTab === tab.id;
                                        const Icon = tab.icon;

                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id as any)}
                                                className={cn(
                                                    "relative flex items-center gap-3 px-8 py-4 rounded-[2rem] text-sm font-black transition-all duration-500 whitespace-nowrap group animate-in fade-in",
                                                    isActive
                                                        ? "text-primary"
                                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                                )}
                                            >
                                                {/* Active background indicator */}
                                                {isActive && (
                                                    <div className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-[2rem] animate-in zoom-in duration-500" />
                                                )}

                                                <Icon className={cn(
                                                    "size-5 transition-all duration-500",
                                                    isActive ? "text-primary scale-110 rotate-3" : "text-slate-500 group-hover:text-white group-hover:scale-110"
                                                )} />

                                                <span className="relative z-10 tracking-wide uppercase font-black text-xs">
                                                    {tab.label}
                                                </span>

                                                {tab.count !== undefined && (
                                                    <span className={cn(
                                                        "ml-1 px-2 py-0.5 rounded-lg text-[10px] font-black border transition-all duration-500",
                                                        isActive
                                                            ? "bg-primary text-slate-950 border-primary shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                                            : "bg-white/5 text-slate-400 border-white/10"
                                                    )}>
                                                        {tab.count}
                                                    </span>
                                                )}

                                                {/* Bottom Active Glow */}
                                                {isActive && (
                                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-primary blur-sm rounded-full opacity-50" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* TAB CONTENT */}
                        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 p-10 shadow-sm" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                            {activeTab === 'description' && (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="mb-16">
                                        <div className="flex items-center justify-between mb-10">
                                            <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                                                {translations.what_you_will_master || "What you will master"}
                                            </h3>
                                            <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                                <PlayCircle className="size-6" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {(locale === 'ar' ? (course.learning_outcomes_ar || []) : outcomes).map((outcome: string, index: number) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50/50 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:border-primary/20 hover:bg-white dark:hover:bg-slate-800/40 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none group"
                                                >
                                                    <span className="text-base font-bold text-slate-700 dark:text-slate-300 transition-colors group-hover:text-slate-900 dark:group-hover:text-white">{outcome}</span>
                                                    <div className="size-6 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all group-hover:border-primary group-hover:bg-primary/5">
                                                        <CheckCircle2 className="size-3.5 text-slate-300 dark:text-slate-600 transition-colors group-hover:text-primary" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator className="my-10" />

                                    <h3 className="text-2xl font-black mb-6">{translations.course_overview}</h3>
                                    <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-loose">
                                        {locale === 'ar' ? course.description_ar : course.description}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'curriculum' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-2xl font-black">{translations.course_modules}</h3>
                                        <span className="text-sm font-bold text-muted-foreground">{course.lessons.length} {translations.sections}</span>
                                    </div>
                                    <div className="space-y-2">
                                        {course.lessons.map((lesson: Lesson, index: number) => (
                                            <div key={lesson.id} className="group flex items-center justify-between p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        {lesson.type === 'video' ? <Video className="size-5" /> : <FileText className="size-5" />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-muted-foreground/50">{translations.section} {index + 1}</span>
                                                            {lesson.is_free_preview && <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-wider border border-green-500/20">{translations.preview}</span>}
                                                        </div>
                                                        <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary transition-colors">{lesson.title}</h4>
                                                    </div>
                                                </div>
                                                {lesson.is_free_preview ? (
                                                    <Button size="sm" variant="ghost" className="text-primary font-bold">{translations.watch_free}</Button>
                                                ) : (
                                                    <Unlock className="size-4 text-slate-300 dark:text-slate-700" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-12 animate-in fade-in duration-500">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-8">
                                        <div className="space-y-1">
                                            <h3 className="text-4xl font-black">
                                                {Number(course.average_rating) > 0
                                                    ? course.average_rating.toFixed(1)
                                                    : (translations.course_no_rating_yet || "No ratings yet")}
                                            </h3>
                                            <StarRating rating={course.average_rating} size={6} />
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest pt-2">{translations.course_rating}</p>
                                        </div>
                                        <div className="flex-1 max-w-xs space-y-2">
                                            {[5, 4, 3, 2, 1].map((s) => (
                                                <div key={s} className="flex items-center gap-3">
                                                    <span className="text-xs font-bold w-3">{s}</span>
                                                    <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div className="h-full bg-amber-400" style={{ width: s === 5 ? '85%' : s === 4 ? '12%' : '1%' }} />
                                                    </div>
                                                    <span className="text-xs font-medium text-slate-400">{s === 5 ? '85%' : s === 4 ? '12%' : '1%'}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {auth.user ? (
                                        <ReviewForm courseSlug={course.slug} hasSubmittedReview={userHasReviewed} />
                                    ) : (
                                        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/30 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                                            <p className="font-bold text-slate-500">{translations.review_join_community}</p>
                                            <Button variant="link" className="text-primary font-black mt-2" asChild>
                                                <Link href={route('login')}>{translations.login_to_review}</Link>
                                            </Button>
                                        </div>
                                    )}

                                    <div className="space-y-8">
                                        {course.reviews.map((review: any) => (
                                            <div key={review.id} className="relative pl-12">
                                                <div className="absolute left-0 top-0 size-10 rounded-2xl overflow-hidden ring-2 ring-slate-100 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                                    {review.user.avatar ? <img src={review.user.avatar} className="w-full h-full object-cover" /> : <UserIcon className="size-5 text-slate-400" />}
                                                </div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <h5 className="font-black text-slate-900 dark:text-white">{review.user.name}</h5>
                                                    <span className="text-xs font-medium text-muted-foreground italic">{translations.updated_recently}</span>
                                                </div>
                                                <StarRating rating={review.rating} size={4} />
                                                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed italic">"{review.comment}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'instructor' && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-800/50">
                                        <div className="size-32 rounded-[2rem] overflow-hidden bg-slate-200 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none shrink-0 group">
                                            {instructor.avatar ? <img src={instructor.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <UserIcon className="size-16 m-8 text-slate-400" />}
                                        </div>
                                        <div className="text-center md:text-left space-y-4">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{instructor.name}</h3>
                                                <p className="text-primary font-bold text-sm uppercase tracking-widest pt-1">{translations.instructor_title}</p>
                                            </div>
                                            <div className="flex items-center justify-center md:justify-start gap-6 py-2">
                                                <div className="text-center md:text-left">
                                                    <p className="text-xl font-black leading-none">{instructor.courses_count || '2'}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase pt-1">{translations.instructor_courses}</p>
                                                </div>
                                                <div className="text-center md:text-left border-x px-6 border-slate-200 dark:border-slate-800">
                                                    <p className="text-xl font-black leading-none">{translations.instructor_students_count}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground uppercase pt-1">{translations.instructor_students}</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                {translations.instructor_bio}
                                                <br /><br />
                                                {translations.instructor_bio_2}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'discussions' && (
                                <div className="text-center py-16 animate-in zoom-in duration-500">
                                    <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8">
                                        <MessageCircle className="size-10 text-primary" />
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{translations.learning_community}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-10 font-medium">
                                        {translations.community_desc}
                                    </p>
                                    <Button size="lg" className="rounded-2xl px-12 py-7 font-black text-lg shadow-xl shadow-primary/20" asChild>
                                        <Link href={route('discussions.index', course.slug)}>
                                            {translations.enter_forum}
                                            <ArrowRight className="ml-2 size-6" />
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Card */}
                    <div className="mt-12 lg:mt-0">
                        <div className="sticky top-24 space-y-6 animate-in slide-in-from-right-4 duration-700">
                            <Card className="overflow-hidden border-none shadow-2xl rounded-[3rem] bg-white dark:bg-slate-900 group">
                                <div className="relative aspect-video bg-slate-950">
                                    {course.preview_video_url ? (
                                        <iframe
                                            src={getEmbedUrl(course.preview_video_url)}
                                            className="w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 group-hover:text-primary transition-colors cursor-pointer">
                                            <PlayCircle className="size-20 mb-3 animate-pulse" />
                                            <span className="font-black uppercase tracking-widest text-xs">{translations.preview_course}</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 transition-all group-hover:ring-black/0 pointer-events-none" />
                                </div>

                                <div className="p-8 space-y-8">
                                    <div className="flex items-baseline gap-3">
                                        {course.has_active_discount ? (
                                            <>
                                                <span className="text-4xl font-black text-slate-900 dark:text-white">
                                                    {translations.course_price_currency || 'USD'} {Number(course.discounted_price).toFixed(2)}
                                                </span>
                                                <span className="text-sm font-bold text-slate-400 line-through">
                                                    {translations.course_price_currency || 'USD'} {Number(course.price).toFixed(2)}
                                                </span>
                                                <span className="text-xs font-black text-green-500 uppercase tracking-widest ml-auto">{course.discount_percentage}% OFF</span>
                                            </>
                                        ) : (
                                            <span className="text-4xl font-black text-slate-900 dark:text-white">
                                                {Number(course.price) > 0 ? `${translations.course_price_currency || 'USD'} ${Number(course.price).toFixed(2)}` : translations.course_price_free || 'Free'}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {isEnrolled ? (
                                            lockedUntil ? (
                                                <div className="space-y-2">
                                                    <Button size="lg" disabled className="w-full h-16 rounded-2xl text-lg font-black bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 cursor-not-allowed shadow-none">
                                                        <Clock className="mr-3 size-6 animate-pulse" />
                                                        {translations.verifying_payment}
                                                    </Button>
                                                    <p className="text-center text-xs font-bold text-amber-500 bg-amber-500/10 py-2 rounded-lg">
                                                        {translations.access_unlocks_on} {new Date(lockedUntil).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                                                    </p>
                                                </div>
                                            ) : (
                                                <Button size="lg" className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/30" onClick={() => router.get(route('student.resume-course', { course: course.slug }))}>
                                                    {translations.continue_masterclass}
                                                    <ArrowRight className="ml-3 size-6" />
                                                </Button>
                                            )
                                        ) : (
                                            <>
                                                <Button size="lg" disabled={processing} className="w-full h-16 rounded-2xl text-lg font-black shadow-xl shadow-primary/30" onClick={handleEnrollOrPurchase}>
                                                    {Number(course.price) > 0 ? (
                                                        <>
                                                            <ShoppingCart className={cn("mr-3 size-6", processing && "animate-bounce")} />
                                                            {processing ? translations.processing || 'Processing...' : translations.subscribe_now}
                                                        </>
                                                    ) : (
                                                        <>
                                                            {translations.enroll_now_free}
                                                            <ArrowRight className="ml-3 size-6" />
                                                        </>
                                                    )}
                                                </Button>

                                                <Button size="lg" variant="outline" className="w-full h-14 rounded-2xl font-bold border-slate-200 dark:border-slate-800" onClick={handleWishlistToggle}>
                                                    <Heart className={cn("mr-3 size-6 transition-all", inWishlist ? "fill-red-500 text-red-500 scale-110" : "")} />
                                                    {inWishlist ? translations.wishlisted : translations.add_to_wishlist}
                                                </Button>
                                            </>
                                        )}
                                    </div>

                                    {/* <div className="space-y-4">
                                        <h5 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/50 border-b border-slate-100 dark:border-slate-800 pb-2">{translations.course_metrics}</h5>
                                        <div className="grid grid-cols-1 gap-4">
                                            {[
                                                { icon: Video, label: translations.metrics_video_label },
                                                { icon: Trophy, label: translations.metrics_certificate_label },
                                                { icon: Rocket, label: translations.metrics_access_label },
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                                                    <div className="size-6 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-primary/70 shrink-0">
                                                        <item.icon className="size-3.5" />
                                                    </div>
                                                    {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div> */}
                                </div>
                            </Card>

                            {/* <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-white/5 space-y-4">
                                <h5 className="text-white font-black">{translations.institutional_training}</h5>
                                <p className="text-slate-400 text-sm font-medium">{translations.business_plan_desc}</p>
                                <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5 font-bold rounded-xl">{translations.morpho_for_business}</Button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

// Icon fallbacks for missing lucide imports
const Trophy = (props: any) => <Award {...props} />;
const Rocket = (props: any) => <Star {...props} />;
