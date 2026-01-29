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
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border border-white/10 shadow-2xl">
        {/* Background Glow Effects */}
        <div className={cn("absolute top-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] opacity-50 group-hover:opacity-70 transition-opacity duration-700", isRtl ? "left-0" : "right-0")} />
        <div className={cn("absolute bottom-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] opacity-30 group-hover:opacity-50 transition-opacity duration-700", isRtl ? "right-0" : "left-0")} />

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
            {/* Course Image/Visual */}
            <div className={cn("flex items-center justify-center", isRtl ? "lg:order-2" : "lg:order-1")}>
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-3xl blur-2xl" />
                    <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-blue-500/20 border border-white/10 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
                        {(course.thumbnail_url || course.thumbnail) ? (
                            <img
                                src={course.thumbnail_url || course.thumbnail}
                                alt={course.localized_title || course.title}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <BookOpen className="h-24 w-24 text-primary/60 relative z-10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        {/* Play Button Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-6 transform group-hover:scale-110 transition-transform">
                                <PlayCircle className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Floating Badge */}
                    {parseFloat(course.price.toString()) === 0 && (
                        <div className={cn("absolute -top-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg transform group-hover:rotate-6 transition-transform", isRtl ? "-left-4 -rotate-3" : "-right-4 rotate-3")}>
                            <span className="font-black text-lg uppercase tracking-wider">{translations.course_price_free || "Free Course"}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Course Details */}
            <div className={cn("flex flex-col justify-center space-y-6", isRtl ? "lg:order-1" : "lg:order-2")}>
                {/* Badge */}
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                        <span className="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            {translations.courses_index_featured_badge || "Featured Course"}
                        </span>
                    </div>
                    {course.category && (
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                            <span className="text-white/70 font-medium text-sm">{course.category.name}</span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4 group-hover:text-primary transition-colors">
                        {course.localized_title || course.title}
                    </h2>
                    {course.instructor?.name && (
                        <p className="text-lg text-neutral-400 flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            {translations.courses_index_by || "by"} <span className="text-white font-semibold">{course.instructor.name}</span>
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-yellow-500/10 p-2 rounded-lg">
                            <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">
                                {course.average_rating ? course.average_rating.toFixed(1) : '5.0'}
                            </div>
                            <div className="text-xs text-neutral-500">{translations.courses_index_rating_label || "Rating"}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500/10 p-2 rounded-lg">
                            <Users className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">500+</div>
                            <div className="text-xs text-neutral-500">{translations.courses_index_students_label || "Students"}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="bg-purple-500/10 p-2 rounded-lg">
                            <Clock className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">12h</div>
                            <div className="text-xs text-neutral-500">{translations.courses_index_duration_label || "Duration"}</div>
                        </div>
                    </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center gap-4 pt-4">
                    <div className="flex-1">
                        <div className="text-sm text-neutral-500 mb-1">{translations.courses_index_price_label || "Course Price"}</div>
                        <div className="text-4xl font-black text-primary">
                            {parseFloat(course.price.toString()) > 0
                                ? `${parseFloat(course.price.toString()).toFixed(2)} ${translations.course_price_currency || 'OMR'}`
                                : (translations.course_price_free || 'FREE')}
                        </div>
                    </div>
                    <Link href={route('courses.show', { course: course.slug })} className="flex-1">
                        <Button
                            size="lg"
                            className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-black font-black text-lg shadow-lg shadow-primary/20 group/btn"
                        >
                            {translations.courses_index_enroll_now || "Enroll Now"}
                            <ArrowRight className={cn("ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform", isRtl && "rotate-180 group-hover/btn:-translate-x-1")} />
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
        className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-white/10 hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
    >
        {/* Course Visual */}
        <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-primary/10 to-blue-500/10 relative">
            <div className="flex h-full w-full items-center justify-center group-hover:scale-110 transition-transform duration-500">
                {(course.thumbnail_url || course.thumbnail) ? (
                    <img
                        src={course.thumbnail_url || course.thumbnail}
                        alt={course.localized_title || course.title}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <BookOpen className="h-16 w-16 text-primary/40" />
                )}
            </div>

            {parseFloat(course.price.toString()) === 0 && (
                <div className={cn("absolute top-3", isRtl ? "right-3" : "left-3")}>
                    <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        {translations.course_price_free || "Free"}
                    </span>
                </div>
            )}

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                    <PlayCircle className="h-8 w-8 text-primary" />
                </div>
            </div>
        </div>

        {/* Course Info */}
        <div className="p-6 space-y-4">
            {course.category && (
                <div className="inline-block bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                    <span className="text-primary font-semibold text-xs uppercase tracking-wider">
                        {course.category.name}
                    </span>
                </div>
            )}

            <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                {course.localized_title || course.title}
            </h3>

            {course.instructor?.name && (
                <p className="text-sm text-neutral-400">
                    {translations.courses_index_by || "by"} <span className="text-white font-medium">{course.instructor.name}</span>
                </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-bold text-white">
                        {course.average_rating ? course.average_rating.toFixed(1) : '5.0'}
                    </span>
                    <span className="text-xs text-neutral-500">(250)</span>
                </div>
                <div className="text-xl font-black text-primary">
                    {parseFloat(course.price.toString()) > 0
                        ? `${parseFloat(course.price.toString()).toFixed(2)} ${translations.course_price_currency || 'OMR'}`
                        : (translations.course_price_free || 'FREE')}
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
                <section className="relative overflow-hidden bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 py-16 lg:py-24">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-12 space-y-6">
                            <div className="inline-block bg-primary/10 border border-primary/20 px-6 py-3 rounded-full mb-4">
                                <span className="text-primary font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    {translations.courses_index_badge || "Professional Courses"}
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                                {translations.courses_index_hero_title_prefix || "Master Your "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-primary">
                                    {translations.courses_index_hero_title_highlight || "Craft"}
                                </span>
                            </h1>

                            <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                                {translations.courses_index_hero_description || "Discover premium courses designed by industry experts to help you excel in your field"}
                            </p>

                            {/* Search Bar */}
                            <div className="max-w-2xl mx-auto pt-4">
                                <div className="relative">
                                    <Search className={cn("absolute top-1/2 -translate-y-1/2 h-6 w-6 text-neutral-500", isRtl ? "right-6" : "left-6")} />
                                    <Input
                                        className={cn("h-16 pr-6 rounded-2xl bg-neutral-900 border-white/10 text-lg text-white placeholder:text-neutral-500 focus:border-primary/50 focus:ring-primary/20", isRtl ? "pr-16 pl-6" : "pl-16 pr-6")}
                                        placeholder={translations.courses_index_search_placeholder || "Search for courses..."}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap justify-center gap-8 pt-8">
                                <div className="text-center">
                                    <div className="text-4xl font-black text-white mb-1">{courses.length}</div>
                                    <div className="text-sm text-neutral-500 uppercase tracking-wider">{translations.courses_index_stat_courses || "Courses"}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-black text-white mb-1">1,000+</div>
                                    <div className="text-sm text-neutral-500 uppercase tracking-wider">{translations.courses_index_stat_students || "Students"}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-black text-white mb-1">4.9</div>
                                    <div className="text-sm text-neutral-500 uppercase tracking-wider">{translations.courses_index_stat_rating || "Avg Rating"}</div>
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
