const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');

// Get all employees
router.get('/', EmployeeController.getAllEmployees);

// Search employees
router.get('/search', EmployeeController.searchEmployees);

// Get departments
router.get('/departments/list', EmployeeController.getDepartments);

// Get employees by department
router.get('/department/:departmentId', EmployeeController.getEmployeesByDepartment);

// Get single employee
router.get('/:id', EmployeeController.getEmployee);

// Create employee
router.post('/', EmployeeController.createEmployee);

// Update employee
router.put('/:id', EmployeeController.updateEmployee);

// Delete employee
router.delete('/:id', EmployeeController.deleteEmployee);

module.exports = router;
