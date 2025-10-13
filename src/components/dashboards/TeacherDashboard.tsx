import React from 'react';
import { Users, FileCheck, MessageSquare, Calendar, BookOpen } from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  // Mock teacher data
  const teacherInfo = {
    maGV: 'GV001',
    hoTen: 'TS. Trần Thị B',
    chuyenMon: 'Công nghệ phần mềm'
  };

  const guidedStudents = [
    { 
      id: '1', 
      maSV: 'SV001', 
      hoTen: 'Nguyễn Văn A', 
      doanhNghiep: 'Công ty ABC',
      tienDo: 75,
      baoCAoCuoi: 'chua-nop' 
    },
    { 
      id: '2', 
      maSV: 'SV002', 
      hoTen: 'Trần Thị C', 
      doanhNghiep: 'Công ty XYZ',
      tienDo: 60,
      baoCAoCuoi: 'da-nop' 
    },
    { 
      id: '3', 
      maSV: 'SV003', 
      hoTen: 'Lê Văn D', 
      doanhNghiep: 'Startup DEF',
      tienDo: 40,
      baoCAoCuoi: 'chua-nop' 
    }
  ];

  const pendingReports = [
    { id: '1', sinhVien: 'Nguyễn Văn A', tuan: 3, ngayNop: '2025-09-22', type: 'weekly' },
    { id: '2', sinhVien: 'Trần Thị C', tuan: 2, ngayNop: '2025-09-20', type: 'weekly' },
    { id: '3', sinhVien: 'Lê Văn D', tuan: 0, ngayNop: '2025-09-25', type: 'final' },
  ];

  const upcomingMeetings = [
    { id: 1, sinhVien: 'Nguyễn Văn A', ngay: '2025-09-30', gio: '14:00', diaDiem: 'Phòng 301' },
    { id: 2, sinhVien: 'Trần Thị C', ngay: '2025-10-02', gio: '10:00', diaDiem: 'Online' },
  ];

  // Statistics cards removed per request

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getReportTypeText = (type: string, tuan: number) => {
    return type === 'final' ? 'Báo cáo cuối' : `Báo cáo tuần ${tuan}`;
  };

  return (
    <div className="space-y-6">
      {/* Header - Màu Đại Nam */}
      <div className="rounded-lg p-6 text-white" style={{background: 'linear-gradient(135deg, #213f99 0%, #f37320 100%)'}}>
        <h1 className="text-3xl font-bold mb-2">Chào mừng, {teacherInfo.hoTen}!</h1>
        <p className="text-white/90">Mã giảng viên: {teacherInfo.maGV} | Chuyên môn: {teacherInfo.chuyenMon}</p>
      </div>

      {/* Statistics Cards removed */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guided Students */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Sinh viên hướng dẫn
          </h2>
          <div className="space-y-4">
            {guidedStudents.map((student) => (
              <div key={student.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{student.hoTen}</h3>
                    <p className="text-sm text-gray-600">{student.maSV} - {student.doanhNghiep}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{student.tienDo}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(student.tienDo)}`}
                    style={{ width: `${student.tienDo}%` }}
                  ></div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    student.baoCAoCuoi === 'da-nop' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.baoCAoCuoi === 'da-nop' ? 'Đã nộp báo cáo cuối' : 'Chưa nộp báo cáo cuối'}
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileCheck className="w-6 h-6 mr-2 text-orange-600" />
            Báo cáo chờ duyệt
          </h2>
          <div className="space-y-3">
            {pendingReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <h3 className="font-medium text-gray-900">{report.sinhVien}</h3>
                  <p className="text-sm text-gray-600">
                    {getReportTypeText(report.type, report.tuan)} - {new Date(report.ngayNop).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <button className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors">
                  Chấm điểm
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Meetings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-green-600" />
          Lịch họp sắp tới
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upcomingMeetings.map((meeting) => (
            <div key={meeting.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{meeting.sinhVien}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(meeting.ngay).toLocaleDateString('vi-VN')} - {meeting.gio}
                  </p>
                  <p className="text-sm text-gray-600">Địa điểm: {meeting.diaDiem}</p>
                </div>
                <MessageSquare className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <FileCheck className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Chấm báo cáo</h3>
            <p className="text-sm text-gray-600">Duyệt và chấm điểm báo cáo</p>
          </button>
          <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Users className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Quản lý sinh viên</h3>
            <p className="text-sm text-gray-600">Theo dõi tiến độ sinh viên</p>
          </button>
          <button className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">Lập lịch họp</h3>
            <p className="text-sm text-gray-600">Tạo cuộc họp với sinh viên</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;