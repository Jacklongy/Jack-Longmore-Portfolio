/* ===== Helpers ===== */
const onVisible = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
};

/* ===== Card / Fade Reveal ===== */
(() => {
  const items = document.querySelectorAll(".card, .fade-item, .gallery-item");
  if (!items.length) return;

  const observer = new IntersectionObserver(onVisible, {
    threshold: 0.18,
  });

  items.forEach(item => observer.observe(item));
})();

/* ===== ScrollSpy (Sidebar Links) ===== */
(() => {
  const sections = [...document.querySelectorAll("section[id]")];
  const links = [...document.querySelectorAll(".sidebar a")];
  if (!sections.length || !links.length) return;

  const update = () => {
    const mid = window.scrollY + window.innerHeight / 2;
    let current = sections[0].id;

    for (const s of sections) {
      const { offsetTop: top, offsetHeight: height } = s;
      const bottom = top + height;
      if (mid >= top && mid < bottom) {
        current = s.id;
        break;
      }
      if (mid >= bottom) current = s.id;
    }

    links.forEach(link => {
      const href = link.getAttribute("href")?.replace("#", "");
      link.classList.toggle("active", href === current);
    });
  };

  ["scroll", "resize", "load"].forEach(evt =>
    window.addEventListener(evt, update, { passive: true })
  );
  update();
})();

/* ===== Nav Current Page Highlight ===== */
(() => {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav a").forEach(a => {
    const name = a.getAttribute("href")?.split("/").pop();
    if (name === here) a.classList.add("current");
  });
})();

/* ===== Parallax Banner ===== */
(() => {
  const banner = document.querySelector(".banner");
  if (!banner) return;

  let latestScroll = 0;
  let ticking = false;

  const update = () => {
    banner.style.backgroundPosition = `center ${-latestScroll * 0.4}px`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      latestScroll = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update(); // in case page is already scrolled
})();



