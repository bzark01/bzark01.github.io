/* ===========================================================
   Portafolio — Interactividad (vanilla JS)
   Traducido del diseño Claude Design (DCLogic) a JS plano.
   =========================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CAT_LABELS = [
    { key: 'all', label: 'Todos', label_en: 'All' },
    { key: 'nomina', label: 'Nómina CR', label_en: 'CR Payroll' },
    { key: 'ventas', label: 'Ventas', label_en: 'Sales' },
    { key: 'pos', label: 'POS', label_en: 'POS' },
    { key: 'contabilidad', label: 'Contabilidad', label_en: 'Accounting' },
    { key: 'compras', label: 'Compras', label_en: 'Purchasing' },
    { key: 'inventario', label: 'Inventario', label_en: 'Inventory' },
    { key: 'ia', label: 'IA', label_en: 'AI' },
    { key: 'productividad', label: 'Productividad', label_en: 'Productivity' },
    { key: 'infra', label: 'Infra', label_en: 'Infra' }
  ];
  var COLLAPSE_LIMIT = 12;
  var LOADING_WORDS_ALL = { es: ['Construyo', 'Diseño', 'Escalo'], en: ['I build', 'I design', 'I scale'] };
  function curSiteLang() { try { return localStorage.getItem('site_lang') || 'es'; } catch (e) { return 'es'; } }
  var LOADING_WORDS = LOADING_WORDS_ALL[curSiteLang()] || LOADING_WORDS_ALL.es;

  /* ---------- Loading ---------- */
  var LOAD_META = ['boot', 'init', 'load', 'link', 'ready'];

  function initLoading() {
    var el = document.getElementById('loading');
    if (!el) return;
    var countEl = document.getElementById('loadCount');
    var fillEl = document.getElementById('loadFill');
    var wordEl = document.getElementById('loadWord');
    var metaEl = document.getElementById('loadMeta');
    var steps = Array.prototype.slice.call(el.querySelectorAll('.boot li'));
    var stepAt = steps.map(function (li) { return parseInt(li.getAttribute('data-at'), 10) || 0; });

    function finish() {
      el.classList.add('hide');
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 550);
    }
    if (reduceMotion) {
      steps.forEach(function (li) { li.classList.add('show', 'done'); });
      finish();
      return;
    }

    var start = performance.now();
    var last = -1;
    function tick(t) {
      var count = Math.min(100, Math.floor(((t - start) / 2700) * 100));
      if (count !== last) {
        last = count;
        if (countEl) countEl.textContent = String(count).padStart(3, '0');
        if (fillEl) fillEl.style.transform = 'scaleX(' + (count / 100) + ')';

        // Boot log: revelar líneas y marcarlas como completadas por umbral.
        var active = 0;
        steps.forEach(function (li, i) {
          if (count >= stepAt[i]) { li.classList.add('show'); active = i; }
          var doneAt = i < steps.length - 1 ? stepAt[i + 1] : 100;
          if (count >= doneAt) li.classList.add('done');
        });
        if (metaEl) metaEl.textContent = LOAD_META[Math.min(active, LOAD_META.length - 1)];
      }
      if (count < 100) requestAnimationFrame(tick);
      else setTimeout(finish, 400);
    }
    requestAnimationFrame(tick);

    var wi = 0;
    var wordTimer = setInterval(function () {
      wi = (wi + 1) % LOADING_WORDS.length;
      if (wordEl) { wordEl.style.animation = 'none'; void wordEl.offsetWidth; wordEl.style.animation = 'wordFade .9s ease'; wordEl.textContent = LOADING_WORDS[wi]; }
      if (el.classList.contains('hide')) clearInterval(wordTimer);
    }, 900);
  }

  /* ---------- Typed role ---------- */
  function initTyped() {
    var el = document.getElementById('typedRole');
    if (!el) return;
    var roles, rolesEn;
    try { roles = JSON.parse(el.getAttribute('data-roles') || '[]'); } catch (e) { roles = []; }
    try { rolesEn = JSON.parse(el.getAttribute('data-roles-en') || '[]'); } catch (e) { rolesEn = []; }
    if (!roles.length) return;
    function curRoles() { return (document.documentElement.lang === 'en' && rolesEn.length) ? rolesEn : roles; }
    if (reduceMotion) { el.textContent = curRoles()[0]; return; }

    var roleIdx = 0, typed = '', deleting = false;
    function step() {
      var arr = curRoles();
      if (roleIdx >= arr.length) roleIdx = 0;
      var word = arr[roleIdx];
      if (!deleting) {
        typed = word.slice(0, typed.length + 1);
        el.textContent = typed;
        if (typed.length === word.length) { deleting = true; setTimeout(step, 1600); return; }
      } else {
        typed = typed.slice(0, -1);
        el.textContent = typed;
        if (typed.length === 0) { deleting = false; roleIdx = (roleIdx + 1) % arr.length; setTimeout(step, 300); return; }
      }
      setTimeout(step, deleting ? 42 : 78);
    }
    setTimeout(step, 400);
  }

  /* ---------- Scroll: nav shadow, active section, sticky cards ---------- */
  function initScroll() {
    var nav = document.getElementById('nav');
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
    var sections = ['about', 'destacados', 'projects'];
    var cards = [
      document.querySelector('.fcard--0'),
      document.querySelector('.fcard--1'),
      document.querySelector('.fcard--2')
    ];
    var wide = window.matchMedia('(min-width:901px)');
    var ticking = false;

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (nav) nav.classList.toggle('scrolled', y > 12);

        var mid = y + window.innerHeight * 0.32;
        var current = '';
        sections.forEach(function (id) {
          var s = document.getElementById(id);
          if (s && s.offsetTop <= mid) current = id;
        });
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('data-nav') === current);
        });

        if (wide.matches && !reduceMotion) {
          cards.forEach(function (el, i) {
            if (!el) return;
            var rect = el.getBoundingClientRect();
            var stickyTop = 96 + i * 24;
            var progress = Math.min(Math.max((stickyTop - rect.top) / 260, 0), 1);
            var remaining = 2 - i;
            var scale = 1 - progress * 0.035 * remaining;
            el.style.transform = 'scale(' + Math.max(scale, 0.9) + ')';
          });
        }
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Magnet & tilt ---------- */
  function initHover() {
    if (reduceMotion || !window.matchMedia('(pointer:fine)').matches) return;

    document.querySelectorAll('.magnet').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / 3;
        var yy = (e.clientY - (r.top + r.height / 2)) / 3;
        el.style.transform = 'translate(' + x + 'px,' + yy + 'px) scale(1.04)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = 'translate(0,0) scale(1)'; });
    });

    document.querySelectorAll('.tilt').forEach(function (el) {
      var sticky = el.classList.contains('fcard');
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        var rx = (-py * 14).toFixed(2);
        var ry = (px * 14).toFixed(2);
        el.style.transform = 'perspective(1000px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) scale3d(1.02,1.02,1.02)';
      });
      el.addEventListener('mouseleave', function () {
        // Las tarjetas destacadas recuperan su escala por scroll; el resto vuelve a plano.
        el.style.transform = sticky ? '' : 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      });
    });
  }

  /* ---------- Marquee ---------- */
  function initMarquee() {
    var el = document.getElementById('marquee');
    if (!el || reduceMotion) return;
    var mx = 0;
    function step() {
      mx -= 0.55;
      var w = el.scrollWidth / 2;
      if (Math.abs(mx) > w) mx = 0;
      el.style.transform = 'translateX(' + mx + 'px)';
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Module filter + collapse ---------- */
  function initModules() {
    var list = document.getElementById('modlist');
    var filtersWrap = document.getElementById('filters');
    var moreBtn = document.getElementById('moreBtn');
    var moreWrap = moreBtn ? moreBtn.parentNode : null;
    if (!list || !filtersWrap) return;

    var rows = Array.prototype.slice.call(list.querySelectorAll('.modrow'));
    var counts = {};
    rows.forEach(function (r) {
      var c = r.getAttribute('data-cat');
      counts[c] = (counts[c] || 0) + 1;
    });

    // Métricas de encabezado
    var total = rows.length;
    var areas = Object.keys(counts).length;
    var mc = document.getElementById('modCount'); if (mc) mc.textContent = total;
    var ac = document.getElementById('areaCount'); if (ac) ac.textContent = areas;

    var activeFilter = 'all';
    var expanded = false;

    // Construir botones de filtro
    CAT_LABELS.forEach(function (c) {
      var count = c.key === 'all' ? total : (counts[c.key] || 0);
      if (c.key !== 'all' && count === 0) return; // ocultar categorías vacías
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter' + (c.key === 'all' ? ' active' : '');
      btn.setAttribute('data-filter', c.key);
      btn.innerHTML = '<span data-en="' + (c.label_en || c.label) + '">' + c.label + '</span> <span class="c">' + count + '</span>';
      btn.addEventListener('click', function () {
        activeFilter = c.key;
        expanded = false;
        filtersWrap.querySelectorAll('.filter').forEach(function (b) {
          b.classList.toggle('active', b === btn);
        });
        render();
      });
      filtersWrap.appendChild(btn);
    });
    if (window.__applyLang) window.__applyLang();  // traducir filtros recién generados

    function render() {
      var matching = rows.filter(function (r) {
        return activeFilter === 'all' || r.getAttribute('data-cat') === activeFilter;
      });
      var collapsing = activeFilter === 'all' && !expanded && matching.length > COLLAPSE_LIMIT;
      var shown = 0;
      rows.forEach(function (r) {
        var match = activeFilter === 'all' || r.getAttribute('data-cat') === activeFilter;
        var visible = match && (!collapsing || shown < COLLAPSE_LIMIT);
        r.classList.toggle('hidden', !visible);
        if (visible) {
          shown++;
          r.querySelector('.modrow__n').textContent = String(shown).padStart(2, '0');
        }
      });

      var hasMore = activeFilter === 'all' && matching.length > COLLAPSE_LIMIT;
      if (moreWrap) moreWrap.classList.toggle('hide', !hasMore);
      if (moreBtn) {
        moreBtn.textContent = expanded
          ? 'Ver menos'
          : 'Ver los ' + (matching.length - COLLAPSE_LIMIT) + ' módulos restantes';
      }
    }

    if (moreBtn) {
      moreBtn.addEventListener('click', function () { expanded = !expanded; render(); });
    }
    render();
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!els.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function init() {
    initLoading();
    initTyped();
    initScroll();
    initHover();
    initMarquee();
    initModules();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
