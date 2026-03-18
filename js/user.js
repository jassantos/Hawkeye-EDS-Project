// User Management for Organizations Page

document.addEventListener('DOMContentLoaded', function() {
    console.log('User.js loaded - initializing...');
    
    // Clear any existing data in the table body to prevent duplication
    const tableBody = document.getElementById('usersTableBody');
    if (tableBody) {
        tableBody.innerHTML = ''; // Clear any static rows
    }
    
    // Initialize user management
    initializeUserData();
    loadAndDisplayUsers();
    setupEventListeners();
    updateUserCount();
});

// User data storage key
const USER_STORAGE_KEY = 'hawkeye_users';

// Default users data
const defaultUsers = [
    {
        id: 'USR-001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@gmail.com',
        username: 'jonny77',
        status: 'active',
        role: 'Admin',
        joinedDate: 'March 12, 2023',
        lastActive: '1 minute ago',
        avatar: 'assets/user1.jpg'
    },
    {
        id: 'USR-002',
        firstName: 'Olivia',
        lastName: 'Bennett',
        email: 'ollybon@gmail.com',
        username: 'olly659',
        status: 'inactive',
        role: 'Teacher',
        joinedDate: 'June 27, 2022',
        lastActive: '1 month ago',
        avatar: 'assets/user2.jpg'
    },
    {
        id: 'USR-003',
        firstName: 'Daniel',
        lastName: 'Warren',
        email: 'dwarren3@gmail.com',
        username: 'dwarren3',
        status: 'disabled',
        role: 'Teacher',
        joinedDate: 'January 8, 2024',
        lastActive: '4 days ago',
        avatar: 'assets/user3.jpg'
    },
    {
        id: 'USR-004',
        firstName: 'Chloe',
        lastName: 'Hayes',
        email: 'chloehye@gmail.com',
        username: 'chloehh',
        status: 'pending',
        role: 'Manager',
        joinedDate: 'October 5, 2021',
        lastActive: '10 days ago',
        avatar: 'assets/user1.jpg'
    },
    {
        id: 'USR-005',
        firstName: 'Marcus',
        lastName: 'Reed',
        email: 'reeds777@gmail.com',
        username: 'reeds7',
        status: 'suspended',
        role: 'Employee',
        joinedDate: 'February 19, 2023',
        lastActive: '3 months ago',
        avatar: 'assets/user2.jpg'
    },
    {
        id: 'USR-006',
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma.wilson@gmail.com',
        username: 'emmaw85',
        status: 'active',
        role: 'Manager',
        joinedDate: 'May 15, 2024',
        lastActive: '2 hours ago',
        avatar: 'assets/user3.jpg'
    },
    {
        id: 'USR-007',
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@gmail.com',
        username: 'dbrown92',
        status: 'pending',
        role: 'Security Guard',
        joinedDate: 'August 3, 2024',
        lastActive: '5 days ago',
        avatar: 'assets/user1.jpg'
    },
    {
        id: 'USR-008',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@school.edu',
        username: 'sarahj',
        status: 'active',
        role: 'Teacher',
        joinedDate: 'September 3, 2023',
        lastActive: '15 minutes ago',
        avatar: 'assets/user2.jpg'
    },
    {
        id: 'USR-009',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'm.chen@hawkeye.com',
        username: 'mchen',
        status: 'active',
        role: 'Admin',
        joinedDate: 'January 15, 2024',
        lastActive: '3 hours ago',
        avatar: 'assets/user3.jpg'
    },
    {
        id: 'USR-010',
        firstName: 'Lisa',
        lastName: 'Thompson',
        email: 'lisa.t@hawkeye.com',
        username: 'lisat',
        status: 'active',
        role: 'Employee',
        joinedDate: 'February 28, 2024',
        lastActive: '1 day ago',
        avatar: 'assets/user1.jpg'
    }
];

// Initialize user data in localStorage if not exists
function initializeUserData() {
    const storedUsers = localStorage.getItem(USER_STORAGE_KEY);
    if (!storedUsers) {
        console.log('Initializing default users in localStorage');
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUsers));
    } else {
        console.log('Users loaded from localStorage');
    }
}

// Load and display users
function loadAndDisplayUsers() {
    const users = getAllUsers();
    renderUsers(users);
}

// Get all users
function getAllUsers() {
    const users = localStorage.getItem(USER_STORAGE_KEY);
    return users ? JSON.parse(users) : defaultUsers;
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

// Get user by ID
function getUserById(userId) {
    const users = getAllUsers();
    return users.find(u => u.id === userId);
}

// Setup all event listeners
function setupEventListeners() {
    setupSearch();
    setupSelectAll();
    setupSorting();
    setupBulkActions();
    setupDropdowns();
    setupAddUserButton();
}

// Setup dropdowns (settings and notifications)
function setupDropdowns() {
    const settingsBtn = document.getElementById('settingsBtn');
    const notifyBtn = document.getElementById('notifyBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');
    const notifyDropdown = document.getElementById('notifyDropdown');

    if (settingsBtn && settingsDropdown) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsDropdown.style.display = settingsDropdown.style.display === 'flex' ? 'none' : 'flex';
            if (notifyDropdown) notifyDropdown.style.display = 'none';
        });
    }

    if (notifyBtn && notifyDropdown) {
        notifyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifyDropdown.style.display = notifyDropdown.style.display === 'flex' ? 'none' : 'flex';
            if (settingsDropdown) settingsDropdown.style.display = 'none';
        });
    }

    document.addEventListener('click', () => {
        if (settingsDropdown) settingsDropdown.style.display = 'none';
        if (notifyDropdown) notifyDropdown.style.display = 'none';
    });
}

// Setup Add User button
function setupAddUserButton() {
    const addUserBtn = document.getElementById('addUserBtn');
    
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            // Clear any existing editing user data
            localStorage.removeItem('editingUser');
            
            // Set flag for new user mode
            localStorage.setItem('newUserMode', 'true');
            
            // Redirect to edit user page
            window.location.href = 'edit-user.html';
        });
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchUsers');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!searchInput || !searchBtn) return;
    
    function filterUsers() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const users = getAllUsers();
        
        if (searchTerm === '') {
            renderUsers(users);
            return;
        }
        
        const filtered = users.filter(user => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            const email = user.email.toLowerCase();
            const username = user.username.toLowerCase();
            const role = user.role.toLowerCase();
            
            return fullName.includes(searchTerm) || 
                   email.includes(searchTerm) || 
                   username.includes(searchTerm) ||
                   role.includes(searchTerm);
        });
        
        renderUsers(filtered);
    }
    
    searchBtn.addEventListener('click', filterUsers);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            filterUsers();
        }
    });
}

// Render users in table
function renderUsers(users) {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    if (users.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align: center; padding: 40px; color: #666;">
                    No users found matching your search.
                </td>
            </tr>
        `;
        return;
    }
    
    users.forEach(user => {
        const row = createUserRow(user);
        tableBody.appendChild(row);
    });
    
    // Re-attach event listeners to new checkboxes
    setupSelectAll();
}

// Create user table row
function createUserRow(user) {
    const tr = document.createElement('tr');
    tr.dataset.userId = user.id;
    
    // Status badge class
    const statusClass = user.status.toLowerCase();
    
    tr.innerHTML = `
        <td><input type="checkbox" class="user-checkbox" data-user-id="${user.id}"></td>
        <td class="user-cell">
            <img src="${user.avatar}" alt="${user.firstName} ${user.lastName}" class="user-avatar-small" onerror="this.src='assets/4.png'">
            ${user.firstName} ${user.lastName}
        </td>
        <td>${user.email}</td>
        <td>${user.username}</td>
        <td><span class="status-badge ${statusClass}">${capitalizeFirst(user.status)}</span></td>
        <td>${user.role}</td>
        <td>${user.joinedDate}</td>
        <td>${user.lastActive}</td>
        <td class="actions-cell">
            <i class="fas fa-edit action-icon" onclick="editUser('${user.id}')"></i>
            <i class="fas fa-trash action-icon" onclick="deleteUser('${user.id}')"></i>
        </td>
    `;
    
    // Make entire row clickable except checkboxes and action icons
    tr.addEventListener('click', function(e) {
        if (!e.target.closest('input[type="checkbox"]') && 
            !e.target.closest('.action-icon')) {
            editUser(user.id);
        }
    });
    
    return tr;
}

// Helper function to capitalize first letter
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Setup select all checkbox
function setupSelectAll() {
    const selectAll = document.querySelector('.select-all');
    const checkboxes = document.querySelectorAll('.user-checkbox');
    
    if (!selectAll) return;
    
    selectAll.addEventListener('change', function() {
        checkboxes.forEach(cb => cb.checked = selectAll.checked);
    });
    
    // Update select all when individual checkboxes change
    checkboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            const allChecked = Array.from(checkboxes).every(c => c.checked);
            selectAll.checked = allChecked;
        });
    });
}

// Setup sorting
function setupSorting() {
    const headers = document.querySelectorAll('.users-table th i.fa-sort');
    
    headers.forEach((icon, index) => {
        const th = icon.parentElement;
        th.style.cursor = 'pointer';
        th.addEventListener('click', () => sortTable(index));
    });
}

// Sort table by column
function sortTable(columnIndex) {
    const users = getAllUsers();
    
    // Sort based on column
    users.sort((a, b) => {
        let aVal, bVal;
        
        switch(columnIndex) {
            case 0: // Checkbox - skip
                return 0;
            case 1: // Name
                aVal = `${a.firstName} ${a.lastName}`;
                bVal = `${b.firstName} ${b.lastName}`;
                break;
            case 2: // Email
                aVal = a.email;
                bVal = b.email;
                break;
            case 3: // Username
                aVal = a.username;
                bVal = b.username;
                break;
            case 4: // Status
                aVal = a.status;
                bVal = b.status;
                break;
            case 5: // Role
                aVal = a.role;
                bVal = b.role;
                break;
            case 6: // Joined Date
                aVal = new Date(a.joinedDate);
                bVal = new Date(b.joinedDate);
                break;
            case 7: // Last Active
                aVal = a.lastActive;
                bVal = b.lastActive;
                break;
            default:
                return 0;
        }
        
        if (aVal < bVal) return -1;
        if (aVal > bVal) return 1;
        return 0;
    });
    
    // Toggle sort direction
    if (localStorage.getItem('sortDirection') === 'asc') {
        users.reverse();
        localStorage.setItem('sortDirection', 'desc');
    } else {
        localStorage.setItem('sortDirection', 'asc');
    }
    
    renderUsers(users);
}

// Setup bulk actions
function setupBulkActions() {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;
    
    // Check if bulk actions already exist
    if (document.querySelector('.bulk-actions')) return;
    
    const bulkActions = document.createElement('div');
    bulkActions.className = 'bulk-actions';
    bulkActions.style.cssText = `
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        padding: 10px;
        background: white;
        border-radius: 6px;
        border: 1px solid #e5e7eb;
    `;
    
    bulkActions.innerHTML = `
        <span style="color: #666; font-size: 14px; padding: 0 10px;">Bulk Actions:</span>
        <button class="btn btn-secondary" onclick="bulkDelete()" style="padding: 6px 16px; font-size: 13px; background: white; border: 1px solid #d1d5db; border-radius: 4px; cursor: pointer;">Delete Selected</button>
        <button class="btn btn-secondary" onclick="bulkStatus('active')" style="padding: 6px 16px; font-size: 13px; background: white; border: 1px solid #d1d5db; border-radius: 4px; cursor: pointer;">Set Active</button>
        <button class="btn btn-secondary" onclick="bulkStatus('inactive')" style="padding: 6px 16px; font-size: 13px; background: white; border: 1px solid #d1d5db; border-radius: 4px; cursor: pointer;">Set Inactive</button>
    `;
    
    tableContainer.insertBefore(bulkActions, tableContainer.firstChild);
}

// Bulk delete selected users
window.bulkDelete = function() {
    const selected = document.querySelectorAll('.user-checkbox:checked');
    
    if (selected.length === 0) {
        alert('Please select users to delete');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${selected.length} user(s)?`)) {
        const userIds = Array.from(selected).map(cb => cb.dataset.userId);
        let users = getAllUsers();
        
        users = users.filter(user => !userIds.includes(user.id));
        saveUsers(users);
        
        renderUsers(users);
        showNotification(`${selected.length} user(s) deleted successfully`, 'success');
        updateUserCount();
    }
};

