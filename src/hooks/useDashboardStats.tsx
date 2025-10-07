import { useState, useEffect } from 'react';

interface DashboardStats {
  totalSinhVien: number;
  totalGiangVien: number;
  totalDoanhNghiep: number;
  totalInterns: number;
  totalReports: number;
  lastUpdated: string;
}

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      // If no token, show default stats with message
      if (!token) {
        const fallbackStats: DashboardStats = {
          totalSinhVien: 0,
          totalGiangVien: 0,
          totalDoanhNghiep: 0,
          totalInterns: 0,
          totalReports: 0,
          lastUpdated: new Date().toISOString()
        };
        setStats(fallbackStats);
        setError('Vui lòng đăng nhập để xem thống kê');
        return;
      }

      // Use existing Vietnamese APIs to get stats
      const [studentsResponse, teachersResponse, companiesResponse] = await Promise.all([
        fetch('/api/sinh-vien?page=1&limit=1', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/giang-vien?page=1&limit=1', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/doanh-nghiep?page=1&limit=1', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      // If auth failed, show auth error
      if (!studentsResponse.ok && studentsResponse.status === 401) {
        const fallbackStats: DashboardStats = {
          totalSinhVien: 0,
          totalGiangVien: 0,
          totalDoanhNghiep: 0,
          totalInterns: 0,
          totalReports: 0,
          lastUpdated: new Date().toISOString()
        };
        setStats(fallbackStats);
        setError('Phiên đăng nhập đã hết hạn - vui lòng đăng nhập lại');
        return;
      }

      // If server error, show server error
      if (!studentsResponse.ok || !teachersResponse.ok || !companiesResponse.ok) {
        const fallbackStats: DashboardStats = {
          totalSinhVien: 0,
          totalGiangVien: 0,
          totalDoanhNghiep: 0,
          totalInterns: 0,
          totalReports: 0,
          lastUpdated: new Date().toISOString()
        };
        setStats(fallbackStats);
        setError('Server không phản hồi - hiển thị dữ liệu tạm thời');
        return;
      }

      const [studentsData, teachersData, companiesData] = await Promise.all([
        studentsResponse.json(),
        teachersResponse.json(),
        companiesResponse.json()
      ]);

      // Try to get intern count from students with company assignments
      let totalInterns = 0;
      try {
        // Get all students to count those with internship assignments
        const allStudentsResponse = await fetch('/api/sinh-vien?page=1&limit=5000', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (allStudentsResponse.ok) {
          const allStudentsData = await allStudentsResponse.json();
          // Count students with internship company assigned (don_vi_thuc_tap)
          totalInterns = allStudentsData.data?.filter((student: any) => 
            student.don_vi_thuc_tap && student.don_vi_thuc_tap.trim() !== ''
          ).length || 0;
        }
      } catch (internErr) {
        console.warn('Could not calculate intern count:', internErr);
      }

      // Construct stats from existing API responses
      const stats: DashboardStats = {
        totalSinhVien: studentsData.pagination?.total || 0,
        totalGiangVien: teachersData.pagination?.total || 0,
        totalDoanhNghiep: companiesData.pagination?.total || 0,
        totalInterns,
        totalReports: 0, // Placeholder
        lastUpdated: new Date().toISOString()
      };

      setStats(stats);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      // Fallback to mock data when there's an error
      setStats({
        totalSinhVien: 0,
        totalGiangVien: 0,
        totalDoanhNghiep: 0,
        totalInterns: 0,
        totalReports: 0,
        lastUpdated: new Date().toISOString()
      });
      setError('Không thể kết nối server - hiển thị dữ liệu mặc định');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchStats();
  };

  // Listen for dashboard refresh events
  useEffect(() => {
    const handleRefresh = () => {
      fetchStats();
    };

    window.addEventListener('dashboardRefresh', handleRefresh);
    return () => {
      window.removeEventListener('dashboardRefresh', handleRefresh);
    };
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refresh };
};