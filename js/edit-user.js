// scripts/edit-user.js - With data persistence

document.addEventListener('DOMContentLoaded', function() {
    initializeEditUserPage();
    loadUserData();
});

function initializeEditUserPage() {
    setupFormValidation();
    setupStatusDropdown();
    setupBasicNavigation();
    console.log('Edit User page initialized');
}

// Load user data from storage or use defaults
function loadUserData() {
    const userData = getUserData();
    populateForm(userData);
}

function getUserData() {
    const savedData = localStorage.getItem('currentUser');
    if (savedData) {
        return JSON.parse(savedData);
    }
    
    // Default user data if none saved
    return {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@gmail.com',
        phone: '+44 20 7123 4567',
        role: 'admin',
        status: 'active',
        month: 'september',
        day: '20',
        year: '2023'
    };
}

function populateForm(userData) {
    document.getElementById('firstName').value = userData.firstName || 'John';
    document.getElementById('lastName').value = userData.lastName || 'Smith';
    document.getElementById('emailEdit').value = userData.email || 'john.smith@gmail.com';
    document.querySelector('.phone-field').value = userData.phone || '+44 20 7123 4567';
    document.getElementById('role').value = userData.role || 'admin';
    document.getElementById('statusEdit').value = userData.status || 'active';
    document.getElementById('month').value = userData.month || 'september';
    document.getElementById('day').value = userData.day || '20';
    document.getElementById('year').value = userData.year || '2023';
    
    // Update status color
    updateStatusColor(document.getElementById('statusEdit'));
}

// Form Validation
function setupFormValidation() {
    const form = document.querySelector('.edit-user-form');
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 5px;
    `;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#dc3545';
}

function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '#ddd';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Status Dropdown Styling
function setupStatusDropdown() {
    const statusSelect = document.getElementById('statusEdit');
    if (statusSelect) {
        statusSelect.addEventListener('change', function() {
            updateStatusColor(this);
        });
        
        // Initialize with correct color
        updateStatusColor(statusSelect);
    }
}

function updateStatusColor(select) {
    const value = select.value;
    const colors = {
        'active': '#27ae60',
        'inactive': '#e67e22', 
        'pending': '#2c3e50',
        'disabled': '#c0392b',
        'suspended': '#e67e22'
    };
    
    select.style.backgroundColor = colors[value] || colors.active;
}

// Navigation Functions
function setupBasicNavigation() {
    const settingsIcon = document.querySelector('.settings-icon');
    const notificationIcon = document.querySelector('.notification-icon');
    
    if (settingsIcon) {
        settingsIcon.addEventListener('click', function() {
            showNotification('Settings coming soon', 'info');
        });
    }
    
    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            showNotification('You have 4 notifications', 'info');
        });
    }
}

// Navigation functions (called from HTML onclick)
function goBack() {
    window.location.href = 'manage-users.html';
}

function goToIndex() {
    window.location.href = 'index.html';
}

function goToManageUsers() {
    window.location.href = 'manage-users.html';
}

function cancelEdit() {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
        window.location.href = 'manage-users.html';
    }
}

// Save User Changes - WITH DATA PERSISTENCE
function saveUserChanges(event) {
    event.preventDefault();
    
    const form = event.target;
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Validate all required fields
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly', 'error');
        return;
    }
    
    // Show loading state
    const saveBtn = form.querySelector('button[type="submit"]');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    showNotification('Saving user changes...', 'info');
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('emailEdit').value,
        phone: document.querySelector('.phone-field').value,
        role: document.getElementById('role').value,
        status: document.getElementById('statusEdit').value,
        month: document.getElementById('month').value,
        day: document.getElementById('day').value,
        year: document.getElementById('year').value
    };
    
    // Simulate API call
    setTimeout(() => {
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(formData));
        
        // Also update the user list data
        updateUserInList(formData);
        
        console.log('User data saved:', formData);
        
        // Restore button
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
        
        showNotification('User updated successfully!', 'success');
        
        // Redirect back to manage users after delay
        setTimeout(() => {
            window.location.href = 'manage-users.html';
        }, 1500);
        
    }, 2000);
}

// Update user in the user list storage
function updateUserInList(userData) {
    // Get existing users or create default list
    let userList = JSON.parse(localStorage.getItem('userList') || '[]');
    
    if (userList.length === 0) {
        // Initialize with default users if empty
        userList = [
            {
                id: 1,
                firstName: 'John',
                lastName: 'Smith',
                email: 'john.smith@gmail.com',
                username: 'jonny77',
                status: 'active',
                role: 'Admin',
                joinedDate: 'March 12, 2023',
                lastActive: '1 minute ago'
            },
            {
                id: 2,
                firstName: 'Olivia',
                lastName: 'Bennett',
                email: 'ollybon@gmail.com',
                username: 'olly659',
                status: 'inactive',
                role: 'Teacher',
                joinedDate: 'June 27, 2022',
                lastActive: '1 month ago'
            },
            {
                id: 3,
                firstName: 'Daniel',
                lastName: 'Warren',
                email: 'dwarren3@gmail.com',
                username: 'dwarren3',
                status: 'disabled',
                role: 'Teacher',
                joinedDate: 'January 8, 2024',
                lastActive: '4 days ago'
            },
            {
                id: 4,
                firstName: 'Chloe',
                lastName: 'Hayes',
                email: 'chloehye@gmail.com',
                username: 'chloehh',
                status: 'pending',
                role: 'Manager',
                joinedDate: 'October 5, 2021',
                lastActive: '10 days ago'
            },
            {
                id: 5,
                firstName: 'Marcus',
                lastName: 'Reed',
                email: 'reeds777@gmail.com',
                username: 'reeds7',
                status: 'suspended',
                role: 'Employee',
                joinedDate: 'February 19, 2023',
                lastActive: '3 months ago'
            },
            {
                id: 6,
                firstName: 'Emma',
                lastName: 'Wilson',
                email: 'emma.wilson@gmail.com',
                username: 'emmaw85',
                status: 'active',
                role: 'Manager',
                joinedDate: 'May 15, 2024',
                lastActive: '2 hours ago'
            },
            {
                id: 7,
                firstName: 'David',
                lastName: 'Brown',
                email: 'david.brown@gmail.com',
                username: 'dbrown92',
                status: 'pending',
                role: 'Security Guard',
                joinedDate: 'August 3, 2024',
                lastActive: '5 days ago'
            }
        ];
    }
    
    // Update the first user (John Smith) with new data
    const userIndex = userList.findIndex(user => user.id === 1);
    if (userIndex !== -1) {
        userList[userIndex] = {
            ...userList[userIndex],
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            status: userData.status,
            role: userData.role
        };
    }
    
    // Save updated list
    localStorage.setItem('userList', JSON.stringify(userList));
}

// Password action buttons
document.addEventListener('DOMContentLoaded', function() {
    const resetPasswordBtn = document.querySelector('.password-actions .btn-info:first-child');
    const unlockUserBtn = document.querySelector('.password-actions .btn-info:last-child');
    
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset the password for this user?')) {
                showNotification('Password reset email sent to user', 'success');
            }
        });
    }
    
    if (unlockUserBtn) {
        unlockUserBtn.addEventListener('click', function() {
            showNotification('User account unlocked successfully', 'success');
        });
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const bgColors = {
        success: '#27ae60',
        error: '#c0392b',
        info: '#3498db',
        warning: '#f39c12'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${bgColors[type] || bgColors.info};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 9999;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        max-width: 300px;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}