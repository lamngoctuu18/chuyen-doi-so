# HƯỚNG DẪN SỬ DỤNG TÍNH NĂNG AUTO-FILL ĐĂNG NHẬP

## 🚀 Tính năng mới đã được thêm vào LoginPage

### ✨ Các tính năng chính:

1. **Auto-fill thông minh theo vai trò**
   - Khi chọn vai trò (Sinh viên/Giảng viên/Doanh nghiệp), hệ thống tự động điền thông tin tài khoản gần đây nhất
   - Mỗi vai trò có bộ nhớ riêng biệt

2. **Quản lý tài khoản đã lưu**
   - Lưu tự động các tài khoản đăng nhập thành công
   - Hiển thị dropdown với danh sách tài khoản đã lưu
   - Xóa tài khoản không cần thiết
   - Lưu tối đa 5 tài khoản gần đây nhất cho mỗi vai trò

3. **Giao diện thân thiện**
   - Icon báo hiệu có tài khoản đã lưu
   - Hiển thị số lượng tài khoản đã lưu
   - Thời gian sử dụng gần nhất
   - Checkbox "Nhớ tài khoản này"

### 🎯 Cách sử dụng:

1. **Lần đầu đăng nhập:**
   - Chọn vai trò
   - Nhập mã và mật khẩu
   - Tick "Nhớ tài khoản này" (tự động lưu)
   - Đăng nhập thành công → Tài khoản được lưu

2. **Lần đăng nhập tiếp theo:**
   - Chọn vai trò → Tự động điền thông tin gần nhất
   - Click vào ô mã đăng nhập → Hiện dropdown
   - Chọn tài khoản từ danh sách
   - Hoặc nhập mới nếu muốn

3. **Quản lý tài khoản:**
   - Click icon 💾 để xem danh sách
   - Click vào tài khoản để chọn
   - Click 🗑️ để xóa tài khoản không cần

### 🔧 Test với dữ liệu mẫu:

1. Mở DevTools (F12)
2. Copy nội dung file `sampleAccounts.js`
3. Paste vào Console và Enter
4. Refresh trang
5. Thử chọn các vai trò khác nhau

### 💾 Dữ liệu lưu trữ:

- Lưu trong localStorage với key `savedAccounts`
- Cấu trúc JSON theo vai trò
- Bao gồm: userId, password, lastUsed timestamp
- Tự động xóa cache khi chuyển role

### 🔒 Bảo mật:

- Mật khẩu được lưu trong localStorage (chỉ trên máy người dùng)
- Tự động xóa khi clear browser data
- Không gửi lên server
- Mỗi vai trò có namespace riêng

### 📱 Responsive:

- Dropdown tự động điều chỉnh theo màn hình
- Touch-friendly cho mobile
- Keyboard navigation support