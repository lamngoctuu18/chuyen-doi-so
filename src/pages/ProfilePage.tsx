import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useChangePassword } from '../hooks/useChangePassword';
import ChangePasswordModal from '../components/ChangePasswordButton';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { isModalOpen, openModal, closeModal, handleSuccess } = useChangePassword();
  const [formData, setFormData] = useState({
    ho_ten: '',
    email: '',
    so_dien_thoai: '',
    dia_chi: '',
    // Sinh viên
    ma_sinh_vien: '',
    lop: '',
    khoa: '',
    nganh_hoc: '',
    // Giảng viên
    ma_giang_vien: '',
    bo_mon: '',
    hoc_vi: '',
    chuyen_mon: '',
    // Doanh nghiệp
    ten_cong_ty: '',
    dia_chi_cong_ty: '',
    so_dien_thoai_cong_ty: '',
    email_cong_ty: '',
    website: '',
    linh_vuc_hoat_dong: '',
    so_nhan_vien: '',
    mo_ta: '',
    // Admin
    chuc_vu: '',
    phong_ban: ''
  });

  // Load profile data when component mounts
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3001/api/profile/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success && data.data.profile) {
        let profile = data.data.profile;
        // If current user is a student, prefer fetching sinh_vien-specific data
        try {
          if (user?.role === 'sinh-vien') {
            const svResp = await fetch('http://localhost:3001/api/sinh-vien/my-registration', {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (svResp.ok) {
              const svData = await svResp.json();
              if (svData.success && svData.data) {
                // Merge student-specific fields into profile (sv fields take precedence)
                profile = { ...profile, ...svData.data };
              }
            }
          }
        } catch (innerErr) {
          console.warn('Could not fetch sinh-vien data, falling back to profile/me', innerErr);
        }
        setProfileData(profile);
        
        // Set form data based on profile - mapping different field names
        setFormData({
          ho_ten: profile.ho_ten || '',
          email: profile.email || profile.email_ca_nhan || '',
          so_dien_thoai: profile.so_dien_thoai || '',
          dia_chi: profile.dia_chi || '',
          // Sinh viên
          ma_sinh_vien: profile.ma_sinh_vien || profile.maSinhVien || '',
          lop: profile.lop || '',
          khoa: profile.khoa || '',
          nganh_hoc: profile.nganh || profile.nganh_hoc || profile.nganh || '', // nganh in DB
          // Giảng viên
          ma_giang_vien: profile.ma_giang_vien || '',
          bo_mon: profile.bo_mon || '',
          hoc_vi: profile.hoc_vi || '',
          chuyen_mon: profile.chuyen_mon || '',
          // Doanh nghiệp
          ten_cong_ty: profile.ten_cong_ty || '',
          dia_chi_cong_ty: profile.dia_chi_cong_ty || '',
          so_dien_thoai_cong_ty: profile.so_dien_thoai_cong_ty || '',
          email_cong_ty: profile.email_cong_ty || '',
          website: profile.website || '',
          linh_vuc_hoat_dong: profile.linh_vuc_hoat_dong || '',
          so_nhan_vien: profile.so_nhan_vien || '',
          mo_ta: profile.mo_ta || '',
          // Admin
          chuc_vu: profile.chuc_vu || '',
          phong_ban: profile.phong_ban || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Không thể tải thông tin cá nhân' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setMessage(null);

      const response = await fetch('http://localhost:3001/api/profile/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Cập nhật thông tin cá nhân thành công!' });
        setIsEditing(false);
        
        // Reload profile to get updated data
        await loadProfile();
        
        // Update user context if name changed
        if (formData.ho_ten && user) {
          const updatedUser = { ...user, name: formData.ho_ten };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Không thể cập nhật thông tin' });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({ type: 'error', text: 'Lỗi kết nối server' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original profile data
    if (profileData) {
      setFormData({
        ho_ten: profileData.ho_ten || '',
        email: profileData.email || profileData.email_ca_nhan || '',
        so_dien_thoai: profileData.so_dien_thoai || '',
        dia_chi: profileData.dia_chi || '',
        // Sinh viên
        ma_sinh_vien: profileData.ma_sinh_vien || '',
        lop: profileData.lop || '',
        khoa: profileData.khoa || '',
        nganh_hoc: profileData.nganh || profileData.nganh_hoc || '',
        // Giảng viên
        ma_giang_vien: profileData.ma_giang_vien || '',
        bo_mon: profileData.bo_mon || '',
        hoc_vi: profileData.hoc_vi || '',
        chuyen_mon: profileData.chuyen_mon || '',
        // Doanh nghiệp
        ten_cong_ty: profileData.ten_cong_ty || '',
        dia_chi_cong_ty: profileData.dia_chi_cong_ty || '',
        so_dien_thoai_cong_ty: profileData.so_dien_thoai_cong_ty || '',
        email_cong_ty: profileData.email_cong_ty || '',
        website: profileData.website || '',
        linh_vuc_hoat_dong: profileData.linh_vuc_hoat_dong || '',
        so_nhan_vien: profileData.so_nhan_vien || '',
        mo_ta: profileData.mo_ta || '',
        // Admin
        chuc_vu: profileData.chuc_vu || '',
        phong_ban: profileData.phong_ban || ''
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'Quản trị viên';
      case 'sinh-vien': return 'Sinh viên';
      case 'giang-vien': return 'Giảng viên';
      case 'doanh-nghiep': return 'Doanh nghiệp';
      default: return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'sinh-vien': return 'bg-blue-100 text-blue-800';
      case 'giang-vien': return 'bg-green-100 text-green-800';
      case 'doanh-nghiep': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Vui lòng đăng nhập để xem thông tin cá nhân.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Chỉnh sửa
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            {/* Avatar */}
            <div className="relative mx-auto w-32 h-32 mb-4">
              <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {(profileData?.ho_ten || user?.name || 'N').charAt(0).toUpperCase()}
                </span>
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Basic Info */}
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {profileData?.ho_ten || user?.name || 'Chưa cập nhật'}
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user?.role || '')}`}>
              {getRoleText(user?.role || '')}
            </span>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">4.8</div>
                <div className="text-sm text-gray-600">Đánh giá</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Dự án</div>
              </div>
            </div>

            {/* Join Date */}
            <div className="mt-6 flex items-center justify-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Tham gia từ tháng 1, 2025</span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="ho_ten"
                    value={formData.ho_ten}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <User className="w-4 h-4 mr-2 text-gray-500" />
                    {profileData?.ho_ten || user?.name || 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Mail className="w-4 h-4 mr-2 text-gray-500" />
                    {profileData?.email || profileData?.email_ca_nhan || user?.email || 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="so_dien_thoai"
                    value={formData.so_dien_thoai}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    {profileData?.so_dien_thoai || user?.phone || 'Chưa cập nhật'}
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="dia_chi"
                    value={formData.dia_chi}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center text-gray-900">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {profileData?.dia_chi || 'Chưa cập nhật'}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới thiệu bản thân
              </label>
              {isEditing ? (
                <textarea
                  name="mo_ta"
                  rows={4}
                  value={formData.mo_ta}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Viết vài dòng giới thiệu về bản thân..."
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[100px]">
                  {profileData?.mo_ta || 'Chưa có thông tin giới thiệu'}
                </p>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảo mật</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Mật khẩu</h4>
                  <p className="text-sm text-gray-600">Thay đổi mật khẩu của bạn</p>
                </div>
                <button 
                  onClick={openModal}
                  className="px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Đổi mật khẩu
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Xác thực 2 bước</h4>
                  <p className="text-sm text-gray-600">Tăng cường bảo mật tài khoản</p>
                </div>
                <button className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  Kích hoạt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ProfilePage;