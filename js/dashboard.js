// Handle chart rendering
const activityCtx = document.getElementById("activityChart");
const pieCtx = document.getElementById("pieChart");
const lineCtx = document.getElementById("lineChart");

// Bar Chart
new Chart(activityCtx, {
  type: "bar",
  data: {
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Usage",
        data: [400, 300, 450, 480, 320, 350, 390],
        backgroundColor: "#00b3b3",
      },
      {
        label: "Provisions",
        data: [230, 180, 260, 310, 190, 220, 250],
        backgroundColor: "#f57c7c",
      },
    ],
  },
  options: { 
    responsive: true, 
    plugins: { 
      legend: { 
        display: false
      } 
    } 
  },
});

// Pie Chart
new Chart(pieCtx, {
  type: "pie",
  data: {
    labels: ["Resolved", "Pending", "Critical"],
    datasets: [
      {
        data: [55, 30, 15],
        backgroundColor: ["#6bc5e8", "#f3c567", "#f57c7c"],
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

// Line Chart
new Chart(lineCtx, {
  type: "line",
  data: {
    labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
    datasets: [
      {
        label: "Users",
        data: [200, 400, 650, 700, 500, 600, 750],
        borderColor: "#00b3b3",
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(0,179,179,0.1)",
      },
    ],
  },
  options: { responsive: true },
});

// Mobile Sidebar Toggle Script
document.addEventListener('DOMContentLoaded', function() {
  
  // Create hamburger menu button if it doesn't exist
  if (!document.querySelector('.menu-toggle')) {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    document.body.insertBefore(menuToggle, document.body.firstChild);
  }

  // Create overlay if it doesn't exist
  if (!document.querySelector('.sidebar-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.insertBefore(overlay, document.body.firstChild);
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  const body = document.body;

  // Toggle sidebar function
  function toggleSidebar() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    body.classList.toggle('sidebar-open');
  }

  // Close sidebar function
  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    body.classList.remove('sidebar-open');
  }

  // Menu toggle button click
  if (menuToggle) {
    menuToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleSidebar();
    });
  }

  // Overlay click to close sidebar
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // Close sidebar when clicking on menu items (mobile only)
  const menuLinks = document.querySelectorAll('.menu li a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });

  // Close sidebar when window is resized above mobile breakpoint
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      closeSidebar();
    }
  });

  // Prevent body scroll when sidebar is open on mobile
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === 'class') {
        if (body.classList.contains('sidebar-open')) {
          body.style.overflow = 'hidden';
        } else {
          body.style.overflow = '';
        }
      }
    });
  });

  observer.observe(body, {
    attributes: true
  });

  // Settings and Notifications Dropdown Toggle
  const settingsBtn = document.getElementById('settingsBtn');
  const notifyBtn = document.getElementById('notifyBtn');
  const settingsDropdown = document.getElementById('settingsDropdown');
  const notifyDropdown = document.getElementById('notifyDropdown');

  // Toggle Settings Dropdown
  if (settingsBtn && settingsDropdown) {
    settingsBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      settingsDropdown.style.display = 
        settingsDropdown.style.display === 'flex' ? 'none' : 'flex';
      // Close notifications dropdown if open
      if (notifyDropdown) {
        notifyDropdown.style.display = 'none';
      }
    });
  }

  // Toggle Notifications Dropdown
  if (notifyBtn && notifyDropdown) {
    notifyBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      notifyDropdown.style.display = 
        notifyDropdown.style.display === 'flex' ? 'none' : 'flex';
      // Close settings dropdown if open
      if (settingsDropdown) {
        settingsDropdown.style.display = 'none';
      }
    });
  }

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (settingsDropdown && settingsBtn && !settingsBtn.contains(e.target)) {
      settingsDropdown.style.display = 'none';
    }
    if (notifyDropdown && notifyBtn && !notifyBtn.contains(e.target)) {
      notifyDropdown.style.display = 'none';
    }
  });
});