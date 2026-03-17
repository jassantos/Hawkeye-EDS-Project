// Enhanced Create Ticket Page
document.addEventListener('DOMContentLoaded', () => {
  setupDropdowns();
  setupProfileDropdown();
  loadAndDisplayTickets();
  setupQuickTicketForm();
  setupOpenTicketButtons();
  setupFilters();
  setupTabs();
  setupSearch();
  setupPriorityDropdown();
});

// Setup profile dropdown
function setupProfileDropdown() {
  const profileWrapper = document.getElementById('profileWrapper');
  const profileDropdown = document.getElementById('profileDropdown');
  const notifyDropdown = document.getElementById('notifyDropdown');
  const settingsDropdown = document.getElementById('settingsDropdown');

  if (profileWrapper && profileDropdown) {
    profileWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('active');
      // Close other dropdowns
      if (notifyDropdown) notifyDropdown.style.display = 'none';
      if (settingsDropdown) settingsDropdown.style.display = 'none';
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (profileDropdown && !profileWrapper?.contains(e.target)) {
      profileDropdown.classList.remove('active');
    }
  });

  // Prevent dropdown from closing when clicking inside it
  if (profileDropdown) {
    profileDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// Global logout function
window.logout = function() {
  if (confirm('Are you sure you want to logout?')) {
    window.location.href = 'login.html';
  }
};

// Setup dropdowns (settings, notifications)
function setupDropdowns() {
  const settingsBtn = document.getElementById('settingsBtn');
  const notifyBtn = document.getElementById('notifyBtn');
  const settingsDropdown = document.getElementById('settingsDropdown');
  const notifyDropdown = document.getElementById('notifyDropdown');
  const profileDropdown = document.getElementById('profileDropdown');

  if (settingsBtn && settingsDropdown) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsDropdown.style.display =
        settingsDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (notifyDropdown) notifyDropdown.style.display = 'none';
      if (profileDropdown) profileDropdown.classList.remove('active');
    });
  }

  if (notifyBtn && notifyDropdown) {
    notifyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifyDropdown.style.display =
        notifyDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (settingsDropdown) settingsDropdown.style.display = 'none';
      if (profileDropdown) profileDropdown.classList.remove('active');
    });
  }

  document.addEventListener('click', () => {
    if (settingsDropdown) settingsDropdown.style.display = 'none';
    if (notifyDropdown) notifyDropdown.style.display = 'none';
  });
}

// Load and display tickets on the left side
function loadAndDisplayTickets(filters = {}) {
  // Check if TicketSystem exists
  if (typeof TicketSystem === 'undefined') {
    console.error('TicketSystem not loaded. Make sure ticket-data.js is included.');
    return;
  }
  
  const tickets = TicketSystem.filter(filters);
  const container = document.getElementById('ticketsContainer');
  
  if (!container) return;
  
  if (tickets.length === 0) {
    container.innerHTML = '<div class="no-tickets" style="text-align: center; padding: 40px; color: #666;">No tickets found.</div>';
    return;
  }
  
  container.innerHTML = '';
  
  // Show only most recent 5 tickets (for the side panel)
  const recentTickets = tickets.slice(0, 5);
  
  recentTickets.forEach(ticket => {
    const ticketEl = createTicketElement(ticket);
    container.appendChild(ticketEl);
  });
}

// Create ticket element for the list
function createTicketElement(ticket) {
  const div = document.createElement('div');
  div.className = 'ticket-item';
  div.dataset.ticketId = ticket.id;
  div.dataset.ticketNumber = ticket.ticketNumber;
  
  const date = new Date(ticket.createdAt);
  const formattedDate = date.toLocaleDateString('en-CA') + ' ' + 
                        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const dotClass = ticket.status === 'new' ? 'new-dot' : 
                   ticket.status === 'ongoing' ? 'ongoing-dot' : 'resolved-dot';
  
  // Show priority badge for all priorities
  let priorityBadge = '';
  if (ticket.priority === 'high') {
    priorityBadge = '<span class="priority-badge high">High Priority</span>';
  } else if (ticket.priority === 'medium') {
    priorityBadge = '<span class="priority-badge medium">Medium Priority</span>';
  } else if (ticket.priority === 'low') {
    priorityBadge = '<span class="priority-badge low">Low Priority</span>';
  }
  
  const shortDesc = ticket.description.length > 100 ? 
    ticket.description.substring(0, 100) + '...' : ticket.description;
  
  // Get customer name or use email as fallback
  const customerName = ticket.customerName || ticket.customerEmail.split('@')[0] || 'Customer';
  
  div.innerHTML = `
    <div class="ticket-header">
      <div class="ticket-left">
        <span class="status-dot ${dotClass}"></span>
        <span class="ticket-id">Ticket# ${ticket.ticketNumber}</span>
        ${priorityBadge}
      </div>
      <div class="ticket-date">${formattedDate}</div>
    </div>
    <div class="ticket-title">${ticket.subject}</div>
    <div class="ticket-description">${shortDesc}</div>
    <div class="ticket-footer">
      <div class="ticket-author">
        <img src="avatar/pic.png" alt="${customerName}" class="author-avatar" />
        <span class="author-name">${customerName}</span>
      </div>
      <button class="open-ticket-btn">Open Ticket</button>
    </div>
  `;
  
  return div;
}

