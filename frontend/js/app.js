const state = {
  token: null,
  user: null
};

const sections = document.querySelectorAll('.page-section');

const showSection = (id) => {
  sections.forEach((section) => section.classList.toggle('active', section.id === id));
};

const apiFetch = async (url, options = {}) => {
  const headers = options.headers || {};
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
};

const renderHome = async () => {
  const { pages } = await apiFetch('/api/content/pages');
  const home = pages.find((p) => p.slug === 'home');
  const container = document.getElementById('home-content');
  container.innerHTML = `<p>${home?.body || 'Welcome!'}</p>`;
};

const renderPublicEvents = async () => {
  const { events } = await apiFetch('/api/events');
  const container = document.getElementById('events-list');
  container.innerHTML = events
    .map((event) => `<div class="card"><h4>${event.title}</h4><p>${event.description}</p><p>${event.date} • ${event.location}</p></div>`)
    .join('');
};

const handleLogin = () => {
  const form = document.getElementById('login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.get('email'), password: formData.get('password') })
      });
      state.token = data.token;
      state.user = data.user;
      document.getElementById('login-status').textContent = `Logged in as ${data.user.email}`;
      await loadMemberData();
      await loadAdminData();
    } catch (err) {
      document.getElementById('login-status').textContent = 'Login failed';
    }
  });
};

const loadMemberData = async () => {
  if (!state.token) return;
  const [ann, ev, docs, docks, directory, profile] = await Promise.all([
    apiFetch('/api/content/announcements'),
    apiFetch('/api/events'),
    apiFetch('/api/documents'),
    apiFetch('/api/docks'),
    apiFetch('/api/directory'),
    apiFetch('/api/directory/me')
  ]);
  document.getElementById('member-announcements').innerHTML = ann.announcements
    .map((a) => `<div class="card"><h4>${a.title}</h4><p>${a.body}</p></div>`)
    .join('');
  document.getElementById('member-events').innerHTML = ev.events
    .map((event) => `<div class="card"><h4>${event.title}</h4><p>${event.date} @ ${event.location}</p><button data-event="${event.id}" class="rsvp-btn">RSVP</button></div>`)
    .join('');
  document.getElementById('member-documents').innerHTML = docs.documents
    .map((doc) => `<div class="card"><a href="${doc.url}">${doc.title}</a> (${doc.category})</div>`)
    .join('');
  document.getElementById('dock-layout').innerHTML = docks.docks.layout
    .map((dock) => `<div class="card"><strong>Dock ${dock.dock}</strong>: ${dock.slips.join(', ')}</div>`)
    .join('');
  document.getElementById('member-directory').innerHTML = directory.directory
    .map((m) => `<div class="card"><strong>${m.displayName}</strong><p>Boat: ${m.boatName || 'Hidden'}</p><p>Slip: ${m.slip || 'N/A'}</p><p>Phone: ${m.phone || 'Hidden'}</p><p>Email: ${m.email || 'Hidden'}</p></div>`)
    .join('');

  const profileForm = document.getElementById('profile-form');
  profileForm.displayName.value = profile.profile.displayName || '';
  profileForm.boatName.value = profile.profile.boatName || '';
  profileForm.slip.value = profile.profile.slip || '';
  profileForm.phoneVisible.checked = !profile.profile.privacy?.phone;
  profileForm.emailVisible.checked = !profile.profile.privacy?.email;
};

const wireRsvp = () => {
  document.body.addEventListener('click', async (e) => {
    if (e.target.matches('.rsvp-btn')) {
      const eventId = e.target.dataset.event;
      try {
        await apiFetch(`/api/events/${eventId}/rsvp`, { method: 'POST' });
        await loadMemberData();
      } catch (err) {
        alert('Unable to RSVP');
      }
    }
  });
};

const wireProfileUpdate = () => {
  const form = document.getElementById('profile-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      displayName: form.displayName.value,
      boatName: form.boatName.value,
      slip: form.slip.value,
      privacy: {
        phone: !form.phoneVisible.checked,
        email: !form.emailVisible.checked
      }
    };
    await apiFetch('/api/directory/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    await loadMemberData();
  });
};

const loadAdminData = async () => {
  if (!state.token || !state.user?.roles.includes('admin')) return;
  const { users } = await apiFetch('/api/users');
  document.getElementById('user-list').innerHTML = users
    .map((u) => `<div class="card"><strong>${u.email}</strong><p>Roles: ${u.roles.join(', ')}</p></div>`)
    .join('');
};

const wireAdminForms = () => {
  document.getElementById('announcement-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    await apiFetch('/api/content/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title.value, body: form.body.value, visibility: form.visibility.value })
    });
    form.reset();
    await loadMemberData();
  });

  document.getElementById('event-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    await apiFetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title.value,
        date: form.date.value,
        location: form.location.value,
        visibility: form.visibility.value,
        capacity: Number(form.capacity.value || 0)
      })
    });
    form.reset();
    await loadMemberData();
  });

  document.getElementById('document-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    await apiFetch('/api/documents', {
      method: 'POST',
      body: data
    });
    form.reset();
    await loadMemberData();
  });

  document.getElementById('dock-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    await apiFetch('/api/docks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slip: form.slip.value, boatName: form.boatName.value, ownerId: form.ownerId.value })
    });
    form.reset();
    await loadMemberData();
  });
};

const wireNav = () => {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href').replace('#', '');
      showSection(target);
    });
  });
};

const init = async () => {
  wireNav();
  handleLogin();
  wireRsvp();
  wireProfileUpdate();
  wireAdminForms();
  await renderHome();
  await renderPublicEvents();
};

init();
