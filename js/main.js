/* =========================================================
   SK SERVICES — MAIN JS
   ========================================================= */

/* ── Particle Canvas ── */
(function initParticles() {
  const canvas = document.getElementById('canvas-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const COUNT = 90;
  const MAX_DIST = 140;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.init(); }
    init() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r  = Math.random() * 1.4 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.65 ? '#8b5cf6' : '#00d4ff';
    }
    update() {
      /* subtle mouse repulsion */
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        this.vx += (dx / d) * 0.06;
        this.vy += (dy / d) * 0.06;
      }
      /* damping */
      this.vx *= 0.98;
      this.vy *= 0.98;
      /* speed cap */
      const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (spd > 1.2) { this.vx /= spd; this.vy /= spd; }

      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0)  this.x = W;
      if (this.x > W)  this.x = 0;
      if (this.y < 0)  this.y = H;
      if (this.y > H)  this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function buildParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const alpha = (1 - d / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); buildParticles(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  resize();
  buildParticles();
  loop();
})();


/* ── Typing Effect ── */
(function initTyping() {
  const el = document.getElementById('typed');
  if (!el) return;

  const words = ['convertem', 'impressionam', 'vendem', 'se destacam'];
  let wIdx = 0, cIdx = 0, deleting = false;

  const SPEED_TYPE = 90;
  const SPEED_DEL  = 50;
  const PAUSE_FULL = 2000;
  const PAUSE_EMPTY = 400;

  function tick() {
    const word = words[wIdx];
    if (!deleting) {
      cIdx++;
      el.textContent = word.slice(0, cIdx);
      if (cIdx === word.length) {
        deleting = true;
        setTimeout(tick, PAUSE_FULL);
        return;
      }
    } else {
      cIdx--;
      el.textContent = word.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
        setTimeout(tick, PAUSE_EMPTY);
        return;
      }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(tick, 800);
})();


/* ── Navbar scroll effect ── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── Mobile menu ── */
(function initMenu() {
  const btn   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      document.body.style.overflow = '';
    })
  );
})();


/* ── Scroll reveal ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.style.getPropertyValue('--delay') || '0ms';
        setTimeout(() => entry.target.classList.add('visible'),
          parseInt(delay) || 0);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
})();


/* ── Counter animation ── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();


/* ── Active nav link on scroll ── */
(function initActiveNav() {
  const sections = ['services','portfolio','stack','contact'];
  const links = document.querySelectorAll('.nav-link');

  function onScroll() {
    let active = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 100) active = id;
    });
    links.forEach(a => {
      const href = a.getAttribute('href').replace('#', '');
      a.style.color = href === active ? 'var(--cyan)' : '';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── Contact form → WhatsApp ── */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.querySelector('[name="name"]').value.trim();
    const email   = form.querySelector('[name="email"]').value.trim();
    const service = form.querySelector('[name="service"]').value;
    const msg     = form.querySelector('[name="message"]').value.trim();

    const serviceLabel = {
      institucional: 'Site Institucional',
      landing: 'Landing Page',
      ecommerce: 'E-commerce',
      manutencao: 'Manutenção Web',
      seo: 'Otimização SEO',
      outro: 'Outro'
    }[service] || service;

    const text = [
      `Olá! Vim pelo portfólio SK Services. 👋`,
      ``,
      `*Nome:* ${name}`,
      `*Email:* ${email}`,
      service ? `*Serviço:* ${serviceLabel}` : '',
      msg ? `*Mensagem:* ${msg}` : ''
    ].filter(Boolean).join('\n');

    window.open(
      `https://wa.me/5531992914959?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  });
})();


/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
