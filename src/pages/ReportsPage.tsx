import React, { useState, useEffect } from 'react';
import { 
  Search, FileText, Download, Eye, Star, Calendar, User, Filter, 
  Clock, CheckCircle, FileSpreadsheet, Edit, Trash2,
  Layers, TrendingUp
} from 'lucide-react';
import type { WeeklyReport, FinalReport, ReportBatch } from '../types';
import { useReportBatches, useReportBatchStats } from '../hooks/useReportBatches';

// Modal components
const CreateBatchModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; }> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    tenDot: '',
    dotThucTapId: '',
    loaiBaoCao: 'weekly' as 'weekly' | 'final',
    hanNop: '',
    moTa: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
    setFormData({ tenDot: '', dotThucTapId: '', loaiBaoCao: 'weekly', hanNop: '', moTa: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tạo đợt báo cáo mới</h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đợt báo cáo</label>
            <input
              type="text"
              required
              value={formData.tenDot}
              onChange={(e) => setFormData({ ...formData, tenDot: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="VD: Báo cáo tuần 1-4 Đợt thực tập 2025"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại báo cáo</label>
            <select
              value={formData.loaiBaoCao}
              onChange={(e) => setFormData({ ...formData, loaiBaoCao: e.target.value as 'weekly' | 'final' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="weekly">Báo cáo hàng tuần</option>
              <option value="final">Báo cáo cuối kỳ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hạn nộp</label>
            <input
              type="datetime-local"
              required
              value={formData.hanNop}
              onChange={(e) => setFormData({ ...formData, hanNop: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả (tuỳ chọn)</label>
            <textarea
              value={formData.moTa}
              onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Mô tả chi tiết về đợt báo cáo..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tạo đợt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ReportsPage: React.FC = () => {
  // Use real API hooks
  const {
    reportBatches,
    fetchReportBatches,
    createReportBatch,
    deleteReportBatch,
    exportReportBatch
  } = useReportBatches();

  const {
    stats
  } = useReportBatchStats();

  // Updated mock data for weekly reports
  const [weeklyReports] = useState<WeeklyReport[]>([
    {
      id: '1',
      sinhVienId: 'sv001',
      assignmentId: 'as001',
      tuan: 1,
      noiDung: 'Tuần đầu tiên tại công ty, làm quen với môi trường làm việc và tìm hiểu quy trình phát triển phần mềm',
      fileDinhKem: 'baocao_tuan1_sv001.pdf',
      ngayNop: '2025-02-08',
      trangThai: 'da-duyet',
      nhanXetGiangVien: 'Báo cáo chi tiết, thể hiện sự chuẩn bị tốt',
      diem: 8.5,
      hoTenSinhVien: 'Nguyễn Văn An',
      maSinhVien: 'SV001',
      dotThucTapId: 'dt001',
      tenDot: 'Đợt thực tập 2025'
    },
    {
      id: '2',
      sinhVienId: 'sv001',
      assignmentId: 'as001',
      tuan: 2,
      noiDung: 'Tham gia vào dự án thực tế, học cách sử dụng Git và làm việc nhóm',
      fileDinhKem: 'baocao_tuan2_sv001.pdf',
      ngayNop: '2025-02-15',
      trangThai: 'da-duyet',
      nhanXetGiangVien: 'Tiến bộ rõ rệt, nắm bắt nhanh công nghệ mới',
      diem: 9.0,
      hoTenSinhVien: 'Nguyễn Văn An',
      maSinhVien: 'SV001',
      dotThucTapId: 'dt001',
      tenDot: 'Đợt thực tập 2025'
    },
    {
      id: '3',
      sinhVienId: 'sv002',
      assignmentId: 'as002',
      tuan: 1,
      noiDung: 'Được giao nhiệm vụ phát triển module đăng nhập cho ứng dụng web',
      ngayNop: '2025-02-08',
      trangThai: 'da-nop',
      hoTenSinhVien: 'Trần Thị Bình',
      maSinhVien: 'SV002',
      dotThucTapId: 'dt001',
      tenDot: 'Đợt thực tập 2025'
    }
  ]);

  const [finalReports] = useState<FinalReport[]>([
    {
      id: '1',
      sinhVienId: 'sv001',
      assignmentId: 'as001',
      tieuDe: 'Báo cáo thực tập tại Công ty ABC Technology',
      tomTat: 'Trong 4 tháng thực tập, em đã học được nhiều kiến thức thực tế về phát triển web...',
      fileBaoCao: 'baocao_cuoi_sv001.pdf',
      ngayNop: '2025-05-30',
      diemGiangVien: 8.8,
      diemDoanhNghiep: 9.0,
      nhanXetGiangVien: 'Sinh viên có tiến bộ rõ rệt, báo cáo chi tiết và có chiều sâu',
      nhanXetDoanhNghiep: 'Nhân viên tích cực, học hỏi nhanh, đóng góp tích cực cho dự án',
      trangThai: 'da-cham-diem',
      hoTenSinhVien: 'Nguyễn Văn An',
      maSinhVien: 'SV001',
      dotThucTapId: 'dt001',
      tenDot: 'Đợt thực tập 2025'
    }
  ]);

  const [activeView, setActiveView] = useState<'batches' | 'weekly' | 'final'>('batches');
  const [statusFilter] = useState<string>('all');
  const [selectedBatch] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Load data on component mount
  useEffect(() => {
    fetchReportBatches();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'chua-nop': return 'bg-red-100 text-red-800 border-red-200';
      case 'da-nop': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'da-duyet': return 'bg-green-100 text-green-800 border-green-200';
      case 'da-cham-diem': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'chua-mo': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'dang-mo': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'da-dong': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'chua-nop': return 'Chưa nộp';
      case 'da-nop': return 'Đã nộp';
      case 'da-duyet': return 'Đã duyệt';
      case 'da-cham-diem': return 'Đã chấm điểm';
      case 'chua-mo': return 'Chưa mở';
      case 'dang-mo': return 'Đang mở';
      case 'da-dong': return 'Đã đóng';
      default: return status;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const handleCreateBatch = async (data: any) => {
    const result = await createReportBatch({
      ten_dot: data.tenDot,
      dot_thuc_tap_id: data.dotThucTapId || 'dt001', // Default for now
      loai_bao_cao: data.loaiBaoCao,
      han_nop: data.hanNop,
      mo_ta: data.moTa
    });
    
    if (result) {
      // Success message could be shown here
    }
  };

  const handleExportReports = async () => {
    // Export all batches or show selection dialog
    console.log('Exporting reports...');
  };

  const handleDeleteBatch = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đợt báo cáo này?')) {
      await deleteReportBatch(id);
    }
  };

  const handleExportBatch = async (id: string, tenDot: string) => {
    const filename = `${tenDot.replace(/\s+/g, '_')}_${Date.now()}.xlsx`;
    await exportReportBatch(id, filename);
  };

  const filteredWeeklyReports = weeklyReports.filter(report => {
    const matchesSearch = report.noiDung.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.hoTenSinhVien?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.maSinhVien?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.trangThai === statusFilter;
    const matchesBatch = selectedBatch === 'all' || report.dotThucTapId === selectedBatch;
    return matchesSearch && matchesStatus && matchesBatch;
  });

  const filteredFinalReports = finalReports.filter(report => {
    const matchesSearch = report.tieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.hoTenSinhVien?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.maSinhVien?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.trangThai === statusFilter;
    const matchesBatch = selectedBatch === 'all' || report.dotThucTapId === selectedBatch;
    return matchesSearch && matchesStatus && matchesBatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Báo cáo</h1>
          <p className="text-gray-600 mt-1">Quản lý và theo dõi báo cáo thực tập của sinh viên</p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên sinh viên, mã SV, nội dung..."
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-72"
            />
          </div>
          <button
            onClick={handleExportReports}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Tổng đợt</p>
              <p className="text-2xl font-bold">{stats?.totalBatches || 0}</p>
            </div>
            <Layers className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Đang hoạt động</p>
              <p className="text-2xl font-bold">{stats?.activeBatches || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Báo cáo tuần</p>
              <p className="text-2xl font-bold">{stats?.weeklyReports || 0}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Báo cáo cuối kỳ</p>
              <p className="text-2xl font-bold">{stats?.finalReports || 0}</p>
            </div>
            <FileSpreadsheet className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm">Chờ duyệt</p>
              <p className="text-2xl font-bold">{stats?.pendingReviews || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Đã duyệt</p>
              <p className="text-2xl font-bold">{stats?.approvedReports || 0}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-teal-200" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveView('batches')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeView === 'batches'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-2" />
              Quản lý đợt
            </button>
            <button
              onClick={() => setActiveView('weekly')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeView === 'weekly'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Báo cáo tuần
            </button>
            <button
              onClick={() => setActiveView('final')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeView === 'final'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 inline mr-2" />
              Báo cáo cuối kỳ
            </button>
          </nav>
        </div>

        {/* Filters */}
        {activeView !== 'batches' && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Batch Filter */}
              <div className="relative w-full lg:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Layers className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div className="relative w-full lg:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6">
          {activeView === 'batches' ? (
            /* Report Batches Management */
            <div className="space-y-4">
              {reportBatches.map((batch: ReportBatch) => (
                <div key={batch.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{batch.tenDot}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(batch.trangThai)}`}>
                          {getStatusText(batch.trangThai)}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          batch.loaiBaoCao === 'weekly' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {batch.loaiBaoCao === 'weekly' ? 'Báo cáo tuần' : 'Báo cáo cuối kỳ'}
                        </span>
                      </div>
                      
                      {batch.moTa && (
                        <p className="text-gray-600 text-sm mb-3">{batch.moTa}</p>
                      )}

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{batch.tongSoSinhVien}</div>
                          <div className="text-xs text-blue-600">Tổng SV</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{batch.soDaNop}</div>
                          <div className="text-xs text-green-600">Đã nộp</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">{batch.soDaDuyet}</div>
                          <div className="text-xs text-purple-600">Đã duyệt</div>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">
                            {Math.round((batch.soDaNop / batch.tongSoSinhVien) * 100)}%
                          </div>
                          <div className="text-xs text-orange-600">Tỷ lệ nộp</div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500 gap-4">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Hạn nộp: {new Date(batch.hanNop).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-2">
                      <button className="flex items-center px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <Eye className="w-4 h-4 mr-1" />
                        Xem chi tiết
                      </button>
                      <button 
                        onClick={() => handleExportBatch(batch.id, batch.tenDot)}
                        className="flex items-center px-3 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Xuất Excel
                      </button>
                      <button className="flex items-center px-3 py-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                        <Edit className="w-4 h-4 mr-1" />
                        Chỉnh sửa
                      </button>
                      {batch.trangThai === 'chua-mo' && (
                        <button 
                          onClick={() => handleDeleteBatch(batch.id)}
                          className="flex items-center px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Xoá
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeView === 'weekly' ? (
            /* Weekly Reports */
            <div className="space-y-4">
              {filteredWeeklyReports.map((report) => (
                <div key={report.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-3">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{report.hoTenSinhVien}</span>
                          <span className="text-sm text-gray-500">({report.maSinhVien})</span>
                        </div>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-blue-600 font-medium">Tuần {report.tuan}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{report.tenDot}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{report.noiDung}</p>
                      {report.fileDinhKem && (
                        <div className="flex items-center text-sm text-blue-600 mb-2">
                          <FileText className="w-4 h-4 mr-1" />
                          <span>{report.fileDinhKem}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.trangThai)}`}>
                        {getStatusText(report.trangThai)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{new Date(report.ngayNop).toLocaleDateString('vi-VN')}</span>
                      </div>
                      {report.diem && (
                        <div className="flex items-center">
                          <span className="font-medium text-green-600">Điểm: {report.diem}/10</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button className="flex items-center px-3 py-1 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </button>
                      {report.trangThai === 'da-nop' && (
                        <button className="px-3 py-1 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                          Chấm điểm
                        </button>
                      )}
                    </div>
                  </div>

                  {report.nhanXetGiangVien && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium text-blue-800">Nhận xét GV:</span> {report.nhanXetGiangVien}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Final Reports */
            <div className="space-y-4">
              {filteredFinalReports.map((report) => (
                <div key={report.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.tieuDe}</h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{report.hoTenSinhVien}</span>
                        <span className="text-sm text-gray-500">({report.maSinhVien})</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{report.tenDot}</span>
                      </div>
                      <p className="text-gray-700 mb-3">{report.tomTat}</p>
                      <div className="flex items-center text-sm text-blue-600">
                        <FileText className="w-4 h-4 mr-1" />
                        <span>{report.fileBaoCao}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.trangThai)}`}>
                        {getStatusText(report.trangThai)}
                      </span>
                    </div>
                  </div>

                  {/* Scores */}
                  {(report.diemGiangVien || report.diemDoanhNghiep) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {report.diemGiangVien && (
                        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                          <span className="text-sm text-blue-700 font-medium">Điểm GV:</span>
                          <span className="font-bold text-blue-600">{report.diemGiangVien}/10</span>
                          <div className="flex ml-2">
                            {renderStars(report.diemGiangVien)}
                          </div>
                        </div>
                      )}
                      {report.diemDoanhNghiep && (
                        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                          <span className="text-sm text-green-700 font-medium">Điểm DN:</span>
                          <span className="font-bold text-green-600">{report.diemDoanhNghiep}/10</span>
                          <div className="flex ml-2">
                            {renderStars(report.diemDoanhNghiep)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Nộp: {new Date(report.ngayNop).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex items-center px-3 py-1 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <Eye className="w-4 h-4 mr-1" />
                        Xem chi tiết
                      </button>
                      {report.trangThai === 'da-nop' && (
                        <button className="px-3 py-1 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                          Chấm điểm
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comments */}
                  {(report.nhanXetGiangVien || report.nhanXetDoanhNghiep) && (
                    <div className="mt-4 space-y-3">
                      {report.nhanXetGiangVien && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium text-blue-800">Nhận xét GV:</span> {report.nhanXetGiangVien}
                          </p>
                        </div>
                      )}
                      {report.nhanXetDoanhNghiep && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium text-green-800">Nhận xét DN:</span> {report.nhanXetDoanhNghiep}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Batch Modal */}
        <CreateBatchModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBatch}
        />
      </div>
    </div>
  );
};

export default ReportsPage;