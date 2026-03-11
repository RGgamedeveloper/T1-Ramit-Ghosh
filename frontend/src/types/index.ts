/* ================================================================
   TypeScript types for the Quiz Portal
   ================================================================ */

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  date_joined: string;
  is_admin?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  color: string;
  quiz_count: number;
}

export interface Choice {
  id: number;
  text: string;
  is_correct?: boolean;
}

export interface Question {
  id: number;
  text: string;
  explanation?: string;
  order: number;
  choices: Choice[];
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: Category | null;
  difficulty: 'easy' | 'medium' | 'hard';
  time_limit_seconds: number;
  question_count: number;
  created_by_name?: string;
  created_at: string;
}

export interface QuizDetail extends Quiz {
  questions: Question[];
}

export interface AttemptAnswer {
  id: number;
  question_id: number;
  question_text: string;
  selected_choice_id: number | null;
  selected_choice_text: string;
  is_correct: boolean;
}

export interface Attempt {
  id: number;
  quiz_id: number;
  quiz_title: string;
  category_name: string;
  status: 'in_progress' | 'completed' | 'timed_out';
  score: number;
  total_questions: number;
  percentage: number;
  time_taken_seconds: number;
  started_at: string;
  completed_at: string | null;
  answers?: AttemptAnswer[];
}

export interface UserStats {
  total_attempts: number;
  avg_score: number;
  total_correct: number;
  total_questions: number;
  accuracy: number;
  recent_scores: {
    quiz__title: string;
    percentage: number;
    completed_at: string;
  }[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
