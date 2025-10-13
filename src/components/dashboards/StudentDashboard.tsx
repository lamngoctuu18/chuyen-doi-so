import React from 'react';
import { BookOpen, Calendar, FileText, Award, AlertCircle, CheckCircle } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  // Mock student data
  const studentInfo = {
    maSV: 'SV001',
    hoTen: 'Nguyễn Văn A',
    lop: 'CNTT2021A',
    trangThaiThucTap: 'dang-thuc-tap' as const
  };

  const internshipProgress = {
    doanhNghiep: 'Công ty ABC Technology',
    giangVienHuongDan: 'TS. Trần Thị B',
    thoiGianBatDau: '2025-09-01',
    thoiGianKetThuc: '2025-12-15',
    tienDo: 60 // percentage
  };

  const weeklyReports = [
    { tuan: 1, trangThai: 'da-duyet', diem: 8.5, ngayNop: '2025-09-08' },
    { tuan: 2, trangThai: 'da-duyet', diem: 9.0, ngayNop: '2025-09-15' },
    { tuan: 3, trangThai: 'da-nop', diem: null, ngayNop: '2025-09-22' },
    { tuan: 4, trangThai: 'chua-nop', diem: null, ngayNop: null },
  ];

  const upcomingTasks = [
    { id: 1, task: 'Nộp báo cáo tuần 4', deadline: '2025-09-29', priority: 'high' },
    { id: 2, task: 'Hoàn thành module đăng nhập', deadline: '2025-10-01', priority: 'medium' },
    { id: 3, task: 'Tham gia buổi review code', deadline: '2025-10-03', priority: 'low' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'da-duyet': return 'text-green-600 bg-green-100';
      case 'da-nop': return 'text-yellow-600 bg-yellow-100';
      case 'chua-nop': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'da-duyet': return 'Đã duyệt';
      case 'da-nop': return 'Đã nộp';
      case 'chua-nop': return 'Chưa nộp';
      default: return 'Không xác định';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header - Màu Đại Nam */}
      <div className="rounded-lg p-6 text-white" style={{background: 'linear-gradient(135deg, #213f99 0%, #f37320 100%)'}}>
        <h1 className="text-3xl font-bold mb-2">Chào mừng, {studentInfo.hoTen}!</h1>
        <p className="text-white/90">Mã sinh viên: {studentInfo.maSV} | Lớp: {studentInfo.lop}</p>
      </div>

      {/* Internship Status */}
      {studentInfo.trangThaiThucTap === 'dang-thuc-tap' ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
            Thông tin thực tập
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Doanh nghiệp:</label>
                  <p className="text-gray-900">{internshipProgress.doanhNghiep}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Giảng viên hướng dẫn:</label>
                  <p className="text-gray-900">{internshipProgress.giangVienHuongDan}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Thời gian:</label>
                  <p className="text-gray-900">
                    {new Date(internshipProgress.thoiGianBatDau).toLocaleDateString('vi-VN')} - {' '}
                    {new Date(internshipProgress.thoiGianKetThuc).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Tiến độ thực tập:</label>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${internshipProgress.tienDo}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{internshipProgress.tienDo}% hoàn thành</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-yellow-800">Chưa có thông tin thực tập</h3>
              <p className="text-yellow-700">Bạn chưa đăng ký hoặc được phân công thực tập.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Reports */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-green-600" />
            Báo cáo hàng tuần
          </h2>
          <div className="space-y-3">
            {weeklyReports.map((report) => (
              <div key={report.tuan} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="font-medium text-gray-900">Tuần {report.tuan}</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.trangThai)}`}>
                    {getStatusText(report.trangThai)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {report.diem && (
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{report.diem}</span>
                    </div>
                  )}
                  {report.ngayNop && (
                    <span className="text-sm text-gray-600">
                      {new Date(report.ngayNop).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            Nộp báo cáo mới
          </button>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-purple-600" />
            Nhiệm vụ sắp tới
          </h2>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className={`p-4 border-l-4 bg-gray-50 rounded-r-lg ${getPriorityColor(task.priority)}`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{task.task}</h3>
                  <CheckCircle className="w-5 h-5 text-gray-400 hover:text-green-500 cursor-pointer" />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Deadline: {new Date(task.deadline).toLocaleDateString('vi-VN')}
                </p>
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
            <FileText className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Nộp báo cáo</h3>
            <p className="text-sm text-gray-600">Nộp báo cáo hàng tuần</p>
          </button>
          <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <BookOpen className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Xem công việc</h3>
            <p className="text-sm text-gray-600">Theo dõi tiến độ công việc</p>
          </button>
          <button className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Calendar className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">Lịch họp</h3>
            <p className="text-sm text-gray-600">Xem lịch họp với GV</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;