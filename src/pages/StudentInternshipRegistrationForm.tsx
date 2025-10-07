import React, { useState, useEffect } from 'react';
import { BookOpen, Building, User, Phone, Mail, MapPin, FileText, AlertCircle, CheckCircle, Save } from 'lucide-react';
import { useStudentInternship } from '../hooks/useStudentInternship';
import { useNotificationTriggers } from '../hooks/useNotificationTriggers';
import RegistrationCountdown from '../components/RegistrationCountdown';

interface StudentProfile {
  id: number;
  ma_sinh_vien: string;
  ho_ten: string;
  lop: string;
  khoa: string;
  nganh: string;
  so_dien_thoai: string;
  email_ca_nhan: string;
  dia_chi: string;
  gpa?: number | null;
  nguyen_vong_thuc_tap?: string;
  vi_tri_muon_ung_tuyen_thuc_tap?: string;
  don_vi_thuc_tap?: string;
  cong_ty_tu_lien_he?: string;
  dia_chi_cong_ty?: string;
  nguoi_lien_he_cong_ty?: string;
  sdt_nguoi_lien_he?: string;
}

interface RegistrationFormData {
  nguyen_vong_thuc_tap: 'khoa_gioi_thieu' | 'tu_lien_he';
  vi_tri_muon_ung_tuyen_thuc_tap: string;
  don_vi_thuc_tap?: string;
  cong_ty_tu_lien_he?: string;
  dia_chi_cong_ty?: string;
  nguoi_lien_he_cong_ty?: string;
  sdt_nguoi_lien_he?: string;
}

const StudentInternshipRegistrationForm: React.FC = () => {
  const { loading, error, getMyProfile, submitInternshipRegistration } = useStudentInternship();
  const { triggerRegistrationSuccess } = useNotificationTriggers();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [formData, setFormData] = useState<RegistrationFormData>({
    nguyen_vong_thuc_tap: 'khoa_gioi_thieu',
    vi_tri_muon_ung_tuyen_thuc_tap: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const profile = await getMyProfile();
        if (profile) {
          setStudentProfile(profile);
          // Pre-fill form if student already has registration data
          if (profile.nguyen_vong_thuc_tap) {
            setFormData(prev => ({
              ...prev,
              nguyen_vong_thuc_tap: profile.nguyen_vong_thuc_tap as 'khoa_gioi_thieu' | 'tu_lien_he',
              vi_tri_muon_ung_tuyen_thuc_tap: profile.vi_tri_muon_ung_tuyen_thuc_tap || '',
              don_vi_thuc_tap: profile.don_vi_thuc_tap || '',
              cong_ty_tu_lien_he: profile.cong_ty_tu_lien_he || '',
              dia_chi_cong_ty: profile.dia_chi_cong_ty || '',
              nguoi_lien_he_cong_ty: profile.nguoi_lien_he_cong_ty || '',
              sdt_nguoi_lien_he: profile.sdt_nguoi_lien_he || ''
            }));
          }
        } else {
          setMessage({ type: 'error', text: 'Không thể tải thông tin sinh viên. Vui lòng thử lại sau.' });
        }
      } catch (err) {
        console.error('Error fetching student profile:', err);
        setMessage({ type: 'error', text: 'Không thể tải thông tin sinh viên. Vui lòng thử lại sau.' });
      }
    };

    fetchStudentProfile();
  }, []); // Empty dependency array - only run once on mount

  const handleInputChange = (field: keyof RegistrationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check registration period first
    try {
      const response = await fetch('http://localhost:3001/api/registration/check');
      const result = await response.json();
      
      if (!result.success || !result.data.is_open) {
        setMessage({ type: 'error', text: 'Hiện tại không trong thời gian đăng ký thực tập. Vui lòng đăng ký trong thời gian quy định.' });
        return;
      }
    } catch (error) {
      console.error('Error checking registration period:', error);
      setMessage({ type: 'error', text: 'Không thể kiểm tra thời gian đăng ký. Vui lòng thử lại.' });
      return;
    }
    
    if (!formData.vi_tri_muon_ung_tuyen_thuc_tap) {
      setMessage({ type: 'error', text: 'Vui lòng chọn vị trí thực tập mong muốn' });
      return;
    }

    if (formData.nguyen_vong_thuc_tap === 'tu_lien_he') {
      if (!formData.cong_ty_tu_lien_he || !formData.dia_chi_cong_ty || !formData.nguoi_lien_he_cong_ty || !formData.sdt_nguoi_lien_he) {
        setMessage({ type: 'error', text: 'Vui lòng điền đầy đủ thông tin công ty khi chọn tự liên hệ' });
        return;
      }
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const success = await submitInternshipRegistration(formData);
      if (success) {
        setMessage({ type: 'success', text: 'Đăng ký thực tập thành công!' });
        // Trigger notification
        triggerRegistrationSuccess('internship');
        // Try to get updated student object from the hook
        const updated: any = (submitInternshipRegistration as any).lastUpdatedStudent;
        if (updated) {
          setStudentProfile(prev => prev ? ({ ...prev, ...updated }) : updated);
          // Also prefill form fields from updated data
          setFormData(prev => ({
            ...prev,
            vi_tri_muon_ung_tuyen_thuc_tap: updated.vi_tri_muon_ung_tuyen_thuc_tap || prev.vi_tri_muon_ung_tuyen_thuc_tap,
            nguyen_vong_thuc_tap: updated.nguyen_vong_thuc_tap || prev.nguyen_vong_thuc_tap,
            don_vi_thuc_tap: updated.don_vi_thuc_tap || prev.don_vi_thuc_tap,
            cong_ty_tu_lien_he: updated.cong_ty_tu_lien_he || prev.cong_ty_tu_lien_he,
            dia_chi_cong_ty: updated.dia_chi_cong_ty || prev.dia_chi_cong_ty,
            nguoi_lien_he_cong_ty: updated.nguoi_lien_he_cong_ty || prev.nguoi_lien_he_cong_ty,
            sdt_nguoi_lien_he: updated.sdt_nguoi_lien_he || prev.sdt_nguoi_lien_he
          }));
        }
      } else {
        setMessage({ type: 'error', text: error || 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.' });
      }
    } catch (err) {
      console.error('Error submitting registration:', err);
      setMessage({ type: 'error', text: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-center">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!studentProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không thể tải thông tin sinh viên</h2>
          <p className="text-gray-600 mb-4">Vui lòng thử lại sau hoặc liên hệ với quản trị viên.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Enhanced Modern Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl p-8 mb-8 text-white overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    Đăng ký Thực tập
                  </h1>
                  <p className="text-blue-100 text-lg font-medium">Bước quan trọng trong hành trình học tập của bạn</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100">Hệ thống hoạt động</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-blue-100">Thời gian đăng ký có hạn</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full flex items-center justify-center backdrop-blur-sm">
                <BookOpen className="h-16 w-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        {/* Registration Countdown */}
        <RegistrationCountdown className="mb-6" />

        {/* Enhanced Message */}
        {message && (
          <div className={`mb-8 p-6 rounded-2xl flex items-start space-x-4 shadow-lg backdrop-blur-sm ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200/50' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200/50'
          }`}>
            <div className={`p-2 rounded-xl ${
              message.type === 'success' ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-6 w-6" />
              ) : (
                <AlertCircle className="h-6 w-6" />
              )}
            </div>
            <div className="flex-1">
              <div className={`font-semibold text-lg mb-1 ${
                message.type === 'success' ? 'text-green-900' : 'text-red-900'
              }`}>
                {message.type === 'success' ? 'Thành công!' : 'Thông báo lỗi'}
              </div>
              <p className="text-base">{message.text}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Enhanced Student Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Thông tin Sinh viên</h2>
                  <p className="text-gray-600 font-medium">Thông tin cá nhân của bạn</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl">
                <span className="text-sm font-semibold text-blue-800">Chỉ đọc</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="block text-sm font-bold text-gray-800 mb-3">Mã sinh viên</label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentProfile.ma_sinh_vien}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 text-gray-800 font-semibold shadow-inner group-hover:border-blue-300 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="group">
                <label className="block text-sm font-bold text-gray-800 mb-3">Họ và tên</label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentProfile.ho_ten}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 text-gray-800 font-semibold shadow-inner group-hover:border-blue-300 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="group">
                <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <span>GPA</span>
                  <div className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-xs font-medium">Điểm trung bình</div>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentProfile.gpa !== undefined && studentProfile.gpa !== null ? String(studentProfile.gpa) : '-'}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-yellow-50 text-gray-800 font-semibold shadow-inner group-hover:border-yellow-300 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="group">
                <label className="block text-sm font-bold text-gray-800 mb-3">Lớp</label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentProfile.lop}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-purple-50 text-gray-800 font-semibold shadow-inner group-hover:border-purple-300 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="group">
                <label className="block text-sm font-bold text-gray-800 mb-3">Khoa</label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentProfile.khoa}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-indigo-50 text-gray-800 font-semibold shadow-inner group-hover:border-indigo-300 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="group">
                <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <div className="p-1 bg-green-100 rounded-lg mr-2">
                    <Phone className="h-4 w-4 text-green-600" />
                  </div>
                  Số điện thoại
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentProfile.so_dien_thoai}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-green-50 text-gray-800 font-semibold shadow-inner group-hover:border-green-300 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="group">
                <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <div className="p-1 bg-blue-100 rounded-lg mr-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  Email cá nhân
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={studentProfile.email_ca_nhan}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 text-gray-800 font-semibold shadow-inner group-hover:border-blue-300 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </div>
              
              <div className="md:col-span-2 group">
                <label className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                  <div className="p-1 bg-red-100 rounded-lg mr-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                  </div>
                  Địa chỉ thường trú
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={studentProfile.dia_chi}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl bg-gradient-to-r from-gray-50 to-red-50 text-gray-800 font-semibold shadow-inner group-hover:border-red-300 transition-all duration-200"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Registration Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Thông tin Đăng ký Thực tập</h2>
                  <p className="text-gray-600 font-medium">Vui lòng điền thông tin dưới đây</p>
                </div>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl">
                <span className="text-sm font-semibold text-green-800">Bắt buộc</span>
              </div>
            </div>

            {/* Enhanced Nguyện vọng thực tập */}
            <div className="mb-8">
              <label className="block text-base font-bold text-gray-800 mb-4">
                Nguyện vọng thực tập <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  formData.nguyen_vong_thuc_tap === 'khoa_gioi_thieu' 
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }`}>
                  <input
                    type="radio"
                    name="nguyen_vong_thuc_tap"
                    value="khoa_gioi_thieu"
                    checked={formData.nguyen_vong_thuc_tap === 'khoa_gioi_thieu'}
                    onChange={(e) => handleInputChange('nguyen_vong_thuc_tap', e.target.value as 'khoa_gioi_thieu')}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-semibold text-gray-900">Khoa giới thiệu</div>
                    <div className="text-sm text-gray-600 mt-1">Khoa sẽ sắp xếp vị trí thực tập phù hợp</div>
                  </div>
                  {formData.nguyen_vong_thuc_tap === 'khoa_gioi_thieu' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </label>
                
                <label className={`relative flex items-center p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  formData.nguyen_vong_thuc_tap === 'tu_lien_he' 
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                }`}>
                  <input
                    type="radio"
                    name="nguyen_vong_thuc_tap"
                    value="tu_lien_he"
                    checked={formData.nguyen_vong_thuc_tap === 'tu_lien_he'}
                    onChange={(e) => handleInputChange('nguyen_vong_thuc_tap', e.target.value as 'tu_lien_he')}
                    className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-semibold text-gray-900">Tự liên hệ</div>
                    <div className="text-sm text-gray-600 mt-1">Bạn đã có công ty muốn thực tập</div>
                  </div>
                  {formData.nguyen_vong_thuc_tap === 'tu_lien_he' && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </label>
              </div>
              {formData.nguyen_vong_thuc_tap === 'tu_lien_he' && (
                <div className="mt-6 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 rounded-2xl shadow-sm">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-amber-100 rounded-xl">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-900 mb-2">Lưu ý quan trọng</h4>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        Khi chọn "Tự liên hệ", bạn cần điền đầy đủ và chính xác thông tin công ty, địa chỉ, người liên hệ và số điện thoại. Thông tin này sẽ được sử dụng để liên lạc và xác nhận quá trình thực tập.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Vị trí thực tập mong muốn */}
            <div className="mb-8">
              <label className="block text-base font-bold text-gray-800 mb-4">
                Vị trí thực tập mong muốn <span className="text-red-500 text-lg">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.vi_tri_muon_ung_tuyen_thuc_tap}
                  onChange={(e) => handleInputChange('vi_tri_muon_ung_tuyen_thuc_tap', e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-800 font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-300 transition-all duration-200 appearance-none cursor-pointer"
                  required
                >
                  <option value="">-- Chọn vị trí thực tập mong muốn --</option>
                  <option value="Lập trình viên (Developer)">💻 Lập trình viên (Developer)</option>
                  <option value="Thiết kế website">🎨 Thiết kế website</option>
                  <option value="Phân tích & thiết kế hệ thống">📊 Phân tích & thiết kế hệ thống</option>
                  <option value="Quản trị mạng">🌐 Quản trị mạng</option>
                  <option value="Quản trị cơ sở dữ liệu">💾 Quản trị cơ sở dữ liệu</option>
                  <option value="Tester">🧪 Tester (Kiểm thử phần mềm)</option>
                  <option value="Hỗ trợ kỹ thuật (IT Support)">🔧 Hỗ trợ kỹ thuật (IT Support)</option>
                  <option value="AI & IoT">🤖 AI & IoT</option>
                  <option value="Khác">✨ Khác</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {formData.vi_tri_muon_ung_tuyen_thuc_tap && (
                <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <p className="text-sm text-blue-800 font-medium">
                    ✅ Đã chọn: <span className="font-bold">{formData.vi_tri_muon_ung_tuyen_thuc_tap}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Company Information - Only show when "tu_lien_he" is selected */}
            {formData.nguyen_vong_thuc_tap === 'tu_lien_he' && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2 text-blue-600" />
                  Thông tin Công ty
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên công ty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cong_ty_tu_lien_he || ''}
                      onChange={(e) => handleInputChange('cong_ty_tu_lien_he', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập tên công ty"
                      required={formData.nguyen_vong_thuc_tap === 'tu_lien_he'}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ công ty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.dia_chi_cong_ty || ''}
                      onChange={(e) => handleInputChange('dia_chi_cong_ty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập địa chỉ công ty"
                      required={formData.nguyen_vong_thuc_tap === 'tu_lien_he'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Người liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nguoi_lien_he_cong_ty || ''}
                      onChange={(e) => handleInputChange('nguoi_lien_he_cong_ty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tên người liên hệ"
                      required={formData.nguyen_vong_thuc_tap === 'tu_lien_he'}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.sdt_nguoi_lien_he || ''}
                      onChange={(e) => handleInputChange('sdt_nguoi_lien_he', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Số điện thoại"
                      required={formData.nguyen_vong_thuc_tap === 'tu_lien_he'}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Company selection for khoa_gioi_thieu */}
            {formData.nguyen_vong_thuc_tap === 'khoa_gioi_thieu' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đơn vị thực tập mong muốn
                </label>
                <input
                  type="text"
                  value={formData.don_vi_thuc_tap || ''}
                  onChange={(e) => handleInputChange('don_vi_thuc_tap', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tên đơn vị/công ty mong muốn (không bắt buộc)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Bạn có thể để trống nếu muốn khoa sắp xếp
                </p>
              </div>
            )}
          </div>

          {/* Enhanced Submit Button */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="text-sm text-gray-600">
                <p className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Thông tin sẽ được lưu an toàn và bảo mật
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="px-8 py-4 border-2 border-gray-300 rounded-2xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:from-blue-700 hover:to-purple-700 font-bold disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Đăng ký Thực tập
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentInternshipRegistrationForm;