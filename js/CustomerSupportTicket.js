// Enhanced Create Ticket Page
document.addEventListener('DOMContentLoaded', () => {
  setupDropdowns();
  loadAndDisplayTickets();
  setupQuickTicketForm();
  setupOpenTicketButtons();
  setupFilters();
  setupTabs();
});

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
  
  const priorityBadge = ticket.priority === 'high' ? 
    '<span class="priority-badge high">High Priority</span>' : '';
  
  const shortDesc = ticket.description.length > 100 ? 
    ticket.description.substring(0, 100) + '...' : ticket.description;
  
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
      <span class="posted-time">Posted at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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

// Setup quick ticket form
function setupQuickTicketForm() {
  const form = document.getElementById('quickTicketForm');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('customerEmail').value;
      const type = document.getElementById('ticketType').value;
      const priority = document.getElementById('priorityStatus').value;
      const body = document.getElementById('ticketBody').value;
      
      // Validate
      if (!email || !type || !priority || !body) {
        alert('Please fill in all fields');
        return;
      }
      
      // Extract subject from body (first line or first 50 chars)
      const subject = body.split('\n')[0].substring(0, 50) + (body.length > 50 ? '...' : '');
      
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
        
        // Refresh the tickets list
        loadAndDisplayTickets();
      }
    });
  }
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
        
        const filters = {};
        if (value !== 'all') filters.priority = value;
        
        // Add current search filter
        const searchInput = document.getElementById('searchTickets');
        if (searchInput && searchInput.value) {
          filters.search = searchInput.value;
        }
        
        loadAndDisplayTickets(filters);
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
        weekFilter.innerHTML = option.textContent + ' <i class="fa-solid fa-chevron-down"></i>';
        weekMenu.classList.remove('active');
        // In a real app, you'd filter by date here
        // For now, just refresh with current filters
        applySearch();
      });
    });
  }
  
  // Search button
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchTickets');
  
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', applySearch);
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') applySearch();
    });
  }
  
  // Close menus when clicking outside
  document.addEventListener('click', () => {
    if (priorityMenu) priorityMenu.classList.remove('active');
    if (weekMenu) weekMenu.classList.remove('active');
  });
}

// Apply search filter
function applySearch() {
  const searchInput = document.getElementById('searchTickets');
  const filters = {};
  
  if (searchInput && searchInput.value) {
    filters.search = searchInput.value;
  }
  
  loadAndDisplayTickets(filters);
}

// Setup tabs (All Tickets, New, On-Going, Resolved)
function setupTabs() {
  const tabs = document.querySelectorAll('.tab, .status-tab');
  
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
      
      if (status) {
        const filters = { status: status };
        
        // Add current search filter
        const searchInput = document.getElementById('searchTickets');
        if (searchInput && searchInput.value) {
          filters.search = searchInput.value;
        }
        
        loadAndDisplayTickets(filters);
      } else if (tab.dataset.status === 'all') {
        // Show all tickets
        const filters = {};
        const searchInput = document.getElementById('searchTickets');
        if (searchInput && searchInput.value) {
          filters.search = searchInput.value;
        }
        loadAndDisplayTickets(filters);
      }
    });
  });
}