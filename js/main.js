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

  function closeMenu() {
    links.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('click', e => {
    if (links.classList.contains('open') &&
        !links.contains(e.target) &&
        !btn.contains(e.target)) {
      closeMenu();
    }
  });
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
  const sections = ['services','portfolio','templates','pricing','quote','stack','coming-soon','contact'];
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


/* ── Diagnóstico Gratuito form → WhatsApp ── */
(function initDiagForm() {
  const form = document.getElementById('diagForm');
  if (!form) return;

  const bizLabel = {
    loja: 'Loja física / e-commerce',
    servicos: 'Prestação de serviços',
    saude: 'Clínica / saúde',
    alimentacao: 'Restaurante / alimentação',
    imoveis: 'Imóveis',
    outro: 'Outro'
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('[name="dname"]').value.trim();
    const site = form.querySelector('[name="dsite"]').value.trim();
    const biz  = form.querySelector('[name="dbiz"]').value;

    const text = [
      `Olá! Vi a oferta de diagnóstico gratuito no portfólio SK Services 🎁`,
      ``,
      `*Nome:* ${name}`,
      site ? `*Site/Instagram:* ${site}` : `*Site/Instagram:* ainda não tenho`,
      biz ? `*Tipo de negócio:* ${bizLabel[biz] || biz}` : ''
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


/* ── Loader ── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const hide = () => loader.classList.add('done');
  if (document.readyState === 'complete') setTimeout(hide, 1400);
  else window.addEventListener('load', () => setTimeout(hide, 1400));
})();


/* ── Theme toggle (dark/light) ── */
(function initTheme() {
  const btn  = document.getElementById('themeToggle');
  if (!btn) return;
  if (localStorage.getItem('sk-theme') === 'light') document.body.classList.add('light');
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    localStorage.setItem('sk-theme', document.body.classList.contains('light') ? 'light' : 'dark');
  });
})();


/* ── FAQ accordion ── */
(function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.faq-answer').style.height = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.height = answer.scrollHeight + 'px';
      }
    });
  });
})();


/* ── EmailJS integration ──
   Para ativar:
   1. Crie conta em emailjs.com
   2. Conecte seu Gmail como serviço de email
   3. Crie um template com as variáveis: from_name, from_email, service, message
   4. Substitua os três valores abaixo pelos seus IDs reais
*/
(function initEmailJS() {
  const KEY      = 'SUA_PUBLIC_KEY';
  const SERVICE  = 'SUA_SERVICE_ID';
  const TEMPLATE = 'SEU_TEMPLATE_ID';
  if (KEY === 'SUA_PUBLIC_KEY' || typeof emailjs === 'undefined') return;
  emailjs.init(KEY);
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', () => {
    emailjs.send(SERVICE, TEMPLATE, {
      from_name:  form.querySelector('[name="name"]').value,
      from_email: form.querySelector('[name="email"]').value,
      service:    form.querySelector('[name="service"]').value,
      message:    form.querySelector('[name="message"]').value
    }).catch(console.error);
  });
})();


/* ── Custom cursor ── */
(function initCursor() {
  if ('ontouchstart' in window) return;
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  document.body.classList.add('cursor-active');
  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .service-card, .project-card, .quote-type, .quote-feat').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
})();


/* ── Back to top ── */
(function initBackToTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ── LGPD cookie banner ── */
(function initLGPD() {
  const bar = document.getElementById('lgpdBar');
  const ok  = document.getElementById('lgpdOk');
  const no  = document.getElementById('lgpdNo');
  if (!bar) return;
  if (localStorage.getItem('sk-lgpd')) return;
  setTimeout(() => bar.classList.add('show'), 2000);
  function dismiss() {
    bar.classList.remove('show');
    localStorage.setItem('sk-lgpd', '1');
  }
  ok && ok.addEventListener('click', dismiss);
  no && no.addEventListener('click', dismiss);
})();


/* ── Form real-time validation ── */
(function initValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  function validate(input) {
    const grp = input.closest('.form-group');
    const err = grp && grp.querySelector('.field-error');
    if (!grp) return true;
    grp.classList.remove('f-error', 'f-ok');
    if (err) err.textContent = '';
    if (input.required && !input.value.trim()) {
      grp.classList.add('f-error');
      if (err) err.textContent = 'Campo obrigatório.';
      return false;
    }
    if (input.type === 'email' && input.value.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        grp.classList.add('f-error');
        if (err) err.textContent = 'Informe um e-mail válido.';
        return false;
      }
    }
    if (input.value.trim()) grp.classList.add('f-ok');
    return true;
  }

  form.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('blur', () => validate(inp));
    inp.addEventListener('input', () => {
      if (inp.closest('.form-group').classList.contains('f-error')) validate(inp);
    });
  });
})();


