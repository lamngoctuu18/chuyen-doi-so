import React, { useState, useEffect } from 'react';
import { Search, Building2, Star, MessageSquare, Users, Calendar, Mail, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { teacherCompanyEvaluationsAPI } from '../services/teacherCompanyEvaluationsAPI';

interface CompanyEvaluation {
  id: number;
  ma_sinh_vien: string;
  ten_sinh_vien: string;
  lop: string;
  email_sinh_vien: string;
  ten_cong_ty: string;
  dia_chi_cong_ty: string;
  email_cong_ty: string;
  diem_doanh_nghiep: number;
  nhan_xet_doanh_nghiep: string;
  ngay_nop_danh_gia: string;
  ngay_bat_dau_thuc_tap: string;
  ngay_ket_thuc_thuc_tap: string;
  trang_thai_thuc_tap: string;
  ten_dot: string;
  thoi_gian_bat_dau_dot: string;
  thoi_gian_ket_thuc_dot: string;
  vi_tri_thuc_tap?: string;
}

interface EvaluationStats {
  total_students: number;
  students_with_scores: number;
  students_with_comments: number;
  submitted_evaluations: number;
  average_score: number;
  min_score: number;
  max_score: number;
  total_companies: number;
  completion_rate: number;
}

const TeacherCompanyEvaluationsPage: React.FC = () => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<CompanyEvaluation[]>([]);
  const [stats, setStats] = useState<EvaluationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [filterHasScore, setFilterHasScore] = useState<boolean | undefined>(undefined);
  const [filterHasComment, setFilterHasComment] = useState<boolean | undefined>(undefined);

  // Get unique companies for filter
  const companies = Array.from(new Set(evaluations.map(e => e.ten_cong_ty))).sort();

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch evaluations and stats in parallel
      const [evaluationsResponse, statsResponse] = await Promise.all([
        teacherCompanyEvaluationsAPI.getCompanyEvaluations({
          search: searchTerm,
          company: selectedCompany !== 'all' ? selectedCompany : undefined,
          hasScore: filterHasScore,
          hasComment: filterHasComment
        }),
        teacherCompanyEvaluationsAPI.getEvaluationStats()
      ]);

      if (evaluationsResponse.data.success) {
        setEvaluations(evaluationsResponse.data.data.evaluations);
      }

      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Có lỗi xảy ra khi tải dữ liệu đánh giá từ doanh nghiệp');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'giang-vien') {
      fetchData();
    }
  }, [user, searchTerm, selectedCompany, filterHasScore, filterHasComment]);

  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-green-600 bg-green-100';
    if (score >= 7.0) return 'text-blue-600 bg-blue-100';
    if (score >= 5.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hoan-thanh': return 'text-green-600 bg-green-100';
      case 'dang-dien-ra': return 'text-blue-600 bg-blue-100';
      case 'chua-bat-dau': return 'text-gray-600 bg-gray-100';
      case 'tam-dung': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'hoan-thanh': return 'Hoàn thành';
      case 'dang-dien-ra': return 'Đang diễn ra';
      case 'chua-bat-dau': return 'Chưa bắt đầu';
      case 'tam-dung': return 'Tạm dừng';
      default: return status;
    }
  };

  if (user?.role !== 'giang-vien') {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Chỉ giảng viên mới có thể truy cập trang này</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
      <div className="w-full space-y-6">
        {/* Modern Header với màu Đại Nam - Full Width */}
        <div className="relative overflow-hidden shadow-xl" style={{background: 'linear-gradient(135deg, #213f99 0%, #213f99 50%, #f37320 100%)'}}>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>
          <div className="relative px-6 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30">
                    <Building2 className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2" style={{ lineHeight: '1.5' }}>Đánh giá từ Doanh nghiệp</h1>
                    <p className="text-white/90 text-lg font-medium" style={{ lineHeight: '1.5' }}>Xem và quản lý đánh giá sinh viên từ các doanh nghiệp thực tập</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl border border-white/30 shadow-lg">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-white/80 text-xs font-medium">Tổng số đánh giá</p>
                    <span className="text-white font-bold text-2xl">{evaluations.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 space-y-6">
        {/* Enhanced Info Banner */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/60 rounded-2xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                <span>💼</span> Thông tin đánh giá
              </h3>
              <p className="text-blue-800 font-medium leading-relaxed text-sm">
                Doanh nghiệp có thể gửi điểm số và nhận xét chi tiết về sinh viên thực tập. 
                Các đánh giá này sẽ xuất hiện tại đây ngay sau khi doanh nghiệp gửi. 
                Bạn có thể sử dụng thông tin này để đánh giá tổng thể về quá trình thực tập của sinh viên.
              </p>
            </div>
          </div>
        </div>

        {/* Modern Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Users className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-white/80">Tổng SV</p>
                  <p className="text-3xl font-bold">{stats.total_students}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-white/80">Đã đánh giá</p>
                  <p className="text-3xl font-bold">{stats.submitted_evaluations}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Star className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-white/80">Điểm TB</p>
                  <p className="text-3xl font-bold">
                    {stats.average_score ? stats.average_score.toFixed(1) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-white/80">Tỷ lệ</p>
                  <p className="text-3xl font-bold">{stats.completion_rate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sinh viên, mã sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-11 pr-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Company Filter */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
          >
            <option value="all">🏢 Tất cả doanh nghiệp</option>
            {companies.map(company => (
              <option key={company} value={company}>{company}</option>
            ))}
          </select>

          {/* Score Filter */}
          <select
            value={filterHasScore === undefined ? 'all' : filterHasScore ? 'yes' : 'no'}
            onChange={(e) => {
              const val = e.target.value;
              setFilterHasScore(val === 'all' ? undefined : val === 'yes');
            }}
            className="px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
          >
            <option value="all">⭐ Tất cả điểm</option>
            <option value="yes">✅ Đã chấm điểm</option>
            <option value="no">⏳ Chưa chấm điểm</option>
          </select>

          {/* Comment Filter */}
          <select
            value={filterHasComment === undefined ? 'all' : filterHasComment ? 'yes' : 'no'}
            onChange={(e) => {
              const val = e.target.value;
              setFilterHasComment(val === 'all' ? undefined : val === 'yes');
            }}
            className="px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
          >
            <option value="all">💬 Tất cả nhận xét</option>
            <option value="yes">✅ Có nhận xét</option>
            <option value="no">⏳ Chưa có nhận xét</option>
          </select>
        </div>
      </div>

      {/* Enhanced Evaluations List */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200">
        <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Danh sách đánh giá
            </h2>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-sm">
              {evaluations.length} đánh giá
            </span>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-red-500" />
              </div>
              <p className="text-red-600 font-semibold mb-4">{error}</p>
              <button
                onClick={fetchData}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold transition-all shadow-lg"
              >
                Thử lại
              </button>
            </div>
          ) : evaluations.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <MessageSquare className="w-14 h-14 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Chưa có đánh giá từ doanh nghiệp</h3>
              <p className="text-gray-600 max-w-md mx-auto text-lg">
                Hiện tại chưa có doanh nghiệp nào gửi đánh giá cho sinh viên của bạn.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {evaluations.map((evaluation) => (
                <div key={`${evaluation.id || evaluation.ma_sinh_vien}-${evaluation.ma_sinh_vien}`} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-blue-50/30">
                  {/* Student & Company Info */}
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {evaluation.ten_sinh_vien.split(' ').pop()?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{evaluation.ten_sinh_vien}</h3>
                          <p className="text-sm text-gray-600 font-medium">{evaluation.ma_sinh_vien} • {evaluation.lop}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-green-700 font-semibold mb-1">DOANH NGHIỆP THỰC TẬP</p>
                          <p className="text-base font-bold text-green-900">{evaluation.ten_cong_ty}</p>
                          {evaluation.vi_tri_thuc_tap && (
                            <p className="text-sm text-indigo-700 mt-2 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                              Vị trí: <span className="font-semibold">{evaluation.vi_tri_thuc_tap}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${getStatusColor(evaluation.trang_thai_thuc_tap)}`}>
                        {getStatusText(evaluation.trang_thai_thuc_tap)}
                      </span>
                      {evaluation.ngay_nop_danh_gia && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{new Date(evaluation.ngay_nop_danh_gia).toLocaleDateString('vi-VN')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Contact & Period Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                    <div className="flex items-center gap-2 text-sm bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
                      <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-gray-700 truncate">{evaluation.email_sinh_vien}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-purple-50 px-4 py-3 rounded-xl border border-purple-100">
                      <Building2 className="w-4 h-4 text-purple-600 flex-shrink-0" />
                      <span className="text-gray-700 truncate">{evaluation.email_cong_ty}</span>
                    </div>
                  </div>

                  {/* Internship Period */}
                  {evaluation.ngay_bat_dau_thuc_tap && (
                    <div className="flex items-center gap-2 text-sm bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 rounded-xl border border-indigo-200 mb-5">
                      <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">
                        Thời gian: {new Date(evaluation.ngay_bat_dau_thuc_tap).toLocaleDateString('vi-VN')} - {evaluation.ngay_ket_thuc_thuc_tap ? new Date(evaluation.ngay_ket_thuc_thuc_tap).toLocaleDateString('vi-VN') : 'Đang diễn ra'}
                      </span>
                    </div>
                  )}

                  {/* Company Evaluation - Enhanced */}
                  <div className="mt-5 border-2 border-amber-200 rounded-2xl p-6 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-gray-900">Đánh giá từ Doanh nghiệp</h4>
                    </div>
                    
                    <div className="space-y-4">
                      {/* Score - Enhanced */}
                      {evaluation.diem_doanh_nghiep !== null && (
                        <div className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-amber-200">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                              <Star className="w-5 h-5 text-amber-600" />
                            </div>
                            <span className="text-base font-bold text-gray-800">Điểm đánh giá</span>
                          </div>
                          <span className={`inline-flex items-center px-5 py-2.5 rounded-xl text-lg font-bold shadow-md ${getScoreColor(evaluation.diem_doanh_nghiep)}`}>
                            {evaluation.diem_doanh_nghiep}/10
                          </span>
                        </div>
                      )}

                      {/* Comment - Enhanced */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <MessageSquare className="w-5 h-5 text-amber-600" />
                          <span className="text-base font-bold text-gray-800">Nhận xét chi tiết</span>
                        </div>
                        {evaluation.nhan_xet_doanh_nghiep && evaluation.nhan_xet_doanh_nghiep.trim() ? (
                          <div className="bg-white rounded-xl p-5 border-2 border-amber-200 shadow-sm">
                            <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{evaluation.nhan_xet_doanh_nghiep}</p>
                          </div>
                        ) : (
                          <div className="bg-white rounded-xl p-5 border-2 border-dashed border-amber-300">
                            <p className="text-sm text-gray-500 italic text-center">⏳ Chưa có nhận xét từ doanh nghiệp</p>
                          </div>
                        )}
                      </div>

                      {/* Batch Info - Enhanced */}
                      {evaluation.ten_dot && (
                        <div className="flex items-center gap-2 pt-4 border-t-2 border-amber-200">
                          <div className="flex-1 flex items-center gap-2 text-sm text-gray-700 bg-white px-4 py-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-amber-600" />
                            <span className="font-semibold">Đợt:</span>
                            <span>{evaluation.ten_dot}</span>
                            {evaluation.thoi_gian_bat_dau_dot && evaluation.thoi_gian_ket_thuc_dot && (
                              <span className="ml-4">
                                ({new Date(evaluation.thoi_gian_bat_dau_dot).toLocaleDateString('vi-VN')} - {new Date(evaluation.thoi_gian_ket_thuc_dot).toLocaleDateString('vi-VN')})
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCompanyEvaluationsPage;