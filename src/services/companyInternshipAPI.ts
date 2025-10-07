import axios, { type AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

interface StudentFilters {
  search?: string;
  batchId?: string;
  status?: string;
}

interface EvaluationData {
  diem_thuc_tap?: number;
  nhan_xet_doanh_nghiep?: string;
}

// Create axios instance với authentication
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor để tự động thêm token
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

// Add response interceptor để xử lý lỗi
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

export const companyInternshipAPI = {
  // Lấy thông tin doanh nghiệp hiện tại
  getMyInfo: (): Promise<AxiosResponse<ApiResponse>> => 
    apiClient.get('/company-internships/my-info'),
  
  // Lấy danh sách sinh viên được phân công
  getMyInterns: (filters: StudentFilters = {}): Promise<AxiosResponse<ApiResponse>> => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.batchId) params.append('batchId', filters.batchId);
    if (filters.status) params.append('status', filters.status);
    
    const queryString = params.toString();
    return apiClient.get(`/company-internships/my-interns${queryString ? `?${queryString}` : ''}`);
  },
  
  // Cập nhật đánh giá sinh viên
  updateStudentEvaluation: (studentId: string | number, evaluationData: EvaluationData): Promise<AxiosResponse<ApiResponse>> => 
    apiClient.put(`/company-internships/students/${studentId}/evaluation`, evaluationData),
  
  // Lấy thống kê thực tập
  getMyInternshipStats: (): Promise<AxiosResponse<ApiResponse>> => 
    apiClient.get('/company-internships/my-internship-stats'),
  
  // Gửi tất cả đánh giá cho giảng viên
  submitAllEvaluations: (): Promise<AxiosResponse<ApiResponse>> => 
    apiClient.post('/company-internships/submit-all-evaluations'),
};

export default companyInternshipAPI;