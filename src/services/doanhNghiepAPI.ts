import axios from 'axios';
import type { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export const doanhNghiepAPI = {
  getById: (id: number | string): Promise<AxiosResponse<ApiResponse>> => apiClient.get(`/doanh-nghiep/${id}`),
  search: (q: string, page = 1, limit = 10): Promise<AxiosResponse<ApiResponse>> => apiClient.get(`/doanh-nghiep?q=${encodeURIComponent(q)}&page=${page}&limit=${limit}`),
};

export default doanhNghiepAPI;
