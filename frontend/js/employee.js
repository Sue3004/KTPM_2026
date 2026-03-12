// API Configuration
const API_BASE_URL = '/api';

// ============================================
// ALERT FUNCTIONS
// ============================================

function showAlert(type, message, duration = 5000) {
    const alertId = `alert${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}`;
    const alertElement = document.getElementById(alertId);
    
    if (alertElement) {
        alertElement.innerHTML = message;
        alertElement.classList.add('active');
        
        if (duration > 0) {
            setTimeout(() => {
                alertElement.classList.remove('active');
            }, duration);
        }
    }
}

function closeAlert(type) {
    const alertId = `alert${type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()}`;
    const alertElement = document.getElementById(alertId);
    if (alertElement) {
        alertElement.classList.remove('active');
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
});

// ============================================
// FORM VALIDATION
// ============================================

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    return phoneRegex.test(phone);
}

function validateEmployeeCode(code) {
    return code && code.length > 0 && code.length <= 20;
}

// ============================================
// EMPLOYEE LIST PAGE FUNCTIONS
// ============================================

// Load all employees
async function loadEmployees() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees`);
        
        if (!response.ok) {
            throw new Error('Lỗi khi tải danh sách nhân viên');
        }
        
        const data = await response.json();
        
        if (data.success) {
            displayEmployees(data.data);
            updateStatistics(data.data);
        } else {
            showAlert('error', 'Lỗi: ' + data.message);
        }
    } catch (error) {
        console.error('Error loading employees:', error);
        showAlert('error', 'Không thể tải danh sách nhân viên: ' + error.message);
    }
}

// Display employees in table
function displayEmployees(employees) {
    const tableBody = document.getElementById('employeeTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (!tableBody) return;
    
    if (employees.length === 0) {
        tableBody.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    tableBody.innerHTML = employees.map(emp => `
        <tr>
            <td><strong>${escapeHtml(emp.employee_code)}</strong></td>
            <td>${escapeHtml(emp.full_name)}</td>
            <td>${escapeHtml(emp.department_name || 'N/A')}</td>
            <td>${escapeHtml(emp.position)}</td>
            <td>${escapeHtml(emp.phone)}</td>
            <td>${escapeHtml(emp.email)}</td>
            <td>
                <span style="
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    ${emp.status === 'Đang làm việc' ? 'background-color: #d4edda; color: #155724;' : ''}
                    ${emp.status === 'Nghỉ việc' ? 'background-color: #f8d7da; color: #721c24;' : ''}
                    ${emp.status === 'Tạm dừng' ? 'background-color: #fff3cd; color: #856404;' : ''}
                ">
                    ${escapeHtml(emp.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-custom" onclick="viewEmployee(${emp.employee_id})">
                        Xem
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="editEmployee(${emp.employee_id})">
                        Sửa
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${emp.employee_id}, '${escapeHtml(emp.full_name)}')">
                        Xóa
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// View employee details
async function viewEmployee(employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`);
        const data = await response.json();
        
        if (data.success) {
            const emp = data.data;
            const viewContent = document.getElementById('viewContent');
            const birthDate = new Date(emp.birth_date);
            const hireDate = new Date(emp.hire_date);
            
            viewContent.innerHTML = `
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background-color: var(--light-bg);">
                        <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600;">Mã Nhân Viên</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">${escapeHtml(emp.employee_code)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600;">Họ Tên</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">${escapeHtml(emp.full_name)}</td>
                    </tr>
                    <tr style="background-color: var(--light-bg);">
                        <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600;">Ngày Sinh</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">${formatDate(birthDate)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600;">Giới Tính</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">${escapeHtml(emp.gender)}</td>
                    </tr>
                    <tr style="background-color: var(--light-bg);">
                        <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600;">Số Điện Thoại</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">${escapeHtml(emp.phone)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600;">Email</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">${escapeHtml(emp.email)}</td>
                    </tr>
                    <tr style="background-color: var(--light-bg);">
                        <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600;">Phòng Ban</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">${escapeHtml(emp.department_name)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600;">Chức Vụ</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">${escapeHtml(emp.position)}</td>
                    </tr>
                    <tr style="background-color: var(--light-bg);">
                        <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600;">Ngày Vào Làm</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">${formatDate(hireDate)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid var(--border-color); font-weight: 600;">Trạng Thái</td>
                        <td style="padding: 10px; border: 1px solid var(--border-color);">
                            <span style="
                                padding: 4px 8px;
                                border-radius: 4px;
                                font-size: 12px;
                                font-weight: 500;
                                ${emp.status === 'Đang làm việc' ? 'background-color: #d4edda; color: #155724;' : ''}
                                ${emp.status === 'Nghỉ việc' ? 'background-color: #f8d7da; color: #721c24;' : ''}
                                ${emp.status === 'Tạm dừng' ? 'background-color: #fff3cd; color: #856404;' : ''}
                            ">
                                ${escapeHtml(emp.status)}
                            </span>
                        </td>
                    </tr>
                </table>
            `;
            
            // Store employee ID for edit action
            document.getElementById('editBtn').setAttribute('data-employee-id', employeeId);
            
            openModal('viewModal');
        } else {
            showAlert('error', 'Lỗi: ' + data.message);
        }
    } catch (error) {
        console.error('Error viewing employee:', error);
        showAlert('error', 'Không thể tải chi tiết nhân viên: ' + error.message);
    }
}

// Edit from view modal
async function editFromView() {
    const employeeId = document.getElementById('editBtn').getAttribute('data-employee-id');
    closeModal('viewModal');
    await editEmployee(employeeId);
}

// Edit employee
async function editEmployee(employeeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`);
        const data = await response.json();
        
        if (data.success) {
            const emp = data.data;
            
            // Populate form fields
            document.getElementById('editEmployeeId').value = employeeId;
            document.getElementById('editFullName').value = emp.full_name;
            document.getElementById('editBirthDate').value = emp.birth_date;
            document.getElementById('editPhone').value = emp.phone;
            document.getElementById('editEmail').value = emp.email;
            document.getElementById('editPosition').value = emp.position;
            document.getElementById('editHireDate').value = emp.hire_date;
            document.getElementById('editStatus').value = emp.status;
            
            // Set gender radio
            document.querySelector(`input[name="editGender"][value="${emp.gender}"]`).checked = true;
            
            // Load departments and select current
            await loadEditDepartments(emp.department_id);
            
            openModal('editModal');
        } else {
            showAlert('error', 'Lỗi: ' + data.message);
        }
    } catch (error) {
        console.error('Error loading employee for edit:', error);
        showAlert('error', 'Không thể tải thông tin nhân viên: ' + error.message);
    }
}

// Load departments for edit form
async function loadEditDepartments(selectedId = null) {
    try {
        const response = await fetch(`${API_BASE_URL}/employees/departments/list`);
        const data = await response.json();
        
        if (data.success) {
            const select = document.getElementById('editDepartment');
            select.innerHTML = data.data.map(dept => 
                `<option value="${dept.department_id}" ${dept.department_id == selectedId ? 'selected' : ''}>
                    ${escapeHtml(dept.department_name)}
                </option>`
            ).join('');
        }
    } catch (error) {
        console.error('Error loading departments for edit:', error);
        showAlert('error', 'Lỗi khi tải danh sách phòng ban');
    }
}

// Update employee
async function handleUpdateEmployee(event) {
    event.preventDefault();
    
    const employeeId = document.getElementById('editEmployeeId').value;
    const fullName = document.getElementById('editFullName').value.trim();
    const birthDate = document.getElementById('editBirthDate').value;
    const gender = document.querySelector('input[name="editGender"]:checked').value;
    const phone = document.getElementById('editPhone').value.trim();
    const email = document.getElementById('editEmail').value.trim();
    const departmentId = document.getElementById('editDepartment').value;
    const position = document.getElementById('editPosition').value.trim();
    const hireDate = document.getElementById('editHireDate').value;
    const status = document.getElementById('editStatus').value;
    
    // Validation
    const errors = [];
    if (!fullName) errors.push('Họ tên không được bỏ trống');
    if (!validatePhone(phone)) errors.push('Số điện thoại không hợp lệ');
    if (!validateEmail(email)) errors.push('Email không hợp lệ');
    if (!position) errors.push('Chức vụ không được bỏ trống');
    
    if (errors.length > 0) {
        showAlert('error', errors.join('<br>'));
        return;
    }
    
    try {
        const submitBtn = document.querySelector('#editForm button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Đang cập nhật...';
        
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_name: fullName,
                birth_date: birthDate,
                gender: gender,
                phone: phone,
                email: email,
                department_id: departmentId,
                position: position,
                hire_date: hireDate,
                status: status
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('success', '✓ ' + data.message);
            closeModal('editModal');
            loadEmployees();
        } else {
            showAlert('error', 'Lỗi: ' + (data.errors ? data.errors.join('<br>') : data.message));
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        showAlert('error', 'Lỗi khi cập nhật nhân viên: ' + error.message);
    } finally {
        const submitBtn = document.querySelector('#editForm button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Cập Nhật';
    }
}

// Delete employee - Show confirmation
function deleteEmployee(employeeId, employeeName) {
    document.getElementById('deleteEmployeeName').textContent = employeeName;
    document.getElementById('confirmDeleteBtn').setAttribute('data-employee-id', employeeId);
    openModal('deleteModal');
}

// Confirm delete
async function confirmDelete() {
    const employeeId = document.getElementById('confirmDeleteBtn').getAttribute('data-employee-id');
    
    try {
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<span class="spinner"></span> Đang xóa...';
        
        const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('success', '✓ ' + data.message);
            closeModal('deleteModal');
            loadEmployees();
        } else {
            showAlert('error', 'Lỗi: ' + data.message);
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
        showAlert('error', 'Lỗi khi xóa nhân viên: ' + error.message);
    } finally {
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = 'Xóa';
    }
}

// Search employees
let searchTimeout;
async function handleSearch() {
    clearTimeout(searchTimeout);
    const searchTerm = document.getElementById('searchInput').value.trim();
    
    if (!searchTerm) {
        loadEmployees();
        return;
    }
    
    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/employees/search?q=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();
            
            if (data.success) {
                displayEmployees(data.data);
            } else {
                showAlert('error', 'Lỗi: ' + data.message);
            }
        } catch (error) {
            console.error('Error searching employees:', error);
            showAlert('error', 'Lỗi khi tìm kiếm: ' + error.message);
        }
    }, 300);
}

// Update statistics
function updateStatistics(employees) {
    const statsContainer = document.getElementById('statistics');
    if (!statsContainer) return;
    
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'Đang làm việc').length;
    const departments = new Set(employees.map(e => e.department_name)).size;
    
    statsContainer.innerHTML = `
        <div style="padding: 15px; background-color: var(--light-bg); border-radius: 4px; border-left: 4px solid var(--primary-color);">
            <h4 style="margin: 0 0 10px 0; color: var(--primary-color);">Tổng Nhân Viên</h4>
            <div style="font-size: 24px; font-weight: 600; color: #333;">${totalEmployees}</div>
        </div>
        <div style="padding: 15px; background-color: var(--light-bg); border-radius: 4px; border-left: 4px solid var(--success-color);">
            <h4 style="margin: 0 0 10px 0; color: var(--success-color);">Đang Làm Việc</h4>
            <div style="font-size: 24px; font-weight: 600; color: #333;">${activeEmployees}</div>
        </div>
        <div style="padding: 15px; background-color: var(--light-bg); border-radius: 4px; border-left: 4px solid var(--info-color);">
            <h4 style="margin: 0 0 10px 0; color: var(--info-color);">Phòng Ban</h4>
            <div style="font-size: 24px; font-weight: 600; color: #333;">${departments}</div>
        </div>
    `;
}

// ============================================
// ADD EMPLOYEE PAGE FUNCTIONS
// ============================================

// Load departments for add form
async function loadDepartments() {
    try {
        const response = await fetch(`${API_BASE_URL}/employees/departments/list`);
        const data = await response.json();
        
        if (data.success) {
            const select = document.getElementById('department');
            if (select) {
                select.innerHTML = '<option value="">-- Chọn phòng ban --</option>' +
                    data.data.map(dept => 
                        `<option value="${dept.department_id}">
                            ${escapeHtml(dept.department_name)}
                        </option>`
                    ).join('');
            }
        }
    } catch (error) {
        console.error('Error loading departments:', error);
        showAlert('error', 'Lỗi khi tải danh sách phòng ban');
    }
}

// Add employee
async function handleAddEmployee(event) {
    event.preventDefault();
    
    const employeeCode = document.getElementById('employeeCode').value.trim();
    const fullName = document.getElementById('fullName').value.trim();
    const birthDate = document.getElementById('birthDate').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const departmentId = document.getElementById('department').value;
    const position = document.getElementById('position').value.trim();
    const hireDate = document.getElementById('hireDate').value;
    const status = document.getElementById('status').value;
    
    // Validation
    const errors = [];
    if (!employeeCode || employeeCode.length > 20) errors.push('Mã nhân viên không hợp lệ');
    if (!fullName) errors.push('Họ tên không được bỏ trống');
    if (!validatePhone(phone)) errors.push('Số điện thoại không hợp lệ');
    if (!validateEmail(email)) errors.push('Email không hợp lệ');
    if (!departmentId) errors.push('Phòng ban không được bỏ trống');
    if (!position) errors.push('Chức vụ không được bỏ trống');
    
    if (errors.length > 0) {
        showAlert('error', errors.join('<br>'));
        return;
    }
    
    try {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner"></span> Đang lưu...';
        
        const response = await fetch(`${API_BASE_URL}/employees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                employee_code: employeeCode,
                full_name: fullName,
                birth_date: birthDate,
                gender: gender,
                phone: phone,
                email: email,
                department_id: departmentId,
                position: position,
                hire_date: hireDate,
                status: status
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('success', '✓ ' + data.message);
            document.getElementById('addEmployeeForm').reset();
            
            setTimeout(() => {
                window.location.href = '/pages/employeeList.html ';
            }, 2000);
        } else {
            showAlert('error', 'Lỗi: ' + (data.errors ? data.errors.join('<br>') : data.message));
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        showAlert('error', 'Lỗi khi thêm nhân viên: ' + error.message);
    } finally {
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>✓</span> Lưu Nhân Viên';
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(date) {
    if (!date) return 'N/A';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

function viewStatistics() {

    window.location.href = '/pages/employeeList.html#statistics';

    
}

// ============================================
// PAGE INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Load employees if on employee list page
    if (document.getElementById('employeeTableBody')) {
        loadEmployees();
    }
    
    // Load departments if on add employee page
    if (document.getElementById('department')) {
        loadDepartments();
    }
});
