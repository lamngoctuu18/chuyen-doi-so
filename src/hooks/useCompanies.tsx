import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface PaginationData {
  current: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface CompaniesData {
  companies: any[];
  pagination: PaginationData;
}

interface UseCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const useCompanies = (params: UseCompaniesParams = {}) => {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.status && params.status !== 'all') queryParams.append('status', params.status);

      const response = await fetch(`http://localhost:3001/api/companies?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<CompaniesData> = await response.json();
      
      if (result.success) {
        setData(result.data.companies);
        setPagination(result.data.pagination);
      } else {
        throw new Error(result.message || 'Lỗi khi lấy dữ liệu doanh nghiệp');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [params.page, params.limit, params.search, params.status]);

  return {
    companies: data,
    pagination,
    loading,
    error,
    refetch: fetchCompanies
  };
};

export const useCompanyStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/companies/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.message || 'Lỗi khi lấy thống kê doanh nghiệp');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error('Error fetching company stats:', err);
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
    refetch: fetchStats
  };
};

export const useCompany = (id: string | number) => {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3001/api/companies/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        setCompany(result.data);
      } else {
        throw new Error(result.message || 'Lỗi khi lấy thông tin doanh nghiệp');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error('Error fetching company:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  return {
    company,
    loading,
    error,
    refetch: fetchCompany
  };
};

export const updateCompany = async (id: string | number, data: any) => {
  try {
    const response = await fetch(`http://localhost:3001/api/companies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Lỗi khi cập nhật doanh nghiệp');
    }

    return result;
  } catch (err) {
    throw err;
  }
};

export const deleteCompany = async (id: string | number) => {
  try {
    const response = await fetch(`http://localhost:3001/api/companies/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Lỗi khi xóa doanh nghiệp');
    }

    return result;
  } catch (err) {
    throw err;
  }
};