const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const teacherReportsAPI = {
  // Lấy danh sách sinh viên hướng dẫn
  async getStudents() {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher-reports/students`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Get students error:', error);
      throw error;
    }
  },

  // Lấy thống kê báo cáo
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher-reports/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Get stats error:', error);
      throw error;
    }
  },

  // Tạo báo cáo mới
  async createReport(reportData: any) {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher-reports`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Create report error:', error);
      throw error;
    }
  },

  // Lấy danh sách báo cáo đã nộp
  async getReports(page = 1, limit = 10) {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher-reports?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Get reports error:', error);
      throw error;
    }
  }
  ,

  // Sinh viên tự xem điểm và nhận xét của giảng viên
  async getMyEvaluation() {
    try {
      const response = await fetch(`${API_BASE_URL}/teacher-reports/student/evaluation`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Get my evaluation error:', error);
      throw error;
    }
  }
};