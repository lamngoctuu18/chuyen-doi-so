import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface RegistrationCountdownProps {
  className?: string;
}

const RegistrationCountdown: React.FC<RegistrationCountdownProps> = ({ className = '' }) => {
  const [registrationStatus, setRegistrationStatus] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrationStatus();
    const interval = setInterval(fetchRegistrationStatus, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (registrationStatus?.timeUntilStart || registrationStatus?.timeUntilEnd) {
      const countdownInterval = setInterval(updateCountdown, 1000);
      return () => clearInterval(countdownInterval);
    }
  }, [registrationStatus]);

  const fetchRegistrationStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/registration/check');
      const result = await response.json();
      
      if (result.success) {
        setRegistrationStatus(result.data);
      }
    } catch (error) {
      console.error('Error fetching registration status:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCountdown = () => {
    if (!registrationStatus) return;

    let targetTime: number | null = null;
    
    if (registrationStatus.status === 'before_start' && registrationStatus.timeUntilStart) {
      targetTime = registrationStatus.timeUntilStart;
    } else if (registrationStatus.status === 'active' && registrationStatus.timeUntilEnd) {
      targetTime = registrationStatus.timeUntilEnd;
    }

    if (targetTime) {
      const now = Date.now();
      const distance = targetTime - (now - new Date(registrationStatus.period?.created_at || 0).getTime());
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft(null);
        // Refresh status when countdown ends
        fetchRegistrationStatus();
      }
    }
  };

  const formatDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleString('vi-VN');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'before_start':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'ended':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'before_start':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'active':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'ended':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={`p-4 bg-gray-50 rounded-lg border ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!registrationStatus || registrationStatus.status === 'no_period') {
    return (
      <div className={`p-4 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="font-semibold text-gray-900">Chưa có thông tin đăng ký</h3>
            <p className="text-sm text-gray-600">Chưa có đợt đăng ký thực tập nào được thiết lập</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded-lg ${getStatusColor(registrationStatus.status)} ${className}`}>
      <div className="flex items-start gap-3">
        {getStatusIcon(registrationStatus.status)}
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">
            {registrationStatus.period?.title || 'Đợt đăng ký thực tập'}
          </h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {formatDateTime(registrationStatus.period?.start_time)} - {formatDateTime(registrationStatus.period?.end_time)}
              </span>
            </div>
            
            <p className="font-medium">{registrationStatus.message}</p>
            
            {registrationStatus.period?.description && (
              <p className="text-sm opacity-90">{registrationStatus.period.description}</p>
            )}
          </div>

          {/* Countdown Timer */}
          {timeLeft && (
            <div className="mt-4 p-3 bg-white bg-opacity-70 rounded-lg">
              <div className="text-center">
                <p className="text-sm font-medium mb-2">
                  {registrationStatus.status === 'before_start' 
                    ? 'Thời gian còn lại đến khi mở đăng ký:' 
                    : 'Thời gian còn lại để đăng ký:'}
                </p>
                <div className="flex justify-center gap-4 text-lg font-bold">
                  <div className="text-center">
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                      {timeLeft.days}
                    </div>
                    <div className="text-xs mt-1">Ngày</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                      {timeLeft.hours}
                    </div>
                    <div className="text-xs mt-1">Giờ</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                      {timeLeft.minutes}
                    </div>
                    <div className="text-xs mt-1">Phút</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
                      {timeLeft.seconds}
                    </div>
                    <div className="text-xs mt-1">Giây</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Messages */}
          {registrationStatus.status === 'ended' && (
            <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
              <strong>Đã hết hạn đăng ký.</strong> Vui lòng liên hệ với giảng viên hoặc phòng đào tạo nếu cần hỗ trợ.
            </div>
          )}

          {registrationStatus.status === 'active' && (
            <div className="mt-3 p-2 bg-green-100 border border-green-300 rounded text-green-800 text-sm">
              <strong>Đang trong thời gian đăng ký!</strong> Hãy hoàn thành đăng ký thực tập ngay bây giờ.
            </div>
          )}

          {registrationStatus.status === 'before_start' && (
            <div className="mt-3 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-sm">
              <strong>Sẵn sàng cho đăng ký!</strong> Đăng ký sẽ mở trong thời gian sắp tới.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationCountdown;