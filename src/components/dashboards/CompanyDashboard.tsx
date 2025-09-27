import React from 'react';
import { Users, Briefcase, FileText, Star, TrendingUp, Eye } from 'lucide-react';

const CompanyDashboard: React.FC = () => {
  // Mock company data
  const companyInfo = {
    tenDN: 'Công ty ABC Technology',
    nguoiLienHe: 'Nguyễn Văn Manager',
    email: 'manager@abc-tech.com'
  };

  const jobPostings = [
    {
      id: '1',
      tieuDe: 'Thực tập sinh Frontend Developer',
      soLuong: 3,
      ungVien: 12,
      trangThai: 'mo' as const,
      ngayTao: '2025-09-15'
    },
    {
      id: '2',
      tieuDe: 'Thực tập sinh Backend Developer',
      soLuong: 2,
      ungVien: 8,
      trangThai: 'mo' as const,
      ngayTao: '2025-09-10'
    },
    {
      id: '3',
      tieuDe: 'Thực tập sinh Mobile Developer',
      soLuong: 1,
      ungVien: 5,
      trangThai: 'dong' as const,
      ngayTao: '2025-09-01'
    }
  ];

  const currentInterns = [
    {
      id: '1',
      hoTen: 'Nguyễn Văn A',
      viTri: 'Frontend Developer',
      tienDo: 75,
      danhGia: 4,
      ngayBatDau: '2025-09-01'
    },
    {
      id: '2',
      hoTen: 'Trần Thị B',
      viTri: 'Backend Developer',
      tienDo: 60,
      danhGia: 5,
      ngayBatDau: '2025-09-01'
    }
  ];

  const recentApplications = [
    { id: '1', sinhVien: 'Lê Văn C', viTri: 'Frontend Developer', ngayUngTuyen: '2025-09-25', trangThai: 'cho-duyet' },
    { id: '2', sinhVien: 'Phạm Thị D', viTri: 'Backend Developer', ngayUngTuyen: '2025-09-24', trangThai: 'cho-duyet' },
    { id: '3', sinhVien: 'Hoàng Văn E', viTri: 'Mobile Developer', ngayUngTuyen: '2025-09-23', trangThai: 'duyet' },
  ];

  const stats = [
    { title: 'Tin tuyển dụng', value: jobPostings.length, icon: Briefcase, color: 'bg-blue-500' },
    { title: 'Sinh viên thực tập', value: currentInterns.length, icon: Users, color: 'bg-green-500' },
    { title: 'Ứng viên mới', value: recentApplications.filter(app => app.trangThai === 'cho-duyet').length, icon: FileText, color: 'bg-orange-500' },
    { title: 'Đánh giá TB', value: '4.3', icon: Star, color: 'bg-purple-500' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mo': return 'bg-green-100 text-green-800';
      case 'dong': return 'bg-red-100 text-red-800';
      case 'duyet': return 'bg-green-100 text-green-800';
      case 'cho-duyet': return 'bg-yellow-100 text-yellow-800';
      case 'tu-choi': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'mo': return 'Đang mở';
      case 'dong': return 'Đã đóng';
      case 'duyet': return 'Đã duyệt';
      case 'cho-duyet': return 'Chờ duyệt';
      case 'tu-choi': return 'Từ chối';
      default: return status;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Chào mừng, {companyInfo.tenDN}!</h1>
        <p className="text-purple-100">Người liên hệ: {companyInfo.nguoiLienHe} | {companyInfo.email}</p>
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
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Postings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Briefcase className="w-6 h-6 mr-2 text-blue-600" />
              Tin tuyển dụng
            </h2>
            <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
              Đăng tin mới
            </button>
          </div>
          <div className="space-y-4">
            {jobPostings.map((job) => (
              <div key={job.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{job.tieuDe}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.trangThai)}`}>
                    {getStatusText(job.trangThai)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    <span>Số lượng: {job.soLuong}</span>
                    <span className="mx-2">•</span>
                    <span>Ứng viên: {job.ungVien}</span>
                  </div>
                  <span>{new Date(job.ngayTao).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="mt-2 flex justify-end">
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Interns */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-green-600" />
            Sinh viên thực tập
          </h2>
          <div className="space-y-4">
            {currentInterns.map((intern) => (
              <div key={intern.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{intern.hoTen}</h3>
                    <p className="text-sm text-gray-600">{intern.viTri}</p>
                  </div>
                  <div className="flex items-center">
                    {renderStars(intern.danhGia)}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Tiến độ</span>
                    <span>{intern.tienDo}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${intern.tienDo}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Bắt đầu: {new Date(intern.ngayBatDau).toLocaleDateString('vi-VN')}</span>
                  <button className="text-blue-600 hover:text-blue-800">
                    Đánh giá
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-orange-600" />
          Đơn ứng tuyển gần đây
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày ứng tuyển
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentApplications.map((application) => (
                <tr key={application.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {application.sinhVien}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.viTri}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.ngayUngTuyen).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.trangThai)}`}>
                      {getStatusText(application.trangThai)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Xem CV
                    </button>
                    {application.trangThai === 'cho-duyet' && (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-3">
                          Duyệt
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          Từ chối
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Briefcase className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-medium text-gray-900">Đăng tin tuyển dụng</h3>
            <p className="text-sm text-gray-600">Tạo tin tuyển dụng mới</p>
          </button>
          <button className="p-4 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Users className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-medium text-gray-900">Quản lý thực tập sinh</h3>
            <p className="text-sm text-gray-600">Theo dõi và đánh giá</p>
          </button>
          <button className="p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <TrendingUp className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-medium text-gray-900">Thống kê</h3>
            <p className="text-sm text-gray-600">Xem báo cáo hiệu quả</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;