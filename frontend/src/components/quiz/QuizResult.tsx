import React from 'react';
import type { Attempt } from '../../types';
import './QuizResult.css';

interface QuizResultProps {
  attempt: Attempt;
  onBack: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ attempt, onBack }) => {
  const percentage = Math.round(attempt.percentage);
  const isPassing = percentage >= 70;
  const timeTaken = attempt.time_taken_seconds;
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  return (
    <div className="quiz-result animate-slide-up">
      {/* Score circle */}
      <div className="result-hero card-glass">
        <div className={`result-circle ${isPassing ? 'result-pass' : 'result-fail'}`}>
          <svg viewBox="0 0 120 120" className="result-svg">
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={isPassing ? 'url(#grad-pass)' : 'url(#grad-fail)'}
              strokeWidth="8"
              strokeDasharray={`${(percentage / 100) * 339.3} 339.3`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              className="result-ring"
            />
            <defs>
              <linearGradient id="grad-pass" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#22d3ee" />
              </linearGradient>
              <linearGradient id="grad-fail" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>
          </svg>
          <div className="result-score">
            <span className="result-percentage">{percentage}%</span>
            <span className="result-label">{isPassing ? 'Great Job!' : 'Keep Practicing'}</span>
          </div>
        </div>

        <h1 className="result-title">{attempt.quiz_title}</h1>

        <div className="result-stats">
          <div className="result-stat">
            <span className="result-stat-value">{attempt.score}/{attempt.total_questions}</span>
            <span className="result-stat-label">Correct</span>
          </div>
          <div className="result-stat-divider" />
          <div className="result-stat">
            <span className="result-stat-value">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            <span className="result-stat-label">Time Taken</span>
          </div>
          <div className="result-stat-divider" />
          <div className="result-stat">
            <span className="result-stat-value">{attempt.status === 'completed' ? '✅' : '⏰'}</span>
            <span className="result-stat-label">{attempt.status === 'completed' ? 'Completed' : 'Timed Out'}</span>
          </div>
        </div>
      </div>

      {/* Answer breakdown */}
      {attempt.answers && attempt.answers.length > 0 && (
        <div className="card result-breakdown">
          <h2 className="section-title">📋 Answer Breakdown</h2>
          <div className="breakdown-list">
            {attempt.answers.map((ans, idx) => (
              <div className={`breakdown-row ${ans.is_correct ? 'correct' : 'incorrect'}`} key={ans.id}>
                <div className="breakdown-indicator">
                  {ans.is_correct ? '✅' : '❌'}
                </div>
                <div className="breakdown-content">
                  <span className="breakdown-question">Q{idx + 1}: {ans.question_text}</span>
                  <span className="breakdown-answer">
                    Your answer: {ans.selected_choice_text || 'Not answered'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="result-actions">
        <button className="btn btn-primary btn-lg" onClick={onBack} id="back-to-quizzes-btn">
          ← Back to Quizzes
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
