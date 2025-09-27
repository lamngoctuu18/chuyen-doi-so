
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import StudentsPage from './pages/StudentsPage';
import CompaniesPage from './pages/CompaniesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Protected routes */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                
                <Route 
                  path="/students" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'giang-vien']}>
                      <StudentsPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/teachers" 
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Giảng viên</h1>
                        <p className="text-gray-600">Trang đang được phát triển...</p>
                      </div>
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
                    <ProtectedRoute>
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900">Quản lý Thực tập</h1>
                        <p className="text-gray-600">Trang đang được phát triển...</p>
                      </div>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute allowedRoles={['admin', 'sinh-vien', 'giang-vien']}>
                      <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Đánh giá</h1>
                        <p className="text-gray-600">Trang đang được phát triển...</p>
                      </div>
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
