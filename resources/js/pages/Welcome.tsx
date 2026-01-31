// resources/js/pages/Welcome.tsx
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    GraduationCap,
    Search,
    ArrowRight,
    Star,
    CheckCircle2,
    Users,
    BookOpen,
    Award,
    ShieldCheck,
    Globe,
    Zap,
    Building2,
    Briefcase,
    Ruler
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { useState } from 'react';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';
import PublicLayout from '@/layouts/PublicLayout';

interface Category {
    id: number;
    name: string;
    localized_name?: string;
    slug: string;
}

interface Course {
    id: number;
    title: string;
    localized_title?: string;
    slug: string;
    price: string;
    average_rating: number;
    instructor: {
        name: string;
    };
    thumbnail?: string;
    thumbnail_url?: string;
}

interface WelcomeProps {
    canRegister?: boolean;
    categories: Category[];
    featuredCourses: Record<number, Course[]>;
}

// --- Sub-Components ---

const StatItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="group flex flex-col items-center rounded-2xl border border-border/50 bg-background p-8 text-center shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
        <div className="mb-4 rounded-2xl bg-primary/10 p-4 text-primary transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-8 w-8" />
        </div>
        <div className="text-4xl font-extrabold tracking-tight text-foreground">{value}</div>
        <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
);

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <Card className="border-none bg-background/50 shadow-none transition-all hover:bg-accent/50">
        <CardContent className="p-6">
            <Icon className="mb-4 h-8 w-8 text-primary" />
            <h3 className="mb-2 text-xl font-bold">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
    </Card>
);



// --- Main Page Sections ---

