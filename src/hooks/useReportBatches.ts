import { useState, useEffect } from 'react';
import { reportBatchAPI, downloadFile } from '../services/reportBatchAPI';
import type { ReportBatch, ReportBatchStats } from '../types';

// Hook để quản lý đợt báo cáo
export const useReportBatches = () => {
  const [reportBatches, setReportBatches] = useState<ReportBatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchReportBatches = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportBatchAPI.getReportBatches(filters);
      if (response.data.success) {
        setReportBatches(response.data.data);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        }
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải đợt báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const createReportBatch = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportBatchAPI.createReportBatch(data);
      if (response.data.success) {
        await fetchReportBatches(); // Refresh list
        return response.data.data;
      } else {
        setError(response.data.message);
        return null;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đợt báo cáo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateReportBatch = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportBatchAPI.updateReportBatch(id, data);
      if (response.data.success) {
        await fetchReportBatches(); // Refresh list
        return response.data.data;
      } else {
        setError(response.data.message);
        return null;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật đợt báo cáo');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteReportBatch = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportBatchAPI.deleteReportBatch(id);
      if (response.data.success) {
        await fetchReportBatches(); // Refresh list
        return true;
      } else {
        setError(response.data.message);
        return false;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xóa đợt báo cáo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const exportReportBatch = async (id: string, filename?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportBatchAPI.exportReportBatch(id);
      const finalFilename = filename || `bao-cao-${id}-${Date.now()}.xlsx`;
      downloadFile(response.data, finalFilename);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi xuất báo cáo');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleBatchStatus = async (id: string, status: 'chua-mo' | 'dang-mo' | 'da-dong') => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportBatchAPI.toggleBatchStatus(id, status);
      if (response.data.success) {
        await fetchReportBatches(); // Refresh list
        return response.data.data;
      } else {
        setError(response.data.message);
        return null;
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    reportBatches,
    loading,
    error,
    pagination,
    fetchReportBatches,
    createReportBatch,
    updateReportBatch,
    deleteReportBatch,
    exportReportBatch,
    toggleBatchStatus,
    setError
  };
};

// Hook để lấy thống kê đợt báo cáo
export const useReportBatchStats = () => {
  const [stats, setStats] = useState<ReportBatchStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reportBatchAPI.getReportBatchStats();
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải thống kê');
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

// Hook để quản lý chi tiết một đợt báo cáo
export const useReportBatchDetail = (id: string) => {
  const [batch, setBatch] = useState<ReportBatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatchDetail = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await reportBatchAPI.getReportBatchById(id);
      if (response.data.success) {
        setBatch(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải chi tiết đợt báo cáo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatchDetail();
  }, [id]);

  return {
    batch,
    loading,
    error,
    fetchBatchDetail,
    setError
  };
};