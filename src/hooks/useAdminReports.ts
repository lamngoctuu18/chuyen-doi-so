import { useState, useEffect, useCallback } from 'react';
import AdminReportsAPI, { 
  type ReportStats, 
  type SubmittedReport, 
  type ReportFilters,
  type TeacherWithoutReport,
  type CompanyWithoutReport
} from '../services/adminReportsAPI';

// Hook for reports statistics
export const useAdminReportsStats = () => {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminReportsAPI.getReportsStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải thống kê báo cáo');
      console.error('Error fetching admin reports stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
    setError
  };
};

// Hook for submitted reports with pagination and filtering
export const useSubmittedReports = (
  initialPage: number = 1,
  initialLimit: number = 20,
  initialFilters: ReportFilters = {}
) => {
  const [reports, setReports] = useState<SubmittedReport[]>([]);
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: initialLimit,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (page: number = pagination.page, newFilters: ReportFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AdminReportsAPI.getSubmittedReports(page, pagination.limit, newFilters);
      setReports(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách báo cáo');
      console.error('Error fetching submitted reports:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  const updateFilters = useCallback((newFilters: ReportFilters) => {
    setFilters(newFilters);
    fetchReports(1, newFilters);
  }, [fetchReports]);

  const changePage = useCallback((page: number) => {
    fetchReports(page, filters);
  }, [fetchReports, filters]);

  const approveReport = useCallback(async (id: string) => {
    try {
      await AdminReportsAPI.approveReport(id);
      // Update local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === id ? { ...report, status: 'da_duyet' as const } : report
        )
      );
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi duyệt báo cáo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const rejectReport = useCallback(async (id: string, reason: string) => {
    try {
      await AdminReportsAPI.rejectReport(id, reason);
      // Update local state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === id ? { ...report, status: 'tu_choi' as const } : report
        )
      );
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi từ chối báo cáo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    pagination,
    filters,
    loading,
    error,
    updateFilters,
    changePage,
    approveReport,
    rejectReport,
    refetch: fetchReports,
    setError
  };
};

// Hook for getting detailed report
export const useReportDetail = (id: string | null) => {
  const [report, setReport] = useState<SubmittedReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (reportId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminReportsAPI.getReportById(reportId);
      setReport(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải thông tin báo cáo');
      console.error('Error fetching report detail:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchReport(id);
    } else {
      setReport(null);
      setError(null);
      setLoading(false);
    }
  }, [id, fetchReport]);

  return {
    report,
    loading,
    error,
    refetch: id ? () => fetchReport(id) : () => {},
    setError
  };
};

// Hook for teachers without reports
export const useTeachersWithoutReports = (dotThucTapId: string | null) => {
  const [teachers, setTeachers] = useState<TeacherWithoutReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = useCallback(async (batchId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminReportsAPI.getTeachersWithoutReports(batchId);
      setTeachers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách giảng viên');
      console.error('Error fetching teachers without reports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (dotThucTapId) {
      fetchTeachers(dotThucTapId);
    } else {
      setTeachers([]);
      setError(null);
      setLoading(false);
    }
  }, [dotThucTapId, fetchTeachers]);

  return {
    teachers,
    loading,
    error,
    refetch: dotThucTapId ? () => fetchTeachers(dotThucTapId) : () => {},
    setError
  };
};

// Hook for companies without reports
export const useCompaniesWithoutReports = (dotThucTapId: string | null) => {
  const [companies, setCompanies] = useState<CompanyWithoutReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async (batchId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await AdminReportsAPI.getCompaniesWithoutReports(batchId);
      setCompanies(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi tải danh sách doanh nghiệp');
      console.error('Error fetching companies without reports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (dotThucTapId) {
      fetchCompanies(dotThucTapId);
    } else {
      setCompanies([]);
      setError(null);
      setLoading(false);
    }
  }, [dotThucTapId, fetchCompanies]);

  return {
    companies,
    loading,
    error,
    refetch: dotThucTapId ? () => fetchCompanies(dotThucTapId) : () => {},
    setError
  };
};

// Hook for exporting reports
export const useExportReports = () => {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportReports = useCallback(async (filters: ReportFilters = {}) => {
    try {
      setExporting(true);
      setError(null);
      
      const blob = await AdminReportsAPI.exportReports(filters);
      const filename = `bao-cao-thuc-tap-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      AdminReportsAPI.downloadFile(blob, filename);
      
      return { success: true };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi xuất báo cáo';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setExporting(false);
    }
  }, []);

  return {
    exportReports,
    exporting,
    error,
    setError
  };
};