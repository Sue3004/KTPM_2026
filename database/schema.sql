-- Create database for Employee Management System
CREATE DATABASE IF NOT EXISTS employee_management;
USE employee_management;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;

-- Create departments table
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create employees table
CREATE TABLE employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK(gender IN ('Nam', 'Nữ')),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department_id INT NOT NULL,
    position VARCHAR(100) NOT NULL,
    hire_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'Đang làm việc' CHECK(status IN ('Đang làm việc', 'Nghỉ việc', 'Tạm dừng')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE RESTRICT
);

-- Insert sample departments
INSERT INTO departments (department_name) VALUES 
('IT'),
('HR'),
('Finance'),
('Sales'),
('Marketing'),
('Operations');

-- Insert sample employees
INSERT INTO employees (employee_code, full_name, birth_date, gender, phone, email, department_id, position, hire_date, status) VALUES
('NV001', 'Nguyễn Văn A', '1990-05-15', 'Nam', '0912345678', 'nguyenvan.a@company.com', 1, 'Developer', '2020-01-10', 'Đang làm việc'),
('NV002', 'Trần Thị B', '1992-08-22', 'Nữ', '0987654321', 'tranthib@company.com', 2, 'HR Manager', '2019-03-15', 'Đang làm việc'),
('NV003', 'Lê Minh C', '1988-12-03', 'Nam', '0901234567', 'leminc@company.com', 3, 'Finance Director', '2018-06-20', 'Đang làm việc'),
('NV004', 'Phạm Hồng D', '1995-02-14', 'Nữ', '0923456789', 'phamhongd@company.com', 4, 'Sales Executive', '2021-07-05', 'Đang làm việc'),
('NV005', 'Võ Đình E', '1991-09-11', 'Nam', '0934567890', 'vodinhе@company.com', 5, 'Marketing Manager', '2020-11-01', 'Đang làm việc');

-- Create indexes for better query performance
CREATE INDEX idx_employee_code ON employees(employee_code);
CREATE INDEX idx_email ON employees(email);
CREATE INDEX idx_department_id ON employees(department_id);
CREATE INDEX idx_status ON employees(status);
