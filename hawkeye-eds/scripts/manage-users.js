// scripts/manage-users.js - Updated to show saved data

document.addEventListener('DOMContentLoaded', function() {
    createDeleteModal();
    setupBasicNavigation();
    loadCurrentUserData();
});

// Load and display current user data
function loadCurrentUserData() {
    const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Default data if nothing saved
    const defaultData = {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@web-slate.com',
        username: 'jonny77',
        phone: '+44 20 7123 4567',
        status: 'active'
    };
    
    const user = { ...defaultData, ...userData };
    
    // Update form fields
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const statusSelect = document.getElementById('status');
    
    if (fullNameInput) fullNameInput.value = `${user.firstName} ${user.lastName}`;
    if (emailInput) emailInput.value = user.email;
    if (usernameInput) usernameInput.value = user.username;
    
    if (statusSelect) {
        statusSelect.value = user.status || 'active';
        updateStatusColor(statusSelect);
    }
}

// Update status dropdown color
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

// Create the delete modal
function createDeleteModal() {
    const modalHTML = `
        <div id="deleteModal" class="modal-overlay" style="display: none;">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Delete User</h3>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-cancel" onclick="closeDeleteModal()">Cancel</button>
                    <button class="btn btn-delete" onclick="confirmDelete()">Yes, Delete</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    const modalStyles = `
        <style>
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        }
        
        .modal-container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            max-width: 400px;
            width: 90%;
            overflow: hidden;
        }
        
        .modal-header {
            padding: 20px 20px 0 20px;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }
        
        .modal-body {
            padding: 15px 20px 20px 20px;
        }
        
        .modal-body p {
            margin: 0;
            color: #666;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .modal-actions {
            padding: 0 20px 20px 20px;
            display: flex;
            gap: 12px;
            justify-content: flex-end;
        }
        
        .modal-actions .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            min-width: 80px;
        }
        
        .btn-cancel {
            background: #f8f9fa;
            color: #666;
            border: 1px solid #ddd;
        }
        
        .btn-cancel:hover {
            background: #e9ecef;
        }
        
        .btn-delete {
            background: #dc3545;
            color: white;
        }
        
        .btn-delete:hover {
            background: #c82333;
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
}

// Basic navigation setup
function setupBasicNavigation() {
    // Header icons
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
    window.location.href = 'index.html';
}

function goToIndex() {
    window.location.href = 'index.html';
}

function goToEditUser() {
    window.location.href = 'edit-user.html';
}

// Modal functions (called from HTML onclick)
function showDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function confirmDelete() {
    closeDeleteModal();
    showNotification('User deleted successfully', 'success');
    
    // Clear user data
    localStorage.removeItem('currentUser');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Simple notification function
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

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('deleteModal');
    if (e.target === modal) {
        closeDeleteModal();
    }
});