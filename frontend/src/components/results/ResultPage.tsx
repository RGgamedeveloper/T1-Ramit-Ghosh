import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { attemptsApi } from '../../api/attempts';
import type { Attempt } from '../../types';
import QuizResult from '../quiz/QuizResult';

const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [attempt, setAttempt] = React.useState<Attempt | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    attemptsApi.detail(Number(id))
      .then(({ data }) => setAttempt(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: '60vh' }}>
        <div className="animate-pulse-soft text-gradient" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
          Loading result...
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="text-center p-6">
        <p>Result not found.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/history')}>Back to History</button>
      </div>
    );
  }

  return <QuizResult attempt={attempt} onBack={() => navigate('/history')} />;
};

export default ResultPage;
