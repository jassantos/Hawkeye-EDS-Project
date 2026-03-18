// Edit User Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Edit-user.js loaded');
    checkIfNewUser();
    loadUserData();
    setupEventListeners();
    setupPasswordStrength();
});

// Check if we're creating a new user
function checkIfNewUser() {
    const isNewUser = localStorage.getItem('newUserMode') === 'true';
    const pageTitle = document.querySelector('.breadcrumb-title');
    
    if (isNewUser) {
        if (pageTitle) {
            pageTitle.textContent = 'Add New User';
        }
        setupNewUserForm();
    }
}

// Load user data from localStorage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('editingUser') || '{}');
    
    // If no user data, check if we're creating a new user
    if (Object.keys(userData).length === 0) {
        return;
    }
    
    console.log('Loading user data:', userData);
    
    // Populate form fields
    document.getElementById('firstName').value = userData.firstName || '';
    document.getElementById('lastName').value = userData.lastName || '';
    document.getElementById('emailEdit').value = userData.email || '';
    document.getElementById('username').value = userData.username || '';
    document.getElementById('phone').value = userData.phone || '+1 (555) 123-4567';
    
    // Set role
    const roleSelect = document.getElementById('role');
    if (userData.role && roleSelect) {
        for (let i = 0; i < roleSelect.options.length; i++) {
            if (roleSelect.options[i].value.toLowerCase() === userData.role.toLowerCase()) {
                roleSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    // Set status
    const statusSelect = document.getElementById('statusEdit');
    if (userData.status && statusSelect) {
        for (let i = 0; i < statusSelect.options.length; i++) {
            if (statusSelect.options[i].value.toLowerCase() === userData.status.toLowerCase()) {
                statusSelect.selectedIndex = i;
                break;
            }
        }
    }
    
    // Update status color
    updateStatusColor();
}

// Setup new user form (clear all fields)
function setupNewUserForm() {
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('emailEdit').value = '';
    document.getElementById('username').value = '';
    document.getElementById('phone').value = '';
    
    // Set default selections
    document.getElementById('role').selectedIndex = 0;
    document.getElementById('statusEdit').selectedIndex = 0;
    
    // Update status color for default (active)
    updateStatusColor();
}

// Setup all event listeners
function setupEventListeners() {
    const form = document.getElementById('editUserForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    const statusSelect = document.getElementById('statusEdit');
    if (statusSelect) {
        statusSelect.addEventListener('change', updateStatusColor);
    }
    
    const resetBtn = document.getElementById('resetPasswordBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', handleResetPassword);
    }
    
    const unlockBtn = document.getElementById('unlockUserBtn');
    if (unlockBtn) {
        unlockBtn.addEventListener('click', handleUnlockUser);
    }
    
    // Real-time validation
    const emailInput = document.getElementById('emailEdit');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('blur', validatePhone);
    }
}

// Update status dropdown color based on selection
function updateStatusColor() {
    const statusSelect = document.getElementById('statusEdit');
    if (!statusSelect) return;
    
    const value = statusSelect.value;
    const colors = {
        'active': '#e8f5e9',
        'inactive': '#fff3e0',
        'pending': '#e3f2fd',
        'disabled': '#ffebee',
        'suspended': '#f3e5f5'
    };
    const textColors = {
        'active': '#388e3c',
        'inactive': '#f57c00',
        'pending': '#1976d2',
        'disabled': '#d32f2f',
        'suspended': '#7b1fa2'
    };
    
    statusSelect.style.backgroundColor = colors[value] || '#e8f5e9';
    statusSelect.style.color = textColors[value] || '#388e3c';
    statusSelect.style.fontWeight = '500';
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('emailEdit').value.trim();
    const username = document.getElementById('username').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const role = document.getElementById('role').value;
    const status = document.getElementById('statusEdit').value;
    
    // Validate required fields
    if (!firstName || !lastName || !email) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Validate email
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Validate phone (optional)
    if (phone && !isValidPhone(phone)) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('hawkeye_users') || '[]');
    
    // Check if editing existing user or creating new
    const editingUser = JSON.parse(localStorage.getItem('editingUser') || '{}');
    const isNewUser = localStorage.getItem('newUserMode') === 'true';
    
    if (editingUser.id && !isNewUser) {
        // Update existing user
        const index = users.findIndex(u => u.id === editingUser.id);
        if (index !== -1) {
            users[index] = {
                ...users[index],
                firstName,
                lastName,
                email,
                username: username || generateUsername(firstName, lastName),
                phone,
                role,
                status,
                lastActive: 'Just now'
            };
            showNotification('User updated successfully!', 'success');
        }
    } else {
        // Create new user
        const newUser = {
            id: generateUserId(users),
            firstName,
            lastName,
            email,
            username: username || generateUsername(firstName, lastName),
            phone: phone || '',
            status,
            role,
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            lastActive: 'Just now',
            avatar: 'assets/4.png'
        };
        users.push(newUser);
        showNotification('New user created successfully!', 'success');
    }
    
    // Save to localStorage
    localStorage.setItem('hawkeye_users', JSON.stringify(users));
    
    // Clear editing data and new user mode
    localStorage.removeItem('editingUser');
    localStorage.removeItem('newUserMode');
    
    // Redirect back to user list
    setTimeout(() => {
        window.location.href = 'user.html';
    }, 1500);
}

// Generate unique user ID
function generateUserId(users) {
    const maxId = users.reduce((max, user) => {
        const num = parseInt(user.id.split('-')[1]) || 0;
        return Math.max(max, num);
    }, 0);
    
    const newNum = maxId + 1;
    return `USR-${String(newNum).padStart(3, '0')}`;
}

// Generate username from name
function generateUsername(firstName, lastName) {
    const base = (firstName + lastName).toLowerCase().replace(/[^a-z]/g, '');
    const random = Math.floor(Math.random() * 1000);
    return base + random;
}

// Validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate phone number
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone);
}

// Validate email field
function validateEmail() {
    const email = document.getElementById('emailEdit').value.trim();
    const errorElement = document.getElementById('emailError') || createErrorElement('emailEdit');
    
    if (!email) {
        showFieldError('emailEdit', 'Email is required', errorElement);
        return false;
    } else if (!isValidEmail(email)) {
        showFieldError('emailEdit', 'Please enter a valid email address', errorElement);
        return false;
    } else {
        hideFieldError('emailEdit', errorElement);
        return true;
    }
}

// Validate phone field
function validatePhone() {
    const phone = document.getElementById('phone').value.trim();
    const errorElement = document.getElementById('phoneError') || createErrorElement('phone');
    
    if (phone && !isValidPhone(phone)) {
        showFieldError('phone', 'Please enter a valid phone number', errorElement);
        return false;
    } else {
        hideFieldError('phone', errorElement);
        return true;
    }
}

// Create error element for a field
function createErrorElement(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.createElement('div');
    errorDiv.id = fieldId + 'Error';
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #d32f2f;
        font-size: 12px;
        margin-top: 4px;
    `;
    field.parentNode.appendChild(errorDiv);
    return errorDiv;
}

// Show field error
function showFieldError(fieldId, message, errorElement) {
    const field = document.getElementById(fieldId);
    field.style.borderColor = '#d32f2f';
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Hide field error
function hideFieldError(fieldId, errorElement) {
    const field = document.getElementById(fieldId);
    field.style.borderColor = '#d1d5db';
    errorElement.style.display = 'none';
}

// Handle reset password
function handleResetPassword() {
    const email = document.getElementById('emailEdit').value.trim();
    
    if (!email) {
        showNotification('Please enter an email address first', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to reset the password for ${email}?`)) {
        showNotification(`Password reset email sent to ${email}`, 'success');
    }
}

// Handle unlock user
function handleUnlockUser() {
    const firstName = document.getElementById('firstName').value.trim();
    
    if (!firstName) {
        showNotification('Please enter user information first', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to unlock this user account?`)) {
        // Change status to active
        const statusSelect = document.getElementById('statusEdit');
        if (statusSelect) {
            statusSelect.value = 'active';
            updateStatusColor();
        }
        showNotification('User account unlocked successfully', 'success');
    }
}

// Setup password strength indicator
function setupPasswordStrength() {
    // This would be used if we add password fields to edit user
    console.log('Password strength indicator ready');
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.edit-user-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `edit-user-notification ${type}`;
    
    const colors = {
        success: '#4CAF50',
        error: '#f44336',
        info: '#2196F3',
        warning: '#ff9800'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 9999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
        font-size: 14px;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations if not present
if (!document.getElementById('edit-user-styles')) {
    const style = document.createElement('style');
    style.id = 'edit-user-styles';
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}