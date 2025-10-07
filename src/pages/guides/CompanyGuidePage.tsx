import React from 'react';
import { 
  Users, 
  Star, 
  MessageSquare, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Award,
  BookOpen,
  Target,
  Shield,
  Settings,
  Eye,
  Download,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';

const CompanyGuidePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32 animate-pulse"></div>
          </div>
          
          <div className="relative p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-6 lg:space-y-0">
              <div className="flex-1 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl shadow-lg">
                    <BookOpen className="h-12 w-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                      Hướng dẫn sử dụng
                    </h1>
                    <p className="text-xl text-white/90 font-medium">Dành cho Doanh nghiệp</p>
                    <p className="text-white/80 mt-2">Hệ thống Quản lý Thực tập - Khoa CNTT</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
                <div className="text-center space-y-2">
                  <Shield className="w-12 h-12 text-white mx-auto mb-2" />
                  <div className="text-lg font-bold text-white">Quy định & Hướng dẫn</div>
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
            <a href="#getting-started" className="group p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
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
                <span className="font-semibold text-gray-900 group-hover:text-amber-600">Đánh giá sinh viên</span>
              </div>
            </a>
            <a href="#communication" className="group p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                <span className="font-semibold text-gray-900 group-hover:text-purple-600">Liên hệ & Hỗ trợ</span>
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
                <p>• Sử dụng mã doanh nghiệp được cấp bởi khoa (ví dụ: DN044)</p>
                <p>• Mật khẩu mặc định: mã doanh nghiệp + "123" (ví dụ: DN044123)</p>
                <p>• Đổi mật khẩu ngay lần đầu đăng nhập để đảm bảo bảo mật</p>
                <div className="bg-white rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-amber-700">Lưu ý:</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">Liên hệ khoa nếu chưa có tài khoản hoặc quên mật khẩu</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                <Eye className="w-6 h-6 text-emerald-600 mr-2" />
                Làm quen với giao diện
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-emerald-800">Trang chủ:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Thông tin doanh nghiệp</li>
                    <li>• Thống kê sinh viên thực tập</li>
                    <li>• Truy cập nhanh các chức năng</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-emerald-800">Sinh viên thực tập:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Danh sách sinh viên được phân công</li>
                    <li>• Đánh giá và chấm điểm</li>
                    <li>• Gửi nhận xét cho giảng viên</li>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                  <Eye className="w-6 h-6 text-emerald-600 mr-2" />
                  Xem thông tin sinh viên
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>• <strong>Thông tin cá nhân:</strong> Họ tên, mã sinh viên, lớp, liên hệ</p>
                  <p>• <strong>Thông tin thực tập:</strong> Vị trí, thời gian, giảng viên hướng dẫn</p>
                  <p>• <strong>Trạng thái:</strong> Đã phân công, đang thực tập, hoàn thành</p>
                  <p>• <strong>Ghi chú:</strong> Yêu cầu đặc biệt từ sinh viên</p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                  Theo dõi tiến độ
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>• Kiểm tra ngày bắt đầu và kết thúc thực tập</p>
                  <p>• Theo dõi trạng thái làm việc hàng ngày</p>
                  <p>• Ghi nhận sự có mặt và thái độ làm việc</p>
                  <p>• Báo cáo vấn đề nếu có (vắng mặt, vi phạm...)</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <MessageSquare className="w-6 h-6 text-purple-600 mr-2" />
                  Liên hệ và hướng dẫn
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>• <strong>Hướng dẫn công việc:</strong> Phân công nhiệm vụ cụ thể</p>
                  <p>• <strong>Phản hồi:</strong> Đưa ra ý kiến về kết quả làm việc</p>
                  <p>• <strong>Hỗ trợ:</strong> Giải đáp thắc mắc, hướng dẫn kỹ năng</p>
                  <p>• <strong>Liên hệ khẩn cấp:</strong> Qua điện thoại hoặc email</p>
                </div>
              </div>

              <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 text-amber-600 mr-2" />
                  Quản lý thời gian
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>• <strong>Giờ làm việc:</strong> 8:00 - 17:00 (có thể linh hoạt)</p>
                  <p>• <strong>Nghỉ phép:</strong> Sinh viên cần xin phép trước</p>
                  <p>• <strong>Gia hạn:</strong> Thông báo khoa nếu cần kéo dài thời gian</p>
                  <p>• <strong>Kết thúc sớm:</strong> Báo cáo lý do và xin phép khoa</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Section */}
        <div id="evaluation" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="w-8 h-8 text-amber-600 mr-3" />
            3. Đánh giá sinh viên thực tập
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                <Award className="w-6 h-6 text-amber-600 mr-2" />
                Tiêu chí đánh giá
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-amber-800">Thái độ làm việc (30%):</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Chủ động, tích cực trong công việc</li>
                    <li>• Tương tác tốt với đồng nghiệp</li>
                    <li>• Tuân thủ quy định công ty</li>
                    <li>• Tinh thần trách nhiệm cao</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-amber-800">Năng lực chuyên môn (40%):</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Kiến thức cơ bản về ngành</li>
                    <li>• Khả năng học hỏi và tiếp thu</li>
                    <li>• Kỹ năng thực hành</li>
                    <li>• Tư duy giải quyết vấn đề</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-amber-800">Kết quả công việc (30%):</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Hoàn thành nhiệm vụ được giao</li>
                    <li>• Chất lượng sản phẩm/dịch vụ</li>
                    <li>• Đúng tiến độ yêu cầu</li>
                    <li>• Đóng góp cho dự án/bộ phận</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-amber-800">Thang điểm:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• <strong>9.0 - 10.0:</strong> Xuất sắc</li>
                    <li>• <strong>8.0 - 8.9:</strong> Giỏi</li>
                    <li>• <strong>7.0 - 7.9:</strong> Khá</li>
                    <li>• <strong>6.0 - 6.9:</strong> Trung bình</li>
                    <li>• <strong>&lt; 6.0:</strong> Yếu</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                Cách thức đánh giá trên hệ thống
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-800">Bước 1: Chấm điểm</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Vào trang "Sinh viên thực tập"</li>
                    <li>• Nhập điểm số từ 0-10 cho từng sinh viên</li>
                    <li>• Hệ thống tự động lưu khi nhập xong</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-green-800">Bước 2: Viết nhận xét</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Mô tả chi tiết về thái độ, năng lực</li>
                    <li>• Nêu những điểm mạnh, điểm cần cải thiện</li>
                    <li>• Đề xuất hướng phát triển cho sinh viên</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-green-800">Bước 3: Gửi đánh giá</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Kiểm tra lại thông tin trước khi gửi</li>
                    <li>• Bấm "Gửi tất cả nhận xét cho GVHD"</li>
                    <li>• Giảng viên sẽ nhận được thông báo</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-green-800">Thời hạn đánh giá</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Trong vòng 1 tuần sau khi kết thúc thực tập</li>
                    <li>• Có thể cập nhật trước thời hạn cuối</li>
                    <li>• Liên hệ khoa nếu cần gia hạn đặc biệt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Section */}
        <div id="communication" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageSquare className="w-8 h-8 text-purple-600 mr-3" />
            4. Liên hệ và hỗ trợ
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                  <Phone className="w-6 h-6 text-purple-600 mr-2" />
                  Thông tin liên hệ
                </h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">Khoa Công nghệ Thông tin:</h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>📞 Điện thoại: (024) 35577799</p>
                      <p>📧 Email: cntt@dainam.edu.vn</p>
                      <p>📍 Địa chỉ: Số 1 Phố Xóm - Phú Lãm - Hà Đông - Hà Nội</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-medium text-purple-800 mb-2">Phòng Quan hệ Doanh nghiệp:</h4>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>📞 Hotline: 0912 345 678</p>
                      <p>📧 Email: qhdn@dainam.edu.vn</p>
                      <p>⏰ Giờ làm việc: 8:00 - 17:00 (T2-T6)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <Mail className="w-6 h-6 text-blue-600 mr-2" />
                  Hỗ trợ kỹ thuật
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>• <strong>Đăng nhập:</strong> Quên mật khẩu, lỗi tài khoản</p>
                  <p>• <strong>Sử dụng hệ thống:</strong> Hướng dẫn chi tiết các chức năng</p>
                  <p>• <strong>Lỗi kỹ thuật:</strong> Không tải được trang, lỗi hiển thị</p>
                  <p>• <strong>Đánh giá:</strong> Hướng dẫn chấm điểm, viết nhận xét</p>
                </div>
                <div className="bg-white rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-green-700">Thời gian phản hồi:</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">Trong vòng 2-4 giờ làm việc</p>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
                <h3 className="text-lg font-semibold text-emerald-900 mb-4 flex items-center">
                  <Download className="w-6 h-6 text-emerald-600 mr-2" />
                  Tài liệu hướng dẫn
                </h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-emerald-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-900">Hướng dẫn sử dụng hệ thống.pdf</span>
                    </div>
                    <Download className="w-4 h-4 text-emerald-600" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-emerald-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-900">Quy định thực tập.pdf</span>
                    </div>
                    <Download className="w-4 h-4 text-emerald-600" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-emerald-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-900">Mẫu đánh giá sinh viên.docx</span>
                    </div>
                    <Download className="w-4 h-4 text-emerald-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regulations Section */}
        <div id="regulations" className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-8 h-8 text-red-600 mr-3" />
            5. Quy định và chính sách
          </h2>
          
          <div className="space-y-6">
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                Quy định chung về thực tập
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-red-800">Thời gian thực tập:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Tối thiểu 8 tuần (320 giờ)</li>
                    <li>• Tối đa 12 tuần (480 giờ)</li>
                    <li>• 8 giờ/ngày, 5 ngày/tuần</li>
                    <li>• Linh hoạt theo yêu cầu doanh nghiệp</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-red-800">Trách nhiệm của doanh nghiệp:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Phân công mentor hướng dẫn</li>
                    <li>• Cung cấp môi trường làm việc phù hợp</li>
                    <li>• Đánh giá sinh viên khách quan</li>
                    <li>• Báo cáo tình hình thực tập với khoa</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-red-800">Quyền của doanh nghiệp:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Yêu cầu sinh viên tuân thủ nội quy</li>
                    <li>• Đánh giá và góp ý về sinh viên</li>
                    <li>• Kết thúc hợp tác nếu vi phạm nghiêm trọng</li>
                    <li>• Tuyển dụng sinh viên sau thực tập</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-red-800">Xử lý vi phạm:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Cảnh cáo lần đầu</li>
                    <li>• Báo cáo khoa lần thứ 2</li>
                    <li>• Kết thúc thực tập nếu vi phạm nghiêm trọng</li>
                    <li>• Sinh viên phải thực tập lại</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                <Clock className="w-6 h-6 text-amber-600 mr-2" />
                Quy định về đánh giá
              </h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">Thời hạn đánh giá:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Trong vòng 1 tuần sau khi sinh viên kết thúc thực tập</li>
                    <li>• Có thể đánh giá sớm nếu sinh viên kết thúc trước thời hạn</li>
                    <li>• Liên hệ khoa nếu cần gia hạn đặc biệt</li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">Nội dung đánh giá bắt buộc:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Điểm số từ 0-10 (bắt buộc)</li>
                    <li>• Nhận xét chi tiết về thái độ, năng lực</li>
                    <li>• Đề xuất cải thiện cho sinh viên</li>
                    <li>• Đánh giá khả năng làm việc trong tương lai</li>
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
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">❓ Tôi quên mật khẩu đăng nhập, phải làm sao?</h3>
              <p className="text-gray-700">Liên hệ trực tiếp với khoa CNTT qua email cntt@dainam.edu.vn hoặc điện thoại (024) 35577799 để được hỗ trợ reset mật khẩu.</p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">❓ Sinh viên của tôi vắng mặt nhiều, tôi có thể làm gì?</h3>
              <p className="text-gray-700">Bạn có thể liên hệ trực tiếp với giảng viên hướng dẫn của sinh viên đó hoặc báo cáo với khoa. Hệ thống có ghi nhận thông tin liên hệ của GVHD.</p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-900 mb-4">❓ Tôi có thể chỉnh sửa đánh giá sau khi đã gửi không?</h3>
              <p className="text-gray-700">Sau khi gửi, bạn không thể tự chỉnh sửa. Nếu cần thay đổi, hãy liên hệ với khoa để được hỗ trợ cập nhật thông tin đánh giá.</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">❓ Làm thế nào để tuyển dụng sinh viên sau thực tập?</h3>
              <p className="text-gray-700">Bạn có thể liên hệ trực tiếp với sinh viên hoặc thông qua khoa để có thông tin chi tiết về quy trình tuyển dụng và các thủ tục cần thiết.</p>
            </div>

            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">❓ Tôi muốn đề xuất cải tiến chương trình thực tập?</h3>
              <p className="text-gray-700">Khoa rất hoan nghênh các ý kiến đóng góp. Bạn có thể gửi email đề xuất tới cntt@dainam.edu.vn hoặc phản hồi qua hệ thống.</p>
            </div>

            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">❓ Sinh viên vi phạm nghiêm trọng nội quy công ty?</h3>
              <p className="text-gray-700">Hãy liên hệ ngay với khoa và giảng viên hướng dẫn. Trong trường hợp nghiêm trọng, doanh nghiệp có quyền kết thúc hợp tác thực tập.</p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Cần hỗ trợ thêm?</h2>
          <p className="text-blue-100 mb-6">Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
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

export default CompanyGuidePage;