// resources/js/components/instructor/resource-upload-form.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { Upload, Video, Download, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface ResourceUploadFormProps {
    lessonId: number;
    lessonType: 'video' | 'downloadable';
    onUploadSuccess: () => void;
}

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB Chunks

export default function ResourceUploadForm({ lessonId, lessonType, onUploadSuccess }: ResourceUploadFormProps) {
    const { data, setData, errors, reset } = useForm({
        resource_file: null as File | null,
    });

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const isVideo = lessonType === 'video';
    const acceptType = isVideo ? 'video/mp4,video/quicktime' : 'application/pdf';
    const uploadIcon = isVideo ? <Video className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.resource_file) {
            toast.error('Please select a file to upload.');
            return;
        }

        const file = data.resource_file;
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const fileId = `${file.name}-${file.size}-${Date.now()}`.replace(/[^a-zA-Z0-9]/g, '-');

        setIsUploading(true);
        setUploadProgress(0);

        try {
            for (let index = 0; index < totalChunks; index++) {
                const start = index * CHUNK_SIZE;
                const end = Math.min(file.size, start + CHUNK_SIZE);
                const chunk = file.slice(start, end);

                const formData = new FormData();
                formData.append('file', chunk);
                formData.append('file_id', fileId);
                formData.append('chunk_index', index.toString());
                formData.append('total_chunks', totalChunks.toString());

                await axios.post(route('instructor.upload_chunk'), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const chunkProgress = (progressEvent.loaded / (progressEvent.total || chunk.size)) * 100;
                        const overallProgress = ((index / totalChunks) * 100) + (chunkProgress / totalChunks);
                        setUploadProgress(Math.round(overallProgress));
                    }
                });
            }

            // Finish upload
            await axios.post(route('instructor.finish_upload', lessonId), {
                file_id: fileId,
                total_chunks: totalChunks,
                original_name: file.name,
                lesson_type: lessonType,
            });

            toast.success('Resource uploaded and processed successfully.');
            onUploadSuccess();
            reset('resource_file');
        } catch (error: any) {
            console.error('Upload failed:', error);
            toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 border rounded-2xl bg-muted/30 shadow-sm">
            <h3 className="text-xl font-black italic tracking-tight uppercase flex items-center">
                {uploadIcon} Upload {isVideo ? 'Video Lecture' : 'E-Book PDF'}
            </h3>

            <div className="space-y-3">
                <Label htmlFor="resource_file" className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                    {isVideo ? 'Select Video File' : 'Select PDF File'}
                </Label>
                <Input
                    id="resource_file"
                    type="file"
                    accept={acceptType}
                    className="h-12 border-muted-foreground/20 rounded-xl bg-background/50 cursor-pointer pt-2"
                    onChange={(e) => setData('resource_file', e.target.files ? e.target.files[0] : null)}
                    disabled={isUploading}
                    required
                />
                <InputError message={errors.resource_file} />
            </div>

            <Button type="submit" disabled={isUploading} className='w-full h-12 rounded-xl font-black text-lg shadow-lg'>
                {isUploading ? (
                    <><Loader2 className='w-5 h-5 mr-2 animate-spin' /> Uploading...</>
                ) : (
                    <><Upload className='w-5 h-5 mr-2' /> Start Secure Upload</>
                )}
            </Button>

            {isUploading && (
                <div className="space-y-3 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                        <span>Transmitting Data...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2 rounded-full shadow-inner" />
                </div>
            )}
        </form>
    );
}