// Setup open ticket buttons
function setupOpenTicketButtons() {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('open-ticket-btn')) {
      const ticketItem = e.target.closest('.ticket-item');
      if (ticketItem) {
        const ticketId = ticketItem.dataset.ticketId;
        localStorage.setItem('currentTicketId', ticketId);
        window.location.href = 'FullTicket.html';
      }
    }
  });
}

// Setup quick ticket form with cancel functionality
function setupQuickTicketForm() {
  const form = document.getElementById('quickTicketForm');
  const cancelBtn = document.getElementById('cancelTicketBtn');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('customerEmail').value;
      const subject = document.getElementById('ticketSubject').value;
      const type = document.getElementById('ticketType').value;
      const priority = document.getElementById('priorityStatus').value;
      const body = document.getElementById('ticketBody').value;
      
      // Validate
      if (!email || !subject || !type || !priority || !body) {
        alert('Please fill in all fields');
        return;
      }
      
      // Create ticket
      const newTicket = TicketSystem.create({
        customerEmail: email,
        customerName: email.split('@')[0], // Extract name from email
        type: type,
        priority: priority,
        subject: subject,
        description: body
      });
      
      if (newTicket) {
        alert(`Ticket #${newTicket.ticketNumber} created successfully!`);
        
        // Reset form
        form.reset();
        
        // Refresh the tickets list with current filters
        applyFilters();
        
        // Optional: Show success message and keep form open for another ticket
      }
    });
  }
  
  // Cancel button handler - redirect back to Customer Support page immediately
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      window.location.href = 'CustomerSupport.html';
    });
  }
}

// Add a function to show the create ticket form (to be called from Customer Support page)
function showCreateTicketForm() {
  const createTicketSide = document.getElementById('createTicketSide');
  if (createTicketSide) {
    createTicketSide.style.display = 'block';
  }
}

// Make it available globally
window.showCreateTicketForm = showCreateTicketForm;

// Setup filter dropdowns
function setupFilters() {
  // Priority filter
  const priorityFilter = document.getElementById('priorityFilter');
  const priorityMenu = document.getElementById('priorityMenu');
  
  if (priorityFilter && priorityMenu) {
    priorityFilter.addEventListener('click', (e) => {
      e.stopPropagation();
      priorityMenu.classList.toggle('active');
    });
    
    priorityMenu.querySelectorAll('.filter-option').forEach(option => {
      option.addEventListener('click', () => {
        const value = option.dataset.value;
        priorityFilter.innerHTML = option.textContent + ' <i class="fa-solid fa-chevron-down"></i>';
        priorityMenu.classList.remove('active');
        
        // Store the selected priority filter
        localStorage.setItem('selectedPriorityFilter', value);
        applyFilters();
      });
    });
  }
  
  // Week filter (date range)
  const weekFilter = document.getElementById('weekFilter');
  const weekMenu = document.getElementById('weekMenu');
  
  if (weekFilter && weekMenu) {
    weekFilter.addEventListener('click', (e) => {
      e.stopPropagation();
      weekMenu.classList.toggle('active');
    });
    
    weekMenu.querySelectorAll('.filter-option').forEach(option => {
      option.addEventListener('click', () => {
        const value = option.dataset.value;
        const text = option.textContent;
        weekFilter.innerHTML = text + ' <i class="fa-solid fa-chevron-down"></i>';
        weekMenu.classList.remove('active');
        
        // Store the selected time filter value
        localStorage.setItem('selectedTimeFilter', value);
        applyFilters();
      });
    });
  }
  
  // Close menus when clicking outside
  document.addEventListener('click', () => {
    if (priorityMenu) priorityMenu.classList.remove('active');
    if (weekMenu) weekMenu.classList.remove('active');
  });
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById('searchTickets');
  const searchBtn = document.getElementById('searchBtn');
  
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      applyFilters();
    });
    
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        applyFilters();
      }
    });
  }
}

// Helper function to filter tickets by date
function filterTicketsByDate(tickets, timeFilter) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return tickets.filter(ticket => {
    const ticketDate = new Date(ticket.createdAt);
    
    switch(timeFilter) {
      case 'today':
        return ticketDate >= today;
      case 'week':
        return ticketDate >= startOfWeek;
      case 'month':
        return ticketDate >= startOfMonth;
      case 'all':
      default:
        return true;
    }
  });
}

