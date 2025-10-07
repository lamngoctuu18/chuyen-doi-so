import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (userId: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  // Allow external pages (like AdminLoginPage) to set auth state after a successful login
  setAuthenticatedUser: (rawUser: any, token?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development - Now using ID-based login
// These are temporary accounts for testing. Real accounts will be imported from Excel
const mockUsers: (User & { password: string; userId: string })[] = [
  // Admin account
  {
    id: '1',
    userId: 'admin001',
    email: 'admin@dainam.edu.vn',
    password: 'admin123',
    name: 'Quản trị viên hệ thống',
    role: 'admin',
    phone: '0123456789'
  },
  // Sample students (will be replaced by Excel import)
  {
    id: '2',
    userId: 'sv001',
    email: 'sv001@dainam.edu.vn',
    password: 'password123',
    name: 'Nguyễn Văn A',
    role: 'sinh-vien',
    phone: '0987654321'
  },
  {
    id: '3',
    userId: 'sv002',
    email: 'sv002@dainam.edu.vn',
    password: 'password123',
    name: 'Trần Thị B',
    role: 'sinh-vien',
    phone: '0987654322'
  },
  // Sample teachers (will be replaced by Excel import)
  {
    id: '4',
    userId: 'gv001',
    email: 'gv001@dainam.edu.vn',
    password: 'password123',
    name: 'TS. Lê Văn C',
    role: 'giang-vien',
    phone: '0912345678'
  },
  {
    id: '5',
    userId: 'gv002',
    email: 'gv002@dainam.edu.vn',
    password: 'password123',
    name: 'ThS. Phạm Thị D',
    role: 'giang-vien',
    phone: '0912345679'
  },
  // Sample companies (will be replaced by Excel import)
  {
    id: '6',
    userId: 'dn001',
    email: 'contact@fpt.com.vn',
    password: 'password123',
    name: 'Công ty FPT Software',
    role: 'doanh-nghiep',
    phone: '0934567890'
  },
  {
    id: '7',
    userId: 'dn002',
    email: 'contact@viettel.com.vn',
    password: 'password123',
    name: 'Tập đoàn Viettel',
    role: 'doanh-nghiep',
    phone: '0934567891'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  useEffect(() => {
    // Check for stored auth on app start
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          loading: false
        });
      } catch (error) {
        localStorage.removeItem('user');
        setAuthState({
          user: null,
          isAuthenticated: false,
          loading: false
        });
      }
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (userId: string, password: string, role?: string): Promise<boolean> => {
    try {
      console.log('🔄 Attempting login with:', { userId, password, role });
      
      // Call real API instead of mock data
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userCode: userId,
          password: password
        }),
      });

      console.log('📡 API Response status:', response.status);
      
      const data = await response.json();
      console.log('📋 API Response data:', data);

      if (data.success && data.data?.user) {
        const user = data.data.user;
        const token = data.data.token;
        
        console.log('👤 User data from API:', user);
        console.log('🔑 Token received:', token ? 'Yes' : 'No');
        
        // Map API response to frontend User type
        const mappedUser: User = {
          id: user.id?.toString() || user.userId || '1',
          email: (user.userId || userId) + '@dainam.edu.vn',
          name: user.hoTen || user.tenDoanhNghiep || user.name || userId,
          role: user.role || 'sinh-vien',
          phone: user.soDienThoai || '0123456789'
        };

        console.log('🎯 Mapped user:', mappedUser);

        setAuthState({
          user: mappedUser,
          isAuthenticated: true,
          loading: false
        });
        
        // Store both user and token
        localStorage.setItem('user', JSON.stringify(mappedUser));
        if (token) {
          localStorage.setItem('token', token);
        }
        
        console.log('✅ Login successful');
        return true;
      } else {
        console.log('❌ Login failed - Invalid response structure');
        console.log('- success:', data.success);
        console.log('- data:', data.data);
        console.log('- user:', data.data?.user);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return false;
    }
  };

  // Allow other pages to set auth state directly (useful for admin-specific login flow)
  const setAuthenticatedUser = (rawUser: any, token?: string) => {
    // Map API response to frontend User type
    const mappedUser: User = {
      id: rawUser.id?.toString() || rawUser.userId || '1',
      email: rawUser.email || (rawUser.userId || 'unknown') + '@dainam.edu.vn',
      name: rawUser.hoTen || rawUser.tenDoanhNghiep || rawUser.name || rawUser.userId || 'Ngui dng',
      role: rawUser.role || 'sinh-vien',
      phone: rawUser.soDienThoai || '0123456789'
    };

    setAuthState({
      user: mappedUser,
      isAuthenticated: true,
      loading: false
    });

    localStorage.setItem('user', JSON.stringify(mappedUser));
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false
    });
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    setAuthenticatedUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};