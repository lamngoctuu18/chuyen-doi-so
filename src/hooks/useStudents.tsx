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

interface StudentsData {
  students: any[];
  pagination: PaginationData;
}

interface UseStudentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const useStudents = (params: UseStudentsParams = {}) => {
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      // Only filter by internship preference (nguyen_vong)
      if (params.status && params.status !== 'all') {
        // Normalize common display inputs just in case
        const val = params.status.toLowerCase();
        let code = val;
        if (val === 'khoa giới thiệu' || val === 'khoa-gioi-thieu') code = 'khoa_gioi_thieu';
        if (val === 'tự liên hệ' || val === 'tu-lien-he') code = 'tu_lien_he';
        queryParams.append('nguyen_vong', code);
      }

      const response = await fetch(`http://localhost:3001/api/sinh-vien?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new CustomEvent('auth:logout'));
          } catch {}
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<StudentsData> = await response.json();
      
      if (result.success) {
        setData(result.data.students);
        setPagination(result.data.pagination);
      } else {
        throw new Error(result.message || 'Lỗi khi lấy dữ liệu sinh viên');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [params.page, params.limit, params.search, params.status]);

  return {
    students: data,
    pagination,
    loading,
    error,
    refetch: fetchStudents
  };
};

export const useStudentStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/sinh-vien/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          try {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.dispatchEvent(new CustomEvent('auth:logout'));
          } catch {}
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.message || 'Lỗi khi lấy thống kê sinh viên');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error('Error fetching student stats:', err);
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

export const useStudent = (id: string | number) => {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3001/api/sinh-vien/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        setStudent(result.data);
      } else {
        throw new Error(result.message || 'Lỗi khi lấy thông tin sinh viên');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
      console.error('Error fetching student:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudent();
  }, [id]);

  return {
    student,
    loading,
    error,
    refetch: fetchStudent
  };
};

export const updateStudent = async (id: string | number, data: any) => {
  try {
    const response = await fetch(`http://localhost:3001/api/sinh-vien/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new CustomEvent('auth:logout'));
        } catch {}
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Lỗi khi cập nhật sinh viên');
    }

    return result;
  } catch (err) {
    throw err;
  }
};

export const deleteStudent = async (id: string | number) => {
  try {
    const response = await fetch(`http://localhost:3001/api/sinh-vien/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.dispatchEvent(new CustomEvent('auth:logout'));
        } catch {}
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ApiResponse<any> = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Lỗi khi xóa sinh viên');
    }

    return result;
  } catch (err) {
    throw err;
  }
};