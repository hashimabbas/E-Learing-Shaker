// resources/js/pages/Admin/Categories/Index.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { PlusCircle, Trash2, Edit } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string | null;
    courses_count: number;
}

interface AdminCategoriesIndexProps {
    categories: Category[];
}

export default function AdminCategoriesIndex({ categories }: AdminCategoriesIndexProps) {
    // Form state for creating and editing
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        id: null as number | null,
        name: '',
        icon: '',
    });

    const isEditing = !!data.id;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            patch(route('admin.categories.update', data.id!), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('admin.categories.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (category: Category) => {
        setData({
            id: category.id,
            name: category.name,
            icon: category.icon || '',
        });
    };

    const handleDelete = (categoryId: number) => {
        if (confirm('Are you sure you want to delete this category? This cannot be undone.')) {
            router.delete(route('admin.categories.destroy', categoryId));
        }
    };

    const handleCancelEdit = () => {
        reset();
    };


    return (
        <AppLayout>
            <Head title="Category Management" />
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-6">Course Category Management</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 1. Create/Edit Form */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                {isEditing ? <Edit className="h-5 w-5 mr-2" /> : <PlusCircle className="h-5 w-5 mr-2" />}
                                {isEditing ? 'Edit Category' : 'Create New Category'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Category Name</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="icon">Icon Name (Optional)</Label>
                                    <Input id="icon" value={data.icon} onChange={(e) => setData('icon', e.target.value)} placeholder="e.g., Lucide-react icon name" />
                                    <InputError message={errors.icon} />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    {isEditing && (
                                        <Button type="button" variant="secondary" onClick={handleCancelEdit}>
                                            Cancel
                                        </Button>
                                    )}
                                    <Button type="submit" disabled={processing}>
                                        {isEditing ? 'Save Changes' : 'Create Category'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* 2. Categories List */}
                    <Card className="lg:col-span-2">
                        <CardHeader><CardTitle>Existing Categories</CardTitle></CardHeader>
                        <CardContent className="p-0">
                            <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                                <thead className="bg-neutral-50 dark:bg-neutral-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Courses</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                    {categories.map((category) => (
                                        <tr key={category.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                                            <td className="px-6 py-4 text-sm font-medium">{category.name}</td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">{category.courses_count}</td>
                                            <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                                                <Button onClick={() => handleEdit(category)} size="sm" variant="outline">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button onClick={() => handleDelete(category.id)} size="sm" variant="destructive" disabled={category.courses_count > 0} title={category.courses_count > 0 ? 'Cannot delete categories with courses' : 'Delete'}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
