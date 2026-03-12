import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './components/dashboard/DashboardPage';
import QuizList from './components/quiz/QuizList';
import QuizAttempt from './components/quiz/QuizAttempt';
import HistoryPage from './components/history/HistoryPage';
import ResultPage from './components/results/ResultPage';
import AdminQuizCreate from './components/admin/AdminQuizCreate';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected — Dashboard shell */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/quizzes" element={<QuizList />} />
            <Route path="/quiz/:id" element={<QuizAttempt />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/results/:id" element={<ResultPage />} />
            <Route path="/admin/create-quiz" element={<AdminQuizCreate />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
