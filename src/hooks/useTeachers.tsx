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

interface TeachersData {
  teachers: any[];
  pagination: PaginationData;
}

interface UseTeachersParams {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
}

export const useTeachers = (params: UseTeachersParams = {}) => {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.department && params.department !== 'all') queryParams.append('department', params.department);

      const response = await fetch(`http://localhost:3001/api/teachers?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<TeachersData> = await response.json();
      
      if (result.success) {
        setData(result.data.teachers);
        setPagination(result.data.pagination);
      } else {
        throw new Error(result.message || 'Lỗi khi lấy dữ liệu giảng viên');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [params.page, params.limit, params.search, params.department]);

  return {
    teachers: data,
    pagination,
    loading,
    error,
    refetch: fetchTeachers
  };
};

export const useTeacherStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/teachers/stats', {
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
        throw new Error(result.message || 'Lỗi khi lấy thống kê giảng viên');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error('Error fetching teacher stats:', err);
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

export const useTeacher = (id: string | number) => {
  const [teacher, setTeacher] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeacher = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3001/api/teachers/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        setTeacher(result.data);
      } else {
        throw new Error(result.message || 'Lỗi khi lấy thông tin giảng viên');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error('Error fetching teacher:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  return {
    teacher,
    loading,
    error,
    refetch: fetchTeacher
  };
};

export const updateTeacher = async (id: string | number, data: any) => {
  try {
    const response = await fetch(`http://localhost:3001/api/teachers/${id}`, {
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
      throw new Error(result.message || 'Lỗi khi cập nhật giảng viên');
    }

    return result;
  } catch (err) {
    throw err;
  }
};

export const deleteTeacher = async (id: string | number) => {
  try {
    const response = await fetch(`http://localhost:3001/api/teachers/${id}`, {
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
      throw new Error(result.message || 'Lỗi khi xóa giảng viên');
    }

    return result;
  } catch (err) {
    throw err;
  }
};