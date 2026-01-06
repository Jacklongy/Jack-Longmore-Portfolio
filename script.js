/* ===== Collapsible Toggle Functionality ===== */
function toggleCollapsible(header) {
  const content = header.nextElementSibling;
  
  header.classList.toggle('active');
  content.classList.toggle('active');
  
  if (content.classList.contains('active')) {
    content.style.maxHeight = content.scrollHeight + 'px';
  } else {
    content.style.maxHeight = '0';
  }
}

/* ===== Featured Carousel Navigation ===== */
let carouselIndex = 0;
let carouselAutoPlayTimer;

function moveCarousel(direction) {
  const items = document.querySelectorAll('.featured-carousel-item');
  
  if (!items.length) return;
  
  carouselIndex += direction;
  
  if (carouselIndex < 0) {
    carouselIndex = items.length - 1;
  } else if (carouselIndex >= items.length) {
    carouselIndex = 0;
  }
  
  updateCarouselPosition(items);
  
  // Reset auto-play timer when manually navigating
  clearTimeout(carouselAutoPlayTimer);
  startCarouselAutoPlay();
}

function updateCarouselPosition(items) {
  // Always show 3 items: prev, active (big), next
  items.forEach((item, index) => {
    item.classList.remove('active');
  });
  items[carouselIndex].classList.add('active');
  
  // Calculate which items are visible and position them
  const track = document.querySelector('.featured-carousel-track');
  const prevIndex = carouselIndex === 0 ? items.length - 1 : carouselIndex - 1;
  const nextIndex = (carouselIndex + 1) % items.length;
  
  // Set order of visible items to always show 3
  const orderedItems = [
    items[prevIndex],
    items[carouselIndex], 
    items[nextIndex]
  ];
  
  // Clear and rebuild order
  orderedItems.forEach((item, visIndex) => {
    item.style.order = visIndex;
  });
  
  items.forEach((item, index) => {
    if (![prevIndex, carouselIndex, nextIndex].includes(index)) {
      item.style.order = 999; // Hide other items
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });
}

function startCarouselAutoPlay() {
  carouselAutoPlayTimer = setInterval(() => {
    moveCarouselAuto();
  }, 4000); // Auto-advance every 4 seconds
}

function moveCarouselAuto() {
  const items = document.querySelectorAll('.featured-carousel-item');
  if (!items.length) return;
  
  carouselIndex = (carouselIndex + 1) % items.length;
  updateCarouselPosition(items);
}

/* ===== Journey Carousel Navigation ===== */
let journeyCarouselIndex = 0;

function moveJourneyCarousel(direction) {
  const items = document.querySelectorAll('.journey-carousel-item');
  
  if (!items.length) return;
  
  journeyCarouselIndex += direction;
  
  if (journeyCarouselIndex < 0) {
    journeyCarouselIndex = items.length - 1;
  } else if (journeyCarouselIndex >= items.length) {
    journeyCarouselIndex = 0;
  }
  
  updateJourneyCarouselPosition(items);
}

function updateJourneyCarouselPosition(items) {
  // Always show 3 items: prev, active (big), next
  items.forEach((item, index) => {
    item.classList.remove('active');
  });
  items[journeyCarouselIndex].classList.add('active');
  
  // Set order of visible items to always show 3
  const prevIndex = journeyCarouselIndex === 0 ? items.length - 1 : journeyCarouselIndex - 1;
  const nextIndex = (journeyCarouselIndex + 1) % items.length;
  
  const orderedItems = [
    items[prevIndex],
    items[journeyCarouselIndex], 
    items[nextIndex]
  ];
  
  // Clear and rebuild order
  orderedItems.forEach((item, visIndex) => {
    item.style.order = visIndex;
  });
  
  items.forEach((item, index) => {
    if (![prevIndex, journeyCarouselIndex, nextIndex].includes(index)) {
      item.style.order = 999;
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.featured-carousel-item');
  if (items.length > 0) {
    items[0].classList.add('active');
    startCarouselAutoPlay();
  }
});

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

  // Subtle parallax effect on scroll
  let ticking = false;
  
  function updateParallax() {
    const scrollY = window.scrollY;
    const bannerBottom = banner.offsetHeight;
    
    // Only apply parallax when banner is visible
    if (scrollY < bannerBottom) {
      const parallaxValue = scrollY * 0.05;
      banner.style.backgroundPosition = `center ${parallaxValue}px`;
    }
    
    ticking = false;
  }
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
  
  // Initial call
  updateParallax();
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

/* ===== Parallax on Cards (No Preview Follower) ===== */
(() => {
  const projectCards = document.querySelectorAll('.project-card');
  
  if (!projectCards.length) return;

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
})();

/* ===== Scroll indicator ===== */
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
  document.querySelector('section')?.scrollIntoView({ behavior: 'smooth' });
});



