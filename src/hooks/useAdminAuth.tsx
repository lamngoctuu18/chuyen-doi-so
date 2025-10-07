import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  id: number;
  userId: string;
  role: string;
}

interface AdminLoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: AdminUser;
    token: string;
  };
}

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loginAdmin = async (userId: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId.trim(),
          password: password
        })
      });

      const data: AdminLoginResponse = await response.json();

      if (data.success && data.data) {
        // Lưu token và thông tin admin
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        console.log('Admin login successful:', data.data.user);
        return true;
      } else {
        setError(data.message || 'Đăng nhập thất bại');
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setError('Lỗi kết nối đến server. Vui lòng thử lại.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return {
    loginAdmin,
    logout,
    loading,
    error
  };
};