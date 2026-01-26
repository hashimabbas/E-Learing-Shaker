// resources/js/pages/Admin/Courses/PendingIndex.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PaginatedData } from '@/types';
import { CheckCircle, XCircle, Search, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

interface PendingCourse {
    id: number;
    title: string;
    price: number;
    description: string;
    instructor: { name: string };
    category: { name: string };
    created_at: string;
}

interface AdminPendingCoursesIndexProps {
    pendingCourses: PaginatedData<PendingCourse>;
}

export default function AdminPendingCoursesIndex({ pendingCourses }: AdminPendingCoursesIndexProps) {

    // Action to approve the course (which calls togglePublish in the backend)
    const handleApprove = (courseId: number, courseTitle: string) => {
        if (confirm(`Are you sure you want to APPROVE and PUBLISH "${courseTitle}"?`)) {
            // We use the existing 'admin.courses.publish' route, which toggles the 'is_published' flag
            router.post(route('admin.courses.publish', courseId), {}, {
                onSuccess: () => toast.success(`Course "${courseTitle}" has been approved and published.`),
                preserveScroll: true,
            });
        }
    };

    // Action to reject/delete the course (Placeholder for a more formal rejection process)
    const handleDelete = (courseId: number, courseTitle: string) => {
        if (confirm(`Are you sure you want to REJECT and DELETE "${courseTitle}"?`)) {
            // For now, use the instructor's destroy route (since admin can do anything)
            router.delete(route('instructor.courses.destroy', courseId), {
                onSuccess: () => toast.success(`Course "${courseTitle}" has been rejected and removed.`),
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Course Approval" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-6 flex items-center">
                    <ClipboardList className='w-6 h-6 mr-3' /> Courses Awaiting Approval
                </h1>

                <Card>
                    <CardContent className="p-0">
                        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                            <thead className="bg-neutral-50 dark:bg-neutral-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Course / Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Instructor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Submitted</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                {pendingCourses.data.map((course) => (
                                    <tr key={course.id} className="hover:bg-yellow-50/50 dark:hover:bg-yellow-900/10">
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {course.title}
                                            <p className="text-xs text-muted-foreground">{course.category.name}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{course.instructor.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">OMR {course.price ? parseFloat(course.price).toFixed(2) : 'Free'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-muted-foreground">{new Date(course.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <Button onClick={() => handleApprove(course.id, course.title)} size="sm" variant="success">
                                                <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                            </Button>
                                            <Button onClick={() => handleDelete(course.id, course.title)} size="sm" variant="destructive">
                                                <XCircle className="h-4 w-4 mr-1" /> Reject
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {pendingCourses.data.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="text-center py-6 text-muted-foreground">No courses currently require approval.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* Pagination links here */}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
