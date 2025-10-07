import React, { useState } from 'react';

const ImportAssignmentsPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<any[]>([]);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage(null);
    setErrors([]);
    try {
  const form = new FormData();
  form.append('excelFile', file);
      const resp = await fetch('http://localhost:3001/api/import/phan-cong', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` },
        body: form
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message || `HTTP ${resp.status}`);
      setMessage(data.message || 'Import phân công thành công');
      setErrors(data?.data?.errors || []);
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Import Phân công</h1>
        <p className="text-gray-600 mt-1">Tải lên file Excel chứa Mã SV và các cột Doanh nghiệp, Giảng viên, Vị trí, Nguyện vọng...</p>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <button
            disabled={!file || loading}
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Đang import...' : 'Tải lên và import'}
          </button>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); alert('Các cột gợi ý: Mã SV, Doanh nghiệp thực tập, Giảng viên hướng dẫn, Vị trí mong muốn, Nguyện vọng TT'); }}
            className="text-blue-600 hover:underline"
          >
            Xem hướng dẫn
          </a>
        </div>

        {errors.length > 0 && (
          <div className="mt-4 text-sm text-red-700">
            Có {errors.length} lỗi:
            <ul className="list-disc pl-5 mt-2">
              {errors.slice(0, 10).map((e, idx) => (
                <li key={idx}>Dòng {e.row || e.userId}: {e.message}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportAssignmentsPage;