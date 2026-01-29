// resources/js/pages/MyLearning/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, BarChart3, ChevronRight, Search, Play, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import { SharedData } from '@/types';

export interface PaginatedData<T> {
    data: T[];
    links: any;
    meta: any;
    total: number;
}

export interface Course {
    id: number;
    title: string;
    localized_title?: string;
    slug: string;
    description: string;
    thumbnail: string | null;
    price: string;
}

interface EnrolledCourse extends Course {
    pivot: {
        progress: number;
        completed_at: string | null;
    };
    instructor: { name: string };
}

interface MyLearningIndexProps {
    auth: { user: { name: string } };
    enrolledCourses: PaginatedData<EnrolledCourse>;
    recentlyViewed: EnrolledCourse[];
    recommendations: Course[];
}

const EnrolledCourseCard = ({ course }: { course: EnrolledCourse }) => {
    const { translations } = usePage<SharedData & { translations: any }>().props;
    const isCompleted = !!course.pivot.completed_at;
    const progressValue = Math.min(Math.max(course.pivot.progress, 0), 100);

    return (
        <Card className="group relative overflow-hidden border-none bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <div className="relative aspect-video overflow-hidden rounded-t-xl font-sans">
                <Link href={`/courses/${course.slug}/learn`}>
                    <img
                        src={course.thumbnail || '/images/default-thumbnail.jpg'}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                </Link>

                {isCompleted && (
                    <div className="absolute top-3 right-3 rounded-full bg-green-500/90 p-1.5 text-white backdrop-blur-md shadow-lg">
                        <Trophy className="h-4 w-4" />
                    </div>
                )}

                <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between text-xs text-white/90 mb-1.5">
                        <span className="font-medium">{isCompleted ? (translations.completed || 'Completed') : `${Math.round(progressValue)}% ${translations.complete || 'Complete'}`}</span>
                    </div>
                    <Progress value={progressValue} className="h-1.5 bg-white/20" />
                </div>
            </div>

            <CardContent className="p-5">
                <Link href={`/courses/${course.slug}/learn`} className="block group/title">
                    <h3 className="text-lg font-bold leading-tight group-hover/title:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                        {course.localized_title || course.title}
                    </h3>
                </Link>
                <p className="mt-2 text-sm text-muted-foreground flex items-center">
                    <span className="w-2 h-2 rounded-full bg-primary/40 mr-2" />
                    {course.instructor.name}
                </p>

                <div className="mt-6">
                    {isCompleted ? (
                        <Button
                            variant="outline"
                            className="w-full border-primary/20 hover:bg-primary/5 group-hover:border-primary/50 transition-colors"
                            onClick={() => router.post(route('student.certificate.generate', { course: course.slug }))}
                        >
                            <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                            {translations.get_certificate || 'Get Certificate'}
                        </Button>
                    ) : (
                        <Link href={route('student.resume-course', { course: course.slug })}>
                            <Button className="w-full shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                                <Play className="mr-2 h-4 w-4 fill-current" />
                                {translations.resume || 'Resume'}
                                <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default function MyLearningIndex({ auth, enrolledCourses, recentlyViewed, recommendations }: MyLearningIndexProps) {
    const { translations, locale } = usePage<SharedData & { translations: any, locale: string }>().props;
    const mostRecent = recentlyViewed[0];
    const isRtl = locale === 'ar';

    return (
        <AppLayout>
            <Head title={translations.my_learning || "My Learning"} />

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-slate-950 py-16 lg:py-24" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="absolute inset-0 opacity-40">
                    <img
                        src="/images/learning-hero-bg.png"
                        alt="Hero background"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                </div>

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center space-x-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20 mb-6">
                                <Sparkles className="h-4 w-4" />
                                <span>{translations.welcome_back || "Welcome back,"} {auth.user.name.split(' ')[0]}!</span>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
                                {translations.hero_title || "Level up your skills today."}
                            </h1>
                            <p className="mt-6 text-xl text-slate-300 max-w-lg leading-relaxed">
                                {(translations.hero_desc || "You have :count active courses. Ready to pick up where you left off?").replace(':count', enrolledCourses.total.toString())}
                            </p>

                            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400`} />
                                    <input
                                        type="text"
                                        placeholder={translations.search_placeholder || "Search your courses..."}
                                        className={`h-12 w-full rounded-xl bg-white/10 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-white placeholder-slate-400 backdrop-blur-md outline-none border border-white/10 focus:border-primary/50 transition-colors`}
                                    />
                                </div>
                                <Link href={route('courses.index')}>
                                    <Button size="lg" className="h-12 px-8 rounded-xl font-bold bg-white text-slate-950 hover:bg-slate-200">
                                        {translations.explore_all || "Explore All"}
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {mostRecent && (
                            <div className="hidden lg:block">
                                <Card className="overflow-hidden border-none bg-white/10 backdrop-blur-xl ring-1 ring-white/20">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-sm font-semibold uppercase tracking-wider text-primary/80">{translations.continue_learning || "Continue Learning"}</span>
                                            <span className="text-sm text-slate-400 flex items-center">
                                                <Clock className={`h-4 w-4 ${isRtl ? 'ml-1.5' : 'mr-1.5'}`} />
                                                {translations.last_active || "Last active"}
                                            </span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-6 line-clamp-1">{mostRecent.localized_title || mostRecent.title}</h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-slate-300">{mostRecent.pivot.progress}% {translations.complete || "Complete"}</span>
                                                <span className="text-primary font-bold">{translations.soon_to_finish || "Soon to finish!"}</span>
                                            </div>
                                            <Progress value={mostRecent.pivot.progress} className="h-3 bg-white/10" />
                                        </div>

                                        <Link href={route('student.resume-course', mostRecent.slug)} className="mt-8 block">
                                            <Button className="w-full h-12 rounded-xl text-lg font-bold group">
                                                {translations.resume_now || "Resume Now"}
                                                <ChevronRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180 mr-2' : 'ml-2'}`} />
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
                {/* Recently Viewed - Horizontal Scroll */}
                {recentlyViewed.length > 0 && (
                    <div className="mb-20">
                        <div className="flex items-end justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground">{translations.jump_back_in || "Jump back in"}</h2>
                                <p className="text-muted-foreground mt-1">{translations.jump_back_in_desc || "Pick up where you left off in these courses."}</p>
                            </div>
                        </div>

                        <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
                                {recentlyViewed.map((course) => (
                                    <div key={course.id} className="w-[300px] shrink-0 snap-start">
                                        <Link href={`/courses/${course.slug}/learn`} className="group block">
                                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 shadow-md transition-shadow group-hover:shadow-xl">
                                                <img
                                                    src={course.thumbnail || '/images/default-thumbnail.jpg'}
                                                    alt={course.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <Progress value={course.pivot.progress} className="h-1 bg-white/30" />
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{course.localized_title || course.title}</h4>
                                            <p className="text-sm text-muted-foreground mt-1 flex items-center">
                                                <Clock className={`h-3.5 w-3.5 ${isRtl ? 'ml-1.5' : 'mr-1.5'}`} />
                                                {course.pivot.progress}% {translations.progress || "progress"}
                                            </p>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* All Enrolled Courses */}
                <div className="mb-20">
                    <div className="flex items-end justify-between mb-8 border-b pb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground">{translations.my_courses_page_title || "My Courses"}</h2>
                            <p className="text-muted-foreground mt-1">{translations.my_courses_page_desc || "A complete list of everything you're learning."}</p>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                                {enrolledCourses.total} {translations.courses_total || "Courses Total"}
                            </span>
                        </div>
                    </div>

                    {enrolledCourses.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {enrolledCourses.data.map((course) => (
                                <EnrolledCourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 border-2 border-dashed rounded-3xl bg-muted/30">
                            <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                                <BookOpen className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold">{translations.no_courses_enrolled || "No courses yet"}</h3>
                            <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
                                {translations.no_courses_enrolled_desc || "You haven't enrolled in any courses. Start exploring our library to find your next favorite course!"}
                            </p>
                            <Link href={route('courses.index')} className="mt-8 inline-block">
                                <Button size="lg" className="px-10 rounded-xl font-bold">
                                    {translations.browse_courses || "Browse Courses"}
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div className="relative rounded-[2.5rem] bg-primary/5 p-8 lg:p-12 overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Sparkles className="h-32 w-32" />
                        </div>

                        <div className="relative">
                            <h2 className="text-3xl font-bold mb-8">{translations.recommended_for_you || "Recommended for you"}</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {recommendations.map((course) => (
                                    <Link key={course.id} href={route('courses.show', course.slug)} className="group">
                                        <Card className="h-full border-none shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1 rounded-2xl">
                                            <div className="aspect-video overflow-hidden rounded-t-2xl">
                                                <img
                                                    src={course.thumbnail || '/images/default-thumbnail.jpg'}
                                                    alt={course.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <CardContent className="p-4">
                                                <h5 className="font-bold line-clamp-2 group-hover:text-primary transition-colors">{course.localized_title || course.title}</h5>
                                                <div className="mt-4 flex items-center justify-between">
                                                    <span className="text-primary font-bold">
                                                        OMR {course.price ? parseFloat(course.price).toFixed(2) : '0.00'}
                                                    </span>
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                        <ChevronRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
