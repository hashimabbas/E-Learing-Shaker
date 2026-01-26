// resources/js/pages/Quiz/Show.tsx
import AppLayout from '@/layouts/app-layout';
import { Quiz, Question, Answer } from '@/types'; // Define these types
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, CheckCircle, FileQuestion, LoaderCircle } from 'lucide-react';
import { useEffect, useState } from 'react';


interface QuizShowProps {
    quiz: Quiz;
    questions: (Question & { answers: Answer[] })[];
    lastAttempt: any; // Simplified type for last attempt
}

export default function QuizShow({ quiz, questions, lastAttempt }: QuizShowProps) {
    // Form data stores selected answer IDs: { [questionId: number]: answerId | answerId[] }
    const [allAnswered, setAllAnswered] = useState(false); // NEW STATE
    const { data, setData, post, processing, errors } = useForm({
        answers: {} as Record<number, number | number[]>,
    });

    // --- NEW: Check if all questions have an answer ---
    useEffect(() => {
        // Find the number of unique question IDs present in the answers object
        const answeredCount = Object.keys(data.answers).length;

        // Set the state if the count matches the total number of questions
        setAllAnswered(answeredCount === questions.length);

        // Note: You must ensure your input handler correctly sets data.answers[question.id]
        // when the user interacts with the radio/checkbox groups.
    }, [data.answers, questions.length]);
    // --------------------------------------------------

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('quizzes.submit', quiz.id));
    };

    // Logic to handle single choice answer selection
    const handleSingleChoice = (questionId: number, answerId: number) => {
        setData('answers', { ...data.answers, [questionId]: answerId });
    };

    if (lastAttempt && lastAttempt.is_passed) {
        return (
            <AppLayout>
                <Head title={quiz.title} />
                <div className="mx-auto max-w-4xl py-12 text-center">
                    <Card className="p-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <CardTitle className="text-3xl mb-2">Congratulations! You Passed!</CardTitle>
                        <CardDescription className="text-lg">
                            Your last score was {lastAttempt.score_percentage}%. You have completed this lesson.
                        </CardDescription>
                        <Button className="mt-6" onClick={() => router.visit(route('student.learning'))}>
                            Continue Learning
                        </Button>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title={quiz.title} />
            <div className="mx-auto max-w-4xl py-8">
                <Card className='mb-6'>
                    <CardHeader>
                        <CardTitle className="text-3xl flex items-center">
                            <FileQuestion className='w-6 h-6 mr-3' />
                            {quiz.title}
                        </CardTitle>
                        <CardDescription>{quiz.description}</CardDescription>
                        {lastAttempt && (
                            <p className="text-sm text-yellow-600 mt-2">
                                Your last score: {lastAttempt.score_percentage}% ({lastAttempt.is_passed ? 'Passed' : 'Failed'}). Attempts left: {quiz.max_attempts ? quiz.max_attempts - quiz.attempts.length : 'Unlimited'}
                            </p>
                        )}
                    </CardHeader>
                </Card>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {questions.map((question, index) => (
                        <Card key={question.id}>
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    {index + 1}. {question.text}
                                    <span className="text-sm text-muted-foreground ml-2 font-normal">({question.type.replace('_', ' ')})</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Only handles single choice/true_false for brevity */}
                                <RadioGroup onValueChange={(val) => handleSingleChoice(question.id, parseInt(val))}>
                                    {question.answers.map((answer) => (
                                        <div key={answer.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer">
                                            <RadioGroupItem value={answer.id.toString()} id={`q${question.id}-a${answer.id}`} />
                                            <Label htmlFor={`q${question.id}-a${answer.id}`} className='font-normal cursor-pointer'>{answer.text}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                                {errors[`answers.${question.id}`] && <p className="text-red-500 text-sm mt-2">{errors[`answers.${question.id}`]}</p>}
                            </CardContent>
                        </Card>
                    ))}

                    <Button
                        type="submit"
                        className="w-full h-12 text-lg"
                        // FIX: Use the allAnswered state to control the disabled attribute
                        disabled={processing || !allAnswered}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Submit Quiz
                    </Button>
                </form>
            </div>
        </AppLayout>
    );
}

// 3. Create Quiz Result Component (Quiz/Result.tsx - Omitted for brevity, but necessary)
