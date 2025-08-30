/* ===== ScrollSpy + Current Page Highlight ===== */
(function highlightCurrentPage() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === here) a.classList.add("current");
  });
})();

/* ===== ScrollSpy for sidebar sections ===== */
(function sectionSpy() {
  const sections = Array.from(document.querySelectorAll("section"));
  const links = Array.from(document.querySelectorAll(".sidebar a"));
  if (!sections.length || !links.length) return;

  function setActive() {
    const midY = window.scrollY + window.innerHeight / 2;
    let currentId = sections[0].id;

    for (const s of sections) {
      const top = s.offsetTop;
      const bottom = top + s.offsetHeight;
      if (midY >= top && midY < bottom) {
        currentId = s.id;
        break;
      }
      if (midY >= bottom) { currentId = s.id; }
    }

    links.forEach(l => {
      l.classList.toggle("active", l.getAttribute("href").replace('#', '') === currentId);
    });
  }

  ["load", "scroll", "resize"].forEach(evt => window.addEventListener(evt, setActive, { passive: true }));
  setActive();
})();

/* ===== Scroll-triggered card animations ===== */
(function animateCardsOnScroll() {
  const cards = document.querySelectorAll(".card");

  function revealCards() {
    const triggerBottom = window.innerHeight * 0.85;

    cards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        card.classList.add("active");
      } else {
        card.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", revealCards);
  window.addEventListener("load", revealCards);
})();
