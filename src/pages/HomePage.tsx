import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import StudentDashboard from '../components/dashboards/StudentDashboard';
import TeacherDashboard from '../components/dashboards/TeacherDashboard';
import CompanyDashboard from '../components/dashboards/CompanyDashboard';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Chào mừng đến với Hệ thống Quản lý Thực tập
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Khoa Công nghệ Thông tin - Đại học Đại Nam
        </p>
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Giới thiệu hệ thống
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Hệ thống quản lý thực tập và hợp tác doanh nghiệp giúp kết nối sinh viên, 
            giảng viên, và doanh nghiệp trong quá trình thực tập. Hệ thống cung cấp 
            các tính năng quản lý toàn diện từ đăng ký thực tập, phân công hướng dẫn, 
            theo dõi tiến độ đến đánh giá kết quả.
          </p>
        </div>
      </div>
    );
  }

  // Render dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'sinh-vien':
      return <StudentDashboard />;
    case 'giang-vien':
      return <TeacherDashboard />;
    case 'doanh-nghiep':
      return <CompanyDashboard />;
    default:
      return (
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600">
            Lỗi: Role không hợp lệ
          </h1>
        </div>
      );
  }
};

export default HomePage;