// resources/js/components/instructor/quiz-manager-modal.tsx (NEW FILE)
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useForm, router } from '@inertiajs/react';
import { ListOrdered, PlusCircle, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import QuizQuestionBuilder from './quiz-question-builder'; // Reuses the builder form
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Answer { id: number; text: string; is_correct: boolean; }
interface Question { id: number; text: string; type: string; answers: Answer[]; }

interface QuizManagerProps {
    lessonId: number;
    quizId: number | null;
    lessonTitle: string;
    onQuizCreated: () => void;
    onQuestionSaved: () => void;
    existingQuestions: Question[];
}

export default function QuizManagerModal({ lessonId, quizId, lessonTitle, onQuizCreated, onQuestionSaved, existingQuestions }: QuizManagerProps) {
    const [activeTab, setActiveTab] = useState('manage');
    // FIX: Initialize questions state with the data from the prop
    const [questions, setQuestions] = useState<Question[]>(existingQuestions);

    // --- NEW STATE: Question being edited (null for creation) ---
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

    const tabTitle = editingQuestion ? 'Edit Question' : 'Add New Question'; // <-- DYNAMIC TITLE
    // --- EFFECT: Re-sync Questions after a save (or rely on the parent's full reload) ---
    // Since the parent calls router.reload(), the modal re-renders with fresh existingQuestions.
    // We just ensure the state is correctly set on mount/prop change.
    useEffect(() => {
        setQuestions(existingQuestions);
    }, [existingQuestions]);

    // Handler for starting the Edit process
    const handleEditQuestion = (question: Question) => {
        setEditingQuestion(question);
        setActiveTab('add'); // Switch to the Add/Edit form tab
    };

    // Handler for saving/cancelling the builder form
    const handleQuestionBuilderClose = () => {
        setEditingQuestion(null); // Clear the editing state
        setActiveTab('manage'); // Switch back to the manage tab
        onQuestionSaved(); // Reload data
    };

    // --- Data Fetching: Fetch questions when the quizId becomes available ---
    // In a real app, this would be an API call to a route like `instructor.quizzes.questions.index`
    // For now, we will mock the fetching, as the full Inertia page reload handles the initial data fetch.

    // For this implementation, we will rely on the parent page to pass ALL quiz/question data via a prop
    // and rely on router.reload() to refresh this data.

    // --- Placeholder for Quiz Builder Functions ---
    const handleDeleteQuestion = (questionId: number) => {
        if (confirm('Are you sure you want to delete this question?')) {
            // Hitting the route we defined earlier: instructor.quizzes.question.destroy
            router.delete(route('instructor.quizzes.question.destroy', questionId), {
                onSuccess: () => {
                    toast.success('Question deleted successfully!');
                    onQuestionSaved(); // This reloads the page to get fresh data
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manage" className="flex items-center"><ListOrdered className='w-4 h-4 mr-2' /> View/Manage Questions</TabsTrigger>
                <TabsTrigger value="add" className="flex items-center">
                    {editingQuestion ? <Edit className='w-4 h-4 mr-2' /> : <PlusCircle className='w-4 h-4 mr-2' />}
                    {tabTitle}
                </TabsTrigger>
            </TabsList>

            {/* Tab 1: View/Manage Existing Questions */}
            <TabsContent value="manage" className="mt-4 max-h-[60vh] overflow-y-auto">
                <Card>
                    <CardContent className="space-y-4 pt-4">
                        {/* Placeholder: Assume we have a prop `existingQuestions` */}
                        {questions.length === 0 ? (
                            <p className="text-muted-foreground">No questions found for this quiz.</p>
                        ) : (
                            questions.map((question) => (
                                <div key={question.id} className="border p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold">{question.text}</p>
                                        <div className='flex space-x-2'>
                                            <Button size="icon" variant="outline" title="Edit" onClick={() => handleEditQuestion(question)}> {/* <-- WIRES THE EDIT ICON */}
                                                <Edit className='w-4 h-4' />
                                            </Button>
                                            <Button size="icon" variant="destructive" onClick={() => handleDeleteQuestion(question.id)}>
                                                <Trash2 className='w-4 h-4' />
                                            </Button>
                                        </div>
                                    </div>
                                    <p className='text-sm text-muted-foreground mt-2'>Answers: {question.answers.length}</p>
                                </div>
                            ))
                        )}
                        <Button onClick={() => setActiveTab('add')} disabled={!quizId} className='w-full'>Add First Question</Button>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Tab 2: Add New Question */}
            <TabsContent value="add" className="mt-4 max-h-[60vh] overflow-y-auto">
                {quizId ? (
                    <QuizQuestionBuilder
                        lessonId={lessonId}
                        quizId={quizId}
                        lessonTitle={lessonTitle}
                        initialQuestion={editingQuestion} // <-- PASSES DATA TO BE EDITED
                        onQuizCreated={onQuizCreated}
                        onQuestionSaved={handleQuestionBuilderClose} // <-- Final closure handler
                    />
                ) : (
                    <Card className='p-4'>
                        <CardTitle className='text-lg'>Initialize Quiz First</CardTitle>
                        <p className="text-muted-foreground mt-2">You must initialize the Quiz from the main Curriculum tab before you can add questions here.</p>
                    </Card>
                )}
            </TabsContent>
        </Tabs>
    );
}
