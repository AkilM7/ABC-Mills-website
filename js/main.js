/* ===== NAVIGATION ===== */
function updateActiveNav() {
  const currentPage = document.body.dataset.page;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === currentPage);
  });
}

const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', function () {
    const navLinks = document.getElementById('navLinks');
    const isOpen = navLinks.classList.toggle('open');
    this.classList.toggle('open', isOpen);
    this.setAttribute('aria-expanded', isOpen);
  });
}

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (navLinks) navLinks.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
});

window.addEventListener('scroll', function () {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ===== FAQ TOGGLE ===== */
function toggleFaq(btn) {
  const answer = btn.nextElementSibling;
  const isOpen = btn.classList.contains('open');

  // Close all FAQs first
  document.querySelectorAll('.faq-question').forEach(q => {
    q.classList.remove('open');
    q.nextElementSibling.classList.remove('open');
    q.setAttribute('aria-expanded', 'false');
  });

  // If the clicked FAQ wasn't open, open it
  if (!isOpen) {
    btn.classList.add('open');
    answer.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

/* ===== CONTACT FORM ===== */
function submitForm() {
  const form = document.getElementById('contactForm');
  const errorsEl = document.getElementById('formErrors');
  const successEl = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('contactSubmit');

  if (!form) return;

  const name = document.getElementById('name')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const message = document.getElementById('message')?.value.trim();

  const problems = [];
  if (!name) problems.push('Please enter your name.');
  if (!email) problems.push('Please enter your email address.');
  if (!message) problems.push('Please enter a message.');

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRx.test(email)) problems.push('Please enter a valid email address.');

  if (problems.length) {
    if (errorsEl) {
      errorsEl.style.display = 'block';
      errorsEl.textContent = problems.join(' ');
    } else {
      alert(problems.join('\n'));
    }
    // focus first invalid
    if (!name) document.getElementById('name')?.focus();
    else if (!email) document.getElementById('email')?.focus();
    else if (!message) document.getElementById('message')?.focus();
    return false;
  }

  // Simulate successful submit (no backend) — show accessible success message
  if (errorsEl) { errorsEl.style.display = 'none'; errorsEl.textContent = ''; }
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-disabled', 'true');
  }

  if (successEl) {
    successEl.style.display = 'block';
  }

  // Clear fields after a short delay to let screen readers announce the success
  setTimeout(() => {
    ['name', 'email', 'phone', 'message'].forEach(id => {
      const field = document.getElementById(id);
      if (field) field.value = '';
    });
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-disabled');
    }
    if (successEl) {
      // keep success visible briefly then hide
      setTimeout(() => { successEl.style.display = 'none'; }, 4000);
    }
  }, 350);

  return false;
}

/* ===== SCROLL ANIMATIONS ===== */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

/* ===== HERO BANNER SLIDER ===== */
function initHeroBannerSlider() {
  const slides = document.querySelectorAll('.hero-banner-slide');
  const dots = document.querySelectorAll('.hero-banner-dot');
  if (!slides.length) return;

  let currentIndex = 0;
  let slideInterval;

  const showSlide = (index) => {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentIndex = index;
  };

  const nextSlide = () => {
    showSlide((currentIndex + 1) % slides.length);
  };

  // Auto rotate slides
  slideInterval = setInterval(nextSlide, 5000);

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    });
  });

  // Show first slide
  showSlide(0);
}

/* ===== STATS ANIMATION (moved from index.html) ===== */
function initStatsAnimation() {
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  if (!statNums.length) return;

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const obs = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNums.forEach(el => obs.observe(el));
}

/* ===== GALLERY / FANCYBOX INIT (moved from gallery.html) ===== */
function initGalleryFancybox() {
  if (!window.jQuery || !jQuery.fn || typeof jQuery.fn.fancybox !== 'function') return;

  $(document).ready(function() {
    $('[data-fancybox="gallery"]').fancybox({
      loop: true,
      animationEffect: 'zoom',
      transitionEffect: 'fade',
      thumbs: {
        autoStart: true,
        hideOnClose: false,
        axis: 'y'
      },
      buttons: [
        'zoom',
        'slideShow',
        'thumbs',
        'close'
      ],
      beforeShow: function(instance, current) {
        if (instance && instance.Thumbs) instance.Thumbs.update();
      }
    });
  });
}

/* ===== TESTIMONIAL SLIDER ===== */
function initTestimonialSlider() {
  const wrapper = document.querySelector('.testimonial-slider-wrapper');
  const slider = document.getElementById('testimonialSlider');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');

  if (!slider || !wrapper) return;

  const slides = Array.from(slider.querySelectorAll('.testimonial-slide'));
  const totalSlides = slides.length;
  if (totalSlides === 0) return;

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transitionDuration = prefersReducedMotion ? 0 : 450;

  // State
  let currentIndex = 0;
  let slidesPerView = getSlidesPerView();
  let isAnimating = false;
  let autoplayInterval = null;
  let touchStartX = 0;
  let touchEndX = 0;

  function getSlidesPerView() {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  function getMaxIndex() {
    return Math.max(0, totalSlides - slidesPerView);
  }

  // Set slide widths dynamically
  function setSlideSizes() {
    slidesPerView = getSlidesPerView();
    const wrapperWidth = wrapper.clientWidth;
    const gap = parseFloat(getComputedStyle(slider).gap) || 0;
    const slideWidth = (wrapperWidth - gap * (slidesPerView - 1)) / slidesPerView;

    slides.forEach(slide => {
      slide.style.flex = `0 0 ${slideWidth}px`;
      slide.style.maxWidth = `${slideWidth}px`;
    });

    return slideWidth;
  }

  // Build dots based on how many "pages" of slides exist
  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';

    const maxIndex = getMaxIndex();
    const dotCount = maxIndex + 1; // one dot per possible starting position

    for (let i = 0; i < dotCount; i++) {
      const btn = document.createElement('button');
      btn.className = 'slider-dot' + (i === currentIndex ? ' active' : '');
      btn.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      btn.setAttribute('type', 'button');
      btn.addEventListener('click', () => {
        if (isAnimating || i === currentIndex) return;
        goToSlide(i);
        restartAutoplay();
      });
      dotsContainer.appendChild(btn);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  // Core move function: translate to show slides starting at targetIndex
  function goToSlide(targetIndex, animate = true) {
    if (isAnimating && animate) return;
    const maxIndex = getMaxIndex();
    targetIndex = Math.max(0, Math.min(targetIndex, maxIndex));

    if (targetIndex === currentIndex && animate) return;

    const slideWidth = setSlideSizes();
    const gap = parseFloat(getComputedStyle(slider).gap) || 0;
    const translateX = -(targetIndex * (slideWidth + gap));

    if (animate && !prefersReducedMotion) {
      isAnimating = true;
      slider.style.transition = `transform ${transitionDuration}ms cubic-bezier(.2,.9,.2,1)`;
    } else {
      slider.style.transition = 'none';
    }

    slider.style.transform = `translate3d(${translateX}px, 0, 0)`;
    currentIndex = targetIndex;
    updateDots();

    if (animate && !prefersReducedMotion) {
      const onEnd = (e) => {
        if (e.target !== slider) return;
        slider.removeEventListener('transitionend', onEnd);
        isAnimating = false;
      };
      slider.addEventListener('transitionend', onEnd);
      // Fallback in case transitionend doesn't fire
      setTimeout(() => { isAnimating = false; }, transitionDuration + 50);
    } else {
      isAnimating = false;
    }
  }

  function nextSlide() {
    const maxIndex = getMaxIndex();
    if (currentIndex >= maxIndex) {
      goToSlide(0); // Loop back to start
    } else {
      goToSlide(currentIndex + 1);
    }
  }

  function prevSlide() {
    const maxIndex = getMaxIndex();
    if (currentIndex <= 0) {
      goToSlide(maxIndex); // Loop to end
    } else {
      goToSlide(currentIndex - 1);
    }
  }

  // Autoplay
  function startAutoplay(delay = 5000) {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, delay);
  }

  function stopAutoplay() {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay(5000);
  }

  // Touch / Swipe support
  wrapper.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  wrapper.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    restartAutoplay();
  }, { passive: true });

  function handleSwipe() {
    const threshold = 50;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Keyboard navigation
  wrapper.setAttribute('tabindex', '0');
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Testimonials');
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
      restartAutoplay();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
      restartAutoplay();
    }
  });

  // Pause autoplay on hover/focus for accessibility
  wrapper.addEventListener('mouseenter', stopAutoplay);
  // Wrap startAutoplay so the event object is not passed as the delay arg
  wrapper.addEventListener('mouseleave', () => startAutoplay(5000));
  wrapper.addEventListener('focusin', stopAutoplay);
  wrapper.addEventListener('focusout', () => startAutoplay(5000));

  // Button handlers
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      restartAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      restartAutoplay();
    });
  }

  // Resize handler with debounce
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const oldSPV = slidesPerView;
      const newSPV = getSlidesPerView();
      if (oldSPV !== newSPV) {
        slidesPerView = newSPV;
        // Clamp current index to new valid range
        const maxIndex = getMaxIndex();
        currentIndex = Math.min(currentIndex, maxIndex);
        renderDots();
      }
      setSlideSizes();
      goToSlide(currentIndex, false);
    }, 150);
  });

  // Initialize
  setSlideSizes();
  renderDots();
  goToSlide(0, false);
  startAutoplay(5000);
}

/* ===== DOM READY ===== */
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  document.querySelectorAll('.animate-target').forEach(el => observer.observe(el));
  initHeroBannerSlider();
  initTestimonialSlider();
  // Moved from inline page scripts
  initStatsAnimation();
  initGalleryFancybox();

  // Set initial aria-expanded for FAQ buttons
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
  });
});