// Bulk update status
window.bulkStatus = function(status) {
    const selected = document.querySelectorAll('.user-checkbox:checked');
    
    if (selected.length === 0) {
        alert('Please select users');
        return;
    }
    
    const userIds = Array.from(selected).map(cb => cb.dataset.userId);
    let users = getAllUsers();
    
    users = users.map(user => {
        if (userIds.includes(user.id)) {
            user.status = status;
        }
        return user;
    });
    
    saveUsers(users);
    renderUsers(users);
    showNotification(`${selected.length} user(s) updated to ${status}`, 'success');
};

// Edit user function
window.editUser = function(userId) {
    const user = getUserById(userId);
    if (user) {
        localStorage.setItem('editingUser', JSON.stringify(user));
        window.location.href = 'edit-user.html';
    }
};

// Delete user function
window.deleteUser = function(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        let users = getAllUsers();
        users = users.filter(user => user.id !== userId);
        saveUsers(users);
        
        // Refresh the table
        renderUsers(users);
        showNotification('User deleted successfully', 'success');
        updateUserCount();
    }
};

// Update user count in header
function updateUserCount() {
    const users = getAllUsers();
    const countSpan = document.querySelector('.msg-count');
    if (countSpan) {
        countSpan.textContent = users.length;
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.user-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `user-notification ${type}`;
    
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

// Export users to CSV
window.exportUsersToCSV = function() {
    const users = getAllUsers();
    
    const headers = ['First Name', 'Last Name', 'Email', 'Username', 'Status', 'Role', 'Joined Date', 'Last Active'];
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    users.forEach(user => {
        const row = [
            user.firstName,
            user.lastName,
            user.email,
            user.username,
            user.status,
            user.role,
            user.joinedDate,
            user.lastActive
        ].map(value => `"${value}"`).join(',');
        
        csvRows.push(row);
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    
    window.URL.revokeObjectURL(url);
    showNotification('Users exported successfully', 'success');
};

// Add CSS animations if not present
if (!document.getElementById('user-notification-styles')) {
    const style = document.createElement('style');
    style.id = 'user-notification-styles';
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