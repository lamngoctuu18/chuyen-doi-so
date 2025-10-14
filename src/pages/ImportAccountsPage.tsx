import React, { useState } from 'react';
import { 
  Upload, Download, FileText, AlertCircle, CheckCircle, 
  FileSpreadsheet, Users, GraduationCap, Building, UserCog 
} from 'lucide-react';
import { refreshDashboardWithDelay } from '../utils/dashboardUtils';

interface ImportResult {
  success: boolean;
  message: string;
  data?: {
    file: {
      originalName: string;
      size: number;
      totalRows: number;
    };
    parsing: {
      validRows: number;
      errorRows: number;
      errors: Array<{ row: number; error: string }>;
    };
    import: {
      accountsCreated: number;
      accountsUpdated: number;
      profilesCreated: number;
      profilesUpdated: number;
      errors: Array<{ userId: string; error: string }>;
    };
    summary: {
      totalProcessed: number;
      totalSuccess: number;
      totalErrors: number;
    };
  };
}

interface FilePreview {
  fileName: string;
  totalRows: number;
  columns: string[];
  requiredColumns: string[];
  missingColumns: string[];
  extraColumns: string[];
  sampleData: Array<{ [key: string]: any }>;
  isValid: boolean;
  errors: string[];
}

type AccountType = 'sinh-vien' | 'giang-vien' | 'doanh-nghiep' | 'admin';

interface AccountTypeConfig {
  key: AccountType;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  description: string;
  templateColumns: string[];
}

const ImportAccountsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<AccountType>('sinh-vien');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [isPreviewingFile, setIsPreviewingFile] = useState(false);

  const accountTypes: AccountTypeConfig[] = [
    {
      key: 'sinh-vien',
      name: 'Sinh viên',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      description: 'Import danh sách sinh viên từ file Excel',
      templateColumns: [
        'Mã sinh viên*', 'Họ tên*', 'Mật khẩu*', 'Email', 'Số điện thoại', 
        'Lớp', 'Khoa', 'Ngành', 'Khóa học', 'Ngày sinh', 'Giới tính', 
        'Địa chỉ', 'GPA', 'Tình trạng học tập'
      ]
    },
    {
      key: 'giang-vien',
      name: 'Giảng viên',
      icon: <Users className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      description: 'Import danh sách giảng viên từ file Excel',
      templateColumns: [
        'Mã giảng viên*', 'Họ tên*', 'Mật khẩu*', 'Email', 'Số điện thoại',
        'Khoa', 'Bộ môn', 'Chức vụ', 'Học vị', 'Chuyên môn', 
        'Địa chỉ', 'Kinh nghiệm làm việc', 'Bằng cấp'
      ]
    },
    {
      key: 'doanh-nghiep',
      name: 'Doanh nghiệp',
      icon: <Building className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
      description: 'Import danh sách doanh nghiệp từ file Excel',
      templateColumns: [
        'Mã doanh nghiệp*', 'Tên công ty*', 'Mật khẩu*', 'Tên người liên hệ', 'Email',
        'Chức vụ người liên hệ', 'Địa chỉ công ty', 'Số điện thoại', 'Email công ty',
        'Website', 'Lĩnh vực hoạt động', 'Quy mô nhân sự', 'Mô tả công ty',
        'Yêu cầu thực tập', 'Số lượng nhận thực tập', 'Trạng thái hợp tác'
      ]
    },
    {
      key: 'admin',
      name: 'Quản trị viên',
      icon: <UserCog className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      description: 'Import danh sách quản trị viên từ file Excel',
      templateColumns: [
        'Mã admin*', 'Họ tên*', 'Mật khẩu*', 'Email', 'Số điện thoại', 
        'Chức vụ', 'Phòng ban', 'Quyền hạn'
      ]
    }
  ];

  const selectedConfig = accountTypes.find(type => type.key === selectedType)!;

  // Lấy các cột bắt buộc cho từng loại tài khoản
  const getRequiredColumns = (type: AccountType): string[] => {
    switch (type) {
      case 'sinh-vien':
        return ['Mã sinh viên', 'Họ tên', 'Mật khẩu'];
      case 'giang-vien':
        return ['Mã giảng viên', 'Họ tên', 'Mật khẩu'];
      case 'doanh-nghiep':
        return ['Mã doanh nghiệp', 'Tên công ty', 'Mật khẩu'];
      case 'admin':
        return ['Mã admin', 'Họ tên', 'Mật khẩu'];
      default:
        return ['Mật khẩu'];
    }
  };

  // Kiểm tra xem cột file có khớp với cột bắt buộc không
  const isColumnMatch = (fileColumn: string, requiredColumn: string): boolean => {
    const fileCol = fileColumn.toLowerCase().trim();
    const reqCol = requiredColumn.toLowerCase().trim();
    
    // Bản đồ mapping các cột
    const columnMappings: { [key: string]: string[] } = {
      'mã sinh viên': ['masinhvien', 'ma_sinh_vien', 'student_id', 'studentid'],
      'họ tên': ['hoten', 'ho_ten', 'fullname', 'full_name', 'name', 'ten'],
      'mật khẩu': ['matkhau', 'mat_khau', 'password', 'pwd', 'pass'],
      'mã giảng viên': ['magiangvien', 'ma_giang_vien', 'teacher_id', 'teacherid'],
      'mã doanh nghiệp': ['madoanhnghiep', 'ma_doanh_nghiep', 'company_id', 'companyid'],
      'tên công ty': ['tencongty', 'ten_cong_ty', 'company_name', 'companyname'],
      'mã admin': ['maadmin', 'ma_admin', 'admin_id', 'adminid']
    };
    
    // Kiểm tra khớp trực tiếp
    if (fileCol === reqCol) return true;
    
    // Kiểm tra qua bản đồ mapping
    const mappings = columnMappings[reqCol] || [];
    return mappings.some(mapping => fileCol === mapping || fileCol.includes(mapping));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Kiểm tra định dạng file
      if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.xls')) {
        alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        return;
      }
      
      // Kiểm tra kích thước file (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File quá lớn. Vui lòng chọn file nhỏ hơn 10MB');
        return;
      }
      
      setSelectedFile(file);
      setImportResult(null);
      setFilePreview(null);
      
      // Tự động preview file sau khi chọn
      previewFile(file);
    }
  };

  // Hàm preview nội dung file Excel
  const previewFile = async (file: File) => {
    if (!file) return;

    setIsPreviewingFile(true);
    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      console.log('🔍 Previewing file:', file.name, 'Type:', selectedType);
      
      const response = await fetch(`http://localhost:3001/api/import/preview/${selectedType}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('📡 Response status:', response.status);

      const result = await response.json();
      
      if (result.success) {
        const requiredColumns = getRequiredColumns(selectedType);
        const missingColumns = requiredColumns.filter(reqCol => {
          return !result.data.columns.some((fileCol: string) => 
            isColumnMatch(fileCol, reqCol)
          );
        });

        setFilePreview({
          fileName: file.name,
          totalRows: result.data.totalRows,
          columns: result.data.columns,
          requiredColumns,
          missingColumns,
          extraColumns: result.data.columns.filter((col: string) => 
            !selectedConfig.templateColumns.some(templateCol => 
              templateCol.toLowerCase().replace('*', '').includes(col.toLowerCase())
            )
          ),
          sampleData: result.data.sampleData || [],
          isValid: missingColumns.length === 0,
          errors: missingColumns.length > 0 ? [`Thiếu các cột bắt buộc: ${missingColumns.join(', ')}`] : []
        });
      } else {
        setFilePreview({
          fileName: file.name,
          totalRows: 0,
          columns: [],
          requiredColumns: getRequiredColumns(selectedType),
          missingColumns: getRequiredColumns(selectedType),
          extraColumns: [],
          sampleData: [],
          isValid: false,
          errors: [result.message || 'Không thể đọc file Excel']
        });
      }
    } catch (error) {
      console.error('Preview file error:', error);
      
      // Tạm thời mô phỏng preview khi server không hoạt động  
      const mockColumns = ['maSinhVien', 'hoTen', 'email', 'password', 'lop', 'khoa', 'nganh', 'khoaHoc', 'ngaySinh', 'gioiTinh', 'diaChi', 'soDienThoai', 'emailCaNhan', 'gpa', 'tinhTrangHocTap'];
      const requiredColumns = getRequiredColumns(selectedType);
      const missingColumns = requiredColumns.filter(reqCol => {
        return !mockColumns.some(mockCol => isColumnMatch(mockCol, reqCol));
      });
      
      setFilePreview({
        fileName: file.name,
        totalRows: 0,
        columns: mockColumns,
        requiredColumns,
        missingColumns,
        extraColumns: [],
        sampleData: [],
        isValid: missingColumns.length === 0,
        errors: missingColumns.length > 0 ? 
          [`File thiếu các cột bắt buộc: ${missingColumns.join(', ')}`] : 
          ['Không thể kết nối server để kiểm tra chi tiết. Chỉ kiểm tra cơ bản.']
      });
    } finally {
      setIsPreviewingFile(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      alert('Vui lòng chọn file Excel');
      return;
    }

    setIsImporting(true);
    
    try {
      const formData = new FormData();
      formData.append('excelFile', selectedFile);

      const response = await fetch(`http://localhost:3001/api/import/${selectedType}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result: ImportResult = await response.json();
      setImportResult(result);

      if (result.success) {
        // Refresh dashboard after successful import
        refreshDashboardWithDelay();
        
        // Reset form sau khi import thành công
        setTimeout(() => {
          setSelectedFile(null);
          const fileInput = document.getElementById('excel-file') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        }, 3000);
      }

    } catch (error) {
      console.error('Import error:', error);
      setImportResult({
        success: false,
        message: 'Lỗi kết nối đến server. Vui lòng thử lại.'
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/import/templates/${selectedType}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `template-${selectedType}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Lỗi tải template. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Download template error:', error);
      alert('Lỗi tải template. Vui lòng thử lại.');
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setImportResult(null);
    setFilePreview(null);
    setIsPreviewingFile(false);
    const fileInput = document.getElementById('excel-file') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-100">
      {/* Modern Header */}
      <div className="relative overflow-hidden" style={{background: 'linear-gradient(135deg, #213f99 0%, #213f99 50%, #f37320 100%)'}}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
                Import Tài khoản
              </h1>
              <p className="text-xl text-indigo-100">
                Import danh sách tài khoản sinh viên, giảng viên, doanh nghiệp từ file Excel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Chọn loại tài khoản */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chọn loại tài khoản</h2>
              
              <div className="space-y-3">
                {accountTypes.map((type) => (
                  <button
                    key={type.key}
                    onClick={() => {
                      setSelectedType(type.key);
                      resetForm();
                    }}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      selectedType === type.key
                        ? `${type.bgColor} border-current ${type.color}`
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${selectedType === type.key ? 'bg-white' : 'bg-white'}`}>
                        <div className={selectedType === type.key ? type.color : 'text-gray-600'}>
                          {type.icon}
                        </div>
                      </div>
                      <div>
                        <div className={`font-medium ${selectedType === type.key ? type.color : 'text-gray-900'}`}>
                          {type.name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {type.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Template info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Template {selectedConfig.name}</h3>
                
                {/* Thông báo cột bắt buộc */}
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800 font-medium">
                    ⚠️ Các cột bắt buộc (có dấu *):
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {getRequiredColumns(selectedType).map((col, index) => (
                      <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  File Excel có thể có {selectedConfig.templateColumns.length} cột:
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  {selectedConfig.templateColumns.slice(0, 8).map((col, index) => (
                    <div key={index} className={col.includes('*') ? 'font-medium text-red-600' : ''}>
                      • {col}
                    </div>
                  ))}
                  {selectedConfig.templateColumns.length > 8 && (
                    <div>... và {selectedConfig.templateColumns.length - 8} cột khác</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`${selectedConfig.color}`}>
                    {selectedConfig.icon}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Import {selectedConfig.name}
                  </h2>
                </div>
                
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải Template
                </button>
              </div>

              {/* Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn file Excel
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Kéo thả file Excel vào đây hoặc click để chọn file
                    </p>
                    <p className="text-xs text-gray-500">
                      Hỗ trợ định dạng .xlsx, .xls (tối đa 10MB)
                    </p>
                  </div>
                  <input
                    id="excel-file"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => document.getElementById('excel-file')?.click()}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Chọn File
                  </button>
                </div>

                {selectedFile && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">{selectedFile.name}</p>
                          <p className="text-sm text-blue-600">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={resetForm}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                )}

                {/* File Preview */}
                {isPreviewingFile && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                      <span className="text-sm text-yellow-800">Đang kiểm tra nội dung file...</span>
                    </div>
                  </div>
                )}

                {filePreview && (
                  <div className="mt-4 p-4 bg-white rounded-lg border">
                    <h4 className="font-medium text-gray-900 mb-3">Thông tin file Excel</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tổng số dòng:</span>
                        <span className="font-medium">{filePreview.totalRows}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Số cột:</span>
                        <span className="font-medium">{filePreview.columns.length}</span>
                      </div>

                      {/* Trạng thái validation */}
                      <div className={`p-3 rounded-lg ${
                        filePreview.isValid 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-red-50 border border-red-200'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {filePreview.isValid ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className={`font-medium ${
                            filePreview.isValid ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {filePreview.isValid ? 'File hợp lệ' : 'File không hợp lệ'}
                          </span>
                        </div>
                        
                        {filePreview.errors.length > 0 && (
                          <div className="mt-2">
                            {filePreview.errors.map((error, index) => (
                              <p key={index} className="text-sm text-red-700">• {error}</p>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Cột bắt buộc */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Cột bắt buộc:</h5>
                        <div className="flex flex-wrap gap-1">
                          {filePreview.requiredColumns.map((col, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded text-xs ${
                                filePreview.missingColumns.includes(col)
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Cột trong file */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Cột trong file:</h5>
                        <div className="flex flex-wrap gap-1">
                          {filePreview.columns.map((col, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800"
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Import Button */}
              <div className="flex justify-center mb-6">
                <button
                  onClick={handleImport}
                  disabled={!selectedFile || isImporting || (filePreview ? !filePreview.isValid : false)}
                  className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                    selectedFile && !isImporting && (filePreview ? filePreview.isValid : true)
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isImporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                      Đang import...
                    </>
                  ) : filePreview && !filePreview.isValid ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2 inline-block" />
                      File không hợp lệ
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2 inline-block" />
                      Import {selectedConfig.name}
                    </>
                  )}
                </button>
              </div>

              {/* Results */}
              {importResult && (
                <div className="space-y-4">
                  {/* Status */}
                  <div className={`p-4 rounded-lg border ${
                    importResult.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      {importResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className={`font-medium ${
                          importResult.success ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {importResult.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  {importResult.success && importResult.data && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* File Info */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Thông tin file</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                          <p>Tên file: {importResult.data.file.originalName}</p>
                          <p>Tổng dòng: {importResult.data.file.totalRows}</p>
                          <p>Kích thước: {(importResult.data.file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>

                      {/* Processing Results */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-900 mb-2">Kết quả xử lý</h4>
                        <div className="text-sm text-green-700 space-y-1">
                          <p>Tài khoản tạo mới: {importResult.data.import.accountsCreated}</p>
                          <p>Tài khoản cập nhật: {importResult.data.import.accountsUpdated}</p>
                          <p>Profile tạo mới: {importResult.data.import.profilesCreated}</p>
                          <p>Profile cập nhật: {importResult.data.import.profilesUpdated}</p>
                        </div>
                      </div>

                      {/* Summary */}
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900 mb-2">Tổng kết</h4>
                        <div className="text-sm text-purple-700 space-y-1">
                          <p>Tổng xử lý: {importResult.data.summary.totalProcessed}</p>
                          <p>Thành công: {importResult.data.summary.totalSuccess}</p>
                          <p>Lỗi: {importResult.data.summary.totalErrors}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {importResult.data?.parsing.errors && importResult.data.parsing.errors.length > 0 && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <h4 className="font-medium text-yellow-900 mb-2">Lỗi phân tích file:</h4>
                      <div className="text-sm text-yellow-700 space-y-1 max-h-32 overflow-y-auto">
                        {importResult.data?.parsing.errors.slice(0, 10).map((error, index) => (
                          <p key={index}>Dòng {error.row}: {error.error}</p>
                        ))}
                        {importResult.data?.parsing.errors && importResult.data.parsing.errors.length > 10 && (
                          <p>... và {importResult.data.parsing.errors.length - 10} lỗi khác</p>
                        )}
                      </div>
                    </div>
                  )}

                  {importResult.data?.import.errors && importResult.data.import.errors.length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-medium text-red-900 mb-2">Lỗi import:</h4>
                      <div className="text-sm text-red-700 space-y-1 max-h-32 overflow-y-auto">
                        {importResult.data?.import.errors.slice(0, 10).map((error, index) => (
                          <p key={index}>{error.userId}: {error.error}</p>
                        ))}
                        {importResult.data?.import.errors && importResult.data.import.errors.length > 10 && (
                          <p>... và {importResult.data.import.errors.length - 10} lỗi khác</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn sử dụng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Chuẩn bị file Excel:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Tải template tương ứng với loại tài khoản</li>
                <li>• Điền đầy đủ thông tin theo đúng định dạng</li>
                <li>• Không để trống các cột bắt buộc</li>
                <li>• Lưu file dưới định dạng .xlsx hoặc .xls</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Lưu ý quan trọng:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Mã tài khoản không được trùng lặp</li>
                <li>• Email phải có định dạng hợp lệ</li>
                <li>• Nếu không có mật khẩu, hệ thống dùng mã tài khoản</li>
                <li>• Dữ liệu sẽ được lưu vào database để đăng nhập</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportAccountsPage;