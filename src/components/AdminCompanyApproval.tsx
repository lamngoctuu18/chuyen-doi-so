import React, { useState, useEffect } from 'react';
import { Search, Eye, Check, X, Building, Calendar, Users, MapPin, Phone, Mail, Globe, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface InternshipBatch {
  id: number;
  ten_dot: string;
  mo_ta: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  han_dang_ky: string;
  trang_thai: string;
  so_doanh_nghiep_tham_gia: number;
  so_doanh_nghiep_duyet: number;
  so_doanh_nghiep_cho_duyet: number;
}

interface CompanyRegistration {
  dang_ky_id: number;
  vi_tri_tuyen: string;
  so_luong_tuyen: number;
  yeu_cau_ky_nang: string;
  mo_ta_cong_viec: string;
  luong_khoang: string;
  dia_chi_lam_viec: string;
  ngay_dang_ky: string;
  trang_thai: string;
  ly_do_tu_choi: string;
  doanh_nghiep_id: number;
  ten_cong_ty: string;
  dia_chi_cong_ty: string;
  so_dien_thoai: string;
  email_cong_ty: string;
  website: string;
  linh_vuc_hoat_dong: string;
  quy_mo_nhan_su: string;
  mo_ta_cong_ty: string;
  so_sinh_vien_dang_ky: number;
}

const AdminCompanyApproval: React.FC = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState<InternshipBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<InternshipBatch | null>(null);
  const [companyRegistrations, setCompanyRegistrations] = useState<CompanyRegistration[]>([]);
  const [selectedRegistration, setSelectedRegistration] = useState<CompanyRegistration | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'cho-duyet' | 'da-duyet' | 'bi-tu-choi'>('all');
  const [loading, setLoading] = useState(false);

  // Fetch batches with company registration stats
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/admin/internship-batches/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setBatches(result.data);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch company registrations in batch
  const fetchCompanyRegistrations = async (batchId: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        status: statusFilter === 'all' ? '' : statusFilter
      });

      const response = await fetch(`http://localhost:3001/api/admin/internship-batches/${batchId}/company-registrations?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setCompanyRegistrations(result.data);
      }
    } catch (error) {
      console.error('Error fetching company registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle approval/rejection
  const handleApprovalAction = async () => {
    if (!selectedRegistration) return;

    try {
      const response = await fetch(`http://localhost:3001/api/admin/company-registrations/${selectedRegistration.dang_ky_id}/${approvalAction}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ly_do_tu_choi: approvalAction === 'reject' ? rejectionReason : null
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`${approvalAction === 'approve' ? 'Phê duyệt' : 'Từ chối'} thành công!`);
        setShowApprovalModal(false);
        setRejectionReason('');
        setSelectedRegistration(null);
        // Refresh data
        if (selectedBatch) {
          fetchCompanyRegistrations(selectedBatch.id);
          fetchBatches(); // Update stats
        }
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error('Error processing approval:', error);
      alert('Có lỗi xảy ra!');
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    if (selectedBatch) {
      fetchCompanyRegistrations(selectedBatch.id);
    }
  }, [selectedBatch, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cho-duyet': return 'text-yellow-600 bg-yellow-100';
      case 'da-duyet': return 'text-green-600 bg-green-100';
      case 'bi-tu-choi': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'cho-duyet': return 'Chờ duyệt';
      case 'da-duyet': return 'Đã duyệt';
      case 'bi-tu-choi': return 'Bị từ chối';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cho-duyet': return <Clock className="w-4 h-4" />;
      case 'da-duyet': return <CheckCircle className="w-4 h-4" />;
      case 'bi-tu-choi': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chỉ quản trị viên mới có thể truy cập trang này</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Duyệt đăng ký doanh nghiệp</h1>
      </div>

      {!selectedBatch ? (
        /* Batches List */
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Danh sách đợt thực tập</h2>
          
          <div className="space-y-4">
            {loading && <div className="text-center py-4">Đang tải...</div>}
            {batches.map((batch) => (
              <div key={batch.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{batch.ten_dot}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        batch.trang_thai === 'dang-mo' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                      }`}>
                        {batch.trang_thai === 'dang-mo' ? 'Đang mở' : 'Đã đóng'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3">{batch.mo_ta}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Từ {new Date(batch.ngay_bat_dau).toLocaleDateString('vi-VN')} - {new Date(batch.ngay_ket_thuc).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Hạn ĐK: {new Date(batch.han_dang_ky).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Building className="w-4 h-4 mr-2" />
                        <span>{batch.so_doanh_nghiep_tham_gia} DN đăng ký</span>
                      </div>
                    </div>

                    {batch.so_doanh_nghiep_tham_gia > 0 && (
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <span className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {batch.so_doanh_nghiep_duyet} đã duyệt
                        </span>
                        <span className="flex items-center text-yellow-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {batch.so_doanh_nghiep_cho_duyet} chờ duyệt
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {batch.so_doanh_nghiep_tham_gia > 0 && (
                      <button
                        onClick={() => setSelectedBatch(batch)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Duyệt đăng ký ({batch.so_doanh_nghiep_cho_duyet})
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Company Registrations */
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedBatch.ten_dot}</h2>
                <p className="text-gray-600">Đăng ký doanh nghiệp tham gia</p>
              </div>
              <button
                onClick={() => {
                  setSelectedBatch(null);
                  setCompanyRegistrations([]);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Quay lại
              </button>
            </div>

            {/* Filters */}
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm kiếm doanh nghiệp..."
                    maxLength={250}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="cho-duyet">Chờ duyệt</option>
                <option value="da-duyet">Đã duyệt</option>
                <option value="bi-tu-choi">Bị từ chối</option>
              </select>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {loading && <div className="text-center py-4">Đang tải...</div>}
              {companyRegistrations.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  Không có đăng ký nào
                </div>
              )}
              {companyRegistrations.map((registration) => (
                <div key={registration.dang_ky_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{registration.ten_cong_ty}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.trang_thai)}`}>
                          {getStatusIcon(registration.trang_thai)}
                          {getStatusText(registration.trang_thai)}
                        </span>
                      </div>
                      
                      <p className="text-blue-600 font-medium mb-1">{registration.vi_tri_tuyen}</p>
                      <p className="text-gray-600 text-sm mb-2">{registration.linh_vuc_hoat_dong}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          <span>Tuyển: {registration.so_luong_tuyen} sinh viên</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{registration.dia_chi_lam_viec}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>ĐK: {new Date(registration.ngay_dang_ky).toLocaleDateString('vi-VN')}</span>
                        </div>
                        {registration.so_sinh_vien_dang_ky > 0 && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{registration.so_sinh_vien_dang_ky} SV đã đăng ký</span>
                          </div>
                        )}
                      </div>

                      {registration.ly_do_tu_choi && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            <strong>Lý do từ chối:</strong> {registration.ly_do_tu_choi}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setShowDetailModal(true);
                        }}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Chi tiết
                      </button>
                      
                      {registration.trang_thai === 'cho-duyet' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setApprovalAction('approve');
                              setShowApprovalModal(true);
                            }}
                            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Duyệt
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRegistration(registration);
                              setApprovalAction('reject');
                              setShowApprovalModal(true);
                            }}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center gap-1"
                          >
                            <X className="w-4 h-4" />
                            Từ chối
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chi tiết đăng ký</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thông tin doanh nghiệp</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p><strong>Tên công ty:</strong> {selectedRegistration.ten_cong_ty}</p>
                  <p><strong>Lĩnh vực:</strong> {selectedRegistration.linh_vuc_hoat_dong}</p>
                  <p><strong>Quy mô:</strong> {selectedRegistration.quy_mo_nhan_su}</p>
                  <p><strong>Địa chỉ:</strong> {selectedRegistration.dia_chi_cong_ty}</p>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      {selectedRegistration.so_dien_thoai}
                    </span>
                    <span className="flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      {selectedRegistration.email_cong_ty}
                    </span>
                    {selectedRegistration.website && (
                      <span className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        <a href={selectedRegistration.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          Website
                        </a>
                      </span>
                    )}
                  </div>
                  {selectedRegistration.mo_ta_cong_ty && (
                    <p><strong>Mô tả:</strong> {selectedRegistration.mo_ta_cong_ty}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thông tin tuyển dụng</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p><strong>Vị trí tuyển:</strong> {selectedRegistration.vi_tri_tuyen}</p>
                  <p><strong>Số lượng:</strong> {selectedRegistration.so_luong_tuyen} sinh viên</p>
                  <p><strong>Lương:</strong> {selectedRegistration.luong_khoang || 'Thương lượng'}</p>
                  <p><strong>Địa chỉ làm việc:</strong> {selectedRegistration.dia_chi_lam_viec}</p>
                  <p><strong>Mô tả công việc:</strong> {selectedRegistration.mo_ta_cong_viec}</p>
                  {selectedRegistration.yeu_cau_ky_nang && (
                    <p><strong>Yêu cầu kỹ năng:</strong> {selectedRegistration.yeu_cau_ky_nang}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Thông tin đăng ký</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p><strong>Ngày đăng ký:</strong> {new Date(selectedRegistration.ngay_dang_ky).toLocaleDateString('vi-VN')}</p>
                  <p>
                    <strong>Trạng thái:</strong> 
                    <span className={`ml-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRegistration.trang_thai)}`}>
                      {getStatusIcon(selectedRegistration.trang_thai)}
                      {getStatusText(selectedRegistration.trang_thai)}
                    </span>
                  </p>
                  <p><strong>Sinh viên đã đăng ký:</strong> {selectedRegistration.so_sinh_vien_dang_ky}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {approvalAction === 'approve' ? 'Phê duyệt' : 'Từ chối'} đăng ký
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                <strong>Doanh nghiệp:</strong> {selectedRegistration.ten_cong_ty}
              </p>
              <p className="text-gray-700">
                <strong>Vị trí:</strong> {selectedRegistration.vi_tri_tuyen}
              </p>
            </div>

            {approvalAction === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Nhập lý do từ chối..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setRejectionReason('');
                  setSelectedRegistration(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleApprovalAction}
                disabled={approvalAction === 'reject' && !rejectionReason.trim()}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  approvalAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                }`}
              >
                {approvalAction === 'approve' ? 'Phê duyệt' : 'Từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanyApproval;