import { useState, useEffect } from 'react';
import { adminTeacherSupervisionAPI } from '../services/adminTeacherSupervisionAPI';
import type { TeacherSupervision, StudentDetail } from '../services/adminTeacherSupervisionAPI';

export function useTeacherSupervision(statusFilter?: 'da_cham_xong' | 'chua_cham_xong') {
  const [teachers, setTeachers] = useState<TeacherSupervision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    try {
      console.log('useTeacherSupervision: Starting fetch with filter:', statusFilter);
      setLoading(true);
      setError(null);
      const data = await adminTeacherSupervisionAPI.getSupervisionOverview(statusFilter);
      console.log('useTeacherSupervision: Received data:', data);
      setTeachers(data);
    } catch (err) {
      console.error('useTeacherSupervision: Error:', err);
      setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [statusFilter]);

  return {
    teachers,
    loading,
    error,
    refetch: fetchTeachers
  };
}

export function useTeacherStudentDetails(maGiangVien?: string) {
  const [students, setStudents] = useState<StudentDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async (teacherCode: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminTeacherSupervisionAPI.getTeacherStudentDetails(teacherCode);
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu sinh viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (maGiangVien) {
      fetchStudents(maGiangVien);
    }
  }, [maGiangVien]);

  return {
    students,
    loading,
    error,
    fetchStudents
  };
}