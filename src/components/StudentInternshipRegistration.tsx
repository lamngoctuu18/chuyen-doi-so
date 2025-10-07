import React, { useState, useEffect } from 'react';
import { Search, Calendar, Building, Users, MapPin, DollarSign, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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
}

interface Company {
  dang_ky_id: number;
  vi_tri_tuyen: string;
  so_luong_tuyen: number;
  yeu_cau_ky_nang: string;
  mo_ta_cong_viec: string;
  luong_khoang: string;
  dia_chi_lam_viec: string;
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
  so_sinh_vien_duyet: number;
}

interface StudentRegistration {
  id: number;
  ngay_dang_ky: string;
  trang_thai: string;
  ly_do_tu_choi: string;
  vi_tri_tuyen: string;
  ten_cong_ty: string;
  ten_dot: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
}

const StudentInternshipRegistration: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'batches' | 'my-registrations'>('batches');
  const [batches, setBatches] = useState<InternshipBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<InternshipBatch | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [myRegistrations, setMyRegistrations] = useState<StudentRegistration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registrationNote, setRegistrationNote] = useState('');

  // Fetch available batches
  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/student-registrations/batches?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setBatches(result.data.batches);
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies in batch
  const fetchCompanies = async (batchId: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/student-registrations/batches/${batchId}/companies`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setCompanies(result.data.companies);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my registrations
  const fetchMyRegistrations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/student-registrations/my-registrations', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setMyRegistrations(result.data);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Register with company
  const handleRegister = async () => {
    if (!selectedCompany) return;

    try {
      const response = await fetch('http://localhost:3001/api/student-registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          dang_ky_doanh_nghiep_id: selectedCompany.dang_ky_id,
          ghi_chu: registrationNote
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Đăng ký thành công! Vui lòng chờ doanh nghiệp phản hồi.');
        setShowRegisterModal(false);
        setRegistrationNote('');
        setSelectedCompany(null);
        // Refresh companies list
        if (selectedBatch) {
          fetchCompanies(selectedBatch.id);
        }
      } else {
        alert(`Lỗi: ${result.message}`);
      }
    } catch (error) {
      console.error('Error registering:', error);
      alert('Có lỗi xảy ra khi đăng ký!');
    }
  };

  useEffect(() => {
    if (activeTab === 'batches') {
      fetchBatches();
    } else {
      fetchMyRegistrations();
    }
  }, [activeTab, searchTerm]);

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

  if (user?.role !== 'sinh-vien') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chỉ sinh viên mới có thể truy cập trang này</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Đăng ký Thực tập</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('batches')}
              className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'batches'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Đợt thực tập
            </button>
            <button
              onClick={() => setActiveTab('my-registrations')}
              className={`py-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'my-registrations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Đăng ký của tôi
            </button>
          </nav>
        </div>

        {activeTab === 'batches' && (
          <div className="p-4 sm:p-6">
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm đợt thực tập..."
                  maxLength={250}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {!selectedBatch ? (
              /* Batches List */
              <div className="space-y-4">
                {loading && <div className="text-center py-4">Đang tải...</div>}
                {batches.map((batch) => (
                  <div key={batch.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{batch.ten_dot}</h3>
                        <p className="text-gray-600 text-sm mb-3">{batch.mo_ta}</p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
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
                            <span>{batch.so_doanh_nghiep_duyet}/{batch.so_doanh_nghiep_tham_gia} DN đã duyệt</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          batch.trang_thai === 'dang-mo' ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                        }`}>
                          {batch.trang_thai === 'dang-mo' ? 'Đang mở' : 'Đã đóng'}
                        </span>
                        
                        {batch.trang_thai === 'dang-mo' && new Date() <= new Date(batch.han_dang_ky) && (
                          <button
                            onClick={() => {
                              setSelectedBatch(batch);
                              fetchCompanies(batch.id);
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Xem doanh nghiệp
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Companies List */
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{selectedBatch.ten_dot}</h2>
                    <p className="text-gray-600">Danh sách doanh nghiệp tham gia</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedBatch(null);
                      setCompanies([]);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Quay lại
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {loading && <div className="col-span-full text-center py-4">Đang tải...</div>}
                  {companies.map((company) => (
                    <div key={company.dang_ky_id} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{company.ten_cong_ty}</h3>
                        <p className="text-blue-600 font-medium">{company.vi_tri_tuyen}</p>
                        <p className="text-gray-600 text-sm">{company.linh_vuc_hoat_dong}</p>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2" />
                          <span>Tuyển: {company.so_luong_tuyen} sinh viên</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-2" />
                          <span>{company.luong_khoang || 'Thương lượng'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span>{company.dia_chi_lam_viec}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-700">{company.mo_ta_cong_viec}</p>
                        {company.yeu_cau_ky_nang && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Yêu cầu:</strong> {company.yeu_cau_ky_nang}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                          <span>{company.so_sinh_vien_dang_ky} đã đăng ký</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
                            setShowRegisterModal(true);
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Đăng ký
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-registrations' && (
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {loading && <div className="text-center py-4">Đang tải...</div>}
              {myRegistrations.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  Bạn chưa có đăng ký nào
                </div>
              )}
              {myRegistrations.map((registration) => (
                <div key={registration.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{registration.ten_cong_ty}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(registration.trang_thai)}`}>
                          {getStatusIcon(registration.trang_thai)}
                          {getStatusText(registration.trang_thai)}
                        </span>
                      </div>
                      
                      <p className="text-blue-600 font-medium mb-1">{registration.vi_tri_tuyen}</p>
                      <p className="text-gray-600 text-sm mb-2">{registration.ten_dot}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Đăng ký: {new Date(registration.ngay_dang_ky).toLocaleDateString('vi-VN')}</span>
                        <span>Thời gian: {new Date(registration.ngay_bat_dau).toLocaleDateString('vi-VN')} - {new Date(registration.ngay_ket_thuc).toLocaleDateString('vi-VN')}</span>
                      </div>
                      
                      {registration.ly_do_tu_choi && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700">
                            <strong>Lý do từ chối:</strong> {registration.ly_do_tu_choi}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showRegisterModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Đăng ký thực tập tại {selectedCompany.ten_cong_ty}
            </h3>
            
            <div className="mb-4">
              <p className="text-blue-600 font-medium">{selectedCompany.vi_tri_tuyen}</p>
              <p className="text-sm text-gray-600">{selectedCompany.mo_ta_cong_viec}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú (tự giới thiệu, kinh nghiệm...)
              </label>
              <textarea
                value={registrationNote}
                onChange={(e) => setRegistrationNote(e.target.value)}
                placeholder="Giới thiệu bản thân, kinh nghiệm, lý do muốn thực tập tại công ty..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setRegistrationNote('');
                  setSelectedCompany(null);
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleRegister}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentInternshipRegistration;