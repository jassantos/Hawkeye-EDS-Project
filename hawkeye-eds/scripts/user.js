// scripts/main.js 

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadUserData();
    initializeTeamDropdowns();
});

function initializeApp() {
    setupSearchFunctionality();
    setupTableInteractions();
    setupNavigation();
}

// Team's dropdown functionality
function initializeTeamDropdowns() {
    const settingsBtn = document.getElementById("settingsBtn");
    const notifyBtn = document.getElementById("notifyBtn");
    const settingsDropdown = document.getElementById("settingsDropdown");
    const notifyDropdown = document.getElementById("notifyDropdown");

    if (settingsBtn && settingsDropdown) {
        settingsBtn.onclick = (e) => {
            e.stopPropagation();
            settingsDropdown.style.display =
                settingsDropdown.style.display === "flex" ? "none" : "flex";
            if (notifyDropdown) notifyDropdown.style.display = "none";
        };
    }

    if (notifyBtn && notifyDropdown) {
        notifyBtn.onclick = (e) => {
            e.stopPropagation();
            notifyDropdown.style.display =
                notifyDropdown.style.display === "flex" ? "none" : "flex";
            if (settingsDropdown) settingsDropdown.style.display = "none";
        };
    }

    // Close dropdowns on outside click
    document.addEventListener("click", () => {
        if (settingsDropdown) settingsDropdown.style.display = "none";
        if (notifyDropdown) notifyDropdown.style.display = "none";
    });
}

// Load user data from storage and update the table
function loadUserData() {
    const userList = JSON.parse(localStorage.getItem('userList') || '[]');
    if (userList.length > 0) {
        updateUserTable(userList);
    }
}

// Update the user table with saved data
function updateUserTable(userList) {
    const tableBody = document.querySelector('.users-table tbody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add updated user rows
    userList.forEach((user, index) => {
        const row = createUserRow(user, index + 1);
        tableBody.appendChild(row);
    });
    
    // Reinitialize table interactions for new rows
    setupTableInteractions();
}

// Create a user table row
function createUserRow(user, avatarNumber) {
    const row = document.createElement('tr');
    
    const statusClass = user.status.toLowerCase();
    const statusText = user.status.charAt(0).toUpperCase() + user.status.slice(1);
    
    row.innerHTML = `
        <td><input type="checkbox"></td>
        <td class="user-cell">
            <img src="assets/user${avatarNumber}.jpg" alt="${user.firstName} ${user.lastName}" class="user-avatar-small">
            ${user.firstName} ${user.lastName}
        </td>
        <td>${user.email}</td>
        <td>${user.username || user.firstName.toLowerCase() + (Math.floor(Math.random() * 100))}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>${user.role}</td>
        <td>${user.joinedDate || 'Recently'}</td>
        <td>${user.lastActive || 'Active now'}</td>
        <td class="actions-cell">
            <i class="fas fa-edit action-icon"></i>
            <i class="fas fa-trash action-icon"></i>
        </td>
    `;
    
    return row;
}

// Search Functionality
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.content-search-input');
    const searchButton = document.querySelector('.search-btn');
    const headerSearch = document.querySelector('.search input');
    
    if (searchInput) {
        // Real-time search as you type
        searchInput.addEventListener('input', debounce(function() {
            filterUsersTable(this.value);
        }, 300));
        
        // Search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                filterUsersTable(this.value);
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            if (searchInput) {
                filterUsersTable(searchInput.value);
            }
        });
    }

    if (headerSearch) {
        headerSearch.addEventListener('input', debounce(function() {
            showNotification('Global search feature coming soon', 'info');
        }, 500));
    }
}

// Filter Users Table
function filterUsersTable(searchTerm) {
    const tableBody = document.querySelector('.users-table tbody');
    if (!tableBody) return;
    
    const rows = tableBody.querySelectorAll('tr');
    const term = searchTerm.toLowerCase().trim();
    let visibleCount = 0;
    
    rows.forEach(row => {
        const rowText = row.textContent.toLowerCase();
        
        if (term === '' || rowText.includes(term)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    // Show search notification
    if (term !== '') {
        showNotification(`Found ${visibleCount} of ${rows.length} users matching "${searchTerm}"`, 'info');
    } else {
        showNotification(`Showing all ${rows.length} users`, 'info');
    }
    
    updateSelectAllState();
}

// Table Interactions
function setupTableInteractions() {
    const selectAllCheckbox = document.querySelector('.select-all');
    const rowCheckboxes = document.querySelectorAll('.users-table tbody input[type="checkbox"]');
    const editIcons = document.querySelectorAll('.fa-edit');
    const deleteIcons = document.querySelectorAll('.fa-trash');
    const tableRows = document.querySelectorAll('.users-table tbody tr');

    // Select All functionality
    if (selectAllCheckbox) {
        // Remove existing event listeners
        selectAllCheckbox.replaceWith(selectAllCheckbox.cloneNode(true));
        const newSelectAllCheckbox = document.querySelector('.select-all');
        
        newSelectAllCheckbox.addEventListener('change', function() {
            const currentRowCheckboxes = document.querySelectorAll('.users-table tbody input[type="checkbox"]');
            currentRowCheckboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }

    // Individual row selection
    rowCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checkedBoxes = document.querySelectorAll('.users-table tbody input[type="checkbox"]:checked');
            const allCheckboxes = document.querySelectorAll('.users-table tbody input[type="checkbox"]');
            const newSelectAllCheckbox = document.querySelector('.select-all');
            
            if (newSelectAllCheckbox) {
                newSelectAllCheckbox.checked = checkedBoxes.length === allCheckboxes.length;
                newSelectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < allCheckboxes.length;
            }
        });
    });

    // Make table rows clickable (navigate to manage users page)
    tableRows.forEach((row, index) => {
        row.addEventListener('click', function(e) {
            // Don't navigate if clicking on action buttons or checkboxes
            if (e.target.closest('.actions-cell') || 
                e.target.type === 'checkbox' || 
                e.target.tagName === 'INPUT') {
                return;
            }
            
            // Store the clicked user's data
            storeCurrentUserData(index);
            
            // Navigate to manage users page
            console.log('Row clicked, navigating to manage-users.html');
            window.location.href = 'manage-users.html';
        });
        
        // Add visual feedback
        row.style.cursor = 'pointer';
    });

    // Edit icon clicks
    editIcons.forEach((icon, index) => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            storeCurrentUserData(index);
            window.location.href = 'manage-users.html';
        });
    });

    // Delete icon clicks
    deleteIcons.forEach((icon, index) => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const userName = row.querySelector('.user-cell').textContent.trim();
            
            if (confirm(`Are you sure you want to delete ${userName}?`)) {
                deleteUserFromStorage(index);
                row.remove();
                showNotification('User deleted successfully', 'success');
                updateSelectAllState();
            }
        });
    });
}

// Store current user data for editing
function storeCurrentUserData(index) {
    const userList = JSON.parse(localStorage.getItem('userList') || '[]');
    if (userList[index]) {
        localStorage.setItem('currentUser', JSON.stringify(userList[index]));
    }
}

// Delete user from storage
function deleteUserFromStorage(index) {
    let userList = JSON.parse(localStorage.getItem('userList') || '[]');
    userList.splice(index, 1);
    localStorage.setItem('userList', JSON.stringify(userList));
}

// Navigation Setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.menu li a');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href !== '#') {
                return true;
            }
            
            e.preventDefault();
            const itemText = this.querySelector('span').textContent.trim();
            
            switch (itemText) {
                case 'Dashboard':
                    showNotification('Messages feature coming soon', 'info');
                    break;
                case 'Organizations':
                    window.location.href = 'index.html';
                    break;
                case 'Messages':
                    showNotification('Messages feature coming soon', 'info');
                    break;
                case 'Customer Support':
                    showNotification('Customer Support feature coming soon', 'info');
                    break;
                case 'Ads':
                    showNotification('Ads feature coming soon', 'info');
                    break;
                case 'Personnel':
                    showNotification('Personnel feature coming soon', 'info');
                    break;
                case 'Settings':
                    showNotification('Settings feature coming soon', 'info');
                    break;
            }
        });
    });
}

// Update Select All State
function updateSelectAllState() {
    const selectAllCheckbox = document.querySelector('.select-all');
    const visibleCheckboxes = Array.from(document.querySelectorAll('.users-table tbody tr:not([style*="display: none"]) input[type="checkbox"]'));
    const checkedVisibleBoxes = visibleCheckboxes.filter(checkbox => checkbox.checked);
    
    if (selectAllCheckbox && visibleCheckboxes.length > 0) {
        selectAllCheckbox.checked = checkedVisibleBoxes.length === visibleCheckboxes.length;
        selectAllCheckbox.indeterminate = checkedVisibleBoxes.length > 0 && checkedVisibleBoxes.length < visibleCheckboxes.length;
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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
        font-weight: 500;
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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.content-search-input');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        const searchInput = document.querySelector('.content-search-input');
        if (searchInput && searchInput.value) {
            searchInput.value = '';
            filterUsersTable('');
        }
    }
});

// Make functions available globally
window.showNotification = showNotification;
window.filterUsersTable = filterUsersTable;