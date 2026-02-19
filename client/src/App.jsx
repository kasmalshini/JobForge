import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import WelcomePage from './pages/WelcomePage';
import Login from './components/auth/Login';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import RoleSkillsSelectionPage from './pages/RoleSkillsSelectionPage';
import Dashboard from './pages/Dashboard';
import MyProfilePage from './pages/MyProfilePage';
import SettingsPage from './pages/SettingsPage';
import InterviewPage from './pages/InterviewPage';
import FlashcardsPage from './pages/FlashcardsPage';
import CompetitionPage from './pages/CompetitionPage';
import FeedbackHistoryPage from './pages/FeedbackHistoryPage';
import LeaderboardPage from './pages/LeaderboardPage';
import UserStatsPage from './pages/UserStatsPage';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:resettoken" element={<ResetPasswordPage />} />
          <Route
            path="/role-setup"
            element={
              <PrivateRoute>
                <RoleSkillsSelectionPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <MyProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <PrivateRoute>
                <InterviewPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/flashcards"
            element={
              <PrivateRoute>
                <FlashcardsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/competition"
            element={
              <PrivateRoute>
                <CompetitionPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/feedback-history"
            element={
              <PrivateRoute>
                <FeedbackHistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <PrivateRoute>
                <LeaderboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <PrivateRoute>
                <UserStatsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;




