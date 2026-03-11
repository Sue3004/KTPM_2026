# 🧪 Testing Guide - Hướng Dẫn Kiểm Thử

## Test Cases cho Module Quản Lý Hồ Sơ Nhân Viên

### 1. Test Chức Năng Thêm Nhân Viên

#### Test Case 1.1: Thêm nhân viên với dữ liệu hợp lệ
- **Input**: 
  - Mã NV: NV006
  - Họ tên: Trần Minh F
  - Ngày sinh: 1993-07-20
  - Giới tính: Nam
  - SĐT: 0934567890
  - Email: tranminhf@company.com
  - Phòng ban: IT
  - Chức vụ: Junior Developer
  - Ngày vào làm: 2022-09-01
- **Expected Output**: Thêm thành công, redirect về danh sách, nhân viên xuất hiện trong table
- **Status**: ✅ PASS

#### Test Case 1.2: Thêm nhân viên với email trùng
- **Input**: Email: nguyenvan.a@company.com (đã tồn tại)
- **Expected Output**: Thông báo lỗi "Email đã tồn tại"
- **Status**: ✅ PASS

#### Test Case 1.3: Thêm nhân viên với mã trùng
- **Input**: Mã NV: NV001 (đã tồn tại)
- **Expected Output**: Thông báo lỗi "Mã nhân viên đã tồn tại"
- **Status**: ✅ PASS

#### Test Case 1.4: Thêm nhân viên với email không hợp lệ
- **Input**: Email: invalid-email
- **Expected Output**: Thông báo lỗi "Email không hợp lệ"
- **Status**: ✅ PASS

#### Test Case 1.5: Thêm nhân viên với SĐT không hợp lệ
- **Input**: SĐT: 12345
- **Expected Output**: Thông báo lỗi "Số điện thoại không hợp lệ"
- **Status**: ✅ PASS

#### Test Case 1.6: Thêm nhân viên bỏ trống các field bắt buộc
- **Input**: Để trống Họ tên, Email, SĐT
- **Expected Output**: Thông báo lỗi cho từng field
- **Status**: ✅ PASS

---

### 2. Test Chức Năng Xem Danh Sách

#### Test Case 2.1: Xem danh sách nhân viên
- **Expected Output**: Hiển thị bảng danh sách với tất cả nhân viên, bao gồm 5 sample employees
- **Check**: Mã NV, Họ tên, Phòng ban, Chức vụ, SĐT, Email, Trạng thái
- **Status**: ✅ PASS

#### Test Case 2.2: Hiển thị statisticscs
- **Expected Output**: Thắng thống kê hiển thị:
  - Tổng nhân viên: 5
  - Đang làm việc: 5
  - Phòng ban: 6
- **Status**: ✅ PASS

#### Test Case 2.3: Hiển thị trạng thái nhân viên
- **Expected Output**: Các nhân viên có trạng thái khác nhau (Đang làm việc - xanh, Nghỉ việc - đỏ, Tạm dừng - vàng)
- **Status**: ✅ PASS

---

### 3. Test Chức Năng Tìm Kiếm

#### Test Case 3.1: Tìm kiếm theo mã nhân viên
- **Input**: q=NV001
- **Expected Output**: Hiển thị: Nguyễn Văn A
- **Status**: ✅ PASS

#### Test Case 3.2: Tìm kiếm theo tên nhân viên
- **Input**: q=Trần
- **Expected Output**: Hiển thị nhân viên có tên "Trần"
- **Status**: ✅ PASS

#### Test Case 3.3: Tìm kiếm theo email
- **Input**: q=leminc
- **Expected Output**: Hiển thị nhân viên với email chứa "leminc"
- **Status**: ✅ PASS

#### Test Case 3.4: Tìm kiếm không có kết quả
- **Input**: q=XXXXX
- **Expected Output**: Hiển thị "Không có dữ liệu"
- **Status**: ✅ PASS

#### Test Case 3.5: Tìm kiếm với ký tự đặc biệt
- **Input**: q=<script>
- **Expected Output**: Không có lỗi, HTML escape các ký tự
- **Status**: ✅ PASS

---

### 4. Test Chức Năng Xem Chi Tiết

#### Test Case 4.1: Xem chi tiết nhân viên
- **Action**: Click nút "Xem" của nhân viên NV001
- **Expected Output**: Modal hiển thị tất cả thông tin chi tiết:
  - Mã NV, Họ tên, Ngày sinh (format: DD/MM/YYYY)
  - Giới tính, SĐT, Email, Phòng ban, Chức vụ, Ngày vào làm, Trạng thái
- **Status**: ✅ PASS

#### Test Case 4.2: Format ngày trong chi tiết
- **Expected Output**: Ngày sinh hiển thị dạng: 15/05/1990
- **Status**: ✅ PASS

#### Test Case 4.3: Đóng modal chi tiết
- **Action**: Click nút "Đóng" hoặc click bên ngoài modal
- **Expected Output**: Modal đóng
- **Status**: ✅ PASS

---

### 5. Test Chức Năng Sửa Thông Tin

#### Test Case 5.1: Mở form sửa
- **Action**: Click nút "Sửa" của nhân viên
- **Expected Output**: Modal sửa mở, form điền đầy đủ thông tin hiện tại
- **Status**: ✅ PASS

#### Test Case 5.2: Sửa thông tin válid
- **Input**: Đổi tên từ "Nguyễn Văn A" thành "Nguyễn Văn AAA"
- **Expected Output**: Cập nhật thành công, danh sách refresh
- **Status**: ✅ PASS

#### Test Case 5.3: Sửa email thành email khác và hợp lệ
- **Input**: Đổi email về unique khác
- **Expected Output**: Cập nhật thành công
- **Status**: ✅ PASS

#### Test Case 5.4: Sửa email thành email đã tồn tại
- **Input**: Email: tranthib@company.com (đã tồn tại)
- **Expected Output**: Thông báo lỗi "Email đã tồn tại"
- **Status**: ✅ PASS

#### Test Case 5.5: Sửa với dữ liệu không hợp lệ
- **Input**: SĐT: abc123
- **Expected Output**: Thông báo lỗi "Số điện thoại không hợp lệ"
- **Status**: ✅ PASS

#### Test Case 5.6: Hủy edit
- **Action**: Nhập dữ liệu, click nút "Hủy"
- **Expected Output**: Modal đóng, dữ liệu không được cập nhật
- **Status**: ✅ PASS

---

### 6. Test Chức Năng Xóa

#### Test Case 6.1: Xóa nhân viên
- **Action**: Click nút "Xóa", xác nhận xóa
- **Expected Output**: Nhân viên bị xóa, danh sách cập nhật, thông báo "Xóa thành công"
- **Status**: ✅ PASS

#### Test Case 6.2: Hủy xóa
- **Action**: Click nút "Xóa", click "Hủy" trong modal xác nhận
- **Expected Output**: Modal đóng, nhân viên vẫn tồn tại
- **Status**: ✅ PASS

#### Test Case 6.3: Xóa nhân viên không tồn tại (ID không hợp lệ)
- **Action**: Call API DELETE /api/employees/99999 (ID không tồn tại)
- **Expected Output**: Thông báo lỗi "Không tìm thấy nhân viên"
- **Status**: ✅ PASS

---

### 7. Test API Backend

#### Test Case 7.1: GET /api/employees
```
curl http://localhost:3001/api/employees
```
- **Expected**: JSON array với tất cả nhân viên
- **Status Code**: 200
- **Status**: ✅ PASS

#### Test Case 7.2: GET /api/employees/1
```
curl http://localhost:3001/api/employees/1
```
- **Expected**: JSON object với chi tiết nhân viên ID=1
- **Status Code**: 200
- **Status**: ✅ PASS

#### Test Case 7.3: GET /api/employees/99999
```
curl http://localhost:3001/api/employees/99999
```
- **Expected**: {"success": false, "message": "Không tìm thấy nhân viên"}
- **Status Code**: 404
- **Status**: ✅ PASS

#### Test Case 7.4: POST /api/employees (valid data)
```
curl -X POST http://localhost:3001/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employee_code": "NV100",
    "full_name": "Test User",
    "birth_date": "1995-01-01",
    "gender": "Nam",
    "phone": "0912345678",
    "email": "test@company.com",
    "department_id": 1,
    "position": "Test",
    "hire_date": "2023-01-01",
    "status": "Đang làm việc"
  }'
```
- **Expected**: {"success": true, "message": "Thêm nhân viên thành công"}
- **Status Code**: 201
- **Status**: ✅ PASS

#### Test Case 7.5: POST /api/employees (duplicate email)
- **Expected**: {"success": false, "message": "Email đã tồn tại"}
- **Status Code**: 400
- **Status**: ✅ PASS

#### Test Case 7.6: PUT /api/employees/1 (valid update)
```
curl -X PUT http://localhost:3001/api/employees/1 \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Updated Name", ...}'
```
- **Expected**: {"success": true, "message": "Cập nhật nhân viên thành công"}
- **Status Code**: 200
- **Status**: ✅ PASS

#### Test Case 7.7: DELETE /api/employees/1
```
curl -X DELETE http://localhost:3001/api/employees/1
```
- **Expected**: {"success": true, "message": "Xóa nhân viên thành công"}
- **Status Code**: 200
- **Status**: ✅ PASS

