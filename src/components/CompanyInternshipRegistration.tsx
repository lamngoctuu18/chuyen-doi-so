import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, AlertCircle, CheckCircle, Clock, Eye, Plus } from 'lucide-react';
import { useInternshipBatches } from '../hooks/useInternships';
import { useAuth } from '../hooks/useAuth';

// CompanyRegistration interface removed as it's not used after cleanup

const CompanyInternshipRegistration: React.FC = () => {
  const { user } = useAuth();
  const { batches, loading, error, fetchBatches } = useInternshipBatches();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  // const [registrations, setRegistrations] = useState<CompanyRegistration[]>([]);
  const [registeredBatchIds, setRegisteredBatchIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    viTriTuyen: '',
    soLuongTuyen: 1,
    yeuCauKyNang: '',
    moTaCongViec: '',
    luongKhoang: '',
    diaChiLamViec: '',
    ghiChu: ''
  });

  const fetchRegistrations = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/company-registrations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const batchIds = data.data.map((reg: any) => reg.dot_thuc_tap_id.toString());
        setRegisteredBatchIds(batchIds);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  useEffect(() => {
    fetchBatches();
    fetchRegistrations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sap-mo': return 'bg-blue-100 text-blue-800';
      case 'dang-dien-ra': return 'bg-green-100 text-green-800';
      case 'ket-thuc': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sap-mo': return 'Sắp mở';
      case 'dang-dien-ra': return 'Đang diễn ra';
      case 'ket-thuc': return 'Kết thúc';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'dang-dien-ra': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'sap-mo': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'ket-thuc': return <AlertCircle className="w-4 h-4 text-gray-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const canRegisterOrEdit = (batchStatus: string) => {
    return batchStatus === 'sap-mo';
  };

  const filteredBatches = batches.filter(batch =>
    (batch.ten_dot || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
    !registeredBatchIds.includes(batch.id.toString())
  );

  const handleRegister = (batch: any) => {
    setSelectedBatch(batch);
    setShowRegistrationForm(true);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('🔄 Submitting registration:', {
        dotThucTapId: selectedBatch.id,
        doanhNghiepId: user?.id,
        ...formData
      });

      // Call real API
      const response = await fetch('http://localhost:3001/api/company-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          dotThucTapId: selectedBatch.id,
          ...formData
        })
      });

      const data = await response.json();
      console.log('📡 API Response:', data);

      if (data.success) {
        // Reset form
        setFormData({
          viTriTuyen: '',
          soLuongTuyen: 1,
          yeuCauKyNang: '',
          moTaCongViec: '',
          luongKhoang: '',
          diaChiLamViec: '',
          ghiChu: ''
        });
        setShowRegistrationForm(false);
        setSelectedBatch(null);
        
        alert('Đăng ký tham gia đợt thực tập thành công!');
        
        // Refresh the list to show updated data
        fetchBatches();
        // Refresh registrations to update the filtered list
        fetchRegistrations();
      } else {
        throw new Error(data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      console.error('❌ Error submitting registration:', error);
      const errorMessage = error instanceof Error ? error.message : 'Có lỗi xảy ra khi đăng ký!';
      alert(`Có lỗi xảy ra khi đăng ký: ${errorMessage}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'soLuongTuyen' ? parseInt(value) || 1 : value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách đợt thực tập...</p>
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
          onClick={() => fetchBatches()}
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
        <h1 className="text-3xl font-bold text-gray-900">Đăng ký Đợt Thực tập</h1>
        <div className="mt-4 sm:mt-0 text-sm text-gray-600">
          Doanh nghiệp: <span className="font-semibold">{user?.name}</span>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm đợt thực tập..."
            maxLength={250}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Batches List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Danh sách Đợt Thực tập</h2>
          
          {filteredBatches.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Không có đợt thực tập nào.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBatches.map((batch) => (
                <div key={batch.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{batch.ten_dot}</h3>
                      <p className="text-gray-600 text-sm mt-1">{batch.mo_ta}</p>
                    </div>
                    <div className="flex items-center ml-4">
                      {getStatusIcon(batch.trang_thai)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(batch.trang_thai)}`}>
                        {getStatusText(batch.trang_thai)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {new Date(batch.thoi_gian_bat_dau || '').toLocaleDateString('vi-VN')} - {' '}
                        {new Date(batch.thoi_gian_ket_thuc || '').toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{batch.soDoanhNghiepThamGia || 0} doanh nghiệp</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{batch.soSinhVienThamGia || 0} sinh viên</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <Eye className="w-4 h-4 mr-1 inline" />
                      Xem chi tiết
                    </button>
                    
                    {canRegisterOrEdit(batch.trang_thai) ? (
                      <button 
                        onClick={() => handleRegister(batch)}
                        className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4 mr-1 inline" />
                        Đăng ký tham gia
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="px-4 py-2 text-sm text-gray-400 bg-gray-100 rounded-lg cursor-not-allowed"
                      >
                        <AlertCircle className="w-4 h-4 mr-1 inline" />
                        Không thể đăng ký
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Registration Form Modal */}
      {showRegistrationForm && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Đăng ký tham gia: {selectedBatch.ten_dot}
                </h3>
                <button
                  onClick={() => setShowRegistrationForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vị trí tuyển *
                    </label>
                    <input
                      type="text"
                      name="viTriTuyen"
                      value={formData.viTriTuyen}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: Thực tập sinh lập trình"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số lượng tuyển *
                    </label>
                    <input
                      type="number"
                      name="soLuongTuyen"
                      value={formData.soLuongTuyen}
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
                    name="yeuCauKyNang"
                    value={formData.yeuCauKyNang}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả yêu cầu kỹ năng cho vị trí này..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả công việc *
                  </label>
                  <textarea
                    name="moTaCongViec"
                    value={formData.moTaCongViec}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả chi tiết công việc thực tập sinh sẽ làm..."
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
                      name="luongKhoang"
                      value={formData.luongKhoang}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="VD: 3-5 triệu/tháng"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ làm việc *
                    </label>
                    <input
                      type="text"
                      name="diaChiLamViec"
                      value={formData.diaChiLamViec}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Địa chỉ cụ thể nơi làm việc"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ghi chú thêm
                  </label>
                  <textarea
                    name="ghiChu"
                    value={formData.ghiChu}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Thông tin thêm (không bắt buộc)..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowRegistrationForm(false)}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Đăng ký tham gia
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyInternshipRegistration;