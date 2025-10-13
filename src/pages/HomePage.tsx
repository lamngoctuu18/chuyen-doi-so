import React, { useState } from 'react';
import { 
  Users, Building2, TrendingUp, Clock, 
  User, GraduationCap, Briefcase, Star,
  Calendar, Award, BookOpen, ArrowRight, X, 
  CheckCircle, FileText, Upload, Phone, Mail
} from 'lucide-react';
import daiNamLogo from '../assets/fitdnu_logo.png';
import backgroundDaiNam from '../assets/backgrounddainam.jpg';
import { useAuth } from '../hooks/useAuth';
import { useTeacherInfo, useTeacherDashboard } from '../hooks/useTeacherProfile';
import { useDashboardStats } from '../hooks/useDashboardStats';
import StudentHomePage from './StudentHomePage';
import type { TeacherInfo, TeacherDashboardStats } from '../types';
import CompanyDashboard from '../components/dashboards/CompanyDashboard';
import AdminDashboard from '../components/dashboards/AdminDashboard';



// Modern Recent Students component
const RecentStudents: React.FC<{ students: any[] }> = ({ students }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
          <Users className="h-8 w-8 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Sinh viên gần đây</h3>
          <p className="text-gray-600 font-medium">Danh sách sinh viên mới nhất</p>
        </div>
      </div>
      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
        Xem tất cả
        <ArrowRight className="h-4 w-4 ml-2" />
      </button>
    </div>
    
    <div className="space-y-4">
      {students.length > 0 ? (
        students.map((student, index) => (
          <div key={index} className="flex items-center p-5 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 border border-gray-200/60 hover:border-blue-300/60 transition-all duration-300 hover:shadow-lg">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {student.ho_ten_sinh_vien?.charAt(0) || 'S'}
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <p className="text-base font-bold text-gray-900 truncate mb-1">
                {student.ho_ten_sinh_vien}
              </p>
              <p className="text-sm text-gray-600 truncate font-medium">
                {student.ma_sinh_vien} • {student.doanh_nghiep_thuc_tap || 'Chưa có DN'}
              </p>
            </div>
            <div className="text-sm">
              {student.vi_tri_thuc_tap && (
                <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-xl font-semibold shadow-sm">
                  {student.vi_tri_thuc_tap}
                </span>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="bg-gradient-to-br from-gray-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-lg font-medium text-gray-600">Chưa có sinh viên nào</p>
        </div>
      )}
    </div>
  </div>
);

// Modern Quick Actions component
const QuickActions: React.FC = () => (
  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center space-x-4 mb-8">
      <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl shadow-lg">
        <Star className="h-8 w-8 text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900">Thao tác nhanh</h3>
        <p className="text-gray-600 font-medium">Các chức năng thường dùng</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button className="flex items-center p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 hover:border-blue-300 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 group hover:shadow-lg transform hover:scale-105">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
          <BookOpen className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <p className="font-bold text-gray-900 text-base">Tạo báo cáo</p>
          <p className="text-sm text-gray-600 font-medium">Báo cáo thực tập mới</p>
        </div>
      </button>
      
      <button className="flex items-center p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 hover:border-emerald-300 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 group hover:shadow-lg transform hover:scale-105">
        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <p className="font-bold text-gray-900 text-base">Quản lý SV</p>
          <p className="text-sm text-gray-600 font-medium">Xem sinh viên hướng dẫn</p>
        </div>
      </button>
      
      <button className="flex items-center p-6 rounded-2xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/60 hover:border-purple-300 hover:from-purple-100 hover:to-violet-100 transition-all duration-300 group hover:shadow-lg transform hover:scale-105">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <p className="font-bold text-gray-900 text-base">Lịch trình</p>
          <p className="text-sm text-gray-600 font-medium">Xem lịch thực tập</p>
        </div>
      </button>
      
      <button className="flex items-center p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 hover:border-orange-300 hover:from-orange-100 hover:to-amber-100 transition-all duration-300 group hover:shadow-lg transform hover:scale-105">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
          <Award className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4 text-left">
          <p className="font-bold text-gray-900 text-base">Đánh giá</p>
          <p className="text-sm text-gray-600 font-medium">Chấm điểm thực tập</p>
        </div>
      </button>
    </div>
  </div>
);

// Teacher HomePage
const TeacherHomePage: React.FC<{ teacherInfo: TeacherInfo; dashboardStats: TeacherDashboardStats }> = ({ 
  teacherInfo, 
  dashboardStats 
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Modern Hero Section với màu Đại Nam */}
      <div className="relative bg-gradient-to-br from-blue-900 via-primary-800 to-primary-900 text-white overflow-hidden" style={{background: 'linear-gradient(135deg, #213f99 0%, #1a3280 50%, #12204d 100%)'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-secondary-600/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                  <User className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent" style={{ lineHeight: '1.5' }}>
                    Chào mừng, {teacherInfo.ho_ten}!
                  </h1>
                  <div className="space-y-2">
                    <p className="text-blue-100 text-lg font-medium" style={{ lineHeight: '1.5' }}>
                      Mã giảng viên: {teacherInfo.ma_giang_vien} | Chuyên môn: {teacherInfo.chuyen_mon || teacherInfo.bo_mon}
                    </p>
                    <p className="text-blue-200 text-base" style={{ lineHeight: '1.5' }}>
                      {teacherInfo.chuc_vu} - {teacherInfo.khoa}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mini Stats in Hero */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl text-center">
                <div className="text-3xl font-bold">{dashboardStats.totalStudents}</div>
                <div className="text-sm text-blue-100">Sinh viên hướng dẫn</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl text-center">
                <div className="text-3xl font-bold">{dashboardStats.activeInternships}</div>
                <div className="text-sm text-blue-100">Đang thực tập</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 -mt-8 relative z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-emerald-600 text-sm font-semibold flex items-center bg-emerald-50 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12%
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.totalStudents}</p>
              <p className="text-lg font-semibold text-gray-700">Sinh viên hướng dẫn</p>
              <p className="text-sm text-gray-500">Tổng số sinh viên được phân công</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div className="text-emerald-600 text-sm font-semibold flex items-center bg-emerald-50 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                +8%
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.activeInternships}</p>
              <p className="text-lg font-semibold text-gray-700">Đang thực tập</p>
              <p className="text-sm text-gray-500">Sinh viên đang thực tập</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div className="text-emerald-600 text-sm font-semibold flex items-center bg-emerald-50 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                +3%
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">{dashboardStats.companiesCount}</p>
              <p className="text-lg font-semibold text-gray-700">Doanh nghiệp</p>
              <p className="text-sm text-gray-500">Đang hợp tác</p>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl hover:bg-white/90 transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div className="text-orange-600 text-sm font-semibold flex items-center bg-orange-50 px-3 py-1 rounded-full">
                <Star className="h-4 w-4 mr-1" />
                Tốt
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-gray-900">
                {Math.round((dashboardStats.activeInternships / Math.max(dashboardStats.totalStudents, 1)) * 100)}%
              </p>
              <p className="text-lg font-semibold text-gray-700">Hoàn thành</p>
              <p className="text-sm text-gray-500">Tỷ lệ tham gia thực tập</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Students - Spans 2 columns */}
          <div className="lg:col-span-2">
            <RecentStudents students={dashboardStats.recentStudents} />
          </div>
          
          {/* Quick Actions */}
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Modern Additional Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h3>
                <p className="text-gray-600 font-medium">Chi tiết tài khoản giảng viên</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200/60">
                <span className="text-gray-700 font-semibold">Email:</span>
                <span className="font-bold text-gray-900">{teacherInfo.email_ca_nhan}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-2xl border border-gray-200/60">
                <span className="text-gray-700 font-semibold">Điện thoại:</span>
                <span className="font-bold text-gray-900">{teacherInfo.so_dien_thoai}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-2xl border border-gray-200/60">
                <span className="text-gray-700 font-semibold">Trình độ:</span>
                <span className="font-bold text-gray-900">{teacherInfo.trinh_do}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl border border-gray-200/60">
                <span className="text-gray-700 font-semibold">Bộ môn:</span>
                <span className="font-bold text-gray-900">{teacherInfo.bo_mon}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Hoạt động gần đây</h3>
                <p className="text-gray-600 font-medium">Các hoạt động mới nhất</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 hover:shadow-md transition-all duration-200">
                <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mr-4 shadow-sm"></div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Cập nhật danh sách sinh viên</p>
                  <p className="text-gray-600 text-sm font-medium">2 giờ trước</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 hover:shadow-md transition-all duration-200">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mr-4 shadow-sm"></div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Tạo báo cáo tuần 3</p>
                  <p className="text-gray-600 text-sm font-medium">1 ngày trước</p>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 hover:shadow-md transition-all duration-200">
                <div className="w-4 h-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mr-4 shadow-sm"></div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">Phân công thực tập mới</p>
                  <p className="text-gray-600 text-sm font-medium">3 ngày trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Guide Modal Component
const GuideModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  guideType: 'student' | 'teacher' | 'company' | null;
}> = ({ isOpen, onClose, guideType }) => {
  if (!isOpen || !guideType) return null;

  const getGuideContent = () => {
    switch (guideType) {
      case 'student':
        return {
          title: 'Hướng dẫn Sinh viên',
          icon: <GraduationCap className="h-8 w-8 text-blue-600" />,
          color: 'from-blue-500 to-blue-600',
          steps: [
            {
              icon: <User className="h-6 w-6" />,
              title: 'Đăng nhập hệ thống',
              description: 'Sử dụng tài khoản được cung cấp bởi khoa để đăng nhập vào hệ thống.'
            },
            {
              icon: <FileText className="h-6 w-6" />,
              title: 'Đăng ký thực tập',
              description: 'Chọn doanh nghiệp và vị trí thực tập phù hợp với chuyên môn của bạn.'
            },
            {
              icon: <Upload className="h-6 w-6" />,
              title: 'Nộp báo cáo',
              description: 'Nộp báo cáo tuần và báo cáo cuối kỳ đúng thời hạn quy định.'
            },
            {
              icon: <CheckCircle className="h-6 w-6" />,
              title: 'Hoàn thành thực tập',
              description: 'Nhận đánh giá từ doanh nghiệp và giảng viên hướng dẫn.'
            }
          ]
        };
      case 'teacher':
        return {
          title: 'Hướng dẫn Giảng viên',
          icon: <BookOpen className="h-8 w-8 text-orange-600" />,
          color: 'from-orange-500 to-orange-600',
          steps: [
            {
              icon: <Users className="h-6 w-6" />,
              title: 'Quản lý sinh viên',
              description: 'Theo dõi danh sách sinh viên được phân công hướng dẫn thực tập.'
            },
            {
              icon: <FileText className="h-6 w-6" />,
              title: 'Xem báo cáo',
              description: 'Kiểm tra và đánh giá báo cáo thực tập của sinh viên.'
            },
            {
              icon: <Star className="h-6 w-6" />,
              title: 'Đánh giá sinh viên',
              description: 'Cho điểm và nhận xét về quá trình thực tập của sinh viên.'
            },
            {
              icon: <Building2 className="h-6 w-6" />,
              title: 'Liên hệ doanh nghiệp',
              description: 'Phối hợp với doanh nghiệp để theo dõi sinh viên thực tập.'
            }
          ]
        };
      case 'company':
        return {
          title: 'Hướng dẫn Doanh nghiệp',
          icon: <Building2 className="h-8 w-8 text-purple-600" />,
          color: 'from-purple-500 to-purple-600',
          steps: [
            {
              icon: <User className="h-6 w-6" />,
              title: 'Tiếp nhận sinh viên',
              description: 'Đăng ký và tiếp nhận sinh viên thực tập theo nhu cầu của công ty.'
            },
            {
              icon: <Calendar className="h-6 w-6" />,
              title: 'Lập kế hoạch thực tập',
              description: 'Xây dựng chương trình thực tập phù hợp cho sinh viên.'
            },
            {
              icon: <FileText className="h-6 w-6" />,
              title: 'Theo dõi tiến độ',
              description: 'Giám sát và hướng dẫn sinh viên trong quá trình thực tập.'
            },
            {
              icon: <Star className="h-6 w-6" />,
              title: 'Đánh giá kết quả',
              description: 'Đánh giá và phản hồi về kết quả thực tập của sinh viên.'
            }
          ]
        };
      default:
        return null;
    }
  };

  const content = getGuideContent();
  if (!content) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`bg-gradient-to-r ${content.color} p-6 rounded-t-3xl relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              {content.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{content.title}</h2>
              <p className="text-white/90">Hệ thống Quản lý Thực tập</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Các bước thực hiện</h3>
            <p className="text-gray-600">Làm theo hướng dẫn dưới đây để sử dụng hệ thống hiệu quả</p>
          </div>

          <div className="space-y-4">
            {content.steps.map((step, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className={`p-3 bg-gradient-to-r ${content.color} rounded-xl text-white flex-shrink-0`}>
                  {step.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                <div className="text-2xl font-bold text-gray-300 flex-shrink-0">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Info */}
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-blue-600" />
              Liên hệ hỗ trợ
            </h4>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">Hotline: 0123.456.789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700">Email: support@dainam.edu.vn</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Default HomePage with modern design
const DefaultHomePage: React.FC = () => {
  const { user } = useAuth();
  const [guideModal, setGuideModal] = useState<{
    isOpen: boolean;
    type: 'student' | 'teacher' | 'company' | null;
  }>({
    isOpen: false,
    type: null
  });

  const openGuide = (type: 'student' | 'teacher' | 'company') => {
    setGuideModal({ isOpen: true, type });
  };

  const closeGuide = () => {
    setGuideModal({ isOpen: false, type: null });
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(33, 63, 153, 0.8), rgba(26, 50, 128, 0.9)), url(${backgroundDaiNam})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Animated Background Elements - với opacity thấp hơn để không che background image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 -left-4 w-96 h-96 bg-orange-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-10 -right-4 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-600/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        
        {/* Geometric Pattern - opacity thấp hơn */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-20">
          {/* Logo - To hơn với viền cam */}
          <div className="mx-auto w-32 h-32 mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"></div>
            <div className="relative w-full h-full bg-white rounded-full shadow-xl p-2 flex items-center justify-center">
              <img 
                src={daiNamLogo} 
                alt="Đại học Đại Nam" 
                className="w-28 h-28 object-contain"
              />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-orange-100 to-blue-100 bg-clip-text text-transparent mb-12 animate-fade-in px-4" style={{ lineHeight: '1.5' }}>
            Chào mừng đến với Hệ thống Quản lý Thực tập
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 font-semibold mb-8 px-4 mt-8" style={{ lineHeight: '1.5' }}>
            Khoa Công nghệ Thông tin - Đại học Đại Nam
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-blue-400 mx-auto rounded-full mb-4"></div>
        </div>

        {/* User Welcome Card */}
        {user && (
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 to-blue-600/30 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 hover:bg-white/20 transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2" style={{ lineHeight: '1.5' }}>
                    Xin chào, {user.name}!
                  </h3>
                  <p className="text-blue-100 text-lg font-medium" style={{ lineHeight: '1.5' }}>
                    Vai trò: {user.role === 'admin' ? 'Quản trị viên' : 
                             user.role === 'sinh-vien' ? 'Sinh viên' :
                             user.role === 'giang-vien' ? 'Giảng viên' : 
                             user.role === 'doanh-nghiep' ? 'Doanh nghiệp' : user.role}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guide Section - Only Navigation */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6" style={{ lineHeight: '1.5' }}>Hướng dẫn sử dụng</h2>
            <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto" style={{ lineHeight: '1.5' }}>Tìm hiểu cách sử dụng hệ thống một cách hiệu quả</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Student Guide */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-orange-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4" style={{ lineHeight: '1.5' }}>Hướng dẫn Sinh viên</h3>
                  <p className="text-blue-100 mb-6 flex-grow" style={{ lineHeight: '1.5' }}>
                    Hướng dẫn chi tiết cho sinh viên về cách đăng ký, thực hiện và báo cáo thực tập.
                  </p>
                  <button
                    onClick={() => openGuide('student')}
                    className="inline-flex items-center text-orange-300 hover:text-orange-200 font-semibold transition-colors group mt-auto"
                  >
                    Xem hướng dẫn
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Teacher Guide */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 to-blue-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <BookOpen className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4" style={{ lineHeight: '1.5' }}>Hướng dẫn Giảng viên</h3>
                  <p className="text-blue-100 mb-6 flex-grow" style={{ lineHeight: '1.5' }}>
                    Hướng dẫn cho giảng viên về quản lý, hướng dẫn và đánh giá sinh viên thực tập.
                  </p>
                  <button
                    onClick={() => openGuide('teacher')}
                    className="inline-flex items-center text-orange-300 hover:text-orange-200 font-semibold transition-colors group mt-auto"
                  >
                    Xem hướng dẫn
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            {/* Company Guide */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-orange-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4" style={{ lineHeight: '1.5' }}>Hướng dẫn Doanh nghiệp</h3>
                  <p className="text-blue-100 mb-6 flex-grow" style={{ lineHeight: '1.5' }}>
                    Hướng dẫn cho doanh nghiệp về tiếp nhận và quản lý sinh viên thực tập.
                  </p>
                  <button
                    onClick={() => openGuide('company')}
                    className="inline-flex items-center text-orange-300 hover:text-orange-200 font-semibold transition-colors group mt-auto"
                  >
                    Xem hướng dẫn
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto">
            <p className="text-blue-100 font-medium mb-2" style={{ lineHeight: '1.5' }}>
              © 2025 Khoa Công nghệ Thông tin - Đại học Đại Nam
            </p>
            <p className="text-blue-200 text-sm" style={{ lineHeight: '1.5' }}>
              Hệ thống quản lý thực tập hiện đại và chuyên nghiệp
            </p>
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      <GuideModal 
        isOpen={guideModal.isOpen}
        onClose={closeGuide}
        guideType={guideModal.type}
      />
    </div>
  );
};

// Main HomePage component
const HomePage: React.FC = () => {
  const { user } = useAuth();

  // Render admin dashboard for admin users
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }

  // Render company dashboard for enterprise users
  if (user?.role === 'doanh-nghiep') {
    return <CompanyDashboard />;
  }

  // Render teacher-specific content via a nested component so hooks only run for teachers
  if (user?.role === 'giang-vien') {
    return <TeacherHomeLoader />;
  }

  // Render student-specific homepage
  if (user?.role === 'sinh-vien') {
    return <StudentHomePage />;
  }

  // Default homepage for other roles
  return <DefaultHomePage />;
};

export default HomePage;

// Separate loader component to safely use teacher-only hooks
const TeacherHomeLoader: React.FC = () => {
  const { teacherInfo, loading: teacherLoading, error: teacherError } = useTeacherInfo();
  const { dashboardStats, loading: statsLoading, error: statsError } = useTeacherDashboard();

  if (teacherLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (teacherError || statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            Có lỗi xảy ra: {teacherError || statsError}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (teacherInfo && dashboardStats) {
    return <TeacherHomePage teacherInfo={teacherInfo} dashboardStats={dashboardStats} />;
  }

  // Fallback (should be rare): show a minimal placeholder
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <p className="text-gray-600">Không có dữ liệu hiển thị.</p>
    </div>
  );
};