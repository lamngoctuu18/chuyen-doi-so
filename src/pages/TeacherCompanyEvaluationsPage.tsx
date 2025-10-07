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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-xl">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Đánh giá từ Doanh nghiệp</h1>
                <p className="text-gray-600 text-lg font-medium">Xem và quản lý đánh giá sinh viên từ các doanh nghiệp thực tập</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-3 rounded-2xl border border-indigo-200">
              <Building2 className="w-6 h-6 text-indigo-600" />
              <span className="text-indigo-800 font-bold text-lg">{evaluations.length} đánh giá</span>
            </div>
          </div>

          {/* Enhanced Info Banner */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/60 rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">💼 Đánh giá từ doanh nghiệp</h3>
                <p className="text-blue-800 font-medium leading-relaxed">
                  Doanh nghiệp có thể gửi điểm số và nhận xét chi tiết về sinh viên thực tập. 
                  Các đánh giá này sẽ xuất hiện tại đây ngay sau khi doanh nghiệp gửi. 
                  Bạn có thể sử dụng thông tin này để đánh giá tổng thể về quá trình thực tập của sinh viên.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Tổng sinh viên</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total_students}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Đã có đánh giá</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.submitted_evaluations}</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Điểm TB</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {stats.average_score ? stats.average_score.toFixed(1) : 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tỷ lệ hoàn thành</p>
                <p className="text-2xl font-bold text-orange-600">{stats.completion_rate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên sinh viên, mã sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Company Filter */}
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả doanh nghiệp</option>
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
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả điểm</option>
            <option value="yes">Đã chấm điểm</option>
            <option value="no">Chưa chấm điểm</option>
          </select>

          {/* Comment Filter */}
          <select
            value={filterHasComment === undefined ? 'all' : filterHasComment ? 'yes' : 'no'}
            onChange={(e) => {
              const val = e.target.value;
              setFilterHasComment(val === 'all' ? undefined : val === 'yes');
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả nhận xét</option>
            <option value="yes">Đã có nhận xét</option>
            <option value="no">Chưa có nhận xét</option>
          </select>
        </div>
      </div>

      {/* Evaluations List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Danh sách đánh giá ({evaluations.length})
          </h2>
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
          ) : evaluations.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đánh giá từ doanh nghiệp</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Hiện tại chưa có doanh nghiệp nào gửi đánh giá cho sinh viên của bạn.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {evaluations.map((evaluation) => (
                <div key={`${evaluation.id || evaluation.ma_sinh_vien}-${evaluation.ma_sinh_vien}`} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
                  {/* Student & Company Info */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {evaluation.ten_sinh_vien.split(' ').pop()?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{evaluation.ten_sinh_vien}</h3>
                          <p className="text-sm text-gray-600">{evaluation.ma_sinh_vien} - {evaluation.lop}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 p-2 bg-green-50 rounded-md">
                        <Building2 className="w-4 h-4 text-green-600" />
                        <div>
                          <p className="text-xs text-green-600 font-medium">Doanh nghiệp thực tập</p>
                          <p className="text-sm text-green-800">{evaluation.ten_cong_ty}</p>
                          {evaluation.vi_tri_thuc_tap && (
                            <p className="text-xs text-indigo-700 mt-1">Nhóm thực tập: <span className="font-medium">{evaluation.vi_tri_thuc_tap}</span></p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(evaluation.trang_thai_thuc_tap)}`}>
                        {getStatusText(evaluation.trang_thai_thuc_tap)}
                      </span>
                      {evaluation.ngay_nop_danh_gia && (
                        <p className="text-xs text-gray-500 mt-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Gửi: {new Date(evaluation.ngay_nop_danh_gia).toLocaleDateString('vi-VN')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{evaluation.email_sinh_vien}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Building2 className="w-4 h-4 mr-2" />
                      <span>{evaluation.email_cong_ty}</span>
                    </div>
                  </div>

                  {/* Internship Period */}
                  {evaluation.ngay_bat_dau_thuc_tap && (
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        Thời gian thực tập: {' '}
                        {new Date(evaluation.ngay_bat_dau_thuc_tap).toLocaleDateString('vi-VN')} - 
                        {evaluation.ngay_ket_thuc_thuc_tap ? new Date(evaluation.ngay_ket_thuc_thuc_tap).toLocaleDateString('vi-VN') : 'Đang diễn ra'}
                      </span>
                    </div>
                  )}

                  {/* Company Evaluation */}
                  <div className="mt-4 border-t pt-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
                      <Star className="w-5 h-5 text-yellow-500" /> 
                      <span>Đánh giá từ doanh nghiệp</span>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Score */}
                      {evaluation.diem_doanh_nghiep !== null && (
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700 min-w-[60px]">Điểm số:</span>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(evaluation.diem_doanh_nghiep)}`}>
                            {evaluation.diem_doanh_nghiep}/10
                          </span>
                        </div>
                      )}

                      {/* Comment (always render with placeholder) */}
                      <div>
                        <span className="text-sm font-medium text-gray-700 block mb-2">Nhận xét chi tiết:</span>
                        {evaluation.nhan_xet_doanh_nghiep && evaluation.nhan_xet_doanh_nghiep.trim() ? (
                          <div className="bg-white rounded-md p-3 border border-yellow-200">
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">{evaluation.nhan_xet_doanh_nghiep}</p>
                          </div>
                        ) : (
                          <div className="bg-white rounded-md p-3 border border-dashed border-yellow-300">
                            <p className="text-sm text-gray-500 italic">Chưa có nhận xét từ doanh nghiệp</p>
                          </div>
                        )}
                      </div>

                      {/* Batch Info */}
                      {evaluation.ten_dot && (
                        <div className="text-xs text-gray-500 pt-2 border-t border-yellow-200">
                          <span>Đợt thực tập: {evaluation.ten_dot}</span>
                          {evaluation.thoi_gian_bat_dau_dot && evaluation.thoi_gian_ket_thuc_dot && (
                            <span className="ml-4">
                              ({new Date(evaluation.thoi_gian_bat_dau_dot).toLocaleDateString('vi-VN')} - {new Date(evaluation.thoi_gian_ket_thuc_dot).toLocaleDateString('vi-VN')})
                            </span>
                          )}
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
  );
};

export default TeacherCompanyEvaluationsPage;