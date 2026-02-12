import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Star } from 'lucide-react';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';

/* ✅ NEW PUBLIC COMPONENTS */
import AppNavbar from '@/components/public/AppNavbar';
import AppFooter from '@/components/public/AppFooter';
import PublicLayout from '@/layouts/PublicLayout';

interface Props {
    courses?: any[];
    categories?: { id: number; name: string; slug: string }[];
    canRegister?: boolean;
}

export default function CoursesIndex({
    courses = [],
    categories = [],
    canRegister = true,
}: Props) {
    const firstCategory = categories[0];

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        firstCategory?.slug ?? null
    );

    /* 🔥 CLIENT-SIDE FILTER (WELCOME-STYLE) */
    const filteredCourses = useMemo(() => {
        return courses.filter(course => {
            const matchCategory =
                !selectedCategory ||
                course.category?.slug === selectedCategory;

            const matchSearch =
                course.title
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            return matchCategory && matchSearch;
        });
    }, [courses, search, selectedCategory]);

    const activeCategory =
        categories.find(c => c.slug === selectedCategory) || null;

    return (
        <>
            <PublicLayout title="All Courses">
                <div className="min-h-screen bg-white dark:bg-gray-900">


                    {/* ================= MAIN ================= */}
                    <main className="pt-16 sm:pt-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6">

                            {/* ================= HERO ================= */}
                            <div className="relative min-h-[200px] sm:h-56 md:h-72 rounded-lg overflow-hidden shadow-xl bg-gradient-to-r from-blue-600 to-teal-500 mb-6 sm:mb-10">
                                <div className="absolute inset-0 p-4 sm:p-6 md:p-14 flex items-center">
                                    <Card className="max-w-md w-full p-4 sm:p-6 shadow-2xl">
                                        <h1 className="text-xl sm:text-2xl font-bold">
                                            Explore all courses
                                        </h1>
                                        <p className="text-sm sm:text-base text-muted-foreground mt-1">
                                            Learn new skills from top instructors
                                        </p>

                                        <div className="mt-4 flex flex-col sm:flex-row">
                                            <Input
                                                placeholder="Search courses..."
                                                value={search}
                                                onChange={e =>
                                                    setSearch(e.target.value)
                                                }
                                                className="sm:rounded-r-none sm:border-r-0 flex-1"
                                            />
                                            <Button className="sm:rounded-l-none px-4 py-2 sm:py-0 mt-2 sm:mt-0">
                                                <Search className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </Card>
                                </div>
                            </div>

                            {/* ================= CATEGORY TABS ================= */}
                            <h2 className="text-xl sm:text-2xl font-bold mb-4">
                                Browse by category
                            </h2>

                            <div className="border-b pb-2 overflow-x-auto scrollbar-hide whitespace-nowrap sticky top-14 sm:top-16 bg-white dark:bg-gray-900 z-40 -mx-4 px-4 sm:mx-0 sm:px-0">
                                {categories.map(cat => (
                                    <button
                                        key={cat.slug}
                                        onClick={() =>
                                            setSelectedCategory(cat.slug)
                                        }
                                        className={cn(
                                            'inline-block py-2.5 px-3 sm:px-4 font-medium rounded-t-md transition-colors text-sm sm:text-base shrink-0',
                                            cat.slug === selectedCategory
                                                ? 'border-b-2 border-primary text-primary'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {cat.name}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="inline-block py-2.5 px-3 sm:px-4 font-medium text-primary text-sm sm:text-base shrink-0"
                                >
                                    All Courses
                                </button>
                            </div>

                            {/* ================= COURSE GRID ================= */}
                            <div className="py-8 sm:py-12">
                                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                                    {activeCategory
                                        ? `Courses in ${activeCategory.name}`
                                        : 'All Courses'}
                                </h3>

                                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-2xl">
                                    High-quality courses curated for you.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                                    {filteredCourses.map(course => (
                                        <Link
                                            key={course.id}
                                            href={route('courses.show', {
                                                course: course.slug,
                                            })}
                                        >
                                            <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-xl">
                                                <CardContent className="p-3 sm:p-4">
                                                    <div className="h-20 sm:h-24 bg-muted rounded-md mb-2 sm:mb-3" />

                                                    <p className="font-semibold text-sm line-clamp-2">
                                                        {course.title}
                                                    </p>

                                                    <p className="text-xs text-muted-foreground">
                                                        {course.instructor?.name}
                                                    </p>

                                                    <div className="flex items-center justify-between text-xs mt-1">
                                                        <span className="flex items-center">
                                                            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500 mr-1" />
                                                            {course.average_rating?.toFixed(
                                                                1
                                                            ) ?? '0.0'}
                                                        </span>

                                                        <span className="font-bold text-primary">
                                                            {course.price > 0
                                                                ? `USD ${course.price}`
                                                                : 'Free'}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}

                                    {filteredCourses.length === 0 && (
                                        <p className="col-span-full text-muted-foreground">
                                            No courses found.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>

                </div>
            </PublicLayout>


        </>
    );
}
