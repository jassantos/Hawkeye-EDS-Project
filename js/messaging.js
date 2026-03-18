/* Figma-styled Messaging — inner view only
   Mount with: Messaging.init(document.getElementById('msg-mount'), { demo: true })
   Author - Mihir Mistry(041105676)
*/
window.Messaging = (function () {
  const ICONS = {
    search: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    phone: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.15a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92z"/></svg>`,
    video: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
    more: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle></svg>`,
    send: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>`,
    ticks: `<svg viewBox="0 0 24 24" class="msg-tick" fill="none" stroke="#3b82f6" stroke-width="2"><polyline points="3 12 8 17 13 10"></polyline><polyline points="9 12 14 17 21 8"></polyline></svg>`
  };

  const template = () => `
  <div class="msg" style="background:var(--msg-bg); padding:4px;">
    <div class="msg-shell">
      <!-- Contacts -->
      <section class="msg-contacts">
        <header class="msg-head">
          <h3>Contacts</h3>
          <span class="msg-count" id="m-count">0</span>
        </header>

        <div class="msg-search">
          <input id="m-search" type="search" placeholder="Search contact" aria-label="Search contacts" />
          <span class="lens">${ICONS.search}</span>
        </div>

        <ul class="msg-list" id="m-list" role="listbox" aria-label="Contact list"></ul>
      </section>

      <!-- Conversation Pane -->
      <section class="msg-pane">
        <div class="msg-pane-header">
          <div class="msg-title">
            <div class="msg-avatar" id="m-avatar" style="width:40px;height:40px;border-radius:12px;background:linear-gradient(180deg,#93c5fd,#60a5fa);color:#fff;display:grid;place-items:center;font-weight:800">A</div>
            <div>
              <h4 class="msg-name" id="m-title">Select a contact</h4>
              <div class="msg-sub"><span class="dot"></span><span id="m-subtitle">—</span></div>
            </div>
          </div>

        <div class="header-tools">
          <span class="tag tag-warm">New Client</span>
          <a href="#" class="link" id="m-profile">View Profile</a>
          <button class="icon-btn" id="m-call"  title="Call">${ICONS.phone}</button>
          <button class="icon-btn" id="m-video" title="Video">${ICONS.video}</button>
          <button class="icon-btn" id="m-more"  title="More">${ICONS.more}</button>
        </div>
        </div>

        <div class="msg-thread" id="m-thread"></div>

        <form class="msg-input" id="m-form">
          <button class="btn-plus" type="button" title="New attachment">+</button>
          <input id="m-text" type="text" placeholder="Type a message..." aria-label="Type a message" />
          <button class="btn-send" id="m-send" type="submit" disabled>
            Send ${ICONS.send}
          </button>
        </form>
      </section>
    </div>
    <div class="msg-profile-modal" id="m-profile-modal">
  <div class="msg-profile-card">
    <button class="msg-close" id="m-close-profile">&times;</button>

    <div class="msg-profile-header">
      <div class="msg-profile-avatar" id="m-profile-avatar">A</div>
      <div>
        <h2 id="m-profile-name">Name</h2>
        <p id="m-profile-title">Title</p>
      </div>
    </div>

    <div class="msg-profile-body">
      <div class="field">
        <label>Email</label>
        <p id="m-profile-email">—</p>
      </div>

      <div class="field">
        <label>Phone</label>
        <p id="m-profile-phone">—</p>
      </div>

      <div class="field">
        <label>Organization</label>
        <p id="m-profile-org">—</p>
      </div>
    </div>
  </div>
  </div>`;

  /* --- Demo Data (to mirror the Figma) --- */
  const demoContacts = [
    {
      id: 1,
      name: "Jane Doe",
      last: "I am not sure. How can I check it?",
      color: "#fda4af",
      email: "jane@example.com",
      phone: "(123) 456-7890",
      org: "Acme Corp",
      title: "Product Manager"
    },
    {
      id: 2,
      name: "Janet Adebayo",
      last: "Got it. Thanks!",
      color: "#a4c5fd",
      email: "janet@example.com",
      phone: "(123) 456-7890",
      org: "Westcorp",
      title: "Admin"
    },
    {
      id: 3,
      name: "Kunle Adekunle",
      last: "Will join standup at 10.",
      color: "#8ece72",
      email: "Kunle@example.com",
      phone: "(123) 456-7890",
      org: "Acme Corp",
      title: "DBA"
    }
  ];

  const demoThreads = {
    1: [
      { sep: "31 March 2025" },
      { me: false, text: "Hello, I want to make enquiries about my ticket.", t: "12:55 am" },
      { me: true, text: "Hello Janet, thank you for reaching out", t: "12:57 am", ticks: true },
      { me: true, text: "What is your ticket number?", t: "12:57 am", ticks: true },
      { sep: "Today" },
      { me: false, text: "I am not sure. How can I check it?", t: "12:55 am" }
    ],
    2: [{ me: false, text: "Hi! sharing the figma link.", t: "09:05" }, { me: true, text: "Got it. Thanks!", t: "09:07", ticks: true }],
    3: [{ me: false, text: "Will join standup at 10.", t: "Now" }]
  };

  function el(html) {
    const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild;
  }

  function renderContacts(listEl, onSelect) {
    listEl.innerHTML = "";
    demoContacts.forEach((c, i) => {
      const li = document.createElement('li');
      li.className = "msg-item" + (i === 0 ? " is-active" : "");
      li.innerHTML = `
        <div class="msg-avatar" style="background:${c.color}">${c.name[0]}</div>
        <div>
          <p class="msg-name">${c.name}</p>
          <p class="msg-last">${c.last}</p>
        </div>
        <div class="msg-meta">
          <span>Now</span>
          ${c.badge ? `<span class="msg-badge">${c.badge}</span>` : ""}
        </div>`;
      li.onclick = () => {
        [...listEl.children].forEach(n => n.classList.remove('is-active'));
        li.classList.add('is-active');
        onSelect(c);
      };
      listEl.appendChild(li);
    });
    document.getElementById('m-count').textContent = demoContacts.length;
  }

  function renderThread(threadEl, conv) {
    threadEl.innerHTML = "";
    conv.forEach(m => {
      if (m.sep) {
        const chip = el(`<div style="text-align:center"><span class="date-chip">${m.sep}</span></div>`);
        threadEl.appendChild(chip);
        return;
      }
      const row = el(`<div class="msg-row ${m.me ? 'me' : ''}"></div>`);
      const bubble = el(`<div class="msg-bubble"></div>`);
      bubble.textContent = m.text;
      const time = el(`<div class="msg-time">${m.t || "Now"} ${m.ticks ? ICONS.ticks : ""}</div>`);
      row.appendChild(bubble);
      threadEl.appendChild(row);
      threadEl.appendChild(time);
    });
    threadEl.scrollTop = threadEl.scrollHeight;
  }

  function init(container, opts = {}) {
    container.innerHTML = template();



    const listEl = container.querySelector('#m-list');
    const threadEl = container.querySelector('#m-thread');
    const titleEl = container.querySelector('#m-title');
    const subEl = container.querySelector('#m-subtitle');
    const avaEl = container.querySelector('#m-avatar');
    const input = container.querySelector('#m-text');
    const form = container.querySelector('#m-form');
    const sendBtn = container.querySelector('#m-send');
    const searchInput = container.querySelector('#m-search');
    const profileLink = container.querySelector('#m-profile');
    const modal = container.querySelector('#m-profile-modal');
    const closeBtn = container.querySelector('#m-close-profile');

    const profileName = container.querySelector('#m-profile-name');
    const profileTitle = container.querySelector('#m-profile-title');
    const profileEmail = container.querySelector('#m-profile-email');
    const profilePhone = container.querySelector('#m-profile-phone');
    const profileOrg = container.querySelector('#m-profile-org');
    const profileAvatar = container.querySelector('#m-profile-avatar');

    let currentContact = null;

    const savedId = localStorage.getItem("selectedContactId");

    if (savedId) {
      const found = demoContacts.find(c => c.id == savedId);
      if (found) {
        selectContact(found);
      } else {
        selectContact(demoContacts[0]);
      }
    } else {
      selectContact(demoContacts[0]);
    }

    profileLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentContact) return;

      profileName.textContent = currentContact.name;
      profileTitle.textContent = currentContact.title || "—";
      profileEmail.textContent = currentContact.email || "—";
      profilePhone.textContent = currentContact.phone || "—";
      profileOrg.textContent = currentContact.org || "—";

      profileAvatar.textContent = currentContact.name[0];
      profileAvatar.style.background = currentContact.color;

      modal.classList.add('show');
    });

    searchInput.addEventListener('input', () => {
      const term = searchInput.value.toLowerCase();

      const filtered = demoContacts.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.last.toLowerCase().includes(term)
      );

      renderFilteredContacts(filtered);
    });

    // Render & preselect first contact to match Figma
    renderContacts(listEl, selectContact);
    selectContact(demoContacts[0]);

    function selectContact(c) {
      currentContact = c;

      localStorage.setItem("selectedContactId", c.id);

      titleEl.textContent = c.name;
      subEl.textContent = "Active now";
      avaEl.textContent = c.name[0];
      avaEl.style.background = c.color;
      renderThread(threadEl, demoThreads[c.id] || []);
      input.disabled = false;
      sendBtn.disabled = !input.value.trim();
    }

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });

    // click outside closes modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('show');
      }
    });

    function renderFilteredContacts(filteredList) {
      listEl.innerHTML = "";

      filteredList.forEach((c) => {
        const li = document.createElement('li');
        li.className = "msg-item";

        li.innerHTML = `
      <div class="msg-avatar" style="background:${c.color}">${c.name[0]}</div>
      <div>
        <p class="msg-name">${c.name}</p>
        <p class="msg-last">${c.last}</p>
      </div>
      <div class="msg-meta">
        <span>Now</span>
        ${c.badge ? `<span class="msg-badge">${c.badge}</span>` : ""}
      </div>`;

        li.onclick = () => selectContact(c);

        listEl.appendChild(li);
      });

      document.getElementById('m-count').textContent = filteredList.length;
    }

    input.addEventListener('input', () => {
      sendBtn.disabled = !input.value.trim();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const txt = input.value.trim();
      if (!txt) return;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      // append my message
      const row = el(`<div class="msg-row me"></div>`);
      const bubble = el(`<div class="msg-bubble"></div>`);
      bubble.textContent = txt;
      const time = el(`<div class="msg-time">${now} ${ICONS.ticks}</div>`);
      row.appendChild(bubble);
      threadEl.appendChild(row);
      threadEl.appendChild(time);
      threadEl.scrollTop = threadEl.scrollHeight;

      input.value = "";
      sendBtn.disabled = true;
    });
  }

  return { init };
})();
