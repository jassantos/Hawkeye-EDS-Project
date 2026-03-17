// Enhanced Customer Support with real data
document.addEventListener('DOMContentLoaded', () => {
  // Initialize data if needed
  if (!localStorage.getItem('hawkeye_tickets')) {
    // Data will be initialized by ticket-data.js
  }
  
  // Load and display tickets
  loadAndDisplayTickets();
  
  // Setup all event listeners
  setupDropdowns();
  setupFilters();
  setupTabs();
  setupSearch();
  setupPriorityDropdown();
  
  // Update stats on dashboard if elements exist
  updateStatsDisplay();
});

// Load tickets and render them
function loadAndDisplayTickets(filters = {}) {
  const tickets = TicketSystem.filter(filters);
  const container = document.getElementById('ticketsContainer');
  
  if (!container) return;
  
  if (tickets.length === 0) {
    container.innerHTML = '<div class="no-tickets">No tickets found matching your criteria.</div>';
    return;
  }
  
  container.innerHTML = '';
  
  tickets.forEach(ticket => {
    const ticketEl = createTicketElement(ticket);
    container.appendChild(ticketEl);
  });
}

// Create a ticket DOM element
function createTicketElement(ticket) {
  const div = document.createElement('div');
  div.className = `ticket-item ${ticket.priority}-priority`;
  div.dataset.status = ticket.status;
  div.dataset.priority = ticket.priority;
  div.dataset.ticketId = ticket.id;
  div.dataset.ticketNumber = ticket.ticketNumber;
  
  // Format date
  const date = new Date(ticket.createdAt);
  const formattedDate = date.toLocaleDateString('en-CA') + ' ' + 
                        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  // Determine dot color based on status
  const dotClass = ticket.status === 'new' ? 'new-dot' : 
                   ticket.status === 'ongoing' ? 'ongoing-dot' : 'resolved-dot';
  
  // Show priority badge for ALL priorities with appropriate colors
  let priorityBadge = '';
  if (ticket.priority === 'high') {
    priorityBadge = '<span class="priority-badge high">High Priority</span>';
  } else if (ticket.priority === 'medium') {
    priorityBadge = '<span class="priority-badge medium">Medium Priority</span>';
  } else if (ticket.priority === 'low') {
    priorityBadge = '<span class="priority-badge low">Low Priority</span>';
  }
  
  // Truncate description
  const shortDesc = ticket.description.length > 150 ? 
    ticket.description.substring(0, 150) + '...' : ticket.description;
  
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
        <img src="avatar/pic.png" alt="User" class="author-avatar" />
        <span class="author-name">${ticket.customerName || ticket.customerEmail}</span>
      </div>
      <button class="open-ticket-btn" onclick="openTicketDetails('${ticket.id}')">Open Ticket</button>
    </div>
  `;
  
  return div;
}

// Open ticket details page
window.openTicketDetails = function(ticketId) {
  // Store selected ticket ID to load in FullTicket page
  localStorage.setItem('currentTicketId', ticketId);
  window.location.href = 'FullTicket.html';
};

// Setup dropdowns (settings, notifications)
function setupDropdowns() {
  const settingsBtn = document.getElementById('settingsBtn');
  const notifyBtn = document.getElementById('notifyBtn');
  const settingsDropdown = document.getElementById('settingsDropdown');
  const notifyDropdown = document.getElementById('notifyDropdown');

  if (settingsBtn && settingsDropdown) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsDropdown.style.display =
        settingsDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (notifyDropdown) notifyDropdown.style.display = 'none';
    });
  }

  if (notifyBtn && notifyDropdown) {
    notifyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifyDropdown.style.display =
        notifyDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (settingsDropdown) settingsDropdown.style.display = 'none';
    });
  }

  document.addEventListener('click', () => {
    if (settingsDropdown) settingsDropdown.style.display = 'none';
    if (notifyDropdown) notifyDropdown.style.display = 'none';
  });
}

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
        applyFilters();
      });
    });
  }
  
  // Week filter - FIXED VERSION
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

// Setup status tabs
function setupTabs() {
  const statusTabs = document.querySelectorAll('.status-tab');
  const allTicketsTab = document.querySelector('.tab[data-status="all"]');
  
  if (allTicketsTab) {
    allTicketsTab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      allTicketsTab.classList.add('active');
      statusTabs.forEach(t => t.classList.remove('active'));
      applyFilters();
    });
  }
  
  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Deactivate "All Tickets" tab
      if (allTicketsTab) allTicketsTab.classList.remove('active');
      
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

// Apply all active filters
function applyFilters() {
  const filters = {};
  
  // Get search term
  const searchInput = document.getElementById('searchTickets');
  if (searchInput && searchInput.value) {
    filters.search = searchInput.value;
  }
  
  // Get status filter from active tab
  let statusFilter = null;
  const activeStatusTab = document.querySelector('.status-tab.active');
  if (activeStatusTab) {
    statusFilter = activeStatusTab.dataset.status;
    filters.status = statusFilter;
  } else {
    const allTicketsTab = document.querySelector('.tab[data-status="all"].active');
    if (allTicketsTab) {
      filters.status = 'all';
    }
  }
  
  // Get priority filter
  const priorityFilter = document.getElementById('priorityFilter');
  if (priorityFilter && priorityFilter.textContent.includes('High')) {
    filters.priority = 'high';
  } else if (priorityFilter && priorityFilter.textContent.includes('Medium')) {
    filters.priority = 'medium';
  } else if (priorityFilter && priorityFilter.textContent.includes('Low')) {
    filters.priority = 'low';
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
  displayFilteredTickets(tickets);
}

// Display filtered tickets
function displayFilteredTickets(tickets) {
  const container = document.getElementById('ticketsContainer');
  
  if (!container) return;
  
  if (tickets.length === 0) {
    container.innerHTML = '<div class="no-tickets">No tickets found matching your criteria.</div>';
    return;
  }
  
  container.innerHTML = '';
  
  tickets.forEach(ticket => {
    const ticketEl = createTicketElement(ticket);
    container.appendChild(ticketEl);
  });
}

// Update statistics display
function updateStatsDisplay() {
  const stats = TicketSystem.getStats();
  
  // Update cards if they exist
  const highAlertCard = document.querySelector('.card.high');
  const mediumCard = document.querySelector('.card.medium');
  const resolvedCard = document.querySelector('.card.info');
  
  if (highAlertCard) {
    highAlertCard.innerHTML = `High Priority Tickets<br><span style="font-size: 24px;">${stats.highPriority}</span>`;
  }
  
  if (mediumCard) {
    mediumCard.innerHTML = `Medium Priority Tickets<br><span style="font-size: 24px;">${stats.mediumPriority}</span>`;
  }
  
  if (resolvedCard) {
    resolvedCard.innerHTML = `Resolved Tickets<br><span style="font-size: 24px;">${stats.resolved}</span>`;
  }
}