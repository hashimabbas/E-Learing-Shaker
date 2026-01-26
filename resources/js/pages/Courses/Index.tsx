// resources/js/pages/Courses/Index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Search,
    Star,
    Filter,
    ChevronDown,
    BookOpen,
    SlidersHorizontal,
    X
} from 'lucide-react';
import { route } from 'ziggy-js';
import { cn } from '@/lib/utils';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
    slug: string;
    price: number | string;
    average_rating: number;
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

const CourseCard = ({ course }: { course: Course }) => (
    <Link
        href={route('courses.show', { course: course.slug })}
        className="group flex flex-col overflow-hidden rounded-xl border bg-background transition-all hover:-translate-y-1 hover:shadow-xl"
    >
        <div className="aspect-video w-full overflow-hidden bg-muted relative">
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-blue-500/10 group-hover:scale-110 transition-transform duration-500">
                <BookOpen className="h-10 w-10 text-primary/40" />
            </div>
            {parseFloat(course.price.toString()) === 0 && (
                <div className="absolute top-2 left-2">
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        Free
                    </span>
                </div>
            )}
        </div>
        <div className="flex flex-1 flex-col p-4">
            <h3 className="mb-1 line-clamp-2 text-sm font-bold group-hover:text-primary transition-colors">
                {course.title}
            </h3>
            <p className="mb-2 text-xs text-muted-foreground">{course.instructor?.name}</p>
            <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-bold">{course.average_rating ? course.average_rating.toFixed(1) : '0.0'}</span>
                </div>
                <div className="text-base font-black text-primary">
                    {parseFloat(course.price.toString()) > 0 ? `OMR ${parseFloat(course.price.toString()).toFixed(2)}` : 'FREE'}
                </div>
            </div>
        </div>
    </Link>
);

const FilterSection = ({
    categories,
    selectedCategories,
    setSelectedCategories
}: {
    categories: Category[],
    selectedCategories: string[],
    setSelectedCategories: (slugs: string[]) => void
}) => {
    const handleCategoryChange = (slug: string) => {
        if (selectedCategories.includes(slug)) {
            setSelectedCategories(selectedCategories.filter(s => s !== slug));
        } else {
            setSelectedCategories([...selectedCategories, slug]);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Categories</h3>
                <div className="space-y-3">
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`cat-${cat.id}`}
                                checked={selectedCategories.includes(cat.slug)}
                                onCheckedChange={() => handleCategoryChange(cat.slug)}
                            />
                            <Label
                                htmlFor={`cat-${cat.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                {cat.name}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
            <Separator />
            <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Price</h3>
                <div className="space-y-3">
                    {["All", "Free", "Paid"].map((option) => (
                        <div key={option} className="flex items-center space-x-2">
                            <Checkbox id={`price-${option}`} />
                            <Label htmlFor={`price-${option}`} className="text-sm font-medium cursor-pointer">{option}</Label>
                        </div>
                    ))}
                </div>
            </div>
            <Separator />
            <div>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">Rating</h3>
                <div className="space-y-3">
                    {[4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center space-x-2">
                            <Checkbox id={`rating-${rating}`} />
                            <Label htmlFor={`rating-${rating}`} className="text-sm font-medium flex items-center cursor-pointer">
                                {rating}+ <Star className="ml-1 h-3 w-3 fill-yellow-500 text-yellow-500" />
                            </Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default function CoursesIndex({
    courses = [],
    categories = [],
}: Props) {
    const { auth } = usePage<any>().props;
    const isAuth = !!auth.user;
    const Layout = isAuth ? AppLayout : PublicLayout;

    const [search, setSearch] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('popular');

    const filteredCourses = useMemo(() => {
        let result = courses.filter(course => {
            const matchCategory =
                selectedCategories.length === 0 ||
                (course.category && selectedCategories.includes(course.category.slug));

            const matchSearch =
                course.title?.toLowerCase().includes(search.toLowerCase());

            return matchCategory && matchSearch;
        });

        // Simple sorting logic
        if (sortBy === 'price-low') {
            result.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()));
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => parseFloat(b.price.toString()) - parseFloat(a.price.toString()));
        } else if (sortBy === 'newest') {
            result.sort((a, b) => b.id - a.id);
        }

        return result;
    }, [courses, search, selectedCategories, sortBy]);

    return (
        <Layout title="Browse Courses">
            <div className={cn("min-h-screen bg-background", !isAuth && "pt-16")}>
                {/* Hero Section */}
                <div className="bg-primary/5 py-12 lg:py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Course Catalog</h1>
                                <p className="mt-2 text-lg text-muted-foreground">
                                    Discover over {courses.length}+ professional courses.
                                </p>
                            </div>
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    className="pl-10 h-12 shadow-sm focus:ring-primary"
                                    placeholder="Search for anything..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col gap-8 lg:flex-row">
                        {/* Desktop Sidebar */}
                        <aside className="hidden w-64 shrink-0 lg:block">
                            <div className="sticky top-24">
                                <FilterSection
                                    categories={categories}
                                    selectedCategories={selectedCategories}
                                    setSelectedCategories={setSelectedCategories}
                                />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Toolbar */}
                            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b pb-6">
                                <div className="flex items-center gap-4">
                                    {/* Mobile Filter Trigger */}
                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="outline" className="lg:hidden">
                                                <Filter className="mr-2 h-4 w-4" /> Filters
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-[300px]">
                                            <SheetHeader>
                                                <SheetTitle>Filter Courses</SheetTitle>
                                            </SheetHeader>
                                            <div className="py-6">
                                                <FilterSection
                                                    categories={categories}
                                                    selectedCategories={selectedCategories}
                                                    setSelectedCategories={setSelectedCategories}
                                                />
                                            </div>
                                        </SheetContent>
                                    </Sheet>

                                    <p className="text-sm font-medium text-muted-foreground">
                                        Showing <span className="text-foreground">{filteredCourses.length}</span> results
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="hidden text-sm font-medium text-muted-foreground sm:inline-block">Sort by:</span>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="popular">Most Popular</SelectItem>
                                            <SelectItem value="newest">Newest</SelectItem>
                                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Applied Filters Tags */}
                            {selectedCategories.length > 0 && (
                                <div className="mb-6 flex flex-wrap gap-2">
                                    {selectedCategories.map(slug => {
                                        const cat = categories.find(c => c.slug === slug);
                                        return (
                                            <Button
                                                key={slug}
                                                variant="secondary"
                                                size="sm"
                                                className="h-7 rounded-full px-3 text-xs"
                                                onClick={() => setSelectedCategories(selectedCategories.filter(s => s !== slug))}
                                            >
                                                {cat?.name} <X className="ml-1 h-3 w-3" />
                                            </Button>
                                        );
                                    })}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 text-xs text-muted-foreground"
                                        onClick={() => setSelectedCategories([])}
                                    >
                                        Clear all
                                    </Button>
                                </div>
                            )}

                            {/* Course Grid */}
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
                                {filteredCourses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}

                                {filteredCourses.length === 0 && (
                                    <div className="col-span-full py-24 text-center">
                                        <div className="mb-4 flex justify-center">
                                            <div className="rounded-full bg-muted p-6">
                                                <Search className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold italic">No courses found</h3>
                                        <p className="mt-2 text-muted-foreground">
                                            Try adjusting your search or filters to find what you're looking for.
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="mt-6"
                                            onClick={() => {
                                                setSearch('');
                                                setSelectedCategories([]);
                                            }}
                                        >
                                            Reset all filters
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
