import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Notification, NotificationContextType } from '../types/notification';

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      isRead: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Send to backend
    saveNotificationToBackend(newNotification);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );

    // Update backend
    updateNotificationStatus(notificationId, true);
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );

    // Update backend
    updateMultipleNotificationStatus(unreadIds, true);
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    // Delete from backend
    deleteNotificationFromBackend(notificationId);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setNotifications([]);
        return;
      }
      const response = await fetch('http://localhost:3001/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const normalized: Notification[] = (data.notifications || []).map((n: any) => ({
          id: String(n.id),
          title: n.title ?? '',
          message: n.message ?? '',
          type: n.type ?? 'info',
          isRead: Boolean(n.isRead),
          createdAt: n.createdAt ? new Date(n.createdAt) : new Date(),
          userId: n.userId ?? '',
          userRole: n.userRole ?? 'student',
          actionType: n.actionType,
          actionUrl: n.actionUrl,
          metadata: n.metadata
            ? {
                ...n.metadata,
                deadlineDate: n.metadata.deadlineDate
                  ? new Date(n.metadata.deadlineDate)
                  : undefined,
              }
            : undefined,
        }));
        setNotifications(normalized);
      } else if (response.status === 401 || response.status === 403) {
        // Token missing/invalid/expired: clear local auth to stop repeated 403s
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Notify AuthProvider to update state
          window.dispatchEvent(new CustomEvent('auth:logout'));
        } catch {}
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationToBackend = async (notification: Notification) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification),
      });
    } catch (error) {
      console.error('Failed to save notification:', error);
    }
  };

  const updateNotificationStatus = async (notificationId: string, isRead: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRead }),
      });
    } catch (error) {
      console.error('Failed to update notification status:', error);
    }
  };

  const updateMultipleNotificationStatus = async (notificationIds: string[], isRead: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:3001/api/notifications/bulk-update', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationIds, isRead }),
      });
    } catch (error) {
      console.error('Failed to update notifications status:', error);
    }
  };

  const deleteNotificationFromBackend = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  useEffect(() => {
    // Fetch notifications on mount
    fetchNotifications();

    // Set up polling for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};