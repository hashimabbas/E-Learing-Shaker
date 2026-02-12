// resources/js/pages/Instructor/Courses/Edit.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    Edit2,
    PlusCircle,
    Trash2,
    Video,
    ListOrdered,
    Users,
    BadgeDollarSign,
    CheckCircle2,
    Save,
    MoreHorizontal,
    Play,
    LayoutList,
    Sparkles,
    Settings,
    FileText,
    HelpCircle,
    LayoutGrid,
    Link as LinkIcon,
    Edit,
    Upload,
    Loader2,
    Download
} from 'lucide-react';
import { useState } from 'react';
import CurriculumItemEditor from '@/components/instructor/curriculum-item-editor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ResourceUploadForm from '@/components/instructor/resource-upload-form';
import { toast } from "sonner";
import TextContentEditor from '@/components/instructor/text-content-editor';
import { route } from 'ziggy-js';
import QuizManagerModal from '@/components/instructor/QuizManagerModal';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { Progress } from '@/components/ui/progress';

interface InstructorCoursesEditProps {
    course: any;
    categories: { id: number, name: string }[];
}

// --- Component 1: Curriculum Builder ---

interface CurriculumBuilderProps {
    lessons: any[];
    courseId: number;
    onUpdate: () => void;
    onContentEdit: (lesson: any) => void;
}

