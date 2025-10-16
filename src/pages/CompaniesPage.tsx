import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, ExternalLink } from 'lucide-react';
import { useCompanies } from '../hooks/useCompanies';
import { useDebounce } from '../hooks/useDebounce';
import HorizontalScrollTable from '../components/HorizontalScrollTable';
import { refreshDashboardWithDelay } from '../utils/dashboardUtils';

const CompaniesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allCompanies, setAllCompanies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const pageSize = 50; // Tăng số lượng để tải nhiều hơn mỗi lần
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [sortBy, setSortBy] = useState<'none' | 'name' | 'size'>('none');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  

  // Debounce search term với delay 500ms
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { companies, pagination, loading, error, refetch } = useCompanies({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm
  });

  // Reset khi search term thay đổi
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) return;
    
    setAllCompanies([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [debouncedSearchTerm]);

  // Append new companies khi load thêm data
  useEffect(() => {
    if (companies && companies.length > 0) {
      if (currentPage === 1) {
        setAllCompanies(companies);
      } else {
        setAllCompanies(prev => [...prev, ...companies]);
        setIsLoadingMore(false);
      }
      
      setHasMore(pagination ? currentPage < pagination.totalPages : false);
    }
  }, [companies, currentPage, pagination]);

  const getSortedCompanies = () => {
    let arr = [...allCompanies];
    const nameKey = (c: any) => (c.tenCongTy || c.tenDN || c.ten_cong_ty || '').toString().toLowerCase();
    const sizeKey = (c: any) => {
      const size = c.quyMoNhanSu || c.quy_mo_nhan_su || '';
      const m = size.toString().match(/(\d+)/);
      return m ? parseInt(m[1], 10) : 0;
    };

    // Sắp xếp thông thường
    if (sortBy === 'name') {
      arr.sort((a,b) => sortDir === 'asc' ? nameKey(a).localeCompare(nameKey(b)) : nameKey(b).localeCompare(nameKey(a)));
    } else if (sortBy === 'size') {
      arr.sort((a,b) => sortDir === 'asc' ? sizeKey(a) - sizeKey(b) : sizeKey(b) - sizeKey(a));
    }

    return arr;
  };

  const sortedCompanies = getSortedCompanies();

  // Infinite scroll observer
  const lastCompanyElementRef = useCallback((node: HTMLTableRowElement) => {
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

  // Handle import Excel
  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const resp = await fetch('http://localhost:3001/api/doanh-nghiep/import', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      
      const data = await resp.json();
      if (data.success) {
        alert(`Import thành công!\n${data.message}\nTổng: ${data.data.totalStudents} sinh viên từ ${data.data.totalCompanies} doanh nghiệp`);
        // Refresh dashboard after successful import
        refreshDashboardWithDelay();
        refetch(); // Refresh data
      } else {
        alert('Lỗi import: ' + data.message);
      }
    } catch (error) {
      alert('Lỗi import: ' + (error as Error).message);
    }
    
    // Reset input
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100 w-full">
      {/* Modern Header */}
      <div className="relative overflow-hidden" style={{background: 'linear-gradient(135deg, #213f99 0%, #213f99 50%, #f37320 100%)'}}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
          <div className="relative w-full px-0 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                Quản lý Doanh nghiệp
              </h1>
              <p className="text-xl text-purple-100 mb-6 lg:mb-0">
                Quản lý danh sách các doanh nghiệp tham gia thực tập
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 px-4">
              {/* Hidden file input */}
              <input
                type="file"
                id="excelFileInput"
                style={{ display: 'none' }}
                accept=".xlsx,.xls"
                onChange={handleImportExcel}
              />
              
              <button
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-all duration-300 shadow-lg"
                onClick={() => document.getElementById('excelFileInput')?.click()}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import Excel
              </button>
              
              <button
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-lg"
                onClick={async () => {
                  try {
                    const resp = await fetch('http://localhost:3001/api/doanh-nghiep/export', {
                      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                    const blob = await resp.blob();
                    const downloadUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = `doanh-nghiep-${new Date().toISOString().split('T')[0]}.xlsx`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(downloadUrl);
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
  <div className="max-w-none mx-auto px-2 sm:px-4 lg:px-8 xl:px-12 2xl:px-16 py-8">
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
                  placeholder="Tìm kiếm theo tên doanh nghiệp, người liên hệ, email, lĩnh vực, địa chỉ..."
                  maxLength={250}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-colors"
                />
              </div>
              
              {/* Modern Sort Controls */}
              <div className="flex flex-wrap gap-3 items-center">
                <button className="inline-flex items-center px-4 py-3 border-2 border-purple-200 text-purple-700 rounded-2xl hover:bg-purple-50 transition-all duration-300 shadow-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Lọc
                </button>
                
                <select
                  value={sortBy === 'none' ? 'none' : `${sortBy}-${sortDir}`}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'none') {
                      setSortBy('none');
                      setSortDir('asc');
                    } else {
                      const [type, dir] = val.split('-');
                      setSortBy(type as 'name' | 'size');
                      setSortDir(dir as 'asc' | 'desc');
                    }
                  }}
                  className="px-4 py-3 text-sm border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-colors min-w-48"
                >
                  <option value="none">Không sắp xếp</option>
                  <option value="name-asc">Tên A → Z</option>
                  <option value="name-desc">Tên Z → A</option>
                  <option value="size-asc">Quy mô nhỏ → lớn</option>
                  <option value="size-desc">Quy mô lớn → nhỏ</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Table Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden mx-4">
          <HorizontalScrollTable tableMinWidth="2520px" maxHeight="70vh">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '50px' }}>
              STT
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '200px' }}>
              Tên doanh nghiệp
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '150px' }}>
              Người liên hệ
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '180px' }}>
              Email
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '100px' }}>
              Số ĐT
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '220px' }}>
              Địa chỉ
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '150px' }}>
              Lĩnh vực
            </th>
            <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '200px' }}>
              Vị trí tuyển dụng
                </th>
                <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '120px' }}>
                  Chức vụ LH
                </th>
                <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '80px' }}>
                  Quy mô
                </th>
                <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '160px' }}>
                  Website
                </th>
                <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '150px' }}>
                  Mô tả
                </th>
                <th className="px-1 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200" style={{ width: '120px' }}>
                  SL SV thực tập
                </th>
                {/* Thao tác column removed per request */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {!loading && allCompanies.length === 0 && !debouncedSearchTerm && (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Không có dữ liệu doanh nghiệp
                  </td>
                </tr>
              )}
              
              {!loading && allCompanies.length === 0 && debouncedSearchTerm && (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-gray-500 text-sm">
                    Không tìm thấy doanh nghiệp nào với từ khóa "{debouncedSearchTerm}"
                  </td>
                </tr>
              )}
              
              {sortedCompanies.map((company: any, index: number) => (
                <tr 
                  key={`${company.id}-${index}`} 
                  className="hover:bg-gray-50 border-b border-gray-100"
                  ref={index === sortedCompanies.length - 1 ? lastCompanyElementRef : null}
                >
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="px-1 py-1 text-xs font-medium text-gray-900 border-r border-gray-200">
                    <div className="truncate" title={company.tenCongTy || company.tenDN || company.ten_cong_ty}>
                      {company.tenCongTy || company.tenDN || company.ten_cong_ty || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={company.tenNguoiLienHe || company.nguoiLienHe || company.ten_nguoi_lien_he}>
                      {company.tenNguoiLienHe || company.nguoiLienHe || company.ten_nguoi_lien_he || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={company.emailCongTy || company.email || company.email_cong_ty}>
                      {company.emailCongTy || company.email || company.email_cong_ty || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-600 border-r border-gray-200">
                    {company.soDienThoai || company.sdt || company.so_dien_thoai || '-'}
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={company.diaChiCongTy || company.diaChi || company.dia_chi_cong_ty}>
                      {company.diaChiCongTy || company.diaChi || company.dia_chi_cong_ty || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={company.linhVucHoatDong || company.linh_vuc_hoat_dong}>
                      {company.linhVucHoatDong || company.linh_vuc_hoat_dong || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={company.viTriTuyenDung || company.vi_tri_tuyen_dung}>
                      {company.viTriTuyenDung || company.vi_tri_tuyen_dung || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={company.chucVuNguoiLienHe || company.chuc_vu_nguoi_lien_he}>
                      {company.chucVuNguoiLienHe || company.chuc_vu_nguoi_lien_he || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate">
                      {company.quyMoNhanSu || company.quy_mo_nhan_su ? `${company.quyMoNhanSu || company.quy_mo_nhan_su}` : '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-900 truncate"
                        title={company.website}
                      >
                        <span className="truncate max-w-24">{company.website}</span>
                        <ExternalLink className="w-2 h-2 ml-1 flex-shrink-0" />
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="px-1 py-1 text-xs text-gray-600 border-r border-gray-200">
                    <div className="truncate" title={company.moTaCongTy || company.moTa || company.mo_ta_cong_ty}>
                      {company.moTaCongTy || company.moTa || company.mo_ta_cong_ty || '-'}
                    </div>
                  </td>
                  <td className="px-1 py-1 whitespace-nowrap text-xs text-gray-900 border-r border-gray-200 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {company.soSinhVienThucTap || 0}
                    </span>
                  </td>
                  {/* Action column removed per request */}
                </tr>
              ))}
              
              {/* Loading indicator */}
              {(loading || isLoadingMore) && (
                <tr>
                  <td colSpan={12} className="px-6 py-4 text-center">
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

export default CompaniesPage;