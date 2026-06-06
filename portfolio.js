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

  /* ---------- Project filters + conteo + cargar más (#odooGrid) ---------- */
  const filters = [...document.querySelectorAll('.filter')];
  const odooGrid = document.getElementById('odooGrid');
  const odooCards = [...document.querySelectorAll('#odooGrid .card-link')];
  // Todas las cards (Odoo + Otros) reciben el efecto spotlight y la navegación
  const allCards = document.querySelectorAll('.proj__grid .card-link');

  // Cuántas cards se muestran antes de "Ver más" (solo en vista "Todos").
  const COLLAPSE_LIMIT = 12;
  const catsOf = c => (c.dataset.cats || '').split(' ').filter(Boolean);

  // Amplitud del catálogo + conteo por categoría (dinámico desde el DOM,
  // así no hay que mantenerlo al agregar módulos nuevos).
  const areas = new Set();
  odooCards.forEach(c => catsOf(c).forEach(a => areas.add(a)));
  const statsEl = document.getElementById('projStats');
  if (statsEl && odooCards.length) {
    statsEl.innerHTML =
      `<strong>${odooCards.length}</strong> módulos · ` +
      `<strong>${areas.size}</strong> áreas de negocio`;
  }
  filters.forEach(f => {
    const cat = f.dataset.cat;
    const n = cat === 'all'
      ? odooCards.length
      : odooCards.filter(c => catsOf(c).includes(cat)).length;
    // Oculta un chip de categoría que aún no tiene módulos.
    if (cat !== 'all' && n === 0) { f.style.display = 'none'; return; }
    if (!f.dataset.label) f.dataset.label = f.textContent.trim();
    f.innerHTML = `${f.dataset.label} <span class="filter__n">${n}</span>`;
  });

  let activeCat = 'all';
  let expanded = false;

  const moreWrap = document.createElement('div');
  moreWrap.className = 'proj__more';
  const moreBtn = document.createElement('button');
  moreBtn.type = 'button';
  moreBtn.className = 'proj__more-btn';
  moreWrap.appendChild(moreBtn);
  if (odooGrid) odooGrid.after(moreWrap);

  function applyView() {
    const matching = odooCards.filter(c => activeCat === 'all' || catsOf(c).includes(activeCat));
    const collapsing = activeCat === 'all' && !expanded && matching.length > COLLAPSE_LIMIT;
    odooCards.forEach(c => {
      const match = activeCat === 'all' || catsOf(c).includes(activeCat);
      c.classList.toggle('hide', !match);
    });
    if (collapsing) matching.slice(COLLAPSE_LIMIT).forEach(c => c.classList.add('hide'));

    // El botón solo aparece en "Todos" cuando hay más cards que el límite.
    if (activeCat === 'all' && matching.length > COLLAPSE_LIMIT) {
      moreBtn.textContent = expanded
        ? 'Ver menos'
        : `Ver los ${matching.length - COLLAPSE_LIMIT} módulos restantes`;
      moreWrap.style.display = '';
    } else {
      moreWrap.style.display = 'none';
    }
  }

  moreBtn.addEventListener('click', () => {
    expanded = !expanded;
    applyView();
    if (!expanded && odooGrid) odooGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  filters.forEach(f => {
    f.addEventListener('click', () => {
      filters.forEach(x => x.classList.remove('active'));
      f.classList.add('active');
      activeCat = f.dataset.cat;
      expanded = false; // al cambiar de filtro se ve la categoría completa
      applyView();
    });
  });

  applyView();

  /* ---------- Card spotlight follow ---------- */
  allCards.forEach(c => {
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
