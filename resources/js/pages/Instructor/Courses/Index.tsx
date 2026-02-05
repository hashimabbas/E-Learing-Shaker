// resources/js/pages/Instructor/Courses/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PaginatedData } from '@/types';
import {
    Edit,
    Eye,
    PlusCircle,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    ChevronDown,
    Calendar,
    Users,
    BadgeDollarSign,
    BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { route } from 'ziggy-js';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InstructorCoursesIndexProps {
    courses: PaginatedData<any>;
}

export default function InstructorCoursesIndex({ courses }: InstructorCoursesIndexProps) {
    const totalCourses = courses.meta?.total ?? courses.data.length;

    const handlePublishToggle = (courseId: number) => {
        router.post(route('admin.courses.publish', courseId), {}, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout title="Manage Courses">
            <Head title="My Courses" />

            <div className="bg-background min-h-screen pb-20">
                {/* Dashboard-style Header */}
                <div className="border-b bg-muted/30 py-10">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl flex items-center gap-3">
                                    <BookOpen className="h-8 w-8 text-primary" /> My Course Catalog
                                </h1>
                                <p className="text-muted-foreground font-medium text-lg">
                                    You have created <span className="text-foreground font-bold">{totalCourses}</span> courses in total.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <Link href={route('instructor.courses.create')}>
                                    <Button className="h-12 rounded-full px-8 font-bold shadow-lg shadow-primary/20">
                                        <PlusCircle className="mr-2 h-5 w-5" /> Start New Course
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    {/* Toolbar */}
                    <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/20 p-4 rounded-2xl border border-dashed border-muted-foreground/20">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Filter courses by name..."
                                className="pl-10 h-11 bg-background"
                            />
                        </div>
                        <div className="flex w-full md:w-auto gap-3">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="h-11 px-4 font-bold border-dashed">
                                        <Filter className="mr-2 h-4 w-4" /> Status <ChevronDown className="ml-1 h-3 w-3 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem>All Status</DropdownMenuItem>
                                    <DropdownMenuItem>Published Only</DropdownMenuItem>
                                    <DropdownMenuItem>Drafts</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Premium Table Layout */}
                    <Card className="border-none shadow-xl overflow-hidden">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b bg-muted/30">
                                            <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-muted-foreground">Course Title</th>
                                            <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-muted-foreground text-center">Stats</th>
                                            <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                            <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-muted-foreground">Price</th>
                                            <th className="px-6 py-5 text-sm font-bold uppercase tracking-wider text-muted-foreground text-right">Settings</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-muted/30">
                                        {courses.data.map((course) => (
                                            <tr key={course.id} className="group hover:bg-muted/50 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-14 w-20 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden border relative">
                                                            {course.thumbnail_url ? (
                                                                <img
                                                                    src={course.thumbnail_url}
                                                                    alt={course.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <BookOpen className="h-6 w-6 text-muted-foreground/40" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <Link href={route('instructor.courses.edit', course.id)}>
                                                                <h3 className="font-bold text-lg leading-snug truncate group-hover:text-primary transition-colors">
                                                                    {course.title}
                                                                </h3>
                                                            </Link>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest px-1.5 h-5">
                                                                    {course.category?.name || 'General'}
                                                                </Badge>
                                                                <span className="text-xs text-muted-foreground flex items-center">
                                                                    <Calendar className="mr-1 h-3 w-3" /> Updated {new Date(course.updated_at).toLocaleDateString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-center gap-6">
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-sm font-black tracking-tight">{course.students_count?.toLocaleString() || 0}</span>
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground flex items-center">
                                                                <Users className="mr-1 h-2.5 w-2.5" /> Students
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col items-center">
                                                            <span className="text-sm font-black tracking-tight">{course.reviews_count?.toLocaleString() || 0}</span>
                                                            <span className="text-[10px] uppercase font-bold text-muted-foreground">Reviews</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <Badge className={cn(
                                                        "px-3 py-1 rounded-full text-xs font-bold transition-colors",
                                                        course.is_published
                                                            ? 'text-green-600 border-green-200 bg-green-50 shadow-sm shadow-green-100'
                                                            : 'text-yellow-600 border-yellow-200 bg-yellow-50 shadow-sm shadow-yellow-100'
                                                    )} variant="outline">
                                                        {course.is_published ? 'Published' : 'Draft'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="text-lg font-black tracking-tight text-primary">
                                                        USD {course.price ? parseFloat(course.price).toFixed(2) : '0.00'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right space-x-2">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={route('courses.show', course.slug)} target="_blank">
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="View Public Page">
                                                                <Eye className="h-5 w-5" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('instructor.courses.edit', course.id)}>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit Course">
                                                                <Edit className="h-5 w-5" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            onClick={() => handlePublishToggle(course.id)}
                                                            size="sm"
                                                            variant={course.is_published ? 'outline' : 'default'}
                                                            className={cn(
                                                                "h-10 rounded-lg font-bold px-4",
                                                                course.is_published && "text-destructive border-destructive/20 hover:bg-destructive/5"
                                                            )}
                                                        >
                                                            {course.is_published ? (
                                                                <><XCircle className="h-4 w-4 mr-2" /> Unpublish</>
                                                            ) : (
                                                                <><CheckCircle2 className="h-4 w-4 mr-2" /> Publish</>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>

                    {totalCourses === 0 && (
                        <div className="mt-12 py-24 border-2 border-dashed rounded-3xl text-center space-y-4 max-w-2xl mx-auto">
                            <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                                <PlusCircle className="h-10 w-10 text-muted-foreground/40" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight">Time to create your first masterpiece!</h2>
                            <p className="text-muted-foreground font-medium text-lg px-8">
                                Share your knowledge with the world. Click the button above to start building your first course.
                            </p>
                            <Link href={route('instructor.courses.create')}>
                                <Button className="h-12 rounded-full px-8 font-bold mt-4 shadow-lg shadow-primary/20">
                                    Start My First Course
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
