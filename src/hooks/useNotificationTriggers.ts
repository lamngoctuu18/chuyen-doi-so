import { useNotifications } from '../contexts/NotificationContext';
import { createNotification } from '../utils/notificationHelpers';
import { useAuth } from './useAuth';

export const useNotificationTriggers = () => {
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  const triggerReportSubmissionSuccess = (weekNumber: number, teacherName?: string) => {
    if (!user) return;
    
    addNotification(createNotification.reportSubmissionSuccess(
      user.id,
      user.role as 'student' | 'teacher',
      weekNumber,
      teacherName
    ));
  };

  const triggerReportDeadlineWarning = (weekNumber: number, deadlineDate: Date, teacherName: string) => {
    if (!user || user.role !== 'sinh-vien') return;
    
    addNotification(createNotification.reportDeadlineWarning(
      user.id,
      'student',
      weekNumber,
      deadlineDate,
      teacherName
    ));
  };

  const triggerReportDeadlineCreated = (weekNumber: number, deadlineDate: Date, teacherName: string) => {
    if (!user || user.role !== 'sinh-vien') return;
    
    addNotification(createNotification.reportDeadlineCreated(
      user.id,
      'student',
      weekNumber,
      deadlineDate,
      teacherName
    ));
  };

  const triggerRegistrationSuccess = (action: 'internship' | 'topic') => {
    if (!user || user.role !== 'sinh-vien') return;
    
    addNotification(createNotification.registrationSuccess(
      user.id,
      'student',
      action
    ));
  };

  const triggerRegistrationStatusUpdate = (status: 'approved' | 'rejected', details?: string) => {
    if (!user || user.role !== 'sinh-vien') return;
    
    addNotification(createNotification.registrationStatusUpdate(
      user.id,
      'student',
      status,
      details
    ));
  };

  const triggerTeacherAssigned = (teacherName: string) => {
    if (!user || user.role !== 'sinh-vien') return;
    
    addNotification(createNotification.teacherAssigned(
      user.id,
      'student',
      teacherName
    ));
  };

  const triggerCompanyAssigned = (companyName: string, teacherName?: string) => {
    if (!user || user.role !== 'sinh-vien') return;
    
    addNotification(createNotification.companyAssigned(
      user.id,
      'student',
      companyName,
      teacherName
    ));
  };

  const triggerSystemAnnouncement = (title: string, message: string, actionUrl?: string) => {
    if (!user) return;
    
    addNotification(createNotification.systemAnnouncement(
      user.id,
      user.role as 'student' | 'teacher' | 'company',
      title,
      message,
      actionUrl
    ));
  };

  const triggerSystemMaintenance = (startTime: Date, endTime: Date) => {
    if (!user) return;
    
    addNotification(createNotification.systemMaintenance(
      user.id,
      user.role as 'student' | 'teacher' | 'company',
      startTime,
      endTime
    ));
  };

  return {
    triggerReportSubmissionSuccess,
    triggerReportDeadlineWarning,
    triggerReportDeadlineCreated,
    triggerRegistrationSuccess,
    triggerRegistrationStatusUpdate,
    triggerTeacherAssigned,
    triggerCompanyAssigned,
    triggerSystemAnnouncement,
    triggerSystemMaintenance,
  };
};