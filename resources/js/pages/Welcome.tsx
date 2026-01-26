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
    slug: string;
}

interface Course {
    id: number;
    title: string;
    slug: string;
    price: string;
    average_rating: number;
    instructor: {
        name: string;
    };
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
    return (
        <section className="relative overflow-hidden bg-neutral-950 pt-20 pb-32 lg:pt-32 lg:pb-48">
            {/* Dark Background Image with Overlay */}
            <div className="absolute inset-0 z-0 opacity-20">
                <img
                    src="/images/learning-hero-bg.png"
                    alt=""
                    className="h-full w-full object-cover grayscale"
                />
            </div>

            {/* Background Gradient/Glow Effects */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[100px]" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-[400px] w-[400px] rounded-full bg-amber-600/5 blur-[80px]" />

            <div className="container relative z-10 mx-auto px-4">
                <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
                    {/* Image Column (Left) */}
                    <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none">
                        <div className="relative z-10 aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-900/50 shadow-2xl ring-1 ring-white/10">
                            {/* Image with bottom fade for smooth blending */}
                            <img
                                src="/images/hero-section.png"
                                alt="Engineer Shaker Shams"
                                className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                            />
                            {/* Gradient Overlay "Carve" effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
                        </div>
                        {/* Decorative Border/Backdrop */}
                        <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl border-2 border-amber-500/20 bg-transparent" />
                        <div className="absolute -left-4 -top-4 -z-10 h-full w-full rounded-2xl bg-neutral-900/50 backdrop-blur-sm" />
                    </div>

                    {/* Text Column (Right) */}
                    <div className="space-y-6 text-center lg:text-left">
                        <div>
                            <h1 className="text-5xl font-extrabold tracking-tight text-white lg:text-7xl">
                                <span className="block" style={{ color: "#7f8c8d" }}>Meet</span>
                                Engineer <br />
                                Shaker Shams
                            </h1>
                        </div>

                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-neutral-400 lg:mx-0">
                            Founder of <span className="font-semibold" style={{ color: "#7f8c8d" }}>Wajihat.om</span> and <span className="font-semibold" style={{ color: "#7f8c8d" }}>Verdan.doors</span>.
                            Specializing in premium finishes, façades, and executing architectural visions with precision.
                            Transforming complex details into practical masterpieces.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                            <Link href={route('courses.index')}>
                                <Button size="lg" className="h-14 rounded-full bg-primary px-8 text-lg font-bold text-black hover:bg-light-primary">
                                    View Projects & Courses
                                </Button>
                            </Link>
                            <Link href="#contact">
                                <Button size="lg" variant="outline" className="h-14 rounded-full bg-primary border-neutral-700 px-8 font-bold hover:bg-light-primary">
                                    Contact Me
                                </Button>
                            </Link>
                        </div>

                        {/* Credentials/Stats (Optional mini-bar) */}
                        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-neutral-800 pt-8 sm:grid-cols-3 md:gap-8">
                            <div>
                                <div className="text-3xl font-bold text-white">15+</div>
                                <div className="text-xs font-medium text-neutral-500 uppercase">Years Experience</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">100+</div>
                                <div className="text-xs font-medium text-neutral-500 uppercase">Projects Done</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white">500+</div>
                                <div className="text-xs font-medium text-neutral-500 uppercase">Students</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Wave Shape Divider */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                <svg className="relative block h-[100px] w-[calc(100%+1.3px)] min-w-[1000px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-amber-500"></path>
                    <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className="fill-amber-600"></path>
                    <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-background"></path>
                </svg>
            </div>
        </section>
    );
}

const CourseExplorer = ({ categories, featuredCourses, selectedCategorySlug, setSelectedCategorySlug, featuredCategory, filteredCourses }: any) => (
    <section className="bg-muted/30 py-20" id="categories">
        <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">A broad selection of courses</h2>
                <p className="mx-auto max-w-2xl text-muted-foreground">
                    Choose from 100+ online video courses with new additions published every month.
                </p>
            </div>

            {/* Category Tabs */}
            <div className="mb-10 flex flex-wrap justify-center gap-3">
                <Button
                    variant={selectedCategorySlug === 'all' ? "default" : "outline"}
                    onClick={() => setSelectedCategorySlug('all')}
                    className="rounded-full px-6 transition-all"
                >
                    All Categories
                </Button>
                {categories.map((cat: any) => (
                    <Button
                        key={cat.slug}
                        variant={cat.slug === selectedCategorySlug ? "default" : "outline"}
                        onClick={() => setSelectedCategorySlug(cat.slug)}
                        className="rounded-full px-6 transition-all"
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>

            {/* Courses Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xxl:grid-cols-5">
                {filteredCourses.map((course: any) => (
                    <Link
                        key={course.id}
                        href={route('courses.show', { course: course.slug })}
                        className="group flex flex-col overflow-hidden rounded-xl border bg-background transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-500">
                                <BookOpen className="h-8 w-8 text-primary/40" />
                            </div>
                        </div>
                        <div className="flex flex-1 flex-col p-4">
                            <h3 className="mb-1 line-clamp-2 text-base font-bold transition-colors group-hover:text-primary">
                                {course.title}
                            </h3>
                            <p className="mb-2 text-xs text-muted-foreground">{course.instructor.name}</p>
                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                    <span className="text-sm font-bold">{course.average_rating.toFixed(1)}</span>
                                </div>
                                <div className="text-lg font-black text-primary">
                                    OMR {parseFloat(course.price).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
                {filteredCourses.length === 0 && (
                    <div className="col-span-full py-20 text-center text-muted-foreground">
                        No courses found in this category.
                    </div>
                )}
            </div>

            <div className="mt-12 text-center">
                <Link href={route('courses.index', { category: featuredCategory.slug === 'all' ? undefined : featuredCategory.slug })}>
                    <Button size="lg" className="rounded-full px-8 font-bold">
                        Browse More Courses <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    </section>
);

const StatsSection = () => (
    <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
                <StatItem icon={Users} label="Active Students" value="10k+" />
                <StatItem icon={BookOpen} label="Total Courses" value="500+" />
                <StatItem icon={Award} label="Expert Instructors" value="100+" />
                <StatItem icon={Globe} label="Countries Covered" value="25+" />
            </div>
        </div>
    </section>
);

const FeaturesSection = () => (
    <section className="bg-background py-20">
        <div className="container mx-auto px-4">
            <div className="mb-12 grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                    <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">Why Learn With Our Platform?</h2>
                    <div className="space-y-4">
                        {[
                            "Hands-on projects and interactive quizzes",
                            "Lifetime access to all enrolled courses",
                            "Certificates recognized by top companies",
                            "Learn at your own pace from any device"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                                <span className="font-medium text-muted-foreground">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <FeatureCard
                        icon={ShieldCheck}
                        title="Safe Learning"
                        description="Verified instructors and secure payment systems for your piece of mind."
                    />
                    <FeatureCard
                        icon={Award}
                        title="Value & Quality"
                        description="Premium content at affordable prices compared to traditional learning."
                    />
                </div>
            </div>
        </div>
    </section>
);

const FAQSection = () => (
    <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left font-bold">How do I start learning?</AccordionTrigger>
                    <AccordionContent>
                        Simply sign up for an account, browse our catalog, and enroll in any course that interests you. You can start watching videos immediately!
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left font-bold">Will I get a certificate?</AccordionTrigger>
                    <AccordionContent>
                        Yes! After completing all the requirements of a course, you will receive a digital certificate of completion that you can share on LinkedIn.
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left font-bold">Can I access my courses on mobile?</AccordionTrigger>
                    <AccordionContent>
                        Absolutely. Our platform is fully responsive, and you can learn on your phone, tablet, or desktop anytime, anywhere.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    </section>
);

const CTASection = () => (
    <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-4xl font-extrabold md:text-5xl">Ready to Start Learning?</h2>
            <p className="mb-10 text-xl opacity-90">Join thousands of students and transform your career today.</p>
            <div className="flex flex-wrap justify-center gap-4">
                <Link href={register()}>
                    <Button size="lg" variant="secondary" className="h-14 rounded-full px-10 text-lg font-bold">
                        Create Free Account
                    </Button>
                </Link>
                <Link href={route('courses.index')}>
                    <Button size="lg" variant="outline" className="h-14 rounded-full border-white px-10 text-lg font-bold text-white hover:bg-white hover:text-primary">
                        Browse Catalog
                    </Button>
                </Link>
            </div>
        </div>
    </section>
);

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
