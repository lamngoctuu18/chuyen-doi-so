import React from 'react';
import { Users, UserCheck, Building2, FileText, TrendingUp, Calendar } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  // Mock statistics data
  const stats = [
    {
      title: 'Tổng sinh viên',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Đang thực tập',
      value: '456',
      change: '+8%',
      changeType: 'positive',
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      title: 'Doanh nghiệp',
      value: '89',
      change: '+15%',
      changeType: 'positive',
      icon: Building2,
      color: 'bg-purple-500'
    },
    {
      title: 'Báo cáo chờ duyệt',
      value: '23',
      change: '-5%',
      changeType: 'negative',
      icon: FileText,
      color: 'bg-orange-500'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Sinh viên Nguyễn Văn A đã nộp báo cáo tuần 3', time: '2 giờ trước', type: 'report' },
    { id: 2, action: 'Công ty XYZ đã đăng tin tuyển dụng mới', time: '4 giờ trước', type: 'job' },
    { id: 3, action: 'GV. Trần Thị B đã chấm điểm báo cáo', time: '6 giờ trước', type: 'grade' },
    { id: 4, action: 'Sinh viên Lê Văn C đã đăng ký thực tập', time: '1 ngày trước', type: 'register' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Hội thảo việc làm', date: '2025-10-01', type: 'seminar' },
    { id: 2, title: 'Deadline báo cáo giữa kỳ', date: '2025-10-05', type: 'deadline' },
    { id: 3, title: 'Đánh giá doanh nghiệp', date: '2025-10-10', type: 'evaluation' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản trị</h1>
        <div className="text-sm text-gray-500">
          Cập nhật lần cuối: {new Date().toLocaleString('vi-VN')}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-lg p-3 mr-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                }`} />
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Hoạt động gần đây</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sự kiện sắp tới</h2>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Users className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Quản lý sinh viên</h3>
            <p className="text-sm text-gray-600">Thêm, sửa, xóa thông tin sinh viên</p>
          </button>
          <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Building2 className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Quản lý doanh nghiệp</h3>
            <p className="text-sm text-gray-600">Quản lý thông tin đối tác</p>
          </button>
          <button className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <FileText className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">Báo cáo thống kê</h3>
            <p className="text-sm text-gray-600">Xem báo cáo và thống kê</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;