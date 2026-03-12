import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../api/auth';
import './LoginPage.css';

type AuthTab = 'login' | 'register';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Show/hide password
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);
  const [showRegConfirm, setShowRegConfirm] = useState(false);

  // Google button container ref
  const googleBtnRef = useRef<HTMLDivElement>(null);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  // Google OAuth callback
  const handleGoogleResponse = useCallback(
    async (response: { credential: string }) => {
      setIsLoading(true);
      setError('');
      try {
        const { data } = await authApi.googleLogin({ credential: response.credential });
        login(data.tokens, data.user);
        navigate('/dashboard');
      } catch (err: any) {
        setError(parseApiError(err));
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate]
  );

  // Initialize Google Sign-In
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'your-google-client-id-here') return;

    const initGoogle = () => {
      if (window.google?.accounts?.id && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          type: 'standard',
          text: 'signin_with',
          shape: 'rectangular',
          width: 360,
        });
      }
    };

    // If GSI script already loaded
    if (window.google?.accounts?.id) {
      initGoogle();
    } else {
      // Wait for GSI script to load
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          initGoogle();
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [handleGoogleResponse, activeTab]);

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setError('');
    setSuccess('');
  };

  const parseApiError = (err: any): string => {
    const data = err?.response?.data;
    if (!data) return 'Something went wrong. Please try again.';
    if (typeof data === 'string') return data;
    if (data.error) return data.error;
    if (data.detail) return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
    const messages: string[] = [];
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (Array.isArray(val)) {
        messages.push(...val.map((v: any) => (typeof v === 'string' ? v : JSON.stringify(v))));
      } else if (typeof val === 'string') {
        messages.push(val);
      }
    }
    return messages.length ? messages.join(' ') : 'Something went wrong.';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { data } = await authApi.emailLogin({ email: loginEmail, password: loginPassword });
      login(data.tokens, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) {
      setError('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const { data } = await authApi.register({
        email: regEmail,
        username: regUsername,
        password: regPassword,
        confirm_password: regConfirm,
      });
      login(data.tokens, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const hasGoogleClientId = GOOGLE_CLIENT_ID && GOOGLE_CLIENT_ID !== 'your-google-client-id-here';

  return (
    <div className="login-page">
      {/* Decorative background elements */}
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-bg-orb login-bg-orb-3" />

      <div className="login-container animate-slide-up">
        <div className="login-card card-glass">
          {/* Logo */}
          <div className="login-logo">
            <div className="login-logo-icon">Q</div>
          </div>

          <h1 className="login-heading">Welcome to <span className="text-gradient">Quiz Portal</span></h1>
          <p className="login-subheading">
            {activeTab === 'login'
              ? 'Sign in to access interactive quizzes, track your progress, and climb the leaderboard.'
              : 'Create your account and start your learning journey today.'}
          </p>

          {/* Google Sign-In */}
          {hasGoogleClientId && activeTab === 'login' && (
            <>
              <div className="google-signin-container" ref={googleBtnRef} id="google-signin-btn" />
              <div className="login-divider">
                <span>or continue with email</span>
              </div>
            </>
          )}

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === 'login' ? 'auth-tab--active' : ''}`}
              onClick={() => switchTab('login')}
              id="login-tab"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === 'register' ? 'auth-tab--active' : ''}`}
              onClick={() => switchTab('register')}
              id="register-tab"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Register
            </button>
          </div>

          {/* Error / Success Messages */}
          {error && <div className="login-error">{error}</div>}
          {success && <div className="login-success">{success}</div>}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form className="auth-form" onSubmit={handleLogin} id="login-form">
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email</label>
                <div className="form-input-wrapper">
                  <svg className="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    type="email"
                    id="login-email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div className="form-input-wrapper">
                  <svg className="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showLoginPw ? 'text' : 'password'}
                    id="login-password"
                    className="form-input"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" className="form-pw-toggle" onClick={() => setShowLoginPw(!showLoginPw)} tabIndex={-1}>
                    {showLoginPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-submit-btn" disabled={isLoading} id="login-submit-btn">
                {isLoading ? (
                  <><span className="btn-spinner" /> Signing in...</>
                ) : (
                  <>Sign In</>
                )}
              </button>
              <button
                type="button"
                className="admin-quick-login-btn"
                disabled={isLoading}
                id="admin-login-btn"
                onClick={() => {
                  setLoginEmail('admin@quizportal.com');
                  setLoginPassword('Admin1234!');
                  setTimeout(() => {
                    const form = document.getElementById('login-form') as HTMLFormElement;
                    form?.requestSubmit();
                  }, 100);
                }}
              >
                🔑 Login as Admin
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form className="auth-form" onSubmit={handleRegister} id="register-form">
              <div className="form-group">
                <label className="form-label" htmlFor="reg-username">Username</label>
                <div className="form-input-wrapper">
                  <svg className="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    id="reg-username"
                    className="form-input"
                    placeholder="johndoe"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                    minLength={3}
                    autoComplete="username"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email</label>
                <div className="form-input-wrapper">
                  <svg className="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    type="email"
                    id="reg-email"
                    className="form-input"
                    placeholder="you@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password</label>
                <div className="form-input-wrapper">
                  <svg className="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type={showRegPw ? 'text' : 'password'}
                    id="reg-password"
                    className="form-input"
                    placeholder="Min. 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button type="button" className="form-pw-toggle" onClick={() => setShowRegPw(!showRegPw)} tabIndex={-1}>
                    {showRegPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
                <div className="form-input-wrapper">
                  <svg className="form-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <input
                    type={showRegConfirm ? 'text' : 'password'}
                    id="reg-confirm"
                    className="form-input"
                    placeholder="Re-enter password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    required
                    minLength={8}
                    autoComplete="new-password"
                  />
                  <button type="button" className="form-pw-toggle" onClick={() => setShowRegConfirm(!showRegConfirm)} tabIndex={-1}>
                    {showRegConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              <button type="submit" className="auth-submit-btn auth-submit-btn--register" disabled={isLoading} id="register-submit-btn">
                {isLoading ? (
                  <><span className="btn-spinner" /> Creating account...</>
                ) : (
                  <>Create Account</>
                )}
              </button>
            </form>
          )}

          {/* Bottom divider + features */}
          <div className="login-divider">
            <span>Secure Authentication</span>
          </div>

          <div className="login-features">
            <div className="login-feature">
              <span className="login-feature-icon">🎯</span>
              <span>Interactive Quizzes</span>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">📈</span>
              <span>Progress Tracking</span>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">⚡</span>
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
