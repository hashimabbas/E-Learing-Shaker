// resources/js/pages/Quiz/Result.tsx (The Final Missing File)
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, ChevronRight, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface QuizResultProps {
    quiz: { id: number; title: string };
    attempt: {
        score_percentage: number;
        is_passed: boolean;
        created_at: string;
    };
    isPassed: boolean;
    passPercentage: number;
}

export default function QuizResult({ quiz, attempt, isPassed, passPercentage }: QuizResultProps) {
    const statusText = isPassed ? "Congratulations! Quiz Passed!" : "Quiz Failed. Please Review and Try Again.";
    const statusColor = isPassed ? "text-green-600 border-green-500 bg-green-50 dark:bg-green-900/50" : "text-red-600 border-red-500 bg-red-50 dark:bg-red-900/50";
    const Icon = isPassed ? CheckCircle : XCircle;

    return (
        <AppLayout>
            <Head title={`Quiz Result: ${quiz.title}`} />
            <div className="mx-auto max-w-2xl py-12 px-4 sm:px-6 lg:px-8">
                <Card className={cn("p-8 shadow-2xl", statusColor)}>
                    <CardHeader className="text-center">
                        <Icon className={cn("w-16 h-16 mx-auto mb-4", isPassed ? "text-green-500" : "text-red-500")} />
                        <CardTitle className="text-3xl font-bold">{statusText}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        <p className="text-lg">Your Score: **{attempt.score_percentage}%**</p>
                        <p className="text-sm text-muted-foreground">The passing score for this quiz was **{passPercentage}%**.</p>

                        <Separator className="my-4" />

                        {isPassed ? (
                            <div className="space-y-3">
                                <p className="font-semibold">You have successfully completed this lesson.</p>
                                <Button className="w-full" asChild>
                                    <Link href={route('student.learning')}>
                                        <ChevronRight className="w-4 h-4 mr-2" /> Continue to My Learning
                                    </Link>
                                </Button>
                                {/* Assuming the course is 100% complete, guide to certificate */}
                                <Button className="w-full" variant="outline" asChild>
                                    <Link href={route('certificates.index')}>
                                        <Award className="w-4 h-4 mr-2" /> View All Certificates
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="font-semibold">Review the material and try again!</p>
                                <Button className="w-full" asChild>
                                    {/* The QuizController needs to send the lesson ID back to navigate correctly */}
                                    <Link href={route('dashboard')}>
                                        Try Quiz Again
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
