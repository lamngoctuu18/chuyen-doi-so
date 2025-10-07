import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Building2, GraduationCap, Briefcase, 
  Settings, BarChart3, ArrowRight, Import
} from 'lucide-react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import daiNamLogo from '../../assets/fitdnu_logo.png';

const AdminDashboard: React.FC = () => {
  const { stats } = useDashboardStats();

  // Default stats for loading/error states
  const defaultStats = {
    totalSinhVien: 150,
    totalInterns: 120,
    totalDoanhNghiep: 80,
    totalGiangVien: 25
  };

  const currentStats = stats || defaultStats;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 -left-4 w-96 h-96 bg-orange-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-10 -right-4 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-orange-600/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        
        {/* Geometric Pattern */}  
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-20">
          {/* Logo */}
          <div className="mx-auto w-32 h-32 mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:rotate-3"></div>
            <div className="relative w-full h-full bg-white rounded-3xl shadow-xl p-4 flex items-center justify-center">
              <img 
                src={daiNamLogo} 
                alt="Đại học Đại Nam" 
                className="w-20 h-20 object-contain"
              />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-orange-100 to-blue-100 bg-clip-text text-transparent mb-12 animate-fade-in px-4" style={{ lineHeight: '1.5' }}>
            Bảng điều khiển Quản trị viên
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 font-semibold mb-8 px-4 mt-8" style={{ lineHeight: '1.5' }}>
            Hệ thống Quản lý Thực tập - Khoa CNTT
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-blue-400 mx-auto rounded-full mb-4"></div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{currentStats.totalSinhVien}</div>
            <div className="text-blue-100 font-medium">Sinh viên</div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{currentStats.totalGiangVien}</div>
            <div className="text-blue-100 font-medium">Giảng viên</div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{currentStats.totalDoanhNghiep}</div>
            <div className="text-blue-100 font-medium">Doanh nghiệp</div>
          </div>
          
          <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 hover:bg-white/20 transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Briefcase className="h-8 w-8 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-2">{currentStats.totalInterns}</div>
            <div className="text-blue-100 font-medium">Thực tập</div>
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
            {/* Reports */}
            <div className="group">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:scale-105 h-full flex flex-col">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                    <BarChart3 className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4" style={{ lineHeight: '1.5' }}>Báo cáo & Thống kê</h3>
                  <p className="text-blue-100 mb-6 flex-grow" style={{ lineHeight: '1.5' }}>
                    Xem báo cáo tổng hợp và thống kê hệ thống.
                  </p>
                  <Link 
                    to="/admin/reports"
                    className="inline-flex items-center text-orange-300 hover:text-orange-200 font-semibold transition-colors group mt-auto"
                  >
                    Xem báo cáo
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