import client from './client';
import type { Attempt, PaginatedResponse, UserStats } from '../types';

interface SubmitPayload {
  answers: { question_id: number; selected_choice_id: number | null }[];
  time_taken: number;
}

export const attemptsApi = {
  start: (quiz_id: number) =>
    client.post<Attempt>('/attempts/start/', { quiz_id }),

  submit: (attemptId: number, payload: SubmitPayload) =>
    client.post<Attempt>(`/attempts/${attemptId}/submit/`, payload),

  detail: (id: number) =>
    client.get<Attempt>(`/attempts/${id}/`),

  history: (params?: { page?: number; quiz_id?: number }) =>
    client.get<PaginatedResponse<Attempt>>('/attempts/history/', { params }),

  stats: () =>
    client.get<UserStats>('/attempts/stats/'),
};
