import React, { useState } from 'react';
import { X, Calendar, FileText, Clock } from 'lucide-react';

interface CreateBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (batchData: any) => Promise<void>;
  loading?: boolean;
}

const CreateBatchModal: React.FC<CreateBatchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    ten_dot: '',
    thoi_gian_bat_dau: '',
    thoi_gian_ket_thuc: '',
    mo_ta: '',
    trang_thai: 'sap-mo'
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.ten_dot.trim()) {
      newErrors.ten_dot = 'Vui lòng nhập tên đợt thực tập';
    }
    
    if (!formData.thoi_gian_bat_dau) {
      newErrors.thoi_gian_bat_dau = 'Vui lòng chọn ngày bắt đầu';
    }
    
    if (!formData.thoi_gian_ket_thuc) {
      newErrors.thoi_gian_ket_thuc = 'Vui lòng chọn ngày kết thúc';
    }
    
    if (formData.thoi_gian_bat_dau && formData.thoi_gian_ket_thuc) {
      if (new Date(formData.thoi_gian_bat_dau) >= new Date(formData.thoi_gian_ket_thuc)) {
        newErrors.thoi_gian_ket_thuc = 'Ngày kết thúc phải sau ngày bắt đầu';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      await onSubmit(formData);
      // Reset form after successful submission
      setFormData({
        ten_dot: '',
        thoi_gian_bat_dau: '',
        thoi_gian_ket_thuc: '',
        mo_ta: '',
        trang_thai: 'sap-mo'
      });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error creating batch:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      ten_dot: '',
      thoi_gian_bat_dau: '',
      thoi_gian_ket_thuc: '',
      mo_ta: '',
      trang_thai: 'sap-mo'
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tạo đợt thực tập mới</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tên đợt thực tập */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đợt thực tập *
            </label>
            <input
              type="text"
              name="ten_dot"
              value={formData.ten_dot}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.ten_dot ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="VD: Đợt thực tập Xuân 2025"
              disabled={loading}
            />
            {errors.ten_dot && (
              <p className="mt-1 text-sm text-red-600">{errors.ten_dot}</p>
            )}
          </div>

          {/* Ngày bắt đầu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="thoi_gian_bat_dau"
                value={formData.thoi_gian_bat_dau}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.thoi_gian_bat_dau ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
            </div>
            {errors.thoi_gian_bat_dau && (
              <p className="mt-1 text-sm text-red-600">{errors.thoi_gian_bat_dau}</p>
            )}
          </div>

          {/* Ngày kết thúc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày kết thúc *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="thoi_gian_ket_thuc"
                value={formData.thoi_gian_ket_thuc}
                onChange={handleChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.thoi_gian_ket_thuc ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
            </div>
            {errors.thoi_gian_ket_thuc && (
              <p className="mt-1 text-sm text-red-600">{errors.thoi_gian_ket_thuc}</p>
            )}
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                name="trang_thai"
                value={formData.trang_thai}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="sap-mo">Sắp mở</option>
                <option value="dang-dien-ra">Đang diễn ra</option>
                <option value="ket-thuc">Kết thúc</option>
              </select>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <textarea
                name="mo_ta"
                value={formData.mo_ta}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Mô tả về đợt thực tập này..."
                disabled={loading}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
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
              {loading ? 'Đang tạo...' : 'Tạo đợt thực tập'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBatchModal;