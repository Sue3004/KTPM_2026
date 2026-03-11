const EmployeeModel = require('../models/employeeModel');

class EmployeeController {
    // Validation helper functions
    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePhone(phone) {
        const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
        return phoneRegex.test(phone);
    }

    static validateEmployeeCode(code) {
        return code && code.length > 0 && code.length <= 20;
    }

    static isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    // Get all employees
    static async getAllEmployees(req, res) {
        try {
            const employees = await EmployeeModel.getAllEmployees();
            res.json({
                success: true,
                data: employees,
                count: employees.length
            });
        } catch (error) {
            console.error('Error fetching employees:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách nhân viên',
                error: error.message
            });
        }
    }

    // Get single employee
    static async getEmployee(req, res) {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID nhân viên không hợp lệ'
                });
            }

            const employee = await EmployeeModel.getEmployeeById(id);
            
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy nhân viên'
                });
            }

            res.json({
                success: true,
                data: employee
            });
        } catch (error) {
            console.error('Error fetching employee:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy thông tin nhân viên',
                error: error.message
            });
        }
    }

    // Search employees
    static async searchEmployees(req, res) {
        try {
            const { q } = req.query;

            if (!q || q.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập từ khóa tìm kiếm'
                });
            }

            const employees = await EmployeeModel.searchEmployees(q.trim());
            res.json({
                success: true,
                data: employees,
                count: employees.length,
                searchTerm: q
            });
        } catch (error) {
            console.error('Error searching employees:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi tìm kiếm nhân viên',
                error: error.message
            });
        }
    }

    // Create employee
    static async createEmployee(req, res) {
        try {
            const {
                employee_code,
                full_name,
                birth_date,
                gender,
                phone,
                email,
                department_id,
                position,
                hire_date,
                status
            } = req.body;

            // Validation
            const errors = [];

            if (!employee_code || !EmployeeController.validateEmployeeCode(employee_code)) {
                errors.push('Mã nhân viên không hợp lệ');
            }

            if (!full_name || full_name.trim() === '') {
                errors.push('Họ tên không được bỏ trống');
            }

            if (!birth_date || !EmployeeController.isValidDate(birth_date)) {
                errors.push('Ngày sinh không hợp lệ');
            }

            if (!gender || !['Nam', 'Nữ'].includes(gender)) {
                errors.push('Giới tính không hợp lệ');
            }

            if (!phone || !EmployeeController.validatePhone(phone)) {
                errors.push('Số điện thoại không hợp lệ');
            }

            if (!email || !EmployeeController.validateEmail(email)) {
                errors.push('Email không hợp lệ');
            }

            if (!department_id || isNaN(department_id)) {
                errors.push('Phòng ban không hợp lệ');
            }

            if (!position || position.trim() === '') {
                errors.push('Chức vụ không được bỏ trống');
            }

            if (!hire_date || !EmployeeController.isValidDate(hire_date)) {
                errors.push('Ngày vào làm không hợp lệ');
            }

            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu không hợp lệ',
                    errors
                });
            }

            // Check if employee code already exists
            if (await EmployeeModel.isEmployeeCodeExists(employee_code)) {
                return res.status(400).json({
                    success: false,
                    message: 'Mã nhân viên đã tồn tại'
                });
            }

            // Check if email already exists
            if (await EmployeeModel.isEmailExists(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã tồn tại'
                });
            }

            // Create employee
            const newEmployee = await EmployeeModel.createEmployee({
                employee_code,
                full_name,
                birth_date,
                gender,
                phone,
                email,
                department_id,
                position,
                hire_date,
                status: status || 'Đang làm việc'
            });

            res.status(201).json({
                success: true,
                message: 'Thêm nhân viên thành công',
                data: newEmployee
            });
        } catch (error) {
            console.error('Error creating employee:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi thêm nhân viên',
                error: error.message
            });
        }
    }

    // Update employee
    static async updateEmployee(req, res) {
        try {
            const { id } = req.params;
            const {
                full_name,
                birth_date,
                gender,
                phone,
                email,
                department_id,
                position,
                hire_date,
                status
            } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID nhân viên không hợp lệ'
                });
            }

            // Check if employee exists
            const employee = await EmployeeModel.getEmployeeById(id);
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy nhân viên'
                });
            }

            // Validation
            const errors = [];

            if (!full_name || full_name.trim() === '') {
                errors.push('Họ tên không được bỏ trống');
            }

            if (!birth_date || !EmployeeController.isValidDate(birth_date)) {
                errors.push('Ngày sinh không hợp lệ');
            }

            if (!gender || !['Nam', 'Nữ'].includes(gender)) {
                errors.push('Giới tính không hợp lệ');
            }

            if (!phone || !EmployeeController.validatePhone(phone)) {
                errors.push('Số điện thoại không hợp lệ');
            }

            if (!email || !EmployeeController.validateEmail(email)) {
                errors.push('Email không hợp lệ');
            }

            if (!department_id || isNaN(department_id)) {
                errors.push('Phòng ban không hợp lệ');
            }

            if (!position || position.trim() === '') {
                errors.push('Chức vụ không được bỏ trống');
            }

            if (!hire_date || !EmployeeController.isValidDate(hire_date)) {
                errors.push('Ngày vào làm không hợp lệ');
            }

            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Dữ liệu không hợp lệ',
                    errors
                });
            }

            // Check if email already exists (excluding current employee)
            if (email !== employee.email && await EmployeeModel.isEmailExists(email, id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Email đã tồn tại'
                });
            }

            // Update employee
            const success = await EmployeeModel.updateEmployee(id, {
                full_name,
                birth_date,
                gender,
                phone,
                email,
                department_id,
                position,
                hire_date,
                status
            });

            if (!success) {
                return res.status(400).json({
                    success: false,
                    message: 'Cập nhật nhân viên thất bại'
                });
            }

            res.json({
                success: true,
                message: 'Cập nhật nhân viên thành công'
            });
        } catch (error) {
            console.error('Error updating employee:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi cập nhật nhân viên',
                error: error.message
            });
        }
    }

    // Delete employee
    static async deleteEmployee(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID nhân viên không hợp lệ'
                });
            }

            // Check if employee exists
            const employee = await EmployeeModel.getEmployeeById(id);
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy nhân viên'
                });
            }

            // Delete employee
            const success = await EmployeeModel.deleteEmployee(id);

            if (!success) {
                return res.status(400).json({
                    success: false,
                    message: 'Xóa nhân viên thất bại'
                });
            }

            res.json({
                success: true,
                message: 'Xóa nhân viên thành công'
            });
        } catch (error) {
            console.error('Error deleting employee:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi xóa nhân viên',
                error: error.message
            });
        }
    }

    // Get all departments
    static async getDepartments(req, res) {
        try {
            const departments = await EmployeeModel.getAllDepartments();
            res.json({
                success: true,
                data: departments
            });
        } catch (error) {
            console.error('Error fetching departments:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách phòng ban',
                error: error.message
            });
        }
    }

    // Get employees by department
    static async getEmployeesByDepartment(req, res) {
        try {
            const { departmentId } = req.params;

            if (!departmentId || isNaN(departmentId)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID phòng ban không hợp lệ'
                });
            }

            const employees = await EmployeeModel.getEmployeesByDepartment(departmentId);
            res.json({
                success: true,
                data: employees,
                count: employees.length
            });
        } catch (error) {
            console.error('Error fetching employees by department:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi khi lấy danh sách nhân viên theo phòng ban',
                error: error.message
            });
        }
    }
}

module.exports = EmployeeController;
