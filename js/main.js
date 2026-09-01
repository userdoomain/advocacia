/* ============================================================
   Rafael Mendes Advocacia — Interactions
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navbar scroll state ---------- */
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  let menuOpen = false;

  const setMenu = (open) => {
    menuOpen = open;
    menuToggle.classList.toggle('open', open);
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  menuToggle.addEventListener('click', () => setMenu(!menuOpen));
  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a');

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((sec) => spy.observe(sec));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        const el = entry.target;
        const target = Number(el.dataset.count);
        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased).toLocaleString('en-US');
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- Testimonials slider ---------- */
  const slidesEl = document.getElementById('slides');
  const dotsEl = document.getElementById('dots');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const slides = slidesEl.children;
  let current = 0;
  let timer;

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(dot);
  }

  const dots = dotsEl.children;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slidesEl.style.transform = 'translateX(-' + current * 100 + '%)';
    Array.from(dots).forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); restart(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); restart(); });

  function restart() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 7000);
  }
  restart();

  document.querySelector('.slider').addEventListener('mouseenter', () => clearInterval(timer));
  document.querySelector('.slider').addEventListener('mouseleave', restart);

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const successBox = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    const name = form.name;
    const phone = form.phone;
    const email = form.email;

    [name, phone, email].forEach((field) => field.classList.remove('error'));

    if (name.value.trim().length < 3) { name.classList.add('error'); valid = false; }
    if (!/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/.test(phone.value.trim())) { phone.classList.add('error'); valid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { email.classList.add('error'); valid = false; }

    if (!valid) return;

    form.reset();
    successBox.classList.add('show');
    setTimeout(() => successBox.classList.remove('show'), 6000);
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();