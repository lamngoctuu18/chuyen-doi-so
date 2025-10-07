import { useEffect, useState } from 'react';
import React from 'react';

interface AdminCheck {
  isAdmin: boolean;
  isLoading: boolean;
  adminInfo: {
    userId: string;
    role: string;
  } | null;
}

export const useAdminValidation = (): AdminCheck => {
  const [adminCheck, setAdminCheck] = useState<AdminCheck>({
    isAdmin: false,
    isLoading: true,
    adminInfo: null
  });

  useEffect(() => {
    const checkAdminAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
          setAdminCheck({
            isAdmin: false,
            isLoading: false,
            adminInfo: null
          });
          return;
        }

        const user = JSON.parse(userStr);
        
        // Kiểm tra role và định dạng userId
        const isValidAdmin = user.role === 'admin' && 
                           user.userId && 
                           user.userId.toLowerCase().includes('admin');

        setAdminCheck({
          isAdmin: isValidAdmin,
          isLoading: false,
          adminInfo: isValidAdmin ? {
            userId: user.userId,
            role: user.role
          } : null
        });

      } catch (error) {
        console.error('Error checking admin auth:', error);
        setAdminCheck({
          isAdmin: false,
          isLoading: false,
          adminInfo: null
        });
      }
    };

    checkAdminAuth();

    // Listen for storage changes
    const handleStorageChange = () => {
      checkAdminAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return adminCheck;
};

// Component bảo vệ route admin
export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isLoading } = useAdminValidation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang xác thực quyền admin...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    // Redirect to login if not admin
    localStorage.clear();
    window.location.href = '/admin/login';
    return null;
  }

  return <>{children}</>;
};