import React, { useEffect, useMemo, useState } from 'react';
import { Download, FileText, Upload, User, Building2 } from 'lucide-react';
import { teacherReportsAPI } from '../services/teacherReportsAPI';
import { getAdvisorInfo, listAllSlotsForStudent, uploadMultipleStudentSubmissions, listMySubmissions } from '../services/teacherSubmissionsAPI';

const formatDateTime = (s?: string) => {
  if (!s) return '';
  try { return new Date(s).toLocaleString(); } catch { return s; }
};

const StudentSubmissionsPage: React.FC = () => {
  const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';
  const FILE_BASE = API_URL.replace(/\/api\/?$/, '');
  const WORD_TEMPLATES = [
    { name: 'Mẫu báo cáo tốt nghiệp', path: `${FILE_BASE}/uploads/word/Template-BaoCao-TTTN.docx` },
    { name: 'Mẫu nhật ký thực tập', path: `${FILE_BASE}/uploads/word/nhatkythuctap.docx` },
  ];
  const [advisor, setAdvisor] = useState<any | null>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [myFiles, setMyFiles] = useState<any[]>([]);
  const [myEvaluation, setMyEvaluation] = useState<any | null>(null);
  const selectedSlot = useMemo(() => slots.find(s => s.id === selectedSlotId), [slots, selectedSlotId]);

  useEffect(() => {
    (async () => {
      try {
        const a = await getAdvisorInfo();
        setAdvisor(a);
      } catch {}
      try {
        const s = await listAllSlotsForStudent();
        setSlots(s);
        if (s && s.length > 0) setSelectedSlotId(s[0].id);
      } catch {}
      try {
        const ev = await teacherReportsAPI.getMyEvaluation();
        setMyEvaluation(ev?.data || null);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedSlotId) return;
      try {
        const mine = await listMySubmissions(selectedSlotId);
        setMyFiles(mine);
      } catch {}
    })();
  }, [selectedSlotId]);

  const canSubmit = useMemo(() => {
    if (!selectedSlot) return false;
    const now = Date.now();
    const start = new Date(selectedSlot.start_at).getTime();
    const end = new Date(selectedSlot.end_at).getTime();
    return now >= start && now <= end;
  }, [selectedSlot]);

  const handleUpload = async () => {
    if (!selectedSlotId || files.length === 0) return;
    setUploading(true);
    try {
      await uploadMultipleStudentSubmissions(selectedSlotId, files);
      setFiles([]);
      const mine = await listMySubmissions(selectedSlotId);
      setMyFiles(mine);
      alert('Nộp bài thành công');
    } catch (e: any) {
      alert(e.message || 'Lỗi nộp bài');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Enhanced Modern Header */}
        <div className="relative rounded-3xl shadow-2xl p-8 text-white overflow-hidden" style={{background: 'linear-gradient(135deg, #213f99 0%, #213f99 50%, #f37320 100%)'}}>
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-orange-100 bg-clip-text text-transparent" style={{ lineHeight: '1.5' }}>
                    Nộp Báo cáo
                  </h1>
                  <p className="text-blue-100 text-lg font-medium">Gửi báo cáo thực tập của bạn một cách dễ dàng</p>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-100">Hỗ trợ nhiều định dạng file</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span className="text-blue-100">Tối đa 25MB mỗi file</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full flex items-center justify-center backdrop-blur-sm">
                <FileText className="h-16 w-16 text-white/80" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Slot selector */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Đợt báo cáo</h2>
                  <p className="text-gray-600 font-medium">Chọn đợt báo cáo để nộp bài</p>
                </div>
              </div>
              {slots.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">Chưa có đợt báo cáo nào</p>
                  <p className="text-gray-500 text-sm mt-2">Giảng viên chưa tạo đợt báo cáo. Vui lòng liên hệ giảng viên hướng dẫn.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <select
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl bg-white text-gray-800 font-semibold shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-300 transition-all duration-200 appearance-none cursor-pointer"
                      value={selectedSlotId ?? ''}
                      onChange={e => setSelectedSlotId(Number(e.target.value))}
                    >
                      {slots.map(s => (
                        <option key={s.id} value={s.id}>
                          📝 {s.tieu_de} ({new Date(s.start_at).toLocaleDateString()} - {new Date(s.end_at).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {selectedSlot && (
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-xl">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm text-blue-600 font-medium">Tiêu đề</div>
                            <div className="font-bold text-blue-900">{selectedSlot.tieu_de}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-xl">
                            <div className={`w-3 h-3 rounded-full ${canSubmit ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600 font-medium">Trạng thái</div>
                            <div className={`font-bold ${canSubmit ? 'text-green-600' : 'text-red-600'}`}>
                              {canSubmit ? '🟢 Đang mở' : (
                                new Date().getTime() < new Date(selectedSlot.start_at).getTime() ? 
                                '🟡 Chưa mở' : '🔴 Đã đóng'
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="text-sm text-blue-800">
                          <span className="font-semibold">Thời gian:</span> {formatDateTime(selectedSlot.start_at)} - {formatDateTime(selectedSlot.end_at)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>

            {/* Enhanced Upload Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Tải lên file báo cáo</h2>
                  <p className="text-gray-600 font-medium">Chọn và tải lên các file báo cáo của bạn</p>
                </div>
              </div>

              {/* File Upload Area */}
              <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-blue-400 transition-colors duration-200 bg-gradient-to-br from-gray-50 to-blue-50">
                <input
                  type="file"
                  multiple
                  onChange={e => setFiles(Array.from(e.target.files || []))}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Kéo thả file hoặc click để chọn</h3>
                  <p className="text-gray-600 mb-4">Hỗ trợ: PDF, Word, Excel, PowerPoint, TXT, ZIP</p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Nhiều file cùng lúc
                    </span>
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      Tối đa 25MB/file
                    </span>
                  </div>
                </div>
              </div>

              {/* Selected Files Display */}
              {files.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                  <h4 className="font-semibold text-blue-900 mb-3">File đã chọn ({files.length}):</h4>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">{file.name}</div>
                            <div className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                          </div>
                        </div>
                        <button
                          onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {!canSubmit && selectedSlot && (
                    <div className="flex items-center space-x-2 text-red-600">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>Không thể nộp sau thời hạn</span>
                    </div>
                  )}
                </div>
                <button
                  disabled={!canSubmit || files.length === 0 || uploading}
                  onClick={handleUpload}
                  className={`px-8 py-4 rounded-2xl font-bold flex items-center shadow-lg transition-all duration-200 ${
                    !canSubmit || files.length === 0 || uploading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Đang nộp...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-3" />
                      Nộp bài ({files.length} file)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Enhanced My submissions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Bài đã nộp</h2>
                    <p className="text-gray-600 font-medium">File bạn đã gửi cho đợt này</p>
                  </div>
                </div>
                {myFiles.length > 0 && (
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-xl">
                    <span className="text-sm font-semibold text-purple-800">{myFiles.length} file</span>
                  </div>
                )}
              </div>

              {myFiles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">Chưa có file nào</p>
                  <p className="text-gray-500 text-sm mt-2">Bạn chưa nộp file nào cho đợt báo cáo này.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myFiles.map((f) => (
                    <div key={f.id} className="group bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                            <FileText className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-900 text-lg">{f.original_name}</div>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Nộp lúc: {formatDateTime(f.submitted_at)}</span>
                              </div>
                              {f.teacher_comment && (
                                <div className="flex items-center space-x-2 text-sm text-emerald-600">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                  <span className="font-medium">Có nhận xét</span>
                                </div>
                              )}
                            </div>
                            {f.teacher_comment && (
                              <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                                <div className="text-sm font-semibold text-emerald-800 mb-1">Nhận xét từ giảng viên:</div>
                                <div className="text-sm text-emerald-700">{f.teacher_comment}</div>
                              </div>
                            )}
                          </div>
                        </div>
                        <a
                          className="ml-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 font-semibold flex items-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                          href={`${FILE_BASE}${f.file_url}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Tải về
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-8">
            {/* Enhanced Templates */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg">
                  <Download className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Mẫu file</h2>
                  <p className="text-gray-600 text-sm font-medium">Tải về các mẫu báo cáo</p>
                </div>
              </div>
              <div className="space-y-4">
                {WORD_TEMPLATES.map(t => (
                  <a
                    key={t.name}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 group border border-blue-200 hover:border-blue-300"
                    href={t.path}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="p-2 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                      <Download className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-blue-900 group-hover:text-blue-700">{t.name}</div>
                      <div className="text-xs text-blue-600">Click để tải về</div>
                    </div>
                    <div className="text-blue-400 group-hover:text-blue-600 transition-colors">
                      →
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Enhanced Advisor Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Giảng viên hướng dẫn</h2>
                  <p className="text-gray-600 text-sm font-medium">Thông tin người hướng dẫn</p>
                </div>
              </div>
              {advisor && (advisor.ten_giang_vien || advisor.ma_giang_vien) ? (
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {(advisor.ten_giang_vien || advisor.ma_giang_vien).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-blue-900 text-lg">{advisor.ten_giang_vien || advisor.ma_giang_vien}</div>
                    <div className="text-sm text-blue-600 font-medium">Giảng viên hướng dẫn</div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Đang hoạt động</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Chưa có thông tin</p>
                  <p className="text-gray-500 text-sm mt-1">Giảng viên hướng dẫn chưa được phân công</p>
                </div>
              )}
            </div>

            {/* Enhanced Evaluation */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Đánh giá của giảng viên</h2>
                  <p className="text-gray-600 text-sm font-medium">Điểm số và nhận xét</p>
                </div>
              </div>
              {myEvaluation ? (
                <div className="space-y-6">
                  {(() => {
                    const raw = (myEvaluation as any)?.diem_giang_vien;
                    const hasVal = raw !== null && raw !== undefined && String(raw).trim() !== '';
                    const num = hasVal ? Number(raw) : null;
                    const valid = hasVal && !Number.isNaN(num as number);
                    return valid ? (
                      <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-emerald-600 font-medium mb-1">Điểm đánh giá</div>
                            <div className="text-3xl font-bold text-emerald-900">{num}/10</div>
                          </div>
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                            {num}
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${((num || 0) / 10) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-emerald-600">{(((num || 0) / 10) * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-600 font-medium">Chưa có điểm</p>
                        <p className="text-gray-500 text-sm mt-1">Giảng viên chưa chấm điểm</p>
                      </div>
                    );
                  })()}
                  
                  {(myEvaluation as any)?.nhan_xet_giang_vien ? (
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 rounded-xl">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-blue-900 mb-2">Nhận xét từ giảng viên:</div>
                          <div className="text-blue-800 leading-relaxed">{(myEvaluation as any).nhan_xet_giang_vien}</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-2xl text-center">
                      <p className="text-gray-600 text-sm">Chưa có nhận xét từ giảng viên</p>
                    </div>
                  )}
                  
                  {(myEvaluation as any)?.updated_at && (
                    <div className="text-center">
                      <span className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-xl text-xs text-gray-600">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        Cập nhật: {formatDateTime((myEvaluation as any).updated_at)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">Chưa có đánh giá</p>
                  <p className="text-gray-500 text-sm mt-2">Giảng viên chưa đánh giá báo cáo của bạn</p>
                </div>
              )}
            </div>

            {/* Enhanced Company Info */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Doanh nghiệp thực tập</h2>
                  <p className="text-gray-600 text-sm font-medium">Nơi bạn đang thực tập</p>
                </div>
              </div>
              {advisor && advisor.doanh_nghiep_thuc_tap ? (
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {advisor.doanh_nghiep_thuc_tap.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-purple-900 text-lg">{advisor.doanh_nghiep_thuc_tap}</div>
                      <div className="text-sm text-purple-600 font-medium">Doanh nghiệp thực tập</div>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Đang thực tập</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 font-medium">Chưa có thông tin</p>
                  <p className="text-gray-500 text-sm mt-1">Doanh nghiệp thực tập chưa được xác định</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default StudentSubmissionsPage;
