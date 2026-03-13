import { useState, useEffect, useCallback } from 'react';
import { quizzesApi } from '../api/quizzes';
import type { Quiz, PaginatedResponse, Category } from '../types';

export function useQuizzes(initialPage = 1) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [category, setCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page };
      if (category) params.category = category;
      if (difficulty) params.difficulty = difficulty;
      const { data } = await quizzesApi.list(params);
      setQuizzes(data.results);
      setTotalCount(data.count);
      setHasNext(!!data.next);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    } finally {
      setLoading(false);
    }
  }, [page, category, difficulty]);

  useEffect(() => { fetchQuizzes(); }, [fetchQuizzes]);

  return { quizzes, loading, page, setPage, totalCount, hasNext, category, setCategory, difficulty, setDifficulty };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    quizzesApi.categories()
      .then(({ data }) => setCategories(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}
