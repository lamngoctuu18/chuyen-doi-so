// User roles
export type UserRole = 'admin' | 'sinh-vien' | 'giang-vien' | 'doanh-nghiep';

// Auth types
export interface User {
  id: string;
  userId?: string; // Mã đăng nhập (mã sinh viên, mã giảng viên, etc.)
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Student types
export interface Student {
  id: string;
  maSV: string;
  hoTen: string;
  ngaySinh: string;
  email: string;
  sdt: string;
  trangThaiThucTap: 'chua-dang-ky' | 'da-dang-ky' | 'dang-thuc-tap' | 'hoan-thanh';
  lop?: string;
  khoa?: string;
  nguyenVong?: string[];
  giangVienHuongDan?: string;
  doanhNghiepThucTap?: string;
}

// Teacher types
export interface Teacher {
  id: string;
  maGV: string;
  hoTen: string;
  email: string;
  sdt: string;
  noiCongTac: string;
  chuyenMon?: string;
  sinhVienHuongDan: string[];
}

// Company types
export interface Company {
  id: string;
  tenDN: string;
  nguoiLienHe: string;
  email: string;
  sdt: string;
  diaChi: string;
  moTa?: string;
  website?: string;
  tinTuyenDung: JobPosting[];
}

export interface JobPosting {
  id: string;
  tieuDe: string;
  moTaCongViec: string;
  soLuong: number;
  kyNangYeuCau: string[];
  thoiGianThucTap: string;
  trangThai: 'mo' | 'dong';
  ngayTao: string;
  ungVien: Application[];
}

export interface Application {
  id: string;
  sinhVienId: string;
  jobPostingId: string;
  cv: string; // file path
  ghiChu?: string;
  trangThai: 'cho-duyet' | 'duyet' | 'tu-choi';
  ngayUngTuyen: string;
}

// Internship types
export interface InternshipBatch {
  id: string;
  ten_dot: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
  mo_ta?: string;
  trang_thai: 'sap-mo' | 'dang-mo' | 'dang-dien-ra' | 'ket-thuc';
  soDoanhNghiepThamGia?: number;
  soSinhVienThamGia?: number;
  soGiangVienHuongDan?: number;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for backward compatibility
  tenDot?: string;
  thoiGianBatDau?: string;
  thoiGianKetThuc?: string;
  moTa?: string;
  doanhNghiepThamGia?: string[];
  sinhVienThamGia?: string[];
}

export interface InternshipAssignment {
  id: string;
  sinhVienId: string;
  doanhNghiepId: string;
  dotThucTapId: string;
  giangVienHuongDanId: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  trangThai: 'chua-bat-dau' | 'dang-dien-ra' | 'hoan-thanh' | 'huy';
}

// Report types
export interface WeeklyReport {
  id: string;
  sinhVienId: string;
  assignmentId: string;
  tuan: number;
  noiDung: string;
  fileDinhKem?: string;
  ngayNop: string;
  trangThai: 'chua-nop' | 'da-nop' | 'da-duyet';
  nhanXetGiangVien?: string;
  diem?: number;
  // Thông tin sinh viên
  hoTenSinhVien?: string;
  maSinhVien?: string;
  // Thông tin đợt
  dotThucTapId?: string;
  tenDot?: string;
}

export interface FinalReport {
  id: string;
  sinhVienId: string;
  assignmentId: string;
  tieuDe: string;
  tomTat: string;
  fileBaoCao: string;
  ngayNop: string;
  diemGiangVien?: number;
  diemDoanhNghiep?: number; 
  nhanXetGiangVien?: string;
  nhanXetDoanhNghiep?: string;
  trangThai: 'chua-nop' | 'da-nop' | 'da-cham-diem';
  // Thông tin sinh viên
  hoTenSinhVien?: string;
  maSinhVien?: string;
  // Thông tin đợt
  dotThucTapId?: string;
  tenDot?: string;
}

// Report Batch types
export interface ReportBatch {
  id: string;
  tenDot: string;
  dotThucTapId: string;
  loaiBaoCao: 'weekly' | 'final';
  hanNop: string;
  moTa?: string;
  trangThai: 'chua-mo' | 'dang-mo' | 'da-dong';
  tongSoSinhVien: number;
  soDaNop: number;
  soDaDuyet: number;
  ngayTao: string;
  ngayCapNhat: string;
}

export interface ReportBatchStats {
  totalBatches: number;
  activeBatches: number;
  weeklyReports: number;
  finalReports: number;
  pendingReviews: number;
  approvedReports: number;
}

// Statistics types
export interface Statistics {
  tongSinhVien: number;
  sinhVienDangThucTap: number;
  sinhVienHoanThanh: number;
  tongDoanhNghiep: number;
  tongGiangVien: number;
  dotThucTapDangDienRa: number;
}

// Teacher Reports types
export interface TeacherStudent {
  id: number;
  ma_giang_vien: string;
  ma_sinh_vien: string;
  ho_ten_sinh_vien: string;
  email_ca_nhan: string;
  so_dien_thoai_sinh_vien: string;
  lop: string;
  doanh_nghiep_thuc_tap?: string;
  ten_cong_ty?: string;
  dia_chi_cong_ty?: string;
  so_dien_thoai_doanh_nghiep?: string;
  ngay_sinh_vien: string;
  vi_tri_thuc_tap?: string;
}

export interface TeacherReportsStats {
  totalStudents: number;
  activeInternships: number;
  submittedReports: number;
  pendingReports: number;
  completionRate: number;
}

export interface TeacherReport {
  id: number;
  nguoi_nop_id: string;
  loai_nguoi_nop: 'giang_vien';
  tieu_de: string;
  noi_dung: string;
  loai_bao_cao: string;
  file_dinh_kem?: string;
  trang_thai: 'da_nop' | 'da_duyet' | 'tu_choi';
  ngay_nop: string;
  ma_sinh_vien_lien_quan?: string;
  ho_ten_sinh_vien?: string;
  ma_sinh_vien?: string;
}

// Teacher Profile types
export interface TeacherInfo {
  ma_giang_vien: string;
  ho_ten: string;
  email_ca_nhan: string;
  so_dien_thoai: string;
  khoa: string;
  bo_mon: string;
  chuc_vu: string;
  so_sinh_vien_huong_dan: number;
  trinh_do: string;
  chuyen_mon: string;
}

export interface TeacherDashboardStats {
  totalStudents: number;
  activeInternships: number;
  companiesCount: number;
  recentStudents: Array<{
    ma_sinh_vien: string;
    ho_ten_sinh_vien: string;
    doanh_nghiep_thuc_tap: string;
    vi_tri_thuc_tap: string;
    ngay_sinh_sinh_vien: string;
  }>;
}