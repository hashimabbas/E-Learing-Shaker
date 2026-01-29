// resources/js/pages/Instructor/Courses/Create.tsx
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import {
    PlusCircle,
    ArrowLeft,
    Sparkles,
    BookOpen,
    BadgeDollarSign,
    LayoutList,
    ChevronRight,
    Rocket,
    Trash2
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { route } from 'ziggy-js';

interface InstructorCoursesCreateProps {
    categories: { id: number, name: string }[];
}

export default function InstructorCoursesCreate({ categories }: InstructorCoursesCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        title_ar: '',
        description: '',
        description_ar: '',
        category_id: '',
        price: 0,
        thumbnail_file: null as File | null,
        preview_video_url: '',
        learning_outcomes: [''] as string[],
        learning_outcomes_ar: [''] as string[],
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('instructor.courses.store'), {
            forceFormData: true, // Important for file uploads
        });
    };

    return (
        <AppLayout title="Create New Course">
            <Head title="Create New Course" />

            <div className="bg-background min-h-screen pb-20">
                {/* Hero / Header Section */}
                <div className="border-b bg-primary/5 py-12 lg:py-16">
                    <div className="container mx-auto px-4">
                        <Link href={route('instructor.courses.index')} className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Link>
                        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
                            <div className="max-w-2xl space-y-4">
                                <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl flex items-center gap-4">
                                    <Sparkles className="h-10 w-10 text-primary animate-pulse" /> Launch Your New Course
                                </h1>
                                <p className="text-muted-foreground font-medium text-xl leading-relaxed">
                                    Fill in the basic details to start building your curriculum. You can add lessons, videos, and quizzes in the next step.
                                </p>
                            </div>
                            <div className="hidden lg:block shrink-0">
                                <div className="h-40 w-40 bg-primary/10 rounded-full flex items-center justify-center border-4 border-dashed border-primary/20">
                                    <Rocket className="h-20 w-20 text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-10">
                                {/* Core Information */}
                                <Card className="border-none shadow-xl">
                                    <CardHeader className="bg-muted/30 pb-6 rounded-t-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                                                <BookOpen className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold">General Information</CardTitle>
                                                <CardDescription>Tell us what your course is about.</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        {/* Title */}
                                        <div className="space-y-3">
                                            <Label htmlFor="title" className="text-base font-bold tracking-tight">How about a catchy title?</Label>
                                            <Input
                                                id="title"
                                                placeholder="e.g. Master React.js from Scratch to Advanced"
                                                className="h-14 text-lg font-medium border-muted-foreground/20 focus:border-primary px-5 rounded-xl shadow-inner bg-muted/10"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground font-medium">Be specific. This is what students see first.</p>
                                            <InputError message={errors.title} />
                                        </div>

                                        {/* Title (Arabic) */}
                                        <div className="space-y-3">
                                            <Label htmlFor="title_ar" className="text-base font-bold tracking-tight text-right block">Need an Arabic title?</Label>
                                            <Input
                                                id="title_ar"
                                                dir="rtl"
                                                placeholder="مثال: تعلم React.js من الصفر حتى الاحتراف"
                                                className="h-14 text-lg font-medium border-muted-foreground/20 focus:border-primary px-5 rounded-xl shadow-inner bg-muted/10"
                                                value={data.title_ar}
                                                onChange={(e) => setData('title_ar', e.target.value)}
                                            />
                                            <p className="text-xs text-muted-foreground font-medium text-right">Translation is optional but recommended.</p>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-3">
                                            <Label htmlFor="description" className="text-base font-bold tracking-tight">Describe the journey</Label>
                                            <Textarea
                                                id="description"
                                                placeholder="What will students learn? Why is this course special?"
                                                className="min-h-[160px] text-lg font-medium border-muted-foreground/20 focus:border-primary p-5 rounded-xl shadow-inner bg-muted/10 resize-none"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.description} />
                                        </div>

                                        {/* Description (Arabic) */}
                                        <div className="space-y-3">
                                            <Label htmlFor="description_ar" className="text-base font-bold tracking-tight text-right block">Describe in Arabic</Label>
                                            <Textarea
                                                id="description_ar"
                                                dir="rtl"
                                                placeholder="ماذا سيتعلم الطلاب؟ لماذا هذه الدورة مميزة؟"
                                                className="min-h-[160px] text-lg font-medium border-muted-foreground/20 focus:border-primary p-5 rounded-xl shadow-inner bg-muted/10 resize-none"
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
                                    </CardContent>
                                </Card>

                                {/* Logistics */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <Card className="border-none shadow-xl">
                                        <CardHeader className="bg-muted/30 pb-6 rounded-t-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-purple-500 text-white">
                                                    <LayoutList className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-bold">Classification</CardTitle>
                                                    <CardDescription>Where does it fit?</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-3">
                                            <Label htmlFor="category_id" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Category</Label>
                                            <Select
                                                onValueChange={(value) => setData('category_id', value)}
                                                value={data.category_id.toString()}
                                            >
                                                <SelectTrigger id="category_id" className="h-14 rounded-xl border-muted-foreground/20 text-lg font-medium tracking-tight px-5 bg-muted/10">
                                                    <SelectValue placeholder="Select a Category" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl">
                                                    {categories.map(cat => (
                                                        <SelectItem key={cat.id} value={cat.id.toString()} className="text-base py-3">
                                                            {cat.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors.category_id} />
                                        </CardContent>
                                    </Card>

                                    <Card className="border-none shadow-xl">
                                        <CardHeader className="bg-muted/30 pb-6 rounded-t-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-green-500 text-white">
                                                    <BadgeDollarSign className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-lg font-bold">Pricing</CardTitle>
                                                    <CardDescription>Value of your expertise.</CardDescription>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 space-y-3">
                                            <Label htmlFor="price" className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Price (OMR)</Label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-muted-foreground">OMR</div>
                                                <Input
                                                    id="price"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    className="h-14 rounded-xl border-muted-foreground/20 text-xl font-black tracking-tight pl-16 pr-5 bg-muted/10"
                                                    value={data.price}
                                                    onChange={(e) => setData('price', parseFloat(e.target.value))}
                                                    required
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground font-medium">Set to 0.00 for a free course.</p>
                                            <InputError message={errors.price} />
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Media & Preview */}
                                <Card className="border-none shadow-xl">
                                    <CardHeader className="bg-muted/30 pb-6 rounded-t-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-red-500 text-white">
                                                <Sparkles className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg font-bold">Media & Preview</CardTitle>
                                                <CardDescription>Attract students with a great first impression.</CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Thumbnail */}
                                            <div className="space-y-3">
                                                <Label htmlFor="thumbnail_file" className="text-base font-bold tracking-tight">Course Thumbnail</Label>
                                                <Input
                                                    id="thumbnail_file"
                                                    type="file"
                                                    accept="image/*"
                                                    className="h-14 pt-3 text-lg font-medium border-muted-foreground/20 focus:border-primary px-5 rounded-xl shadow-inner bg-muted/10 cursor-pointer"
                                                    onChange={(e) => setData('thumbnail_file', e.target.files ? e.target.files[0] : null)}
                                                />
                                                <p className="text-xs text-muted-foreground font-medium">Recommended size: 1280x720 pixels (JPG/PNG)</p>
                                                <InputError message={errors.thumbnail_file} />
                                            </div>

                                            {/* Preview Video URL */}
                                            <div className="space-y-3">
                                                <Label htmlFor="preview_video_url" className="text-base font-bold tracking-tight">Preview Video URL</Label>
                                                <Input
                                                    id="preview_video_url"
                                                    placeholder="e.g. https://youtube.com/watch?v=..."
                                                    className="h-14 text-lg font-medium border-muted-foreground/20 focus:border-primary px-5 rounded-xl shadow-inner bg-muted/10"
                                                    value={data.preview_video_url}
                                                    onChange={(e) => setData('preview_video_url', e.target.value)}
                                                />
                                                <p className="text-xs text-muted-foreground font-medium">A short teaser video to introduce the course.</p>
                                                <InputError message={errors.preview_video_url} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Form Footer / Action */}
                                <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-muted/40 rounded-3xl border border-dashed border-muted-foreground/30 gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full border border-primary/20 flex items-center justify-center text-primary bg-primary/10">
                                            <PlusCircle className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold tracking-tight italic">You're almost there!</p>
                                            <p className="text-xs text-muted-foreground font-medium">Next: Course content, video uploads, and quizzes.</p>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={processing}
                                        className="h-16 rounded-full px-12 text-xl font-bold shadow-2xl shadow-primary/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
                                    >
                                        {processing ? (
                                            'Creating...'
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                Create & Add Lessons <ChevronRight className="h-6 w-6" />
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
