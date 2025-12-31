/* ===== Slideshow Functionality ===== */
let slideIndex = 1;

function changeSlide(n) {
  showSlide(slideIndex += n);
}

function currentSlide(n) {
  showSlide(slideIndex = n);
}

function showSlide(n) {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  if (!slides.length) return;
  
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  
  slides.forEach(slide => {
    slide.style.display = 'none';
  });
  
  dots.forEach(dot => {
    dot.classList.remove('active');
  });
  
  slides[slideIndex - 1].style.display = 'block';
  dots[slideIndex - 1].classList.add('active');
}

// Initialize slideshow
document.addEventListener('DOMContentLoaded', () => {
  showSlide(slideIndex);
});

// Auto-advance slideshow every 5 seconds
setInterval(() => {
  changeSlide(1);
}, 5000);

/* ===== Banner Parallax Scroll Animation ===== */
(() => {
  const banner = document.querySelector('.banner');
  
  if (!banner) return;

  // Add GPU acceleration
  banner.style.willChange = 'transform';
  banner.style.transform = 'translateZ(0)';

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Move background image slower than scroll using transform
    const parallaxAmount = scrollY * 0.5;
    banner.style.backgroundPosition = `center calc(-${parallaxAmount}px)`;
  }, { passive: true });
})();

/* ===== CAROUSEL - OPTIMAL INFINITE LOOP ===== */
(() => {
  const carousels = document.querySelectorAll('.carousel-container');
  
  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel-track');
    if (!track) return;

    const originalItems = Array.from(track.querySelectorAll('.carousel-item'));
    const itemCount = originalItems.length;
    if (itemCount === 0) return;

    // Clone items twice for seamless looping
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });
    originalItems.forEach(item => {
      track.appendChild(item.cloneNode(true));
    });

    const itemWidth = 500;
    const gap = 32;
    const itemDistance = itemWidth + gap;
    const singleLoopDistance = itemCount * itemDistance;
    const totalDistance = singleLoopDistance * 3;

    let scrollPosition = 0;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;
    let isAutoRotating = true;
    let velocity = 0;
    const smoothSpeed = 8;
    const friction = 0.88;

    // Update transform
    const updateTransform = () => {
      track.style.transform = `translateX(-${scrollPosition}px)`;
    };

    // Animation with proper looping
    const animate = () => {
      if (!isDragging) {
        if (isAutoRotating) {
          scrollPosition += smoothSpeed / 60;
        } else if (Math.abs(velocity) > 0.1) {
          scrollPosition += velocity;
          velocity *= friction;
        }

        // When we've scrolled 2x the loop distance, reset to start
        if (scrollPosition >= singleLoopDistance * 2) {
          scrollPosition = 0;
          track.style.transition = 'none';
        }
      }
      
      updateTransform();
      requestAnimationFrame(animate);
    };

    const stopAutoRotate = () => {
      isAutoRotating = false;
      setTimeout(() => {
        isAutoRotating = true;
      }, 8000);
    };

    // Mouse drag
    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      startScrollLeft = scrollPosition;
      track.style.cursor = 'grabbing';
      track.style.transition = 'none';
      isAutoRotating = false;
      velocity = 0;
    });

    let lastX = 0;
    let lastTime = 0;

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;

      const now = Date.now();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollPosition = startScrollLeft - walk;

      // Clamp to valid range
      scrollPosition = Math.max(0, Math.min(scrollPosition, totalDistance));
      
      updateTransform();
      
      if (lastTime > 0) {
        velocity = (lastX - x) * 0.08;
      }
      
      lastX = x;
      lastTime = now;
    });

    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.cursor = 'grab';
      track.style.transition = 'transform 0.3s ease-out';
      lastTime = 0;
      stopAutoRotate();
    });

    // Touch support
    track.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - carousel.offsetLeft;
      startScrollLeft = scrollPosition;
      track.style.transition = 'none';
      isAutoRotating = false;
      velocity = 0;
      lastTime = 0;
    });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;

      const now = Date.now();
      const x = e.touches[0].pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1.5;
      scrollPosition = startScrollLeft - walk;

      scrollPosition = Math.max(0, Math.min(scrollPosition, totalDistance));
      
      updateTransform();
      
      if (lastTime > 0) {
        velocity = (lastX - x) * 0.08;
      }
      
      lastX = x;
      lastTime = now;
    });

    document.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = 'transform 0.3s ease-out';
      track.style.cursor = 'grab';
      lastTime = 0;
      stopAutoRotate();
    });

    track.style.cursor = 'grab';
    animate();
  });
})();

/* ===== Sidebar Navigation Active State ===== */
(() => {
  const sidebarLinks = document.querySelectorAll('.sidebar a');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sidebarLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section && section.offsetTop <= window.scrollY + 100) {
        current = link.getAttribute('href');
      }
    });

    sidebarLinks.forEach(link => {
      link.classList.remove('active');
    });

    if (current) {
      document.querySelector(`.sidebar a[href="${current}"]`)?.classList.add('active');
    }
  });
})();

/* ===== Card Fade Reveal on Scroll ===== */
(() => {
  const cards = document.querySelectorAll('.card, .fade-item, .gallery-item, .featured-card, .stat-card, .carousel-item');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  cards.forEach(card => observer.observe(card));
})();

/* ===== Expandable Cards Parallax & Preview ===== */
(() => {
  const previewFollower = document.getElementById('previewFollower');
  const previewImage = document.getElementById('previewImage');
  const projectCards = document.querySelectorAll('.project-card');
  
  if (!projectCards.length) return;

  // Mouse move tracker
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (previewFollower) {
      previewFollower.style.left = (mouseX + 15) + 'px';
      previewFollower.style.top = (mouseY + 15) + 'px';
    }
  });

  // Scroll-based parallax ONLY on Games & YouTube sections
  const gamesSection = document.getElementById('games');
  const youtubeSection = document.getElementById('youtube');
  
  window.addEventListener('scroll', () => {
    projectCards.forEach(card => {
      // Only apply parallax if card is in Games or YouTube section
      const isInGamesSection = gamesSection && gamesSection.contains(card);
      const isInYoutubeSection = youtubeSection && youtubeSection.contains(card);
      
      if (!isInGamesSection && !isInYoutubeSection) return;
      
      const cardRect = card.getBoundingClientRect();
      const cardCenter = cardRect.top + cardRect.height / 2;
      const screenCenter = window.innerHeight / 2;
      const distance = screenCenter - cardCenter;
      
      // Apply parallax to images within card
      const imgs = card.querySelectorAll('img, .youtube-video');
      imgs.forEach(el => {
        const parallaxAmount = distance * 0.15;
        el.style.transform = `translateY(${parallaxAmount}px)`;
      });
    });
  });

  // Project card hover handlers for preview
  projectCards.forEach(card => {
    const header = card.querySelector('.project-header');
    
    // Hide preview when clicking to expand/collapse
    header.addEventListener('click', () => {
      if (previewFollower) {
        previewFollower.classList.remove('active');
      }
    });
    
    card.addEventListener('mouseenter', () => {
      if (previewFollower) {
        const previewSrc = card.dataset.preview;
        if (previewSrc) {
          previewImage.src = previewSrc;
          previewFollower.classList.add('active');
        }
      }
    });

    card.addEventListener('mouseleave', () => {
      if (previewFollower) {
        previewFollower.classList.remove('active');
      }
    });
  });
})();

/* ===== Scroll indicator ===== */
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
  document.querySelector('section')?.scrollIntoView({ behavior: 'smooth' });
});



