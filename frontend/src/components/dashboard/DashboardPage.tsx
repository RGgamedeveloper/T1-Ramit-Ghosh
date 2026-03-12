import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useStats, useHistory } from '../../hooks/useStats';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useStats();
  const { attempts, loading: historyLoading } = useHistory();
  const navigate = useNavigate();

  const statCards = [
    { label: 'Total Quizzes', value: stats?.total_attempts ?? 0, icon: '📝', color: 'var(--accent-indigo)' },
    { label: 'Avg. Score', value: `${stats?.avg_score ?? 0}%`, icon: '🎯', color: 'var(--accent-emerald)' },
    { label: 'Accuracy', value: `${stats?.accuracy ?? 0}%`, icon: '⚡', color: 'var(--accent-amber)' },
    { label: 'Questions Solved', value: stats?.total_questions ?? 0, icon: '✅', color: 'var(--accent-cyan)' },
  ];

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Welcome header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-greeting">
            Welcome back, <span className="text-gradient">{user?.first_name || 'there'}</span> 👋
          </h1>
          <p className="dashboard-subtitle">Here's your learning progress at a glance.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/quizzes')} id="browse-quizzes-btn">
          Browse Quizzes →
        </button>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {statCards.map((stat, idx) => (
          <div className="stat-card card" key={idx} style={{ '--stat-color': stat.color } as React.CSSProperties}>
            <div className="stat-card-header">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-value">{statsLoading ? '—' : stat.value}</div>
            <div className="stat-glow" />
          </div>
        ))}
      </div>

      {/* Score chart */}
      {stats && stats.recent_scores.length > 0 && (
        <div className="card dashboard-chart-card">
          <h2 className="section-title">📈 Recent Performance</h2>
          <div className="chart-container">
            <div className="chart-bars">
              {stats.recent_scores.map((score, idx) => (
                <div className="chart-bar-group" key={idx}>
                  <div className="chart-bar-label">{Math.round(score.percentage)}%</div>
                  <div
                    className="chart-bar"
                    style={{
                      height: `${Math.max(score.percentage, 5)}%`,
                      animationDelay: `${idx * 80}ms`,
                    }}
                  />
                  <div className="chart-bar-title" title={score.quiz__title}>
                    {score.quiz__title.length > 10 ? score.quiz__title.slice(0, 10) + '…' : score.quiz__title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="card dashboard-activity-card">
        <h2 className="section-title">📋 Recent Activity</h2>
        {historyLoading ? (
          <p className="text-secondary text-sm">Loading...</p>
        ) : attempts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">🚀</span>
            <p>No quiz attempts yet. Start your first quiz!</p>
            <button className="btn btn-primary btn-sm mt-4" onClick={() => navigate('/quizzes')}>
              Take a Quiz
            </button>
          </div>
        ) : (
          <div className="activity-list">
            {attempts.slice(0, 5).map((attempt) => (
              <div className="activity-row" key={attempt.id} onClick={() => navigate(`/results/${attempt.id}`)} id={`activity-${attempt.id}`}>
                <div className="activity-info">
                  <span className="activity-title">{attempt.quiz_title}</span>
                  <span className="activity-meta">
                    {attempt.category_name} · {new Date(attempt.started_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="activity-score">
                  <span className={`badge badge-${attempt.percentage >= 70 ? 'easy' : attempt.percentage >= 40 ? 'medium' : 'hard'}`}>
                    {attempt.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
