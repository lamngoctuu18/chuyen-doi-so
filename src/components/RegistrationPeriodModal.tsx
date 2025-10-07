import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Info } from 'lucide-react';

interface RegistrationPeriod {
  id?: number;
  title: string;
  start_time: string;
  end_time: string;
  description?: string;
  is_active?: boolean;
}

interface RegistrationPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RegistrationPeriodModal: React.FC<RegistrationPeriodModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<RegistrationPeriod>({
    title: '',
    start_time: '',
    end_time: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchCurrentPeriod();
    }
  }, [isOpen]);

  const fetchCurrentPeriod = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/registration/period');
      const result = await response.json();
      
      if (result.success && result.data.period) {
        const period = result.data.period;
        setCurrentPeriod(result.data);
        
        // Pre-fill form with current period data
        setFormData({
          title: period.title || '',
          start_time: period.start_time ? new Date(period.start_time).toISOString().slice(0, 16) : '',
          end_time: period.end_time ? new Date(period.end_time).toISOString().slice(0, 16) : '',
          description: period.description || ''
        });
      } else {
        // No current period, use default values
        setFormData({
          title: 'Đợt đăng ký thực tập',
          start_time: '',
          end_time: '',
          description: ''
        });
      }
    } catch (error) {
      console.error('Error fetching current period:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.start_time || !formData.end_time) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const startDate = new Date(formData.start_time);
    const endDate = new Date(formData.end_time);
    
    if (startDate >= endDate) {
      alert('Thời gian bắt đầu phải trước thời gian kết thúc');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/registration/period', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      
      if (result.success) {
        alert('Thiết lập thời gian đăng ký thành công!');
        onSuccess();
        onClose();
      } else {
        alert(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error creating registration period:', error);
      alert('Có lỗi xảy ra khi thiết lập thời gian đăng ký');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleString('vi-VN');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'before_start': return 'Chưa mở';
      case 'active': return 'Đang mở';
      case 'ended': return 'Đã đóng';
      default: return 'Chưa thiết lập';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'before_start': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quản lý thời gian đăng ký thực tập</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Status */}
        {currentPeriod && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">Trạng thái hiện tại</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Trạng thái:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentPeriod.status)}`}>
                  {getStatusText(currentPeriod.status)}
                </span>
              </div>
              {currentPeriod.period && (
                <>
                  <div className="flex items-center justify-between">
                    <span>Tiêu đề:</span>
                    <span className="font-medium">{currentPeriod.period.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bắt đầu:</span>
                    <span>{formatDateTime(currentPeriod.period.start_time)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Kết thúc:</span>
                    <span>{formatDateTime(currentPeriod.period.end_time)}</span>
                  </div>
                </>
              )}
              <p className="text-blue-700 font-medium">{currentPeriod.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tiêu đề đợt đăng ký *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ví dụ: Đợt đăng ký thực tập kỳ 1 năm 2024"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Thời gian bắt đầu *
              </label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="w-4 h-4 inline mr-1" />
                Thời gian kết thúc *
              </label>
              <input
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Mô tả thêm về đợt đăng ký..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationPeriodModal;