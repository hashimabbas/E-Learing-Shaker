// resources/js/components/instructor/quiz-question-builder.tsx (FINAL COMPLETE CODE)
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';
import { useForm, router } from '@inertiajs/react';
import { PlusCircle, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";
import { useEffect } from 'react';

// Helper function for unique ID
const getUniqueId = () => Date.now() + Math.random();

interface AnswerData {
    local_id: number; // For React stability (NEW)
    id?: number; // <-- IMPORTANT: Backend ID for update/delete
    text: string;
    is_correct: boolean;
}

interface Question { id: number; text: string; type: string; answers: AnswerData[]; } // Ensure this is defined

interface QuizQuestionBuilderProps {
    lessonId: number;
    quizId: number | null; // Null if not initialized
    lessonTitle: string;
    onQuizCreated: () => void; // Function to call when a new quiz is created
    onQuestionSaved: () => void; // Function to close modal and update parent
    initialQuestion: Question | null; // <-- NEW PROP for editing

}

// Initial state for answers array (add local_id)
const initialAnswers: AnswerData[] = [
    { local_id: getUniqueId(), text: '', is_correct: true },
    { local_id: getUniqueId(), text: '', is_correct: false },
];

// Helper to correctly map answers from API format to React form state format
const mapAnswersForForm = (apiAnswers: any[]): AnswerData[] => {
    return apiAnswers.map((answer: any) => ({
        local_id: answer.id || getUniqueId(), // Use backend ID if available, otherwise local ID
        text: answer.text,
        is_correct: answer.is_correct,
        id: answer.id, // Keep the backend ID for the PATCH request
    }));
};

// --- CRITICAL MAPPING FUNCTION ---
const mapAnswersForEdit = (apiAnswers: any[]): AnswerData[] => {
    return apiAnswers.map((answer) => ({
        local_id: answer.id || getUniqueId(), // Use DB ID as local ID if available
        id: answer.id, // Preserve the database ID for the update request
        text: answer.text,
        is_correct: answer.is_correct,
    }));
};

export default function QuizQuestionBuilder({ lessonId, quizId, lessonTitle, onQuizCreated, onQuestionSaved, initialQuestion }: QuizQuestionBuilderProps) {

    // --- Determine Initial Form State ---
    const initialFormState = initialQuestion
        ? {
            id: initialQuestion.id,
            text: initialQuestion.text,
            type: initialQuestion.type,
            answers: mapAnswersForEdit(initialQuestion.answers), // MAPPED ANSWERS
            quiz_id: quizId,
        }
        : {
            id: null,
            text: '',
            type: 'single_choice',
            answers: initialAnswers,
            quiz_id: quizId,
        };

    // --- Quiz Initialization State ---
    const {
        data: quizData,
        setData: setQuizData,
        post: postQuiz,
        // put: putQuestion, // <-- ADDED PUT for update method
        processing: quizProcessing,
        errors: quizErrors,
        reset: quizReset
    } = useForm({
        lesson_id: lessonId,
        title: lessonTitle,
        pass_percentage: 70,
    });

    // --- Question Creation State (The primary form for adding questions) ---
    const {
        data: questionData,
        setData: setQuestionData,
        post: postQuestion,
        put: putQuestion, // Correctly using PUT for updates
        processing: questionProcessing,
        errors: questionErrors,
        reset: questionReset
    } = useForm(initialFormState); // <-- Use the determined initial state
    // --- EFFECT: Sync quizId after it's created or on component mount ---
    useEffect(() => {
        if (quizId && questionData.quiz_id !== quizId) {
            setQuestionData('quiz_id', quizId);
        }
    }, [quizId]);


    // --- HANDLERS: Pure Array Manipulation ---

    // Handler to update a specific answer text (Pure update)
    const handleAnswerChange = (index: number, newText: string) => {
        const updated = questionData.answers.map((answer, i) =>
            i === index ? { ...answer, text: newText } : answer
        );

        setQuestionData('answers', updated);
    };


    // Handler to set the correct answer(s) (Pure update)
    const handleCorrectAnswerChange = (index: number) => {
        let updated;

        if (questionData.type === 'single_choice' || questionData.type === 'true_false') {
            updated = questionData.answers.map((answer, i) => ({
                ...answer,
                is_correct: i === index,
            }));
        } else {
            // multiple_choice
            updated = questionData.answers.map((answer, i) => ({
                ...answer,
                is_correct: i === index ? !answer.is_correct : answer.is_correct,
            }));
        }

        setQuestionData('answers', updated);
    };

    // Handler to add a new answer (Pure update)
    const handleAddAnswer = () => {
        setQuestionData('answers', [...questionData.answers, { local_id: getUniqueId(), text: '', is_correct: false }]);
    };


    // Handler for Quiz Initialization
    const handleCreateQuiz = (e: React.FormEvent) => {
        e.preventDefault();
        postQuiz(route('instructor.quizzes.store'), {
            onSuccess: () => onQuizCreated(), // Tell the parent to reload page props
            preserveScroll: true,
            onError: (errors) => console.error("Quiz Creation Error:", errors)
        });
    };



    // Handler for final Question Submission
    // Handler for final Question Submission (UNIFIED LOGIC)
    const handleQuestionSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const correctCount = questionData.answers.filter(a => a.is_correct && a.text.trim() !== '').length;
        if (questionData.answers.length < 2 || correctCount === 0) {
            toast.error('Question must have at least two answers and one correct answer.');
            return;
        }

        const isEditing = !!questionData.id;
        const submitMethod = isEditing ? putQuestion : postQuestion; // Choose PUT for update, POST for new
        const routeName = isEditing ? 'instructor.quizzes.question.update' : 'instructor.quizzes.question.add';

        // Final route parameter object structure
        const routeParams = isEditing
            ? { question: questionData.id } // Update expects question ID
            : { quiz: quizId };             // Store expects quiz ID

        submitMethod(route(routeName, routeParams), questionData, {
            onSuccess: () => {
                // 1. Reset for the next question
                questionReset('text');
                setQuestionData('answers', initialAnswers);

                // 2. Trigger the parent handler (closes modal/reloads data)
                onQuestionSaved();

                toast.success(`Question ${isEditing ? 'updated' : 'added'} successfully!`);
            },
            onError: (errors) => {
                // Log and show generic error
                console.error("Submission Error:", errors);
            },
            preserveScroll: true,
        });
    };

    // --- Render Logic ---
    if (!quizId) {
        // RENDER QUIZ INITIALIZATION FORM
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Quiz Not Initialized</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4 text-muted-foreground">
                        This lesson does not have a Quiz record yet. You must create the Quiz before adding questions.
                    </p>
                    <form onSubmit={handleCreateQuiz} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="quiz-title">Quiz Title</Label>
                            <Input id="quiz-title" value={quizData.title} onChange={(e) => setQuizData('title', e.target.value)} required />
                            <InputError message={quizErrors.title} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="pass-percentage">Pass Percentage (%)</Label>
                            <Input id="pass-percentage" type="number" min="1" max="100" value={quizData.pass_percentage} onChange={(e) => setQuizData('pass_percentage', parseInt(e.target.value))} required />
                            <InputError message={quizErrors.pass_percentage} />
                        </div>
                        <Button type="submit" disabled={quizProcessing}>
                            {quizProcessing ? 'Creating...' : 'Initialize Quiz'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        );
    }

    // RENDER QUESTION BUILDER (If Quiz ID exists)
    return (
        <Card>
            <CardContent>
                <form onSubmit={handleQuestionSubmit} className="space-y-6">
                    <CardHeader className='p-0'>
                        <CardTitle className='text-lg'>{questionData.id ? 'Editing Question' : 'Add New Question'}</CardTitle>
                    </CardHeader>

                    {/* Question Text */}
                    <div className="space-y-2">
                        <Label htmlFor="question-text">Question Text</Label>
                        <Textarea id="question-text" value={questionData.text} onChange={(e) => setQuestionData('text', e.target.value)} required rows={3} />
                        <InputError message={questionErrors.text} />
                    </div>

                    {/* Question Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Question Type</Label>
                        <Select onValueChange={(value) => setQuestionData('type', value as any)} value={questionData.type}>
                            <SelectTrigger id="type">
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="single_choice">Single Choice</SelectItem>
                                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                <SelectItem value="true_false">True/False</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={questionErrors.type} />
                    </div>

                    {/* Answers List */}
                    <h4 className="font-semibold border-b pb-2">Answers ({Array.isArray(questionData.answers) ? questionData.answers.length : 0})</h4>
                    <div className='space-y-3'>
                        {Array.isArray(questionData.answers) && questionData.answers.map((answer, index) => (
                            <div key={answer.local_id} className="flex items-center space-x-2">
                                {/* Correctness Toggle DIV/Checkbox (Final Fix for all types) */}
                                {questionData.type === 'multiple_choice' ? (
                                    <div className="flex h-9 items-center space-x-2">
                                        <Checkbox
                                            id={`answer-check-${index}`}
                                            checked={answer.is_correct}
                                            onCheckedChange={() => handleCorrectAnswerChange(index)}
                                        />
                                        <Label htmlFor={`answer-check-${index}`} className="font-normal cursor-pointer">Correct</Label>
                                    </div>
                                ) : (
                                    <div
                                        className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors cursor-pointer
                        ${answer.is_correct ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-background hover:bg-neutral-100 dark:hover:bg-neutral-800'}`}
                                        onClick={() => handleCorrectAnswerChange(index)}
                                        title={answer.is_correct ? 'Correct Answer' : 'Mark as Correct'}
                                    >
                                        {answer.is_correct ? <CheckCircle className='w-4 h-4' /> : <XCircle className='w-4 h-4' />}
                                    </div>
                                )}

                                <Input
                                    placeholder={`Answer Option ${index + 1}`}
                                    value={answer.text}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    disabled={questionData.answers.length <= 2}
                                    onClick={() => setQuestionData('answers', questionData.answers.filter((_, i) => i !== index))}
                                >
                                    <Trash2 className='w-4 h-4' />
                                </Button>
                            </div>
                        ))}
                    </div>

                    <Button type="button" variant="secondary" onClick={handleAddAnswer}>
                        <PlusCircle className='w-4 h-4 mr-2' /> Add Answer Option
                    </Button>

                    <Button type="submit" disabled={questionProcessing} className='w-full'>
                        {questionProcessing ? 'Saving...' : 'Save Question'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
