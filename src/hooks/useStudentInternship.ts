import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:3001/api';

interface StudentProfile {
  id: number;
  ma_sinh_vien: string;
  ho_ten: string;
  lop: string;
  khoa: string;
  nganh: string;
  so_dien_thoai: string;
  email_ca_nhan: string;
  dia_chi: string;
  gpa?: number | null;
  nguyen_vong_thuc_tap?: string;
  vi_tri_muon_ung_tuyen_thuc_tap?: string;
  don_vi_thuc_tap?: string;
  cong_ty_tu_lien_he?: string;
  dia_chi_cong_ty?: string;
  nguoi_lien_he_cong_ty?: string;
  sdt_nguoi_lien_he?: string;
}

interface InternshipRegistrationData {
  nguyen_vong_thuc_tap: string;
  vi_tri_muon_ung_tuyen_thuc_tap: string;
  don_vi_thuc_tap?: string;
  cong_ty_tu_lien_he?: string;
  dia_chi_cong_ty?: string;
  nguoi_lien_he_cong_ty?: string;
  sdt_nguoi_lien_he?: string;
}

export const useStudentInternship = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMyProfile = useCallback(async (): Promise<StudentProfile | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/sinh-vien/my-registration`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // The API may return the student object directly or inside data.data
        return data.data || data;
      } else {
        throw new Error(data.message || 'Không thể tải thông tin sinh viên');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin sinh viên';
      setError(errorMessage);
      console.error('Error fetching student profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitInternshipRegistration = useCallback(async (data: InternshipRegistrationData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/sinh-vien/register-internship`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // If API returns updated student, store it in localStorage or return it to caller
        // We'll return the updated object inside a special field on the resolved value
        (submitInternshipRegistration as any).lastUpdatedStudent = result.data || null;
        return true;
      } else {
        throw new Error(result.message || 'Không thể đăng ký thực tập');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi đăng ký thực tập';
      setError(errorMessage);
      console.error('Error submitting internship registration:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getMyProfile,
    submitInternshipRegistration,
  };
};

export type { StudentProfile, InternshipRegistrationData };