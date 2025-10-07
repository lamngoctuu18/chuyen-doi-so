import React, { useState } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { refreshDashboardWithDelay } from '../utils/dashboardUtils';

interface ImportGoogleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ImportGoogleFormModal: React.FC<ImportGoogleFormModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const response = await fetch('http://localhost:3001/api/import/thuc-tap-google-form', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        if (data.data.summary.hasErrors) {
          // Có lỗi nhưng vẫn import được một phần
          setError(`Import hoàn thành với ${data.data.import.errors.length} lỗi`);
        }
        // Refresh dashboard after successful import
        refreshDashboardWithDelay();
        onSuccess();
      } else {
        setError(data.message || 'Có lỗi xảy ra khi import');
      }
    } catch (err) {
      setError('Không thể kết nối đến server');
      console.error('Import error:', err);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Tạo file template để user tải về
    const templateContent = `
Mẫu Google Form Import Template
==============================

1. Tạo Google Form theo cấu trúc:
   - Mã sinh viên (10 chữ số) *
   - Họ và tên *
   - Ngày sinh
   - Số điện thoại liên hệ *
   - Email liên hệ *
   - Lớp theo học *
   - Em lựa chọn nguyện vọng thực tập tốt nghiệp như thế nào? *
   - Tên công ty / đơn vị thực tập (tùy chọn)
   - Địa chỉ công ty / đơn vị thực tập (tùy chọn)
   - Người liên hệ tại công ty + số điện thoại (tùy chọn)
   - Vị trí / ngành nghề mong muốn khi thực tập tốt nghiệp *
   - Ghi chú thêm (tùy chọn)

2. Export Google Form responses thành Excel
3. Upload file Excel vào đây

Chi tiết xem file: Google_Form_Template.md
`;

    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Google_Form_Import_Guide.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setUploading(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Import đăng ký thực tập từ Google Form
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-2">Hướng dẫn import:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Tạo Google Form theo template mẫu</li>
                  <li>Thu thập phản hồi từ sinh viên</li>
                  <li>Export responses thành file Excel (.xlsx)</li>
                  <li>Upload file Excel vào đây để import vào hệ thống</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Download Template Button */}
          <div className="mb-6">
            <button
              onClick={downloadTemplate}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Tải hướng dẫn tạo Google Form
            </button>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn file Excel từ Google Form
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Chọn file Excel</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </label>
                  <p className="pl-1">hoặc kéo thả vào đây</p>
                </div>
                <p className="text-xs text-gray-500">
                  Chỉ hỗ trợ file Excel (.xlsx, .xls)
                </p>
              </div>
            </div>
            
            {file && (
              <div className="mt-3 flex items-center text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-2" />
                <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Có lỗi xảy ra:</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Result */}
          {result && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-2">Import thành công!</p>
                  <div className="space-y-1">
                    <p>• Tổng số bản ghi: {result.file.totalRows}</p>
                    <p>• Cập nhật thành công: {result.import.successful}</p>
                    <p>• Tự động phân loại: {result.classification.totalClassified} sinh viên</p>
                    {result.import.failed > 0 && (
                      <p className="text-amber-700">• Có lỗi: {result.import.failed} bản ghi</p>
                    )}
                  </div>
                  
                  {result.classification.classifications && Object.keys(result.classification.classifications).length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium">Phân loại theo vị trí:</p>
                      {Object.entries(result.classification.classifications).map(([position, students]: [string, any]) => (
                        <div key={position} className="ml-2 text-xs">
                          • {position}: {students.length} sinh viên
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleClose}
              disabled={uploading}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {result ? 'Đóng' : 'Hủy'}
            </button>
            
            {!result && (
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                    Đang import...
                  </>
                ) : (
                  'Import ngay'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportGoogleFormModal;