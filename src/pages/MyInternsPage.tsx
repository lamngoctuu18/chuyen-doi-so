import React, { useState, useEffect } from 'react';
import { Phone, Mail, Calendar, BookOpen, Users, Eye, MessageSquare, Star, CheckCircle, FileText } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { companyInternshipAPI } from '../services/companyInternshipAPI';
import { doanhNghiepAPI } from '../services/doanhNghiepAPI';

interface InternStudent {
  id: number;
  ma_sinh_vien: string;
  ho_ten: string;
  ngay_sinh: string;
  so_dien_thoai: string;
  email: string;
  lop: string;
  vi_tri_mong_muon: string;
  ghi_chu_thuc_tap: string;
  nhom_thuc_tap: string;
  trang_thai_phan_cong: string;
  ngay_bat_dau_thuc_tap: string;
  ngay_ket_thuc_thuc_tap: string;
  giang_vien_huong_dan: string;
  diem_thuc_tap: number;
  nhan_xet_doanh_nghiep: string;
  ngay_nop_cho_gv?: string | null;
  vi_tri_muon_ung_tuyen_thuc_tap?: string;
  don_vi_thuc_tap?: string;
  cv_path?: string;
  // mới: lấy từ api sinh_vien_huong_dan
  vi_tri_thuc_tap?: string;
}

interface CompanyInfo {
  id: number;
  ten_cong_ty: string;
  dia_chi: string;
  so_dien_thoai: string;
  email: string;
  website: string;
  linh_vuc_hoat_dong: string;
  quy_mo_nhan_su: string;
}

const MyInternsPage: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<InternStudent[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<InternStudent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null); // studentId currently saving
  const [submittingAll, setSubmittingAll] = useState(false); // submitting all evaluations
  // Bản nháp local để tránh mất dữ liệu khi re-render
  const [drafts, setDrafts] = useState<Record<number, { diem?: number | null; nhan_xet?: string }>>({});

  // Submit all evaluations to teachers
  const submitAllEvaluations = async () => {
    setSubmittingAll(true);
    try {
      const studentsWithEvaluations = students.filter(s => 
        s.diem_thuc_tap != null || (s.nhan_xet_doanh_nghiep && s.nhan_xet_doanh_nghiep.trim())
      );
      
      if (studentsWithEvaluations.length === 0) {
        alert('Chưa có đánh giá nào để gửi. Vui lòng chấm điểm hoặc nhận xét cho ít nhất một sinh viên.');
        return;
      }

      const confirmMessage = `Bạn có chắc chắn muốn gửi đánh giá cho ${studentsWithEvaluations.length} sinh viên?\n\nSau khi gửi, các đánh giá sẽ được chuyển đến giảng viên hướng dẫn.`;
      
      if (!confirm(confirmMessage)) {
        return;
      }

      // Call API to submit all evaluations
      const response = await companyInternshipAPI.submitAllEvaluations();
      
      if (response.data.success) {
        alert(`✅ ${response.data.message}!\n\n📧 Các giảng viên hướng dẫn đã nhận được thông báo về đánh giá từ doanh nghiệp.\n\n👨‍🏫 Giảng viên có thể xem đánh giá tại mục "Đánh giá từ DN" trên hệ thống.`);
        // Update local state to mark all evaluated students as submitted now
        const submittedAt = new Date().toISOString();
        setStudents(prev => prev.map(s => {
          const hasEval = (s.diem_thuc_tap != null) || ((s.nhan_xet_doanh_nghiep || '').trim() !== '');
          return hasEval ? { ...s, ngay_nop_cho_gv: submittedAt } : s;
        }));
      } else {
        throw new Error(response.data.message || 'Không thể nộp đánh giá');
      }
      
    } catch (error) {
      console.error('Error submitting evaluations:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setSubmittingAll(false);
    }
  };

  // Fetch company info and assigned students
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch company info
      const companyResponse = await companyInternshipAPI.getMyInfo();
      if (companyResponse.data.success) {
        const basicInfo = companyResponse.data.data as CompanyInfo;
        let extended: Partial<CompanyInfo> = {};
        try {
          // Backend /api/doanh-nghiep/:id expects account_id, not doanh_nghiep.id
          const accountId = (basicInfo as any)?.account_id ?? (basicInfo as any)?.id;
          if (accountId) {
            const extResp = await doanhNghiepAPI.getById(accountId);
            if (extResp.data?.success) {
              extended = extResp.data.data || {};
            }
          }
        } catch (e) {
          // Ignore if endpoint not available; keep basic info
        }
        setCompanyInfo({ ...(basicInfo as any), ...(extended as any) });
      }

      // Fetch assigned students
      const studentsResponse = await companyInternshipAPI.getMyInterns();
      if (studentsResponse.data.success) {
        const list: InternStudent[] = studentsResponse.data.data as any;
        setStudents(list);
        // Khởi tạo bản nháp theo dữ liệu hiện có
        const nextDrafts: Record<number, { diem?: number | null; nhan_xet?: string }> = {};
        list.forEach(s => {
          nextDrafts[s.id] = {
            diem: s.diem_thuc_tap ?? null,
            nhan_xet: s.nhan_xet_doanh_nghiep ?? ''
          };
        });
        setDrafts(nextDrafts);
      } else {
        setError(studentsResponse.data.message || 'Không thể tải danh sách sinh viên');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải dữ liệu');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'doanh-nghiep') {
      fetchData();
    }
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'da-phan-cong': return 'text-blue-600 bg-blue-100';
      case 'dang-thuc-tap': return 'text-green-600 bg-green-100';
      case 'hoan-thanh': return 'text-purple-600 bg-purple-100';
      case 'tam-ngung': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'da-phan-cong': return 'Đã phân công';
      case 'dang-thuc-tap': return 'Đang thực tập';
      case 'hoan-thanh': return 'Hoàn thành';
      case 'tam-ngung': return 'Tạm ngưng';
      default: return status;
    }
  };

  const getPositionColor = (position: string) => {
    const colors: Record<string, string> = {
      'Lập trình viên (Developer)': 'bg-emerald-100 text-emerald-800',
      'Thiết kế website': 'bg-amber-100 text-amber-800',
      'Phân tích & thiết kế hệ thống': 'bg-violet-100 text-violet-800',
      'Quản trị mạng': 'bg-red-100 text-red-800',
      'Quản trị cơ sở dữ liệu': 'bg-blue-100 text-blue-800',
      'Tester': 'bg-cyan-100 text-cyan-800',
      'Hỗ trợ kỹ thuật (IT Support)': 'bg-lime-100 text-lime-800',
      'AI & IoT': 'bg-orange-100 text-orange-800',
      'Khác': 'bg-slate-100 text-slate-800'
    };
    return colors[position] || 'bg-gray-100 text-gray-800';
  };

  if (user?.role !== 'doanh-nghiep') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chỉ doanh nghiệp mới có thể truy cập trang này</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="w-full space-y-8 px-4">
        {/* Modern Hero Header - Màu Đại Nam */}
        <div className="relative rounded-3xl shadow-2xl overflow-hidden mx-4" style={{background: 'linear-gradient(135deg, #213f99 0%, #1a3280 50%, #f37320 100%)'}}>
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32 animate-pulse"></div>
          </div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl shadow-lg">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      Sinh viên thực tập
                    </h1>
                    {companyInfo && (
                      <p className="text-xl text-white/90 font-medium">{companyInfo.ten_cong_ty}</p>
                    )}
                    <p className="text-white/80 mt-2">Quản lý và đánh giá sinh viên đang thực tập tại doanh nghiệp</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-white">{students.length}</div>
                  <div className="text-white/80 text-sm font-medium">Sinh viên</div>
                  <div className="text-white/60 text-xs">Đang thực tập</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Đã xóa thanh tìm kiếm và bộ lọc trạng thái theo yêu cầu */}

        {/* Modern Students List */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 mx-4">
          <div className="p-8 border-b border-gray-200/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Danh sách sinh viên
                  </h2>
                  <p className="text-gray-600 font-medium">Quản lý {students.length} sinh viên thực tập</p>
                </div>
              </div>
              {students.length > 0 && (
                <button
                  onClick={submitAllEvaluations}
                  disabled={submittingAll}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {submittingAll ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang gửi...</span>
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      <span>Gửi tất cả nhận xét cho GVHD</span>
                    </>
                  )}
                </button>
              )}
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <button
                onClick={fetchData}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Thử lại
              </button>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-16 h-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa có sinh viên thực tập</h3>
              <p className="text-gray-600 max-w-lg mx-auto text-lg leading-relaxed">
                Hiện tại chưa có sinh viên nào được phân công thực tập tại doanh nghiệp của bạn. 
                Vui lòng liên hệ với khoa để được hỗ trợ.
              </p>
              <div className="mt-8">
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Liên hệ khoa
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 p-6">
              {students.map((student) => (
                <div key={student.id} className="bg-white/90 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:bg-white/95 transition-all duration-300 shadow-lg">
                  {/* Grid Layout: Thông tin sinh viên bên trái, Đánh giá bên phải */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* PHẦN BÊN TRÁI: THÔNG TIN SINH VIÊN */}
                    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-lg">
                                {student.ho_ten.split(' ').pop()?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 mb-1">{student.ho_ten}</h3>
                              <div className="flex items-center gap-2">
                                <div className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full">
                                  <p className="text-sm font-semibold text-gray-700">{student.ma_sinh_vien}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          {student.giang_vien_huong_dan && (
                            <div className="flex items-center gap-3 mt-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                              <div className="p-2 bg-emerald-100 rounded-xl">
                                <BookOpen className="w-5 h-5 text-emerald-600" />
                              </div>
                              <div>
                                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">Giảng viên hướng dẫn</p>
                                <p className="text-sm font-bold text-emerald-800">{student.giang_vien_huong_dan}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.trang_thai_phan_cong)}`}>
                          {getStatusText(student.trang_thai_phan_cong)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>{student.email}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{student.so_dien_thoai}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <BookOpen className="w-4 h-4 mr-2" />
                          <span>{student.lop}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPositionColor(student.vi_tri_mong_muon)}`}>
                          {student.vi_tri_mong_muon}
                        </span>
                        {(student.vi_tri_thuc_tap || student.nhom_thuc_tap) && (
                          <span className="ml-2 inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded-md text-xs font-medium">
                            {student.vi_tri_thuc_tap || student.nhom_thuc_tap}
                          </span>
                        )}
                      </div>

                      {student.ngay_bat_dau_thuc_tap && (
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {new Date(student.ngay_bat_dau_thuc_tap).toLocaleDateString('vi-VN')} - 
                            {student.ngay_ket_thuc_thuc_tap ? new Date(student.ngay_ket_thuc_thuc_tap).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                          </span>
                        </div>
                      )}

                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowDetailModal(true);
                          }}
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-sm font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <Eye className="w-5 h-5" />
                          Xem chi tiết đầy đủ
                        </button>
                      </div>
                    </div>

                    {/* PHẦN BÊN PHẢI: ĐÁNH GIÁ TỪ DOANH NGHIỆP */}
                    <div className="p-8 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
                            <Star className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">Đánh giá từ doanh nghiệp</h4>
                            <p className="text-sm text-gray-600 font-medium">Gửi đến GVHD</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {(() => {
                            const hasEval = ((drafts[student.id]?.nhan_xet ?? student.nhan_xet_doanh_nghiep) || '').trim();
                            return (
                              <>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-md ${hasEval ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                  {hasEval ? '✅ Đã đánh giá' : '⏳ Chưa đánh giá'}
                                </span>
                                {student.ngay_nop_cho_gv && (
                                  <span className="px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700 border border-green-200 shadow-md">
                                    🚀 Đã gửi
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                      
                    <div className="space-y-3">
                      {/* Modern Comment Input */}
                      <div className="p-4 bg-white/60 rounded-2xl border border-white/50 shadow-sm">
                        <label className="flex items-center gap-3 text-base font-bold text-gray-800 mb-3">
                          <div className="p-2 bg-blue-100 rounded-xl">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                          </div>
                          Nhận xét chi tiết cho GVHD:
                        </label>
                        <textarea
                          placeholder="💬 Nhập đánh giá về thái độ, năng lực, kết quả công việc của sinh viên trong thời gian thực tập..."
                          value={drafts[student.id]?.nhan_xet ?? (student.nhan_xet_doanh_nghiep || '')}
                          onChange={(e) => {
                            const v = e.currentTarget.value;
                            setDrafts(prev => ({
                              ...prev,
                              [student.id]: { ...(prev[student.id] || {}), nhan_xet: v }
                            }));
                          }}
                          onBlur={async (e) => {
                            const val = (e.currentTarget.value || '').trim();
                            try {
                              setSaving(String(student.id));
                              await companyInternshipAPI.updateStudentEvaluation(student.id, { nhan_xet_doanh_nghiep: val });
                              setStudents(prev => prev.map(s => s.id === student.id ? { ...s, nhan_xet_doanh_nghiep: val } : s));
                            } catch (err) {
                              console.error(err);
                              alert('Cập nhật nhận xét thất bại');
                            } finally {
                              setSaving(null);
                            }
                          }}
                          rows={4}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base bg-white resize-none focus:ring-4 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200 placeholder:text-gray-400"
                        />
                        {saving === String(student.id) && (
                          <div className="flex items-center gap-3 text-sm text-blue-600 mt-3 p-3 bg-blue-50 rounded-xl">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span className="font-semibold">Đang lưu đánh giá...</span>
                          </div>
                        )}
                      </div>

                      {/* Status Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-3 border-t border-yellow-200">
                        <div className="flex items-center gap-3">
                          <span>
                            {((drafts[student.id]?.nhan_xet ?? student.nhan_xet_doanh_nghiep) || '').trim()
                              ? 'Đã có nhận xét'
                              : 'Chưa có nhận xét'}
                          </span>
                        </div>
                        <div>
                          {student.ngay_nop_cho_gv ? (
                            <span className="text-green-600">Đã gửi cho GVHD: {new Date(student.ngay_nop_cho_gv).toLocaleDateString('vi-VN')}</span>
                          ) : (
                            <span className="text-yellow-700">Chưa gửi cho GVHD</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Submission Status */}
                      {(((drafts[student.id]?.diem ?? student.diem_thuc_tap) != null) || ((drafts[student.id]?.nhan_xet ?? student.nhan_xet_doanh_nghiep) || '').trim()) && !student.ngay_nop_cho_gv && (
                        <div className="mt-2 pt-2 border-t border-yellow-200">
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle className="w-3 h-3 text-green-600" />
                            <span className="text-green-600 font-medium">Sẵn sàng gửi cho GVHD</span>
                          </div>
                        </div>
                      )}
                    </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Thông tin chi tiết sinh viên</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Personal Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Thông tin cá nhân</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Họ tên:</span>
                    <span>{selectedStudent.ho_ten}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Mã sinh viên:</span>
                    <span>{selectedStudent.ma_sinh_vien}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Ngày sinh:</span>
                    <span>{selectedStudent.ngay_sinh ? new Date(selectedStudent.ngay_sinh).toLocaleDateString('vi-VN') : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Lớp:</span>
                    <span>{selectedStudent.lop}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{selectedStudent.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Số điện thoại:</span>
                    <span>{selectedStudent.so_dien_thoai}</span>
                  </div>
                </div>
              </div>

              {/* CV Section */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Hồ sơ CV</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {selectedStudent.cv_path ? (
                    <a
                      href={`http://localhost:3001${selectedStudent.cv_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-3 rounded-lg transition-colors group"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">Xem CV của sinh viên</div>
                        <div className="text-sm text-gray-600">Nhấn để mở file PDF</div>
                      </div>
                      <Eye className="w-5 h-5" />
                    </a>
                  ) : (
                    <div className="flex items-center gap-3 text-gray-500 p-3">
                      <div className="p-2 bg-gray-200 rounded-lg">
                        <FileText className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">Chưa có CV</div>
                        <div className="text-sm">Sinh viên chưa tải lên CV</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Internship Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Thông tin thực tập</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Vị trí mong muốn:</span>
                    <span>{selectedStudent.vi_tri_mong_muon}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Nhóm thực tập:</span>
                    <span>{selectedStudent.vi_tri_thuc_tap || selectedStudent.nhom_thuc_tap || 'Chưa xếp nhóm'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Trạng thái:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedStudent.trang_thai_phan_cong)}`}>
                      {getStatusText(selectedStudent.trang_thai_phan_cong)}
                    </span>
                  </div>
                  {selectedStudent.giang_vien_huong_dan && (
                    <div className="flex justify-between">
                      <span className="font-medium">GV hướng dẫn:</span>
                      <span>{selectedStudent.giang_vien_huong_dan}</span>
                    </div>
                  )}
                  {selectedStudent.vi_tri_muon_ung_tuyen_thuc_tap && (
                    <div className="flex justify-between">
                      <span className="font-medium">Vị trí ứng tuyển:</span>
                      <span className="text-blue-600 font-medium">{selectedStudent.vi_tri_muon_ung_tuyen_thuc_tap}</span>
                    </div>
                  )}
                  {selectedStudent.don_vi_thuc_tap && (
                    <div className="flex justify-between">
                      <span className="font-medium">Đơn vị thực tập:</span>
                      <span className="text-green-600 font-medium">{selectedStudent.don_vi_thuc_tap}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedStudent.ghi_chu_thuc_tap && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Ghi chú từ sinh viên</h4>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    <p>{selectedStudent.ghi_chu_thuc_tap}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyInternsPage;