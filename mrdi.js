/* ═══════════════════════════════════════════
   MRDI — Shared JS — All Pages
═══════════════════════════════════════════ */

(function () {
  'use strict';

  const WA_URL = 'https://api.whatsapp.com/send?phone=918905636766&text=Hi%2C%20I%20got%20your%20WhatsApp%20information%20from%20your%20website.';

  /* ── Hamburger ─────────────────────────── */
  const ham = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  if (ham && nav) {
    ham.addEventListener('click', () => {
      ham.classList.toggle('open');
      nav.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!ham.contains(e.target) && !nav.contains(e.target)) {
        ham.classList.remove('open');
        nav.classList.remove('open');
      }
    });
  }

  /* ── Active nav link ───────────────────── */
  const path = window.location.pathname.split('/').filter(Boolean).pop() || 'index';
  document.querySelectorAll('.nav-item > a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.includes(path) || (path === 'index' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── Scroll reveal ─────────────────────── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── Header frost on scroll ─────────────── */
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.style.background = window.scrollY > 40
      ? 'rgba(6,14,28,.98)' : 'rgba(10,25,47,.96)';
  }, { passive: true });

  /* ── Smooth anchor scroll ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ── Enquiry form submit ────────────────── */
  const enquiryForm = document.getElementById('enquiry-form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', e => {
      e.preventDefault();
      const name  = enquiryForm.querySelector('[name="name"]').value.trim();
      const phone = enquiryForm.querySelector('[name="phone"]').value.trim();
      const prog  = enquiryForm.querySelector('[name="program"]').value;
      if (!name || !phone) { alert('Please fill in Name and Phone.'); return; }
      const msg = `Hi, I'm ${name}. I'm interested in the ${prog} at MRDI. My phone: ${phone}`;
      window.open(`https://api.whatsapp.com/send?phone=918905636766&text=${encodeURIComponent(msg)}`, '_blank');
    });
  }

  /* ── Contact form ───────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="cname"]').value.trim();
      const msg  = contactForm.querySelector('[name="cmsg"]').value.trim();
      if (!name || !msg) { alert('Please fill all fields.'); return; }
      const text = `Hi, I'm ${name}. ${msg}`;
      window.open(`https://api.whatsapp.com/send?phone=918905636766&text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  /* ── Subscribe ──────────────────────────── */
  document.querySelectorAll('.subscribe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const email = input ? input.value.trim() : '';
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Thank you! You\'re now subscribed to MRDI updates.');
        if (input) input.value = '';
      } else {
        alert('Please enter a valid email address.');
      }
    });
  });

  /* --- Clickable cards --- */
  document.querySelectorAll('[data-href]').forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
    if (!el.getAttribute('role')) el.setAttribute('role', 'link');

    const openLinkedCard = e => {
      const innerInteractive = e.target.closest('a, button, input, select, textarea, label');
      if (innerInteractive && innerInteractive !== el) return;

      const href = el.getAttribute('data-href');
      if (!href) return;

      if (el.getAttribute('data-target') === '_blank') {
        window.open(href, '_blank', 'noopener');
      } else {
        window.location.href = href;
      }
    };

    el.addEventListener('click', openLinkedCard);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLinkedCard(e);
      }
    });
  });

  /* WA float inject */
  if (!document.querySelector('.wa-float')) {
    const wa = document.createElement('a');
    wa.href = WA_URL; wa.target = '_blank';
    wa.className = 'wa-float'; wa.title = 'Chat on WhatsApp';
    wa.innerHTML = '💬';
    document.body.appendChild(wa);
  }

})();

