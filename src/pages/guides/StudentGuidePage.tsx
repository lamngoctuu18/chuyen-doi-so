import React from 'react';
import { 
  FileText, 
  Upload, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Award,
  User,
  Target,
  Shield,
  Settings,
  Eye,
  Phone,
  Mail,
  GraduationCap,
  Building2,
  Laptop
} from 'lucide-react';

const StudentGuidePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32 animate-pulse"></div>
          </div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl shadow-lg">
                    <GraduationCap className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      Hướng dẫn sử dụng
                    </h1>
                    <p className="text-xl text-white/90 font-medium">Dành cho Sinh viên</p>
                    <p className="text-white/80 mt-2">Hệ thống Quản lý Thực tập - Khoa CNTT</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <div className="text-center space-y-2">
                  <User className="w-12 h-12 text-white mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">Sinh viên thực tập</div>
                  <div className="text-white/80 text-sm">Phiên bản 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-8 h-8 text-emerald-600 mr-3" />
            Mục lục nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="#getting-started" className="group p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-emerald-600" />
                <span className="font-semibold text-gray-900 group-hover:text-emerald-600">Bắt đầu sử dụng</span>
              </div>
            </a>
            <a href="#registration" className="group p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-gray-900 group-hover:text-blue-600">Đăng ký thực tập</span>
              </div>
            </a>
            <a href="#reports" className="group p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover:border-amber-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <Upload className="w-6 h-6 text-amber-600" />
                <span className="font-semibold text-gray-900 group-hover:text-amber-600">Nộp báo cáo</span>
              </div>
            </a>
            <a href="#internship-process" className="group p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <Building2 className="w-6 h-6 text-purple-600" />
                <span className="font-semibold text-gray-900 group-hover:text-purple-600">Quy trình thực tập</span>
              </div>
            </a>
            <a href="#regulations" className="group p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-2xl border border-red-200 hover:border-red-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <Shield className="w-6 h-6 text-red-600" />
                <span className="font-semibold text-gray-900 group-hover:text-red-600">Quy định</span>
              </div>
            </a>
            <a href="#faq" className="group p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-indigo-600" />
                <span className="font-semibold text-gray-900 group-hover:text-indigo-600">Câu hỏi thường gặp</span>
              </div>
            </a>
          </div>
        </div>

        {/* Getting Started Section */}
        <div id="getting-started" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Settings className="w-8 h-8 text-emerald-600 mr-3" />
            1. Bắt đầu sử dụng hệ thống
          </h2>
          
          <div className="space-y-6">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 mr-2" />
                Đăng nhập hệ thống
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>• Sử dụng mã sinh viên làm tên đăng nhập (ví dụ: SV001)</p>
                <p>• Mật khẩu mặc định: mã sinh viên + "123" (ví dụ: SV001123)</p>
                <p>• Đổi mật khẩu ngay lần đầu đăng nhập để bảo mật tài khoản</p>
                <p>• Liên hệ khoa nếu gặp vấn đề đăng nhập</p>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 text-blue-600 mr-2" />
                Giao diện chính
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Trang chủ:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Thông tin cá nhân</li>
                    <li>• Trạng thái thực tập hiện tại</li>
                    <li>• Thông báo quan trọng</li>
                    <li>• Truy cập nhanh các chức năng</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Menu chính:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Đăng ký thực tập</li>
                    <li>• Nộp báo cáo</li>
                    <li>• Thông tin cá nhân</li>
                    <li>• Lịch sử hoạt động</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Section */}
        <div id="registration" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            2. Đăng ký thực tập
          </h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                Thời gian đăng ký
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-800">Kỳ thực tập:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Kỳ 1:</strong> Tháng 1-3 (mùa xuân)</li>
                    <li>• <strong>Kỳ 2:</strong> Tháng 6-8 (mùa hè)</li>
                    <li>• <strong>Kỳ 3:</strong> Tháng 9-11 (mùa thu)</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-800">Thời hạn đăng ký:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Mở đăng ký: 1 tháng trước khi bắt đầu</li>
                    <li>• Đóng đăng ký: 2 tuần trước khi bắt đầu</li>
                    <li>• Thông báo qua email và hệ thống</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-emerald-600 mr-2" />
                Cách thức đăng ký
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-emerald-600 font-bold">1</span>
                    </div>
                    <h4 className="font-medium text-emerald-800 mb-2">Chọn vị trí</h4>
                    <p className="text-sm text-gray-700">Lựa chọn vị trí thực tập phù hợp</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-emerald-600 font-bold">2</span>
                    </div>
                    <h4 className="font-medium text-emerald-800 mb-2">Điền thông tin</h4>
                    <p className="text-sm text-gray-700">Hoàn thành form đăng ký</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-emerald-600 font-bold">3</span>
                    </div>
                    <h4 className="font-medium text-emerald-800 mb-2">Chờ duyệt</h4>
                    <p className="text-sm text-gray-700">Chờ khoa phân công</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 text-amber-600 mr-2" />
                Điều kiện đăng ký
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>• <strong>Tín chỉ tích lũy:</strong> Tối thiểu 90 tín chỉ</p>
                <p>• <strong>Điểm trung bình:</strong> GPA ≥ 2.0</p>
                <p>• <strong>Học phí:</strong> Đã hoàn thành nghĩa vụ tài chính</p>
                <p>• <strong>Kỷ luật:</strong> Không vi phạm kỷ luật nghiêm trọng</p>
                <p>• <strong>Sức khỏe:</strong> Đủ sức khỏe để tham gia thực tập</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div id="reports" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Upload className="w-8 h-8 text-amber-600 mr-3" />
            3. Nộp báo cáo thực tập
          </h2>
          
          <div className="space-y-6">
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 text-amber-600 mr-2" />
                Loại báo cáo cần nộp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-amber-800">Báo cáo hàng tuần:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Nộp mỗi tuần trong thời gian thực tập</li>
                    <li>• Mô tả công việc đã làm</li>
                    <li>• Khó khăn gặp phải và cách giải quyết</li>
                    <li>• Kỹ năng học được trong tuần</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-amber-800">Báo cáo tổng kết:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Nộp sau khi kết thúc thực tập</li>
                    <li>• Tổng quan toàn bộ quá trình</li>
                    <li>• Đánh giá bản thân</li>
                    <li>• Đề xuất cải thiện chương trình</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Upload className="w-6 h-6 text-green-600 mr-2" />
                Cách nộp báo cáo trên hệ thống
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Laptop className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-green-800 mb-2">Vào trang nộp</h4>
                    <p className="text-sm text-gray-700">Menu "Nộp báo cáo"</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-green-800 mb-2">Chọn tuần</h4>
                    <p className="text-sm text-gray-700">Tuần báo cáo tương ứng</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-green-800 mb-2">Upload file</h4>
                    <p className="text-sm text-gray-700">Chọn file báo cáo</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-medium text-green-800 mb-2">Nộp báo cáo</h4>
                    <p className="text-sm text-gray-700">Xác nhận và gửi</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Yêu cầu file báo cáo:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Định dạng: .docx, .pdf (khuyên dùng .pdf)</li>
                    <li>• Dung lượng: Tối đa 10MB</li>
                    <li>• Tên file: BaoCao_TuanX_MaSV (ví dụ: BaoCao_Tuan1_SV001.pdf)</li>
                    <li>• Nội dung: Đầy đủ theo mẫu qui định</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                <Clock className="w-6 h-6 text-red-600 mr-2" />
                Thời hạn và xử lý vi phạm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Thời hạn nộp:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Báo cáo tuần: Chủ nhật hàng tuần trước 23:59</li>
                    <li>• Báo cáo tổng kết: Trong vòng 1 tuần sau khi kết thúc</li>
                    <li>• Thông báo nhắc nhở qua email và hệ thống</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">Xử lý vi phạm:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Nộp trễ 1-3 ngày: Cảnh cáo</li>
                    <li>• Nộp trễ 4-7 ngày: Trừ điểm</li>
                    <li>• Nộp trễ &gt; 7 ngày: Phải thực tập lại</li>
                    <li>• Không nộp: Điểm F cho môn thực tập</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Internship Process Section */}
        <div id="internship-process" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Building2 className="w-8 h-8 text-purple-600 mr-3" />
            4. Quy trình thực tập
          </h2>
          
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <Target className="w-6 h-6 text-purple-600 mr-2" />
                Các bước thực hiện
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center relative">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">1</span>
                    </div>
                    <h4 className="font-medium text-purple-800 mb-2">Đăng ký</h4>
                    <p className="text-sm text-gray-700">Đăng ký vị trí thực tập mong muốn</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">2</span>
                    </div>
                    <h4 className="font-medium text-purple-800 mb-2">Phân công</h4>
                    <p className="text-sm text-gray-700">Khoa phân công doanh nghiệp và GVHD</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-medium text-purple-800 mb-2">Thực tập</h4>
                    <p className="text-sm text-gray-700">Làm việc tại doanh nghiệp 8-12 tuần</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">4</span>
                    </div>
                    <h4 className="font-medium text-purple-800 mb-2">Báo cáo</h4>
                    <p className="text-sm text-gray-700">Nộp báo cáo tuần và tổng kết</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">5</span>
                    </div>
                    <h4 className="font-medium text-purple-800 mb-2">Đánh giá</h4>
                    <p className="text-sm text-gray-700">Nhận điểm từ DN và GVHD</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Award className="w-6 h-6 text-blue-600 mr-2" />
                Tiêu chí đánh giá sinh viên
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Doanh nghiệp (40%)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Thái độ làm việc</li>
                    <li>• Kỹ năng chuyên môn</li>
                    <li>• Kết quả công việc</li>
                    <li>• Tương tác với đồng nghiệp</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Giảng viên (40%)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Chất lượng báo cáo</li>
                    <li>• Tính đầy đủ, kịp thời</li>
                    <li>• Khả năng phân tích</li>
                    <li>• Thái độ học tập</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Tự đánh giá (20%)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Báo cáo tổng kết</li>
                    <li>• Phân tích bản thân</li>
                    <li>• Kế hoạch phát triển</li>
                    <li>• Đóng góp ý kiến</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regulations Section */}
        <div id="regulations" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-8 h-8 text-red-600 mr-3" />
            5. Quy định và kỷ luật
          </h2>
          
          <div className="space-y-6">
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                Nghĩa vụ của sinh viên
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-red-800">Trong thời gian thực tập:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Tuân thủ nội quy của doanh nghiệp</li>
                    <li>• Có mặt đầy đủ theo lịch làm việc</li>
                    <li>• Thực hiện nhiệm vụ được giao</li>
                    <li>• Báo cáo đầy đủ, kịp thời</li>
                    <li>• Giữ bí mật thông tin công ty</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-red-800">Với giảng viên hướng dẫn:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Liên hệ thường xuyên</li>
                    <li>• Báo cáo tiến độ hàng tuần</li>
                    <li>• Xin ý kiến khi gặp khó khăn</li>
                    <li>• Tham gia đầy đủ các buổi hướng dẫn</li>
                    <li>• Tôn trọng sự chỉ đạo của GVHD</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                <Clock className="w-6 h-6 text-orange-600 mr-2" />
                Các hành vi bị nghiêm cấm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-orange-800 mb-2">Vi phạm nghiêm trọng:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Vắng mặt không phép &gt; 3 ngày</li>
                    <li>• Tiết lộ bí mật công ty</li>
                    <li>• Có hành vi thiếu đạo đức</li>
                    <li>• Không tuân thủ nội quy</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-orange-800 mb-2">Xử lý vi phạm:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Cảnh cáo và nhắc nhở</li>
                    <li>• Trừ điểm thực tập</li>
                    <li>• Kết thúc thực tập sớm</li>
                    <li>• Phải thực tập lại</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <AlertTriangle className="w-8 h-8 text-indigo-600 mr-3" />
            6. Câu hỏi thường gặp
          </h2>
          
          <div className="space-y-4">
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">❓ Tôi có thể thay đổi vị trí thực tập sau khi đăng ký không?</h3>
              <p className="text-gray-700">Bạn có thể thay đổi trong thời gian mở đăng ký. Sau khi đóng đăng ký, chỉ có thể thay đổi trong trường hợp đặc biệt với sự đồng ý của khoa.</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">❓ Nếu tôi ốm không thể đi thực tập thì phải làm sao?</h3>
              <p className="text-gray-700">Liên hệ ngay với giảng viên hướng dẫn và doanh nghiệp. Nếu nghỉ dài hạn, có thể xin chuyển kỳ thực tập khác với giấy tờ y tế đầy đủ.</p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">❓ Tôi có được nhận lương khi thực tập không?</h3>
              <p className="text-gray-700">Tùy thuộc vào chính sách của từng doanh nghiệp. Một số công ty có hỗ trợ phụ cấp ăn trưa, đi lại. Thông tin này sẽ được thông báo khi phân công.</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">❓ Sau thực tập, tôi có cơ hội được tuyển dụng chính thức không?</h3>
              <p className="text-gray-700">Nhiều doanh nghiệp có chính sách tuyển dụng sinh viên thực tập giỏi. Hãy thể hiện tốt trong thời gian thực tập để tạo ấn tượng với nhà tuyển dụng.</p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">❓ Tôi quên nộp báo cáo đúng hạn, có được nộp bù không?</h3>
              <p className="text-gray-700">Có thể nộp bù nhưng sẽ bị trừ điểm. Nếu có lý do chính đáng (ốm đau, hoàn cảnh khó khăn), hãy liên hệ GVHD để xin xem xét đặc biệt.</p>
            </div>

            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">❓ Nếu tôi không hài lòng với doanh nghiệp thực tập thì sao?</h3>
              <p className="text-gray-700">Hãy trao đổi với giảng viên hướng dẫn trước. Nếu vấn đề nghiêm trọng, khoa sẽ xem xét chuyển doanh nghiệp khác trong trường hợp cần thiết.</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl shadow-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ thêm?</h2>
          <p className="text-emerald-100 mb-6">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:02435577799" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Gọi điện thoại</span>
            </a>
            <a href="mailto:cntt@dainam.edu.vn" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Gửi email</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGuidePage;