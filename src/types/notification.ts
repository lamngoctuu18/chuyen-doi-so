export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
  userId: string;
  // Support both Vietnamese and English role keys used across the app
  userRole: 'sinh-vien' | 'giang-vien' | 'doanh-nghiep' | 'admin' | 'student' | 'teacher' | 'company';
  actionType?: 'report_submission' | 'report_deadline' | 'registration' | 'assignment' | 'system';
  actionUrl?: string;
  metadata?: {
    reportId?: string;
    weekNumber?: number;
    deadlineDate?: Date;
    teacherName?: string;
    studentName?: string;
    companyName?: string;
  };
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  fetchNotifications: () => void;
}