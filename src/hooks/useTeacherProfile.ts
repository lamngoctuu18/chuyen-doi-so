import { useState, useEffect } from 'react';
import { teacherProfileAPI } from '../services/teacherProfileAPI';

// Hook for teacher info
export const useTeacherInfo = () => {
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeacherInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherProfileAPI.getInfo();
      
      if (response.success) {
        setTeacherInfo(response.data);
      } else {
        setError(response.message || 'Lỗi khi lấy thông tin giảng viên');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lấy thông tin giảng viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacherInfo();
  }, []);

  return {
    teacherInfo,
    loading,
    error,
    fetchTeacherInfo,
    setError
  };
};

// Hook for dashboard stats
export const useTeacherDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalStudents: 0,
    activeInternships: 0,
    companiesCount: 0,
    recentStudents: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherProfileAPI.getDashboardStats();
      
      if (response.success) {
        setDashboardStats(response.data || {
          totalStudents: 0,
          activeInternships: 0,
          companiesCount: 0,
          recentStudents: []
        });
      } else {
        setError(response.message || 'Lỗi khi lấy thống kê dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lấy thống kê dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return {
    dashboardStats,
    loading,
    error,
    fetchDashboardStats,
    setError
  };
};