
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import CompaniesPage from './pages/CompaniesPage';
import InternshipsPage from './pages/InternshipsPage';
import TeacherReportsPage from './pages/TeacherReportsPage';
import TeacherCompanyEvaluationsPage from './pages/TeacherCompanyEvaluationsPage';
// import AdminReportsManagementSimple from './pages/AdminReportsManagementSimple';
import TestAdminReports from './pages/TestAdminReports';
// import SimpleAdminReports from './pages/SimpleAdminReports';
import ReliableAdminReports from './pages/ReliableAdminReports';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import ImportAccountsPage from './pages/ImportAccountsPage';
import ImportStudentsPage from './pages/ImportStudentsPage';
import MyInternsPage from './pages/MyInternsPage';
import StudentInternshipRegistrationForm from './pages/StudentInternshipRegistrationForm';
import ImportAssignmentsPage from './pages/ImportAssignmentsPage';
import InternshipBatchDetailsPage from './pages/InternshipBatchDetailsPage';
import StudentSubmissionsPage from './pages/StudentSubmissionsPage';
import StudentGuidePage from './pages/guides/StudentGuidePage';
import TeacherGuidePage from './pages/guides/TeacherGuidePage';
import CompanyGuidePage from './pages/guides/CompanyGuidePage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <ErrorBoundary>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Protected routes */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                
                {/* Admin only routes */}
                <Route 
                  path="/students" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <StudentsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/internship-batches/:id"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <InternshipBatchDetailsPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route 
                  path="/teachers" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <TeachersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/import-assignments"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ImportAssignmentsPage />
                    </ProtectedRoute>
                  }
                />

                <Route 
                  path="/import-students"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ImportStudentsPage />
                    </ProtectedRoute>
                  }
                />
                
                <Route 
                  path="/companies" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'doanh-nghiep']}>
                      <CompaniesPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/internships" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <InternshipsPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Reports for teachers */}
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute allowedRoles={['giang-vien']}>
                      <TeacherReportsPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Company evaluations for teachers */}
                <Route 
                  path="/company-evaluations" 
                  element={
                    <ProtectedRoute allowedRoles={['giang-vien']}>
                      <TeacherCompanyEvaluationsPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin reports management */}
                <Route 
                  path="/admin/reports" 
                  element={
                    <ErrorBoundary>
                      <ProtectedRoute allowedRoles={['admin']}>
                        <ReliableAdminReports />
                      </ProtectedRoute>
                    </ErrorBoundary>
                  } 
                />

                {/* Test admin reports */}
                <Route 
                  path="/test-admin-reports" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <TestAdminReports />
                    </ProtectedRoute>
                  } 
                />

                {/* Admin dashboard */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/import-accounts" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <ImportAccountsPage />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/my-interns" 
                  element={
                    <ProtectedRoute allowedRoles={['doanh-nghiep']}>
                      <MyInternsPage />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/internship-registration" 
                  element={
                    <ProtectedRoute allowedRoles={['sinh-vien']}>
                      <StudentInternshipRegistrationForm />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/student/submissions" 
                  element={
                    <ProtectedRoute allowedRoles={['sinh-vien']}>
                      <StudentSubmissionsPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Guides */}
                <Route 
                  path="/guide/student" 
                  element={
                    <ProtectedRoute allowedRoles={['sinh-vien']}>
                      <StudentGuidePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/guide/teacher" 
                  element={
                    <ProtectedRoute allowedRoles={['giang-vien']}>
                      <TeacherGuidePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/guide/company" 
                  element={
                    <ProtectedRoute allowedRoles={['doanh-nghiep']}>
                      <CompanyGuidePage />
                    </ProtectedRoute>
                  } 
                />

                {/* 404 redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        </ErrorBoundary>
      </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
