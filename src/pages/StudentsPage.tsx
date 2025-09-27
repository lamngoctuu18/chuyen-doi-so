import React, { useState } from 'react';
import { Search, Plus, FileUp, Edit2, Trash2, Eye } from 'lucide-react';
import type { Student } from '../types';

const StudentsPage: React.FC = () => {
  // Mock data
  const [students] = useState<Student[]>([
    {
      id: '1',
      maSV: 'SV001',
      hoTen: 'Nguyễn Văn A',
      ngaySinh: '2000-01-15',
      email: 'sv001@dainam.edu.vn',
      sdt: '0987654321',
      trangThaiThucTap: 'dang-thuc-tap',
      lop: 'CNTT2021A',
      khoa: 'Công nghệ Thông tin'
    },
    {
      id: '2',
      maSV: 'SV002',
      hoTen: 'Trần Thị B',
      ngaySinh: '2000-05-20',
      email: 'sv002@dainam.edu.vn',
      sdt: '0987654322',
      trangThaiThucTap: 'da-dang-ky',
      lop: 'CNTT2021A',
      khoa: 'Công nghệ Thông tin'
    },
    {
      id: '3',
      maSV: 'SV003',
      hoTen: 'Lê Văn C',
      ngaySinh: '2000-03-10',
      email: 'sv003@dainam.edu.vn',
      sdt: '0987654323',
      trangThaiThucTap: 'chua-dang-ky',
      lop: 'CNTT2021B',
      khoa: 'Công nghệ Thông tin'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'chua-dang-ky': return 'bg-gray-100 text-gray-800';
      case 'da-dang-ky': return 'bg-blue-100 text-blue-800';
      case 'dang-thuc-tap': return 'bg-green-100 text-green-800';
      case 'hoan-thanh': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'chua-dang-ky': return 'Chưa đăng ký';
      case 'da-dang-ky': return 'Đã đăng ký';
      case 'dang-thuc-tap': return 'Đang thực tập';
      case 'hoan-thanh': return 'Hoàn thành';
      default: return status;
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.maSV.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || student.trangThaiThucTap === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Sinh viên</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <FileUp className="w-4 h-4 mr-2" />
            Import Excel
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Thêm sinh viên
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, mã SV, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="chua-dang-ky">Chưa đăng ký</option>
            <option value="da-dang-ky">Đã đăng ký</option>
            <option value="dang-thuc-tap">Đang thực tập</option>
            <option value="hoan-thanh">Hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lớp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái thực tập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.hoTen}</div>
                      <div className="text-sm text-gray-500">{student.maSV}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(student.ngaySinh).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
                    <div className="text-sm text-gray-500">{student.sdt}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.lop}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.trangThaiThucTap)}`}>
                      {getStatusText(student.trangThaiThucTap)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy sinh viên nào.</p>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-gray-900">{students.length}</div>
          <div className="text-sm text-gray-600">Tổng sinh viên</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-green-600">
            {students.filter(s => s.trangThaiThucTap === 'dang-thuc-tap').length}
          </div>
          <div className="text-sm text-gray-600">Đang thực tập</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-blue-600">
            {students.filter(s => s.trangThaiThucTap === 'da-dang-ky').length}
          </div>
          <div className="text-sm text-gray-600">Đã đăng ký</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-gray-600">
            {students.filter(s => s.trangThaiThucTap === 'chua-dang-ky').length}
          </div>
          <div className="text-sm text-gray-600">Chưa đăng ký</div>
        </div>
      </div>
    </div>
  );
};

export default StudentsPage;