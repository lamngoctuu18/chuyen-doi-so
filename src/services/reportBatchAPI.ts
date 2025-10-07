import axios from 'axios';
import type { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Tạo instance axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor để thêm token xác thực
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

// Response interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Interface definitions
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ReportBatchFilters {
  page?: number;
  limit?: number;
  trang_thai?: string;
  loai_bao_cao?: 'weekly' | 'final';
  dot_thuc_tap_id?: string;
}

export interface CreateReportBatchData {
  ten_dot: string;
  dot_thuc_tap_id: string;
  loai_bao_cao: 'weekly' | 'final';
  han_nop: string;
  mo_ta?: string;
  trang_thai?: 'chua-mo' | 'dang-mo' | 'da-dong';
}

export interface UpdateReportBatchData {
  ten_dot?: string;
  han_nop?: string;
  mo_ta?: string;
  trang_thai?: 'chua-mo' | 'dang-mo' | 'da-dong';
}

// Report Batch API Service
export const reportBatchAPI = {
  // Lấy danh sách đợt báo cáo
  getReportBatches: (filters?: ReportBatchFilters): Promise<AxiosResponse<ApiResponse>> =>
    apiClient.get('/report-batches', { params: filters }),

  // Lấy chi tiết đợt báo cáo
  getReportBatchById: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    apiClient.get(`/report-batches/${id}`),

  // Tạo đợt báo cáo mới
  createReportBatch: (data: CreateReportBatchData): Promise<AxiosResponse<ApiResponse>> =>
    apiClient.post('/report-batches', data),

  // Cập nhật đợt báo cáo
  updateReportBatch: (id: string, data: UpdateReportBatchData): Promise<AxiosResponse<ApiResponse>> =>
    apiClient.put(`/report-batches/${id}`, data),

  // Xóa đợt báo cáo
  deleteReportBatch: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    apiClient.delete(`/report-batches/${id}`),

  // Lấy thống kê đợt báo cáo
  getReportBatchStats: (): Promise<AxiosResponse<ApiResponse>> =>
    apiClient.get('/report-batches/stats'),

  // Xuất báo cáo Excel
  exportReportBatch: (id: string): Promise<AxiosResponse<Blob>> =>
    apiClient.get(`/report-batches/${id}/export`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    }),

  // Chuyển đổi trạng thái đợt báo cáo
  toggleBatchStatus: (id: string, trang_thai: 'chua-mo' | 'dang-mo' | 'da-dong'): Promise<AxiosResponse<ApiResponse>> =>
    apiClient.post(`/report-batches/${id}/toggle-status`, { trang_thai }),
};

// Helper functions
export const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Export default client for other uses
export default apiClient;