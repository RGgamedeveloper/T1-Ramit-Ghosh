import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { quizzesApi, QuizCreatePayload } from '../../api/quizzes';
import './AdminQuizCreate.css';

interface ChoiceForm {
  text: string;
  is_correct: boolean;
}

interface QuestionForm {
  text: string;
  explanation: string;
  choices: ChoiceForm[];
}

const emptyChoice = (): ChoiceForm => ({ text: '', is_correct: false });
const emptyQuestion = (): QuestionForm => ({
  text: '',
  explanation: '',
  choices: [emptyChoice(), emptyChoice(), emptyChoice(), emptyChoice()],
});

const AdminQuizCreate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeLimit, setTimeLimit] = useState(600);
  const [isPublished, setIsPublished] = useState(true);
  const [questions, setQuestions] = useState<QuestionForm[]>([emptyQuestion()]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Guard non-admin users
  if (!user?.is_admin) {
    return (
      <div className="admin-access-denied">
        <div className="card-glass" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
          <h2>Access Denied</h2>
          <p className="text-muted">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  // --- Question helpers ---
  const updateQuestion = (qIndex: number, field: keyof QuestionForm, value: any) => {
    setQuestions((prev) => prev.map((q, i) => (i === qIndex ? { ...q, [field]: value } : q)));
  };

  const addQuestion = () => setQuestions((prev) => [...prev, emptyQuestion()]);

  const removeQuestion = (qIndex: number) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((_, i) => i !== qIndex));
  };

  // --- Choice helpers ---
  const updateChoice = (qIndex: number, cIndex: number, field: keyof ChoiceForm, value: any) => {
    setQuestions((prev) =>
      prev.map((q, qi) =>
        qi === qIndex
          ? {
              ...q,
              choices: q.choices.map((c, ci) => {
                if (ci !== cIndex) {
                  // If setting a new correct, unset others
                  if (field === 'is_correct' && value === true) return { ...c, is_correct: false };
                  return c;
                }
                return { ...c, [field]: value };
              }),
            }
          : q
      )
    );
  };

  const addChoice = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, qi) => (qi === qIndex ? { ...q, choices: [...q.choices, emptyChoice()] } : q))
    );
  };

  const removeChoice = (qIndex: number, cIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, qi) =>
        qi === qIndex && q.choices.length > 2
          ? { ...q, choices: q.choices.filter((_, ci) => ci !== cIndex) }
          : q
      )
    );
  };

  // --- Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate
    if (!title.trim()) { setError('Quiz title is required.'); return; }
    if (!categoryName.trim()) { setError('Category is required.'); return; }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) { setError(`Question ${i + 1} text is empty.`); return; }
      const filledChoices = q.choices.filter((c) => c.text.trim());
      if (filledChoices.length < 2) { setError(`Question ${i + 1} needs at least 2 choices.`); return; }
      const correctCount = q.choices.filter((c) => c.is_correct && c.text.trim()).length;
      if (correctCount !== 1) { setError(`Question ${i + 1} must have exactly 1 correct answer.`); return; }
    }

    const payload: QuizCreatePayload = {
      title: title.trim(),
      description: description.trim(),
      category_name: categoryName.trim(),
      difficulty,
      time_limit_seconds: timeLimit,
      is_published: isPublished,
      questions: questions.map((q) => ({
        text: q.text.trim(),
        explanation: q.explanation.trim(),
        choices: q.choices
          .filter((c) => c.text.trim())
          .map((c) => ({ text: c.text.trim(), is_correct: c.is_correct })),
      })),
    };

    setIsLoading(true);
    try {
      const { data } = await quizzesApi.createQuiz(payload);
      setSuccess(`Quiz "${data.title}" created successfully!`);
      // Reset form after short delay
      setTimeout(() => navigate('/quizzes'), 1500);
    } catch (err: any) {
      const d = err?.response?.data;
      if (d?.error) setError(d.error);
      else if (d?.detail) setError(typeof d.detail === 'string' ? d.detail : JSON.stringify(d.detail));
      else if (d) {
        const msgs: string[] = [];
        for (const k of Object.keys(d)) {
          const v = d[k];
          if (Array.isArray(v)) msgs.push(...v.map((s: any) => `${k}: ${s}`));
          else if (typeof v === 'string') msgs.push(v);
        }
        setError(msgs.join(' ') || 'Failed to create quiz.');
      } else setError('Failed to create quiz.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-create animate-fade-in">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-title-icon">✨</span>
            Create New <span className="text-gradient">Quiz</span>
          </h1>
          <p className="admin-subtitle">Design questions, set answers, and publish to all users.</p>
        </div>
      </div>

      {error && <div className="admin-msg admin-msg--error">{error}</div>}
      {success && <div className="admin-msg admin-msg--success">{success}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* Quiz Meta */}
        <section className="admin-section card-glass">
          <h2 className="admin-section-title">📋 Quiz Details</h2>
          <div className="admin-grid">
            <div className="admin-field admin-field--full">
              <label className="admin-label" htmlFor="quiz-title">Title *</label>
              <input id="quiz-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. JavaScript Fundamentals" required />
            </div>
            <div className="admin-field admin-field--full">
              <label className="admin-label" htmlFor="quiz-desc">Description</label>
              <textarea id="quiz-desc" className="input admin-textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the quiz (optional)" rows={3} />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="quiz-category">Category *</label>
              <input id="quiz-category" className="input" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. JavaScript" required />
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="quiz-difficulty">Difficulty</label>
              <select id="quiz-difficulty" className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
                <option value="easy">🟢 Easy</option>
                <option value="medium">🟡 Medium</option>
                <option value="hard">🔴 Hard</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label" htmlFor="quiz-time">Time Limit (seconds)</label>
              <input id="quiz-time" className="input" type="number" min={30} max={7200} value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} />
            </div>
            <div className="admin-field admin-field--toggle">
              <label className="admin-toggle-label">
                <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                <span className="admin-toggle-switch" />
                <span>Publish immediately</span>
              </label>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">❓ Questions ({questions.length})</h2>
            <button type="button" className="btn btn-secondary btn-sm" onClick={addQuestion}>
              + Add Question
            </button>
          </div>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="admin-question card-glass">
              <div className="admin-question-header">
                <span className="admin-question-badge">Q{qIdx + 1}</span>
                {questions.length > 1 && (
                  <button type="button" className="btn btn-ghost btn-sm admin-remove-btn" onClick={() => removeQuestion(qIdx)}>
                    ✕ Remove
                  </button>
                )}
              </div>

              <div className="admin-field">
                <label className="admin-label">Question Text *</label>
                <textarea className="input admin-textarea" value={q.text} onChange={(e) => updateQuestion(qIdx, 'text', e.target.value)} placeholder="Enter your question..." rows={2} required />
              </div>

              <div className="admin-field">
                <label className="admin-label">Explanation (shown after answer)</label>
                <input className="input" value={q.explanation} onChange={(e) => updateQuestion(qIdx, 'explanation', e.target.value)} placeholder="Optional explanation" />
              </div>

              <div className="admin-choices-header">
                <label className="admin-label">Choices (select the correct one)</label>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => addChoice(qIdx)}>
                  + Choice
                </button>
              </div>

              <div className="admin-choices">
                {q.choices.map((c, cIdx) => (
                  <div key={cIdx} className={`admin-choice ${c.is_correct ? 'admin-choice--correct' : ''}`}>
                    <button
                      type="button"
                      className={`admin-choice-radio ${c.is_correct ? 'admin-choice-radio--active' : ''}`}
                      onClick={() => updateChoice(qIdx, cIdx, 'is_correct', true)}
                      title="Mark as correct"
                    >
                      {c.is_correct ? '✓' : ''}
                    </button>
                    <input
                      className="input admin-choice-input"
                      value={c.text}
                      onChange={(e) => updateChoice(qIdx, cIdx, 'text', e.target.value)}
                      placeholder={`Choice ${cIdx + 1}`}
                    />
                    {q.choices.length > 2 && (
                      <button type="button" className="btn btn-ghost btn-sm admin-choice-remove" onClick={() => removeChoice(qIdx, cIdx)}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Submit */}
        <div className="admin-actions">
          <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
            {isLoading ? (
              <><span className="btn-spinner" /> Creating...</>
            ) : (
              <>🚀 Create Quiz</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminQuizCreate;
