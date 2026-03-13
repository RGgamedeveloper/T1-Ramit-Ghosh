import { useState, useEffect, useCallback, useRef } from 'react';
import { quizzesApi } from '../api/quizzes';
import { attemptsApi } from '../api/attempts';
import type { QuizDetail, Attempt } from '../types';

interface AnswerState {
  [questionId: number]: number | null; // choice id
}

export function useQuizAttempt(quizId: number) {
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const startTimeRef = useRef<number>(0);

  // Load quiz & start attempt
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [quizRes, attemptRes] = await Promise.all([
          quizzesApi.detail(quizId),
          attemptsApi.start(quizId),
        ]);
        if (cancelled) return;
        setQuiz(quizRes.data);
        setAttempt(attemptRes.data);
        setTimeLeft(quizRes.data.time_limit_seconds);
        startTimeRef.current = Date.now();
      } catch (err) {
        console.error('Failed to start quiz attempt', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [quizId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 || result) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft > 0 && !result]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && attempt && !result && !isSubmitting) {
      submitAttempt();
    }
  }, [timeLeft]);

  const selectAnswer = useCallback((questionId: number, choiceId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (quiz && currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    }
  }, [quiz, currentQuestion]);

  const prevQuestion = useCallback(() => {
    if (currentQuestion > 0) setCurrentQuestion((q) => q - 1);
  }, [currentQuestion]);

  const goToQuestion = useCallback((idx: number) => {
    setCurrentQuestion(idx);
  }, []);

  const submitAttempt = useCallback(async () => {
    if (!attempt || !quiz || isSubmitting) return;
    setIsSubmitting(true);
    clearInterval(timerRef.current);

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
    const payload = quiz.questions.map((q) => ({
      question_id: q.id,
      selected_choice_id: answers[q.id] ?? null,
    }));

    try {
      const { data } = await attemptsApi.submit(attempt.id, {
        answers: payload,
        time_taken: timeTaken,
      });
      setResult(data);
    } catch (err) {
      console.error('Failed to submit attempt', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [attempt, quiz, answers, isSubmitting]);

  return {
    quiz,
    attempt,
    answers,
    currentQuestion,
    timeLeft,
    isSubmitting,
    result,
    loading,
    selectAnswer,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    submitAttempt,
  };
}
