import React from 'react';
import { 
  Users, 
  FileCheck, 
  Star, 
  MessageCircle, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Award,
  Settings,
  Eye,
  Search,
  MessageSquare,
  Phone,
  Mail,
  GraduationCap,
  UserCheck,
  ClipboardList,
  Target,
  Shield,
  Laptop,
  TrendingUp
} from 'lucide-react';

const TeacherGuidePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32 animate-pulse"></div>
          </div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl shadow-lg">
                    <UserCheck className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      Hướng dẫn sử dụng
                    </h1>
                    <p className="text-xl text-white/90 font-medium">Dành cho Giảng viên</p>
                    <p className="text-white/80 mt-2">Hệ thống Quản lý Thực tập - Khoa CNTT</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <div className="text-center space-y-2">
                  <GraduationCap className="w-12 h-12 text-white mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">Giảng viên hướng dẫn</div>
                  <div className="text-white/80 text-sm">Phiên bản 2025</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-8 h-8 text-blue-600 mr-3" />
            Mục lục nhanh
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a href="#getting-started" className="group p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <Settings className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-gray-900 group-hover:text-blue-600">Bắt đầu sử dụng</span>
              </div>
            </a>
            <a href="#student-management" className="group p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-emerald-600" />
                <span className="font-semibold text-gray-900 group-hover:text-emerald-600">Quản lý sinh viên</span>
              </div>
            </a>
            <a href="#evaluation" className="group p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover:border-amber-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6 text-amber-600" />
                <span className="font-semibold text-gray-900 group-hover:text-amber-600">Đánh giá báo cáo</span>
              </div>
            </a>
            <a href="#batch-management" className="group p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <ClipboardList className="w-6 h-6 text-purple-600" />
                <span className="font-semibold text-gray-900 group-hover:text-purple-600">Quản lý đợt nộp</span>
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
            <Settings className="w-8 h-8 text-blue-600 mr-3" />
            1. Bắt đầu sử dụng hệ thống
          </h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-blue-600 mr-2" />
                Đăng nhập hệ thống
              </h3>
              <div className="space-y-3 text-gray-700">
                <p>• Sử dụng mã giảng viên làm tên đăng nhập (ví dụ: GV001)</p>
                <p>• Mật khẩu mặc định: mã giảng viên + "123" (ví dụ: GV001123)</p>
                <p>• Đổi mật khẩu ngay lần đầu đăng nhập để bảo mật tài khoản</p>
                <p>• Liên hệ IT khoa nếu gặp vấn đề đăng nhập</p>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 text-indigo-600 mr-2" />
                Giao diện chính của giảng viên
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-indigo-800">Dashboard:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Tổng quan sinh viên được phân công</li>
                    <li>• Thống kê tiến độ nộp báo cáo</li>
                    <li>• Thông báo hệ thống</li>
                    <li>• Truy cập nhanh các chức năng</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-indigo-800">Menu chính:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Quản lý sinh viên</li>
                    <li>• Đánh giá báo cáo</li>
                    <li>• Quản lý đợt nộp</li>
                    <li>• Báo cáo thống kê</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <UserCheck className="w-6 h-6 text-green-600 mr-2" />
                Vai trò và trách nhiệm
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Trách nhiệm chính:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Hướng dẫn sinh viên thực tập</li>
                    <li>• Đánh giá báo cáo hàng tuần</li>
                    <li>• Theo dõi tiến độ thực tập</li>
                    <li>• Liên lạc với doanh nghiệp</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Quyền hạn:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Chấm điểm báo cáo sinh viên</li>
                    <li>• Tạo và quản lý đợt nộp</li>
                    <li>• Xem thông tin doanh nghiệp</li>
                    <li>• Xuất báo cáo thống kê</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Management Section */}
        <div id="student-management" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Users className="w-8 h-8 text-emerald-600 mr-3" />
            2. Quản lý sinh viên thực tập
          </h2>
          
          <div className="space-y-6">
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 text-emerald-600 mr-2" />
                Xem danh sách sinh viên
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Laptop className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="font-medium text-emerald-800 mb-2">Truy cập</h4>
                    <p className="text-sm text-gray-700">Menu "Quản lý sinh viên"</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="font-medium text-emerald-800 mb-2">Tìm kiếm</h4>
                    <p className="text-sm text-gray-700">Lọc theo tên, mã SV</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Eye className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="font-medium text-emerald-800 mb-2">Xem chi tiết</h4>
                    <p className="text-sm text-gray-700">Click vào từng sinh viên</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-emerald-800 mb-2">Thông tin hiển thị:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <ul className="space-y-1">
                      <li>• Mã sinh viên và họ tên</li>
                      <li>• Doanh nghiệp thực tập</li>
                      <li>• Thời gian thực tập</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• Số báo cáo đã nộp</li>
                      <li>• Trạng thái thực tập</li>
                      <li>• Điểm trung bình hiện tại</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
                Giao tiếp với sinh viên
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Kênh liên lạc:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Thông báo qua hệ thống</li>
                    <li>• Email cá nhân</li>
                    <li>• Điện thoại (khi cần thiết)</li>
                    <li>• Gặp mặt trực tiếp</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Nội dung hướng dẫn:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Cách viết báo cáo chất lượng</li>
                    <li>• Giải đáp thắc mắc kỹ thuật</li>
                    <li>• Tư vấn phát triển nghề nghiệp</li>
                    <li>• Hỗ trợ giải quyết khó khăn</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 text-purple-600 mr-2" />
                Theo dõi tiến độ
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2">Các chỉ số cần theo dõi:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div>
                      <h5 className="font-medium text-purple-700 mb-1">Tần suất nộp báo cáo:</h5>
                      <ul className="space-y-1">
                        <li>• Đúng hạn / Trễ hạn</li>
                        <li>• Tỷ lệ hoàn thành</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-purple-700 mb-1">Chất lượng báo cáo:</h5>
                      <ul className="space-y-1">
                        <li>• Nội dung chi tiết</li>
                        <li>• Tính logic, mạch lạc</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-purple-700 mb-1">Thái độ học tập:</h5>
                      <ul className="space-y-1">
                        <li>• Tương tác với GVHD</li>
                        <li>• Chủ động học hỏi</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Section */}
        <div id="evaluation" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="w-8 h-8 text-amber-600 mr-3" />
            3. Đánh giá báo cáo thực tập
          </h2>
          
          <div className="space-y-6">
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                <FileCheck className="w-6 h-6 text-amber-600 mr-2" />
                Quy trình chấm điểm
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-amber-600 font-bold">1</span>
                    </div>
                    <h4 className="font-medium text-amber-800 mb-2">Nhận báo cáo</h4>
                    <p className="text-sm text-gray-700">Sinh viên nộp qua hệ thống</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-amber-600 font-bold">2</span>
                    </div>
                    <h4 className="font-medium text-amber-800 mb-2">Đọc và đánh giá</h4>
                    <p className="text-sm text-gray-700">Chấm theo tiêu chí</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-amber-600 font-bold">3</span>
                    </div>
                    <h4 className="font-medium text-amber-800 mb-2">Cho điểm</h4>
                    <p className="text-sm text-gray-700">Nhập điểm vào hệ thống</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-amber-600 font-bold">4</span>
                    </div>
                    <h4 className="font-medium text-amber-800 mb-2">Góp ý</h4>
                    <p className="text-sm text-gray-700">Phản hồi để cải thiện</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Award className="w-6 h-6 text-blue-600 mr-2" />
                Tiêu chí đánh giá báo cáo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Nội dung (40%):</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Mô tả công việc chi tiết, rõ ràng</li>
                      <li>• Phân tích kết quả đạt được</li>
                      <li>• Nhận định về khó khăn gặp phải</li>
                      <li>• Đề xuất giải pháp cải thiện</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Kỹ năng (30%):</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Kỹ năng chuyên môn áp dụng</li>
                      <li>• Khả năng tự học, nghiên cứu</li>
                      <li>• Kỹ năng làm việc nhóm</li>
                      <li>• Kỹ năng giao tiếp, thuyết trình</li>
                    </ul>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Hình thức (20%):</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Cấu trúc báo cáo logic</li>
                      <li>• Ngôn ngữ viết chính xác</li>
                      <li>• Trình bày gọn gàng, rõ ràng</li>
                      <li>• Tuân thủ định dạng yêu cầu</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">Thái độ (10%):</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Nộp đúng hạn</li>
                      <li>• Tương tác tích cực với GVHD</li>
                      <li>• Tinh thần học hỏi</li>
                      <li>• Trách nhiệm với công việc</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <MessageSquare className="w-6 h-6 text-green-600 mr-2" />
                Cách cho điểm trên hệ thống
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Bước thực hiện:</h4>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li>1. Vào menu "Đánh giá báo cáo" → Chọn sinh viên</li>
                    <li>2. Click vào báo cáo cần chấm điểm</li>
                    <li>3. Đọc kỹ nội dung báo cáo</li>
                    <li>4. Nhập điểm từng tiêu chí (thang điểm 10)</li>
                    <li>5. Viết nhận xét chi tiết</li>
                    <li>6. Lưu điểm - hệ thống sẽ thông báo cho sinh viên</li>
                  </ol>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Thang điểm:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• <strong>9-10:</strong> Xuất sắc</li>
                      <li>• <strong>8-8.9:</strong> Giỏi</li>
                      <li>• <strong>7-7.9:</strong> Khá</li>
                      <li>• <strong>6-6.9:</strong> Trung bình khá</li>
                      <li>• <strong>5-5.9:</strong> Trung bình</li>
                      <li>• <strong>&lt;5:</strong> Yếu, cần cải thiện</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-green-800 mb-2">Lưu ý khi chấm:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Đánh giá khách quan, công bằng</li>
                      <li>• Cho điểm phù hợp với chất lượng</li>
                      <li>• Viết nhận xét chi tiết, cụ thể</li>
                      <li>• Khuyến khích tinh thần học tập</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Management Section */}
        <div id="batch-management" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <ClipboardList className="w-8 h-8 text-purple-600 mr-3" />
            4. Quản lý đợt nộp báo cáo
          </h2>
          
          <div className="space-y-6">
            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                <Calendar className="w-6 h-6 text-purple-600 mr-2" />
                Tạo đợt nộp mới
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">1</span>
                    </div>
                    <h4 className="font-medium text-purple-800 mb-2">Vào menu</h4>
                    <p className="text-sm text-gray-700">"Quản lý đợt nộp"</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">2</span>
                    </div>
                    <h4 className="font-medium text-purple-800 mb-2">Tạo đợt mới</h4>
                    <p className="text-sm text-gray-700">Click "Tạo đợt nộp"</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-purple-600 font-bold">3</span>
                    </div>
                    <h4 className="font-medium text-purple-800 mb-2">Điền thông tin</h4>
                    <p className="text-sm text-gray-700">Hoàn thành form</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-purple-800 mb-2">Thông tin cần điền:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                    <ul className="space-y-1">
                      <li>• <strong>Tên đợt nộp:</strong> Ví dụ "Báo cáo tuần 1"</li>
                      <li>• <strong>Mô tả:</strong> Yêu cầu cụ thể cho đợt nộp</li>
                      <li>• <strong>Ngày bắt đầu:</strong> Khi sinh viên có thể nộp</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• <strong>Hạn cuối:</strong> Thời hạn nộp báo cáo</li>
                      <li>• <strong>Loại báo cáo:</strong> Tuần/Tháng/Tổng kết</li>
                      <li>• <strong>Ghi chú:</strong> Hướng dẫn bổ sung</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Settings className="w-6 h-6 text-blue-600 mr-2" />
                Quản lý đợt nộp hiện có
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Các thao tác có thể:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Chỉnh sửa thông tin đợt nộp</li>
                    <li>• Gia hạn thời gian nộp</li>
                    <li>• Xem danh sách sinh viên đã nộp</li>
                    <li>• Gửi thông báo nhắc nhở</li>
                    <li>• Đóng/Mở đợt nộp</li>
                    <li>• Xóa đợt nộp (nếu chưa có SV nộp)</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Thông tin theo dõi:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Số lượng sinh viên đã nộp</li>
                    <li>• Số lượng sinh viên chưa nộp</li>
                    <li>• Tỷ lệ hoàn thành (%)</li>
                    <li>• Danh sách sinh viên trễ hạn</li>
                    <li>• Trạng thái đợt nộp</li>
                    <li>• Thời gian còn lại</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 text-orange-600 mr-2" />
                Xử lý sinh viên nộp trễ
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-orange-800 mb-2">Quy trình xử lý:</h4>
                  <ol className="text-sm text-gray-700 space-y-2">
                    <li>1. <strong>Nhắc nhở:</strong> Gửi thông báo qua hệ thống/email</li>
                    <li>2. <strong>Liên hệ trực tiếp:</strong> Gọi điện hoặc gặp mặt</li>
                    <li>3. <strong>Tìm hiểu nguyên nhân:</strong> Có khó khăn gì cản trở</li>
                    <li>4. <strong>Đưa ra giải pháp:</strong> Gia hạn có điều kiện hoặc hỗ trợ</li>
                    <li>5. <strong>Báo cáo khoa:</strong> Nếu vi phạm nghiêm trọng</li>
                  </ol>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-2">Nguyên nhân phổ biến:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Quá tải công việc tại công ty</li>
                      <li>• Không biết cách viết báo cáo</li>
                      <li>• Vấn đề cá nhân, gia đình</li>
                      <li>• Thiếu động lực học tập</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-orange-800 mb-2">Giải pháp hỗ trợ:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Hướng dẫn cách viết báo cáo</li>
                      <li>• Linh hoạt về thời gian nộp</li>
                      <li>• Tư vấn, động viên tinh thần</li>
                      <li>• Liên hệ doanh nghiệp hỗ trợ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regulations Section */}
        <div id="regulations" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-8 h-8 text-red-600 mr-3" />
            5. Quy định và trách nhiệm
          </h2>
          
          <div className="space-y-6">
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-red-600 mr-2" />
                Trách nhiệm của giảng viên hướng dẫn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-red-800">Với sinh viên:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Hướng dẫn quy trình thực tập từ A-Z</li>
                    <li>• Theo dõi tiến độ và chất lượng học tập</li>
                    <li>• Đánh giá báo cáo khách quan, công bằng</li>
                    <li>• Hỗ trợ giải quyết khó khăn, vướng mắc</li>
                    <li>• Tư vấn phát triển nghề nghiệp</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-red-800">Với khoa:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Báo cáo tình hình thực tập định kỳ</li>
                    <li>• Phản ánh vấn đề từ sinh viên/doanh nghiệp</li>
                    <li>• Tham gia họp, tập huấn của khoa</li>
                    <li>• Đóng góp ý kiến cải thiện chương trình</li>
                    <li>• Tuân thủ quy chế, quy định của trường</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Clock className="w-6 h-6 text-blue-600 mr-2" />
                Thời gian và mức độ hướng dẫn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Thời gian hướng dẫn:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>Trước thực tập:</strong> 2-4 tiếng</li>
                    <li>• <strong>Trong thực tập:</strong> 1-2 tiếng/tuần</li>
                    <li>• <strong>Cuối thực tập:</strong> 2-3 tiếng</li>
                    <li>• <strong>Tổng thời gian:</strong> 15-20 tiếng/sinh viên</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Hình thức hướng dẫn:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Gặp mặt trực tiếp tại trường</li>
                    <li>• Trao đổi qua điện thoại, email</li>
                    <li>• Hướng dẫn nhóm (nếu có nhiều SV)</li>
                    <li>• Tham quan doanh nghiệp (nếu cần)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <Award className="w-6 h-6 text-green-600 mr-2" />
                Tiêu chuẩn đánh giá giảng viên
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Chất lượng hướng dẫn:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Tỷ lệ sinh viên đạt yêu cầu</li>
                    <li>• Phản hồi tích cực từ sinh viên</li>
                    <li>• Kết quả đánh giá của doanh nghiệp</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Thái độ làm việc:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Tận tình, chu đáo với sinh viên</li>
                    <li>• Chủ động liên lạc, theo dõi</li>
                    <li>• Hỗ trợ kịp thời khi có vấn đề</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Báo cáo khoa:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Đầy đủ, kịp thời</li>
                    <li>• Chính xác, chi tiết</li>
                    <li>• Đóng góp ý kiến xây dựng</li>
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
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">❓ Tôi được phân công bao nhiêu sinh viên hướng dẫn?</h3>
              <p className="text-gray-700">Thông thường mỗi giảng viên hướng dẫn 8-12 sinh viên/kỳ, tùy thuộc vào số lượng sinh viên đăng ký và số giảng viên tham gia. Khoa sẽ phân công cụ thể qua email.</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">❓ Sinh viên không liên lạc được hoặc biến mất thì xử lý sao?</h3>
              <p className="text-gray-700">Hãy thử liên lạc qua nhiều kênh (email, điện thoại, hệ thống). Nếu không được, báo ngay cho khoa để xác minh tình hình và có biện pháp xử lý kịp thời.</p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">❓ Có cần thiết phải đến thăm doanh nghiệp không?</h3>
              <p className="text-gray-700">Không bắt buộc nhưng được khuyến khích, đặc biệt khi sinh viên gặp khó khăn hoặc có khiếu nại từ doanh nghiệp. Việc thăm trường sẽ giúp hiểu rõ hơn về môi trường làm việc.</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">❓ Sinh viên muốn đổi doanh nghiệp giữa chừng thì có được không?</h3>
              <p className="text-gray-700">Chỉ trong trường hợp đặc biệt (doanh nghiệp vi phạm, môi trường không phù hợp, vấn đề sức khỏe...). Cần có báo cáo chi tiết và sự đồng ý của khoa.</p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">❓ Làm thế nào để động viên sinh viên học kém hoặc thiếu động lực?</h3>
              <p className="text-gray-700">Tìm hiểu nguyên nhân (khó khăn gia đình, áp lực công việc...), tư vấn cụ thể về cách cải thiện, đặt mục tiêu nhỏ dễ đạt, và thường xuyên khuyến khích, động viên.</p>
            </div>

            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">❓ Doanh nghiệp phàn nàn về sinh viên thì xử lý ra sao?</h3>
              <p className="text-gray-700">Lắng nghe ý kiến doanh nghiệp, xác minh thông tin với sinh viên, tìm ra nguyên nhân và giải pháp. Nếu lỗi từ sinh viên, hãy nhắc nhở và hướng dẫn cải thiện.</p>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">❓ Có được sửa điểm sau khi đã chấm không?</h3>
              <p className="text-gray-700">Có thể sửa trong vòng 3 ngày sau khi chấm nếu phát hiện sai sót. Sau thời gian này, cần có lý do chính đáng và sự đồng ý của trưởng khoa.</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ kỹ thuật?</h2>
          <p className="text-blue-100 mb-6">Đội ngũ IT khoa luôn sẵn sàng hỗ trợ giảng viên sử dụng hệ thống</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:02435577799" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
              <Phone className="w-5 h-5" />
              <span>Gọi hotline</span>
            </a>
            <a href="mailto:it-support@cntt.dainam.edu.vn" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Email hỗ trợ</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherGuidePage;