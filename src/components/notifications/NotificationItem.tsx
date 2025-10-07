import React from 'react';
import { 
  Bell, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle, 
  Clock,
  FileText,
  UserCheck,
  Building,
  GraduationCap,
  X
} from 'lucide-react';
import { notificationHelpers } from '../../utils/notificationHelpers';
import type { Notification } from '../../types/notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
  onClick
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getActionIcon = () => {
    switch (notification.actionType) {
      case 'report_submission':
        return <FileText className="w-4 h-4" />;
      case 'report_deadline':
        return <Clock className="w-4 h-4" />;
      case 'registration':
        return <UserCheck className="w-4 h-4" />;
      case 'assignment':
        return <GraduationCap className="w-4 h-4" />;
      case 'system':
        return <Bell className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    if (!notification.isRead) {
      switch (notification.type) {
        case 'success':
          return 'bg-green-50 border-green-200';
        case 'warning':
          return 'bg-yellow-50 border-yellow-200';
        case 'error':
          return 'bg-red-50 border-red-200';
        default:
          return 'bg-blue-50 border-blue-200';
      }
    }
    return 'bg-white border-gray-200 hover:bg-gray-50';
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
    if (onClick) {
      onClick(notification);
    }
  };

  return (
    <div
      className={`p-4 border-l-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${getBgColor()}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              {getActionIcon()}
              <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                {notification.title}
              </h4>
              {!notification.isRead && (
                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
              )}
            </div>
            
            <p className={`text-sm ${!notification.isRead ? 'text-gray-700' : 'text-gray-600'}`}>
              {notification.message}
            </p>
            
            {notification.metadata && (
              <div className="mt-2 text-xs text-gray-500 space-y-1">
                {notification.metadata.studentName && (
                  <div className="flex items-center space-x-1">
                    <UserCheck className="w-3 h-3" />
                    <span>Sinh viên: {notification.metadata.studentName}</span>
                  </div>
                )}
                {notification.metadata.teacherName && (
                  <div className="flex items-center space-x-1">
                    <GraduationCap className="w-3 h-3" />
                    <span>Giảng viên: {notification.metadata.teacherName}</span>
                  </div>
                )}
                {notification.metadata.companyName && (
                  <div className="flex items-center space-x-1">
                    <Building className="w-3 h-3" />
                    <span>Doanh nghiệp: {notification.metadata.companyName}</span>
                  </div>
                )}
                {notification.metadata.weekNumber && (
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3" />
                    <span>Tuần {notification.metadata.weekNumber}</span>
                  </div>
                )}
                {notification.metadata.deadlineDate && (
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Hạn nộp: {new Date(notification.metadata.deadlineDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-500">
              {notificationHelpers.getRelativeTime(new Date(notification.createdAt))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
          {!notification.isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(notification.id);
              }}
              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
              title="Đánh dấu đã đọc"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Xóa thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;