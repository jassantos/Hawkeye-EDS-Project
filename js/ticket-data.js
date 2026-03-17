// Ticket Data Management System
const TicketSystem = (function() {
  // Sample ticket data
  const sampleTickets = [
    {
      id: 'TK-1001',
      ticketNumber: '2023-CS123',
      customerEmail: 'john.snow@example.com',
      customerName: 'John Snow',
      type: 'technical',
      priority: 'high',
      status: 'ongoing',
      subject: 'How can I access premium features of the app?',
      description: 'I recently upgraded to premium but cannot access the advanced features. The payment was successful but my account still shows basic tier. I have tried logging out and back in, clearing cache, and reinstalling the app. Nothing works.',
      createdAt: '2025-06-19T12:45:00',
      updatedAt: '2025-06-20T09:30:00',
      assignedTo: 'Support Agent',
      attachments: [],
      replies: [
        {
          id: 'R-1001',
          author: 'Support Agent',
          authorType: 'agent',
          message: 'Thank you for reaching out. Let me check your account status. Can you please provide your user ID?',
          createdAt: '2025-06-19T13:15:00'
        },
        {
          id: 'R-1002',
          author: 'John Snow',
          authorType: 'customer',
          message: 'My user ID is JS-12345. I still cannot access premium features.',
          createdAt: '2025-06-20T09:15:00'
        }
      ]
    },
    {
      id: 'TK-1002',
      ticketNumber: '2023-CS124',
      customerEmail: 'jaden.n@gmail.com',
      customerName: 'Jaden Nixon',
      type: 'billing',
      priority: 'medium',
      status: 'new',
      subject: 'Duplicate charge on my credit card',
      description: 'I was charged twice for my monthly subscription. Please refund the duplicate charge. Transaction ID: TX-98765 and TX-98766 both show the same amount of $29.99.',
      createdAt: '2025-06-20T10:30:00',
      updatedAt: '2025-06-20T10:30:00',
      assignedTo: 'Billing Team',
      attachments: [],
      replies: []
    },
    {
      id: 'TK-1003',
      ticketNumber: '2023-CS125',
      customerEmail: 'a.kelley@gmail.com',
      customerName: 'Alyvia Kelley',
      type: 'feature',
      priority: 'low',
      status: 'resolved',
      subject: 'Suggestion for dark mode',
      description: 'Would love to see a dark mode option in the mobile app. It would help with battery life and eye strain when using the app at night.',
      createdAt: '2025-06-18T14:20:00',
      updatedAt: '2025-06-19T16:45:00',
      assignedTo: 'Product Team',
      attachments: [],
      replies: [
        {
          id: 'R-1003',
          author: 'Product Manager',
          authorType: 'agent',
          message: 'Thanks for the suggestion! We\'ve added this to our roadmap for next quarter. We\'ll notify you when it\'s available.',
          createdAt: '2025-06-19T16:45:00'
        }
      ]
    },
    // Add a few more tickets with different dates for testing time filters
    {
      id: 'TK-1004',
      ticketNumber: '2023-CS126',
      customerEmail: 'emma.wilson@example.com',
      customerName: 'Emma Wilson',
      type: 'technical',
      priority: 'high',
      status: 'new',
      subject: 'Cannot login to my account',
      description: 'I keep getting "invalid credentials" error even after resetting my password.',
      createdAt: new Date().toISOString(), // Today
      updatedAt: new Date().toISOString(),
      assignedTo: 'Support Agent',
      attachments: [],
      replies: []
    },
    {
      id: 'TK-1005',
      ticketNumber: '2023-CS127',
      customerEmail: 'michael.brown@example.com',
      customerName: 'Michael Brown',
      type: 'billing',
      priority: 'medium',
      status: 'ongoing',
      subject: 'Invoice not received',
      description: 'I haven\'t received my invoice for last month. Can you please resend it?',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Billing Team',
      attachments: [],
      replies: []
    },
    {
      id: 'TK-1006',
      ticketNumber: '2023-CS128',
      customerEmail: 'sarah.davis@example.com',
      customerName: 'Sarah Davis',
      type: 'feature',
      priority: 'low',
      status: 'resolved',
      subject: 'Mobile app crash on startup',
      description: 'The app crashes immediately when I try to open it on my Android phone.',
      createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
      updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'Development Team',
      attachments: [],
      replies: []
    }
  ];

  // Load tickets from localStorage or use samples
  function loadTickets() {
    const stored = localStorage.getItem('hawkeye_tickets');
    if (stored) {
      return JSON.parse(stored);
    } else {
      // Initialize with sample data
      localStorage.setItem('hawkeye_tickets', JSON.stringify(sampleTickets));
      return sampleTickets;
    }
  }

  // Save tickets to localStorage
  function saveTickets(tickets) {
    localStorage.setItem('hawkeye_tickets', JSON.stringify(tickets));
  }

  // Get all tickets
  function getAllTickets() {
    return loadTickets();
  }

  // Get ticket by ID
  function getTicketById(ticketId) {
    const tickets = loadTickets();
    return tickets.find(t => t.id === ticketId || t.ticketNumber === ticketId);
  }

  // Create new ticket
  function createTicket(ticketData) {
    const tickets = loadTickets();
    
    // Generate new ticket ID and number
    const lastTicket = tickets[tickets.length - 1];
    let lastNum = 123;
    
    if (lastTicket && lastTicket.ticketNumber) {
      const match = lastTicket.ticketNumber.match(/(\d+)$/);
      if (match) {
        lastNum = parseInt(match[1]) + 1;
      }
    }
    
    const newTicket = {
      id: `TK-${Date.now()}`,
      ticketNumber: `2023-CS${lastNum}`,
      customerEmail: ticketData.customerEmail,
      customerName: ticketData.customerName || ticketData.customerEmail.split('@')[0],
      type: ticketData.type || 'general',
      priority: ticketData.priority || 'medium',
      status: 'new',
      subject: ticketData.subject || 'New Ticket',
      description: ticketData.description || ticketData.body || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: 'Unassigned',
      attachments: [],
      replies: []
    };
    
    tickets.push(newTicket);
    saveTickets(tickets);
    return newTicket;
  }

  // Add reply to ticket
  function addReply(ticketId, replyData) {
    const tickets = loadTickets();
    const ticket = tickets.find(t => t.id === ticketId || t.ticketNumber === ticketId);
    
    if (ticket) {
      const newReply = {
        id: `R-${Date.now()}`,
        author: replyData.author || 'Support Agent',
        authorType: replyData.authorType || 'agent',
        message: replyData.message,
        createdAt: new Date().toISOString()
      };
      
      if (!ticket.replies) {
        ticket.replies = [];
      }
      
      ticket.replies.push(newReply);
      ticket.updatedAt = new Date().toISOString();
      
      // Update status if provided
      if (replyData.newStatus) {
        ticket.status = replyData.newStatus;
      }
      
      saveTickets(tickets);
      return newReply;
    }
    return null;
  }

  // Update ticket status
  function updateTicketStatus(ticketId, newStatus) {
    const tickets = loadTickets();
    const ticket = tickets.find(t => t.id === ticketId || t.ticketNumber === ticketId);
    
    if (ticket) {
      ticket.status = newStatus;
      ticket.updatedAt = new Date().toISOString();
      saveTickets(tickets);
      return ticket;
    }
    return null;
  }

  // Filter tickets
  function filterTickets(filters = {}) {
    let tickets = loadTickets();
    
    if (filters.status && filters.status !== 'all') {
      tickets = tickets.filter(t => t.status === filters.status);
    }
    
    if (filters.priority && filters.priority !== 'all') {
      tickets = tickets.filter(t => t.priority === filters.priority);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tickets = tickets.filter(t => 
        t.ticketNumber.toLowerCase().includes(searchLower) ||
        t.subject.toLowerCase().includes(searchLower) ||
        t.customerEmail.toLowerCase().includes(searchLower) ||
        t.customerName.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by date (newest first)
    tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return tickets;
  }

  // Get statistics about tickets
  function getStats() {
    const tickets = loadTickets();
    
    // Count by priority
    const highPriority = tickets.filter(t => t.priority === 'high').length;
    const mediumPriority = tickets.filter(t => t.priority === 'medium').length;
    const lowPriority = tickets.filter(t => t.priority === 'low').length;
    
    // Count by status
    const newTickets = tickets.filter(t => t.status === 'new').length;
    const ongoingTickets = tickets.filter(t => t.status === 'ongoing').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    
    // Count by type
    const technical = tickets.filter(t => t.type === 'technical').length;
    const billing = tickets.filter(t => t.type === 'billing').length;
    const feature = tickets.filter(t => t.type === 'feature').length;
    const general = tickets.filter(t => t.type === 'general').length;
    
    return {
      // Priority stats
      highPriority,
      mediumPriority,
      lowPriority,
      
      // Status stats
      new: newTickets,
      ongoing: ongoingTickets,
      resolved: resolvedTickets,
      
      // Type stats
      technical,
      billing,
      feature,
      general,
      
      // Total counts
      total: tickets.length,
      unassigned: tickets.filter(t => t.assignedTo === 'Unassigned').length
    };
  }

  // Get tickets by date range
  function getTicketsByDateRange(startDate, endDate) {
    const tickets = loadTickets();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return tickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      return ticketDate >= start && ticketDate <= end;
    });
  }

  // Get today's tickets
  function getTicketsToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return getTicketsByDateRange(today, tomorrow);
  }

  // Get this week's tickets
  function getTicketsThisWeek() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    
    return getTicketsByDateRange(startOfWeek, endOfWeek);
  }

  // Get this month's tickets
  function getTicketsThisMonth() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    return getTicketsByDateRange(startOfMonth, endOfMonth);
  }

  // Public API
  return {
    getAll: getAllTickets,
    getById: getTicketById,
    create: createTicket,
    addReply: addReply,
    updateStatus: updateTicketStatus,
    filter: filterTickets,
    getStats: getStats,
    getTicketsToday: getTicketsToday,
    getTicketsThisWeek: getTicketsThisWeek,
    getTicketsThisMonth: getTicketsThisMonth
  };
})();