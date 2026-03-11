import client from './client';
import type { Quiz, QuizDetail, Category, PaginatedResponse } from '../types';

export interface QuizCreatePayload {
  title: string;
  description?: string;
  category_name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit_seconds: number;
  is_published: boolean;
  questions: {
    text: string;
    explanation?: string;
    choices: { text: string; is_correct: boolean }[];
  }[];
}

export const quizzesApi = {
  list: (params?: { page?: number; category?: string; difficulty?: string }) =>
    client.get<PaginatedResponse<Quiz>>('/quizzes/', { params }),

  detail: (id: number, mode?: string) =>
    client.get<QuizDetail>(`/quizzes/${id}/`, { params: { mode } }),

  categories: () =>
    client.get<Category[]>('/quizzes/categories/'),

  createQuiz: (payload: QuizCreatePayload) =>
    client.post<{ id: number; title: string; message: string }>('/quizzes/create/', payload),
};
