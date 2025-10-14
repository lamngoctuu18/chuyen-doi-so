import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useTeachers } from '../hooks/useTeachers';
import { useDebounce } from '../hooks/useDebounce';
import HorizontalScrollTable from '../components/HorizontalScrollTable';
import { refreshDashboardWithDelay } from '../utils/dashboardUtils';

const TeachersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allTeachers, setAllTeachers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageSize = 50; // Tăng số lượng để tải nhiều hơn mỗi lần
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Debounce search term với delay 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortBy, setSortBy] = useState<'none' | 'name' | 'code'>('none');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const { teachers, pagination, loading, error, refetch } = useTeachers({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm
  });

  const hardRefresh = async () => {
    // reset to page 1 and reload fresh data
    setAllTeachers([]);
    setCurrentPage(1);
    await refetch();
  };

  // Reset khi search term thay đổi
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) return;
    
    setAllTeachers([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [debouncedSearchTerm]);

  // Append new teachers khi load thêm data
  useEffect(() => {
    if (teachers && teachers.length > 0) {
      if (currentPage === 1) {
        setAllTeachers(teachers);
      } else {
        setAllTeachers(prev => [...prev, ...teachers]);
        setIsLoadingMore(false);
      }
      
      setHasMore(pagination ? currentPage < pagination.totalPages : false);
    }
  }, [teachers, currentPage, pagination]);

  const getSortedTeachers = () => {
    const arr = [...allTeachers];
    const nameKey = (t: any) => (t.hoTen || t.ho_ten || '').toString().toLowerCase();
    const codeKey = (t: any) => {
      const code = t.maGiangVien || t.maGV || t.ma_giang_vien || '';
      const m = code.toString().match(/(\d+)/);
      return m ? parseInt(m[1], 10) : Number.POSITIVE_INFINITY;
    };

    if (sortBy === 'name') {
      arr.sort((a,b) => sortDir === 'asc' ? nameKey(a).localeCompare(nameKey(b)) : nameKey(b).localeCompare(nameKey(a)));
    } else if (sortBy === 'code') {
      arr.sort((a,b) => sortDir === 'asc' ? codeKey(a) - codeKey(b) : codeKey(b) - codeKey(a));
    }

    return arr;
  };

  const sortedTeachers = getSortedTeachers();
  const [openTeacher, setOpenTeacher] = useState<string | null>(null);
  const [openTeacherStudents, setOpenTeacherStudents] = useState<any[] | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(false);

  const toggleStudents = async (teacher: any) => {
    const code = teacher.ma_giang_vien || teacher.maGiangVien || teacher.maGV;
    if (!code) return;
    if (openTeacher === code) {
      setOpenTeacher(null);
      setOpenTeacherStudents(null);
      return;
    }
    setLoadingStudents(true);
    setOpenTeacher(code);
    try {
      const resp = await fetch(`http://localhost:3001/api/sinh-vien-huong-dan/${code}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const json = await resp.json();
      setOpenTeacherStudents(json?.data || []);
    } catch (e) {
      setOpenTeacherStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  // Infinite scroll observer
  const lastTeacherElementRef = useCallback((node: HTMLTableRowElement) => {
    if (loading || isLoadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setIsLoadingMore(true);
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, isLoadingMore, hasMore]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 w-full">
      {/* Modern Header */}
      <div className="relative overflow-hidden" style={{background: 'linear-gradient(135deg, #213f99 0%, #213f99 50%, #f37320 100%)'}}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
          <div className="relative w-full px-0 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Quản lý Giảng viên
              </h1>
              <p className="text-xl text-emerald-100 mb-6 lg:mb-0">
                Quản lý danh sách và thông tin giảng viên hướng dẫn
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 px-4">
              <button
                className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all duration-300 shadow-lg"
                onClick={async () => {
                  try {
                    const resp = await fetch('http://localhost:3001/api/giang-vien/export', {
                      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                    const blob = await resp.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `giang-vien-${new Date().toISOString().split('T')[0]}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } catch (e) {
                    alert('Lỗi xuất Excel: ' + (e as Error).message);
                  }
                }}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Xuất Excel
              </button>
              

            </div>
          </div>
        </div>
      </div>

      {/* Modern Search and Controls */}
      <div className="w-full px-0 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 mb-8 mx-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Modern Search Section */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center flex-1">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên, mã GV, email, bộ môn, chức vụ..."
                  maxLength={250}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-colors"
                />
              </div>
              
              {/* Modern Sort Controls */}
              <div className="flex flex-wrap gap-3 items-center">
                <select
                  value={sortBy === 'none' ? 'none' : `${sortBy}-${sortDir}`}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'none') {
                      setSortBy('none');
                      setSortDir('asc');
                    } else {
                      const [type, dir] = val.split('-');
                      setSortBy(type as 'name' | 'code');
                      setSortDir(dir as 'asc' | 'desc');
                    }
                  }}
                  className="px-4 py-3 text-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-colors min-w-48"
                >
                  <option value="none">Không sắp xếp</option>
                  <option value="name-asc">Tên A → Z</option>
                  <option value="name-desc">Tên Z → A</option>
                  <option value="code-asc">Mã GV 1 → 9</option>
                  <option value="code-desc">Mã GV 9 → 1</option>
                </select>
              </div>
            </div>
          </div>
        </div>



        {/* Modern Table Container */}  
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden mx-4">
          <HorizontalScrollTable tableMinWidth="1600px" maxHeight="70vh">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '50px' }}>
              STT
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '90px' }}>
              Mã GV
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '150px' }}>
              Họ tên
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '200px' }}>
              Email
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '100px' }}>
              Số ĐT
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '180px' }}>
              Bộ môn
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '120px' }}>
              Chức vụ
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '80px' }}>
              Học vị
            </th>
            <th className="px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '70px' }}>
              SV HD
            </th>
            {/* Thao tác column removed per request */}
          </tr>
        </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!loading && allTeachers.length === 0 && !debouncedSearchTerm && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Không có dữ liệu giảng viên
                  </td>
                </tr>
              )}
              
              {!loading && allTeachers.length === 0 && debouncedSearchTerm && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Không tìm thấy giảng viên nào với từ khóa "{debouncedSearchTerm}"
                  </td>
                </tr>
              )}
              
              {sortedTeachers.map((teacher: any, index: number) => {
                const code = teacher.ma_giang_vien || teacher.maGiangVien || teacher.maGV;
                const isOpen = openTeacher === code;
                return (
                <React.Fragment key={`${teacher.id}-${index}`}>
                <tr 
                  className="hover:bg-gray-50 border-b border-gray-100"
                  ref={index === sortedTeachers.length - 1 ? lastTeacherElementRef : null}
                >
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs font-medium text-blue-600 border-r border-gray-200">
                    {teacher.maGiangVien || teacher.maGV || teacher.ma_giang_vien || '-'}
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs font-medium text-gray-900 border-r border-gray-200">
                    <div className="truncate" title={teacher.hoTen || teacher.ho_ten}>
                      {teacher.hoTen || teacher.ho_ten || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={teacher.email}>
                      {teacher.email || teacher.emailCaNhan || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-600 border-r border-gray-200">
                    {teacher.soDienThoai || teacher.so_dien_thoai || teacher.sdt || '-'}
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={teacher.boMon || teacher.bo_mon}>
                      {teacher.boMon || teacher.bo_mon || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={teacher.chucVu || teacher.chuc_vu}>
                      {teacher.chucVu || teacher.chuc_vu || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={teacher.hocVi || teacher.hoc_vi}>
                      {teacher.hocVi || teacher.hoc_vi || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-center text-gray-900 border-r border-gray-200">
                    <span 
                      role="button"
                      title="Xem danh sách SV hướng dẫn"
                      onClick={() => toggleStudents(teacher)}
                      className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 cursor-pointer hover:bg-green-200"
                    >
                      {teacher.soSinhVienHuongDan || teacher.so_sinh_vien_huong_dan || 0}
                    </span>
                  </td>
                </tr>
                {isOpen && (
                <tr className="bg-blue-50">
                  <td colSpan={9} className="px-4 py-2">
                    {loadingStudents ? 'Đang tải danh sách SV...' : (
                      <div className="text-xs text-gray-700">
                        {(openTeacherStudents || []).length === 0 ? 'Chưa có dữ liệu SV hướng dẫn' : (
                          <ul className="list-disc ml-6">
                            {(openTeacherStudents || []).slice(0, 10).map((sv:any, idx:number) => (
                              <li key={idx}>{sv.ho_ten_sinh_vien || sv.hoTen} ({sv.ma_sinh_vien || sv.maSV || ''})</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
                )}
                </React.Fragment>
              );})}
              
              {/* Loading indicator */}
              {(loading || isLoadingMore) && (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-600">
                        {loading ? 'Đang tải...' : 'Đang tải thêm...'}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </HorizontalScrollTable>
        </div>

        {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p>Có lỗi xảy ra: {error}</p>
          <button 
            onClick={refetch}
            className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
          >
            Thử lại
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default TeachersPage;