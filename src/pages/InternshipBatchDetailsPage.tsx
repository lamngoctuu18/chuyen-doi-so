import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const InternshipBatchDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [batch, setBatch] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch(`http://localhost:3001/api/internship-batches/${id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        setBatch(data.data || data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div className="text-red-600">Lỗi: {error}</div>;
  if (!batch) return <div>Không tìm thấy đợt thực tập</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Chi tiết đợt thực tập</h1>
        <Link to="/internships" className="text-blue-600 hover:underline">← Quay lại</Link>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span className="font-medium">Tên đợt:</span> {batch.ten_dot || batch.tenDot}</div>
          <div><span className="font-medium">Trạng thái:</span> {batch.trang_thai}</div>
          <div><span className="font-medium">Bắt đầu:</span> {batch.thoi_gian_bat_dau}</div>
          <div><span className="font-medium">Kết thúc:</span> {batch.thoi_gian_ket_thuc}</div>
          <div className="md:col-span-2"><span className="font-medium">Mô tả:</span> {batch.mo_ta}</div>
        </div>
      </div>
    </div>
  );
};

export default InternshipBatchDetailsPage;