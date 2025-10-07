// File mẫu để test tính năng auto-fill tài khoản đăng nhập
// Chạy đoạn code này trong DevTools Console để thêm tài khoản mẫu

const sampleAccounts = {
  'sinh-vien': [
    { userId: 'SV001', password: '123456', lastUsed: Date.now() - 86400000 }, // 1 ngày trước
    { userId: 'SV002', password: '123456', lastUsed: Date.now() - 172800000 }, // 2 ngày trước
    { userId: 'SV003', password: '123456', lastUsed: Date.now() - 259200000 }  // 3 ngày trước
  ],
  'giang-vien': [
    { userId: 'GV001', password: '123456', lastUsed: Date.now() - 86400000 },
    { userId: 'GV002', password: '123456', lastUsed: Date.now() - 172800000 }
  ],
  'doanh-nghiep': [
    { userId: 'DN001', password: '123456', lastUsed: Date.now() - 86400000 },
    { userId: 'DN002', password: '123456', lastUsed: Date.now() - 172800000 }
  ],
  'admin': [
    { userId: 'admin001', password: '123456', lastUsed: Date.now() - 86400000 }
  ]
};

// Lưu vào localStorage
localStorage.setItem('savedAccounts', JSON.stringify(sampleAccounts));
console.log('✅ Đã thêm tài khoản mẫu vào localStorage');
console.log('🔄 Refresh trang để thấy thay đổi');