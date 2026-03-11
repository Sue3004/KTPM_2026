const pool = require('../db');

class EmployeeModel {
    // Get all employees with department information
    static async getAllEmployees() {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    e.employee_id,
                    e.employee_code,
                    e.full_name,
                    e.birth_date,
                    e.gender,
                    e.phone,
                    e.email,
                    e.department_id,
                    d.department_name,
                    e.position,
                    e.hire_date,
                    e.status
                FROM employees e
                INNER JOIN departments d ON e.department_id = d.department_id
                ORDER BY e.created_at DESC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get employee by ID
    static async getEmployeeById(id) {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    e.employee_id,
                    e.employee_code,
                    e.full_name,
                    e.birth_date,
                    e.gender,
                    e.phone,
                    e.email,
                    e.department_id,
                    d.department_name,
                    e.position,
                    e.hire_date,
                    e.status
                FROM employees e
                INNER JOIN departments d ON e.department_id = d.department_id
                WHERE e.employee_id = ?
            `, [id]);
            return rows[0] || null;
        } catch (error) {
            throw error;
        }
    }

    // Search employees by name or code
    static async searchEmployees(searchTerm) {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    e.employee_id,
                    e.employee_code,
                    e.full_name,
                    e.birth_date,
                    e.gender,
                    e.phone,
                    e.email,
                    e.department_id,
                    d.department_name,
                    e.position,
                    e.hire_date,
                    e.status
                FROM employees e
                INNER JOIN departments d ON e.department_id = d.department_id
                WHERE e.employee_code LIKE ? 
                   OR e.full_name LIKE ?
                   OR e.email LIKE ?
                ORDER BY e.full_name ASC
            `, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Create new employee
    static async createEmployee(employeeData) {
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
            } = employeeData;

            const [result] = await pool.query(`
                INSERT INTO employees (
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
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                employee_code,
                full_name,
                birth_date,
                gender,
                phone,
                email,
                department_id,
                position,
                hire_date,
                status || 'Đang làm việc'
            ]);

            return {
                id: result.insertId,
                ...employeeData
            };
        } catch (error) {
            throw error;
        }
    }

    // Update employee
    static async updateEmployee(id, employeeData) {
        try {
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
            } = employeeData;

            const [result] = await pool.query(`
                UPDATE employees
                SET 
                    full_name = ?,
                    birth_date = ?,
                    gender = ?,
                    phone = ?,
                    email = ?,
                    department_id = ?,
                    position = ?,
                    hire_date = ?,
                    status = ?
                WHERE employee_id = ?
            `, [
                full_name,
                birth_date,
                gender,
                phone,
                email,
                department_id,
                position,
                hire_date,
                status,
                id
            ]);

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Delete employee
    static async deleteEmployee(id) {
        try {
            const [result] = await pool.query(
                'DELETE FROM employees WHERE employee_id = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    }

    // Check if employee code exists
    static async isEmployeeCodeExists(code, excludeId = null) {
        try {
            let query = 'SELECT COUNT(*) as count FROM employees WHERE employee_code = ?';
            let params = [code];

            if (excludeId) {
                query += ' AND employee_id != ?';
                params.push(excludeId);
            }

            const [result] = await pool.query(query, params);
            return result[0].count > 0;
        } catch (error) {
            throw error;
        }
    }

    // Check if email exists
    static async isEmailExists(email, excludeId = null) {
        try {
            let query = 'SELECT COUNT(*) as count FROM employees WHERE email = ?';
            let params = [email];

            if (excludeId) {
                query += ' AND employee_id != ?';
                params.push(excludeId);
            }

            const [result] = await pool.query(query, params);
            return result[0].count > 0;
        } catch (error) {
            throw error;
        }
    }

    // Get all departments
    static async getAllDepartments() {
        try {
            const [rows] = await pool.query(`
                SELECT department_id, department_name
                FROM departments
                ORDER BY department_name ASC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    }

    // Get employees by department
    static async getEmployeesByDepartment(departmentId) {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    e.employee_id,
                    e.employee_code,
                    e.full_name,
                    e.position,
                    e.status
                FROM employees e
                WHERE e.department_id = ?
                ORDER BY e.full_name ASC
            `, [departmentId]);
            return rows;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = EmployeeModel;
