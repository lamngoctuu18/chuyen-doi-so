import React, { useState, useEffect } from 'react';
import { Calendar, Users, Building2, Edit, Eye, Trash2, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Registration {
  id: string;
  dot_thuc_tap_id: string;
  ten_dot: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  batch_status: string;
  vi_tri_tuyen: string;
  so_luong_tuyen: number;
  yeu_cau_ky_nang: string;
  mo_ta_cong_viec: string;
  luong_khoang: string;
  dia_chi_lam_viec: string;
  ghi_chu: string;
  trang_thai: string;
  created_at: string;
  updated_at: string;
}

interface EditModalProps {
  registration: Registration;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
}

const EditRegistrationModal: React.FC<EditModalProps> = ({
  registration,
  isOpen,
  onClose,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState({
    vi_tri_tuyen: registration.vi_tri_tuyen,
    so_luong_tuyen: registration.so_luong_tuyen,
    yeu_cau_ky_nang: registration.yeu_cau_ky_nang,
    mo_ta_cong_viec: registration.mo_ta_cong_viec,
    luong_khoang: registration.luong_khoang,
    dia_chi_lam_viec: registration.dia_chi_lam_viec,
    ghi_chu: registration.ghi_chu
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'so_luong_tuyen' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Chỉnh sửa thông tin tuyển dụng: {registration.ten_dot}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vị trí tuyển *
                </label>
                <input
                  type="text"
                  name="vi_tri_tuyen"
                  value={formData.vi_tri_tuyen}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng tuyển *
                </label>
                <input
                  type="number"
                  name="so_luong_tuyen"
                  value={formData.so_luong_tuyen}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Yêu cầu kỹ năng *
              </label>
              <textarea
                name="yeu_cau_ky_nang"
                value={formData.yeu_cau_ky_nang}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả công việc *
              </label>
              <textarea
                name="mo_ta_cong_viec"
                value={formData.mo_ta_cong_viec}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mức lương/trợ cấp
                </label>
                <input
                  type="text"
                  name="luong_khoang"
                  value={formData.luong_khoang}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ làm việc *
                </label>
                <input
                  type="text"
                  name="dia_chi_lam_viec"
                  value={formData.dia_chi_lam_viec}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú thêm
              </label>
              <textarea
                name="ghi_chu"
                value={formData.ghi_chu}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const RegistrationHistory: React.FC = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/company-registrations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể tải danh sách đăng ký');
      }

      const data = await response.json();
      setRegistrations(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cho-duyet': return 'bg-yellow-100 text-yellow-800';
      case 'da-duyet': return 'bg-green-100 text-green-800';
      case 'tu-choi': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'cho-duyet': return 'Chờ duyệt';
      case 'da-duyet': return 'Đã duyệt';
      case 'tu-choi': return 'Từ chối';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cho-duyet': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'da-duyet': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'tu-choi': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getBatchStatusColor = (status: string) => {
    switch (status) {
      case 'sap-mo': return 'bg-blue-100 text-blue-800';
      case 'dang-dien-ra': return 'bg-green-100 text-green-800';
      case 'ket-thuc': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatchStatusText = (status: string) => {
    switch (status) {
      case 'sap-mo': return 'Sắp mở';
      case 'dang-dien-ra': return 'Đang diễn ra';
      case 'ket-thuc': return 'Kết thúc';
      default: return status;
    }
  };

  const canEdit = (registration: Registration) => {
    return registration.batch_status === 'sap-mo';
  };

  const handleEdit = (registration: Registration) => {
    setEditingRegistration(registration);
  };

  const handleSave = async (formData: any) => {
    if (!editingRegistration) return;

    try {
      setUpdateLoading(true);
      const response = await fetch(`http://localhost:3001/api/company-registrations/${editingRegistration.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật thông tin');
      }

      await fetchRegistrations(); // Refresh data
      setEditingRegistration(null);
      alert('Cập nhật thông tin thành công!');
    } catch (err) {
      alert('Có lỗi xảy ra khi cập nhật: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (registration: Registration) => {
    if (!canEdit(registration)) {
      alert('Không thể hủy đăng ký khi đợt thực tập đã bắt đầu hoặc kết thúc');
      return;
    }

    if (!confirm(`Bạn có chắc chắn muốn hủy đăng ký "${registration.ten_dot}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/company-registrations/${registration.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Không thể hủy đăng ký');
      }

      await fetchRegistrations(); // Refresh data
      alert('Hủy đăng ký thành công!');
    } catch (err) {
      alert('Có lỗi xảy ra khi hủy đăng ký: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải lịch sử đăng ký...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={fetchRegistrations}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Lịch sử Đăng ký</h1>
        <div className="mt-4 sm:mt-0 text-sm text-gray-600">
          Doanh nghiệp: <span className="font-semibold">{user?.name}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-blue-600">
            {registrations.length}
          </div>
          <div className="text-sm text-gray-600">Tổng đăng ký</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-yellow-600">
            {registrations.filter(r => r.trang_thai === 'cho-duyet').length}
          </div>
          <div className="text-sm text-gray-600">Chờ duyệt</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-green-600">
            {registrations.filter(r => r.trang_thai === 'da-duyet').length}
          </div>
          <div className="text-sm text-gray-600">Đã duyệt</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-red-600">
            {registrations.filter(r => r.trang_thai === 'tu-choi').length}
          </div>
          <div className="text-sm text-gray-600">Từ chối</div>
        </div>
      </div>

      {/* Registrations List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Danh sách Đăng ký</h2>
          
          {registrations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có lịch sử đăng ký nào.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <div key={registration.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{registration.ten_dot}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBatchStatusColor(registration.batch_status)}`}>
                          {getBatchStatusText(registration.batch_status)}
                        </span>
                      </div>
                      <p className="text-blue-600 font-medium">{registration.vi_tri_tuyen}</p>
                    </div>
                    <div className="flex items-center ml-4">
                      {getStatusIcon(registration.trang_thai)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.trang_thai)}`}>
                        {getStatusText(registration.trang_thai)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(registration.thoi_gian_bat_dau).toLocaleDateString('vi-VN')} - {' '}
                        {new Date(registration.thoi_gian_ket_thuc).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{registration.so_luong_tuyen} vị trí</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>{registration.luong_khoang || 'Chưa có thông tin lương'}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Yêu cầu kỹ năng:</strong> {registration.yeu_cau_ky_nang}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Mô tả công việc:</strong> {registration.mo_ta_cong_viec}
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <Eye className="w-4 h-4 mr-1 inline" />
                      Xem ứng viên
                    </button>
                    
                    {canEdit(registration) ? (
                      <>
                        <button 
                          onClick={() => handleEdit(registration)}
                          className="px-4 py-2 text-sm text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <Edit className="w-4 h-4 mr-1 inline" />
                          Chỉnh sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(registration)}
                          className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1 inline" />
                          Hủy đăng ký
                        </button>
                      </>
                    ) : (
                      <button 
                        disabled
                        className="px-4 py-2 text-sm text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                      >
                        <AlertCircle className="w-4 h-4 mr-1 inline" />
                        Không thể chỉnh sửa
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingRegistration && (
        <EditRegistrationModal
          registration={editingRegistration}
          isOpen={!!editingRegistration}
          onClose={() => setEditingRegistration(null)}
          onSave={handleSave}
          loading={updateLoading}
        />
      )}
    </div>
  );
};

export default RegistrationHistory;