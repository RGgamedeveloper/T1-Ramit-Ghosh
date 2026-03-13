import { useState, useEffect } from 'react';
import { attemptsApi } from '../api/attempts';
import type { UserStats, Attempt, PaginatedResponse } from '../types';

export function useStats() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    attemptsApi.stats()
      .then(({ data }) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading };
}

export function useHistory() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  useEffect(() => {
    setLoading(true);
    attemptsApi.history({ page })
      .then(({ data }) => {
        setAttempts(data.results);
        setHasNext(!!data.next);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return { attempts, loading, page, setPage, hasNext };
}
