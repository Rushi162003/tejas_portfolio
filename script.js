// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Typing effect
const phrases = [
  'fast interfaces.',
  'full-stack apps.',
  'clean APIs.',
  'real-time tools.',
  'great UX.',
];
let phraseIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typed');

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 60 : 90);
}
type();

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}` ? 'white' : '';
  });
}, { passive: true });

// Contact form (Formspree)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('cf-status');
const submitBtn = document.getElementById('cf-submit');
const submitLabel = submitBtn.querySelector('.btn-label');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitLabel.textContent = 'Sending...';
  formStatus.className = 'form-status';
  formStatus.textContent = '';

  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' },
    });
    if (res.ok) {
      contactForm.reset();
      formStatus.classList.add('success');
      formStatus.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
    } else {
      const data = await res.json().catch(() => ({}));
      formStatus.classList.add('error');
      formStatus.textContent = data.errors
        ? data.errors.map(err => err.message).join(', ')
        : 'Something went wrong. Please try again or email me directly.';
    }
  } catch {
    formStatus.classList.add('error');
    formStatus.textContent = 'Network error. Please check your connection and try again.';
  } finally {
    submitBtn.disabled = false;
    submitLabel.textContent = 'Send Message';
  }
});
