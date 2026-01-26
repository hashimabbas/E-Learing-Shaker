// resources/js/components/instructor/curriculum-item-editor.tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { useForm, router } from '@inertiajs/react';
import { PlusCircle, Trash2, Video, FileText, Download } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Simplified type for a lesson
interface LessonItem {
    id?: number;
    course_id: number;
    title: string;
    description: string;
    type: 'video' | 'quiz' | 'text' | 'downloadable';
    order: number;
    is_free_preview: boolean;
    // content_url?: string; // e.g., video path or downloadable_path
}

interface CurriculumItemEditorProps {
    courseId: number;
    lesson?: LessonItem;
    onSave: () => void;
    onCancel: () => void;
}

export default function CurriculumItemEditor({ courseId, lesson, onSave, onCancel }: CurriculumItemEditorProps) {
    const isEditing = !!lesson?.id;
    const { data, setData, post, patch, processing, errors, reset } = useForm({
        id: lesson?.id || null,
        course_id: courseId,
        title: lesson?.title || '',
        description: lesson?.description || '',
        type: lesson?.type || 'video',
        order: lesson?.order || 0,
        is_free_preview: lesson?.is_free_preview || false,
    });

    // --- CORRECTED: handleSubmit ---
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const routeName = isEditing ? 'instructor.lessons.update' : 'instructor.lessons.store';
        const routeParams = isEditing ? data.id! : undefined; // Use lesson ID if editing

        if (isEditing) {
            patch(route(routeName, routeParams), { // Use patch for updating
                onSuccess: () => {
                    onSave();
                    reset(); // Reset form after successful save
                },
                preserveScroll: true,
            });
        } else {
            post(route(routeName, routeParams), { // Use post for creating
                onSuccess: () => {
                    onSave();
                    reset();
                },
                preserveScroll: true,
            });
        }
    };
    // --- END CORRECTED ---

    return (
        <Card className="shadow-lg border-primary/50">
            <CardHeader>
                <CardTitle>{isEditing ? 'Edit Lesson' : 'Add New Lesson'}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        <InputError message={errors.title} />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={3}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Order */}
                        <div className="space-y-2">
                            <Label htmlFor="order">Order</Label>
                            <Input
                                id="order"
                                type="number"
                                value={data.order}
                                onChange={(e) => setData('order', parseInt(e.target.value))}
                                required
                            />
                            <InputError message={errors.order} />
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <Label htmlFor="type">Lesson Type</Label>
                            <Select
                                onValueChange={(value) => setData('type', value as any)} // Cast to any for now if strict typing is an issue
                                value={data.type}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="video">Video</SelectItem>
                                    <SelectItem value="downloadable">E-book/PDF</SelectItem>
                                    <SelectItem value="quiz">Quiz</SelectItem>
                                    <SelectItem value="text">Text</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.type} />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="preview"
                            checked={data.is_free_preview}
                            onChange={(e) => setData('is_free_preview', e.target.checked)}
                            className="form-checkbox" // Add class if needed for styling
                        />
                        <Label htmlFor="preview" className='font-normal'>Allow Free Preview</Label>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                        <Button type="submit" disabled={processing}>
                            {isEditing ? 'Save Changes' : 'Add Lesson'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
