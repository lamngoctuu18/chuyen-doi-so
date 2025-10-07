import React, { useEffect, useState } from 'react';
import { Users, Star, TrendingUp, Eye, Award, Target, ChevronRight, Building2, Clock, UserPlus, Calendar, MessageCircle, Activity, Zap, Shield, Briefcase, MapPin, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

type Company = {
  id?: number;
  account_id?: number;
  ma_doanh_nghiep?: string;
  ten_cong_ty?: string;
  ten_nguoi_lien_he?: string;
  chuc_vu_nguoi_lien_he?: string;
  dia_chi_cong_ty?: string;
  so_dien_thoai?: string;
  email_cong_ty?: string;
  website?: string;
  linh_vuc_hoat_dong?: string;
  quy_mo_nhan_su?: string;
  so_nhan_vien?: string;
  mo_ta_cong_ty?: string;
  trang_thai_hop_tac?: string;
};

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  // const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      if (!user?.id) return;
  // setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/doanh-nghiep/${user.id}`,{
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCompany(data.data || null);
        }
      } catch (e) {
        console.error('Failed to load company profile', e);
      } finally {
        // setLoading(false);
      }
    };
    fetchCompany();
  }, [user?.id]);

  const companyName = company?.ten_cong_ty || user?.name || 'Doanh nghiệp';
  const companyCode = company?.ma_doanh_nghiep || (typeof user?.id === 'string' ? user?.id : `DN${user?.id || ''}`);
  const quyMo = company?.quy_mo_nhan_su || company?.so_nhan_vien || 'Chưa cập nhật';
  const linhVuc = company?.linh_vuc_hoat_dong || 'Chưa cập nhật';
  const trangThai = company?.trang_thai_hop_tac || 'Hoạt động';
  const email = company?.email_cong_ty || user?.email || 'Chưa cập nhật';
  const phone = company?.so_dien_thoai || user?.phone || 'Chưa cập nhật';
  const diaChi = company?.dia_chi_cong_ty || 'Chưa cập nhật';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Section with Company Welcome */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32 animate-pulse"></div>
          </div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl shadow-lg">
                    <Building2 className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      Chào mừng trở lại!
                    </h1>
                    <p className="text-xl text-white/90 font-medium">{companyName}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-white/80" />
                      <div>
                        <div className="text-sm text-white/70">Nhân viên</div>
                        <div className="font-bold text-white">{quyMo}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-white/80" />
                      <div>
                        <div className="text-sm text-white/70">Thành lập</div>
                        <div className="font-bold text-white">-</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-white/80" />
                      <div>
                        <div className="text-sm text-white/70">Ngành</div>
                        <div className="font-bold text-white text-xs">{linhVuc}</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-white/80" />
                      <div>
                        <div className="text-sm text-white/70">Trạng thái</div>
                        <div className="font-bold text-green-300">{trangThai}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 lg:ml-8">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-3xl font-bold text-white">{companyName?.charAt(0) || 'D'}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">{companyCode}</h3>
                    <p className="text-white/70 text-sm">Người đại diện</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white/80">{email}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-white/80">{phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">Thông tin doanh nghiệp</h2>
            <p className="text-sm text-gray-600">Chi tiết liên hệ và quy mô</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border bg-blue-50/30 border-blue-100 flex items-center">
              <div className="p-2 rounded-xl bg-blue-100 mr-3"><MapPin className="w-5 h-5 text-blue-600"/></div>
              <div>
                <div className="text-xs text-gray-500">Địa chỉ</div>
                <div className="text-gray-900 font-semibold">{diaChi}</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl border bg-emerald-50/30 border-emerald-100 flex items-center">
              <div className="p-2 rounded-xl bg-emerald-100 mr-3"><Phone className="w-5 h-5 text-emerald-600"/></div>
              <div>
                <div className="text-xs text-gray-500">Số điện thoại</div>
                <div className="text-gray-900 font-semibold">{phone}</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl border bg-purple-50/30 border-purple-100 flex items-center">
              <div className="p-2 rounded-xl bg-purple-100 mr-3"><Mail className="w-5 h-5 text-purple-600"/></div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-gray-900 font-semibold">{email}</div>
              </div>
            </div>
            <div className="p-4 rounded-2xl border bg-amber-50/30 border-amber-100 flex items-center">
              <div className="p-2 rounded-xl bg-amber-100 mr-3"><Users className="w-5 h-5 text-amber-600"/></div>
              <div>
                <div className="text-xs text-gray-500">Quy mô</div>
                <div className="text-gray-900 font-semibold">{quyMo}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/90">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">2</div>
                <div className="text-sm text-gray-600 font-semibold">Vị trí tuyển dụng</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-emerald-600 font-semibold">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Đang mở</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/90">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">18</div>
                <div className="text-sm text-gray-600 font-semibold">Đơn ứng tuyển</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-orange-600 font-semibold">
                <Clock className="h-4 w-4 mr-1" />
                <span>Chờ duyệt: 2</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/90">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">2</div>
                <div className="text-sm text-gray-600 font-semibold">Sinh viên thực tập</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-green-600 font-semibold">
                <Activity className="h-4 w-4 mr-1" />
                <span>Đang thực tập</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:bg-white/90">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">4.8</div>
                <div className="text-sm text-gray-600 font-semibold">Đánh giá</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-yellow-600 font-semibold">
                <Star className="h-4 w-4 mr-1 fill-current" />
                <span>Xuất sắc</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
            </div>
          </div>
        </div>

        {/* Quick Actions Section (removed "Tạo tin tuyển dụng" per request) */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Hành động nhanh</h2>
                <p className="text-gray-600 font-medium">Những việc bạn có thể làm ngay</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button className="group p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <ChevronRight className="w-6 h-6 text-emerald-400 group-hover:text-emerald-600 transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-emerald-600 transition-colors">Xem đơn ứng tuyển</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Duyệt và đánh giá các đơn ứng tuyển</p>
            </button>

            <button className="group p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover:border-amber-300 hover:shadow-lg transition-all duration-200 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <ChevronRight className="w-6 h-6 text-amber-400 group-hover:text-amber-600 transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-amber-600 transition-colors">Liên hệ sinh viên</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Trao đổi với sinh viên thực tập</p>
            </button>

            <button className="group p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 text-left">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <ChevronRight className="w-6 h-6 text-purple-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-purple-600 transition-colors">Thống kê & Báo cáo</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Xem báo cáo hiệu quả và phân tích dữ liệu</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;