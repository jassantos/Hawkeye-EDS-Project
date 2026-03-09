document.addEventListener('DOMContentLoaded', function() {

  // Settings dropdown
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsDropdown = document.getElementById('settingsDropdown');
  const notifyBtn = document.getElementById('notifyBtn');
  const notifyDropdown = document.getElementById('notifyDropdown');

  if (settingsBtn && settingsDropdown) {
    settingsBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      settingsDropdown.style.display = settingsDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (notifyDropdown) notifyDropdown.style.display = 'none';
    });
  }

  if (notifyBtn && notifyDropdown) {
    notifyBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      notifyDropdown.style.display = notifyDropdown.style.display === 'flex' ? 'none' : 'flex';
      if (settingsDropdown) settingsDropdown.style.display = 'none';
    });
  }

  document.addEventListener('click', function() {
    if (settingsDropdown) settingsDropdown.style.display = 'none';
    if (notifyDropdown) notifyDropdown.style.display = 'none';
  });

  // Search functionality
  const searchInput = document.getElementById('searchPersonnel');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase();
      const tableBody = document.getElementById('personnelTableBody');
      const rows = tableBody.getElementsByTagName('tr');

      for (let row of rows) {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
      }
    });
  }

  // Click row to edit
  const tableBody = document.getElementById('personnelTableBody');
  if (tableBody) {
    tableBody.addEventListener('click', function(e) {
      const row = e.target.closest('tr');
      if (!row) return;

      const firstname = row.dataset.firstname;
      const lastname = row.dataset.lastname;
      const email = row.dataset.email;
      const phone = row.dataset.phone;
      const permission = row.dataset.permission;

      const url = `ManagePersonnel.html?firstName=${encodeURIComponent(firstname)}&lastName=${encodeURIComponent(lastname)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}&permission=${encodeURIComponent(permission)}`;
      window.location.href = url;
    });
  }
  //Pop up window 
  document.addEventListener('DOMContentLoaded', function() {
  
  const addAdminBtn = document.getElementById('addAdminBtn');
  const modalContainer = document.getElementById('modalContainer');

  addAdminBtn.addEventListener('click', function() {
    // Load the popup HTML
    fetch('AddAdminForm.html')
      .then(response => response.text())
      .then(html => {
        modalContainer.innerHTML = html;
        
        // Show the modal overlay
        const overlay = document.querySelector('.modal-overlay');
        overlay.style.display = 'flex';

        // Close button inside the modal
        const closeBtn = overlay.querySelector('.cancel-btn');
        closeBtn.addEventListener('click', function() {
          overlay.style.display = 'none';
        });

        // Save button inside the modal
        const saveBtn = overlay.querySelector('.save-btn');
        saveBtn.addEventListener('click', function() {
          const form = overlay.querySelector('form');
          if(form.checkValidity()) {
            alert('New admin added successfully!');
            overlay.style.display = 'none';
            form.reset();
          } else {
            form.reportValidity();
          }
        });

      })
      .catch(err => console.error('Failed to load AddAdminForm.html:', err));
  });

});


});
