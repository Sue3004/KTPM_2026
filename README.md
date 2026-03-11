# 🏢 Hệ Thống Quản Lý Hồ Sơ Nhân Viên

## Giới Thiệu

Module Quản lý Hồ sơ Nhân viên là một ứng dụng web toàn vẹn được xây dựng bằng kiến trúc MVC ( Model - View - Controller), mục đích giúp các tổ chức, doanh nghiệp quản lý thông tin nhân viên một cách hiệu quả.

### Các Chức Năng Chính:
- Thêm nhân viên mới vào hệ thống
- Xem danh sách toàn bộ nhân viên
- Sửa thông tin nhân viên
- Xóa nhân viên khỏi hệ thống
- Tìm kiếm nhân viên theo mã, tên hoặc email
- Xem chi tiết thông tin nhân viên
- Xem thống kê nhân viên theo phòng ban
- Quản lý trạng thái làm việc

## Công Nghệ Sử Dụng

| Thành Phần | Công Nghệ |
|-----------|----------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL 5.7+ |
| **Architecture** | MVC Pattern |

## Cấu Trúc Dự Án

```
employee-management/
│
├── backend/
│   ├── controllers/      # Xử lý logic nghiệp vụ
│   │   └── employeeController.js
│   │
│   ├── models/          # Tương tác với database
│   │   └── employeeModel.js
│   │
│   ├── routes/          # Định nghĩa API endpoint
│   │   └── employeeRoutes.js
│   │
│   ├── db.js            # Kết nối database
│   └── server.js        # Khởi động server
│
├── frontend/
│   ├── pages/           # Trang HTML
│   │   ├── employeeList.html        # Danh sách nhân viên
│   │   └── addEmployee.html         # Thêm nhân viên
│   │
│   ├── css/             # Stylesheet
│   │   └── style.css
│   │
│   └── js/              # JavaScript
│       └── employee.js   # Xử lý logic frontend
│
├── database/
│   └── schema.sql       # Script tạo database
│
├── package.json         # Dependencies
├── .env                 # Environment variables
└── README.md            # Tài liệu dự án
```

## Yêu Cầu Hệ Thống

- Node.js 14.x trở lên
- MySQL 5.7+
- npm hoặc yarn
- Modern web browser (Chrome, Firefox, Edge, Safari)

## Hướng Dẫn Cài Đặt

### 1. Chuẩn Bị Database

Đảm bảo MySQL đang chạy, sau đó thực thi script tạo database:

```bash
# Trên Windows
mysql -u root -p < database/schema.sql

# Hoặc trên Linux/Mac
mysql -u root -p < database/schema.sql
```

Nếu bạn có password MySQL, thêm flag `-p` hoặc `-pYourPassword`

### 2. Cài Đặt Dependencies

```bash
cd employee-management
npm install
```

### 3. Cấu Hình Biến Môi Trường

Chỉnh sửa file `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=employee_management
DB_PORT=3306
SERVER_PORT=3001
NODE_ENV=development
```

### 4. Khởi Động Server

```bash
# Development (với nodemon - tự động reload)
npm run dev

# Production
npm start
```

Server sẽ chạy tại `http://localhost:3001`

### 5. Truy Cập Ứng Dụng

Mở trình duyệt và truy cập:
```
http://localhost:3001
```

## API Documentation

### Employees Endpoints

#### 1. Lấy danh sách tất cả nhân viên
```
GET /api/employees
Response: { success: true, data: [...], count: number }
```

#### 2. Lấy chi tiết nhân viên
```
GET /api/employees/:id
Response: { success: true, data: {...} }
```

#### 3. Tìm kiếm nhân viên
```
GET /api/employees/search?q=keyword
Response: { success: true, data: [...] }
```

#### 4. Thêm nhân viên
```
POST /api/employees
Content-Type: application/json

Body: {
  "employee_code": "NV001",
  "full_name": "Nguyễn Văn A",
  "birth_date": "1990-05-15",
  "gender": "Nam",
  "phone": "0912345678",
  "email": "email@company.com",
  "department_id": 1,
  "position": "Developer",
  "hire_date": "2020-01-10",
  "status": "Đang làm việc"
}

Response: { success: true, message: "...", data: {...} }
```

#### 5. Cập nhật nhân viên
```
PUT /api/employees/:id
Content-Type: application/json

Body: {
  "full_name": "...",
  "birth_date": "...",
  "gender": "...",
  "phone": "...",
  "email": "...",
  "department_id": ...,
  "position": "...",
  "hire_date": "...",
  "status": "..."
}

Response: { success: true, message: "..." }
```

#### 6. Xóa nhân viên
```
DELETE /api/employees/:id
Response: { success: true, message: "..." }
```

#### 7. Lấy danh sách phòng ban
```
GET /api/employees/departments/list
Response: { success: true, data: [...] }
```

#### 8. Lấy nhân viên theo phòng ban
```
GET /api/employees/department/:departmentId
Response: { success: true, data: [...] }
```

## Database Schema

