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

/* ===== DOM READY ===== */
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav();
  document.querySelectorAll('.animate-target').forEach(el => observer.observe(el));
  initHeroBannerSlider();

  // Set initial aria-expanded for FAQ buttons
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
  });
});
