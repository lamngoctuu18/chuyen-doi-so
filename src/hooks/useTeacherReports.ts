import { useState, useEffect } from 'react';
import { teacherReportsAPI } from '../services/teacherReportsAPI';

// Hook for teacher students
export const useTeacherStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherReportsAPI.getStudents();
      
      if (response.success) {
        setStudents(response.data || []);
      } else {
        setError(response.message || 'Lỗi khi lấy danh sách sinh viên');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lấy danh sách sinh viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    fetchStudents,
    setError
  };
};

// Hook for teacher reports stats
export const useTeacherReportsStats = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeInternships: 0,
    submittedReports: 0,
    pendingReports: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherReportsAPI.getStats();
      
      if (response.success) {
        setStats(response.data || {
          totalStudents: 0,
          activeInternships: 0,
          submittedReports: 0,
          pendingReports: 0,
          completionRate: 0
        });
      } else {
        setError(response.message || 'Lỗi khi lấy thống kê');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lấy thống kê');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    fetchStats,
    setError
  };
};

// Hook for teacher reports
export const useTeacherReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0,
    limit: 10
  });

  const fetchReports = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherReportsAPI.getReports(page, limit);
      
      if (response.success) {
        setReports(response.data || []);
        setPagination(response.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalReports: 0,
          limit: 10
        });
      } else {
        setError(response.message || 'Lỗi khi lấy danh sách báo cáo');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi lấy danh sách báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await teacherReportsAPI.createReport(reportData);
      
      if (response.success) {
        // Refresh reports list after creating
        await fetchReports(pagination.currentPage, pagination.limit);
        return response;
      } else {
        setError(response.message || 'Lỗi khi tạo báo cáo');
        return { success: false, message: response.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Lỗi khi tạo báo cáo';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    pagination,
    fetchReports,
    createReport,
    setError
  };
};