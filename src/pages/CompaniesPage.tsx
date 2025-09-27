import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, MapPin, Phone, Mail, Globe } from 'lucide-react';
import type { Company } from '../types';

const CompaniesPage: React.FC = () => {
  // Mock data
  const [companies] = useState<Company[]>([
    {
      id: '1',
      tenDN: 'Công ty TNHH ABC Technology',
      nguoiLienHe: 'Nguyễn Văn Manager',
      email: 'manager@abc-tech.com',
      sdt: '0901234567',
      diaChi: '123 Đường ABC, Quận 1, TP.HCM',
      moTa: 'Công ty chuyên về phát triển phần mềm và ứng dụng di động',
      website: 'https://abc-tech.com',
      tinTuyenDung: []
    },
    {
      id: '2',
      tenDN: 'Startup XYZ Innovation',
      nguoiLienHe: 'Trần Thị Director',
      email: 'director@xyz-innovation.com',
      sdt: '0907654321',
      diaChi: '456 Đường XYZ, Quận 3, TP.HCM',
      moTa: 'Startup chuyên về AI và Machine Learning',
      website: 'https://xyz-innovation.com',
      tinTuyenDung: []
    },
    {
      id: '3', 
      tenDN: 'DEF Software Solutions',
      nguoiLienHe: 'Lê Văn CEO',
      email: 'ceo@def-software.com',
      sdt: '0909876543',
      diaChi: '789 Đường DEF, Quận 7, TP.HCM',
      moTa: 'Công ty giải pháp phần mềm doanh nghiệp',
      website: 'https://def-software.com',
      tinTuyenDung: []
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = companies.filter(company =>
    company.tenDN.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.nguoiLienHe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Doanh nghiệp</h1>
        <div className="mt-4 sm:mt-0">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Thêm doanh nghiệp
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên doanh nghiệp, người liên hệ, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            {/* Company Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.tenDN}</h3>
              <p className="text-gray-600 text-sm line-clamp-2">{company.moTa}</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{company.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{company.sdt}</span>
              </div>
              <div className="flex items-start text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{company.diaChi}</span>
              </div>
              {company.website && (
                <div className="flex items-center text-sm text-blue-600">
                  <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="truncate hover:underline"
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </div>

            {/* Contact Person */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <p className="text-sm text-gray-600">Người liên hệ:</p>
              <p className="font-medium text-gray-900">{company.nguoiLienHe}</p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800 p-1">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="text-green-600 hover:text-green-800 p-1">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy doanh nghiệp nào.</p>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-gray-900">{companies.length}</div>
          <div className="text-sm text-gray-600">Tổng doanh nghiệp</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-green-600">
            {companies.filter(c => c.tinTuyenDung.length > 0).length}
          </div>
          <div className="text-sm text-gray-600">Có tin tuyển dụng</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-2xl font-bold text-blue-600">
            {companies.reduce((total, c) => total + c.tinTuyenDung.length, 0)}
          </div>
          <div className="text-sm text-gray-600">Tổng tin tuyển dụng</div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;