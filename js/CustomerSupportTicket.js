document.addEventListener('DOMContentLoaded', () => {
  /*  TOPBAR DROPDOWNS
   */
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

  // Hide dropdowns when clicking anywhere else
  document.addEventListener('click', () => {
    if (settingsDropdown) settingsDropdown.style.display = 'none';
    if (notifyDropdown) notifyDropdown.style.display = 'none';
  });

  /* Open ticket buttons */
  document.querySelectorAll('.open-ticket-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.location.href = 'FullTicket.html';
    });
  });

  /* Quick ticket submission*/
  const form = document.getElementById('quickTicketForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = document.getElementById('customerEmail').value;
      const type = document.getElementById('ticketType').value;
      const priority = document.getElementById('priorityStatus').value;
      const body = document.getElementById('ticketBody').value;

      
      alert(
        ` Ticket Created Successfully!\n\n` +
        `Customer Email: ${email}\n` +
        `Type: ${type}\n` +
        `Priority: ${priority}\n\n` +
        `Issue:\n${body}`
      );

      //Reset form after submission
      form.reset();
    });
  }
});
