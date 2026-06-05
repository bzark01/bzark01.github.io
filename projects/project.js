/* ===========================================================
   Carousel — interactividad ligera
   =========================================================== */
(function () {
  'use strict';

  const carousels = document.querySelectorAll('.carousel');

  carousels.forEach((root) => {
    const track = root.querySelector('.carousel__track');
    const slides = [...root.querySelectorAll('.carousel__slide')];
    const prev = root.querySelector('.carousel__nav--prev');
    const next = root.querySelector('.carousel__nav--next');
    const dotsRoot = root.querySelector('.carousel__dots');
    const counter = root.querySelector('.carousel__counter');

    if (!track || !slides.length) return;

    // Build dots
    if (dotsRoot) {
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', `Ir a la imagen ${i + 1}`);
        if (i === 0) b.classList.add('active');
        b.addEventListener('click', () => goTo(i));
        dotsRoot.appendChild(b);
      });
    }
    const dots = dotsRoot ? [...dotsRoot.querySelectorAll('button')] : [];

    function currentIndex() {
      const w = track.clientWidth;
      return Math.round(track.scrollLeft / w);
    }

    function goTo(i) {
      const w = track.clientWidth;
      track.scrollTo({ left: w * i, behavior: 'smooth' });
    }

    function updateUI() {
      const i = currentIndex();
      dots.forEach((d, di) => d.classList.toggle('active', di === i));
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === slides.length - 1;
      if (counter) counter.textContent = `${String(i + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    }

    if (prev) prev.addEventListener('click', () => goTo(Math.max(0, currentIndex() - 1)));
    if (next) next.addEventListener('click', () => goTo(Math.min(slides.length - 1, currentIndex() + 1)));

    let raf;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateUI);
    }, { passive: true });

    // Keyboard
    root.tabIndex = 0;
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(Math.max(0, currentIndex() - 1)); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goTo(Math.min(slides.length - 1, currentIndex() + 1)); }
    });

    // Hide broken images (so empty-state placeholder shows)
    root.querySelectorAll('.carousel__slide img').forEach(img => {
      img.addEventListener('error', () => {
        img.remove();
        img.closest('.carousel__slide').classList.add('carousel__slide--empty');
      });
      if (img.complete && img.naturalWidth === 0) {
        img.remove();
        img.closest('.carousel__slide').classList.add('carousel__slide--empty');
      }
    });

    updateUI();
  });
})();
