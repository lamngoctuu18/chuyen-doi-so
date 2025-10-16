import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, FileText } from 'lucide-react';
import { useStudents } from '../hooks/useStudents';
import { useDebounce } from '../hooks/useDebounce';
import RegistrationPeriodModal from '../components/RegistrationPeriodModal';
import HorizontalScrollTable from '../components/HorizontalScrollTable';
import { refreshDashboardWithDelay } from '../utils/dashboardUtils';
// import types if needed later

const StudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const observer = useRef<IntersectionObserver | null>(null);
  const [sortBy, setSortBy] = useState<'none' | 'teacher' | 'company'>('none');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [groupByPosition, setGroupByPosition] = useState(false);
  
  // Separate sorting for table columns
  const [nameSortDir, setNameSortDir] = useState<'none' | 'asc' | 'desc'>('none');
  const [classSortDir, setClassSortDir] = useState<'none' | 'asc' | 'desc'>('none');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  // Notification triggers were removed from this page (not used here)

  // Chỉ gửi server-side filters cho API
  const getServerSideStatus = () => {
    if (selectedStatus === 'khoa_gioi_thieu' || selectedStatus === 'tu_lien_he') {
      return selectedStatus;
    }
    return ''; // empty means no server-side status filter
  };

  // Sử dụng hooks API thực
  const { students, pagination, loading, error, refetch } = useStudents({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm,
    status: getServerSideStatus()
  });

  // Removed overall statistics per request

  // Infinite scroll logic
  useEffect(() => {
    if (students && pagination) {
      if (currentPage === 1) {
        setAllStudents(students);
      } else {
        setAllStudents(prev => [...prev, ...students]);
      }
      setHasMore(currentPage < pagination.totalPages);
      setIsLoadingMore(false);
    }
  }, [students, pagination, currentPage]);

  // Reset when search changes or when filtering by nguyen_vong (server-side filters)
  useEffect(() => {
    const isServerSideFilter = selectedStatus === 'khoa_gioi_thieu' || selectedStatus === 'tu_lien_he' || selectedStatus === 'all';
    if (isServerSideFilter) {
      setAllStudents([]);
      setCurrentPage(1);
      setHasMore(true);
    }
  }, [selectedStatus]);

  // Reset when search term changes
  useEffect(() => {
    setAllStudents([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [debouncedSearchTerm]);

  const lastStudentElementRef = useCallback((node: HTMLTableRowElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
        setIsLoadingMore(true);
        setCurrentPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, isLoadingMore]);

  // Kiểm tra xem sinh viên có đầy đủ thông tin để được phân công không
  const hasCompleteInfo = (student: any) => {
    const viTri = student.viTriMongMuon || student.vi_tri_muon_ung_tuyen_thuc_tap || student.viTriMuonUngTuyenThucTap;
    const doanhNghiep = student.donViThucTap || student.doanhNghiepThucTap || student.don_vi_thuc_tap || student.doanh_nghiep_thuc_tap;
    const giangVien = student.giangVienHuongDan || student.giang_vien_huong_dan || student.giang_vien;
    const nguyenVong = student.nguyenVongThucTap || student.nguyen_vong_thuc_tap || student.nguyen_vong;
    const cvPath = student.cv_path || student.cvPath || student.cv || student.cv_url || student.cvUrl;
    
    return viTri && viTri.trim() !== '' &&
           doanhNghiep && doanhNghiep.trim() !== '' &&
           giangVien && giangVien.trim() !== '' &&
      nguyenVong && nguyenVong.trim() !== '' &&
      cvPath && cvPath.toString().trim() !== '';
  };

  // Lấy danh sách thông tin còn thiếu
  const getMissingInfo = (student: any) => {
    const missing = [];
    const viTri = student.viTriMongMuon || student.vi_tri_muon_ung_tuyen_thuc_tap || student.viTriMuonUngTuyenThucTap;
    const doanhNghiep = student.donViThucTap || student.doanhNghiepThucTap || student.don_vi_thuc_tap || student.doanh_nghiep_thuc_tap;
    const giangVien = student.giangVienHuongDan || student.giang_vien_huong_dan || student.giang_vien;
    const nguyenVong = student.nguyenVongThucTap || student.nguyen_vong_thuc_tap || student.nguyen_vong;
    const cvPath = student.cv_path || student.cvPath || student.cv || student.cv_url || student.cvUrl;
    
    if (!viTri || viTri.trim() === '') missing.push('Vị trí mong muốn');
    if (!doanhNghiep || doanhNghiep.trim() === '') missing.push('Doanh nghiệp thực tập');
    if (!giangVien || giangVien.trim() === '') missing.push('Giảng viên hướng dẫn');
    if (!nguyenVong || nguyenVong.trim() === '') missing.push('Nguyện vọng thực tập');
    if (!cvPath || cvPath.toString().trim() === '') missing.push('CV');
    
    return missing;
  };

  // Xác định trạng thái thực tế dựa trên thông tin sinh viên
  const getActualStatus = (student: any) => {
    if (hasCompleteInfo(student)) {
      return 'da-phan-cong';
    }
    return student.trangThaiPhanCong || 'chua-phan-cong';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'chua-phan-cong': return 'bg-gray-100 text-gray-800';
      case 'da-phan-cong': return 'bg-green-100 text-green-800';
      case 'da-xep-nhom': return 'bg-blue-100 text-blue-800';
      case 'dang-thuc-tap': return 'bg-yellow-100 text-yellow-800';
      case 'hoan-thanh': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'chua-phan-cong': return 'Chưa phân công';
      case 'da-phan-cong': return 'Đã phân công';
      case 'da-xep-nhom': return 'Đã xếp nhóm';
      case 'dang-thuc-tap': return 'Đang thực tập';
      case 'hoan-thanh': return 'Hoàn thành';
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

  // Apply filtering, sorting and grouping to a derived array
  const getSortedStudents = () => {
    let arr = [...allStudents];

    // Client-side filtering by assignment status
    if (selectedStatus && selectedStatus !== 'all') {
      if (selectedStatus === 'da-phan-cong') {
        arr = arr.filter(student => hasCompleteInfo(student));
      } else if (selectedStatus === 'chua-phan-cong') {
        arr = arr.filter(student => !hasCompleteInfo(student));
      } else if (selectedStatus === 'khoa_gioi_thieu' || selectedStatus === 'tu_lien_he') {
        // Keep original logic for nguyen_vong filtering
        arr = arr.filter(student => {
          const nguyenVong = (student.nguyenVongThucTap || student.nguyen_vong_thuc_tap || student.nguyen_vong || '').toString();
          const normalized = nguyenVong.replace(/-/g, '_');
          return normalized === selectedStatus;
        });
      }
    }

    // Helper: normalize name
    const nameKey = (s: any) => (s.hoTen || s.ho_ten || '').toString().toLowerCase();
    // Helper: class numeric extraction (take trailing number if exists)
    const classKey = (s: any) => {
      const cls = s.lop || s.class || s.lop_hoc || '';
      const m = (cls || '').toString().match(/(\d+)/);
      return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
    };

    // Apply table column sorting first
    if (nameSortDir !== 'none') {
      arr.sort((a, b) => {
        const av = nameKey(a);
        const bv = nameKey(b);
        return nameSortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    } else if (classSortDir !== 'none') {
      arr.sort((a, b) => {
        const av = classKey(a);
        const bv = classKey(b);
        return classSortDir === 'asc' ? av - bv : bv - av;
      });
    } else if (sortBy === 'teacher') {
      // Helper: teacher name extraction
      const teacherKey = (s: any) => (s.giangVienHuongDan || s.giang_vien_huong_dan || '').toString().toLowerCase();
      arr.sort((a, b) => {
        const av = teacherKey(a);
        const bv = teacherKey(b);
        if (av === bv) {
          // If same teacher, sort by student name as secondary sort
          const aName = nameKey(a);
          const bName = nameKey(b);
          return aName.localeCompare(bName);
        }
        if (!av) return 1; // empty teacher names go to end
        if (!bv) return -1;
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    } else if (sortBy === 'company') {
      // Helper: company name extraction
      const companyKey = (s: any) => (s.doanhNghiepThucTap || s.doanh_nghiep_thuc_tap || '').toString().toLowerCase();
      arr.sort((a, b) => {
        const av = companyKey(a);
        const bv = companyKey(b);
        if (av === bv) {
          // If same company, sort by student name as secondary sort
          const aName = nameKey(a);
          const bName = nameKey(b);
          return aName.localeCompare(bName);
        }
        if (!av) return 1; // empty company names go to end
        if (!bv) return -1;
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }

    if (groupByPosition) {
      // group by desired position field (snake or camel)
      const groupKey = (s: any) => (s.viTriMongMuon || s.vi_tri_muon_ung_tuyen_thuc_tap || s.viTriMuonUngTuyenThucTap || '').toString().toLowerCase();
      arr.sort((a, b) => {
        const ga = groupKey(a);
        const gb = groupKey(b);
        if (ga === gb) return 0;
        if (!ga) return 1; // empty go to end
        if (!gb) return -1;
        return ga.localeCompare(gb);
      });
    }

    return arr;
  };

  const sortedStudents = getSortedStudents();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <div className="relative overflow-hidden" style={{background: 'linear-gradient(135deg, #213f99 0%, #213f99 50%, #f37320 100%)'}}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl mr-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    Quản lý Sinh viên
                  </h1>
                  <p className="text-xl text-blue-100 mt-2">
                    Quản lý danh sách sinh viên và phân công thực tập
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setShowRegistrationModal(true)}
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all duration-300 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quản lý thời gian ĐK
              </button>

              <button
                type="button"
                onClick={async () => {
                  if (!confirm('🤖 Phân công tự động Giảng viên và Doanh nghiệp cho tất cả sinh viên chưa phân công?\n\n⚠️ Lưu ý: Thao tác này không thể hoàn tác!')) {
                    return;
                  }

                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('http://localhost:3001/api/auto-assignment', {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    });

                    const result = await response.json();

                    if (result.success) {
                      const { teachers, companies, totalStudents } = result.data;
                      alert(`✅ Phân công tự động thành công!\n\n` +
                        `📊 Tổng sinh viên: ${totalStudents}\n\n` +
                        `👨‍🏫 Giảng viên:\n` +
                        `  • Đã phân công: ${teachers.assigned}\n` +
                        `  • Đã có trước: ${teachers.skipped}\n` +
                        `  • Lỗi: ${teachers.errors.length}\n\n` +
                        `🏢 Doanh nghiệp:\n` +
                        `  • Đã phân công: ${companies.assigned}\n` +
                        `  • Đã có trước: ${companies.skipped}\n` +
                        `  • Lỗi: ${companies.errors.length}`
                      );
                      
                      // Refresh data
                      refetch();
                      refreshDashboardWithDelay();
                    } else {
                      alert('❌ Lỗi: ' + result.message);
                    }
                  } catch (error) {
                    alert('❌ Lỗi kết nối: ' + (error as Error).message);
                  }
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg font-semibold"
              >
                <span className="mr-2">🤖</span>
                Phân công tự động
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    // Use sorted and filtered data from current view
                    const exportData = getSortedStudents();
                  
                  const resp = await fetch('http://localhost:3001/api/import/export/sinh-vien-sorted', {
                    method: 'POST',
                    headers: { 
                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      students: exportData,
                      sortInfo: {
                        teacherSort: sortBy === 'teacher' ? `${sortBy}-${sortDir}` : null,
                        companySort: sortBy === 'company' ? `${sortBy}-${sortDir}` : null,
                        nameSort: nameSortDir !== 'none' ? nameSortDir : null,
                        classSort: classSortDir !== 'none' ? classSortDir : null,
                        groupByPosition: groupByPosition
                      }
                    })
                  });
                  
                  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                  const blob = await resp.blob();
                  const downloadUrl = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  
                  // Create filename based on filters and sorting
                  let filename = 'sinh-vien';
                  if (selectedStatus === 'da-phan-cong') filename += '-da-phan-cong';
                  else if (selectedStatus === 'chua-phan-cong') filename += '-chua-phan-cong';
                  else if (selectedStatus === 'khoa_gioi_thieu') filename += '-khoa-gioi-thieu';
                  else if (selectedStatus === 'tu_lien_he') filename += '-tu-lien-he';
                  if (debouncedSearchTerm) filename += '-tim-kiem';
                  
                  // Add sorting info to filename
                  if (sortBy === 'teacher') {
                    filename += `-gv-${sortDir === 'asc' ? 'az' : 'za'}`;
                  } else if (sortBy === 'company') {
                    filename += `-dn-${sortDir === 'asc' ? 'az' : 'za'}`;
                  } else if (nameSortDir !== 'none') {
                    filename += `-ten-${nameSortDir === 'asc' ? 'az' : 'za'}`;
                  } else if (classSortDir !== 'none') {
                    filename += `-lop-${classSortDir === 'asc' ? '19' : '91'}`;
                  }
                  
                  if (groupByPosition) filename += '-theo-vi-tri';
                  filename += '.xlsx';
                  
                  a.download = filename;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(downloadUrl);
                } catch (e) {
                  alert('Lỗi xuất Excel: ' + (e as Error).message);
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <span>Xuất Excel</span>
              <div className="flex gap-1">
                {selectedStatus !== 'all' && (
                  <span className="px-1.5 py-0.5 bg-blue-700 rounded text-xs">
                    {selectedStatus === 'da-phan-cong' ? 'Đã PC' : 
                      selectedStatus === 'chua-phan-cong' ? 'Chưa PC' :
                      selectedStatus === 'khoa_gioi_thieu' ? 'Khoa GT' : 'Tự LH'}
                  </span>
                )}
                {sortBy === 'teacher' && (
                  <span className="px-1.5 py-0.5 bg-blue-700 rounded text-xs">
                    GV-{sortDir === 'asc' ? 'A→Z' : 'Z→A'}
                  </span>
                )}
                {nameSortDir !== 'none' && (
                  <span className="px-1.5 py-0.5 bg-blue-700 rounded text-xs">
                    Tên-{nameSortDir === 'asc' ? 'A→Z' : 'Z→A'}
                  </span>
                )}
                {classSortDir !== 'none' && (
                  <span className="px-1.5 py-0.5 bg-blue-700 rounded text-xs">
                    Lớp-{classSortDir === 'asc' ? '1→9' : '9→1'}
                  </span>
                )}
                {groupByPosition && (
                  <span className="px-1.5 py-0.5 bg-blue-700 rounded text-xs">
                    Theo VT
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Registration Modal */}
      {showRegistrationModal && (
        <RegistrationPeriodModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          onSuccess={() => {
            // optionally refetch students or registration status
            setShowRegistrationModal(false);
          }}
        />
      )}
      {/* Search and Statistics Section */}
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
        {/* Quick Stats */}
        {allStudents.length > 0 && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-100">Đã phân công</p>
                  <p className="text-2xl font-bold">{allStudents.filter(s => hasCompleteInfo(s)).length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-4 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-100">Chưa phân công</p>
                  <p className="text-2xl font-bold">{allStudents.filter(s => !hasCompleteInfo(s)).length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-2xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Tổng cộng</p>
                  <p className="text-2xl font-bold">{allStudents.length}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-xl">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center w-full">
            {/* Modern Search Bar */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, mã SV, email, lớp, ngành..."
                maxLength={250}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 text-sm bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg transition-all duration-300 placeholder-gray-500"
              />
            </div>

            {/* Modern Filter Controls */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="appearance-none px-4 py-3 pr-10 text-sm bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg min-w-48 font-medium cursor-pointer transition-all duration-300"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="da-phan-cong">Đã phân công</option>
                  <option value="chua-phan-cong">Chưa phân công</option>
                  <option value="khoa_gioi_thieu">Khoa giới thiệu</option>
                  <option value="tu_lien_he">Tự liên hệ</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Group by Position Toggle */}
              <label className="flex items-center text-sm space-x-3 cursor-pointer bg-white/70 backdrop-blur-sm px-4 py-3 rounded-2xl border border-indigo-200 hover:bg-white/90 transition-all duration-300 shadow-lg">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 text-indigo-600 bg-white border-indigo-300 rounded focus:ring-indigo-500 focus:ring-2" 
                  checked={groupByPosition} 
                  onChange={(e) => setGroupByPosition(e.target.checked)} 
                />
                <span className="font-medium text-gray-700">Gộp theo vị trí</span>
              </label>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy === 'none' ? 'none' : `${sortBy}-${sortDir}`}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'none') {
                      setSortBy('none');
                      setSortDir('asc');
                    } else {
                      const [type, dir] = val.split('-');
                      setSortBy(type as 'teacher' | 'company');
                      setSortDir(dir as 'asc' | 'desc');
                      // Reset column sorting when teacher/company sorting is selected
                      setNameSortDir('none');
                      setClassSortDir('none');
                    }
                  }}
                  className="appearance-none px-4 py-3 pr-10 text-sm bg-white/70 backdrop-blur-sm border border-indigo-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-lg min-w-52 font-medium cursor-pointer transition-all duration-300"
                >
                  <option value="none">Không sắp xếp theo nhóm</option>
                  <option value="teacher-asc">Cùng giảng viên A → Z</option>
                  <option value="teacher-desc">Cùng giảng viên Z → A</option>
                  <option value="company-asc">Cùng doanh nghiệp A → Z</option>
                  <option value="company-desc">Cùng doanh nghiệp Z → A</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons moved to page header */}
        </div>
      </div>

      {/* Modern Table Container */}
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden">
        <HorizontalScrollTable tableMinWidth="1600px" maxHeight="70vh">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 sticky top-0 z-10">
          <tr>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '50px' }}>
              STT
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '100px' }}>
              Mã SV
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '150px' }}>
              <div className="flex items-center justify-between">
                <span>Họ tên</span>
                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      if (nameSortDir === 'asc') {
                        setNameSortDir('desc');
                      } else {
                        setNameSortDir('asc');
                      }
                      setClassSortDir('none');
                      setSortBy('none');
                    }}
                    className={`text-xs px-1 py-0.5 transition-colors ${
                      nameSortDir === 'asc' ? 'text-blue-600 bg-blue-50' : 
                      nameSortDir === 'desc' ? 'text-blue-600 bg-blue-50' : 
                      'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Sắp xếp theo tên"
                  >
                    {nameSortDir === 'asc' ? '↑' : nameSortDir === 'desc' ? '↓' : '↕'}
                  </button>
                </div>
              </div>
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '200px' }}>
              Email
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '100px' }}>
              Số ĐT
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '100px' }}>
              <div className="flex items-center justify-between">
                <span>Lớp</span>
                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      if (classSortDir === 'asc') {
                        setClassSortDir('desc');
                      } else {
                        setClassSortDir('asc');
                      }
                      setNameSortDir('none');
                      setSortBy('none');
                    }}
                    className={`text-xs px-1 py-0.5 transition-colors ${
                      classSortDir === 'asc' ? 'text-blue-600 bg-blue-50' : 
                      classSortDir === 'desc' ? 'text-blue-600 bg-blue-50' : 
                      'text-gray-400 hover:text-gray-600'
                    }`}
                    title="Sắp xếp theo lớp"
                  >
                    {classSortDir === 'asc' ? '↑' : classSortDir === 'desc' ? '↓' : '↕'}
                  </button>
                </div>
              </div>
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '90px' }}>
              Ngày sinh
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '200px' }}>
              Vị trí mong muốn
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '180px' }}>
              Giảng viên hướng dẫn
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '180px' }}>
              Nguyện vọng thực tập
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '220px' }}>
              Doanh nghiệp thực tập
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '100px' }}>
              CV
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>
              Trạng thái
            </th>
          </tr>
        </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!loading && allStudents.length === 0 && !debouncedSearchTerm && (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Không có dữ liệu sinh viên
                  </td>
                </tr>
              )}
              
              {!loading && allStudents.length === 0 && debouncedSearchTerm && (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Không tìm thấy sinh viên nào với từ khóa "{debouncedSearchTerm}"
                  </td>
                </tr>
              )}
              
              {sortedStudents.map((student: any, index: number) => (
                <tr 
                  key={`${student.id}-${index}`} 
                  className="table-row-hover border-b border-gray-100"
                  ref={index === sortedStudents.length - 1 ? lastStudentElementRef : null}
                >
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs font-medium text-blue-600 border-r border-gray-200">
                    {student.maSV || student.maSinhVien || student.ma_sinh_vien || '-'}
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs font-medium text-gray-900 border-r border-gray-200">
                    <div className="truncate" title={student.hoTen || student.ho_ten}>
                      {student.hoTen || student.ho_ten || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={student.email || student.emailCaNhan || student.email_ca_nhan}>
                      {student.email || student.emailCaNhan || student.email_ca_nhan || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-600 border-r border-gray-200">
                    {student.sdt || student.soDienThoai || student.so_dien_thoai || '-'}
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={student.lop}>
                      {student.lop || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    { (student.ngaySinh || student.ngay_sinh) ? new Date(student.ngaySinh || student.ngay_sinh).toLocaleDateString('vi-VN') : '-' }
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    { (student.viTriMongMuon || student.vi_tri_muon_ung_tuyen_thuc_tap || student.viTriMuonUngTuyenThucTap) ? (
                      <div className="truncate" title={student.viTriMongMuon || student.vi_tri_muon_ung_tuyen_thuc_tap || student.viTriMuonUngTuyenThucTap}>
                        <span className={`px-1 py-0.5 rounded text-xs ${getPositionColor(student.viTriMongMuon || student.vi_tri_muon_ung_tuyen_thuc_tap || student.viTriMuonUngTuyenThucTap)}`}>
                          {student.viTriMongMuon || student.vi_tri_muon_ung_tuyen_thuc_tap || student.viTriMuonUngTuyenThucTap}
                        </span>
                      </div>
                    ) : (
                      <span className="text-red-400 text-xs bg-red-50 px-1 py-0.5 rounded">Chưa chọn vị trí</span>
                    )}
                  </td>
                  {/* Giảng viên hướng dẫn */}
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    {(student.giangVienHuongDan || student.giang_vien_huong_dan || student.giang_vien) ? (
                      <div className="truncate" title={student.giangVienHuongDan || student.giang_vien_huong_dan || student.giang_vien}>
                        {student.giangVienHuongDan || student.giang_vien_huong_dan || student.giang_vien}
                      </div>
                    ) : (
                      <span className="text-red-400 text-xs bg-red-50 px-1 py-0.5 rounded">Chưa phân công GV</span>
                    )}
                  </td>

                  {/* Nguyện vọng thực tập */}
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    {(() => {
                      const raw = (student.nguyenVongThucTap || student.nguyen_vong_thuc_tap || student.nguyen_vong || '').toString();
                      const norm = raw.replace(/-/g, '_');
                      const label = norm === 'khoa_gioi_thieu'
                        ? 'Khoa giới thiệu'
                        : norm === 'tu_lien_he'
                          ? 'Tự liên hệ'
                          : raw;
                      
                      return label && label !== '' ? (
                        <div className="truncate" title={label}>
                          <span className={`px-1 py-0.5 rounded text-xs ${norm === 'khoa_gioi_thieu' ? 'bg-blue-100 text-blue-700' : norm === 'tu_lien_he' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {label}
                          </span>
                        </div>
                      ) : (
                        <span className="text-red-400 text-xs bg-red-50 px-1 py-0.5 rounded">Chưa chọn nguyện vọng</span>
                      );
                    })()}
                  </td>

                  {/* Doanh nghiệp thực tập */}
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    {(student.donViThucTap || student.doanhNghiepThucTap || student.don_vi_thuc_tap || student.doanh_nghiep_thuc_tap) ? (
                      <div className="truncate" title={student.donViThucTap || student.doanhNghiepThucTap || student.don_vi_thuc_tap || student.doanh_nghiep_thuc_tap}>
                        {student.donViThucTap || student.doanhNghiepThucTap || student.don_vi_thuc_tap || student.doanh_nghiep_thuc_tap}
                      </div>
                    ) : (
                      <span className="text-red-400 text-xs bg-red-50 px-1 py-0.5 rounded">Chưa có doanh nghiệp</span>
                    )}
                  </td>

                  {/* CV */}
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    {(() => {
                      const cvPath = student.cv_path || student.cvPath || student.cv || student.cv_url || student.cvUrl;
                      if (cvPath) {
                        const href = cvPath.startsWith('http') ? cvPath : `http://localhost:3001${cvPath}`;
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            title="Xem CV"
                          >
                            <FileText className="w-4 h-4" />
                            <span className="underline">Xem CV</span>
                          </a>
                        );
                      }
                      return <span className="text-red-400 text-xs bg-red-50 px-1 py-0.5 rounded">Chưa có CV</span>;
                    })()}
                  </td>

                  {/* Trạng thái (moved to end) */}
                  <td className="px-1 py-1 text-xs border-r border-gray-200">
                    {(() => {
                      const actualStatus = getActualStatus(student);
                      const isComplete = hasCompleteInfo(student);
                      const missingInfo = getMissingInfo(student);
                      
                      return (
                        <div className="flex flex-col items-start">
                          <span className={`status-badge px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getStatusColor(actualStatus)}`}>
                            {getStatusText(actualStatus)}
                          </span>
                          {isComplete && actualStatus === 'da-phan-cong' && (
                            <span className="text-xs text-green-600 mt-0.5">
                              ✓ Đầy đủ thông tin
                            </span>
                          )}
                          {!isComplete && (
                            <span 
                              className="text-xs text-red-500 mt-0.5 cursor-help" 
                              title={`Thiếu: ${missingInfo.join(', ')}`}
                            >
                              ⚠ Thiếu {missingInfo.length} thông tin
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              ))}
              
              {(loading || isLoadingMore) && (
                <tr>
                  <td colSpan={13} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-600">
                        {loading ? 'Đang tải dữ liệu...' : 'Đang tải thêm...'}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
              
              {error && (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-red-600">
                    <div className="py-4">
                      <p>Lỗi: {error}</p>
                      <button 
                        onClick={refetch}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        Thử lại
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
        </HorizontalScrollTable>
      </div>

      {/* Registration Period Modal */}
      <RegistrationPeriodModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={() => {
          // Optionally refresh data or show success message
          console.log('Registration period updated successfully');
        }}
      />
    </div>
    </div>
  );
};

export default StudentsPage;