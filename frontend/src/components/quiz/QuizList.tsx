import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizzes, useCategories } from '../../hooks/useQuizzes';
import './QuizList.css';

const QuizList: React.FC = () => {
  const { quizzes, loading, page, setPage, totalCount, hasNext, category, setCategory, difficulty, setDifficulty } = useQuizzes();
  const { categories } = useCategories();
  const navigate = useNavigate();

  const difficultyOptions = ['', 'easy', 'medium', 'hard'];

  return (
    <div className="quiz-list-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📝 Browse Quizzes</h1>
          <p className="page-subtitle">{totalCount} quizzes available</p>
        </div>
      </div>

      {/* Filters */}
      <div className="quiz-filters">
        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select
            className="input filter-select"
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            id="filter-category"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label className="filter-label">Difficulty</label>
          <select
            className="input filter-select"
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
            id="filter-difficulty"
          >
            {difficultyOptions.map((d) => (
              <option key={d} value={d}>{d || 'All Levels'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quiz grid */}
      {loading ? (
        <div className="quiz-grid">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div className="quiz-card-skeleton card" key={i}>
              <div className="skeleton-line skeleton-title" />
              <div className="skeleton-line skeleton-desc" />
              <div className="skeleton-line skeleton-desc short" />
              <div className="skeleton-footer">
                <div className="skeleton-badge" />
                <div className="skeleton-badge" />
              </div>
            </div>
          ))}
        </div>
      ) : quizzes.length === 0 ? (
        <div className="empty-state card">
          <span className="empty-state-icon">🔍</span>
          <p>No quizzes found matching your filters.</p>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz, idx) => (
            <div
              className="quiz-card card"
              key={quiz.id}
              style={{ animationDelay: `${idx * 60}ms` }}
              onClick={() => navigate(`/quiz/${quiz.id}`)}
              id={`quiz-card-${quiz.id}`}
            >
              <div className="quiz-card-header">
                <span className="quiz-card-category" style={{ color: quiz.category?.color }}>
                  {quiz.category?.icon} {quiz.category?.name}
                </span>
                <span className={`badge badge-${quiz.difficulty}`}>{quiz.difficulty}</span>
              </div>
              <h3 className="quiz-card-title">{quiz.title}</h3>
              <p className="quiz-card-desc">{quiz.description}</p>
              <div className="quiz-card-footer">
                <span className="quiz-card-meta">📄 {quiz.question_count} questions</span>
                <span className="quiz-card-meta">⏱ {Math.round(quiz.time_limit_seconds / 60)} min</span>
              </div>
              <div className="quiz-card-cta">
                <span className="btn btn-primary btn-sm">Start Quiz →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="pagination">
          <button
            className="btn btn-secondary btn-sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            id="prev-page"
          >
            ← Previous
          </button>
          <span className="pagination-info">Page {page}</span>
          <button
            className="btn btn-secondary btn-sm"
            disabled={!hasNext}
            onClick={() => setPage(page + 1)}
            id="next-page"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizList;