### Bảng: employees
| Cột | Kiểu | Mô Tả |
|-----|------|-------|
| employee_id | INT | ID (Primary Key) |
| employee_code | VARCHAR(20) | Mã nhân viên (Unique) |
| full_name | VARCHAR(100) | Họ tên |
| birth_date | DATE | Ngày sinh |
| gender | VARCHAR(10) | Giới tính (Nam/Nữ) |
| phone | VARCHAR(20) | Số điện thoại |
| email | VARCHAR(100) | Email (Unique) |
| department_id | INT | ID phòng ban (Foreign Key) |
| position | VARCHAR(100) | Chức vụ |
| hire_date | DATE | Ngày vào làm |
| status | VARCHAR(20) | Trạng thái |
| created_at | TIMESTAMP | Thời gian tạo |
| updated_at | TIMESTAMP | Thời gian cập nhật |

### Bảng: departments
| Cột | Kiểu | Mô Tả |
|-----|------|-------|
| department_id | INT | ID (Primary Key) |
| department_name | VARCHAR(100) | Tên phòng ban |
| created_at | TIMESTAMP | Thời gian tạo |
| updated_at | TIMESTAMP | Thời gian cập nhật |

## Hướng Dẫn Sử Dụng

### Xem Danh Sách Nhân Viên
1. Truy cập trang chủ
2. Bảng sẽ hiển thị danh sách tất cả nhân viên
3. Có thể sắp xếp hoặc tìm kiếm theo mã, tên, hoặc email

### Thêm Nhân Viên Mới
1. Click nút "Thêm Nhân Viên" hoặc vào tab "Thêm Nhân Viên"
2. Điền đầy đủ thông tin bắt buộc:
   - Mã nhân viên (duy nhất, không được bỏ trống)
   - Họ tên
   - Ngày sinh
   - Giới tính
   - Số điện thoại
   - Email (hợp lệ, không trùng)
   - Phòng ban
   - Chức vụ
   - Ngày vào làm
3. Click "Lưu Nhân Viên"

### Sửa Thông Tin Nhân Viên
1. Tại danh sách nhân viên, click nút "Sửa"
2. Chỉnh sửa các thông tin cần thiết
3. Click "Cập Nhật"

### Xem Chi Tiết Nhân Viên
1. Tại danh sách, click nút "Xem"
2. Một modal sẽ hiển thị toàn bộ thông tin chi tiết

### Xóa Nhân Viên
1. Click nút "Xóa" tại danh sách
2. Xác nhận xóa khi được yêu cầu
3. Nhân viên sẽ bị xóa khỏi hệ thống

### Tìm Kiếm
1. Sử dụng ô tìm kiếm (Search box) trên thanh công cụ
2. Nhập mã nhân viên, tên, hoặc email
3. Kết quả tìm kiếm sẽ được cập nhật tự động

## Xác Thực Dữ Liệu

### Mã Nhân Viên
- Số ký tự: 1 - 20
- Bắt buộc nhập
- Phải duy nhất trong hệ thống

### Email
- Phải đúng định dạng email
- Ví dụ: user@company.com
- Phải duy nhất trong hệ thống

### Số Điện Thoại
- Phải là số Việt Nam
- Bắt đầu: 0 hoặc +84
- Độ dài: 10-11 số
- Ví dụ: 0912345678 hoặc +84912345678

### Ngày Tháng
- Định dạng: YYYY-MM-DD
- Ví dụ: 2020-01-15

## Lỗi Thường Gặp

### 1. "Cannot connect to database"
**Nguyên nhân**: MySQL không chạy hoặc cấu hình sai
**Giải pháp**: 
- Kiểm tra MySQL đang chạy
- Kiểm tra cấu hình file `.env`

### 2. "Email already exists"
**Nguyên nhân**: Email đã tồn tại
**Giải pháp**: Sử dụng email khác hoặc kiểm tra email đã tồn tại

### 3. "Employee code already exists"
**Nguyên nhân**: Mã nhân viên đã tồn tại
**Giải pháp**: Sử dụng mã nhân viên khác

### 4. "Port 3001 is already in use"
**Nguyên nhân**: Port đã được sử dụng
**Giải pháp**: 
- Đóng process đang sử dụng port
- Hoặc thay đổi port trong `.env`

### 5. Trang không tải được
**Nguyên nhân**: Server không chạy
**Giải pháp**: Kiểm tra server đã khởi động (`npm run dev`)

## Mở Rộng Trong Tương Lai

Module có thể được mở rộng với các chức năng:
- 📊 Quản lý lương và bảng lương
- 📋 Quản lý chấm công
- 📄 Quản lý hợp đồng
- 📈 Báo cáo và phân tích dữ liệu
- 🔐 Hệ thống phân quyền người dùng
- 📧 Thông báo qua email
- 📱 Mobile app

## Troubleshooting

### Debug Mode
Để chạy ở chế độ debug, thêm vào dòng lệnh:
```bash
NODE_ENV=development npm run dev
```

### Xem Logs
Kiểm tra console của trình duyệt (F12) để xem lỗi phía frontend
Kiểm tra terminal để xem lỗi phía backend

### Reset Database
Để reset database về trạng thái ban đầu:
```bash
mysql -u root -p < database/schema.sql
```

## Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra file `README.md` này
2. Kiểm tra console (F12 trên trình duyệt)
3. Kiểm tra terminal (nơi chạy server)
4. Kiểm tra kết nối MySQL
5. Kiểm tra file `.env`

## Bản Quyền

© 2026 Hệ Thống Quản Lý Nhân Sự

---

**Phiên bản**: 1.0.0  
**Cập nhật gần nhất**: Tháng 3 năm 2026
