// User roles
export type UserRole = 'admin' | 'sinh-vien' | 'giang-vien' | 'doanh-nghiep';

// Auth types
export interface User {
  id: string;
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
  tenDot: string;
  thoiGianBatDau: string;
  thoiGianKetThuc: string;
  moTa?: string;
  doanhNghiepThamGia: string[];
  sinhVienThamGia: string[];
  trangThai: 'sap-mo' | 'dang-mo' | 'dang-dien-ra' | 'ket-thuc';
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