function HeroSection({ categories, featuredCourses }: WelcomeProps) {
    const { translations, locale } = (usePage().props as unknown) as SharedData & { translations: any, locale: string };
    const isRtl = locale === 'ar';

    return (
        <section className="relative overflow-hidden bg-neutral-950 pt-20 pb-32 lg:pt-28 lg:pb-48" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Background Texture & Gradients */}
            <div className="absolute inset-0 z-0 opacity-30">
                <img
                    src="/images/learning-hero-bg.png"
                    alt=""
                    className="h-full w-full object-cover grayscale mix-blend-overlay"
                />
            </div>
            <div className={`absolute top-[-10%] ${isRtl ? 'left-[-10%]' : 'right-[-10%]'} h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[120px] animate-pulse`} />
            <div className={`absolute bottom-[-10%] ${isRtl ? 'right-[-10%]' : 'left-[-10%]'} h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[100px]`} />

            <div className="container relative z-10 mx-auto px-4">
                <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
                    {/* Image Column (Visuals First on Mobile, but Logical Second in RTL if we want text first? No, normally heroes keep image on one side) */}
                    {/* Let's keep the image layout consistent but mirror the text alignment */}
                    <div className={`relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-md ${isRtl ? 'lg:order-last' : ''}`}>
                        {/* Main Image Container with Curve */}
                        <div className="relative z-10 overflow-hidden rounded-t-[3rem] rounded-b-[15%] bg-gradient-to-b from-neutral-800 to-neutral-900 shadow-2xl ring-1 ring-white/10 transition-transform duration-700 hover:scale-[1.02]">
                            <div className="aspect-[3/4] relative">
                                <img
                                    src="/images/hero-section.png"
                                    alt="Engineer Shaker Shams"
                                    className="h-full w-full object-cover object-top"
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-transparent to-transparent opacity-80" />

                                {/* Floating Badge */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md shadow-xl w-max">
                                    <CheckCircle2 className="h-5 w-5 text-amber-500 fill-amber-500/20" />
                                    <span className="text-sm font-bold text-white tracking-wide">{translations.verified_expert || "Verified Expert"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Back decorative elements */}
                        <div className={`absolute top-10 ${isRtl ? '-left-8' : '-right-8'} -z-10 h-3/4 w-3/4 animate-in fade-in zoom-in duration-1000 delay-300`}>
                            <div className="h-full w-full rounded-[3rem] border-2 border-dashed border-amber-500/20 opacity-60" />
                        </div>
                        <div className={`absolute -bottom-8 ${isRtl ? '-right-8' : '-left-8'} -z-10 h-1/2 w-1/2 rounded-full bg-gradient-to-tr from-amber-500/20 to-transparent blur-3xl`} />
                    </div>

                    {/* Text Column */}
                    <div className={`space-y-8 text-center ${isRtl ? 'lg:text-right' : 'lg:text-left'}`}>
                        <div className="space-y-2">
                            <Badge variant="outline" className="border-amber-500/30 text-amber-400 bg-amber-500/5 px-4 py-1 text-sm font-bold uppercase tracking-widest mb-4">
                                {translations.hero_badge || "Premium Architecture Learning"}
                            </Badge>
                            <h1 className="text-5xl font-black tracking-tight text-white lg:text-7xl leading-[1.1]">
                                {translations.hero_title_prefix && (
                                    <span className="block text-neutral-400 text-3xl lg:text-5xl font-extrabold mb-2 tracking-normal"></span>
                                )}
                                <span className=" bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600" style={{ color: '#95a5a6' }}>
                                    {translations.hero_name || "Eng. Shaker Shams"}
                                </span>
                            </h1>
                        </div>

                        <div className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-400 lg:mx-0 font-medium space-y-4">
                            <p dangerouslySetInnerHTML={{ __html: translations.hero_bio_1 }} />
                            {translations.hero_bio_2 && <p>{translations.hero_bio_2}</p>}
                            {translations.hero_bio_3 && <p>{translations.hero_bio_3}</p>}
                        </div>

                        <div className={`flex flex-col gap-4 sm:flex-row sm:justify-center ${isRtl ? 'lg:justify-start' : 'lg:justify-start'} pt-4`}>
                            <Link href={route('courses.index')}>
                                <Button size="lg" className="h-16 rounded-2xl bg-gradient-to-r from-primary to-amber-600 px-10 text-lg font-bold text-black hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all hover:scale-105">
                                    {translations.cta_start_learning || "Start Learning Now"}
                                    <ArrowRight className={`mx-2 h-5 w-5 ${isRtl ? 'rotate-180' : ''}`} />
                                </Button>
                            </Link>
                            <Link href={route('portfolio')}>
                                <Button size="lg" variant="outline" className="h-16 rounded-2xl border-neutral-700 bg-transparent px-10 text-lg font-bold text-white hover:bg-white/5 transition-all">
                                    {translations.cta_view_portfolio || "View Portfolio"}
                                </Button>
                            </Link>
                        </div>

                        {/* Stats mini-bar */}
                        <div className={`flex flex-wrap items-center justify-center ${isRtl ? 'lg:justify-start' : 'lg:justify-start'} gap-8 border-t border-neutral-800 pt-8 opacity-80`}>
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-amber-500" />
                                <div className="text-sm font-medium text-neutral-300"><span className="font-bold text-white">500+</span> {translations.students_count || "Students"}</div>
                            </div>
                            <div className="h-4 w-px bg-neutral-800" />
                            <div className="flex items-center gap-3">
                                <Briefcase className="h-5 w-5 text-amber-500" />
                                <div className="text-sm font-medium text-neutral-300"><span className="font-bold text-white">100+</span> {translations.projects_count || "Projects"}</div>
                            </div>
                            <div className="h-4 w-px bg-neutral-800" />
                            <div className="flex items-center gap-3">
                                <Building2 className="h-5 w-5 text-amber-500" />
                                <div className="text-sm font-medium text-neutral-300"><span className="font-bold text-white">13+</span> {translations.years_experience || "Years"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave Shape Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
                <svg className="relative block h-[120px] w-full min-w-[1000px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M985.66,92.83C906.67,72,823.78,31,432.84,26.42V0h767.16v120C1153.29,86.28,1065.34,113.84,985.66,92.83Z" className="fill-background opacity-[0.03]"></path>
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V46.29C57.54,26.58,113.41,13.63,166.39,13.63,219.05,13.63,270,29.93,321.39,56.44Z" className="fill-background"></path>
                </svg>
            </div>
        </section>
    );
}

const CourseExplorer = ({ categories, featuredCourses, selectedCategorySlug, setSelectedCategorySlug, featuredCategory, filteredCourses }: any) => {
    const { translations } = (usePage().props as unknown) as SharedData & { translations: any };

    return (
        <section className="bg-muted/30 py-24 relative overflow-hidden" id="categories">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-16 text-center max-w-3xl mx-auto">
                    <Badge variant="outline" className="mb-6 border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-bold uppercase tracking-widest text-primary shadow-sm backdrop-blur-sm">
                        {translations.explorer_badge || "Start Your Journey"}
                    </Badge>
                    <h2 className="mb-6 text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl">
                        {translations.explorer_title_prefix || "Explore Our"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600">{translations.explorer_title_suffix || "Courses"}</span>
                    </h2>
                    <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                        {translations.explorer_description || "Discover world-class content designed to help you master new skills, build your portfolio, and advance your career."}
                    </p>
                </div>

                {/* Category Tabs */}
                <div className="mb-14 flex flex-wrap justify-center gap-3">
                    <Button
                        variant={selectedCategorySlug === 'all' ? "default" : "ghost"}
                        onClick={() => setSelectedCategorySlug('all')}
                        className={`h-11 rounded-full px-8 text-sm font-bold tracking-wide transition-all duration-300 ${selectedCategorySlug === 'all'
                            ? 'shadow-lg shadow-primary/25 ring-2 ring-primary/20'
                            : 'bg-background hover:bg-muted border border-transparent hover:border-border/50'
                            }`}
                    >
                        {translations.explorer_all_categories || "All Categories"}
                    </Button>
                    {categories.map((cat: any) => (
                        <Button
                            key={cat.slug}
                            variant={cat.slug === selectedCategorySlug ? "default" : "ghost"}
                            onClick={() => setSelectedCategorySlug(cat.slug)}
                            className={`h-11 rounded-full px-8 text-sm font-bold tracking-wide transition-all duration-300 ${cat.slug === selectedCategorySlug
                                ? 'shadow-lg shadow-primary/25 ring-2 ring-primary/20'
                                : 'bg-background hover:bg-muted border border-transparent hover:border-border/50'
                                }`}
                        >
                            {cat.localized_name || cat.name}
                        </Button>
                    ))}
                </div>

                {/* Courses Grid */}
                <div className={filteredCourses.length < 4
                    ? "flex flex-wrap justify-center gap-8"
                    : "grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                }>
                    {filteredCourses.map((course: any) => (
                        <Link
                            key={course.id}
                            href={route('courses.show', { course: course.slug })}
                            className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-background transition-all duration-500 hover:-translate-y-2 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 ${filteredCourses.length < 4 ? 'w-full max-w-[20rem]' : ''}`}
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
                                {/* Visual Placeholder or Image */}
                                <div className="flex h-full w-full items-center justify-center transition-transform duration-700 group-hover:scale-110">
                                    {(course.thumbnail_url || course.thumbnail) ? (
                                        <img
                                            src={course.thumbnail_url || course.thumbnail}
                                            alt={course.localized_title || course.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <BookOpen className="h-16 w-16 text-primary/10 group-hover:text-primary/30 transition-colors duration-500" />
                                    )}
                                </div>

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

                                {/* Play Button */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-100 transform scale-75">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl shadow-primary/30 backdrop-blur-sm">
                                        <Zap className="h-7 w-7 fill-current" />
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col p-6 pt-5">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 overflow-hidden rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                                            <span className="text-xs font-black text-primary">{course.instructor.name.charAt(0)}</span>
                                        </div>
                                        <span className="text-xs font-bold text-muted-foreground">{course.instructor.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 border border-amber-500/20">
                                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                        <span className="text-xs font-bold text-amber-600">{course.average_rating.toFixed(1)}</span>
                                    </div>
                                </div>

                                <h3 className="mb-3 line-clamp-2 text-xl font-bold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                                    {course.localized_title || course.title}
                                </h3>

                                <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">{translations.course_price_label || "Price"}</span>
                                        <span className="text-lg font-black text-primary">
                                            {Number(course.price) === 0 ? (translations.course_price_free || 'Free') : `${translations.course_price_currency || 'OMR'} ${parseFloat(course.price).toFixed(2)}`}
                                        </span>
                                    </div>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/5 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:rotate-[-45deg]">
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                            <Search className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">{translations.explorer_no_courses || "No courses found"}</h3>
                        <p className="text-muted-foreground mt-2">{translations.explorer_no_courses_desc || "Try selecting a different category."}</p>
                    </div>
                )}

                {/* <div className="mt-20 text-center">
                    <Link href={route('courses.index', { category: featuredCategory.slug === 'all' ? undefined : featuredCategory.slug })}>
                        <Button size="lg" className="h-14 rounded-full px-10 text-base font-bold shadow-xl shadow-primary/20 hover:scale-105 hover:shadow-primary/30 transition-all">
                            {translations.explorer_browse_all || "Browse All Courses"} <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div> */}
            </div>
        </section>
    )
};

const StatsSection = () => {
    const { translations } = (usePage().props as unknown) as SharedData & { translations: any };
    return (
        <section className="bg-muted/30 py-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
                    <StatItem icon={Building2} label={translations.stats_years_experience || "Years Experience"} value="13+" />
                    <StatItem icon={CheckCircle2} label={translations.stats_projects_executed || "Projects Executed"} value="100+" />
                    <StatItem icon={Users} label={translations.stats_happy_students || "Happy Students"} value="500+" />
                    <StatItem icon={BookOpen} label={translations.stats_specialized_courses || "Specialized Courses"} value="2" />
                </div>
            </div>
        </section>
    );
};

const FeaturesSection = () => {
    const { translations, locale } = (usePage().props as unknown) as SharedData & { translations: any, locale: string };
    const isRtl = locale === 'ar';

    const features = [
        {
            title: translations.feature_safe_title || "Safe Learning",
            desc: translations.feature_safe_desc || "Verified instructors and secure payment systems for your piece of mind.",
            icon: ShieldCheck,
            color: "bg-blue-500"
        },
        {
            title: translations.feature_value_title || "Value & Quality",
            desc: translations.feature_value_desc || "Premium content at affordable prices compared to traditional learning.",
            icon: Award,
            color: "bg-amber-500"
        },
        {
            title: translations.feature_anywhere_title || "Learn Anywhere",
            desc: translations.feature_anywhere_desc || "Access your courses on any device, anytime, with lifetime access.",
            icon: Zap,
            color: "bg-purple-500"
        }
    ];

    return (
        <section className="relative bg-background py-32 overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 blur-[100px] rounded-full" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20 items-center">


                    <div className="flex-1 grid gap-8 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 w-full">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "group p-10 rounded-[3rem] border border-border/50 bg-background/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20",
                                    i === 2 ? "sm:col-span-2 xl:col-span-1" : ""
                                )}
                            >
                                <div className={cn("mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3", feature.color)}>
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="mb-4 text-2xl font-black tracking-tight">{feature.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}

                        {/* Decorative dynamic card */}
                        <div className="hidden xl:flex items-center justify-center p-10 rounded-[3rem] bg-gradient-to-br from-primary via-amber-500 to-amber-600 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('/images/learning-hero-bg.png')] opacity-10 mix-blend-overlay" />
                            <div className="relative z-10 text-center space-y-4">
                                <div className="text-4xl font-black">{isRtl ? '١٠٠٪' : '100%'}</div>
                                <div className="text-sm font-bold uppercase tracking-widest opacity-80">
                                    {translations.practical_learning || "Practical Learning"}
                                </div>
                                <Link href={route('courses.index')}>
                                    <Button variant="secondary" className="mt-4 rounded-2xl font-black">
                                        {translations.features_cta || "Start Journey"}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FAQSection = () => {
    const { translations } = (usePage().props as unknown) as SharedData & { translations: any };

    return (
        <section className="bg-muted/30 py-20">
            <div className="container mx-auto px-4 max-w-3xl">
                <h2 className="mb-8 text-center text-3xl font-bold">{translations.faq_title || "Frequently Asked Questions"}</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-left font-bold">{translations.faq_q1 || "How do I start learning?"}</AccordionTrigger>
                        <AccordionContent>
                            {translations.faq_a1 || "Simply sign up for an account, browse our catalog, and enroll in any course that interests you. You can start watching videos immediately!"}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-left font-bold">{translations.faq_q2 || "Will I get a certificate?"}</AccordionTrigger>
                        <AccordionContent>
                            {translations.faq_a2 || "Yes! After completing all the requirements of a course, you will receive a digital certificate of completion that you can share on LinkedIn."}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-left font-bold">{translations.faq_q3 || "Can I access my courses on mobile?"}</AccordionTrigger>
                        <AccordionContent>
                            {translations.faq_a3 || "Absolutely. Our platform is fully responsive, and you can learn on your phone, tablet, or desktop anytime, anywhere."}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    )
};

const CTASection = () => {
    const { translations } = (usePage().props as unknown) as SharedData & { translations: any };

    return (
        <section className="relative overflow-hidden bg-muted/30 py-24">
            {/* Background Decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 text-center">
                <h2 className="mb-6 text-4xl font-black md:text-5xl lg:text-6xl tracking-tight text-foreground">
                    {translations.cta_title || "Ready to Start Learning?"}
                </h2>
                <p className="mb-10 text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
                    {translations.cta_desc || "Join thousands of students and transform your career today."}
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link href={register()}>
                        <Button size="lg" className="h-16 rounded-2xl bg-gradient-to-r from-primary to-amber-600 px-10 text-lg font-bold text-black shadow-lg shadow-amber-500/20 hover:scale-105 transition-all">
                            {translations.cta_create_account || "Create Free Account"}
                        </Button>
                    </Link>
                    <Link href={route('courses.index')}>
                        <Button size="lg" variant="outline" className="h-16 rounded-2xl px-10 text-lg font-bold border-border hover:bg-accent transition-all">
                            {translations.cta_browse_catalog || "Browse Catalog"}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
};

// --- Main Component ---

export default function Welcome(props: WelcomeProps) {
    const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');

    const featuredCategory =
        selectedCategorySlug === 'all'
            ? { id: 0, name: 'All Courses', slug: 'all' }
            : props.categories.find(cat => cat.slug === selectedCategorySlug) || { id: 0, name: 'All Courses', slug: 'all' };

    const filteredCourses =
        selectedCategorySlug === 'all'
            ? Object.values(props.featuredCourses).flat().slice(0, 8)
            : props.featuredCourses[featuredCategory.id] ?? [];

    return (
        <PublicLayout title="Learn Anything Online">
            <HeroSection {...props} />
            <StatsSection />
            <CourseExplorer
                {...props}
                selectedCategorySlug={selectedCategorySlug}
                setSelectedCategorySlug={setSelectedCategorySlug}
                featuredCategory={featuredCategory}
                filteredCourses={filteredCourses}
            />
            <FeaturesSection />
            <FAQSection />
            <CTASection />
        </PublicLayout>
    );
}
