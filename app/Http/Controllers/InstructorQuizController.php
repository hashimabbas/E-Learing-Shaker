<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\Inertia;

class InstructorQuizController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:instructor|admin']);
    }

    /**
     * Show the full Quiz management interface with all questions.
     */
    public function show(Quiz $quiz): Response
    {
        // Authorization check: Ensure instructor owns the lesson's course
        $course = $quiz->lesson->course;
        if (auth()->id() !== $course->user_id && !auth()->user()->isAdmin()) {
             abort(403);
        }

        $quiz->load(['questions.answers']); // Load everything for the editor

        return Inertia::render('Instructor/Quiz/Manage', [
            'quiz' => $quiz,
            'questions' => $quiz->questions,
        ]);
    }
    /**
     * Store a new Quiz (attached to a lesson).
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'lesson_id' => 'required|unique:quizzes,lesson_id|exists:lessons,id',
            'title' => 'required|string|max:255',
            'pass_percentage' => 'required|integer|min:1|max:100',
        ]);

        // Authorization: Ensure instructor owns the lesson's course
        // ...

        Quiz::create($validated);

        return back()->with('success', 'Quiz created successfully. Now add questions.');
    }

    /**
     * Add a Question (with Answers) to an existing Quiz.
     */
    public function addQuestion(Request $request, Quiz $quiz): RedirectResponse
    {
        // Authorization: Ensure instructor owns the quiz's lesson's course
        // ...

        $validated = $request->validate([
            'text' => 'required|string',
            'type' => 'required|in:single_choice,multiple_choice,true_false',
            'answers' => 'required|array|min:2',
            'answers.*.text' => 'required|string',
            'answers.*.is_correct' => 'required|boolean',
        ]);

        DB::beginTransaction();
        try {
            // 1. Create the Question
            $question = Question::create([
                'quiz_id' => $quiz->id,
                'text' => $validated['text'],
                'type' => $validated['type'],
                // Order would be set automatically or via request
            ]);

            // 2. Create the Answers
            foreach ($validated['answers'] as $answerData) {
                Answer::create([
                    'question_id' => $question->id,
                    'text' => $answerData['text'],
                    'is_correct' => $answerData['is_correct'],
                ]);
            }

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to add question. ' . $e->getMessage());
        }

        return back()->with('success', 'Question added successfully.');
    }

    /**
     * Update an existing Question and its Answers.
     */
    public function updateQuestion(Request $request, Question $question): RedirectResponse
    {
        // Authorization: Ensure instructor owns the quiz's lesson's course
        // ...

        $validated = $request->validate([
            'text' => 'required|string',
            'answers' => 'required|array|min:2',
            'answers.*.id' => 'nullable|exists:answers,id', // Existing ID or null for new answer
            'answers.*.text' => 'required|string',
            'answers.*.is_correct' => 'required|boolean',
        ]);

        DB::beginTransaction();
        try {
            // 1. Update Question Text
            $question->update(['text' => $validated['text']]);

            // 2. Sync Answers
            $existingAnswerIds = [];
            foreach ($validated['answers'] as $answerData) {
                $answer = Answer::updateOrCreate(
                    ['id' => $answerData['id'] ?? null, 'question_id' => $question->id],
                    ['text' => $answerData['text'], 'is_correct' => $answerData['is_correct']]
                );
                $existingAnswerIds[] = $answer->id;
            }

            // 3. Delete old answers that were not submitted
            $question->answers()->whereNotIn('id', $existingAnswerIds)->delete();

            DB::commit();
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("Quiz Question Update Failed: " . $e->getMessage(), ['question_id' => $question->id]);
            return back()->with('error', 'Failed to update question.');
        }

        return back()->with('success', 'Question updated successfully.');
    }


    /**
     * Delete a Question.
     */
    public function destroyQuestion(Question $question): RedirectResponse
    {
        $question->delete(); // On delete cascade handles answers
        return back()->with('success', 'Question removed.');
    }
}
