import { useState } from 'react';
import { Upload, Download, AlertCircle, CheckCircle, FileSpreadsheet } from 'lucide-react';
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
      errors: string[];
    };
    import: {
      accountsCreated: number;
      accountsUpdated: number;
      profilesCreated: number;
      profilesUpdated: number;
      errors: string[];
    };
    summary: {
      totalProcessed: number;
      totalSuccess: number;
      totalErrors: number;
    };
  };
}

const ImportStudentsPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const API_BASE_URL = 'http://localhost:3001/api';

  // Xử lý chọn file
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type) && !file.name.match(/\.(xls|xlsx)$/i)) {
        alert('Chỉ chấp nhận file Excel (.xls, .xlsx)');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        alert('File quá lớn. Kích thước tối đa 10MB');
        return;
      }
      
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  // Download template
  const downloadTemplate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/import/templates/sinh-vien`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Lỗi tải template');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'template_sinh_vien.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert('Lỗi tải template: ' + (error as Error).message);
    }
  };

  // Import and validate simultaneously
  const processFile = async () => {
    if (!selectedFile) return;
    
    setIsImporting(true);
    
    try {
      const formData = new FormData();
      formData.append('excelFile', selectedFile);
      
      const response = await fetch(`${API_BASE_URL}/import/sinh-vien-profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const result = await response.json();
      setImportResult(result);
      
      if (result.success) {
        alert('Import thành công: ' + result.message);
        // Refresh dashboard after successful import
        refreshDashboardWithDelay();
      } else {
        alert('Import thất bại: ' + result.message);
      }
    } catch (error) {
      alert('Lỗi import: ' + (error as Error).message);
    } finally {
      setIsImporting(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Import Danh sách Sinh viên
          </h1>
          <p className="text-gray-600">
            Tải lên file Excel để import danh sách tài khoản sinh viên hàng loạt
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* File Upload */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                1. Chọn file Excel
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Chọn file Excel (.xls, .xlsx) - Tối đa 10MB
                    </p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={handleFileSelect}
                  className="mt-4 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>

            </div>

            {/* Import */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                2. Import sinh viên
              </h2>
              
              <button
                onClick={processFile}
                disabled={!selectedFile || isImporting}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isImporting ? 'Đang import...' : 'Import ngay'}
              </button>
              
              {importResult && (
                <div className={`mt-4 p-4 rounded-md ${
                  importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start">
                    {importResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-2" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-2" />
                    )}
                    <div className="flex-1">
                      <p className={`font-medium ${
                        importResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {importResult.message}
                      </p>
                      
                      {importResult.data && (
                        <div className="mt-2 text-sm">
                          <p className="text-gray-600">
                            {importResult.data.file && `Tổng số dòng: ${importResult.data.file.totalRows} | `}
                            {importResult.data.parsing && `Hợp lệ: ${importResult.data.parsing.validRows} | Lỗi: ${importResult.data.parsing.errorRows}`}
                          </p>
                          {importResult.data.import && (
                            <p className="text-gray-600 mt-1">
                              Tài khoản tạo mới: {importResult.data.import.accountsCreated} | 
                              Cập nhật: {importResult.data.import.accountsUpdated} | 
                              Profile tạo: {importResult.data.import.profilesCreated} | 
                              Profile cập nhật: {importResult.data.import.profilesUpdated}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>


          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Template Download */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Template Excel
              </h3>
              <button
                onClick={downloadTemplate}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Tải template
              </button>
              <p className="mt-2 text-sm text-gray-500">
                Tải file Excel mẫu để điền thông tin sinh viên
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Hướng dẫn
              </h3>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-900">Các cột bắt buộc:</h4>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Mã sinh viên</li>
                    <li>Họ và tên</li>
                    <li>Mật khẩu</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Các cột tùy chọn:</h4>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>Email (tự động tạo nếu trống)</li>
                    <li>Lớp</li>
                    <li>Khoa (mặc định: CNTT)</li>
                    <li>Số điện thoại</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Lưu ý:</h4>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    <li>File Excel (.xls, .xlsx)</li>
                    <li>Tối đa 10MB</li>
                    <li>Mật khẩu sẽ được mã hóa</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportStudentsPage;