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

/* ===== TESTIMONIAL SLIDER ===== */
function initTestimonialSlider() {
  const wrapper = document.querySelector('.testimonial-slider-wrapper');
  const slider = document.getElementById('testimonialSlider');
  const prev = document.getElementById('sliderPrev');
  const next = document.getElementById('sliderNext');
  const dotsContainer = document.getElementById('sliderDots');
  if (!slider || !wrapper) return;

  const getSlides = () => Array.from(slider.querySelectorAll('.testimonial-slide'));

  const getSlidesPerView = () => {
    const w = window.innerWidth;
    if (w <= 600) return 1;
    if (w <= 900) return 2;
    return 3;
  };

  let slidesPerView = getSlidesPerView();
  // logical current page index for dots
  let currentPage = 0;
  let autoplayInterval = null;

  // Set widths for slides so translation by wrapper width works predictably
  const setSizes = () => {
    slidesPerView = getSlidesPerView();
    const pageWidth = wrapper.clientWidth;
    const style = window.getComputedStyle(slider);
    const gap = parseFloat(style.gap) || 0;
    const currentSlides = getSlides();
    // Calculate slide width so that slidesPerView items plus gaps exactly fill wrapper
    const slideWidth = (pageWidth - gap * (slidesPerView - 1)) / slidesPerView;
    currentSlides.forEach(slide => {
      slide.style.minWidth = `${slideWidth}px`;
      slide.style.maxWidth = `${slideWidth}px`;
    });
    // total width = slideWidth * count + gap * (count - 1)
    const totalWidth = slideWidth * currentSlides.length + gap * Math.max(0, currentSlides.length - 1);
    slider.style.width = `${Math.ceil(totalWidth)}px`;
  };

  const renderDots = () => {
    if (!dotsContainer) return;
    const pages = Math.max(1, Math.ceil(getSlides().length / slidesPerView));
    dotsContainer.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const btn = document.createElement('button');
      btn.className = 'slider-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      btn.dataset.index = i;
      btn.addEventListener('click', () => {
        // compute shortest direction and step accordingly
        const pagesNow = Math.max(1, Math.ceil(getSlides().length / slidesPerView));
        const target = i;
        let diff = (target - currentPage + pagesNow) % pagesNow;
        if (diff === 0) return;
        if (diff <= pagesNow / 2) {
          const run = () => { if (diff-- > 0) nextPage(run); };
          run();
        } else {
          diff = pagesNow - diff;
          const run = () => { if (diff-- > 0) prevPage(run); };
          run();
        }
        restartAutoplay();
      });
      dotsContainer.appendChild(btn);
    }
  };

  const update = () => {
    slidesPerView = getSlidesPerView();
    // keep transform neutral since we rearrange DOM on animation end
    slider.style.transition = 'none';
    slider.style.transform = `translate3d(0px,0,0)`;
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.slider-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === currentPage));
    }
    requestAnimationFrame(() => { slider.style.transition = ''; });
  };

  // shift helpers
  const animateShift = (direction = 'next', cb) => {
    const pageW = wrapper.clientWidth;
    const distance = direction === 'next' ? -pageW : pageW;
    // animate
    slider.style.transition = 'transform 0.45s cubic-bezier(.2,.9,.2,1)';
    slider.style.transform = `translate3d(${distance}px,0,0)`;
    const onEnd = (e) => {
      if (e && e.target !== slider) return;
      slider.removeEventListener('transitionend', onEnd);
      const n = slidesPerView;
      if (direction === 'next') {
        for (let i = 0; i < n; i++) {
          const first = slider.firstElementChild;
          if (!first) break;
          slider.appendChild(first);
        }
      } else {
        for (let i = 0; i < n; i++) {
          const last = slider.lastElementChild;
          if (!last) break;
          slider.insertBefore(last, slider.firstElementChild);
        }
      }
      // reset transform without animation
      slider.style.transition = 'none';
      slider.style.transform = `translate3d(0px,0,0)`;
      slider.getBoundingClientRect();
      requestAnimationFrame(() => { slider.style.transition = ''; });

      const pagesNow = Math.max(1, Math.ceil(getSlides().length / slidesPerView));
      if (direction === 'next') currentPage = (currentPage + 1) % pagesNow;
      else currentPage = (currentPage - 1 + pagesNow) % pagesNow;

      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === currentPage));
      }

      if (typeof cb === 'function') cb();
    };
    slider.addEventListener('transitionend', onEnd);
  };

  const nextPage = (cb) => { animateShift('next', cb); };
  const prevPage = (cb) => { animateShift('prev', cb); };

  const startAutoplay = (delay = 5000) => {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      nextPage();
    }, delay);
  };
  const stopAutoplay = () => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval);
      autoplayInterval = null;
    }
  };
  const restartAutoplay = () => { stopAutoplay(); startAutoplay(5000); };

  // Initial sizing and render
  setSizes();
  renderDots();
  update();

  // Handlers
  if (next) next.addEventListener('click', () => { nextPage(); restartAutoplay(); });
  if (prev) prev.addEventListener('click', () => { prevPage(); restartAutoplay(); });

  // Keep autoplay running continuously (no pause on hover)
  // (Interactions still restart autoplay to keep loop behaviour predictable)

  // Recompute on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const firstVisibleIndex = currentPage * slidesPerView;
      setSizes();
      const newSPV = getSlidesPerView();
      slidesPerView = newSPV;
      const newPage = Math.floor(firstVisibleIndex / slidesPerView);
      currentPage = Math.max(0, newPage);
      renderDots();
      update();
    }, 120);
  });

  // start autoplay
  startAutoplay(5000);
}

/* ===== DOM READY ===== */
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  document.querySelectorAll('.animate-target').forEach(el => observer.observe(el));
  initHeroBannerSlider();
  initTestimonialSlider();

  // Set initial aria-expanded for FAQ buttons
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
  });
});