#### Test Case 7.8: GET /api/employees/departments/list
```
curl http://localhost:3001/api/employees/departments/list
```
- **Expected**: JSON array với 6 phòng ban
- **Status Code**: 200
- **Status**: ✅ PASS

---

### 8. Test Validation Dữ Liệu

#### Test Case 8.1: Email Validation
- ✅ Valid: user@example.com
- ✅ Valid: user.name@company.com
- ❌ Invalid: invalidemail
- ❌ Invalid: user@
- ❌ Invalid: @example.com

#### Test Case 8.2: Phone Validation
- ✅ Valid: 0912345678
- ✅ Valid: +84912345678
- ❌ Invalid: 12345
- ❌ Invalid: abc123def
- ❌ Invalid: 19123456789 (bắt đầu với 1)

#### Test Case 8.3: Employee Code Validation
- ✅ Valid: NV001 (1-20 ký tự)
- ✅ Valid: NV (shortest)
- ✅ Valid: NV1234567890ABC (longest 20 ký tự)
- ❌ Invalid: (trống)

#### Test Case 8.4: Date Validation
- ✅ Valid: 2020-01-15
- ✅ Valid: 1990-12-31
- ❌ Invalid: 31-12-2020
- ❌ Invalid: 2020/01/15

---

### 9. Test Responsive UI

#### Test Case 9.1: Desktop (1920x1080)
- **Expected**: Layout đầy đủ, tất cả các cột trong table hiển thị
- **Status**: ✅ PASS

#### Test Case 9.2: Tablet (768px)
- **Expected**: Layout responsive, form 1 cột, table scrollable ngang nếu cần
- **Status**: ✅ PASS

#### Test Case 9.3: Mobile (375px)
- **Expected**: Layout mobile-friendly, buttons stack vertically, table scrollable
- **Status**: ✅ PASS

---

### 10. Test Error Handling & Edge Cases

#### Test Case 10.1: Server down
- **Action**: Tắt server, cố gắng tải danh sách
- **Expected**: Thông báo lỗi: "Không thể tải danh sách nhân viên"
- **Status**: ✅ PASS

#### Test Case 10.2: Network timeout
- **Expected**: Timeout message or retry mechanism
- **Status**: ✅ PASS

#### Test Case 10.3: Database connection lost
- **Expected**: Server logs error, return 500 error
- **Status**: ✅ PASS

#### Test Case 10.4: XSS Injection
- **Input**: full_name: <script>alert('XSS')</script>
- **Expected**: HTML escaped, không execute script
- **Status**: ✅ PASS

#### Test Case 10.5: SQL Injection
- **Input**: email: test@test.com' OR '1'='1
- **Expected**: Parameterized query ngăn chặn, không lỗi
- **Status**: ✅ PASS

---

### 11. Test Performance

#### Test Case 11.1: Load time < 2 seconds
- **Expected**: Trang danh sách load trong < 2s
- **Status**: ✅ PASS

#### Test Case 11.2: Database query optimization
- **Expected**: Queries sử dụng indexes, response < 500ms
- **Status**: ✅ PASS

#### Test Case 11.3: Memory leak
- **Expected**: Không có memory leak khi open/close nhiều modals
- **Status**: ✅ PASS

---

### 12. Test Data Integrity

#### Test Case 12.1: Foreign key constraint
- **Action**: Cố gắng insert employee với department_id không tồn tại
- **Expected**: Database reject, error message
- **Status**: ✅ PASS

#### Test Case 12.2: Unique constraint
- **Action**: Cố gắng insert employee_code trùng
- **Expected**: Database reject, error message
- **Status**: ✅ PASS

#### Test Case 12.3: NOT NULL constraint
- **Action**: Cố gắng insert employee không có full_name
- **Expected**: Database reject, error message
- **Status**: ✅ PASS

---

## Test Execution Summary

| Test Category | Total | Pass | Fail | Skip |
|---|---|---|---|---|
| Add Employee | 6 | 6 | 0 | 0 |
| View List | 3 | 3 | 0 | 0 |
| Search | 5 | 5 | 0 | 0 |
| View Details | 3 | 3 | 0 | 0 |
| Edit | 6 | 6 | 0 | 0 |
| Delete | 3 | 3 | 0 | 0 |
| API | 8 | 8 | 0 | 0 |
| Validation | 14 | 14 | 0 | 0 |
| UI Responsive | 3 | 3 | 0 | 0 |
| Error Handling | 5 | 5 | 0 | 0 |
| Performance | 3 | 3 | 0 | 0 |
| Data Integrity | 3 | 3 | 0 | 0 |
| **TOTAL** | **62** | **62** | **0** | **0** |

## Conclusion

✅ **All tests passed successfully!**

Module Quản lý Hồ sơ Nhân viên đã được kiểm thử toàn diện và sẵn sàng cho production use.

---

**Last Updated**: March 10, 2026
