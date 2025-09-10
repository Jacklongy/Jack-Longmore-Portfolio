/* ===== Helpers ===== */
function onVisible(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}

/* ===== Card / fade reveal using IntersectionObserver ===== */
(function revealObserver() {
  const items = document.querySelectorAll('.card, .fade-item, .gallery-item');
  if (!items.length) return;

  const obs = new IntersectionObserver(onVisible, {
    root: null,
    threshold: 0.18
  });

  items.forEach(i => obs.observe(i));
})();

/* ===== ScrollSpy: highlight sidebar link for current section ===== */
(function sectionSpy() {
  const sections = Array.from(document.querySelectorAll('section[id]'));
  const links = Array.from(document.querySelectorAll('.sidebar a'));
  if (!sections.length || !links.length) return;

  function update() {
    const mid = window.scrollY + window.innerHeight / 2;
    let current = sections[0].id;

    for (const s of sections) {
      const top = s.offsetTop;
      const bottom = top + s.offsetHeight;
      if (mid >= top && mid < bottom) {
        current = s.id;
        break;
      }
      if (mid >= bottom) current = s.id;
    }

    links.forEach(l => {
      const href = l.getAttribute('href').replace('#', '');
      l.classList.toggle('active', href === current);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
})();

/* ===== Nav current page highlight (based on filename) ===== */
(function highlightCurrentPage() {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // compare normalized
    const name = href.split('/').pop();
    if (name === here) a.classList.add('current');
  });
})();

/* ===== Parallax banner (smooth via rAF) ===== */
(function parallaxBanner() {
  const banner = document.querySelector('.banner');
  if (!banner) return;

  let latestScroll = 0;
  let ticking = false;

  function onScroll() {
    latestScroll = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  function update() {
    const offset = latestScroll * 0.4; // tweak speed here
    banner.style.backgroundPosition = `center ${-offset}px`;
    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // set initial position in case page loaded scrolled
  update();
})();
