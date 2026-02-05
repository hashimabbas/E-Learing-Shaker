// resources/js/components/instructor/resource-upload-form.tsx (NEW FILE)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { Upload, Video, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

interface ResourceUploadFormProps {
    lessonId: number;
    lessonType: 'video' | 'downloadable';
    onUploadSuccess: () => void;
}

export default function ResourceUploadForm({ lessonId, lessonType, onUploadSuccess }: ResourceUploadFormProps) {
    const { data, setData, post, processing, errors, reset, progress } = useForm({
        resource_file: null as File | null,
    });

    const isVideo = lessonType === 'video';
    const acceptType = isVideo ? 'video/mp4,video/quicktime' : 'application/pdf';
    const uploadIcon = isVideo ? <Video className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.resource_file) {
            alert('Please select a file to upload.');
            return;
        }

        // The endpoint we created: instructor.lessons.upload_resource
        post(route('instructor.lessons.upload_resource', lessonId), {
            forceFormData: true,
            onSuccess: () => {
                onUploadSuccess();
                reset('resource_file');
            },
            onError: (err) => console.error(err),
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-neutral-50 dark:bg-neutral-800">
            <h3 className="text-lg font-semibold flex items-center">
                {uploadIcon} Upload {isVideo ? 'Video Lecture' : 'E-Book PDF'}
            </h3>

            <div className="space-y-2">
                <Label htmlFor="resource_file">{isVideo ? 'Select Video File' : 'Select PDF File'}</Label>
                <Input
                    id="resource_file"
                    type="file"
                    accept={acceptType}
                    onChange={(e) => setData('resource_file', e.target.files ? e.target.files[0] : null)}
                    required
                />
                <InputError message={errors.resource_file} />
            </div>

            <Button type="submit" disabled={processing} className='w-full'>
                <Upload className='w-4 h-4 mr-2' /> {processing ? 'Uploading...' : 'Start Upload'}
            </Button>

            {progress && (
                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Uploading...</span>
                        <span>{progress.percentage}%</span>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                </div>
            )}
        </form>
    );
}
