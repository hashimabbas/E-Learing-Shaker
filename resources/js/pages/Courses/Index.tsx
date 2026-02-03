// resources/js/pages/Courses/Index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Search,
    Star,
    Clock,
    Users,
    BookOpen,
    Award,
    TrendingUp,
    Sparkles,
    ArrowRight,
    PlayCircle
} from 'lucide-react';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';

import AppLayout from '@/layouts/app-layout';
import PublicLayout from '@/layouts/PublicLayout';

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Course {
    id: number;
    title: string;
    localized_title?: string;
    slug: string;
    price: number | string;
    average_rating: number;
    thumbnail?: string;
    thumbnail_url?: string;
    instructor?: {
        name: string;
    };
    category?: Category;
}

interface Props {
    courses?: Course[];
    categories?: Category[];
    canRegister?: boolean;
}

const FeaturedCourseCard = ({ course, translations, isRtl }: { course: Course, translations: any, isRtl: boolean }) => (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-neutral-900/40 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:border-primary/40 hover:shadow-primary/10">
        {/* Background Glow Effects */}
        <div className={cn("absolute top-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000 animate-pulse", isRtl ? "-left-48" : "-right-48")} />
        <div className={cn("absolute bottom-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000 animate-pulse delay-700", isRtl ? "-right-48" : "-left-48")} />

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 lg:p-14">
            {/* Course Image/Visual */}
            <div className={cn("flex items-center justify-center", isRtl ? "lg:order-2" : "lg:order-1")}>
                <div className="relative w-full max-w-lg">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-blue-500/20 rounded-[2rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
                    <div className="relative aspect-[16/10] rounded-[2rem] bg-neutral-950 border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-[1.02] transition-transform duration-700 shadow-2xl">
                        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
                        {(course.thumbnail_url || course.thumbnail) ? (
                            <img
                                src={course.thumbnail_url || course.thumbnail}
                                alt={course.localized_title || course.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <BookOpen className="h-28 w-28 text-primary/40 relative z-10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-[2px]">
                            <div className="bg-primary text-white rounded-full p-6 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl shadow-primary/50">
                                <PlayCircle className="h-14 w-14 fill-current" />
                            </div>
                        </div>
                    </div>

                    {/* Floating Badge */}
                    {parseFloat(course.price.toString()) === 0 && (
                        <div className={cn("absolute -top-6 bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-emerald-500/30 transform group-hover:scale-110 group-hover:-rotate-3 transition-all", isRtl ? "-left-6 -rotate-6" : "-right-6 rotate-6")}>
                            <span className="font-black text-xl uppercase tracking-tighter">{translations.course_price_free || "Free Access"}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Course Details */}
            <div className={cn("flex flex-col justify-center space-y-8", isRtl ? "lg:order-1" : "lg:order-2")}>
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-primary/20 backdrop-blur-md border border-primary/30 px-5 py-2.5 rounded-2xl">
                        <span className="text-primary font-black text-sm uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="h-4 w-4 fill-current" />
                            {translations.courses_index_featured_badge || "Premium Course"}
                        </span>
                    </div>
                    {course.category && (
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl">
                            <span className="text-white/80 font-bold text-sm tracking-wide">{course.category.name}</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <div className="space-y-4">
                    <h2 className="text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight transition-colors">
                        {course.localized_title || course.title}
                    </h2>
                    {course.instructor?.name && (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 w-fit">
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Award className="h-5 w-5 text-primary" />
                            </div>
                            <p className="text-lg text-neutral-400">
                                {translations.courses_index_by || "with"} <span className="text-white font-bold">{course.instructor.name}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 lg:gap-8">
                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl group/stat hover:bg-white/10 transition-colors">
                        <div className="bg-yellow-500/10 w-10 h-10 flex items-center justify-center rounded-xl mb-3 group-hover/stat:scale-110 transition-transform">
                            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        </div>
                        <div className="text-2xl font-black text-white">4.9</div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{translations.courses_index_rating_label || "Rating"}</div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl group/stat hover:bg-white/10 transition-colors">
                        <div className="bg-blue-500/10 w-10 h-10 flex items-center justify-center rounded-xl mb-3 group-hover/stat:scale-110 transition-transform">
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="text-2xl font-black text-white">2k+</div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{translations.courses_index_students_label || "Active"}</div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-5 rounded-3xl group/stat hover:bg-white/10 transition-colors">
                        <div className="bg-primary/10 w-10 h-10 flex items-center justify-center rounded-xl mb-3 group-hover/stat:scale-110 transition-transform">
                            <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-2xl font-black text-white">12h</div>
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{translations.courses_index_duration_label || "Length"}</div>
                    </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center gap-6 pt-6">
                    <div className="flex-shrink-0">
                        <div className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">{translations.courses_index_price_label || "Investment"}</div>
                        <div className="text-4xl font-black text-white flex items-baseline gap-1">
                            {parseFloat(course.price.toString()) > 0
                                ? <>{parseFloat(course.price.toString()).toFixed(1)} <span className="text-lg font-bold opacity-60 uppercase">{translations.course_price_currency || 'OMR'}</span></>
                                : <span className="text-emerald-500">{translations.course_price_free || 'FREE'}</span>}
                        </div>
                    </div>
                    <Link href={route('courses.show', { course: course.slug })} className="flex-1">
                        <Button
                            size="lg"
                            className="w-full h-16 rounded-[1.25rem] bg-primary text-white font-black text-xl shadow-[0_20px_50px_rgba(62,56,56,0.3)] hover:bg-yellow-500 hover:shadow-primary/40 hover:-translate-y-1 transition-all group/btn border-none"
                        >
                            {translations.courses_index_enroll_now || "Get Started"}
                            <ArrowRight className={cn("ml-3 h-6 w-6 group-hover/btn:translate-x-2 transition-transform", isRtl && "rotate-180 group-hover/btn:-translate-x-2")} />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

const CompactCourseCard = ({ course, translations, isRtl }: { course: Course, translations: any, isRtl: boolean }) => (
    <Link
        href={route('courses.show', { course: course.slug })}
        className="group relative flex flex-col h-full rounded-[2rem] bg-neutral-900/50 backdrop-blur-md border border-white/5 hover:border-primary/40 hover:bg-neutral-800/80 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 overflow-hidden"
    >
        {/* Course Visual */}
        <div className="relative aspect-[16/9] w-full overflow-hidden">
            <div className="absolute inset-0 bg-neutral-950 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                {(course.thumbnail_url || course.thumbnail) ? (
                    <img
                        src={course.thumbnail_url || course.thumbnail}
                        alt={course.localized_title || course.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-3">
                        <BookOpen className="h-12 w-12 text-primary/30" />
                    </div>
                )}
            </div>

            {/* Price Badge over thumb */}
            <div className={cn("absolute bottom-4", isRtl ? "left-4" : "right-4")}>
                <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl">
                    <span className="text-primary font-black text-lg">
                        {parseFloat(course.price.toString()) > 0
                            ? `${parseFloat(course.price.toString())}`
                            : (translations.course_price_free || "Free")}
                    </span>
                    {parseFloat(course.price.toString()) > 0 && <span className="text-[10px] text-white/50 ml-1 font-bold">{translations.course_price_currency || 'OMR'}</span>}
                </div>
            </div>

            {/* Hover Play Overlay */}
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[1px]">
                <div className="bg-white text-primary rounded-full p-4 transform scale-50 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                    <PlayCircle className="h-8 w-8 fill-current" />
                </div>
            </div>
        </div>

        {/* Course Info */}
        <div className="p-7 flex flex-col flex-1 gap-4">
            <div className="flex items-center justify-between">
                {course.category && (
                    <span className="bg-white/5 text-white/60 font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5">
                        {course.category.name}
                    </span>
                )}
                <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-black text-white">4.9</span>
                </div>
            </div>

            <h3 className="text-2xl font-black text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[3.5rem]">
                {course.localized_title || course.title}
            </h3>

            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                {course.instructor?.name && (
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                            <Users className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-bold text-neutral-400">{course.instructor.name}</span>
                    </div>
                )}
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all group-hover:text-black text-white/40">
                    <ArrowRight className={cn("h-5 w-5", isRtl && "rotate-180")} />
                </div>
            </div>
        </div>
    </Link>
);

export default function CoursesIndex({
    courses = [],
    categories = [],
}: Props) {
    const { auth, translations, locale } = usePage<SharedData & { translations: any, locale: string }>().props;
    const isAuth = !!auth.user;
    const Layout = isAuth ? AppLayout : PublicLayout;
    const isRtl = locale === 'ar';

    const [search, setSearch] = useState('');

    const filteredCourses = useMemo(() => {
        return courses.filter(course =>
            (course.localized_title || course.title)?.toLowerCase().includes(search.toLowerCase())
        );
    }, [courses, search]);

    const featuredCourse = filteredCourses[0];
    const otherCourses = filteredCourses.slice(1);

    return (
        <Layout title={translations.courses_index_page_title || "Browse Courses"}>
            <Head title={translations.courses_index_meta_title || "Course Catalog"} />

            <div className={cn("min-h-screen bg-neutral-950", !isAuth && "pt-16")} dir={isRtl ? "rtl" : "ltr"}>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-32">
                    {/* Advanced Background Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <div className="max-w-4xl mx-auto space-y-10">
                            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                <span className="text-white font-black text-sm uppercase tracking-[0.2em]">
                                    {translations.courses_index_badge || "Premium Education"}
                                </span>
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                            </div>

                            <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                {translations.courses_index_hero_title_prefix || "LEVEL UP YOUR "}
                                <span className="relative inline-block mt-2">
                                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-primary">
                                        {translations.courses_index_hero_title_highlight || "EXPERTISE"}
                                    </span>
                                    <div className="absolute -bottom-2 left-0 w-full h-4 bg-primary/20 -rotate-1 blur-lg" />
                                </span>
                            </h1>

                            <p className="text-xl lg:text-2xl text-neutral-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-700 delay-200">
                                {translations.courses_index_hero_description || "Join the ranks of elite professionals with our industry-leading mastery programs."}
                            </p>

                            {/* Enhanced Search Bar */}
                            <div className="max-w-2xl mx-auto pt-8 animate-in fade-in slide-in-from-bottom-16 duration-700 delay-300">
                                <div className="group relative">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-3xl blur opacity-25 group-focus-within:opacity-100 transition duration-500" />
                                    <div className="relative">
                                        <Search className={cn("absolute top-1/2 -translate-y-1/2 h-6 w-6 text-neutral-500 group-focus-within:text-primary transition-colors", isRtl ? "right-6" : "left-6")} />
                                        <Input
                                            className={cn("h-20 bg-neutral-900/80 backdrop-blur-xl border-white/10 rounded-[1.5rem] text-xl text-white placeholder:text-neutral-500 focus:border-primary/50 focus:ring-0 transition-all", isRtl ? "pr-16 pl-8" : "pl-16 pr-8")}
                                            placeholder={translations.courses_index_search_placeholder || "What do you want to master today?"}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Trust Stats */}
                            <div className="grid grid-cols-3 gap-8 pt-12 animate-in fade-in slide-in-from-bottom-20 duration-700 delay-500">
                                <div className="space-y-1">
                                    <div className="text-4xl lg:text-5xl font-black text-white">{courses.length}</div>
                                    <div className="text-[10px] lg:text-xs font-black text-primary uppercase tracking-[0.3em]">{translations.courses_index_stat_courses || "Programs"}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-4xl lg:text-5xl font-black text-white">2k+</div>
                                    <div className="text-[10px] lg:text-xs font-black text-primary uppercase tracking-[0.3em]">{translations.courses_index_stat_students || "Graduates"}</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-4xl lg:text-5xl font-black text-white">4.9/5</div>
                                    <div className="text-[10px] lg:text-xs font-black text-primary uppercase tracking-[0.3em]">{translations.courses_index_stat_rating || "Satisfaction"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Course Section */}
                {featuredCourse && (
                    <section className="py-16 bg-neutral-950">
                        <div className="container mx-auto px-4">
                            <FeaturedCourseCard course={featuredCourse} translations={translations} isRtl={isRtl} />
                        </div>
                    </section>
                )}

                {/* Other Courses Section */}
                {otherCourses.length > 0 && (
                    <section className="py-16 bg-neutral-900/50">
                        <div className="container mx-auto px-4">
                            <div className="mb-12">
                                <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                                    {translations.courses_index_more_courses || "More Courses"}
                                </h2>
                                <div className={cn("h-1 w-24 bg-gradient-to-r from-primary to-transparent rounded-full", isRtl && "bg-gradient-to-l")} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {otherCourses.map((course) => (
                                    <CompactCourseCard key={course.id} course={course} translations={translations} isRtl={isRtl} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* No Courses Found */}
                {filteredCourses.length === 0 && (
                    <section className="py-24">
                        <div className="container mx-auto px-4">
                            <div className="text-center space-y-6">
                                <div className="flex justify-center">
                                    <div className="bg-neutral-900 border border-white/10 rounded-full p-8">
                                        <Search className="h-16 w-16 text-neutral-600" />
                                    </div>
                                </div>
                                <h3 className="text-3xl font-bold text-white">{translations.courses_index_no_results_title || "No courses found"}</h3>
                                <p className="text-neutral-400 text-lg max-w-md mx-auto">
                                    {translations.courses_index_no_results_desc || "Try adjusting your search to find what you're looking for."}
                                </p>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="rounded-2xl border-white/10 hover:bg-white/5"
                                    onClick={() => setSearch('')}
                                >
                                    {translations.courses_index_clear_search || "Clear Search"}
                                </Button>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    );
}
