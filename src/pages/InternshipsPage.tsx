import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Search, Plus, Calendar, Users, Building2, User, Clock, CheckCircle, AlertCircle, BarChart3, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useInternshipBatches } from '../hooks/useInternships';
import CreateBatchModal from '../components/CreateBatchModal';
import EditBatchModal from '../components/EditBatchModal';
import CompanyInternshipRegistration from '../components/CompanyInternshipRegistration';
import { refreshDashboardWithDelay } from '../utils/dashboardUtils';

// Use absolute API base since Vite config has no proxy for /api
const API_BASE_URL = 'http://localhost:3001/api';

const InternshipsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Render different components based on user role
  if (user?.role === 'doanh-nghiep') {
    return <CompanyInternshipRegistration />;
  }
  
  // Admin and other roles see the management interface
  const { batches: internshipBatches, loading, error, fetchBatches, createBatch, updateBatch } = useInternshipBatches();
  // const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any | null>(null);
  
  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  
  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  // const [selectedBatchForExport, setSelectedBatchForExport] = useState<any | null>(null);
  
  // Detail view state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBatchForDetail, setSelectedBatchForDetail] = useState<any | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  // Load internship batches
  useEffect(() => {
    fetchBatches();
  }, []);

  // Get statistics only from active batches (not ended)
  const getActiveBatchesStats = () => {
    const activeBatches = internshipBatches.filter(batch => 
      batch.trang_thai === 'sap-mo' || 
      batch.trang_thai === 'dang-mo' || 
      batch.trang_thai === 'dang-dien-ra'
    );
    
    return {
      totalStudents: activeBatches.reduce((total, batch) => total + (batch.soSinhVienThamGia || 0), 0),
      totalTeachers: activeBatches.reduce((total, batch) => total + (batch.soGiangVienHuongDan || 0), 0),
      totalCompanies: activeBatches.reduce((total, batch) => total + (batch.soDoanhNghiepThamGia || 0), 0)
    };
  };

  // Handle create batch
  const handleCreateBatch = async (batchData: any) => {
    setCreateLoading(true);
    try {
      await createBatch(batchData);
      setIsCreateModalOpen(false);
      // Refresh dashboard stats after creating batch
      refreshDashboardWithDelay();
    } catch (error) {
      console.error('Error creating batch:', error);
      throw error;
    } finally {
      setCreateLoading(false);
    }
  };

  const openEdit = (batch: any) => {
    setEditingBatch({
      id: batch.id,
      ten_dot: batch.ten_dot || batch.tenDot,
      thoi_gian_bat_dau: (batch.thoi_gian_bat_dau || '').slice(0,10),
      thoi_gian_ket_thuc: (batch.thoi_gian_ket_thuc || '').slice(0,10),
      mo_ta: batch.mo_ta || batch.moTa,
      trang_thai: batch.trang_thai || 'sap-mo'
    });
    setIsEditOpen(true);
  };

  const handleEditBatch = async (data: any) => {
    if (!editingBatch?.id) return;
    setEditLoading(true);
    try {
      await updateBatch(String(editingBatch.id), data);
      setIsEditOpen(false);
      // Refresh dashboard stats after updating batch
      refreshDashboardWithDelay();
    } finally {
      setEditLoading(false);
    }
  };

  // Handle export file
  const handleExportFile = async (batch: any) => {
    setIsExporting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/internship-batches/${batch.id}/export`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dot-thuc-tap-${batch.ten_dot || batch.tenDot}-${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert('Xuất file thành công!');
      } else {
        const result = await response.json();
        alert(`Xuất file thất bại: ${result.message || 'Lỗi không xác định'}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Lỗi khi xuất file');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle import participants for a specific batch
  const handleImportParticipants = async (batchId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/internship-batches/${batchId}/import-participants`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(`Import thành công!\n${result.message}`);
        fetchBatches(); // Refresh data
        refreshDashboardWithDelay(); // Update dashboard stats
      } else {
        alert(`Import thất bại: ${result.message}`);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert('Lỗi khi import file');
    }
  };

  // Show export modal
  const showExportOptions = () => {
    setShowExportModal(true);
  };

  // Show batch details
  const showBatchDetails = (batch: any) => {
    setSelectedBatchForDetail(batch);
    setShowDetailModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'dang-mo': return 'bg-green-100 text-green-800 border border-green-200';
      case 'dang-dien-ra': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'ket-thuc': return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'sap-mo': return 'bg-orange-100 text-orange-800 border border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'dang-mo': return 'Đang mở';
      case 'dang-dien-ra': return 'Đang diễn ra';
      case 'ket-thuc': return 'Đã kết thúc';
      case 'sap-mo': return 'Sắp mở';
      default: return 'Không xác định';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'dang-mo': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'dang-dien-ra': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'ket-thuc': return <CheckCircle className="w-5 h-5 text-gray-500" />;
      case 'sap-mo': return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const filteredBatches = internshipBatches.filter(batch =>
    (batch.ten_dot || batch.tenDot || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100">
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-900 via-amber-900 to-yellow-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl mr-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Quản lý Thực tập
                  </h1>
                  <p className="text-xl text-orange-100 mt-2">
                    Quản lý các đợt thực tập và theo dõi tiến độ
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Export Button */}
              {user?.role === 'admin' && (
                <button
                  onClick={showExportOptions}
                  className={`inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-2xl hover:bg-white/20 transition-all duration-300 border border-white/20 shadow-lg ${
                    isExporting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isExporting}
                >
                  <Download className={`w-5 h-5 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
                  {isExporting ? 'Đang xuất...' : 'Xuất file Excel'}
                </button>
              )}
              
              {/* Create Button */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 transition-all duration-300 shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Tạo đợt thực tập mới
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Search and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modern Search Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 mb-8">
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm đợt thực tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-colors"
            />
          </div>
        </div>
        {/* Internship Batches */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 mb-8">
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="bg-red-50 rounded-lg p-6 max-w-md mx-auto">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-800 font-medium mb-2">Lỗi tải dữ liệu</p>
                  <p className="text-red-600 text-sm mb-4">{error}</p>
                  <button 
                    onClick={() => fetchBatches()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            ) : filteredBatches.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium mb-2">Chưa có đợt thực tập nào</p>
                  <p className="text-gray-500 text-sm mb-6">Tạo đợt thực tập đầu tiên để bắt đầu</p>
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tạo đợt thực tập
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredBatches.map((batch) => (
                  <div key={batch.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden group">
                    {/* Header với gradient background */}
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1">
                      <div className="bg-white rounded-t-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <h3 className="text-2xl font-bold text-gray-900 mr-3">
                                {batch.ten_dot || batch.tenDot}
                              </h3>
                              <div className="flex items-center">
                                {getStatusIcon(batch.trang_thai)}
                                <span className={`ml-2 px-4 py-1.5 rounded-full text-xs font-semibold ${getStatusColor(batch.trang_thai)}`}>
                                  {getStatusText(batch.trang_thai)}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {batch.mo_ta || batch.moTa || 'Chưa có mô tả'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 pt-0">
                      {/* Thời gian */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Bắt đầu:</span>
                          <span className="ml-1">{batch.thoi_gian_bat_dau ? new Date(batch.thoi_gian_bat_dau).toLocaleDateString('vi-VN') : 'Chưa xác định'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Kết thúc:</span>
                          <span className="ml-1">{batch.thoi_gian_ket_thuc ? new Date(batch.thoi_gian_ket_thuc).toLocaleDateString('vi-VN') : 'Chưa xác định'}</span>
                        </div>
                      </div>

                      {/* Thống kê số lượng */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-2xl font-bold text-blue-600">{batch.soSinhVienThamGia || 0}</div>
                          <div className="text-xs text-blue-500 font-medium">Sinh viên</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-2xl font-bold text-green-600">{batch.soGiangVienHuongDan || 0}</div>
                          <div className="text-xs text-green-500 font-medium">Giảng viên</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="text-2xl font-bold text-purple-600">{batch.soDoanhNghiepThamGia || 0}</div>
                          <div className="text-xs text-purple-500 font-medium">Doanh nghiệp</div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => showBatchDetails(batch)}
                          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium group-hover:bg-blue-500"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Xem chi tiết
                        </button>
                        
                        {/* Import Participants */}
                        <div className="relative">
                          <input
                            type="file"
                            id={`import-participants-${batch.id}`}
                            accept=".xlsx,.xls"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImportParticipants(batch.id.toString(), file);
                                e.target.value = '';
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor={`import-participants-${batch.id}`}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium cursor-pointer"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                            </svg>
                            Import Excel
                          </label>
                        </div>
                        
                        <button
                          onClick={() => handleExportFile(batch)}
                          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Export Excel
                        </button>
                        
                        <button
                          onClick={() => openEdit(batch)}
                          className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200 text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Cards - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Tổng đợt thực tập</p>
              <p className="text-4xl font-bold mb-2">{internshipBatches.length}</p>
              <div className="flex items-center text-xs text-blue-200">
                <div className="w-2 h-2 bg-blue-300 rounded-full mr-2 animate-pulse"></div>
                Quản lý tập trung
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium mb-1">Đang hoạt động</p>
              <p className="text-4xl font-bold mb-2">
                {internshipBatches.filter(batch => 
                  batch.trang_thai === 'dang-mo' || 
                  batch.trang_thai === 'dang-dien-ra' || 
                  batch.trang_thai === 'sap-mo'
                ).length}
              </p>
              <div className="flex items-center text-xs text-green-200">
                <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
                Đợt đang diễn ra
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium mb-1">Tổng sinh viên</p>
              <p className="text-4xl font-bold mb-2">
                {getActiveBatchesStats().totalStudents}
              </p>
              <div className="flex items-center text-xs text-purple-200">
                <div className="w-2 h-2 bg-purple-300 rounded-full mr-2 animate-pulse"></div>
                Sinh viên tham gia
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium mb-1">Tổng tham gia</p>
              <p className="text-4xl font-bold mb-2">
                {getActiveBatchesStats().totalTeachers + getActiveBatchesStats().totalCompanies}
              </p>
              <div className="flex items-center text-xs text-orange-200">
                <div className="w-2 h-2 bg-orange-300 rounded-full mr-2 animate-pulse"></div>
                GV + DN tham gia
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Create Batch Modal */}
      <CreateBatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBatch}
        loading={createLoading}
      />
      
      {/* Edit Batch Modal */}
      <EditBatchModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEditBatch}
        loading={editLoading}
        initialData={editingBatch}
      />

      {/* Export Options Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Xuất file Excel</h3>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">Chọn đợt thực tập để xuất:</p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {internshipBatches.map((batch) => (
                  <button
                    key={batch.id}
                    onClick={() => {
                      handleExportFile(batch);
                      setShowExportModal(false);
                    }}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{batch.ten_dot || batch.tenDot}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {batch.thoi_gian_bat_dau ? new Date(batch.thoi_gian_bat_dau).toLocaleDateString('vi-VN') : 'N/A'} - {' '}
                      {batch.thoi_gian_ket_thuc ? new Date(batch.thoi_gian_ket_thuc).toLocaleDateString('vi-VN') : 'N/A'}
                    </div>
                    <div className="flex space-x-4 text-xs text-gray-500 mt-2">
                      <span>SV: {batch.soSinhVienThamGia || 0}</span>
                      <span>GV: {batch.soGiangVienHuongDan || 0}</span>
                      <span>DN: {batch.soDoanhNghiepThamGia || 0}</span>
                    </div>
                  </button>
                ))}
              </div>
              {internshipBatches.length === 0 && (
                <p className="text-center text-gray-500 py-8">Chưa có đợt thực tập nào</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Batch Details Modal */}
      {showDetailModal && selectedBatchForDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Chi tiết: {selectedBatchForDetail.ten_dot || selectedBatchForDetail.tenDot}
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              {/* Batch Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Thông tin chung</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Thời gian:</span> {selectedBatchForDetail.thoi_gian_bat_dau ? new Date(selectedBatchForDetail.thoi_gian_bat_dau).toLocaleDateString('vi-VN') : 'N/A'} - {selectedBatchForDetail.thoi_gian_ket_thuc ? new Date(selectedBatchForDetail.thoi_gian_ket_thuc).toLocaleDateString('vi-VN') : 'N/A'}</div>
                    <div><span className="font-medium">Trạng thái:</span> <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedBatchForDetail.trang_thai)}`}>{getStatusText(selectedBatchForDetail.trang_thai)}</span></div>
                    <div><span className="font-medium">Mô tả:</span> {selectedBatchForDetail.mo_ta || selectedBatchForDetail.moTa || 'Không có mô tả'}</div>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Thống kê</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-green-600 mr-2" />
                      <span className="font-medium">Sinh viên:</span>
                      <span className="ml-1 font-bold text-green-600">{selectedBatchForDetail.soSinhVienThamGia || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-medium">Giảng viên:</span>
                      <span className="ml-1 font-bold text-blue-600">{selectedBatchForDetail.soGiangVienHuongDan || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 text-purple-600 mr-2" />
                      <span className="font-medium">Doanh nghiệp:</span>
                      <span className="ml-1 font-bold text-purple-600">{selectedBatchForDetail.soDoanhNghiepThamGia || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participants Lists - This would be populated from API calls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Sinh viên thực tập
                  </h4>
                  <p className="text-sm text-green-600">
                    {selectedBatchForDetail.soSinhVienThamGia || 0} sinh viên đã đăng ký
                  </p>
                  <p className="text-xs text-green-500 mt-2">
                    Import file Excel để cập nhật danh sách
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Giảng viên hướng dẫn
                  </h4>
                  <p className="text-sm text-blue-600">
                    {selectedBatchForDetail.soGiangVienHuongDan || 0} giảng viên tham gia
                  </p>
                  <p className="text-xs text-blue-500 mt-2">
                    Import file Excel để cập nhật danh sách
                  </p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Doanh nghiệp thực tập
                  </h4>
                  <p className="text-sm text-purple-600">
                    {selectedBatchForDetail.soDoanhNghiepThamGia || 0} doanh nghiệp tham gia
                  </p>
                  <p className="text-xs text-purple-500 mt-2">
                    Import file Excel để cập nhật danh sách
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    handleExportFile(selectedBatchForDetail);
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Xuất file Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipsPage;