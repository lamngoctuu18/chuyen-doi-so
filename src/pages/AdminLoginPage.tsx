import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, LogIn, Shield, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import daiNamLogo from '../assets/fitdnu_logo.png';

interface LoginAttempt {
  count: number;
  lockUntil: number;
  lastAttempt: number;
}

const AdminLoginPage: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const { loading, setAuthenticatedUser } = useAuth();
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 5;
  const INITIAL_LOCK_TIME = 60000; // 1 phút

  // Lấy thông tin attempts từ localStorage
  const getLoginAttempts = (userId: string): LoginAttempt => {
    const key = `admin_login_attempts_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    return { count: 0, lockUntil: 0, lastAttempt: 0 };
  };

  // Lưu attempts vào localStorage
  const saveLoginAttempts = (userId: string, attempt: LoginAttempt) => {
    const key = `admin_login_attempts_${userId}`;
    localStorage.setItem(key, JSON.stringify(attempt));
  };

  // Kiểm tra xem tài khoản có bị khóa không
  const checkLockStatus = (userId: string) => {
    if (!userId) return;
    
    const attempt = getLoginAttempts(userId);
    const now = Date.now();
    
    if (attempt.lockUntil > now) {
      setIsLocked(true);
      setLockTimeRemaining(Math.ceil((attempt.lockUntil - now) / 1000));
      setAttempts(attempt.count);
    } else {
      setIsLocked(false);
      setLockTimeRemaining(0);
      if (attempt.lockUntil > 0 && attempt.lockUntil <= now) {
        // Reset attempts sau khi hết thời gian khóa
        attempt.count = 0;
        attempt.lockUntil = 0;
        saveLoginAttempts(userId, attempt);
      }
      setAttempts(attempt.count);
    }
  };

  // Countdown timer cho thời gian khóa
  useEffect(() => {
    if (lockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setLockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            if (userId) {
              checkLockStatus(userId);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockTimeRemaining, userId]);

  // Kiểm tra lock status khi userId thay đổi
  useEffect(() => {
    if (userId.trim()) {
      checkLockStatus(userId.trim());
    } else {
      setIsLocked(false);
      setAttempts(0);
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cleanUserId = userId.trim();
    const cleanPassword = password.trim();

    // Kiểm tra định dạng tài khoản admin
    if (!cleanUserId.toLowerCase().includes('admin')) {
      setError('Tài khoản không hợp lệ. Chỉ tài khoản admin được phép truy cập.');
      return;
    }

    // Kiểm tra xem tài khoản có bị khóa không
    const attempt = getLoginAttempts(cleanUserId);
    const now = Date.now();
    
    if (attempt.lockUntil > now) {
      const remainingSeconds = Math.ceil((attempt.lockUntil - now) / 1000);
      setError(`Tài khoản tạm thời bị khóa. Vui lòng thử lại sau ${remainingSeconds} giây.`);
      setIsLocked(true);
      setLockTimeRemaining(remainingSeconds);
      return;
    }

    try {
      // Gọi API đăng nhập admin riêng biệt
      const response = await fetch('http://localhost:3001/api/auth/login/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: cleanUserId,
          password: cleanPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        // Reset attempts khi đăng nhập thành công
        const successAttempt: LoginAttempt = { count: 0, lockUntil: 0, lastAttempt: now };
        saveLoginAttempts(cleanUserId, successAttempt);

        // Update app auth state via context so the Layout and ProtectedRoute react correctly
        try {
          setAuthenticatedUser(data.data.user, data.data.token);
        } catch (err) {
          // Fallback: if context setter fails, still store to localStorage
          localStorage.setItem('token', data.data.token || '');
          localStorage.setItem('user', JSON.stringify(data.data.user));
        }

        // Chuyển đến trang admin
        navigate('/admin', { replace: true });
      } else {
        // Tăng số lần thử đăng nhập thất bại
        const newCount = attempt.count + 1;
        setAttempts(newCount);
        
        if (newCount >= MAX_ATTEMPTS) {
          // Tính thời gian khóa (tăng dần theo số lần vi phạm)
          const violationLevel = Math.floor(newCount / MAX_ATTEMPTS);
          const lockDuration = INITIAL_LOCK_TIME * Math.pow(2, violationLevel - 1); // 1 phút, 2 phút, 4 phút, ...
          const lockUntil = now + lockDuration;
          
          const newAttempt: LoginAttempt = { count: newCount, lockUntil, lastAttempt: now };
          saveLoginAttempts(cleanUserId, newAttempt);
          
          setIsLocked(true);
          setLockTimeRemaining(Math.ceil(lockDuration / 1000));
          setError(`Đăng nhập thất bại ${MAX_ATTEMPTS} lần. Tài khoản bị khóa ${Math.ceil(lockDuration / 60000)} phút.`);
        } else {
          const newAttempt: LoginAttempt = { count: newCount, lockUntil: 0, lastAttempt: now };
          saveLoginAttempts(cleanUserId, newAttempt);
          
          const remaining = MAX_ATTEMPTS - newCount;
          setError(
            `Tài khoản hoặc mật khẩu không chính xác. ` +
            `Còn ${remaining} lần thử trước khi bị khóa.`
          );
        }
      }
    } catch (err) {
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
      console.error('Admin login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-orange-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 -left-4 w-72 h-72 bg-orange-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-10 -right-4 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-800/10 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        
        {/* Security Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-8 shadow-2xl transform hover:scale-105 transition-all duration-300 border border-blue-500/30 p-1">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-0.5">
              <img src={daiNamLogo} alt="Dai Nam University" className="w-full h-full object-contain drop-shadow-lg" />
            </div>
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-orange-100 bg-clip-text text-transparent mb-3 animate-fade-in">
            Admin Portal
          </h2>
          <p className="text-red-300 text-lg font-semibold">Quản trị viên hệ thống - Khoa CNTT</p>
          <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-gray-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Enhanced Security Warning */}
        <div className="bg-blue-900/30 backdrop-blur-md border border-blue-500/40 rounded-2xl p-6 shadow-xl">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-blue-200 font-bold mb-3 text-lg">
              KHU VỰC BẢO MẬT
            </h3>
            <p className="text-blue-300 text-sm mb-4 leading-relaxed">
              Chỉ dành cho quản trị viên hệ thống được ủy quyền. Mọi truy cập trái phép sẽ bị ghi log và xử lý theo quy định.
            </p>
            <div className="bg-gradient-to-r from-orange-600/20 to-blue-600/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-3 mt-4">
              <p className="text-blue-200 text-sm font-medium flex items-center justify-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="animate-pulse">⚠️</span>
                Hệ thống giám sát hoạt động 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Login Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-gray-600/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gray-900/60 backdrop-blur-xl border border-red-500/30 rounded-3xl shadow-2xl p-8 hover:bg-gray-900/70 transition-all duration-300">
            <form className="space-y-7" onSubmit={handleSubmit}>
              {/* Enhanced Security Notice */}
              <div className="bg-yellow-600/20 backdrop-blur-sm border border-yellow-500/40 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-300 mr-3 animate-pulse" />
                  <p className="text-sm text-yellow-200 font-medium">
                    <strong>Chính sách bảo mật:</strong> Đăng nhập sai {MAX_ATTEMPTS} lần sẽ tự động khóa tài khoản và tăng thời gian khóa.
                  </p>
                </div>
              </div>

              {/* Enhanced Lock Status */}
              {isLocked && lockTimeRemaining > 0 && (
                <div className="bg-red-800/30 backdrop-blur-sm border border-red-500/50 rounded-2xl p-4 shadow-lg animate-pulse">
                  <div className="flex items-center">
                    <Clock className="h-6 w-6 text-red-300 mr-3 animate-spin" />
                    <div>
                      <p className="text-sm text-red-200 font-bold">
                        🔒 Tài khoản tạm thời bị khóa
                      </p>
                      <p className="text-sm text-red-300 mt-1">
                        Thời gian còn lại: <span className="font-mono font-bold text-lg text-red-100 bg-red-700/50 px-2 py-1 rounded">{lockTimeRemaining}s</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Attempts Warning */}
              {attempts > 0 && attempts < MAX_ATTEMPTS && !isLocked && (
                <div className="bg-orange-600/20 backdrop-blur-sm border border-orange-500/40 rounded-2xl p-4 shadow-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-orange-300 mr-3 animate-bounce" />
                    <p className="text-sm text-orange-200 font-medium">
                      ⚠️ Đã thử đăng nhập thất bại <strong className="text-orange-100 bg-orange-700/50 px-2 py-1 rounded">{attempts}</strong> lần. 
                      Còn <strong className="text-orange-100 bg-orange-700/50 px-2 py-1 rounded">{MAX_ATTEMPTS - attempts}</strong> lần trước khi bị khóa.
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-900/40 backdrop-blur-sm border border-red-500/50 rounded-2xl p-4 text-red-200 text-sm font-medium shadow-lg animate-shake">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-300 mr-2" />
                    {error}
                  </div>
                </div>
              )}

              {/* Enhanced Admin ID Field */}
              <div className="space-y-2">
                <label htmlFor="userId" className="block text-sm font-bold text-red-200 mb-3 tracking-wide">
                  Tài khoản Admin
                  <span className="text-red-400 ml-1 animate-pulse">*</span>
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <User className="h-5 w-5 text-red-400 group-focus-within:text-red-300 transition-colors" />
                  </div>
                  <input
                    id="userId"
                    name="userId"
                    type="text"
                    autoComplete="username"
                    required
                    disabled={isLocked}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className={`block w-full pl-12 pr-4 py-4 bg-gray-800/50 backdrop-blur-sm border rounded-2xl focus:outline-none focus:ring-2 text-white placeholder-red-300 font-medium shadow-lg transition-all duration-300 ${
                      isLocked 
                        ? 'bg-gray-800/30 cursor-not-allowed border-gray-600/50 text-gray-400' 
                        : userId && !userId.toLowerCase().includes('admin') 
                          ? 'border-red-500/70 bg-red-800/30 focus:ring-red-400 focus:border-red-400 hover:bg-red-800/40' 
                          : 'border-red-600/50 focus:ring-red-400 focus:border-red-400 hover:bg-gray-800/60'
                    }`}
                    placeholder="admin001, admin_system..."
                  />
                </div>
                {userId && !userId.toLowerCase().includes('admin') && (
                  <p className="mt-2 text-xs text-red-300 font-medium bg-red-800/30 backdrop-blur-sm border border-red-500/40 rounded-lg p-2">
                    ⚠️ Tài khoản phải chứa từ "admin"
                  </p>
                )}
              </div>

              {/* Enhanced Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-bold text-red-200 mb-3 tracking-wide">
                  Mật khẩu
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-red-400 group-focus-within:text-red-300 transition-colors" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    disabled={isLocked}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-12 pr-16 py-4 bg-gray-800/50 backdrop-blur-sm border rounded-2xl focus:outline-none focus:ring-2 text-white placeholder-red-300 font-medium shadow-lg transition-all duration-300 ${
                      isLocked 
                        ? 'bg-gray-800/30 cursor-not-allowed border-gray-600/50 text-gray-400' 
                        : 'border-red-600/50 focus:ring-red-400 focus:border-red-400 hover:bg-gray-800/60'
                    }`}
                    placeholder="●●●●●●●●"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-red-400 hover:text-red-300 focus:outline-none p-1 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
                      disabled={isLocked}
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

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={loading || isLocked}
                className={`group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-sm font-bold rounded-2xl text-white focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] ${
                  isLocked 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-red-600 via-red-700 to-gray-700 hover:from-red-700 hover:via-red-800 hover:to-gray-800 focus:ring-red-400/50 hover:shadow-red-500/25'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-gray-600 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  {isLocked ? (
                    <Clock className="h-6 w-6 text-gray-300 mr-3 animate-spin" />
                  ) : loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  ) : (
                    <LogIn className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                  )}
                  {isLocked ? `🔒 Đợi ${lockTimeRemaining}s` : loading ? 'Đang xác thực...' : '🛡️ Truy cập Admin'}
                </div>
              </button>

              {/* Enhanced Back to Main Login */}
              <div className="text-center pt-6 border-t border-red-600/30">
                <Link
                  to="/login"
                  className="text-sm text-red-300 hover:text-white font-medium transition-colors duration-200 flex items-center justify-center gap-2 bg-red-900/30 backdrop-blur-sm px-4 py-2 rounded-full border border-red-500/40 hover:bg-red-900/50"
                >
                  ← Quay lại trang đăng nhập thông thường
                </Link>
              </div>
            </form>
          </div>
        </div>

        {/* Enhanced Footer Security Notice */}
        <div className="bg-gray-900/40 backdrop-blur-md border border-gray-600/50 rounded-2xl p-6 shadow-xl">
          <div className="text-center text-sm text-gray-300 space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-red-400 animate-pulse" />
              <span className="font-bold text-red-300 text-lg">PHÂN QUYỀN CAO NHẤT</span>
            </div>
            <div className="space-y-2">
              <p className="flex items-center justify-center gap-2">
                🔒 <span className="font-medium">Mọi hoạt động đều được giám sát và ghi log</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                ⚠️ <span className="font-medium">Chỉ admin được ủy quyền mới có thể truy cập</span>
              </p>
              <p className="flex items-center justify-center gap-2 text-gray-400">
                🕒 <span>Phiên làm việc tự động hết hạn sau 24 giờ</span>
              </p>
              <p className="flex items-center justify-center gap-2 text-gray-400">
                📊 <span>Hệ thống theo dõi IP và thiết bị truy cập</span>
              </p>
            </div>
            <div className="mt-4 p-3 bg-red-900/30 backdrop-blur-sm border border-red-500/40 rounded-xl">
              <p className="text-red-200 font-medium text-xs">
                🚨 BẢO MẬT TUYỆT ĐỐI - KHÔNG CHIA SẺ THÔNG TIN ĐĂNG NHẬP
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;