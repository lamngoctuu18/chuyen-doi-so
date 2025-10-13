import React, { useState, useEffect } from 'react';
import { 
  Search, Download, Filter, RefreshCw, CheckCircle, Clock,
  Users, Building2, Award, User, GraduationCap
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { internshipReportsAPI } from '../services/internshipReportsAPI';

// Interface cho dữ liệu sinh viên báo cáo
interface StudentReport {
  id: number;
  maSinhVien: string;
  hoTen: string;
  lop: string;
  email: string | null;
  soDienThoai: string;
  giangVienHuongDan: string;
  doanhNghiepThucTap: string;
  viTriThucTap: string;
  diemGiangVien: number | null;
  trangThaiBaoCao: 'chua-hoan-thanh' | 'da-hoan-thanh';
  ngayBatDauThucTap: string;
  ngayKetThucThucTap: string;
  nhanXetGiangVien?: string;
}

// Interface cho thống kê lớp
interface ClassStats {
  tenLop: string;
  tongSinhVien: number;
  daHoanThanh: number;
  chuaHoanThanh: number;
  tyLeHoanThanh: number;
}

const InternshipReportsManagementPage: React.FC = () => {
  const [students, setStudents] = useState<StudentReport[]>([]);
  const [classStats, setClassStats] = useState<ClassStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const tableRef = React.useRef<HTMLDivElement>(null);

  // Hàm tải dữ liệu từ API thật (theo bộ lọc hiện tại)
  const fetchData = async (className: string, status: string) => {
    setLoading(true);
    try {
      // Gọi đồng thời 2 API: danh sách SV (có lọc) và thống kê lớp
      const [studentsResponse, classStatsResponse] = await Promise.all([
        internshipReportsAPI.getStudentReports(className, status),
        internshipReportsAPI.getClassStats(),
      ]);

      if (studentsResponse.data?.success) {
        setStudents(studentsResponse.data.data || []);
      }
      if (classStatsResponse.data?.success) {
        setClassStats(classStatsResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tải lần đầu
  useEffect(() => {
    fetchData(selectedClass, statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tải lại khi thay đổi bộ lọc lớp / trạng thái
  useEffect(() => {
    fetchData(selectedClass, statusFilter);
  }, [selectedClass, statusFilter]);

  // Filter students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.maSinhVien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.giangVienHuongDan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.doanhNghiepThucTap.toLowerCase().includes(searchTerm.toLowerCase());
    // Lọc tìm kiếm trên client; bộ lọc lớp/trạng thái đã áp dụng ở API
    return matchesSearch;
  });

  // Get unique classes
  const uniqueClasses = Array.from(new Set(classStats.map(s => s.tenLop))).sort();

  // Handle class card click - scroll to table and filter
  const handleClassClick = (className: string) => {
    setSelectedClass(className);
    // Scroll to table smoothly
    setTimeout(() => {
      tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Export to Excel by class
  const handleExportByClass = (className: string) => {
    const classStudents = students.filter(s => s.lop === className);
    
    const worksheetData = classStudents.map(student => ({
      'STT': students.indexOf(student) + 1,
      'Mã SV': student.maSinhVien,
      'Họ và tên': student.hoTen,
      'Lớp': student.lop,
      'Email': student.email,
      'Số điện thoại': student.soDienThoai,
      'Giảng viên hướng dẫn': student.giangVienHuongDan,
      'Doanh nghiệp thực tập': student.doanhNghiepThucTap,
      'Vị trí thực tập': student.viTriThucTap,
      'Ngày bắt đầu': new Date(student.ngayBatDauThucTap).toLocaleDateString('vi-VN'),
      'Ngày kết thúc': new Date(student.ngayKetThucThucTap).toLocaleDateString('vi-VN'),
      'Điểm GV chấm': student.diemGiangVien || 'Chưa chấm',
      'Trạng thái': student.trangThaiBaoCao === 'da-hoan-thanh' ? 'Đã hoàn thành' : 'Chưa hoàn thành',
      'Nhận xét': student.nhanXetGiangVien || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, className);

    // Auto-adjust column widths
    const maxWidth = 50;
    const colWidths = Object.keys(worksheetData[0] || {}).map(key => {
      const maxLen = Math.max(
        key.length,
        ...worksheetData.map(row => String(row[key as keyof typeof row]).length)
      );
      return { wch: Math.min(maxLen + 2, maxWidth) };
    });
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `BaoCaoThucTap_${className}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export all
  const handleExportAll = () => {
    const worksheetData = students.map((student, index) => ({
      'STT': index + 1,
      'Mã SV': student.maSinhVien,
      'Họ và tên': student.hoTen,
      'Lớp': student.lop,
      'Email': student.email,
      'Số điện thoại': student.soDienThoai,
      'Giảng viên hướng dẫn': student.giangVienHuongDan,
      'Doanh nghiệp thực tập': student.doanhNghiepThucTap,
      'Vị trí thực tập': student.viTriThucTap,
      'Ngày bắt đầu': new Date(student.ngayBatDauThucTap).toLocaleDateString('vi-VN'),
      'Ngày kết thúc': new Date(student.ngayKetThucThucTap).toLocaleDateString('vi-VN'),
      'Điểm GV chấm': student.diemGiangVien || 'Chưa chấm',
      'Trạng thái': student.trangThaiBaoCao === 'da-hoan-thanh' ? 'Đã hoàn thành' : 'Chưa hoàn thành',
      'Nhận xét': student.nhanXetGiangVien || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TatCa');

    const maxWidth = 50;
    const colWidths = Object.keys(worksheetData[0] || {}).map(key => {
      const maxLen = Math.max(
        key.length,
        ...worksheetData.map(row => String(row[key as keyof typeof row]).length)
      );
      return { wch: Math.min(maxLen + 2, maxWidth) };
    });
    worksheet['!cols'] = colWidths;

    XLSX.writeFile(workbook, `BaoCaoThucTap_ToanBo_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Calculate total stats
  const totalStats = {
    tongSinhVien: students.length,
    daHoanThanh: students.filter(s => s.trangThaiBaoCao === 'da-hoan-thanh').length,
    chuaHoanThanh: students.filter(s => s.trangThaiBaoCao === 'chua-hoan-thanh').length,
    tyLeHoanThanh: students.length > 0 
      ? Math.round((students.filter(s => s.trangThaiBaoCao === 'da-hoan-thanh').length / students.length) * 100)
      : 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Báo cáo Thực tập</h1>
              <p className="text-gray-600">Theo dõi và quản lý báo cáo thực tập sinh viên theo lớp</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fetchData(selectedClass, statusFilter)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Làm mới
              </button>
              <button
                onClick={handleExportAll}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-colors shadow-lg"
              >
                <Download className="w-5 h-5" />
                Xuất tất cả
              </button>
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-10 h-10 opacity-80" />
              <span className="text-3xl font-bold">{totalStats.tongSinhVien}</span>
            </div>
            <h3 className="text-blue-100 font-medium">Tổng sinh viên</h3>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="w-10 h-10 opacity-80" />
              <span className="text-3xl font-bold">{totalStats.daHoanThanh}</span>
            </div>
            <h3 className="text-green-100 font-medium">Đã hoàn thành</h3>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-10 h-10 opacity-80" />
              <span className="text-3xl font-bold">{totalStats.chuaHoanThanh}</span>
            </div>
            <h3 className="text-orange-100 font-medium">Chưa hoàn thành</h3>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-10 h-10 opacity-80" />
              <span className="text-3xl font-bold">{totalStats.tyLeHoanThanh}%</span>
            </div>
            <h3 className="text-purple-100 font-medium">Tỷ lệ hoàn thành</h3>
          </div>
        </div>

        {/* Class Statistics */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Thống kê theo lớp
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classStats.map(stat => (
              <div 
                key={stat.tenLop} 
                onClick={() => handleClassClick(stat.tenLop)}
                className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-blue-200 cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-lg font-bold ${selectedClass === stat.tenLop ? 'text-blue-700' : 'text-gray-900'}`}>
                    {stat.tenLop}
                    {selectedClass === stat.tenLop && (
                      <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Đang xem</span>
                    )}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleExportByClass(stat.tenLop);
                    }}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Xuất Excel"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng SV:</span>
                    <span className="font-semibold text-gray-900">{stat.tongSinhVien}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Đã hoàn thành:</span>
                    <span className="font-semibold text-green-600">{stat.daHoanThanh}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Chưa hoàn thành:</span>
                    <span className="font-semibold text-orange-600">{stat.chuaHoanThanh}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Tiến độ</span>
                      <span className="font-bold text-blue-600">{stat.tyLeHoanThanh}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${stat.tyLeHoanThanh}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã SV, lớp, GV, doanh nghiệp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Tất cả lớp</option>
                {uniqueClasses.map(className => (
                  <option key={className} value={className}>{className}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="da-hoan-thanh">Đã hoàn thành</option>
                <option value="chua-hoan-thanh">Chưa hoàn thành</option>
              </select>
            </div>
          </div>

          {/* Clear filter button */}
          {selectedClass !== 'all' && (
            <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
              <span className="text-sm text-blue-700">
                Đang lọc theo lớp: <strong>{selectedClass}</strong>
              </span>
              <button
                onClick={() => setSelectedClass('all')}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

        {/* Student List */}
        <div ref={tableRef} className="bg-white rounded-2xl shadow-xl overflow-hidden scroll-mt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-4 py-4 text-left text-sm font-semibold">STT</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Sinh viên</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Lớp</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Giảng viên HD</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Doanh nghiệp</th>
                  <th className="px-4 py-4 text-left text-sm font-semibold">Vị trí</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold">Điểm GV</th>
                  <th className="px-4 py-4 text-center text-sm font-semibold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      <div className="flex justify-center items-center gap-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Đang tải dữ liệu...
                      </div>
                    </td>
                  </tr>
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                      Không tìm thấy sinh viên nào
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-4 text-sm text-gray-700">{index + 1}</td>
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{student.hoTen}</div>
                          <div className="text-sm text-gray-500">{student.maSinhVien}</div>
                          <div className="text-xs text-gray-400">{student.email}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {student.lop}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{student.giangVienHuongDan}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{student.doanhNghiepThucTap}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-700">{student.viTriThucTap}</td>
                      <td className="px-4 py-4 text-center">
                        {student.diemGiangVien ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                            {student.diemGiangVien}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">Chưa chấm</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          student.trangThaiBaoCao === 'da-hoan-thanh'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-orange-100 text-orange-800 border border-orange-200'
                        }`}>
                          {student.trangThaiBaoCao === 'da-hoan-thanh' ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Hoàn thành
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" />
                              Chưa hoàn thành
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination info */}
          {!loading && filteredStudents.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Hiển thị <span className="font-semibold">{filteredStudents.length}</span> sinh viên
                {searchTerm && ` (tìm kiếm: "${searchTerm}")`}
                {selectedClass !== 'all' && ` (lớp: ${selectedClass})`}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipReportsManagementPage;
