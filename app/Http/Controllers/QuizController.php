<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Answer;
use App\Models\QuizAttempt;
use App\Models\UserLessonProgress;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Routing\Controller;

class QuizController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display the quiz page.
     */
    public function show(Quiz $quiz): Response
    {
        $user = auth()->user();

        // Authorization: Ensure user is enrolled in the course that contains this lesson/quiz
        // (You'd need to trace the Quiz -> Lesson -> Course -> Enrollment)
        // For now, let's assume this check is done via a Policy/Middleware for brevity.

        // Get the latest attempt
        $lastAttempt = $quiz->attempts()->where('user_id', $user->id)->latest()->first();

        // Load questions and their answers (EXCLUDE is_correct for the frontend)
        $quiz->load(['questions.answers' => fn ($query) => $query->select('id', 'question_id', 'text')]);

        return Inertia::render('Quiz/Show', [
            'quiz' => $quiz->only('id', 'title', 'description', 'pass_percentage', 'max_attempts'),
            'questions' => $quiz->questions,
            'lastAttempt' => $lastAttempt,
        ]);
    }

    /**
     * Process the quiz submission and return the results.
     */
    public function submit(Request $request, Quiz $quiz): Response
    {
        $user = auth()->user();
        $totalScore = 0;

        // 1. Basic Validation
        $request->validate(['answers' => 'required|array']);

        // 2. Load the answers that are correct (with Question ID)
        $correctAnswers = Answer::whereIn('question_id', $quiz->questions->pluck('id'))
            ->where('is_correct', true)
            ->pluck('id', 'question_id') // [question_id => correct_answer_id]
            ->toArray();

        // 3. Grade the Submission
        $userAnswers = $request->input('answers'); // Format: [question_id => answer_id(s)]
        $totalQuestions = $quiz->questions->count();

        foreach ($userAnswers as $questionId => $submittedAnswers) {
            $question = $quiz->questions->find($questionId);

            if ($question->type === 'single_choice' || $question->type === 'true_false') {
                $correctId = $correctAnswers[$questionId] ?? null;
                if ($submittedAnswers == $correctId) {
                    $totalScore++;
                }
            }
            // NOTE: Multiple choice grading is more complex (must select ALL correct and NO incorrect)
        }

        // 4. Final Score Calculation
        $scorePercentage = $totalQuestions > 0 ? round(($totalScore / $totalQuestions) * 100) : 0;
        $isPassed = $scorePercentage >= $quiz->pass_percentage;

        // 5. Store the Attempt
        $attempt = QuizAttempt::create([
            'user_id' => $user->id,
            'quiz_id' => $quiz->id,
            'user_answers' => $userAnswers,
            'score_percentage' => $scorePercentage,
            'is_passed' => $isPassed,
        ]);

        // 6. Update Lesson Progress if Passed
        if ($isPassed) {
            UserLessonProgress::updateOrCreate(
                ['user_id' => $user->id, 'lesson_id' => $quiz->lesson_id],
                ['is_completed' => true, 'completed_at' => now(), 'progress_percentage' => 100]
            );
            // Re-calculate and update overall course progress (similar logic as in ProgressController)
            // ... (Call a job/trait to handle course progress update) ...
        }

        // 7. Return Result View
        return Inertia::render('Quiz/Result', [
            'quiz' => $quiz->only('id', 'title'),
            'attempt' => $attempt,
            'isPassed' => $isPassed,
            'passPercentage' => $quiz->pass_percentage,
        ]);
    }
}
