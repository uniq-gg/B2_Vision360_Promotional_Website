/* ══════════════════════════════════════════════════════
   Vision360 — B2 Promotional Website — Main JS
   ══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Add animation keyframes ── */
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleEl);

  /* ── Active nav link on scroll ── */
  const sections = ['home', 'about', 'mission', 'platform', 'team', 'contact'];
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile a');

  function updateActiveNav() {
    let current = 'home';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 110) current = id;
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === '#' + current) link.classList.add('active');
    });
  }

  /* ── NAV scroll effect ── */
  const nav = document.getElementById('main-nav');

  function onScroll() {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // safe to call now — sections & navLinks are initialized above

  /* ── Mobile menu toggle ── */
  const navToggle = document.getElementById('nav-toggle');
  const navMobile = document.getElementById('nav-mobile');
  let mobileOpen = false;

  function openMobile() {
    mobileOpen = true;
    navMobile.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  }

  function closeMobile() {
    mobileOpen = false;
    navMobile.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }

  navToggle.addEventListener('click', () => { mobileOpen ? closeMobile() : openMobile(); });
  navToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mobileOpen ? closeMobile() : openMobile(); }
  });
  navMobile.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMobile));

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = (document.getElementById('main-nav') || {}).offsetHeight || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── Scroll reveal with IntersectionObserver ── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  } else {
    // Fallback: show everything immediately
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Skill bar animation ── */
  const skillFills = document.querySelectorAll('.skill-bar-fill');
  if ('IntersectionObserver' in window) {
    const skillObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const w = fill.getAttribute('data-width') || '0';
          fill.style.width = w + '%';
          skillObs.unobserve(fill);
        }
      });
    }, { threshold: 0.4 });
    skillFills.forEach(fill => {
      fill.style.width = '0';
      skillObs.observe(fill);
    });
  }

  /* ── Orb parallax on mouse move ── */
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');
  let ticking = false;
  let lastX = 0, lastY = 0;

  document.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const x = (lastX / window.innerWidth - 0.5) * 30;
        const y = (lastY / window.innerHeight - 0.5) * 30;
        if (orb1) orb1.style.transform = `translate(${x * 0.5}px, ${y * 0.5}px)`;
        if (orb2) orb2.style.transform = `translate(${-x * 0.4}px, ${-y * 0.4}px)`;
        if (orb3) orb3.style.transform = `translate(calc(-50% + ${x * 0.3}px), calc(-50% + ${y * 0.3}px))`;
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ── Hero entrance animations ── */
  const heroElements = [
    { sel: '#hero-badge',       delay: '0s' },
    { sel: '.hero-headline .line-1', delay: '0.15s' },
    { sel: '.hero-headline .line-2', delay: '0.35s' },
    { sel: '.hero-headline .line-3', delay: '0.55s' },
    { sel: '.hero-sub',         delay: '0.75s' },
    { sel: '.hero-actions',     delay: '0.95s' },
    { sel: '.hero-stats',       delay: '1.1s' },
    { sel: '.hero-visual',      delay: '0.4s' },
  ];
  heroElements.forEach(({ sel, delay }) => {
    const el = document.querySelector(sel);
    if (el) {
      el.style.opacity = '0';
      el.style.animation = `fadeInUp 0.8s ease ${delay} both`;
    }
  });

  /* ── Team card keyboard accessibility ── */
  document.querySelectorAll('.team-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'article');
  });

  /* ── Scroll to top ── */
  const backTopLink = document.getElementById('footer-back-top');
  if (backTopLink) {
    backTopLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  console.log('%cVision360 — B2 Promotional Website v1.0 🚀', 'color: #4FC0D0; font-weight: bold; font-size: 14px;');
  console.log('%cTeam 1 | CET257 Enterprise Project', 'color: #E8871E; font-size: 12px;');
})();

/* ── FAQ Accordion ── */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const answerId = btn.getAttribute('aria-controls');
    const answer = document.getElementById(answerId);
    // Close all others
    document.querySelectorAll('.faq-q').forEach(other => {
      if (other !== btn) {
        other.setAttribute('aria-expanded', 'false');
        const otherId = other.getAttribute('aria-controls');
        const otherAnswer = document.getElementById(otherId);
        if (otherAnswer) otherAnswer.hidden = true;
      }
    });
    // Toggle this one
    btn.setAttribute('aria-expanded', String(!expanded));
    if (answer) answer.hidden = expanded;
  });
});

/* ── Contact Form (demo handler) ── */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const gdpr = document.getElementById('gdpr-consent');
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const msg = document.getElementById('contact-msg');
    // Simple client-side validation
    if (!name.value.trim() || !email.value.trim() || !msg.value.trim()) {
      [name, email, msg].forEach(el => {
        if (!el.value.trim()) el.style.borderColor = 'rgba(232,135,30,0.8)';
        else el.style.borderColor = '';
      });
      return;
    }
    if (!gdpr.checked) {
      gdpr.closest('.form-gdpr').style.borderColor = 'rgba(232,135,30,0.6)';
      return;
    }
    // In a real deployment this would POST to a backend endpoint.
    // For this prototype, show the success message.
    contactForm.style.display = 'none';
    if (formSuccess) formSuccess.hidden = false;
  });
  // Reset validation highlights on input
  contactForm.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => { input.style.borderColor = ''; });
  });
}
