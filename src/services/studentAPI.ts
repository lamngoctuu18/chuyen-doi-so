import axios from 'axios';

// Point frontend to backend API (default to port 3001 used by backend/server.js)
const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface StudentDashboardResponse {
  data: {
    internshipStatus: 'not-registered' | 'registered' | 'in-progress' | 'completed';
    reportsSubmitted: number;
    totalReports: number;
    averageScore: number;
    daysRemaining: number;
    companyInfo?: {
      name: string;
      position: string;
      address: string;
      mentor: string;
      supervisor: string;
      startDate: string;
      duration: string;
      progress: number;
    };
    notifications: Array<{
      id: string;
      type: 'warning' | 'info' | 'success';
      title: string;
      message: string;
      createdAt: string;
      read: boolean;
    }>;
    progressSteps: Array<{
      title: string;
      description: string;
      status: 'completed' | 'current' | 'pending';
      date: string;
    }>;
  };
}

export interface StudentProfile {
  id: string;
  maSinhVien: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  lop: string;
  khoa: string;
  trangThaiThucTap: string;
  giangVienHuongDan?: string;
  doanhNghiepThucTap?: string;
}

export interface InternshipRegistration {
  nguyenVong1: string;
  nguyenVong2: string;
  nguyenVong3: string;
  kyNangChuyenMon: string;
  moTaBanThan: string;
}

export interface ReportSubmission {
  tieuDe: string;
  noiDung: string;
  taiLieu?: File;
  tuan: number;
}

export const studentAPI = {
  // Dashboard
  // Use existing backend route /api/dashboard for now
  getDashboardStats: (): Promise<StudentDashboardResponse> => 
    apiClient.get('/dashboard'),

  // Profile
  getProfile: (): Promise<{ data: StudentProfile }> => 
    apiClient.get('/student/profile'),

  updateProfile: (profileData: Partial<StudentProfile>): Promise<{ data: StudentProfile }> => 
    apiClient.put('/student/profile', profileData),

  // Internship Registration
  getInternshipStatus: (): Promise<{ data: any }> => 
    apiClient.get('/student/internship-status'),

  registerInternship: (registrationData: InternshipRegistration): Promise<{ data: any }> => 
    apiClient.post('/student/internship-registration', registrationData),

  // Reports
  getReports: (): Promise<{ data: any[] }> => 
    apiClient.get('/student/reports'),

  submitReport: (reportData: ReportSubmission): Promise<{ data: any }> => {
    const formData = new FormData();
    formData.append('tieuDe', reportData.tieuDe);
    formData.append('noiDung', reportData.noiDung);
    formData.append('tuan', reportData.tuan.toString());
    if (reportData.taiLieu) {
      formData.append('taiLieu', reportData.taiLieu);
    }
    
    return apiClient.post('/student/reports', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // Notifications
  getNotifications: (): Promise<{ data: any[] }> => 
    apiClient.get('/student/notifications'),

  markNotificationAsRead: (notificationId: string): Promise<{ data: any }> => 
    apiClient.put(`/student/notifications/${notificationId}/read`),

  markAllNotificationsAsRead: (): Promise<{ data: any }> => 
    apiClient.put('/student/notifications/read-all'),

  // Company Info
  getCompanyInfo: (): Promise<{ data: any }> => 
    apiClient.get('/student/company'),

  // Schedule
  getSchedule: (): Promise<{ data: any }> => 
    apiClient.get('/student/schedule'),

  // Teacher Contact
  getTeacherInfo: (): Promise<{ data: any }> => 
    apiClient.get('/student/teacher'),

  sendMessageToTeacher: (message: string): Promise<{ data: any }> => 
    apiClient.post('/student/teacher/message', { message }),
};

export default studentAPI;