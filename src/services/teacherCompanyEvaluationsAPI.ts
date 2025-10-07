import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Note: Response types are inferred from server; keep simple any typing to avoid unused warnings.

interface TeacherEvaluationFilters {
  search?: string;
  company?: string;
  hasScore?: boolean;
  hasComment?: boolean;
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

export const teacherCompanyEvaluationsAPI = {
  // Lấy đánh giá từ doanh nghiệp cho sinh viên của giảng viên
  getCompanyEvaluations: (filters: TeacherEvaluationFilters = {}) => {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.company) params.append('company', filters.company);
    if (filters.hasScore !== undefined) params.append('hasScore', String(filters.hasScore));
    if (filters.hasComment !== undefined) params.append('hasComment', String(filters.hasComment));
    
    params.append('_ts', String(Date.now()));
    const queryString = params.toString();
    return apiClient.get(`/teacher-company-evaluations/evaluations${queryString ? `?${queryString}` : ''}`);
  },
  
  // Lấy thống kê đánh giá
  getEvaluationStats: () => 
    apiClient.get(`/teacher-company-evaluations/stats?_ts=${Date.now()}`),
  
  // Đánh dấu đã xem đánh giá
  markAsReviewed: (studentId: string | number) => 
    apiClient.put(`/teacher-company-evaluations/students/${studentId}/mark-reviewed`),
};

export default teacherCompanyEvaluationsAPI;