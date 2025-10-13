import React from 'react';
import { Users, GraduationCap, Building2, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { useDashboardStats } from '../hooks/useDashboardStats';

const AdminStatsPage: React.FC = () => {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-primary-800 to-primary-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Đang tải thống kê...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-primary-800 to-primary-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-400 mb-4">Có lỗi xảy ra: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section với thống kê */}
      <div className="relative bg-gradient-to-br from-blue-900 via-primary-800 to-primary-900 text-white overflow-hidden" style={{background: 'linear-gradient(135deg, #213f99 0%, #1a3280 50%, #12204d 100%)'}}>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-bounce delay-1000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Bảng điều khiển Quản trị viên
            </h1>
            <p className="text-blue-100 text-lg">
              Hệ thống Quản lý Thực tập - Khoa CNTT
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-orange-500 to-blue-400 mx-auto rounded-full mt-4"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Sinh viên */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="text-emerald-400 text-sm font-semibold flex items-center bg-emerald-400/20 px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stats?.assignmentRate || 0}%
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{stats?.totalStudents || 0}</div>
                <div className="text-blue-100 font-medium">Sinh viên</div>
                <div className="text-sm text-blue-200">
                  {stats?.assignedStudents || 0} đã được phân công
                </div>
              </div>
            </div>

            {/* Giảng viên */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div className="text-blue-400 text-sm font-semibold flex items-center bg-blue-400/20 px-3 py-1 rounded-full">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Hoạt động
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{stats?.totalTeachers || 0}</div>
                <div className="text-blue-100 font-medium">Giảng viên</div>
                <div className="text-sm text-blue-200">
                  Hướng dẫn thực tập
                </div>
              </div>
            </div>

            {/* Doanh nghiệp */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div className="text-purple-400 text-sm font-semibold flex items-center bg-purple-400/20 px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Hợp tác
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{stats?.totalCompanies || 0}</div>
                <div className="text-blue-100 font-medium">Doanh nghiệp</div>
                <div className="text-sm text-blue-200">
                  Đối tác thực tập
                </div>
              </div>
            </div>

            {/* Đợt thực tập */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="text-green-400 text-sm font-semibold flex items-center bg-green-400/20 px-3 py-1 rounded-full">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Đang chạy
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-white">{stats?.activeBatches || 0}</div>
                <div className="text-blue-100 font-medium">Thực tập</div>
                <div className="text-sm text-blue-200">
                  Đợt đang diễn ra
                </div>
              </div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Nguyện vọng */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Phân bố nguyện vọng</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Khoa giới thiệu</span>
                  <span className="text-white font-bold">{stats?.khoaIntroStudents || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Tự liên hệ</span>
                  <span className="text-white font-bold">{stats?.selfContactStudents || 0}</span>
                </div>
              </div>
            </div>

            {/* Tỷ lệ hoàn thành */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-6">Tỷ lệ phân công</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Đã phân công</span>
                  <span className="text-white font-bold">{stats?.assignmentRate || 0}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stats?.assignmentRate || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsPage;