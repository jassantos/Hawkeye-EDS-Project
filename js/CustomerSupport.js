// Wait until the document is fully loaded
document.addEventListener('DOMContentLoaded', () => {

  const settingsBtn = document.getElementById('settingsBtn');
  const notifyBtn = document.getElementById('notifyBtn');
  const settingsDropdown = document.getElementById('settingsDropdown');
  const notifyDropdown = document.getElementById('notifyDropdown');

  if (settingsBtn && settingsDropdown) {
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsDropdown.style.display =
        settingsDropdown.style.display === 'flex' ? 'none' : 'flex';
      notifyDropdown.style.display = 'none';
    });
  }

  if (notifyBtn && notifyDropdown) {
    notifyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifyDropdown.style.display =
        notifyDropdown.style.display === 'flex' ? 'none' : 'flex';
      settingsDropdown.style.display = 'none';
    });
  }

  // Hide dropdowns when clicking outside
  document.addEventListener('click', () => {
    if (settingsDropdown) settingsDropdown.style.display = 'none';
    if (notifyDropdown) notifyDropdown.style.display = 'none';
  });

  // Redirect to FullTicket.html when "Open Ticket" is clicked 
  document.querySelectorAll('.open-ticket-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.href = 'FullTicket.html';
    });
  });
});
