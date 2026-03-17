// Full Ticket Page with Clear Reply Section
document.addEventListener('DOMContentLoaded', function() {
  setupDropdowns();
  loadTicketData();
  setupReplyForm();
  setupStatusSelector();
});

// Setup dropdowns
function setupDropdowns() {
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsDropdown = document.getElementById('settingsDropdown');
  const notifyBtn = document.getElementById('notifyBtn');
  const notifyDropdown = document.getElementById('notifyDropdown');

  if (settingsBtn && settingsDropdown) {
    settingsBtn.addEventListener('click', e => {
      e.stopPropagation();
      settingsDropdown.style.display = settingsDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (notifyDropdown) notifyDropdown.style.display = 'none';
    });
  }

  if (notifyBtn && notifyDropdown) {
    notifyBtn.addEventListener('click', e => {
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

// Load ticket data
function loadTicketData() {
  const ticketId = localStorage.getItem('currentTicketId');
  
  if (!ticketId) {
    showError('No ticket selected');
    return;
  }
  
  const ticket = TicketSystem.getById(ticketId);
  
  if (!ticket) {
    showError('Ticket not found');
    return;
  }
  
  displayTicket(ticket);
  displayReplies(ticket);
}

// Display ticket details
function displayTicket(ticket) {
  // Update ticket number
  document.getElementById('ticketNumber').textContent = `Ticket# ${ticket.ticketNumber}`;
  
  // Update customer email
  document.getElementById('customerEmail').textContent = ticket.customerEmail;
  
  // Format dates
  const created = new Date(ticket.createdAt);
  const updated = new Date(ticket.updatedAt);
  
  document.getElementById('createdDate').textContent = 
    created.toLocaleDateString('en-CA') + ' ' + 
    created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  document.getElementById('updatedDate').textContent = 
    `Updated: ${updated.toLocaleDateString('en-CA')} ${updated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  
  // Update assigned to
  document.getElementById('assignedTo').textContent = `Assigned to: ${ticket.assignedTo || 'Unassigned'}`;
  
  // Update subject and description
  document.getElementById('ticketSubject').textContent = ticket.subject;
  document.getElementById('ticketDescription').textContent = ticket.description;
  
  // Update status badge
  const statusBadge = document.getElementById('statusBadge');
  const statusDot = statusBadge.querySelector('.status-dot');
  
  statusBadge.className = 'status-badge';
  statusDot.className = 'status-dot';
  
  if (ticket.status === 'new') {
    statusBadge.classList.add('status-new');
    statusDot.classList.add('dot-new');
    statusBadge.innerHTML = '<span class="status-dot dot-new"></span> New';
  } else if (ticket.status === 'ongoing') {
    statusBadge.classList.add('status-ongoing');
    statusDot.classList.add('dot-ongoing');
    statusBadge.innerHTML = '<span class="status-dot dot-ongoing"></span> On-Going';
  } else if (ticket.status === 'resolved') {
    statusBadge.classList.add('status-resolved');
    statusDot.classList.add('dot-resolved');
    statusBadge.innerHTML = '<span class="status-dot dot-resolved"></span> Resolved';
  }
  
  // Update priority badge
  const priorityBadge = document.getElementById('priorityBadge');
  priorityBadge.className = 'status-badge';
  
  if (ticket.priority === 'high') {
    priorityBadge.classList.add('priority-high');
    priorityBadge.textContent = 'High Priority';
  } else if (ticket.priority === 'medium') {
    priorityBadge.classList.add('priority-medium');
    priorityBadge.textContent = 'Medium Priority';
  } else {
    priorityBadge.classList.add('priority-low');
    priorityBadge.textContent = 'Low Priority';
  }
  
  // Store current status for reply form
  localStorage.setItem('currentTicketStatus', ticket.status);
}

// Display all replies
function displayReplies(ticket) {
  const container = document.getElementById('repliesContainer');
  container.innerHTML = '';
  
  if (!ticket.replies || ticket.replies.length === 0) {
    container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999; background: #f9f9f9; border-radius: 8px;">No replies yet. Be the first to respond!</div>';
    return;
  }
  
  // Add date separator for organization
  let currentDate = '';
  
  ticket.replies.forEach(reply => {
    const replyDate = new Date(reply.createdAt);
    const dateStr = replyDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    // Add date separator if new date
    if (dateStr !== currentDate) {
      currentDate = dateStr;
      const dateSep = document.createElement('div');
      dateSep.style.textAlign = 'center';
      dateSep.style.margin = '20px 0';
      dateSep.innerHTML = `<span style="background: #EEF2F7; padding: 6px 16px; border-radius: 20px; font-size: 12px; color: #666;">${dateStr}</span>`;
      container.appendChild(dateSep);
    }
    
    const replyDiv = document.createElement('div');
    replyDiv.className = `reply-item ${reply.authorType === 'agent' ? 'agent-reply' : 'customer-reply'}`;
    
    const timeStr = replyDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    replyDiv.innerHTML = `
      <div class="reply-header">
        <span class="reply-author">
          <i class="fa-regular ${reply.authorType === 'agent' ? 'fa-user-tie' : 'fa-user'}"></i>
          ${reply.author}
        </span>
        <span class="reply-time">${timeStr}</span>
        ${reply.authorType === 'agent' ? '<span style="background: #12A1BA; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Support</span>' : ''}
      </div>
      <p class="reply-message">${reply.message}</p>
    `;
    
    container.appendChild(replyDiv);
  });
}

// Setup status selector
function setupStatusSelector() {
  const options = document.querySelectorAll('.status-option');
  const currentStatus = localStorage.getItem('currentTicketStatus') || 'ongoing';
  
  // Select current status
  options.forEach(opt => {
    if (opt.dataset.status === currentStatus) {
      opt.classList.add('selected');
    }
  });
  
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
}

// Setup reply form
function setupReplyForm() {
  const submitBtn = document.getElementById('submitReply');
  const cancelBtn = document.getElementById('cancelReply');
  const replyInput = document.getElementById('replyMessage');
  const ticketId = localStorage.getItem('currentTicketId');
  
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const message = replyInput.value.trim();
      
      if (!message) {
        alert('Please enter a reply message');
        replyInput.focus();
        return;
      }
      
      // Get selected status
      const selectedStatus = document.querySelector('.status-option.selected')?.dataset.status || 'ongoing';
      
      // Add reply
      const reply = TicketSystem.addReply(ticketId, {
        author: 'Support Agent',
        authorType: 'agent',
        message: message,
        newStatus: selectedStatus
      });
      
      if (reply) {
        alert('Reply sent successfully!');
        
        // Clear input
        replyInput.value = '';
        
        // Reload ticket data
        const updatedTicket = TicketSystem.getById(ticketId);
        displayTicket(updatedTicket);
        displayReplies(updatedTicket);
        
        // Update current status
        localStorage.setItem('currentTicketStatus', selectedStatus);
      }
    });
  }
  
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      if (replyInput.value.trim() && !confirm('Discard your reply?')) {
        return;
      }
      window.location.href = 'CustomerSupport.html';
    });
  }
  
  // Allow Enter to send (with Shift+Enter for new line)
  if (replyInput) {
    replyInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitBtn.click();
      }
    });
  }
}

// Show error message
function showError(message) {
  alert(message);
  window.location.href = 'CustomerSupport.html';
}