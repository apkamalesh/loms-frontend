import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage  from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

import { AdminLayout, TeacherLayout, StudentLayout } from './components/shared/AdminLayout';

import AdminDashboard      from './pages/admin/AdminDashboard';
import DepartmentsPage     from './pages/admin/DepartmentsPage';
import SubjectsPage        from './pages/admin/SubjectsPage';
import LearningOutcomesPage from './pages/admin/LearningOutcomesPage';
import UsersPage           from './pages/admin/UsersPage';
import PendingUsersPage    from './pages/admin/PendingUsersPage';
import LoginLogsPage       from './pages/admin/LoginLogsPage';

import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TestsPage        from './pages/teacher/TestsPage';
import EnterMarksPage   from './pages/teacher/EnterMarksPage';
import ClassSummaryPage from './pages/teacher/ClassSummaryPage';

import StudentDashboard from './pages/student/StudentDashboard';
import MyResultsPage    from './pages/student/MyResultsPage';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: '40vh' }} />;
  if (!user)   return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
};

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: '40vh' }} />;
  if (!user)   return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN')   return <Navigate to="/admin/dashboard"   replace />;
  if (user.role === 'TEACHER') return <Navigate to="/teacher/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' }
        }} />
        <Routes>
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/"       element={<RoleRedirect />} />

          {/* Admin */}
          <Route path="/admin" element={<PrivateRoute roles={['ADMIN']}><AdminLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"         element={<AdminDashboard />} />
            <Route path="departments"       element={<DepartmentsPage />} />
            <Route path="subjects"          element={<SubjectsPage />} />
            <Route path="learning-outcomes" element={<LearningOutcomesPage />} />
            <Route path="users"             element={<UsersPage />} />
            <Route path="pending-users"     element={<PendingUsersPage />} />
            <Route path="login-logs"        element={<LoginLogsPage />} />
          </Route>

          {/* Teacher */}
          <Route path="/teacher" element={<PrivateRoute roles={['TEACHER']}><TeacherLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"     element={<TeacherDashboard />} />
            <Route path="tests"         element={<TestsPage />} />
            <Route path="enter-marks"   element={<EnterMarksPage />} />
            <Route path="class-summary" element={<ClassSummaryPage />} />
          </Route>

          {/* Student */}
          <Route path="/student" element={<PrivateRoute roles={['STUDENT']}><StudentLayout /></PrivateRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"  element={<StudentDashboard />} />
            <Route path="my-results" element={<MyResultsPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
