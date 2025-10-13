import { useState, useEffect } from 'react';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCompanies: number;
  activeBatches: number;
  assignedStudents: number;
  khoaIntroStudents: number;
  selfContactStudents: number;
  assignmentRate: number;
}

interface OverviewStats {
  students: {
    total: number;
    withAdvisor: number;
    withCompany: number;
    fullyAssigned: number;
  };
  teachers: {
    total: number;
    activeAdvisors: number;
    totalSupervisionCount: number;
  };
  companies: {
    total: number;
    active: number;
  };
  batches: {
    total: number;
    active: number;
    upcoming: number;
  };
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/dashboard/summary-public');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
};

export const useOverviewStats = () => {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/dashboard/overview-public');
      
      if (!response.ok) {
        throw new Error('Failed to fetch overview stats');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setOverview(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch overview');
      }
    } catch (err) {
      console.error('Error fetching overview stats:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  return { overview, loading, error, refetch: fetchOverview };
};