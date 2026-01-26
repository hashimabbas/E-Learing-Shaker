// resources/js/components/instructor/text-content-editor.tsx (NEW FILE)
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { useForm, router } from '@inertiajs/react';
import { toast } from "sonner";

interface TextContentEditorProps {
    lessonId: number;
    initialContent: string;
    // --- NEW PROPS: Required for backend validation ---
    initialTitle: string;
    initialOrder: number;
    initialIsFreePreview: boolean;
    // ------------------------------------------------
    onSave: () => void;
}

export default function TextContentEditor({ lessonId, initialContent, initialTitle, initialOrder, initialIsFreePreview, onSave }: TextContentEditorProps) {
    const { data, setData, patch, processing, errors } = useForm({
        // We only update the description field for the lesson
        description: initialContent,

        title: initialTitle, // FIX: Pass the original title
        order: initialOrder, // FIX: Pass the original order
        is_free_preview: initialIsFreePreview, // FIX: Pass the original flag

    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use the existing lesson update route: instructor.lessons.update
        patch(route('instructor.lessons.update', lessonId), {
            onSuccess: () => {
                toast.success('Text content saved successfully.');
                onSave();
            },
            onError: (err) => console.error("Text content save failed:", err),
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-white dark:bg-neutral-900">
            <h3 className="text-lg font-semibold">Edit Text Content</h3>
            <div className="space-y-2">
                <Label htmlFor="content">Lesson Text Content (Supports Markdown)</Label>
                <Textarea
                    id="content"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={10}
                    required
                />
                <InputError message={errors.description} />
            </div>

            <div className="flex justify-end space-x-2">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving...' : 'Save Text Content'}
                </Button>
                {/* We should show the title/order as read-only fields for context */}
                <p className="text-sm text-muted-foreground pt-2 border-t mt-4">
                    Updating content for: **{data.title}** (Order: {data.order})
                </p>
            </div>
        </form>
    );
}
