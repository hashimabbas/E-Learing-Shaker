// resources/js/pages/Courses/AuthenticatedIndex.tsx (For Logged-In User)
import { Head, Link, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Star } from 'lucide-react';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';

// --- Authenticated Layout Import ---
import AppLayout from '@/layouts/app-layout';
// -----------------------------------

interface Props {
    courses?: any[];
    categories?: { id: number; name: string; slug: string }[];
    canRegister?: boolean;
}

export default function AuthenticatedCoursesIndex({
    courses = [],
    categories = [],
    canRegister = true,
}: Props) {
    const firstCategory = categories[0];

    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        firstCategory?.slug ?? null
    );

    /* CLIENT-SIDE FILTER */
    const filteredCourses = useMemo(() => {
        // ... (Existing filtering logic remains correct) ...
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
        // FIX: Wrap in AppLayout for authenticated sidebar/header
        <AppLayout title="All Courses">
            <div className="min-h-screen bg-white dark:bg-gray-900">


                {/* ================= MAIN ================= */}
                <main className="pt-4"> {/* Removed pt-20 as AppLayout provides top padding */}
                    <div className="max-w-7xl mx-auto px-4">

                        {/* ================= SEARCH/FILTER BAR ================= */}
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-3xl font-bold">Course Catalog</h1>

                            {/* Simplified Search Input - Place where needed */}
                            <div className="flex w-1/3">
                                <Input
                                    placeholder="Search courses..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="rounded-r-none border-r-0"
                                />
                                <Button className="rounded-l-none px-4">
                                    <Search className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* ================= CATEGORY TABS ================= */}
                        <h2 className="text-2xl font-bold mb-4">
                            Browse by category
                        </h2>

                        <div className="border-b pb-2 overflow-x-auto whitespace-nowrap sticky top-16 bg-white dark:bg-gray-900 z-40">
                            {categories.map(cat => (
                                <button
                                    key={cat.slug}
                                    onClick={() => setSelectedCategory(cat.slug)}
                                    className={cn(
                                        'inline-block py-2 px-4 font-medium rounded-t-md transition-colors',
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
                                className="inline-block py-2 px-4 font-medium text-primary"
                            >
                                All Courses
                            </button>
                        </div>

                        {/* ================= COURSE GRID ================= */}
                        <div className="py-12">
                            <h3 className="text-2xl font-bold mb-2">
                                {activeCategory
                                    ? `Courses in ${activeCategory.name}`
                                    : 'All Courses'}
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {filteredCourses.map(course => (
                                    <Link
                                        key={course.id}
                                        href={route('courses.show', {
                                            course: course.slug,
                                        })}
                                    >
                                        <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-xl">
                                            {/* ... Card Content (Existing logic for displaying course details) ... */}
                                            <CardContent className="p-3">
                                                <div className="h-24 bg-muted rounded-md mb-3" />
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
        </AppLayout>
    );
}
