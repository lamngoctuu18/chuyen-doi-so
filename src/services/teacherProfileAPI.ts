const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const teacherProfileAPI = {
  // Lấy thông tin giảng viên
  async getInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher-profile/info`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Get teacher info error:', error);
      throw error;
    }
  },

  // Lấy thống kê dashboard
  async getDashboardStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher-profile/dashboard`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Get dashboard stats error:', error);
      throw error;
    }
  }
};