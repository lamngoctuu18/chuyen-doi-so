import React from 'react';
import { 
  GraduationCap, Building2, Calendar, 
  BookOpen, Award, Clock, 
  Bell, Star, ArrowRight, FileText,
  MapPin, Users, Target, Briefcase,
  CheckCircle, AlertCircle, Plus, MessageCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { Link } from 'react-router-dom';

// Note: StudentStatsCard component removed as we're using inline enhanced cards

// Quick Actions dành cho sinh viên
const StudentQuickActions: React.FC = () => {
  const quickActions = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Đăng ký thực tập",
      subtitle: "Đăng ký vị trí thực tập mới",
      color: "bg-blue-500 text-white",
      hoverColor: "hover:bg-blue-600",
      link: "/internship-registration"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Nộp báo cáo",
      subtitle: "Gửi báo cáo thực tập",
      color: "bg-green-500 text-white",
      hoverColor: "hover:bg-green-600",
      link: "/student/submissions"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Lịch thực tập",
      subtitle: "Xem lịch trình thực tập",
      color: "bg-purple-500 text-white",
      hoverColor: "hover:bg-purple-600",
      link: "/schedule"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Liên hệ GV",
      subtitle: "Liên hệ giảng viên hướng dẫn",
      color: "bg-orange-500 text-white",
      hoverColor: "hover:bg-orange-600",
      link: "/contact-teacher"
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Star className="h-5 w-5 mr-2 text-yellow-500" />
        Thao tác nhanh
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`flex items-center p-4 rounded-lg ${action.color} ${action.hoverColor} transition-all duration-200 group shadow-sm hover:shadow-md transform hover:-translate-y-1`}
          >
            <div className="group-hover:scale-110 transition-transform">
              {action.icon}
            </div>
            <div className="ml-3 text-left">
              <p className="font-medium">{action.title}</p>
              <p className="text-xs opacity-90">{action.subtitle}</p>
            </div>
            <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
};