/* ── 3D tilt on service cards ── */
(function initTilt() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();


/* ── Portfolio modal ── */
(function initPortfolioModal() {
  const overlay  = document.getElementById('pmOverlay');
  const bodyEl   = document.getElementById('pmBody');
  const closeBtn = document.getElementById('pmClose');
  if (!overlay) return;

  const PROJECTS = {
    clinic: {
      title: 'Clínica Escola FUMEC', badge: 'Healthcare', badgeClass: 'healthcare',
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      live: 'https://asilk3037-source.github.io/trabalho_fumec_clinica',
      code: 'https://github.com/asilk3037-source/trabalho_fumec_clinica',
      desc: 'Site institucional para a Clínica Escola FUMEC com foco em acessibilidade e clareza de informação. Apresenta serviços médicos, equipe, horários de atendimento e canal de contato. Projeto otimizado para SEO e carregamento rápido.',
      highlights: ['Design clean e acessível', 'Seção de especialidades médicas', 'Formulário de contato integrado', 'SEO técnico otimizado'],
      previewClass: 'clinic-preview', heroBg: 'clinic-bg'
    },
    realestate: {
      title: 'Nosso Lar Imóveis', badge: 'Imóveis', badgeClass: 'realestate',
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      live: 'https://asilk3037-source.github.io/nosso-lar',
      code: 'https://github.com/asilk3037-source/nosso-lar',
      desc: 'Plataforma para imobiliária com catálogo de imóveis, galeria de fotos por propriedade e formulário de agendamento de visitas. Design profissional pensado para converter visitantes em leads qualificados.',
      highlights: ['Catálogo de imóveis dinâmico', 'Galeria de fotos por propriedade', 'Filtros de busca avançados', 'Formulário de agendamento de visitas'],
      previewClass: 'realestate-preview', heroBg: 'realestate-bg'
    },
    portfolio: {
      title: 'SK Services', badge: 'Portfólio', badgeClass: 'portfolio',
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      live: null,
      code: 'https://github.com/asilk3037-source/Sk-Services',
      desc: 'Portfólio profissional desenvolvido do zero com HTML, CSS e JavaScript puro. Canvas API com partículas interativas, dark/light mode, loader animado, calculadora de orçamento interativa e SEO técnico completo.',
      highlights: ['Canvas API com partículas interativas', 'Dark/light mode com localStorage', 'Calculadora de orçamento interativa', 'robots.txt + sitemap.xml + SEO'],
      previewClass: 'portfolio-preview', heroBg: 'dark-bg'
    }
  };

  function openModal(key) {
    const p = PROJECTS[key];
    if (!p) return;
    const liveBtn = p.live
      ? `<a href="${p.live}" target="_blank" class="btn-primary">Abrir site <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg></a>`
      : `<span class="pm-here">✓ Você está aqui</span>`;

    bodyEl.innerHTML = `
      <div class="pm-preview ${p.previewClass}">
        <div class="pm-mock-wrap">
          <div class="browser-chrome">
            <div class="browser-bar">
              <span class="browser-dot"></span><span class="browser-dot"></span><span class="browser-dot"></span>
            </div>
            <div class="browser-body ${p.previewClass}">
              <div class="mock-nav"></div>
              <div class="mock-hero ${p.heroBg}"><div class="mock-title"></div><div class="mock-sub"></div></div>
              <div class="mock-cards"><div class="mock-card"></div><div class="mock-card"></div><div class="mock-card"></div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="pm-info">
        <div class="pm-badges">
          <span class="tech-badge ${p.badgeClass}">${p.badge}</span>
          ${p.stack.map(t => `<span class="tech-badge">${t}</span>`).join('')}
        </div>
        <h2 class="pm-title">${p.title}</h2>
        <p class="pm-desc">${p.desc}</p>
        <ul class="pm-highlights">
          ${p.highlights.map(h => `<li><span class="highlight-check">✓</span> ${h}</li>`).join('')}
        </ul>
        <div class="pm-actions">
          ${liveBtn}
          <a href="${p.code}" target="_blank" class="btn-secondary">Ver código</a>
        </div>
      </div>`;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card[data-project]').forEach(card => {
    card.addEventListener('click', e => {
      if (!e.target.closest('a')) openModal(card.dataset.project);
    });
  });

  closeBtn && closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();


/* ── Quote calculator ── */
(function initQuoteCalc() {
  const totalEl   = document.getElementById('quoteTotal');
  const breakdownEl = document.getElementById('quoteBreakdown');
  const ctaEl     = document.getElementById('quoteCTA');
  if (!totalEl) return;

  let basePrice = 200, baseLabel = 'Landing Page';

  function fmt(n) { return n.toLocaleString('pt-BR'); }

  function update() {
    let extras = 0;
    const lines = [];
    document.querySelectorAll('.quote-feat input:checked').forEach(inp => {
      const add = parseInt(inp.dataset.add) || 0;
      extras += add;
      lines.push({ label: inp.dataset.label, val: add });
    });
    const total = basePrice + extras;
    totalEl.textContent = fmt(total);

    let html = `<div class="qr-line qr-base"><span>${baseLabel}</span><span>R$ ${fmt(basePrice)}</span></div>`;
    lines.forEach(l => {
      html += `<div class="qr-line"><span>${l.label}</span><span>+ R$ ${fmt(l.val)}</span></div>`;
    });
    if (extras > 0) {
      html += `<div class="qr-line qr-total-line"><span>Total estimado</span><span>R$ ${fmt(total)}</span></div>`;
    }
    breakdownEl.innerHTML = html;

    if (ctaEl) {
      const ext = lines.length ? ' + ' + lines.map(l => l.label).join(', ') : '';
      const msg = `Olá! Calculei meu orçamento pelo site: ${baseLabel}${ext} — estimativa R$ ${fmt(total)}. Gostaria de um orçamento personalizado!`;
      ctaEl.href = `https://wa.me/5531992914959?text=${encodeURIComponent(msg)}`;
    }
  }

  document.querySelectorAll('.quote-type').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quote-type').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      basePrice = parseInt(btn.dataset.base) || 200;
      baseLabel = btn.dataset.label || 'Projeto';
      update();
    });
  });

  document.querySelectorAll('.quote-feat input').forEach(inp => inp.addEventListener('change', update));
  update();
})();


/* ── Templates gallery tab filter ── */
(function initTemplates() {
  const tabs  = document.querySelectorAll('.tpl-tab');
  const cards = document.querySelectorAll('.tpl-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      cards.forEach(card => {
        card.classList.toggle('tpl-hidden', filter !== 'all' && card.dataset.cat !== filter);
      });
    });
  });
})();
