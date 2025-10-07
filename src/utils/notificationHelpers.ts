import type { Notification } from '../types/notification';

export const createNotification = {
  // Report submission notifications
  reportSubmissionSuccess: (
    userId: string, 
    userRole: 'student' | 'teacher',
    weekNumber: number,
    teacherName?: string
  ): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => ({
    title: 'Nộp báo cáo thành công',
    message: `Báo cáo tuần ${weekNumber} đã được nộp thành công`,
    type: 'success',
    userId,
    userRole,
    actionType: 'report_submission',
    metadata: {
      weekNumber,
      teacherName,
    },
  }),

  reportDeadlineWarning: (
    userId: string,
    userRole: 'student',
    weekNumber: number,
    deadlineDate: Date,
    teacherName: string
  ): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => ({
    title: 'Sắp hết hạn nộp báo cáo',
    message: `Báo cáo tuần ${weekNumber} sắp hết hạn nộp vào ${deadlineDate.toLocaleDateString('vi-VN')}`,
    type: 'warning',
    userId,
    userRole,
    actionType: 'report_deadline',
    actionUrl: '/reports',
    metadata: {
      weekNumber,
      deadlineDate,
      teacherName,
    },
  }),

  reportDeadlineCreated: (
    userId: string,
    userRole: 'student',
    weekNumber: number,
    deadlineDate: Date,
    teacherName: string
  ): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => ({
    title: 'Có đợt nộp báo cáo mới',
    message: `Giảng viên ${teacherName} đã tạo đợt nộp báo cáo tuần ${weekNumber}. Hạn nộp: ${deadlineDate.toLocaleDateString('vi-VN')}`,
    type: 'info',
    userId,
    userRole,
    actionType: 'report_deadline',
    actionUrl: '/reports',
    metadata: {
      weekNumber,
      deadlineDate,
      teacherName,
    },
  }),

  // Registration notifications
  registrationSuccess: (
    userId: string,
    userRole: 'student',
    action: 'internship' | 'topic'
  ): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => ({
    title: 'Đăng ký thành công',
    message: action === 'internship' 
      ? 'Đăng ký thực tập đã được xử lý thành công'
      : 'Đăng ký đề tài đã được xử lý thành công',
    type: 'success',
    userId,
    userRole,
    actionType: 'registration',
  }),

  registrationStatusUpdate: (
    userId: string,
    userRole: 'student',
    status: 'approved' | 'rejected',
    details?: string
  ): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => ({
    title: status === 'approved' ? 'Đăng ký được chấp nhận' : 'Đăng ký bị từ chối',
    message: status === 'approved'
      ? 'Đăng ký của bạn đã được chấp nhận và xử lý'
      : `Đăng ký của bạn bị từ chối. ${details || 'Vui lòng liên hệ giảng viên để biết thêm chi tiết.'}`,
    type: status === 'approved' ? 'success' : 'error',
    userId,
    userRole,
    actionType: 'registration',
  }),

  // Assignment notifications
  teacherAssigned: (
    userId: string,
    userRole: 'student',
    teacherName: string
  ): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => ({
    title: 'Được phân công giảng viên',
    message: `Bạn đã được phân công giảng viên hướng dẫn: ${teacherName}`,
    type: 'info',
    userId,
    userRole,
    actionType: 'assignment',
    metadata: {
      teacherName,
    },
  }),

  companyAssigned: (
    userId: string,
    userRole: 'student',
    companyName: string,
    teacherName?: string
  ): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => ({
    title: 'Được phân công doanh nghiệp',
    message: `Bạn đã được phân công thực tập tại: ${companyName}`,
    type: 'info',
    userId,
    userRole,
    actionType: 'assignment',
    metadata: {
      companyName,
      teacherName,
    },
  }),

  // System notifications from admin
  systemAnnouncement: (
    userId: string,
    userRole: 'student' | 'teacher' | 'company',
    title: string,
    message: string,
    actionUrl?: string
  ): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => ({
    title,
    message,
    type: 'info',
    userId,
    userRole,
    actionType: 'system',
    actionUrl,
  }),

  systemMaintenance: (
    userId: string,
    userRole: 'student' | 'teacher' | 'company',
    startTime: Date,
    endTime: Date
  ): Omit<Notification, 'id' | 'createdAt' | 'isRead'> => ({
    title: 'Bảo trì hệ thống',
    message: `Hệ thống sẽ bảo trì từ ${startTime.toLocaleString('vi-VN')} đến ${endTime.toLocaleString('vi-VN')}`,
    type: 'warning',
    userId,
    userRole,
    actionType: 'system',
  }),

  // Bulk notification for multiple users
  bulkNotify: (
    userIds: string[],
    userRole: 'student' | 'teacher' | 'company',
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info',
    actionType: Notification['actionType'] = 'system',
    actionUrl?: string,
    metadata?: Notification['metadata']
  ): Omit<Notification, 'id' | 'createdAt' | 'isRead'>[] => {
    return userIds.map(userId => ({
      title,
      message,
      type,
      userId,
      userRole,
      actionType,
      actionUrl,
      metadata,
    }));
  },
};

export const notificationHelpers = {
  // Get notification icon based on type
  getTypeIcon: (type: Notification['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  },

  // Get notification color based on type
  getTypeColor: (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'green';
      case 'warning': return 'yellow';
      case 'error': return 'red';
      default: return 'blue';
    }
  },

  // Format relative time
  getRelativeTime: (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    
    return date.toLocaleDateString('vi-VN');
  },

  // Check if notification should be highlighted
  shouldHighlight: (notification: Notification) => {
    if (notification.isRead) return false;
    
    // Highlight urgent notifications
    const urgentTypes: Notification['actionType'][] = ['report_deadline'];
    return urgentTypes.includes(notification.actionType || 'system');
  },

  // Group notifications by date
  groupByDate: (notifications: Notification[]) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const groups: { [key: string]: Notification[] } = {
      'Hôm nay': [],
      'Hôm qua': [],
      'Trước đó': []
    };

    notifications.forEach(notification => {
      const notifDate = new Date(notification.createdAt);
      if (notifDate.toDateString() === today.toDateString()) {
        groups['Hôm nay'].push(notification);
      } else if (notifDate.toDateString() === yesterday.toDateString()) {
        groups['Hôm qua'].push(notification);
      } else {
        groups['Trước đó'].push(notification);
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    return groups;
  }
};