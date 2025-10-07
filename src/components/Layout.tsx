import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, ChevronDown, Settings, MapPin, Phone, Mail, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import daiNamLogo from '../assets/fitdnu_logo.png';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Track scroll position for header effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserDropdown) {
        const target = event.target as Element;
        if (!target.closest('.user-dropdown')) {
          setShowUserDropdown(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserDropdown]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { path: '/', label: 'Trang chủ', roles: ['admin', 'sinh-vien', 'giang-vien', 'doanh-nghiep'] },
    { path: '/students', label: 'Sinh viên', roles: ['admin'] },
    { path: '/teachers', label: 'Giảng viên', roles: ['admin'] },
    { path: '/companies', label: 'Doanh nghiệp', roles: ['admin'] },
    { path: '/internships', label: 'Thực tập', roles: ['admin'] },
    { path: '/internship-registration', label: 'Đăng ký thực tập', roles: ['sinh-vien'] },
    { path: '/student/submissions', label: 'Nộp báo cáo', roles: ['sinh-vien'] },
    { path: '/my-interns', label: 'Sinh viên thực tập', roles: ['doanh-nghiep'] },
    { path: '/reports', label: 'Báo cáo', roles: ['giang-vien'] },
    { path: '/company-evaluations', label: 'Đánh giá từ DN', roles: ['giang-vien'] },
    { path: '/admin/reports', label: 'Báo cáo', roles: ['admin'] },
    { path: '/import-accounts', label: 'Import Tài Khoản', roles: ['admin'] },
    { path: '/guide/student', label: 'Hướng dẫn (SV)', roles: ['sinh-vien'] },
    { path: '/guide/teacher', label: 'Hướng dẫn (GV)', roles: ['giang-vien'] },
    { path: '/guide/company', label: 'Hướng dẫn (DN)', roles: ['doanh-nghiep'] },
  ];

  // Special navigation for welcome page - only guide items
  const welcomeNavigationItems = [
    { path: '/guide/student', label: 'Hướng dẫn Sinh viên', roles: ['admin', 'sinh-vien', 'giang-vien', 'doanh-nghiep'] },
    { path: '/guide/teacher', label: 'Hướng dẫn Giảng viên', roles: ['admin', 'sinh-vien', 'giang-vien', 'doanh-nghiep'] },
    { path: '/guide/company', label: 'Hướng dẫn Doanh nghiệp', roles: ['admin', 'sinh-vien', 'giang-vien', 'doanh-nghiep'] },
  ];

  // Determine navigation based on user authentication and role
  // Show welcome navigation only when user is not authenticated
  // When authenticated, show full navigation based on role
  const currentNavigationItems = !isAuthenticated ? welcomeNavigationItems : navigationItems;

  const visibleItems = currentNavigationItems.filter(item => 
    !user || item.roles.includes(user.role)
  );

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Enhanced Header with Blue-Orange Theme */}
      <nav className={`bg-gradient-to-r from-blue-900 via-blue-800 to-orange-600 border-b border-orange-400/30 sticky top-0 z-50 transition-all duration-300 ease-in-out backdrop-blur-md ${
        isScrolled ? 'shadow-xl bg-opacity-95' : 'shadow-lg'
      }`}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Enhanced Logo with Dai Nam Logo */}
            <div className="flex items-center min-w-0 flex-shrink-0">
              <Link to="/" className="flex items-center space-x-3 sm:space-x-4 group">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 p-1">
                  <img 
                    src={daiNamLogo} 
                    alt="Đại học Đại Nam" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="hidden sm:block min-w-0">
                  <h1 className="text-lg xl:text-xl font-bold text-white">Khoa Công nghệ Thông tin</h1>
                  <p className="text-sm xl:text-base text-orange-200 font-medium">Đại học Đại Nam</p>
                </div>
              </Link>
            </div>

            {/* Centered Enhanced Desktop Navigation - Only show when authenticated */}
            {isAuthenticated && (
              <div className="hidden lg:flex items-center justify-center flex-1 px-8">
                {/* Navigation Links - Guide Only */}
                <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-white/20">
                  {visibleItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap relative overflow-hidden group ${
                      isActivePath(item.path)
                        ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg scale-105'
                        : 'text-white hover:text-orange-200 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-blue-500/20 hover:scale-105'
                    }`}
                  >
                    <span className="relative z-10">{item.label}</span>
                    {/* Hover effect background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Right side - User section */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0 ml-auto">
              {/* User Profile Section */}
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 mr-4"
                >
                  Đăng nhập
                </Link>
              ) : (
                <div className="relative user-dropdown">
                  <div 
                    className="flex items-center space-x-3 bg-white/15 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 border border-white/20"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    
                    {/* User Info */}
                    <div className="hidden xl:block">
                      <p className="text-sm font-bold text-white">{user?.name}</p>
                      <p className="text-xs text-orange-200 font-medium capitalize">
                        {user?.role === 'sinh-vien' ? 'Sinh viên' : 
                         user?.role === 'giang-vien' ? 'Giảng viên' :
                         user?.role === 'doanh-nghiep' ? 'Doanh nghiệp' : 
                         user?.role === 'admin' ? 'Quản trị viên' : user?.role}
                      </p>
                    </div>
                    
                    {/* Dropdown Arrow */}
                    <ChevronDown className={`w-4 h-4 text-orange-200 transition-transform duration-300 group-hover:text-orange-100 ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Enhanced Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 py-3 z-50 animate-slideDown">
                      {/* User Header in Dropdown */}
                      <div className="px-5 py-4 border-b border-gray-100/50">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
                            <p className="text-sm text-gray-600">{user?.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <p className="text-xs text-orange-600 font-semibold capitalize">
                                {user?.role === 'sinh-vien' ? 'Sinh viên' : 
                                 user?.role === 'giang-vien' ? 'Giảng viên' :
                                 user?.role === 'doanh-nghiep' ? 'Doanh nghiệp' : 
                                 user?.role === 'admin' ? 'Quản trị viên' : user?.role}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-3 space-y-1">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-blue-50 hover:text-orange-600 transition-all duration-200 rounded-xl mx-2"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <div className="p-2 bg-orange-100 rounded-lg">
                            <User className="w-4 h-4 text-orange-600" />
                          </div>
                          <span className="font-semibold">Thông tin cá nhân</span>
                        </Link>
                        
                        <Link
                          to="/settings"
                          className="flex items-center space-x-4 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl mx-2"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <Settings className="w-4 h-4 text-purple-600" />
                          </div>
                          <span className="font-semibold">Cài đặt</span>
                        </Link>

                        <div className="border-t border-gray-100/50 mt-3 pt-3 mx-2">
                          <button
                            onClick={() => {
                              handleLogout();
                              setShowUserDropdown(false);
                            }}
                            className="flex items-center space-x-4 px-5 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 w-full text-left rounded-xl"
                          >
                            <div className="p-2 bg-red-100 rounded-lg">
                              <LogOut className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="font-semibold">Đăng xuất</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile actions */}
            <div className="lg:hidden flex items-center space-x-3 ml-auto">
              {!isAuthenticated ? (
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg mr-2"
                >
                  Đăng nhập
                </Link>
              ) : (
                <>
                  {/* Mobile User Avatar */}
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg shadow-md text-white hover:text-orange-200 focus:outline-none transition-all duration-200"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-5 h-5" />
                    ) : (
                      <Menu className="w-5 h-5" />
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Enhanced Mobile Navigation - Only show when authenticated */}
          {isMobileMenuOpen && isAuthenticated && (
            <div className="lg:hidden border-t border-orange-400/30 bg-gradient-to-b from-blue-800 to-orange-600/80 backdrop-blur-md">
              <div className="py-4 space-y-2 max-h-96 overflow-y-auto">
                {/* User Info Mobile */}
                {isAuthenticated && (
                  <div className="px-4 py-3 mb-4 bg-white/20 backdrop-blur-sm rounded-xl mx-3 shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{user?.name}</p>
                        <p className="text-sm text-orange-200 font-medium capitalize">
                          {user?.role === 'sinh-vien' ? 'Sinh viên' : 
                           user?.role === 'giang-vien' ? 'Giảng viên' :
                           user?.role === 'doanh-nghiep' ? 'Doanh nghiệp' : 
                           user?.role === 'admin' ? 'Quản trị viên' : user?.role}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Links */}
                {visibleItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block mx-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActivePath(item.path)
                        ? 'text-white bg-gradient-to-r from-orange-500 to-orange-600 shadow-md'
                        : 'text-white hover:text-orange-200 hover:bg-white/20 bg-white/10'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block mx-3 mt-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md text-center"
                  >
                    Đăng nhập
                  </Link>
                ) : (
                  <div className="mx-3 mt-4 pt-4 border-t border-white/20 space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-white hover:text-orange-200 hover:bg-white/20 bg-white/10 rounded-xl transition-all duration-200"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Thông tin cá nhân</span>
                    </Link>
                    
                    <Link
                      to="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 bg-white/50 rounded-xl transition-all duration-200"
                    >
                      <Settings className="w-5 h-5" />
                      <span className="font-medium">Cài đặt</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 bg-white/50 rounded-xl transition-all duration-200 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Modern Enhanced Footer */}
      <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-32 translate-y-32"></div>
        </div>
        
        <div className="relative px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
              
              {/* University Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2">
                    <img 
                      src={daiNamLogo} 
                      alt="Đại học Đại Nam" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">TRƯỜNG ĐẠI HỌC ĐẠI NAM</h3>
                    <p className="text-orange-300 font-semibold">Khoa Công nghệ Thông tin</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg mt-1">
                      <MapPin className="w-5 h-5 text-orange-300" />
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">Địa chỉ:</p>
                      <p className="text-white font-semibold">Số 1 Phố Xóm - Phú Lãm - Hà Đông - Hà Nội</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Phone className="w-5 h-5 text-orange-300" />
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">Điện thoại:</p>
                      <p className="text-white font-semibold">(024) 35577799</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Mail className="w-5 h-5 text-orange-300" />
                    </div>
                    <div>
                      <p className="text-gray-300 font-medium">Email:</p>
                      <p className="text-white font-semibold">cntt@dainam.edu.vn</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Liên kết nhanh</h3>
                <div className="grid grid-cols-1 gap-3">
                  <a href="/" className="flex items-center space-x-3 text-gray-300 hover:text-orange-300 transition-colors group">
                    <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:bg-orange-300 transition-colors"></div>
                    <span>Trang chủ</span>
                  </a>
                  <a href="/internship-registration" className="flex items-center space-x-3 text-gray-300 hover:text-orange-300 transition-colors group">
                    <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:bg-orange-300 transition-colors"></div>
                    <span>Đăng ký thực tập</span>
                  </a>
                  <a href="/student/submissions" className="flex items-center space-x-3 text-gray-300 hover:text-orange-300 transition-colors group">
                    <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:bg-orange-300 transition-colors"></div>
                    <span>Nộp báo cáo</span>
                  </a>
                  <a href="/profile" className="flex items-center space-x-3 text-gray-300 hover:text-orange-300 transition-colors group">
                    <div className="w-2 h-2 bg-orange-500 rounded-full group-hover:bg-orange-300 transition-colors"></div>
                    <span>Thông tin cá nhân</span>
                  </a>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3">Hỗ trợ</h4>
                  <div className="space-y-2">
                    {user?.role === 'sinh-vien' && (
                      <Link to="/guide/student" className="block text-gray-300 hover:text-orange-300 transition-colors">Hướng dẫn sử dụng (Sinh viên)</Link>
                    )}
                    {user?.role === 'giang-vien' && (
                      <Link to="/guide/teacher" className="block text-gray-300 hover:text-orange-300 transition-colors">Hướng dẫn sử dụng (Giảng viên)</Link>
                    )}
                    {user?.role === 'doanh-nghiep' && (
                      <Link to="/guide/company" className="block text-gray-300 hover:text-orange-300 transition-colors">Hướng dẫn sử dụng (Doanh nghiệp)</Link>
                    )}
                    <a href="#faq" className="block text-gray-300 hover:text-orange-300 transition-colors">Câu hỏi thường gặp</a>
                    <a href="#contact" className="block text-gray-300 hover:text-orange-300 transition-colors">Liên hệ hỗ trợ</a>
                  </div>
                </div>
              </div>

              {/* Interactive Map */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">Bản đồ trường học</h3>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden relative group cursor-pointer">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.0984537157387!2d105.7854287!3d20.9736842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135accef3a9d547%3A0x7bef0a5d83e7e38c!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyDEkOG6oWkgTmFt!5e0!3m2!1svi!2s!4v1701234567890!5m2!1svi!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    ></iframe>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                      <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">Xem bản đồ lớn</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-gray-300">Trường Đại học Đại Nam</span>
                    </div>
                    <a 
                      href="https://goo.gl/maps/your-university-location" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-orange-300 hover:text-orange-400 text-sm font-medium flex items-center space-x-1 transition-colors"
                    >
                      <span>Chỉ đường</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-700 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-6">
                  <p className="text-gray-400 text-sm">
                    © 2025 Khoa Công nghệ Thông tin - Đại học Đại Nam
                  </p>
                  <div className="hidden md:flex items-center space-x-4">
                    <a href="#" className="text-gray-400 hover:text-orange-300 transition-colors text-sm">Chính sách bảo mật</a>
                    <span className="text-gray-600">•</span>
                    <a href="#" className="text-gray-400 hover:text-orange-300 transition-colors text-sm">Điều khoản sử dụng</a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400 text-sm">Hệ thống Quản lý Thực tập</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">Đang hoạt động</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;