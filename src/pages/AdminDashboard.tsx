import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building2, GraduationCap, Briefcase, 
  Settings, BarChart3, ArrowRight, Import,
  Clock, Bell, TrendingUp, Calendar
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useDashboardStats } from '../hooks/useDashboardStats';
import daiNamLogo from '../assets/fitdnu_logo.png';
import backgroundDaiNam from '../assets/backgrounddainam.jpg';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading } = useDashboardStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  // Default stats for error states or when data is not available
  const defaultStats = {
    totalStudents: 0,
    totalTeachers: 0,
    totalCompanies: 0,
    activeBatches: 0
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundDaiNam})`,
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(33, 63, 153, 0.85) 0%, rgba(33, 63, 153, 0.80) 50%, rgba(243, 115, 32, 0.85) 100%)'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-20">
          {/* Logo */}
          <div className="mx-auto w-28 h-28 mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"></div>
            <div className="relative w-full h-full bg-white rounded-full shadow-xl p-1.5 flex items-center justify-center">
              <img 
                src={daiNamLogo} 
                alt="Đại học Đại Nam" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-orange-100 to-blue-100 bg-clip-text text-transparent mb-4 animate-fade-in px-4" style={{ lineHeight: '1.5' }}>
              Chào mừng, {user?.name || 'Admin'}!
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 font-semibold mb-4 px-4" style={{ lineHeight: '1.5' }}>
              Bảng điều khiển Quản trị viên
            </p>
            <p className="text-base sm:text-lg text-orange-200 font-medium px-4" style={{ lineHeight: '1.5' }}>
              Hệ thống Quản lý Thực tập - Khoa Công nghệ Thông tin
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-blue-400 mx-auto rounded-full mt-6"></div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{currentStats.totalStudents}</div>
            <div className="text-blue-100 font-medium">Sinh viên</div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{currentStats.totalTeachers}</div>
            <div className="text-blue-100 font-medium">Giảng viên</div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{currentStats.totalCompanies}</div>
            <div className="text-blue-100 font-medium">Doanh nghiệp</div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{currentStats.activeBatches}</div>
            <div className="text-blue-100 font-medium">Đợt thực tập</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6" style={{ lineHeight: '1.5' }}>Quản lý hệ thống</h2>
            <p className="text-blue-100 text-base sm:text-lg max-w-2xl mx-auto" style={{ lineHeight: '1.5' }}>Truy cập nhanh các chức năng quản lý chính</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
            {/* Student Management */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4" style={{ lineHeight: '1.5' }}>Quản lý Sinh viên</h3>
                  <p className="text-blue-100 mb-6 flex-grow" style={{ lineHeight: '1.5' }}>
                    Xem, thêm, sửa thông tin sinh viên và theo dõi tiến độ thực tập.
                  </p>
                  <Link 
                    to="/students"
                    className="inline-flex items-center text-orange-300 hover:text-orange-200 font-semibold transition-colors group mt-auto"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Teacher Management */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 to-red-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <GraduationCap className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4" style={{ lineHeight: '1.5' }}>Quản lý Giảng viên</h3>
                  <p className="text-blue-100 mb-6 flex-grow" style={{ lineHeight: '1.5' }}>
                    Quản lý thông tin giảng viên và phân công hướng dẫn.
                  </p>
                  <Link 
                    to="/teachers"
                    className="inline-flex items-center text-orange-300 hover:text-orange-200 font-semibold transition-colors group mt-auto"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Company Management */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Building2 className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4" style={{ lineHeight: '1.5' }}>Quản lý Doanh nghiệp</h3>
                  <p className="text-blue-100 mb-6 flex-grow" style={{ lineHeight: '1.5' }}>
                    Quản lý thông tin doanh nghiệp đối tác và vị trí thực tập.
                  </p>
                  <Link 
                    to="/companies"
                    className="inline-flex items-center text-orange-300 hover:text-orange-200 font-semibold transition-colors group mt-auto"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Internship Management */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Briefcase className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4" style={{ lineHeight: '1.5' }}>Quản lý Thực tập</h3>
                  <p className="text-blue-100 mb-6 flex-grow" style={{ lineHeight: '1.5' }}>
                    Theo dõi và quản lý các đợt thực tập, đăng ký.
                  </p>
                  <Link 
                    to="/internships"
                    className="inline-flex items-center text-orange-300 hover:text-orange-200 font-semibold transition-colors group mt-auto"
                  >
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Tools */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Statistics & Reports */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <BarChart3 className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4" style={{ lineHeight: '1.5' }}>Thống kê chi tiết</h3>
                  <p className="text-blue-100 mb-6 flex-grow" style={{ lineHeight: '1.5' }}>
                    Xem thống kê chi tiết và bảng điều khiển phân tích dữ liệu.
                  </p>
                  <Link 
                    to="/admin/stats"
                    className="inline-flex items-center text-orange-300 hover:text-orange-200 font-semibold transition-colors group mt-auto"
                  >
                    Xem thống kê
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Import Tools */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600/30 to-yellow-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Import className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4" style={{ lineHeight: '1.5' }}>Import Dữ liệu</h3>
                  <p className="text-blue-100 mb-6 flex-grow" style={{ lineHeight: '1.5' }}>
                    Import danh sách tài khoản và sinh viên từ Excel.
                  </p>
                  <Link 
                    to="/import-accounts"
                    className="inline-flex items-center text-orange-300 hover:text-orange-200 font-semibold transition-colors group mt-auto"
                  >
                    Import dữ liệu
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600/30 to-gray-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <Settings className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4" style={{ lineHeight: '1.5' }}>Cài đặt Hệ thống</h3>
                  <p className="text-blue-100 mb-6 flex-grow" style={{ lineHeight: '1.5' }}>
                    Cấu hình và quản lý các thiết lập hệ thống.
                  </p>
                  <button className="inline-flex items-center text-orange-300 hover:text-orange-200 font-semibold transition-colors group mt-auto">
                    Cài đặt
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* System Status */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Trạng thái hệ thống</h3>
                <p className="text-blue-100 font-medium">Tổng quan hoạt động</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-400/30">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">Server</span>
                </div>
                <span className="text-green-300 font-bold">Hoạt động tốt</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-400/30">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">Cơ sở dữ liệu</span>
                </div>
                <span className="text-blue-300 font-bold">Kết nối ổn định</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-2xl border border-orange-400/30">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">Hiệu suất</span>
                </div>
                <span className="text-orange-300 font-bold">Tối ưu</span>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Thông tin nhanh</h3>
                <p className="text-blue-100 font-medium">Cập nhật mới nhất</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-purple-50/10 to-violet-50/10 border border-purple-200/20">
                <div className="flex items-center space-x-3 flex-1">
                  <Calendar className="h-5 w-5 text-purple-300" />
                  <div>
                    <p className="font-bold text-white">Học kỳ hiện tại</p>
                    <p className="text-purple-200 text-sm">Học kỳ 1 - Năm học 2024-2025</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center p-4 rounded-2xl bg-gradient-to-r from-blue-50/10 to-indigo-50/10 border border-blue-200/20">
                <div className="flex items-center space-x-3 flex-1">
                  <Clock className="h-5 w-5 text-blue-300" />
                  <div>
                    <p className="font-bold text-white">Thời gian truy cập</p>
                    <p className="text-blue-200 text-sm">{new Date().toLocaleString('vi-VN')}</p>
                  </div>
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
    </div>
  );
};

export default AdminDashboard;
