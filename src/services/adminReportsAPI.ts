import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export interface ReportStats {
  totalTeachers: number;
  submittedTeacherReports: number;
  totalCompanies: number;
  submittedCompanyReports: number;
  totalStudents: number;
  completedInternships: number;
}

export interface SubmittedReport {
  id: string;
  title: string;
  submitterType: 'giang_vien' | 'doanh_nghiep';
  submitterCode: string;
  submitterName: string;
  submittedDate: string;
  status: 'da_nop' | 'da_duyet' | 'tu_choi';
  fileUrl?: string;
  studentCount?: number;
  internshipPeriod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportFilters {
  submitterType?: 'giang_vien' | 'doanh_nghiep';
  status?: 'da_nop' | 'da_duyet' | 'tu_choi';
  search?: string;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TeacherWithoutReport {
  ma_giang_vien: string;
  ho_ten: string;
  email: string;
  so_sinh_vien_huong_dan: number;
  report_status: string;
}

export interface CompanyWithoutReport {
  ma_doanh_nghiep: string;
  ten_doanh_nghiep: string;
  email: string;
  student_count: number;
  report_status: string;
}

class AdminReportsAPI {
  // Get reports statistics
  static async getReportsStats(): Promise<ReportStats> {
    try {
      const response = await apiClient.get('/admin/reports/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reports stats:', error);
      throw error;
    }
  }

  // Get submitted reports with pagination and filtering
  static async getSubmittedReports(
    page: number = 1,
    limit: number = 20,
    filters: ReportFilters = {}
  ): Promise<PaginationResponse<SubmittedReport>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      });

      const response = await apiClient.get(`/admin/reports?${params.toString()}`);
      return {
        data: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('Error fetching submitted reports:', error);
      throw error;
    }
  }

  // Get detailed report by ID
  static async getReportById(id: string): Promise<SubmittedReport> {
    try {
      const response = await apiClient.get(`/admin/reports/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching report by ID:', error);
      throw error;
    }
  }

  // Approve a report
  static async approveReport(id: string): Promise<void> {
    try {
      await apiClient.put(`/admin/reports/${id}/approve`);
    } catch (error) {
      console.error('Error approving report:', error);
      throw error;
    }
  }

  // Reject a report
  static async rejectReport(id: string, reason: string): Promise<void> {
    try {
      await apiClient.put(`/admin/reports/${id}/reject`, { reason });
    } catch (error) {
      console.error('Error rejecting report:', error);
      throw error;
    }
  }

  // Get teachers who haven't submitted reports
  static async getTeachersWithoutReports(dotThucTapId: string): Promise<TeacherWithoutReport[]> {
    try {
      const response = await apiClient.get(`/admin/reports/missing/teachers/${dotThucTapId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching teachers without reports:', error);
      throw error;
    }
  }

  // Get companies who haven't submitted reports
  static async getCompaniesWithoutReports(dotThucTapId: string): Promise<CompanyWithoutReport[]> {
    try {
      const response = await apiClient.get(`/admin/reports/missing/companies/${dotThucTapId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching companies without reports:', error);
      throw error;
    }
  }

  // Export reports to Excel
  static async exportReports(filters: ReportFilters = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      );

      const response = await apiClient.get(`/admin/reports/export?${params.toString()}`, {
        responseType: 'blob'
      });

      return response.data;
    } catch (error) {
      console.error('Error exporting reports:', error);
      throw error;
    }
  }

  // Download exported file
  static downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export default AdminReportsAPI;