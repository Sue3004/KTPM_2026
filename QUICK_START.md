# 🚀 Quick Start Guide - Hướng Dẫn Nhanh

## Bước 1: Chuẩn Bị

Đảm bảo bạn đã cài đặt:
- ✅ Node.js (phiên bản 14.x trở lên)
- ✅ MySQL Server (phiên bản 5.7 trở lên)
- ✅ npm hoặc yarn

### Kiểm tra phiên bản
```bash
node --version
npm --version
mysql --version
```

## Bước 2: Tạo Database

### Trên Windows (Command Prompt hoặc PowerShell):
```bash
cd d:\KTPM\employee-management
mysql -u root -p < database\schema.sql
```

### Trên Linux/Mac (Terminal):
```bash
cd ~/path/to/employee-management
mysql -u root -p < database/schema.sql
```

**Ghi chú**: Nếu MySQL có password, dùng:
```bash
mysql -u root -pYourPassword < database/schema.sql
```

## Bước 3: Cài Đặt Dependencies

```bash
cd d:\KTPM\employee-management
npm install
```

Quá trình này sẽ download và cài đặt tất cả thư viện cần thiết.

## Bước 4: Cấu Hình .env

Chỉnh sửa file `.env` nếu cần:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=              # Để trống nếu không có password
DB_NAME=employee_management
DB_PORT=3306
SERVER_PORT=3001
NODE_ENV=development
```

## Bước 5: Khởi Động Server

```bash
npm run dev
```

Bạn sẽ thấy thông báo:
```
✓ Database connected successfully
Server is running on http://localhost:3001
```

## Bước 6: Truy Cập Ứng Dụng

Mở trình duyệt và vào:
```
http://localhost:3001
```

## ✅ Xong! 

Ứng dụng đã sẵn sàng sử dụng. Bạn sẽ thấy danh sách nhân viên với 5 nhân viên mẫu.

---

## 🛠️ Các Lệnh Hữu Ích

### Chạy ở chế độ Development (tự động reload khi thay đổi code)
```bash
npm run dev
```

### Chạy ở chế độ Production
```bash
npm start
```

### Cài đặt package mới
```bash
npm install <package-name>
```

### Xem danh sách installed packages
```bash
npm list
```

---

## 🐛 Troubleshooting Nhanh

### Lỗi: "EADDRINUSE" (Port đã được sử dụng)
```bash
# Windows - Tìm process sử dụng port 3001
netstat -ano | findstr :3001

# Linux/Mac - Tìm process sử dụng port 3001
lsof -i :3001

# Kill process (Windows)
taskkill /PID <PID> /F

# Kill process (Linux/Mac)
kill -9 <PID>
```

Hoặc đổi PORT trong `.env` thành PORT khác (VD: 3002)

### Lỗi: "Cannot connect to database"
1. Kiểm tra MySQL có đang chạy
2. Kiểm tra tên user/password trong `.env`
3. Kiểm tra database `employee_management` đã được tạo
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Lỗi: "npm: command not found"
- Node.js/npm chưa được cài hoặc PATH không được set
- Cài lại Node.js từ https://nodejs.org/

### Trang không tải được
1. Kiểm tra server có đang chạy (xem terminal)
2. Kiểm tra URL: http://localhost:3001
3. Xem console của trình duyệt (F12)

---

## 📚 Tài Liệu Chi Tiết

Xem file `README.md` để có tài liệu đầy đủ.

## 💬 Cập Nhật: 
- Nếu cần thêm nhân viên, click "Thêm Nhân Viên"
- Để xem chi tiết, click "Xem"
- Để sửa, click "Sửa"
- Để xóa, click "Xóa" (cần xác nhận)

---

**Happy coding! 🎉**
