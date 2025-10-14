import React, { useMemo, useState } from 'react';
import { FileText, Calendar, User, Plus, Clock, CheckCircle, Users, BarChart3, Building2, Edit3, Download } from 'lucide-react';
import { useTeacherStudents, useTeacherReportsStats } from '../hooks/useTeacherReports';
import { useTeacherSlots, useSlotStatuses, createSlot, addComment } from '../hooks/useTeacherSubmissions';
import type { TeacherStudent } from '../types';
import { updateSlotTimes } from '../services/teacherSubmissionsAPI';

// (Old create-report modal removed)

// Modal tạo đợt nộp bài mới
const CreateSubmissionSlotModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}> = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    tieu_de: '',
    loai_bao_cao: 'tuan',
    mo_ta: '',
    start_at: '',
    end_at: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tieu_de || !form.start_at || !form.end_at) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Tạo đợt nộp bài</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
            <input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" required value={form.tieu_de} onChange={(e)=>setForm({...form, tieu_de:e.target.value})} placeholder="VD: Báo cáo tuần 1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu *</label>
              <input type="datetime-local" required value={form.start_at} onChange={(e)=>setForm({...form, start_at:e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc *</label>
              <input type="datetime-local" required value={form.end_at} onChange={(e)=>setForm({...form, end_at:e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea rows={3} value={form.mo_ta} onChange={(e)=>setForm({...form, mo_ta:e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Thông tin thêm cho đợt nộp..." />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Tạo đợt nộp</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal sửa thời gian đợt nộp
const EditSlotTimesModal: React.FC<{
  slot: any;
  onClose: () => void;
  onSubmit: (data: { start_at: string; end_at: string }) => void;
}> = ({ slot, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    start_at: '',
    end_at: ''
  });

  React.useEffect(() => {
    if (slot) {
      const toLocal = (s: string) => {
        // convert DB datetime to input[type=datetime-local]
        const d = new Date(s);
        const pad = (n:number)=>String(n).padStart(2,'0');
        const yyyy=d.getFullYear();
        const mm=pad(d.getMonth()+1);
        const dd=pad(d.getDate());
        const hh=pad(d.getHours());
        const mi=pad(d.getMinutes());
        return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
      };
      setForm({ start_at: toLocal(slot.start_at), end_at: toLocal(slot.end_at) });
    }
  }, [slot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.start_at || !form.end_at) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Chỉnh sửa thời gian</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu</label>
            <input type="datetime-local" value={form.start_at} onChange={(e)=>setForm({...form, start_at:e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc</label>
            <input type="datetime-local" value={form.end_at} onChange={(e)=>setForm({...form, end_at:e.target.value})} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TeacherReportsPage: React.FC = () => {
  const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';
  const FILE_BASE = API_URL.replace(/\/api\/?$/, '');
  // const [filterType] = useState('all');

  // Sử dụng hooks API thực
  const { students, loading: studentsLoading, error: studentsError } = useTeacherStudents();
  const { stats, loading: statsLoading, error: statsError } = useTeacherReportsStats();
  // const { reports } = useTeacherReports();

  // Quản lý đợt nộp bài của sinh viên
  const { slots, refresh: refreshSlots } = useTeacherSlots();
  const [selectedSlotId, setSelectedSlotId] = useState<number | undefined>(undefined);
  const { data: slotStatuses, loading: statusesLoading, error: statusesError, load: loadStatuses } = useSlotStatuses(selectedSlotId);
  const [showCreateSlotModal, setShowCreateSlotModal] = useState(false);
  const [showEditTimes, setShowEditTimes] = useState(false);
  const selectedSlot = useMemo(() => slots.find((s:any) => s.id === selectedSlotId), [slots, selectedSlotId]);

  // (Old create report handler removed)

  const filteredStudents = students;

  // Teacher grading modal state
  const [gradingStudent, setGradingStudent] = useState<any|null>(null);
  const [gradeForm, setGradeForm] = useState<{diem?: number|string; nhan_xet?: string}>({});
  const [savingGrade, setSavingGrade] = useState(false);
  const API_GV = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';
  const authHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) } as any;
  };
  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_GV}/teacher-reports/export-evaluations`, {
        headers: { ...(token && { Authorization: `Bearer ${token}` }) }
      });
      if (!res.ok) throw new Error('Xuất file thất bại');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'teacher-evaluations.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e:any) {
      alert(e.message || 'Không thể xuất file');
    }
  };
  const openGrading = async (student:any) => {
    setGradingStudent(student);
    setGradeForm({ diem: '', nhan_xet: '' });
    try {
      const res = await fetch(`${API_GV}/teacher-reports/students/${student.ma_sinh_vien}/evaluation`, { headers: authHeaders() });
      if (res.ok) {
        const j = await res.json();
        if (j?.data) setGradeForm({ diem: j.data.diem_giang_vien ?? '', nhan_xet: j.data.nhan_xet_giang_vien ?? '' });
      }
    } catch {}
  };
  const saveGrading = async () => {
    if (!gradingStudent) return;
    if (gradeForm.diem === undefined || gradeForm.diem === '') {
      alert('Vui lòng chọn điểm trước khi lưu!');
      return;
    }
    
    setSavingGrade(true);
    try {
      const payload = {
        diem_giang_vien: Number(gradeForm.diem),
        nhan_xet_giang_vien: gradeForm.nhan_xet || ''
      };
      
      const res = await fetch(`${API_GV}/teacher-reports/students/${gradingStudent.ma_sinh_vien}/grade`, { 
        method: 'POST', 
        headers: authHeaders(), 
        body: JSON.stringify(payload) 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Lưu thất bại');
      }
      
      alert('✅ Đã lưu điểm thành công!\nKết quả sẽ hiển thị cho Admin và Sinh viên.');
      setGradingStudent(null);
      setGradeForm({ diem: '', nhan_xet: '' });
    } catch (error: any) {
      console.error('Lỗi lưu điểm:', error);
      alert('❌ Lỗi: ' + (error.message || 'Không thể lưu điểm'));
    } finally {
      setSavingGrade(false);
    }
  };

  // Lọc báo cáo theo loại
  // const filteredReports = reports.filter((report: TeacherReportType) => {
  //   if (filterType === 'all') return true;
  //   return report.loai_bao_cao === filterType;
  // });

  if (studentsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (studentsError || statsError) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">Có lỗi xảy ra: {studentsError || statsError}</div>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="p-6 max-w-7xl mx-auto">
        {/* Modern Header với màu Đại Nam */}
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-3xl shadow-xl" style={{background: 'linear-gradient(135deg, #213f99 0%, #213f99 50%, #f37320 100%)'}}>
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>
            <div className="relative p-8">
              <div className="flex items-center space-x-6 mb-6">
                <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl shadow-xl border border-white/30">
                  <FileText className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2" style={{ lineHeight: '1.5' }}>Báo cáo Giảng viên</h1>
                  <p className="text-white/90 text-lg font-medium" style={{ lineHeight: '1.5' }}>Quản lý báo cáo thực tập cho sinh viên bạn hướng dẫn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                <p className="text-sm text-gray-600 font-medium">Tổng SV hướng dẫn</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stats.activeInternships}</p>
                <p className="text-sm text-gray-600 font-medium">Đang thực tập</p>
              </div>
            </div>
          </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{stats.submittedReports}</p>
              <p className="text-sm text-gray-600">Báo cáo đã nộp</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReports}</p>
              <p className="text-sm text-gray-600">Chưa nộp báo cáo</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
              <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

  {/* (Search bar and old "Tạo báo cáo mới" removed) */}

      {/* Đợt nộp bài cho sinh viên */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Đợt nộp bài</h2>
            <p className="text-sm text-gray-600">Tạo thời gian và theo dõi việc nộp bài của sinh viên</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedSlotId || ''}
              onChange={(e) => {
                const id = e.target.value ? Number(e.target.value) : undefined;
                setSelectedSlotId(id);
                if (id) loadStatuses(id);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[260px]"
            >
              <option value="">-- Chọn đợt nộp --</option>
              {slots.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.tieu_de} ({new Date(s.start_at).toLocaleString()} → {new Date(s.end_at).toLocaleString()})
                </option>
              ))}
            </select>
            <button
              disabled={!selectedSlotId}
              onClick={() => setShowEditTimes(true)}
              className={`flex items-center px-4 py-2 rounded-md border ${selectedSlotId ? 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300' : 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'}`}
            >
              <Calendar className="h-4 w-4 mr-2" /> Sửa thời gian
            </button>
            <button onClick={() => setShowCreateSlotModal(true)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" /> Tạo đợt nộp
            </button>
          </div>
        </div>

        {selectedSlotId && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sinh viên</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lớp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian nộp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhận xét</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm DN</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhận xét DN</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {statusesLoading && (
                  <tr><td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">Đang tải...</td></tr>
                )}
                {statusesError && (
                  <tr><td colSpan={8} className="px-6 py-4 text-center text-sm text-red-600">{statusesError}</td></tr>
                )}
                {!statusesLoading && slotStatuses && slotStatuses.students && slotStatuses.students.length === 0 && (
                  <tr><td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">Chưa có sinh viên</td></tr>
                )}
                {slotStatuses?.students?.map((sv: any) => (
                  <tr key={sv.ma_sinh_vien} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sv.ho_ten_sinh_vien}</div>
                      <div className="text-sm text-gray-500">{sv.ma_sinh_vien}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sv.lop || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${sv.trang_thai === 'chua_nop' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {sv.trang_thai === 'chua_nop' ? 'Chưa nộp' : (sv.trang_thai === 'da_duyet' ? 'Đã duyệt' : (sv.trang_thai === 'tu_choi' ? 'Từ chối' : 'Đã nộp'))}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sv.submitted_at ? new Date(sv.submitted_at).toLocaleString() : '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sv.file_url ? (
                        <a href={`${FILE_BASE}${sv.file_url}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          {sv.original_name || 'Xem'}
                        </a>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 truncate max-w-[220px]" title={sv.teacher_comment || ''}>{sv.teacher_comment || '—'}</span>
                        {sv.submission_id && (
                          <button
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={async () => {
                              const comment = window.prompt('Nhập nhận xét cho sinh viên', sv.teacher_comment || '');
                              if (comment !== null) {
                                await addComment(sv.submission_id, comment);
                                await loadStatuses(selectedSlotId);
                              }
                            }}
                          >
                            Nhận xét
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {sv.company_score ? (
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            {sv.company_score}/10
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {sv.company_comment ? (
                        <div className="max-w-[280px]">
                          <div className="bg-orange-50 border-l-4 border-orange-200 p-3 rounded">
                            <div className="flex items-start gap-2">
                              <Building2 className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-medium text-orange-800 mb-1">Đánh giá từ doanh nghiệp:</p>
                                <p className="text-sm text-gray-700 leading-relaxed">{sv.company_comment}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Chưa có đánh giá</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

  {/* Danh sách sinh viên hướng dẫn */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Sinh viên hướng dẫn</h2>
          <p className="text-sm text-gray-600">Danh sách {filteredStudents.length} sinh viên bạn đang hướng dẫn</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lớp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh nghiệp thực tập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chấm điểm</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student: TeacherStudent) => (
                <tr key={student.ma_sinh_vien} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.ho_ten_sinh_vien}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.ma_sinh_vien}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.lop || 'Chưa cập nhật'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.ten_cong_ty || 'Chưa có DN'}
                    </div>
                    {student.dia_chi_cong_ty && (
                      <div className="text-sm text-gray-500">
                        {student.dia_chi_cong_ty}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{student.email_ca_nhan}</div>
                    <div>{student.so_dien_thoai_sinh_vien}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.doanh_nghiep_thuc_tap 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.doanh_nghiep_thuc_tap ? 'Đang thực tập' : 'Chưa có DN'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={()=>openGrading(student)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                      <Edit3 className="w-4 h-4" /> Chấm điểm
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-8 text-gray-500">Chưa có sinh viên hướng dẫn</div>
          )}
        </div>
      </div>

  {/* Export button */}
      <div className="flex justify-end mt-4">
        <button type="button" onClick={handleExport} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md">
          <Download className="w-4 h-4" /> Xuất danh sách điểm và nhận xét
        </button>
      </div>

  {/* Danh sách báo cáo đã nộp removed */}

    {/* Create Submission Slot Modal */}
    <CreateSubmissionSlotModal
      isOpen={showCreateSlotModal}
      onClose={() => setShowCreateSlotModal(false)}
      onSubmit={async (data) => {
        try {
          const payload = { ...data };
          const res = await createSlot(payload);
          setShowCreateSlotModal(false);
          await refreshSlots();
          if (res?.id) {
            setSelectedSlotId(res.id);
            await loadStatuses(res.id);
          }
        } catch (e) {
          alert('Lỗi tạo đợt nộp');
        }
      }}
    />

    {/* Edit Slot Times Modal */}
    {showEditTimes && selectedSlot && (
      <EditSlotTimesModal
        slot={selectedSlot}
        onClose={() => setShowEditTimes(false)}
        onSubmit={async (data) => {
          try {
            // Convert local datetime to ISO to avoid timezone shifts
            const toISO = (s: string) => {
              const d = new Date(s);
              return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 19).replace('T', ' ');
            };
            await updateSlotTimes(selectedSlot.id, {
              start_at: toISO(data.start_at),
              end_at: toISO(data.end_at),
            });
            setShowEditTimes(false);
            await refreshSlots();
            if (selectedSlotId) await loadStatuses(selectedSlotId);
          } catch (e: any) {
            alert(e.message || 'Lỗi cập nhật thời gian');
          }
        }}
      />
    )}

    {/* Grading Modal */}
    {gradingStudent && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Chấm điểm: {gradingStudent.ho_ten_sinh_vien}</h3>
              <button className="text-gray-400 hover:text-gray-600" onClick={() => setGradingStudent(null)}>
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn điểm (0-10)</label>
                <select value={String(gradeForm.diem ?? '')} onChange={(e) => setGradeForm(f => ({ ...f, diem: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Chọn điểm --</option>
                  {[10,9.5,9,8.5,8,7.5,7,6.5,6,5.5,5,4.5,4,3.5,3,2.5,2,1.5,1,0.5,0].map(v => (
                    <option key={String(v)} value={String(v)}>{String(v)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét</label>
                <select value={gradeForm.nhan_xet ?? ''} onChange={(e) => setGradeForm(f => ({ ...f, nhan_xet: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2">
                  <option value="">-- Chọn nhận xét mẫu --</option>
                  <option value="Sinh viên có thái độ học tập tốt, tích cực tham gia các hoạt động">Thái độ tốt, tích cực</option>
                  <option value="Sinh viên cần cải thiện kỹ năng chuyên môn và thái độ làm việc">Cần cải thiện</option>
                  <option value="Sinh viên hoàn thành tốt nhiệm vụ được giao, có tinh thần trách nhiệm cao">Hoàn thành tốt nhiệm vụ</option>
                  <option value="Sinh viên có kỹ năng chuyên môn vững vàng, làm việc hiệu quả">Kỹ năng chuyên môn tốt</option>
                  <option value="Sinh viên xuất sắc, đáp ứng vượt mức yêu cầu">Xuất sắc</option>
                </select>
                <textarea rows={3} value={gradeForm.nhan_xet ?? ''} onChange={(e) => setGradeForm(f => ({ ...f, nhan_xet: e.target.value }))} className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Hoặc nhập nhận xét tùy chỉnh..." />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setGradingStudent(null)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Hủy</button>
                <button type="button" onClick={saveGrading} disabled={savingGrade} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400">{savingGrade ? 'Đang lưu...' : 'Lưu điểm'}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    </div>
  </div>
  );
};

export default TeacherReportsPage;