/* ===========================================================
   Portafolio — Interactividad (vanilla JS)
   =========================================================== */
(function () {
  'use strict';

  /* ---------- Nav: scroll state + active link ---------- */
  const nav = document.querySelector('.nav');
  const links = [...document.querySelectorAll('.nav__links a[data-sec]')];
  const sections = links.map(a => document.getElementById(a.dataset.sec)).filter(Boolean);

  function onScroll() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
    let current = '';
    const mid = window.scrollY + window.innerHeight * 0.32;
    sections.forEach(s => { if (s.offsetTop <= mid) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.dataset.sec === current));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Project filters ---------- */
  const filters = document.querySelectorAll('.filter');
  // Soporta cards envueltas en <a class="card-link"> y las antiguas <article class="card">
  const cards = document.querySelectorAll('.proj__grid .card-link, .proj__grid > .card');
  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(x => x.classList.remove('active'));
      f.classList.add('active');
      const cat = f.dataset.cat;
      cards.forEach(c => {
        const match = cat === 'all' || (c.dataset.cats || '').split(' ').includes(cat);
        c.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- Card spotlight follow ---------- */
  cards.forEach(c => {
    c.addEventListener('pointermove', (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${e.clientX - r.left}px`);
      c.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Card click → navegar a detalle (sin tragar clicks en links internos) ---------- */
  document.querySelectorAll('.card-link[data-href]').forEach(el => {
    const go = () => { window.location.href = el.dataset.href; };
    el.addEventListener('click', (e) => {
      if (e.target.closest('a, button')) return;
      go();
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('a, button')) return;
        e.preventDefault();
        go();
      }
    });
  });

  /* ---------- Typed role in hero ---------- */
  const typed = document.getElementById('typedRole');
  if (typed) {
    const roles = JSON.parse(typed.dataset.roles || '[]');
    let ri = 0, ci = 0, deleting = false;
    function type() {
      const word = roles[ri];
      if (!deleting) {
        ci++;
        if (ci > word.length) { deleting = true; setTimeout(type, 1600); return; }
      } else {
        ci--;
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      }
      typed.textContent = word.slice(0, ci);
      setTimeout(type, deleting ? 42 : 78);
    }
    type();
  }
})();
