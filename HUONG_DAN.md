# Hệ thống Quản lý Thực tập - Khoa CNTT Đại học Đại Nam

Ứng dụng web quản lý thực tập và hợp tác doanh nghiệp được xây dựng với ReactJS + Vite, TypeScript và Tailwind CSS.

## 🚀 Tính năng chính

### 🔐 Hệ thống Authentication
- Đăng nhập/Đăng ký theo role
- Quên mật khẩu
- Bảo vệ route theo quyền

### 👥 Quản lý theo Role
- **Admin**: Quản lý toàn bộ hệ thống
- **Sinh viên**: Đăng ký thực tập, nộp báo cáo
- **Giảng viên**: Hướng dẫn, chấm điểm
- **Doanh nghiệp**: Đăng tin, quản lý thực tập sinh

### 📊 Dashboard riêng biệt
- Thống kê tổng quan
- Hoạt động gần đây
- Thao tác nhanh
- Biểu đồ tiến độ

### 📝 Quản lý dữ liệu
- Quản lý sinh viên
- Quản lý giảng viên
- Quản lý doanh nghiệp
- Quản lý đợt thực tập
- Báo cáo và đánh giá

## 🛠️ Công nghệ sử dụng

- **Frontend**: ReactJS 19 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **HTTP Client**: Axios

## 📦 Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 18
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

### Build production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## 🎯 Tài khoản demo

| Role | Email | Password | Mô tả |
|------|-------|----------|--------|
| Admin | admin@dainam.edu.vn | admin123 | Quản trị viên |
| Sinh viên | sv001@dainam.edu.vn | sv123 | Sinh viên |
| Giảng viên | gv001@dainam.edu.vn | gv123 | Giảng viên |
| Doanh nghiệp | dn001@company.com | dn123 | Doanh nghiệp |

## 🏗️ Cấu trúc dự án

```
src/
├── components/           # Các component tái sử dụng
│   ├── dashboards/      # Dashboard cho từng role
│   ├── Layout.tsx       # Layout chính với navigation
│   └── ProtectedRoute.tsx # Bảo vệ route
├── hooks/               # Custom hooks
│   └── useAuth.tsx      # Authentication context
├── pages/               # Các trang chính
│   ├── HomePage.tsx     # Trang chủ/Dashboard
│   ├── LoginPage.tsx    # Trang đăng nhập
│   ├── RegisterPage.tsx # Trang đăng ký
│   ├── StudentsPage.tsx # Quản lý sinh viên
│   └── CompaniesPage.tsx # Quản lý doanh nghiệp
├── types/               # TypeScript type definitions
│   └── index.ts         # Các type chính
├── utils/               # Utility functions
├── App.tsx             # Component gốc
└── main.tsx            # Entry point

```

## 🎨 Giao diện

### Thiết kế
- **Top Navigation**: Không sidebar, menu ngang trên cùng
- **Color Scheme**: Xanh - Trắng chủ đạo
- **Responsive**: Tương thích mobile
- **Modern UI**: Thiết kế tối giản, hiện đại

### Navigation Structure
```
[Logo Khoa CNTT] ────────── [Trang chủ] [Sinh viên] [Giảng viên] [Doanh nghiệp] [Thực tập] [Báo cáo] [User Menu]
```

## 🔧 Tính năng sắp phát triển

- [ ] Quản lý giảng viên đầy đủ
- [ ] Hệ thống tin tuyển dụng
- [ ] Upload và quản lý file báo cáo
- [ ] Hệ thống thông báo real-time
- [ ] Export báo cáo Excel/PDF
- [ ] Lịch họp và nhắc nhở
- [ ] API Backend với MySQL
- [ ] Hệ thống email notification

## 🎯 Hướng dẫn sử dụng

1. **Đăng nhập**: Sử dụng một trong các tài khoản demo ở trên
2. **Dashboard**: Xem thống kê và thao tác nhanh theo role
3. **Navigation**: Sử dụng menu trên cùng để điều hướng
4. **Quản lý**: Thêm, sửa, xóa dữ liệu trong các trang quản lý
5. **Responsive**: Ứng dụng tương thích với mobile và tablet

## 📱 Screenshots

### Desktop
- Top navigation với logo và menu
- Dashboard với thống kê và biểu đồ
- Bảng quản lý với search và filter
- Form đăng nhập/đăng ký hiện đại

### Mobile
- Menu hamburger responsive
- Cards layout tối ưu cho mobile
- Touch-friendly interfaces

## 📄 License

Dự án được phát triển cho Khoa Công nghệ Thông tin - Đại học Đại Nam

---

© 2025 Khoa CNTT - Đại học Đại Nam