// Apply all filters
function applyFilters() {
  const filters = {};
  
  // Get search term
  const searchInput = document.getElementById('searchTickets');
  if (searchInput && searchInput.value) {
    filters.search = searchInput.value;
  }
  
  // Get status filter from active tab
  const activeStatusTab = document.querySelector('.status-tab.active');
  if (activeStatusTab) {
    filters.status = activeStatusTab.dataset.status;
  } else {
    const allTicketsTab = document.querySelector('.tab[data-status="all"].active');
    if (allTicketsTab) {
      filters.status = 'all';
    }
  }
  
  // Get priority filter from localStorage
  const priorityFilter = localStorage.getItem('selectedPriorityFilter');
  if (priorityFilter && priorityFilter !== 'all') {
    filters.priority = priorityFilter;
  }
  
  // Get time filter from localStorage
  const timeFilter = localStorage.getItem('selectedTimeFilter') || 'all';
  
  // First get tickets based on status/priority/search
  let tickets = TicketSystem.filter(filters);
  
  // Then apply time filter
  if (timeFilter !== 'all') {
    tickets = filterTicketsByDate(tickets, timeFilter);
  }
  
  // Display the filtered tickets
  loadAndDisplayTicketsWithData(tickets);
}

// Load and display tickets with provided data
function loadAndDisplayTicketsWithData(tickets) {
  const container = document.getElementById('ticketsContainer');
  
  if (!container) return;
  
  if (tickets.length === 0) {
    container.innerHTML = '<div class="no-tickets" style="text-align: center; padding: 40px; color: #666;">No tickets found.</div>';
    return;
  }
  
  container.innerHTML = '';
  
  // Show only most recent 5 tickets (for the side panel)
  const recentTickets = tickets.slice(0, 5);
  
  recentTickets.forEach(ticket => {
    const ticketEl = createTicketElement(ticket);
    container.appendChild(ticketEl);
  });
}

// Setup tabs (All Tickets, New, On-Going, Resolved)
function setupTabs() {
  const tabs = document.querySelectorAll('.tab, .status-tab');
  const allTicketsTab = document.querySelector('.tab[data-status="all"]');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      document.querySelectorAll('.tab, .status-tab').forEach(t => {
        t.classList.remove('active');
      });
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Get status from data attribute
      const status = tab.dataset.status;
      
      if (status === 'all') {
        // Clear status filter
        localStorage.removeItem('selectedStatusFilter');
      } else if (status) {
        // Store status filter
        localStorage.setItem('selectedStatusFilter', status);
      }
      
      applyFilters();
    });
  });
}

// Setup priority dropdown (right side)
function setupPriorityDropdown() {
  const priorityBtn = document.getElementById('priorityDropdownBtn');
  const priorityMenu = document.getElementById('priorityDropdownMenu');
  
  if (priorityBtn && priorityMenu) {
    priorityBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      priorityMenu.classList.toggle('active');
    });
    
    priorityMenu.querySelectorAll('.priority-option').forEach(option => {
      option.addEventListener('click', () => {
        const value = option.dataset.value;
        const text = option.textContent.trim();
        
        document.getElementById('selectedPriorityText').textContent = text;
        
        // Update dot color
        const dot = priorityBtn.querySelector('.status-dot');
        dot.className = 'status-dot';
        if (value === 'new') dot.classList.add('new-dot');
        else if (value === 'ongoing') dot.classList.add('ongoing-dot');
        else if (value === 'resolved') dot.classList.add('resolved-dot');
        
        priorityMenu.classList.remove('active');
        
        // Store the selected status
        localStorage.setItem('selectedStatusFilter', value);
        
        // Activate corresponding tab
        document.querySelectorAll('.status-tab').forEach(t => {
          if (t.dataset.status === value) {
            t.classList.add('active');
          } else {
            t.classList.remove('active');
          }
        });
        
        // Deactivate "All Tickets" tab
        const allTicketsTab = document.querySelector('.tab[data-status="all"]');
        if (allTicketsTab) allTicketsTab.classList.remove('active');
        
        applyFilters();
      });
    });
    
    document.addEventListener('click', () => {
      priorityMenu.classList.remove('active');
    });
  }
}

// Initialize with stored filters on page load
document.addEventListener('DOMContentLoaded', () => {
  // Restore priority filter text if stored
  const storedPriority = localStorage.getItem('selectedPriorityFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  if (storedPriority && priorityFilter) {
    const priorityText = {
      'high': 'High Priority',
      'medium': 'Medium Priority',
      'low': 'Low Priority',
      'all': 'All Priorities'
    };
    if (priorityText[storedPriority]) {
      priorityFilter.innerHTML = priorityText[storedPriority] + ' <i class="fa-solid fa-chevron-down"></i>';
    }
  }
  
  // Restore time filter text if stored
  const storedTime = localStorage.getItem('selectedTimeFilter');
  const weekFilter = document.getElementById('weekFilter');
  if (storedTime && weekFilter) {
    const timeText = {
      'today': 'Today',
      'week': 'This Week',
      'month': 'This Month',
      'all': 'All Time'
    };
    if (timeText[storedTime]) {
      weekFilter.innerHTML = timeText[storedTime] + ' <i class="fa-solid fa-chevron-down"></i>';
    }
  }
  
  // Restore status tab if stored
  const storedStatus = localStorage.getItem('selectedStatusFilter');
  if (storedStatus) {
    const statusTab = document.querySelector(`.status-tab[data-status="${storedStatus}"]`);
    if (statusTab) {
      document.querySelectorAll('.tab, .status-tab').forEach(t => t.classList.remove('active'));
      statusTab.classList.add('active');
    }
  }
});