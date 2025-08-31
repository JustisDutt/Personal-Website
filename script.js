document.addEventListener('DOMContentLoaded', () => {
  /* ---- Preloader: always remove ---- */
  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    if (pre) pre.style.display = 'none';
  });

  /* ---- Typewriter ---- */
  const typedName = document.getElementById('typed-name');
  const text = "Hi, I'm Justis Dutt";
  let idx = 0;
  (function type() {
    if (!typedName) return;
    if (idx < text.length) {
      typedName.textContent += text.charAt(idx++);
      setTimeout(type, 100);
    }
  })();

  /* ---- Theme toggle: system by default + manual override ---- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme'); // 'light' | 'dark' | 'auto'
  if (savedTheme) root.setAttribute('data-theme', savedTheme);
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'auto';
      const next = current === 'dark' ? 'light' : current === 'light' ? 'auto' : 'dark';
      root.setAttribute('data-theme', next);
      themeBtn.setAttribute('aria-pressed', String(next === 'dark'));
      localStorage.setItem('theme', next);
      showToast(`Theme: ${next}`);
    });
  }

  /* ---- GSAP animations (guarded; respect reduced motion) ---- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.home-content', { opacity: 0, y: 50, duration: 1, ease: 'power2.out' });
    document.querySelectorAll('.section').forEach(sec => {
      gsap.from(sec, { scrollTrigger: { trigger: sec, start: 'top 80%', toggleActions: 'play none none reverse' }, opacity: 0, y: 40, duration: .8 });
    });
  } else {
    document.querySelectorAll('.section').forEach(sec => { sec.style.opacity = '1'; sec.style.transform = 'none'; });
  }

  /* ---- Smooth scroll  ---- */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      if (!href.startsWith('#')) return; // allow external (blog.html)
      e.preventDefault();
      document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      if (window.innerWidth <= 768) toggleMenu();
    });
  });

  /* ---- Hamburger (accessible) ---- */
  const hamburger = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('primary-menu');
  function toggleMenu() {
    if (!hamburger || !navMenu) return;
    const open = !navMenu.classList.contains('active');
    navMenu.classList.toggle('active', open);
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
    function onKey(e){ if(e.key==='Escape'){ navMenu.classList.remove('active'); hamburger.classList.remove('active'); hamburger.setAttribute('aria-expanded','false'); document.removeEventListener('keydown', onKey); } }
    open ? document.addEventListener('keydown', onKey) : document.removeEventListener('keydown', onKey);
    if (open) navMenu.querySelector('a')?.focus();
  }
  hamburger?.addEventListener('click', toggleMenu);

  /* ---- Helper: toast ---- */
  function showToast(msg){
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.className = '';
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 2200);
  }

  /* ---- Projects: data-driven + filterable ---- */
  const projects = [
    {
      title: 'Customer Database for Construction Company',
      valueProp: 'Internal Java app centralizing customers, projects, invoices.',
      bullets: [
        'Reduced data retrieval time by 50% with indexed SQLite.',
        'Full CRUD functionality and audit fields.'
      ],
      stack: ['Java','SQLite','JDBC'],
      links: { github: '' }, // internal project (no public link)
      tags: ['Java']
    },
    {
      title: 'Rational Agent PacMan Game',
      valueProp: 'Search-driven agent navigating mazes efficiently.',
      bullets: ['~90% win rate against ghosts using informed search.', 'Modular heuristics for experimentation.'],
      stack: ['Python','AI','Algorithms'],
      links: { github: 'https://github.com/JustisDutt/Pacman-AI' },
      tags: ['Python','AI']
    },
    {
      title: 'Network Game TicTacToe',
      valueProp: 'Realtime multiplayer via socket-based messaging.',
      bullets: ['50+ concurrent players via lightweight TCP.', 'Server-authoritative rules.'],
      stack: ['Java','Networking','TCP'],
      links: { github: 'https://github.com/JustisDutt/Network-Game-TicTacToe' },
      tags: ['Java','Networking']
    },
    {
      title: 'Multicast Stock Ticker',
      valueProp: 'Live quotes for 100+ stocks via multicast groups.',
      bullets: ['Event-driven publisher; near-real-time subscribers.', 'Backpressure-aware clients.'],
      stack: ['Java','Networking'],
      links: { github: 'https://github.com/JustisDutt/Multicast-Stock-Ticker-Java' },
      tags: ['Java','Networking']
    },
    {
      title: 'Java Calculator',
      valueProp: 'Desktop calculator with precise BigDecimal math.',
      bullets: ['Keyboard input + error-resistant ops.', 'Clear separation of view and logic.'],
      stack: ['Java','Swing'],
      links: { github: 'https://github.com/JustisDutt/Calculator-Swing-GUI' },
      tags: ['Java']
    }
  ];
  const projGrid = document.getElementById('projects-grid');
  function projCard(p){
    return `
      <article class="card" data-tags="${p.tags.join(' ')}">
        <h3>${p.title}</h3>
        <p>${p.valueProp}</p>
        <ul>${p.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
        <div class="stack">${p.stack.map(s=>`<span>${s}</span>`).join('')}</div>
        <div class="actions">
          ${p.links.github ? `<a class="btn" href="${p.links.github}" target="_blank" rel="noopener">GitHub</a>` : ''}
        </div>
      </article>
    `;
  }
  if (projGrid) projGrid.innerHTML = projects.map(projCard).join('');

  // Project filters
  document.querySelectorAll('#projects .filters .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#projects .filters .chip').forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-pressed','false'); });
      chip.classList.add('is-active'); chip.setAttribute('aria-pressed','true');
      const tag = chip.dataset.filter;
      document.querySelectorAll('#projects-grid .card').forEach(card => {
        const match = tag === 'all' || card.dataset.tags.split(' ').includes(tag);
        card.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---- Skills: tabs/group filter ---- */
  document.querySelectorAll('#skills .skill-tabs .chip').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#skills .skill-tabs .chip').forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('is-active'); tab.setAttribute('aria-selected','true');
      const group = tab.dataset.skillGroup;
      document.querySelectorAll('#skills-grid .skill').forEach(s => {
        s.style.display = (group === 'All' || s.dataset.group === group) ? '' : 'none';
      });
    });
  });

  /* ---- Contact form: inline validation + EmailJS (guarded) ---- */
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  function setErr(id, msg){
    const el = document.getElementById('error-'+id);
    if (el) el.textContent = msg || '';
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';

    // validate fields
    let ok = true;
    if (name.length < 2){ setErr('name','Please enter your name.'); ok=false; } else setErr('name','');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ setErr('email','Enter a valid email.'); ok=false; } else setErr('email','');
    if (message.length < 10){ setErr('message','Message should be at least 10 characters.'); ok=false; } else setErr('message','');
    if (!ok){ statusEl.textContent = 'Please fix the errors above.'; return; }

    try {
      if (window.emailjs && typeof emailjs.init === 'function') {
        emailjs.init('8ZhgCaxGFcA7Rwp2J'); // keep your public key (client-side)
        await emailjs.send('service_tzpy98o','template_tah909p',{ from_name: name, from_email: email, message });
        form.reset();
        statusEl.textContent = 'Message sent successfully.';
        showToast('Message sent successfully.');
      } else {
        // graceful fallback
        const subject = encodeURIComponent(`Portfolio contact from ${name}`);
        const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
        window.location.href = `mailto:justisdutt@gmail.com?subject=${subject}&body=${body}`;
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Something went wrong. Please email me directly.';
      showToast('Something went wrong. Please email me directly.');
    }
  });
});

