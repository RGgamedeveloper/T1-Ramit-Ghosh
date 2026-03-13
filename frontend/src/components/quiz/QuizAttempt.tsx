import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuizAttempt } from '../../hooks/useQuizAttempt';
import QuizResult from './QuizResult';
import './QuizAttempt.css';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const QuizAttempt: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quizId = Number(id);

  const {
    quiz, answers, currentQuestion, timeLeft,
    isSubmitting, result, loading,
    selectAnswer, nextQuestion, prevQuestion, goToQuestion, submitAttempt,
  } = useQuizAttempt(quizId);

  if (loading) {
    return (
      <div className="quiz-attempt-loading animate-pulse-soft">
        <div className="text-gradient" style={{ fontSize: '1.3rem', fontWeight: 700 }}>Loading quiz...</div>
      </div>
    );
  }

  if (result) {
    return <QuizResult attempt={result} onBack={() => navigate('/quizzes')} />;
  }

  if (!quiz) {
    return (
      <div className="quiz-attempt-loading">
        <p>Quiz not found.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/quizzes')}>Back to Quizzes</button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const timerDanger = timeLeft < 60;

  return (
    <div className="quiz-attempt animate-fade-in">
      {/* Header bar */}
      <div className="attempt-header card-glass">
        <div className="attempt-info">
          <h2 className="attempt-title">{quiz.title}</h2>
          <span className="attempt-progress">
            Question {currentQuestion + 1} / {totalQuestions}
          </span>
        </div>
        <div className={`attempt-timer ${timerDanger ? 'timer-danger' : ''}`}>
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="attempt-progress-bar">
        <div
          className="attempt-progress-fill"
          style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question navigation dots */}
      <div className="question-dots">
        {quiz.questions.map((q, idx) => (
          <button
            key={q.id}
            className={`question-dot ${idx === currentQuestion ? 'active' : ''} ${answers[q.id] !== undefined ? 'answered' : ''}`}
            onClick={() => goToQuestion(idx)}
            id={`question-dot-${idx}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Question card */}
      <div className="question-card card" key={question.id}>
        <h3 className="question-text">{question.text}</h3>
        <div className="choices-list">
          {question.choices.map((choice) => (
            <button
              key={choice.id}
              className={`choice-btn ${answers[question.id] === choice.id ? 'selected' : ''}`}
              onClick={() => selectAnswer(question.id, choice.id)}
              id={`choice-${choice.id}`}
            >
              <span className="choice-radio">
                {answers[question.id] === choice.id ? '●' : '○'}
              </span>
              <span className="choice-text">{choice.text}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="attempt-actions">
        <button
          className="btn btn-secondary"
          onClick={prevQuestion}
          disabled={currentQuestion === 0}
          id="prev-question-btn"
        >
          ← Previous
        </button>

        {currentQuestion < totalQuestions - 1 ? (
          <button className="btn btn-primary" onClick={nextQuestion} id="next-question-btn">
            Next →
          </button>
        ) : (
          <button
            className="btn btn-primary btn-lg"
            onClick={submitAttempt}
            disabled={isSubmitting}
            id="submit-quiz-btn"
          >
            {isSubmitting ? 'Submitting...' : `Submit Quiz (${answeredCount}/${totalQuestions} answered)`}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;
