const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface TeacherSupervision {
  giang_vien_id: number;
  ma_giang_vien: string;
  ten_giang_vien: string;
  email: string;
  khoa: string;
  bo_mon: string;
  so_sinh_vien_huong_dan: number;
  so_sinh_vien_da_cham: number;
  trang_thai_cham_diem: 'da_cham_xong' | 'chua_cham_xong';
}

export interface StudentDetail {
  ma_sinh_vien: string;
  ten_sinh_vien: string;
  lop: string;
  email: string;
  ten_doanh_nghiep: string;
  dia_chi_doanh_nghiep: string;
  vi_tri_thuc_tap: string | null;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  diem_giang_vien: number | null;
  nhan_xet_giang_vien: string | null;
  trang_thai: string;
  trang_thai_cham_diem: 'da_cham' | 'chua_cham';
}

class AdminTeacherSupervisionAPI {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  async getSupervisionOverview(status?: 'da_cham_xong' | 'chua_cham_xong'): Promise<TeacherSupervision[]> {
    try {
      const token = localStorage.getItem('token');
      const q = new URLSearchParams();
      if (status) q.set('status', status);
      if (token) q.set('token', token); // fallback for servers expecting token in query
      const qs = q.toString();
      const url = `${API_BASE_URL}/teacher-reports/supervision-overview${qs ? `?${qs}` : ''}`;
      console.log('AdminTeacherSupervisionAPI: Fetching from URL:', url);
      console.log('AdminTeacherSupervisionAPI: Headers:', this.getAuthHeaders());
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      console.log('AdminTeacherSupervisionAPI: Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('AdminTeacherSupervisionAPI: Response body:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'Lỗi khi lấy thông tin giám sát');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching supervision overview:', error);
      throw error;
    }
  }

  async getTeacherStudentDetails(maGiangVien: string): Promise<StudentDetail[]> {
    try {
      const token = localStorage.getItem('token');
      const q = new URLSearchParams();
      if (token) q.set('token', token);
      const qs = q.toString();
      const url = `${API_BASE_URL}/teacher-reports/teacher/${maGiangVien}/students${qs ? `?${qs}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Lỗi khi lấy chi tiết sinh viên');
      }

      return result.data;
    } catch (error) {
      console.error('Error fetching teacher student details:', error);
      throw error;
    }
  }
}

export const adminTeacherSupervisionAPI = new AdminTeacherSupervisionAPI();