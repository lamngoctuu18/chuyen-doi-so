import { useState } from 'react';
import type { InternshipBatch } from '../types';

// Hook để quản lý đợt thực tập
export const useInternshipBatches = () => {
  const [batches, setBatches] = useState<InternshipBatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBatches = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:3001/api/internship-batches?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBatches(data.data.batches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/internship-batches/active', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBatches(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createBatch = async (batchData: any) => {
    try {
      const response = await fetch('http://localhost:3001/api/internship-batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(batchData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      fetchBatches(); // Refresh list
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const updateBatch = async (id: string, batchData: any) => {
    try {
      const response = await fetch(`http://localhost:3001/api/internship-batches/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(batchData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      fetchBatches(); // Refresh list
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const deleteBatch = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/internship-batches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchBatches(); // Refresh list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    batches,
    loading,
    error,
    fetchBatches,
    fetchActiveBatches,
    createBatch,
    updateBatch,
    deleteBatch,
    refetch: fetchBatches
  };
};

// Hook để quản lý phân công thực tập
export const useAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`http://localhost:3001/api/assignments?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAssignments(data.data.assignments || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const registerInternship = async (registrationData: any) => {
    try {
      const response = await fetch('http://localhost:3001/api/assignments/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      fetchAssignments(); // Refresh list
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const updateAssignment = async (id: string, assignmentData: any) => {
    try {
      const response = await fetch(`http://localhost:3001/api/assignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(assignmentData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      fetchAssignments(); // Refresh list
      return data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    assignments,
    loading,
    error,
    fetchAssignments,
    registerInternship,
    updateAssignment,
    refetch: fetchAssignments
  };
};