const CurriculumBuilder = ({ lessons, courseId, onUpdate, onContentEdit }: CurriculumBuilderProps) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingLesson, setEditingLesson] = useState<any>(null);

    const handleDelete = (lessonId: number) => {
        if (confirm('Are you sure you want to delete this lesson? All associated content will be lost.')) {
            router.delete(route('instructor.lessons.destroy', lessonId), {
                onSuccess: () => toast.success('Lesson deleted successfully.'),
                preserveScroll: true,
            });
        }
    };

    const handleSave = () => {
        setIsAdding(false);
        setEditingLesson(null);
        onUpdate();
        toast.success('Lesson details saved.');
    };

    return (
        <div className="space-y-6">
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <h3 className='text-2xl font-black tracking-tight'>Course Curriculum</h3>
                    <p className="text-muted-foreground font-medium text-sm">Manage lessons, modules, and learning assessments.</p>
                </div>
                <Button
                    onClick={() => setIsAdding(true)}
                    disabled={isAdding || !!editingLesson}
                    className="rounded-full px-6 font-bold shadow-lg shadow-primary/10"
                >
                    <PlusCircle className="h-4 w-4 mr-2" /> New Lesson
                </Button>
            </div>

            {(isAdding || editingLesson) && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <CurriculumItemEditor
                        courseId={courseId}
                        lesson={editingLesson}
                        onSave={handleSave}
                        onCancel={() => { setIsAdding(false); setEditingLesson(null); }}
                    />
                </div>
            )}

            <div className='grid gap-3'>
                {lessons.length > 0 ? (
                    lessons.sort((a: any, b: any) => a.order - b.order).map((lesson: any) => (
                        <Card key={lesson.id} className="group border shadow-sm hover:shadow-md transition-all overflow-hidden bg-card/50">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted font-black text-muted-foreground text-sm border">
                                            {lesson.order}
                                        </div>
                                        <div className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-xl border relative",
                                            lesson.type === 'quiz' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                lesson.type === 'video' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        )}>
                                            {lesson.type === 'quiz' ? <HelpCircle className="h-5 w-5" /> :
                                                lesson.type === 'video' ? <Video className="h-5 w-5" /> :
                                                    <FileText className="h-5 w-5" />}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0 text-center sm:text-left">
                                        <h4 className="font-bold text-lg truncate leading-snug">{lesson.title}</h4>
                                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 mt-1">
                                            <Badge variant="outline" className="capitalize text-[10px] h-5 px-1.5 font-bold tracking-widest bg-background">
                                                {lesson.type}
                                            </Badge>
                                            {lesson.is_free_preview && (
                                                <Badge className="bg-green-500 hover:bg-green-600 text-white border-none text-[10px] h-5 px-1.5 font-bold uppercase tracking-widest">
                                                    Free Preview
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 pt-2 sm:pt-0'>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="font-bold h-9 px-4 rounded-lg bg-background border shadow-sm"
                                            onClick={() => onContentEdit(lesson)}
                                        >
                                            Edit Content
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary"
                                            onClick={() => setEditingLesson(lesson)}
                                        >
                                            <Edit2 className='w-4 h-4' />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                                            onClick={() => handleDelete(lesson.id)}
                                        >
                                            <Trash2 className='w-4 h-4' />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="py-12 border-2 border-dashed rounded-3xl text-center space-y-3 bg-muted/20">
                        <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                            <ListOrdered className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <p className="text-muted-foreground font-bold italic">No lessons in this curriculum yet.</p>
                        <Button variant="ghost" className="text-primary font-black" onClick={() => setIsAdding(true)}>
                            Create the first lesson
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Course Edit Page ---

export default function InstructorCoursesEdit({ course, categories }: InstructorCoursesEditProps) {
    const { data, setData, patch, processing, errors } = useForm({
        title: course.title || '',
        title_ar: course.title_ar || '',
        description: course.description || '',
        description_ar: course.description_ar || '',
        category_id: course.category_id ? course.category_id.toString() : '',
        price: course.price || 0,
        thumbnail_file: null as File | null,
        preview_video_url: course.preview_video_url || '',
        preview_video_file: null as File | null,
        learning_outcomes: (course.learning_outcomes?.length > 0 ? course.learning_outcomes : ['']) as string[],
        learning_outcomes_ar: (course.learning_outcomes_ar?.length > 0 ? course.learning_outcomes_ar : ['']) as string[],
        discount_percentage: course.discount_percentage || 0,
        discount_start_date: course.discount_start_date ? new Date(course.discount_start_date).toISOString().slice(0, 16) : '',
        discount_end_date: course.discount_end_date ? new Date(course.discount_end_date).toISOString().slice(0, 16) : '',
    });

    const [previewType, setPreviewType] = useState(course.preview_video_url && !course.preview_video_url.startsWith('courses/') ? 'url' : 'upload');

    const handleAddOutcome = (language: 'en' | 'ar') => {
        const field = language === 'en' ? 'learning_outcomes' : 'learning_outcomes_ar';
        setData(field, [...data[field], '']);
    };

    const handleRemoveOutcome = (language: 'en' | 'ar', index: number) => {
        const field = language === 'en' ? 'learning_outcomes' : 'learning_outcomes_ar';
        const updated = [...data[field]];
        updated.splice(index, 1);
        setData(field, updated);
    };

    const handleOutcomeChange = (language: 'en' | 'ar', index: number, value: string) => {
        const field = language === 'en' ? 'learning_outcomes' : 'learning_outcomes_ar';
        const updated = [...data[field]];
        updated[index] = value;
        setData(field, updated);
    };

    const [contentModalOpen, setContentModalOpen] = useState(false);
    const [lessonForContent, setLessonForContent] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('details');
    const [isUploadingPreview, setIsUploadingPreview] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB Chunks

    const handleChunkedPreviewUpload = async () => {
        if (!data.preview_video_file) {
            toast.error('Please select a video file.');
            return;
        }

        const file = data.preview_video_file;
        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        const fileId = `course-${course.id}-preview-${file.name}-${file.size}-${Date.now()}`.replace(/[^a-zA-Z0-9]/g, '-');

        setIsUploadingPreview(true);
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
            await axios.post(route('instructor.finish_course_preview_upload', course.id), {
                file_id: fileId,
                total_chunks: totalChunks,
                original_name: file.name,
            });

            toast.success('Preview video uploaded successfully.');
            setData('preview_video_file', null);
            router.reload({ only: ['course'] });
        } catch (error: any) {
            console.error('Upload failed:', error);
            toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setIsUploadingPreview(false);
            setUploadProgress(0);
        }
    };

    const handleUpdateDetails = (e: React.FormEvent, tab?: string) => {
        e.preventDefault();

        // Optimize: Don't send files if we're not in the media tab to avoid "Post Too Large" errors
        const submittedData = { ...data, _method: 'patch' };
        if (tab && tab !== 'media_assets') {
            submittedData.thumbnail_file = null;
            submittedData.preview_video_file = null;
        }

        router.post(route('instructor.courses.update', course.id), submittedData, {
            onSuccess: () => {
                // Clear files from form state after successful save to keep requests small
                if (tab === 'media_assets') {
                    setData(d => ({ ...d, thumbnail_file: null, preview_video_file: null }));
                }
                router.reload({ only: ['course'] });
                toast.success("Changes saved successfully.");
            },
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleLessonUpdate = () => {
        router.reload({ only: ['course'] });
    };

    const handleOpenContentModal = (lesson: any) => {
        setLessonForContent(lesson);
        setContentModalOpen(true);
    };

    const handleContentUploadSuccess = () => {
        setContentModalOpen(false);
        router.reload({ only: ['course'] });
        toast.success("Resource attached successfully.");
    };

    const handleQuizCreated = () => {
        setContentModalOpen(false);
        router.reload({
            only: ['course'],
            onSuccess: () => {
                const newLesson = course.lessons.find((l: any) => l.id === lessonForContent.id);
                if (newLesson && newLesson.quiz?.id) {
                    setLessonForContent(newLesson);
                    setContentModalOpen(true);
                    toast.success("Quiz created! Let's add some questions.");
                } else {
                    handleLessonUpdate();
                }
            },
        });
    };

    const handleQuestionSaved = () => {
        setContentModalOpen(false);
        router.reload({ only: ['course'] });
    };

    const getExistingQuestions = (lesson: any) => {
        return lesson.quiz?.questions || [];
    };

    return (
        <AppLayout title={`Edit: ${course.title}`}>
            <Head title={`Edit: ${course.title}`} />

            <div className="bg-background min-h-screen pb-20">
                {/* Hub Header */}
                <div className="border-b bg-muted/30 py-8 lg:py-12">
                    <div className="container mx-auto px-4">
                        <Link href={route('instructor.courses.index')} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Catalog
                        </Link>

                        <div className="mt-8 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
                            <div className="space-y-4 max-w-2xl">
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary" className="px-3 py-1 font-bold text-xs bg-primary/10 text-primary border-primary/20">
                                        COURSE BUILDER
                                    </Badge>
                                    <Badge variant="outline" className={cn(
                                        "px-3 py-1 font-bold text-xs",
                                        course.is_published ? 'text-green-600 bg-green-50 border-green-200' : 'text-yellow-600 bg-yellow-50 border-yellow-200'
                                    )}>
                                        {course.is_published ? 'LIVE' : 'DRAFT'}
                                    </Badge>
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl leading-tight text-foreground truncate">
                                    {course.title}
                                </h1>
                                <p className="text-muted-foreground text-lg font-medium max-w-xl line-clamp-1">
                                    Course ID: <span className="text-foreground tracking-widest">#{course.id}</span> • {course.category?.name}
                                </p>
                                <div className="flex flex-wrap gap-3 pt-4">
                                    <Link href={route('courses.learn', course.slug)} target="_blank">
                                        <Button className="h-11 rounded-full px-6 font-extrabold shadow-lg shadow-primary/20 bg-emerald-600 hover:bg-emerald-700">
                                            <Play className="mr-2 h-4 w-4" /> Preview as Student
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <Card className="p-4 border-none shadow-sm bg-background flex flex-col items-center justify-center text-center">
                                    <Users className="h-5 w-5 mb-1 text-primary" />
                                    <span className="text-lg font-black leading-none">1.2k</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Students</span>
                                </Card>
                                <Card className="p-4 border-none shadow-sm bg-background flex flex-col items-center justify-center text-center">
                                    <BadgeDollarSign className="h-5 w-5 mb-1 text-green-600" />
                                    <span className="text-lg font-black leading-none">USD 4.5k</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Revenue</span>
                                </Card>
                                <Card className="hidden sm:flex p-4 border-none shadow-sm bg-background flex-col items-center justify-center text-center">
                                    <CheckCircle2 className="h-5 w-5 mb-1 text-blue-600" />
                                    <span className="text-lg font-black leading-none">{course.lessons.length}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Lessons</span>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-10">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="bg-muted/30 p-1.5 rounded-2xl inline-flex mb-8 border backdrop-blur-sm">
                            <TabsList className="bg-transparent h-auto gap-1">
                                <TabsTrigger value="details" className="rounded-xl px-5 py-3 font-bold text-sm flex items-center gap-2 transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary">
                                    <Sparkles className='w-4 h-4' /> General
                                </TabsTrigger>
                                <TabsTrigger value="classification" className="rounded-xl px-5 py-3 font-bold text-sm flex items-center gap-2 transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary">
                                    <LayoutList className='w-4 h-4' /> Classification
                                </TabsTrigger>
                                <TabsTrigger value="pricing" className="rounded-xl px-5 py-3 font-bold text-sm flex items-center gap-2 transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary">
                                    <BadgeDollarSign className='w-4 h-4' /> Pricing
                                </TabsTrigger>
                                <TabsTrigger value="media_assets" className="rounded-xl px-5 py-3 font-bold text-sm flex items-center gap-2 transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary">
                                    <Video className='w-4 h-4' /> Media
                                </TabsTrigger>
                                <TabsTrigger value="curriculum" className="rounded-xl px-5 py-3 font-bold text-sm flex items-center gap-2 transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary">
                                    <ListOrdered className='w-4 h-4' /> Curriculum
                                </TabsTrigger>
                                <TabsTrigger value="quizzes" className="rounded-xl px-5 py-3 font-bold text-sm flex items-center gap-2 transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary">
                                    <HelpCircle className='w-4 h-4' /> Assessments
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="details" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
                            <Card className="border-none shadow-xl">
                                <CardHeader className="bg-muted/30 pb-6 rounded-t-xl border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-background text-primary border shadow-sm">
                                            <Settings className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold italic tracking-tight uppercase">Basic Settings</CardTitle>
                                            <CardDescription>Fundamental details about the course.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={(e) => handleUpdateDetails(e, 'details')} className="space-y-8 max-w-4xl">
                                        <div className="space-y-3">
                                            <Label htmlFor="title" className="text-base font-bold tracking-tight">Title</Label>
                                            <Input
                                                id="title"
                                                className="h-14 text-lg font-bold border-muted-foreground/20 rounded-xl px-5 bg-muted/10 shadow-inner"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.title} />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="title_ar" className="text-base font-bold tracking-tight text-right block">Title (Arabic)</Label>
                                            <Input
                                                id="title_ar"
                                                dir="rtl"
                                                className="h-14 text-lg font-bold border-muted-foreground/20 rounded-xl px-5 bg-muted/10 shadow-inner"
                                                value={data.title_ar}
                                                onChange={(e) => setData('title_ar', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="description" className="text-base font-bold tracking-tight">Description</Label>
                                            <Textarea
                                                id="description"
                                                className="min-h-[160px] text-lg font-medium border-muted-foreground/20 rounded-xl p-5 bg-muted/10 shadow-inner resize-none leading-relaxed"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.description} />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="description_ar" className="text-base font-bold tracking-tight text-right block">Description (Arabic)</Label>
                                            <Textarea
                                                id="description_ar"
                                                dir="rtl"
                                                className="min-h-[160px] text-lg font-medium border-muted-foreground/20 rounded-xl p-5 bg-muted/10 shadow-inner resize-none leading-relaxed"
                                                value={data.description_ar}
                                                onChange={(e) => setData('description_ar', e.target.value)}
                                            />
                                        </div>

                                        <Separator className="my-8 border-dashed" />

                                        {/* Learning Outcomes (English) */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-base font-bold tracking-tight">What will students learn?</Label>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary font-bold"
                                                    onClick={() => handleAddOutcome('en')}
                                                >
                                                    <PlusCircle className="w-4 h-4 mr-1" /> Add Outcome
                                                </Button>
                                            </div>
                                            <div className="space-y-3">
                                                {data.learning_outcomes.map((outcome, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            placeholder={`Outcome #${index + 1}`}
                                                            className="h-12 border-muted-foreground/20 rounded-xl bg-muted/5 shadow-inner"
                                                            value={outcome}
                                                            onChange={(e) => handleOutcomeChange('en', index, e.target.value)}
                                                        />
                                                        {data.learning_outcomes.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-12 w-12 rounded-xl text-muted-foreground hover:text-destructive"
                                                                onClick={() => handleRemoveOutcome('en', index)}
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <InputError message={errors.learning_outcomes} />
                                        </div>

                                        {/* Learning Outcomes (Arabic) */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-base font-bold tracking-tight text-right block w-full">ماذا سيتعلم الطلاب؟ (بالعربية)</Label>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary font-bold"
                                                    onClick={() => handleAddOutcome('ar')}
                                                >
                                                    <PlusCircle className="w-4 h-4 mr-1" /> إضافة مخرجات
                                                </Button>
                                            </div>
                                            <div className="space-y-3">
                                                {data.learning_outcomes_ar.map((outcome, index) => (
                                                    <div key={index} className="flex gap-2">
                                                        <Input
                                                            dir="rtl"
                                                            placeholder={`المخرج #${index + 1}`}
                                                            className="h-12 border-muted-foreground/20 rounded-xl bg-muted/5 shadow-inner"
                                                            value={outcome}
                                                            onChange={(e) => handleOutcomeChange('ar', index, e.target.value)}
                                                        />
                                                        {data.learning_outcomes_ar.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-12 w-12 rounded-xl text-muted-foreground hover:text-destructive"
                                                                onClick={() => handleRemoveOutcome('ar', index)}
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={processing}
                                            className="h-14 rounded-full px-10 font-black tracking-tight text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                        >
                                            {processing ? 'Saving...' : <><Save className="mr-2 h-5 w-5" /> Save General Details</>}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="classification" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
                            <Card className="border-none shadow-xl">
                                <CardHeader className="bg-muted/30 pb-6 rounded-t-xl border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-background text-primary border shadow-sm">
                                            <LayoutList className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold italic tracking-tight uppercase">Classification</CardTitle>
                                            <CardDescription>Organize your course in the catalog.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={(e) => handleUpdateDetails(e, 'classification')} className="space-y-8 max-w-xl">
                                        <div className="space-y-3">
                                            <Label htmlFor="category_id" className="text-base font-bold tracking-tight">Category</Label>
                                            <Select onValueChange={(value) => setData('category_id', value)} value={data.category_id}>
                                                <SelectTrigger id="category_id" className="h-14 rounded-xl border-muted-foreground/20 text-lg font-medium px-5 bg-muted/10">
                                                    <SelectValue placeholder="Select a Category" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {categories.map(cat => (<SelectItem key={cat.id} value={cat.id.toString()} className="text-base py-3">{cat.name}</SelectItem>))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.category_id} />
                                        </div>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={processing}
                                            className="h-14 rounded-full px-10 font-black tracking-tight text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                        >
                                            {processing ? 'Saving...' : <><Save className="mr-2 h-5 w-5" /> Update Category</>}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Pricing Tab */}
                        <TabsContent value="pricing" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
                            <Card className="border-none shadow-xl">
                                <CardHeader className="bg-muted/30 pb-6 rounded-t-xl border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-background text-primary border shadow-sm">
                                            <BadgeDollarSign className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold italic tracking-tight uppercase">Pricing & Promotions</CardTitle>
                                            <CardDescription>Manage your course value and offers.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <form onSubmit={(e) => handleUpdateDetails(e, 'pricing')} className="space-y-8 max-w-4xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <Label htmlFor="price" className="text-base font-bold tracking-tight">Base Price (USD)</Label>
                                                <div className="relative">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground">USD</div>
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        className="h-14 rounded-xl border-muted-foreground/20 text-xl font-black pl-16 pr-5 bg-muted/10 shadow-inner"
                                                        value={data.price}
                                                        onChange={(e) => setData('price', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                                        required
                                                    />
                                                </div>
                                                <InputError message={errors.price} />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="discount_percentage" className="text-base font-bold tracking-tight">Discount Percentage (%)</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="discount_percentage"
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        className="h-14 rounded-xl border-muted-foreground/20 text-xl font-black px-5 bg-muted/10 shadow-inner"
                                                        value={data.discount_percentage}
                                                        onChange={(e) => setData('discount_percentage', e.target.value === '' ? 0 : parseInt(e.target.value))}
                                                    />
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground">%</div>
                                                </div>
                                                <InputError message={errors.discount_percentage} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="space-y-3">
                                                <Label htmlFor="discount_start_date" className="text-base font-bold tracking-tight">Offer Start</Label>
                                                <Input
                                                    id="discount_start_date"
                                                    type="datetime-local"
                                                    className="h-14 rounded-xl border-muted-foreground/20 font-medium px-5 bg-muted/10 shadow-inner"
                                                    value={data.discount_start_date}
                                                    onChange={(e) => setData('discount_start_date', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label htmlFor="discount_end_date" className="text-base font-bold tracking-tight">Offer End</Label>
                                                <Input
                                                    id="discount_end_date"
                                                    type="datetime-local"
                                                    className="h-14 rounded-xl border-muted-foreground/20 font-medium px-5 bg-muted/10 shadow-inner"
                                                    value={data.discount_end_date}
                                                    onChange={(e) => setData('discount_end_date', e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <Label className="text-base font-bold tracking-tight">Final Price</Label>
                                                <div className="h-14 flex items-center px-5 rounded-xl bg-green-50 border border-green-100 text-green-700 font-black text-xl">
                                                    USD {(data.price * (1 - (data.discount_percentage / 100))).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={processing}
                                            className="h-14 rounded-full px-10 font-black tracking-tight text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                                        >
                                            {processing ? 'Saving...' : <><Save className="mr-2 h-5 w-5" /> Update Pricing</>}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Media Tab */}
                        <TabsContent value="media_assets" className="mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
                            <Card className="border-none shadow-xl">
                                <CardHeader className="bg-muted/30 pb-6 rounded-t-xl border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-background text-primary border shadow-sm">
                                            <Sparkles className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold italic tracking-tight uppercase">Media & Preview</CardTitle>
                                            <CardDescription>Visual assets for your course.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-10 max-w-4xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            {/* Thumbnail */}
                                            <div className="space-y-4">
                                                <Label className="text-base font-bold tracking-tight">Course Thumbnail</Label>
                                                <div className="aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-muted-foreground/20 relative group">
                                                    {course.thumbnail_url ? (
                                                        <img src={course.thumbnail_url} alt="Course Thumbnail" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-muted/20 flex flex-col items-center justify-center text-muted-foreground">
                                                            <Sparkles className="w-10 h-10 mb-2 opacity-20" />
                                                            <span className="text-xs font-bold uppercase tracking-widest">No Thumbnail</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Label htmlFor="thumbnail_file" className="cursor-pointer bg-white text-black px-4 py-2 rounded-full font-bold text-xs">Change Image</Label>
                                                    </div>
                                                </div>
                                                <Input
                                                    id="thumbnail_file"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => setData('thumbnail_file', e.target.files ? e.target.files[0] : null)}
                                                />
                                                {data.thumbnail_file && (
                                                    <div className="flex items-center justify-between bg-primary/5 p-3 rounded-xl border border-primary/20">
                                                        <p className="text-xs font-bold text-primary flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4" /> {data.thumbnail_file.name}
                                                        </p>
                                                        <Button
                                                            size="sm"
                                                            onClick={(e) => handleUpdateDetails(e as any, 'media_assets')}
                                                            disabled={processing}
                                                            className="h-8 rounded-lg text-[10px] font-black uppercase"
                                                        >
                                                            {processing ? 'Saving...' : 'Upload Now'}
                                                        </Button>
                                                    </div>
                                                )}
                                                <p className="text-xs text-muted-foreground font-medium">Recommended: 1280x720px (JPG/PNG). Max 5MB.</p>
                                                <InputError message={errors.thumbnail_file} />
                                            </div>

                                            {/* Preview Video */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-base font-bold tracking-tight">Preview Video</Label>
                                                    <div className="flex bg-muted/20 p-1 rounded-lg border">
                                                        <Button
                                                            type="button"
                                                            variant={previewType === 'url' ? 'secondary' : 'ghost'}
                                                            size="sm"
                                                            className="h-8 text-[10px] font-black uppercase tracking-widest rounded-md"
                                                            onClick={() => setPreviewType('url')}
                                                        >
                                                            <LinkIcon className="w-3 h-3 mr-1" /> URL
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant={previewType === 'upload' ? 'secondary' : 'ghost'}
                                                            size="sm"
                                                            className="h-8 text-[10px] font-black uppercase tracking-widest rounded-md"
                                                            onClick={() => setPreviewType('upload')}
                                                        >
                                                            <Video className="w-3 h-3 mr-1" /> Upload
                                                        </Button>
                                                    </div>
                                                </div>

                                                {previewType === 'url' ? (
                                                    <div className="space-y-3 animate-in fade-in duration-300">
                                                        <div className="flex gap-2">
                                                            <Input
                                                                id="preview_video_url"
                                                                placeholder="YouTube / Vimeo Link"
                                                                className="h-14 text-lg font-medium border-muted-foreground/20 rounded-xl px-5 bg-muted/10 shadow-inner"
                                                                value={data.preview_video_url}
                                                                onChange={(e) => setData('preview_video_url', e.target.value)}
                                                            />
                                                            <Button
                                                                onClick={(e) => handleUpdateDetails(e as any, 'media_assets')}
                                                                disabled={processing}
                                                                className="h-14 rounded-xl px-6 font-bold"
                                                            >
                                                                <Save className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3 animate-in fade-in duration-300">
                                                        <Input
                                                            id="preview_video_file"
                                                            type="file"
                                                            accept="video/*"
                                                            className="h-14 pt-3 text-lg font-medium border-muted-foreground/20 rounded-xl px-5 bg-muted/10 cursor-pointer"
                                                            onChange={(e) => setData('preview_video_file', e.target.files ? e.target.files[0] : null)}
                                                            disabled={isUploadingPreview}
                                                        />
                                                        {isUploadingPreview && (
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                                                    <span>Uploading...</span>
                                                                    <span>{uploadProgress}%</span>
                                                                </div>
                                                                <Progress value={uploadProgress} className="h-2" />
                                                            </div>
                                                        )}
                                                        {data.preview_video_file && !isUploadingPreview && (
                                                            <Button
                                                                className="w-full h-12 rounded-xl font-bold bg-primary shadow-lg"
                                                                onClick={handleChunkedPreviewUpload}
                                                            >
                                                                <Upload className="w-4 h-4 mr-2" /> Start Chunked Upload (60MB+)
                                                            </Button>
                                                        )}
                                                        {course.preview_video_url && course.preview_video_url.startsWith('courses/') && !isUploadingPreview && (
                                                            <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit">Current: Video Uploaded</p>
                                                        )}
                                                    </div>
                                                )}
                                                <InputError message={errors.preview_video_url || errors.preview_video_file} />
                                                <p className="text-xs text-muted-foreground font-medium">A teaser video shown to non-enrolled students. Max 100MB.</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Curriculum Tab */}
                        <TabsContent value="curriculum" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
                            <Card className="border-none shadow-xl overflow-hidden">
                                <CardHeader className="bg-muted/30 pb-6 rounded-t-xl border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-background text-primary border shadow-sm">
                                            <LayoutGrid className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold italic tracking-tight uppercase">Structure Editor</CardTitle>
                                            <CardDescription>Drag, drop, and refine your learning path.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <CurriculumBuilder
                                        lessons={course.lessons}
                                        courseId={course.id}
                                        onUpdate={handleLessonUpdate}
                                        onContentEdit={handleOpenContentModal}
                                    />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Content Audit Tab */}
                        <TabsContent value="content_audit" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="border-none shadow-xl">
                                <CardHeader className="bg-muted/30 pb-6 rounded-t-xl border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-background text-primary border shadow-sm">
                                            <Video className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold italic tracking-tight uppercase">Content Audit</CardTitle>
                                            <CardDescription>Verification of all attached learning resources.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <p className="text-muted-foreground mb-10 font-medium bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 text-sm">
                                        <HelpCircle className="inline h-4 w-4 mr-2 mb-0.5 text-blue-600" />
                                        All media management is integrated directly within the **Curriculum Builder** tab for a seamless experience.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {course.lessons.map((lesson: any) => (
                                            <div key={lesson.id} className='flex items-center justify-between p-4 border rounded-2xl bg-muted/10 group hover:border-primary/30 transition-colors'>
                                                <div className="flex items-center gap-4">
                                                    <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center text-[10px] font-black">{lesson.order}</div>
                                                    <span className='font-bold'>{lesson.title}</span>
                                                </div>
                                                <Badge variant="outline" className={cn(
                                                    "h-7 px-3 rounded-full text-[10px] font-bold tracking-widest uppercase",
                                                    (lesson.video?.path || lesson.downloadable_path) ? 'bg-green-50 text-green-600 border-green-200' : 'bg-muted text-muted-foreground border-muted-foreground/10'
                                                )}>
                                                    {(lesson.video?.path || lesson.downloadable_path) ? 'Resource Ready' : 'Empty'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Assessments Tab */}
                        <TabsContent value="quizzes" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="border-none shadow-xl">
                                <CardHeader className="bg-muted/30 pb-6 rounded-t-xl border-b">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-background text-primary border shadow-sm">
                                            <HelpCircle className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-bold italic tracking-tight uppercase">Master Assessments</CardTitle>
                                            <CardDescription>Validate Student Knowledge.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="space-y-6">
                                        {course.lessons.map((lesson: any) => (
                                            <div key={lesson.id} className="flex items-center justify-between p-4 rounded-xl border bg-muted/10 hover:bg-muted/20 transition-colors">
                                                <div className="space-y-1">
                                                    <p className="font-bold text-sm tracking-tight">{lesson.title}</p>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                                                            {lesson.quiz ? 'Has Assessment' : 'No Assessment'}
                                                        </Badge>
                                                        {lesson.quiz && (
                                                            <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border-primary/20">
                                                                {lesson.quiz.questions?.length || 0} Questions
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleOpenContentModal(lesson)}
                                                    className="rounded-lg font-bold text-xs hover:bg-primary hover:text-white transition-all"
                                                >
                                                    {lesson.quiz ? 'Edit Assessment' : 'Setup Assessment'}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Global Content Editor Dialog */}
            <Dialog open={contentModalOpen} onOpenChange={setContentModalOpen}>
                <DialogContent className="max-w-4xl p-0 border-none rounded-3xl overflow-hidden shadow-3xl overflow-y-auto max-h-[90vh]">
                    <DialogHeader className="p-8 bg-primary text-primary-foreground">
                        <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase">
                            <LayoutGrid className="h-6 w-6" /> Editing Resource: {lessonForContent?.title}
                        </DialogTitle>
                        <p className="text-primary-foreground/70 font-medium italic mt-1">Refining content for Lesson {lessonForContent?.order}</p>
                    </DialogHeader>

                    <div className="p-8 bg-card">
                        {lessonForContent && lessonForContent.type === 'text' ? (
                            <TextContentEditor
                                lessonId={lessonForContent.id}
                                initialContent={lessonForContent.description || ''}
                                initialTitle={lessonForContent.title || 'Untitled Lesson'}
                                initialOrder={lessonForContent.order || 0}
                                initialIsFreePreview={lessonForContent.is_free_preview || false}
                                onSave={() => {
                                    setContentModalOpen(false);
                                    handleLessonUpdate();
                                }}
                            />
                        ) : lessonForContent && ['video', 'downloadable'].includes(lessonForContent.type) ? (
                            <ResourceUploadForm
                                lessonId={lessonForContent.id}
                                lessonType={lessonForContent.type}
                                onUploadSuccess={handleContentUploadSuccess}
                            />
                        ) : lessonForContent?.type === 'quiz' ? (
                            <QuizManagerModal
                                lessonId={lessonForContent.id}
                                quizId={lessonForContent.quiz?.id || null}
                                lessonTitle={lessonForContent.title}
                                existingQuestions={getExistingQuestions(lessonForContent)}
                                onQuizCreated={handleQuizCreated}
                                onQuestionSaved={handleQuestionSaved}
                            />
                        ) : (
                            <div className="py-20 text-center">
                                <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
                                <p className="text-muted-foreground font-bold italic">Lesson configuration incomplete.</p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog >
        </AppLayout >
    );
}
