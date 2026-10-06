/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   MRDI â€” Shared JS â€” All Pages
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

(function () {
  'use strict';

  const WA_URL = 'https://api.whatsapp.com/send?phone=918905636766&text=Hi%2C%20I%20got%20your%20WhatsApp%20information%20from%20your%20website.';

  /* Full-page Starfield Motion background. */
  const starfield = document.createElement('canvas');
  starfield.id = 'starfield-motion-background';
  starfield.setAttribute('aria-hidden', 'true');
  document.body.prepend(starfield);
  const starCtx = starfield.getContext('2d', { alpha: true });
  if (starCtx) {
    let width = 0, height = 0, dpr = 1, points = [];
    let pointer = { x: -1000, y: -1000, active: false };
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spacing = () => innerWidth < 700 ? 25 : 21;

    const resizeStarfield = () => {
      dpr = Math.min(devicePixelRatio || 1, 1.5);
      width = innerWidth;
      height = innerHeight;
      starfield.width = Math.round(width * dpr);
      starfield.height = Math.round(height * dpr);
      starfield.style.width = `${width}px`;
      starfield.style.height = `${height}px`;
      starCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = spacing();
      points = [];
      for (let y = 8; y < height; y += gap) {
        for (let x = 8; x < width; x += gap) {
          points.push({ x, y, phase: Math.random() * Math.PI * 2, size: .7 + Math.random() * .65 });
        }
      }
    };
    resizeStarfield();
    addEventListener('resize', resizeStarfield, { passive: true });
    addEventListener('pointermove', event => {
      pointer = { x: event.clientX, y: event.clientY, active: event.pointerType !== 'touch' };
      if (reducedMotion && starCtx) drawStarfield(0);
    }, { passive: true });
    addEventListener('pointerleave', () => {
      pointer.active = false;
      if (reducedMotion && starCtx) drawStarfield(0);
    }, { passive: true });
    addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') pointer = { x: event.clientX, y: event.clientY, active: true };
      if (reducedMotion && starCtx) drawStarfield(0);
    }, { passive: true });
    addEventListener('pointerup', event => {
      if (event.pointerType === 'touch') pointer.active = false;
      if (reducedMotion && starCtx) drawStarfield(0);
    }, { passive: true });

    const drawStarfield = time => {
      starCtx.clearRect(0, 0, width, height);
      const seconds = reducedMotion ? 0 : time * .001;
      const radius = 138;
      for (const point of points) {
        let dx = 0, dy = 0, influence = 0;
        if (pointer.active) {
          const px = point.x - pointer.x, py = point.y - pointer.y;
          const distance = Math.hypot(px, py);
          if (distance < radius) {
            influence = 1 - distance / radius;
            const push = influence * influence * 13;
            const angle = distance ? Math.atan2(py, px) : 0;
            dx = Math.cos(angle) * push;
            dy = Math.sin(angle) * push;
          }
        }
        const twinkle = reducedMotion ? .5 : .5 + .5 * Math.sin(seconds * 1.15 + point.phase);
        const alpha = .3 + twinkle * .32 + influence * .38;
        starCtx.fillStyle = `rgba(20, 52, 42, ${alpha})`;
        starCtx.beginPath();
        starCtx.arc(point.x + dx, point.y + dy, point.size + influence * 1.15, 0, Math.PI * 2);
        starCtx.fill();
      }
      if (pointer.active) {
        const shade = starCtx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 190);
        shade.addColorStop(0, 'rgba(14, 31, 27, .62)');
        shade.addColorStop(.58, 'rgba(14, 31, 27, .3)');
        shade.addColorStop(1, 'rgba(14, 31, 27, 0)');
        starCtx.fillStyle = shade;
        starCtx.fillRect(pointer.x - 190, pointer.y - 190, 380, 380);
      }
      if (!reducedMotion) requestAnimationFrame(drawStarfield);
    };
    drawStarfield(0);
  }

  /* â”€â”€ Hamburger â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const ham = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  if (ham && nav) {
    nav.id ||= 'primary-navigation';
    ham.setAttribute('role', 'button');
    ham.setAttribute('tabindex', '0');
    ham.setAttribute('aria-controls', nav.id);
    ham.setAttribute('aria-expanded', 'false');
    ham.setAttribute('aria-label', 'Open navigation menu');

    const setMenuOpen = open => {
      ham.classList.toggle('open', open);
      nav.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', String(open));
      ham.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    };

    ham.addEventListener('click', () => setMenuOpen(!nav.classList.contains('open')));
    ham.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setMenuOpen(!nav.classList.contains('open'));
      }
      if (e.key === 'Escape') setMenuOpen(false);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
    nav.querySelectorAll('.nav-item').forEach(item => {
      const submenu = item.querySelector(':scope > .dropdown');
      const parentLink = item.querySelector(':scope > a');
      if (!submenu || !parentLink) return;

      const label = parentLink.textContent.trim().replace(/[▼▾⌄]+/g, '').trim();
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'submenu-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', `Show ${label} submenu`);
      toggle.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="m4 7 6 6 6-6"/></svg>';
      toggle.addEventListener('click', () => {
        const expanded = item.classList.toggle('submenu-open');
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.setAttribute('aria-label', `${expanded ? 'Hide' : 'Show'} ${label} submenu`);
      });
      item.appendChild(toggle);
    });
    document.addEventListener('click', e => {
      if (!ham.contains(e.target) && !nav.contains(e.target)) {
        setMenuOpen(false);
      }
    });
  }

  /* Skip link and form labels */
  const mainTarget = document.querySelector('main') || document.querySelector('#hero') || document.querySelector('.page-hero');
  if (mainTarget) {
    mainTarget.id ||= 'main-content';
    if (!mainTarget.matches('main, [tabindex]')) mainTarget.setAttribute('tabindex', '-1');
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = `#${mainTarget.id}`;
    skipLink.textContent = 'Skip to main content';
    document.body.prepend(skipLink);
  }

  document.querySelectorAll('.form-group label').forEach((label, index) => {
    const field = label.closest('.form-group')?.querySelector('input, select, textarea');
    if (!field || label.htmlFor) return;
    if (!field.id) field.id = `mrdi-field-${index + 1}`;
    label.htmlFor = field.id;
  });

  /* â”€â”€ Active nav link â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const path = window.location.pathname.split('/').filter(Boolean).pop() || 'index';
  document.querySelectorAll('.nav-item > a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.includes(path) || (path === 'index' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* â”€â”€ Scroll reveal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* Let the project gallery reveal each tile as it enters the viewport. */
  const projectTiles = document.querySelectorAll('#projects .proj-card');
  if ('IntersectionObserver' in window && projectTiles.length) {
    const projectObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('project-tile-visible');
          projectObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    projectTiles.forEach((tile, index) => {
      tile.classList.add('project-tile-reveal');
      tile.style.setProperty('--tile-delay', `${Math.min(index % 2, 1) * 100}ms`);
      projectObs.observe(tile);
    });
  } else {
    projectTiles.forEach(tile => tile.classList.add('project-tile-visible'));
  }

  /* â”€â”€ Header frost on scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.style.background = window.scrollY > 40
      ? '#ffffff' : '#ffffff';
  }, { passive: true });

  /* â”€â”€ Smooth anchor scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* â”€â”€ Enquiry form submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* â”€â”€ Contact form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* Review entries are shown immediately in this visit; no external service is configured. */
  const reviewForm = document.getElementById('review-form');
  const reviewList = document.getElementById('review-list');
  if (reviewForm && reviewList) {
    const reviewViewport = reviewList.closest('.review-viewport');
    const previousReviews = document.querySelector('.review-prev');
    const nextReviews = document.querySelector('.review-next');
    const syncReviewControls = () => {
      if (!reviewViewport) return;
      if (previousReviews) previousReviews.disabled = reviewViewport.scrollLeft <= 1;
      if (nextReviews) nextReviews.disabled = reviewViewport.scrollLeft + reviewViewport.clientWidth >= reviewViewport.scrollWidth - 1;
    };
    const slideReviews = direction => {
      if (!reviewViewport) return;
      const firstCard = reviewList.querySelector('.review-entry');
      const gap = parseFloat(getComputedStyle(reviewList).columnGap) || 14;
      const distance = (firstCard?.getBoundingClientRect().width || reviewViewport.clientWidth) + gap;
      reviewViewport.scrollBy({ left: direction * distance, behavior: 'smooth' });
    };
    previousReviews?.addEventListener('click', () => slideReviews(-1));
    nextReviews?.addEventListener('click', () => slideReviews(1));
    reviewViewport?.addEventListener('scroll', syncReviewControls, { passive: true });
    window.addEventListener('resize', syncReviewControls);
    syncReviewControls();
    reviewForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!reviewForm.reportValidity()) return;
      const formData = new FormData(reviewForm);
      const card = document.createElement('article');
      card.className = 'review-entry';
      const heading = document.createElement('h4');
      heading.textContent = String(formData.get('reviewName') || '').trim() || 'MRDI learner';
      const stars = document.createElement('div');
      stars.className = 'review-stars';
      stars.setAttribute('aria-label', `${formData.get('rating')} out of 5 stars`);
      stars.textContent = `${'★'.repeat(Number(formData.get('rating')))}${'☆'.repeat(5 - Number(formData.get('rating')))}`;
      card.append(heading, stars);
      reviewList.prepend(card);
      if (reviewViewport) reviewViewport.scrollTo({ left: 0, behavior: 'smooth' });
      reviewForm.reset();
      reviewForm.querySelector('.review-note').textContent = 'Thank you for sharing your review. Your rating is shown above.';
    });
  }

  /* â”€â”€ Subscribe â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
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

  /* Convert linked visual cards to a single, consistent center action button. */
  document.querySelectorAll('a.social-card, a.blog-feature-card, a.ebook-card').forEach(link => {
    const card = document.createElement('div');
    Array.from(link.attributes).forEach(attribute => {
      if (attribute.name !== 'href' && attribute.name !== 'target' && attribute.name !== 'rel') {
        card.setAttribute(attribute.name, attribute.value);
      }
    });
    card.setAttribute('data-href', link.getAttribute('href'));
    if (link.getAttribute('target') === '_blank') card.setAttribute('data-target', '_blank');
    card.innerHTML = link.innerHTML;
    link.replaceWith(card);
    revealObs.observe(card);
  });

  document.querySelectorAll('[data-href]').forEach(tile => {
    const href = tile.getAttribute('data-href');
    if (!href || tile.querySelector(':scope > .tile-action')) return;

    const title = tile.querySelector('h1,h2,h3,h4,strong,[aria-label]')?.textContent?.trim()
      || tile.querySelector('img[alt]')?.alt
      || 'tile';
    tile.classList.add('has-tile-action');
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'tile-action';
    action.setAttribute('aria-label', `Open ${title}`);
    action.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 18 18 6M7 6h11v11"/></svg>';
    action.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      if (tile.getAttribute('data-target') === '_blank') window.open(href, '_blank', 'noopener');
      else window.location.href = href;
    });
    tile.appendChild(action);
  });
  /* WA float inject */
  if (!document.querySelector('.wa-float')) {
    const wa = document.createElement('a');
    wa.href = WA_URL; wa.target = '_blank';
    wa.className = 'wa-float'; wa.title = 'Chat on WhatsApp'; wa.setAttribute('aria-label', 'Chat with MRDI on WhatsApp');
    wa.innerHTML = '<svg aria-hidden="true" viewBox="0 0 32 32" focusable="false"><path d="M16 3.2A12.4 12.4 0 0 0 5.4 22l-1.6 6 6.1-1.6A12.4 12.4 0 1 0 16 3.2Zm0 22.5c-1.9 0-3.7-.5-5.3-1.5l-.4-.2-3.6.9 1-3.5-.3-.4A10.1 10.1 0 1 1 16 25.7Zm5.6-7.6c-.3-.2-1.8-.9-2.1-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.3 8.3 0 0 1-2.5-1.5 9.3 9.3 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6.3-.5c.1-.2 0-.4 0-.6l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.2 1.4 3.5 2.4 3.7 5.8 5.1c.8.3 1.4.5 1.9.6.8.2 1.5.2 2.1.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.1-1.4s-.3-.3-.6-.4Z"/></svg>';
    document.body.appendChild(wa);
  }

})();