// Progress Timeline cho sinh viên
const InternshipProgress: React.FC<{ progressSteps?: any[] }> = ({ progressSteps = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Target className="h-5 w-5 mr-2 text-blue-600" />
        Tiến trình thực tập
      </h3>
      
      <div className="space-y-4">
        {progressSteps.map((step, index) => (
          <div key={index} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.status === 'completed' 
                  ? 'bg-green-100 text-green-600' 
                  : step.status === 'current'
                  ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-50'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {step.status === 'completed' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : step.status === 'current' ? (
                  <Clock className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
              </div>
              {index < progressSteps.length - 1 && (
                <div className={`w-0.5 h-12 mt-2 ${
                  step.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'
                }`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${
                step.status === 'current' ? 'text-blue-600' : 'text-gray-900'
              }`}>
                {step.title}
              </p>
              <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              <p className="text-xs text-gray-400 mt-1">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Thông tin doanh nghiệp thực tập
const CompanyInfo: React.FC<{ companyInfo?: any }> = ({ companyInfo }) => {
  if (!companyInfo) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Building2 className="h-5 w-5 mr-2 text-purple-600" />
          Thông tin thực tập
        </h3>
        <div className="text-center py-8 text-gray-500">
          <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Chưa có thông tin thực tập</p>
          <Link 
            to="/internship-registration"
            className="inline-flex items-center mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Đăng ký thực tập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Building2 className="h-5 w-5 mr-2 text-purple-600" />
        Thông tin thực tập
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <Building2 className="h-10 w-10 text-blue-600 mr-4 mt-1" />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{companyInfo.name}</h4>
            <p className="text-sm text-gray-600 mt-1">Vị trí: {companyInfo.position}</p>
            <div className="flex items-center mt-2 text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{companyInfo.address}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Giảng viên HD:</span>
            <span className="font-medium">{companyInfo.supervisor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mentor:</span>
            <span className="font-medium">{companyInfo.mentor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Thời gian:</span>
            <span className="font-medium">{companyInfo.duration}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Bắt đầu:</span>
            <span className="font-medium">{companyInfo.startDate}</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tiến độ hoàn thành:</span>
            <span className="text-sm font-medium text-blue-600">{companyInfo.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${companyInfo.progress}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notifications và reminders
const NotificationsPanel: React.FC<{ notifications?: any[] }> = ({ notifications = [] }) => {
  const typeIcons = {
    warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
    info: <Bell className="h-4 w-4 text-blue-500" />,
    success: <CheckCircle className="h-4 w-4 text-green-500" />
  };

  const typeColors = {
    warning: "bg-yellow-50 border-yellow-200",
    info: "bg-blue-50 border-blue-200", 
    success: "bg-green-50 border-green-200"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <Bell className="h-5 w-5 mr-2 text-red-500" />
        Thông báo
      </h3>
      
      <div className="space-y-3">
        {notifications.map((notification, index) => {
          const notificationType = notification.type as 'warning' | 'info' | 'success';
          return (
            <div key={index} className={`p-3 rounded-lg border ${typeColors[notificationType]} transition-colors hover:shadow-sm`}>
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  {typeIcons[notificationType]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notification.time || new Date(notification.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
          Xem tất cả thông báo
          <ArrowRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

// Main Student Homepage Component
const StudentHomePage: React.FC = () => {
  const { user } = useAuth();
  const { dashboardStats, loading, error } = useStudentDashboard();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            Có lỗi xảy ra: {error}
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

  // Determine status display
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'not-registered':
        return { text: 'Chưa đăng ký', color: 'bg-gray-500', statusType: 'default' as const };
      case 'registered':
        return { text: 'Đã đăng ký', color: 'bg-blue-500', statusType: 'info' as const };
      case 'in-progress':
        return { text: 'Đang thực tập', color: 'bg-green-500', statusType: 'success' as const };
      case 'completed':
        return { text: 'Hoàn thành', color: 'bg-purple-500', statusType: 'success' as const };
      default:
        return { text: 'Chưa xác định', color: 'bg-gray-500', statusType: 'default' as const };
    }
  };

  const statusInfo = getStatusInfo(dashboardStats?.internshipStatus || 'not-registered');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-32 w-12 h-12 bg-white bg-opacity-10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl hover:scale-105 transition-transform duration-300">
              <GraduationCap className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Chào mừng, <span className="text-yellow-300">{user?.name || 'Bạn'}!</span>
              </h1>
              <p className="text-blue-100 mt-2 text-lg">
                Mã sinh viên: <span className="font-semibold text-white">{user?.userId || 'SV001'}</span> | Khoa Công nghệ Thông tin
              </p>
              <div className="flex items-center mt-3 text-blue-100">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-medium">Học kỳ I - Năm học 2024-2025</span>
              </div>
              
              {/* Quick Status */}
              <div className="mt-4 flex items-center space-x-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm text-blue-100">Trạng thái</p>
                  <p className="font-semibold text-green-300">{statusInfo.text}</p>
                </div>
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm text-blue-100">Tiến độ</p>
                  <p className="font-semibold text-yellow-300">
                    {dashboardStats?.reportsSubmitted || 0}/{dashboardStats?.totalReports || 5} báo cáo
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6 relative z-10">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group bg-gradient-to-br from-white to-blue-50">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-4 rounded-xl ${statusInfo.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div className="text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-green-100 px-2 py-1 rounded-full text-xs">Tốt</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{statusInfo.text}</p>
              <p className="text-sm font-medium text-gray-700">Trạng thái thực tập</p>
              <p className="text-xs text-gray-500">Trạng thái hiện tại</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group bg-gradient-to-br from-white to-green-50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div className="text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-blue-100 px-2 py-1 rounded-full text-xs">Tiến độ</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {dashboardStats?.reportsSubmitted || 0}/{dashboardStats?.totalReports || 5}
              </p>
              <p className="text-sm font-medium text-gray-700">Báo cáo đã nộp</p>
              <p className="text-xs text-gray-500">Báo cáo thực tập</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group bg-gradient-to-br from-white to-purple-50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="text-purple-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-purple-100 px-2 py-1 rounded-full text-xs">Xuất sắc</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                {dashboardStats?.averageScore || "8.5"}
              </p>
              <p className="text-sm font-medium text-gray-700">Điểm đánh giá</p>
              <p className="text-xs text-gray-500">Điểm trung bình</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group bg-gradient-to-br from-white to-orange-50">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-orange-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="bg-orange-100 px-2 py-1 rounded-full text-xs">Còn lại</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                {dashboardStats?.daysRemaining || "65"}
              </p>
              <p className="text-sm font-medium text-gray-700">Ngày còn lại</p>
              <p className="text-xs text-gray-500">Ngày thực tập</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <StudentQuickActions />
            
            {/* Company Info */}
            <CompanyInfo companyInfo={dashboardStats?.companyInfo} />
            
            {/* Progress Timeline */}
            <InternshipProgress progressSteps={dashboardStats?.progressSteps} />
          </div>
          
          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Notifications */}
            <NotificationsPanel notifications={dashboardStats?.notifications} />
            
            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-indigo-600" />
                Liên kết hữu ích
              </h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium">Hướng dẫn thực tập</span>
                </a>
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium">Mẫu báo cáo</span>
                </a>
                <a href="#" className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <MessageCircle className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium">Hỗ trợ kỹ thuật</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHomePage;