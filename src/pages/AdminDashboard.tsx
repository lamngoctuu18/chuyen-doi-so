import React from 'react';
import { useAuth } from '../hooks/useAuth';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bảng điều khiển Quản trị viên</h1>
      <p className="text-gray-700 mb-2">Xin chào, {user?.name || 'Admin'} ({user?.role})</p>
      <div className="mt-4 bg-white shadow rounded p-4">
        <p>Đây là giao diện dành cho quản trị viên. Hiển thị các chức năng quản lý hệ thống ở đây.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
