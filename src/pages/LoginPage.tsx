import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, LogIn, Users, Save, Trash2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import daiNamLogo from '../assets/fitdnu_logo.png';

type UserRole = 'admin' | 'sinh-vien' | 'giang-vien' | 'doanh-nghiep';

interface SavedAccount {
  userId: string;
  password: string;
  lastUsed: number;
}

interface SavedAccounts {
  'sinh-vien': SavedAccount[];
  'giang-vien': SavedAccount[];
  'doanh-nghiep': SavedAccount[];
  'admin': SavedAccount[];
}

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('sinh-vien');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedAccounts, setSavedAccounts] = useState<SavedAccounts>({
    'sinh-vien': [],
    'giang-vien': [],
    'doanh-nghiep': [],
    'admin': []
  });
  const [showSavedAccounts, setShowSavedAccounts] = useState(false);
  const [rememberAccount, setRememberAccount] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Load saved accounts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedAccounts');
    if (saved) {
      try {
        setSavedAccounts(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing saved accounts:', error);
      }
    }
  }, []);

  // Save account to localStorage
  const saveAccount = (role: UserRole, userId: string, password: string) => {
    const newSavedAccounts = { ...savedAccounts };
    const existingIndex = newSavedAccounts[role].findIndex(acc => acc.userId === userId);
    
    const accountData: SavedAccount = {
      userId,
      password,
      lastUsed: Date.now()
    };

    if (existingIndex >= 0) {
      newSavedAccounts[role][existingIndex] = accountData;
    } else {
      newSavedAccounts[role].unshift(accountData);
      // Keep only 5 most recent accounts per role
      newSavedAccounts[role] = newSavedAccounts[role].slice(0, 5);
    }

    setSavedAccounts(newSavedAccounts);
    localStorage.setItem('savedAccounts', JSON.stringify(newSavedAccounts));
  };

  // Remove saved account
  const removeSavedAccount = (role: UserRole, userId: string) => {
    const newSavedAccounts = { ...savedAccounts };
    newSavedAccounts[role] = newSavedAccounts[role].filter(acc => acc.userId !== userId);
    setSavedAccounts(newSavedAccounts);
    localStorage.setItem('savedAccounts', JSON.stringify(newSavedAccounts));
  };

  // Auto-fill when role changes
  useEffect(() => {
    const roleAccounts = savedAccounts[role];
    if (roleAccounts.length > 0) {
      const mostRecent = roleAccounts.sort((a, b) => b.lastUsed - a.lastUsed)[0];
      setUserId(mostRecent.userId);
      setPassword(mostRecent.password);
    } else {
      setUserId('');
      setPassword('');
    }
  }, [role, savedAccounts]);

  // Fill account data when clicking on saved account
  const fillAccountData = (account: SavedAccount) => {
    setUserId(account.userId);
    setPassword(account.password);
    setShowSavedAccounts(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.saved-accounts-container')) {
        setShowSavedAccounts(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const roleOptions = [
    { value: 'sinh-vien', label: 'Sinh viên', placeholder: 'Mã sinh viên' },
    { value: 'giang-vien', label: 'Giảng viên', placeholder: 'Mã giảng viên' },
    { value: 'doanh-nghiep', label: 'Doanh nghiệp', placeholder: 'Mã doanh nghiệp' },
    { value: 'admin', label: 'Quản trị viên', placeholder: 'Chuyển đến trang admin' },
  ];

  const currentRoleOption = roleOptions.find(option => option.value === role);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'admin') {
      navigate('/admin/login');
      return;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirect to admin login if admin role is selected
    if (role === 'admin') {
      navigate('/admin/login');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await login(userId, password, role);
      if (success) {
        // Save account if remember is checked or if it's a successful login
        if (rememberAccount || true) { // Always save successful logins
          saveAccount(role, userId, password);
        }
        navigate(from, { replace: true });
      } else {
        setError('Mã đăng nhập hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-orange-400/10 to-blue-700/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="mx-auto w-24 h-24 mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-300 hover:rotate-3"></div>
            <div className="relative w-full h-full bg-white rounded-3xl shadow-xl p-3 flex items-center justify-center">
              <img 
                src={daiNamLogo} 
                alt="Đại học Đại Nam" 
                className="w-16 h-16 object-contain"
              />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-orange-100 to-blue-100 bg-clip-text text-transparent mb-3 animate-fade-in">
            Đăng nhập
          </h2>
          <p className="text-orange-100 text-lg font-medium">Hệ thống quản lý thực tập - Khoa Công nghệ Thông tin</p>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Enhanced Information Notice */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-white font-semibold mb-3 text-lg">
              Hệ thống đăng nhập dành cho sinh viên, giảng viên và doanh nghiệp
            </p>
            <p className="text-blue-100 text-sm mb-4 leading-relaxed">
              Tài khoản được cấp bởi quản trị viên hệ thống. Vui lòng liên hệ admin nếu chưa có tài khoản.
            </p>
            {Object.values(savedAccounts).some(accounts => accounts.length > 0) && (
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-3 mt-4">
                <p className="text-green-100 text-sm font-medium flex items-center justify-center gap-2">
                  <Save className="h-4 w-4" />
                  <span className="animate-pulse">✨</span>
                  Hệ thống đã lưu tài khoản của bạn - Chọn vai trò để tự động điền!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Login Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-blue-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 hover:bg-white/20 transition-all duration-300">
            <form className="space-y-7" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-2xl p-4 text-red-100 text-sm font-medium shadow-lg animate-shake">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">!</span>
                    </div>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {/* Enhanced Role Selection */}
              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-bold text-white mb-3 tracking-wide">
                  Vai trò
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Users className="h-5 w-5 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="appearance-none block w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20 text-white placeholder-blue-200 font-medium shadow-lg hover:bg-white/15 transition-all duration-300"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Enhanced User ID Field */}
              <div className="saved-accounts-container space-y-2">
                <label htmlFor="userId" className="block text-sm font-bold text-white mb-3 tracking-wide">
                  {currentRoleOption?.placeholder || 'Mã sinh viên'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <User className="h-5 w-5 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                  </div>
                  <input
                    id="userId"
                    name="userId"
                    type="text"
                    autoComplete="username"
                    required
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    onFocus={() => setShowSavedAccounts(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' && savedAccounts[role].length > 0) {
                        e.preventDefault();
                        setShowSavedAccounts(true);
                      }
                    }}
                    className="block w-full pl-12 pr-16 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20 text-white placeholder-blue-200 font-medium shadow-lg hover:bg-white/15 transition-all duration-300"
                    placeholder={currentRoleOption?.placeholder || 'SV047'}
                  />
                  {savedAccounts[role].length > 0 && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowSavedAccounts(!showSavedAccounts)}
                        className="text-blue-300 hover:text-blue-200 focus:outline-none relative transition-colors duration-200 p-1 rounded-lg hover:bg-white/20"
                        title={`${savedAccounts[role].length} tài khoản đã lưu`}
                      >
                        <Save className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg animate-pulse">
                          {savedAccounts[role].length}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

              {/* Enhanced Saved Accounts Dropdown */}
              {showSavedAccounts && savedAccounts[role].length > 0 && (
                <div className="absolute z-20 mt-2 w-full bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl max-h-60 overflow-auto animate-in slide-in-from-top-1 duration-300">
                  <div className="py-2">
                    <div className="px-4 py-3 text-sm font-bold text-gray-800 border-b bg-gradient-to-r from-orange-50/80 to-blue-50/80">
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4 text-blue-600" />
                        Tài khoản đã lưu cho {currentRoleOption?.label}
                      </div>
                    </div>
                    {savedAccounts[role]
                      .sort((a, b) => b.lastUsed - a.lastUsed)
                      .map((account, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-4 py-3 hover:bg-gradient-to-r hover:from-orange-50/60 hover:to-blue-50/60 cursor-pointer group transition-all duration-200 border-b border-white/10 last:border-b-0"
                          onClick={() => fillAccountData(account)}
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 via-orange-600 to-blue-600 flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm font-bold">
                                {account.userId.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-bold text-gray-900 mb-1">
                                {account.userId}
                              </div>
                              <div className="text-xs text-gray-600 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Lần cuối: {new Date(account.lastUsed).toLocaleDateString('vi-VN', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSavedAccount(role, account.userId);
                            }}
                            className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-100 transition-all duration-200"
                            title="Xóa tài khoản đã lưu"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                  </div>
                  <div className="px-4 py-3 bg-gradient-to-r from-orange-50/60 to-blue-50/60 border-t border-white/20 text-xs text-gray-700 text-center font-medium">
                    ✨ Click để chọn tài khoản, hover để xóa
                  </div>
                </div>
              )}
            </div>

              {/* Enhanced Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-white mb-3 tracking-wide">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-blue-200 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setShowSavedAccounts(false)}
                    className="block w-full pl-12 pr-16 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/20 text-white placeholder-blue-200 font-medium shadow-lg hover:bg-white/15 transition-all duration-300"
                    placeholder="●●●●●●●●"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-blue-300 hover:text-blue-200 focus:outline-none p-1 rounded-lg hover:bg-white/20 transition-all duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Remember Account Checkbox */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      id="remember-account"
                      name="remember-account"
                      type="checkbox"
                      checked={rememberAccount}
                      onChange={(e) => setRememberAccount(e.target.checked)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-400 border-white/30 rounded-lg bg-white/10 backdrop-blur-sm"
                    />
                  </div>
                  <label htmlFor="remember-account" className="block text-sm font-medium text-white">
                    Nhớ tài khoản này
                  </label>
                </div>
                {savedAccounts[role].length > 0 && (
                  <div className="text-sm text-green-300 font-semibold bg-green-500/20 px-3 py-1 rounded-full backdrop-blur-sm border border-green-400/30">
                    {savedAccounts[role].length} tài khoản đã lưu
                  </div>
                )}
              </div>

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-orange-600 via-orange-700 to-blue-700 hover:from-orange-700 hover:via-orange-800 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-orange-400/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  ) : (
                    <LogIn className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                  )}
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập hệ thống'}
                </div>
              </button>
            </form>

            {/* Enhanced Links & Contact */}
            <div className="mt-8 text-center space-y-4">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-200 hover:text-white hover:underline block font-medium transition-colors duration-200"
              >
                Quên mật khẩu?
              </Link>
              
              <div className="border-t border-white/20 pt-4">
                <p className="text-sm text-blue-100 mb-2">
                  Cần hỗ trợ? Liên hệ quản trị viên hệ thống
                </p>
                <p className="text-sm text-white font-semibold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  📧 admin@dainam.edu.vn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;