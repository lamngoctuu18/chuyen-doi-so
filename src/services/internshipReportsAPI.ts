import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with auth
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to add token
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

// Add response interceptor for error handling
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

export const internshipReportsAPI = {
  // Get student reports
  getStudentReports: (classFilter?: string, statusFilter?: string) => {
    const params = new URLSearchParams();
    if (classFilter && classFilter !== 'all') {
      params.append('class', classFilter);
    }
    if (statusFilter && statusFilter !== 'all') {
      params.append('status', statusFilter);
    }
    const queryString = params.toString();
    return apiClient.get(`/internship-reports/students${queryString ? `?${queryString}` : ''}`);
  },

  // Get class statistics
  getClassStats: () => {
    return apiClient.get('/internship-reports/class-stats');
  },

  // Get overview statistics
  getOverviewStats: () => {
    return apiClient.get('/internship-reports/overview-stats');
  },

  // Get list of classes
  getClasses: () => {
    return apiClient.get('/internship-reports/classes');
  },
};

export default internshipReportsAPI;
