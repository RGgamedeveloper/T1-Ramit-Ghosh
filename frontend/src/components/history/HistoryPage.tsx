import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHistory } from '../../hooks/useStats';
import './HistoryPage.css';

const HistoryPage: React.FC = () => {
  const { attempts, loading, page, setPage, hasNext } = useHistory();
  const navigate = useNavigate();

  return (
    <div className="history-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📋 Quiz History</h1>
          <p className="page-subtitle">All your past quiz attempts</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse-soft text-center p-6">Loading history...</div>
      ) : attempts.length === 0 ? (
        <div className="card empty-state">
          <span className="empty-state-icon">📭</span>
          <p>No completed quizzes yet. Start your first quiz!</p>
          <button className="btn btn-primary btn-sm mt-4" onClick={() => navigate('/quizzes')}>
            Browse Quizzes
          </button>
        </div>
      ) : (
        <div className="history-table-wrap card">
          <table className="history-table">
            <thead>
              <tr>
                <th>Quiz</th>
                <th>Category</th>
                <th>Score</th>
                <th>Time</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => {
                const mins = Math.floor(attempt.time_taken_seconds / 60);
                const secs = attempt.time_taken_seconds % 60;
                return (
                  <tr key={attempt.id} className="history-row" id={`history-row-${attempt.id}`}>
                    <td className="history-title">{attempt.quiz_title}</td>
                    <td>
                      <span className="badge badge-info">{attempt.category_name || '—'}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${attempt.percentage >= 70 ? 'easy' : attempt.percentage >= 40 ? 'medium' : 'hard'}`}>
                        {attempt.score}/{attempt.total_questions} ({Math.round(attempt.percentage)}%)
                      </span>
                    </td>
                    <td className="history-time">{mins}:{secs.toString().padStart(2, '0')}</td>
                    <td className="history-date">
                      {new Date(attempt.started_at).toLocaleDateString('en-US', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/results/${attempt.id}`)}
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {attempts.length > 0 && (
        <div className="pagination">
          <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            ← Previous
          </button>
          <span className="pagination-info">Page {page}</span>
          <button className="btn btn-secondary btn-sm" disabled={!hasNext} onClick={() => setPage(page + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
