/* ═══════════════════════════════════════════════════════════
   JAYASURYA PORTFOLIO — script.js
   GSAP | Custom Cursor | Canvas Mesh | Tilt | ScrollTrigger
═══════════════════════════════════════════════════════════ */

/* ─── Wait for GSAP ───────────────────────────────────── */
(function waitGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return setTimeout(waitGSAP, 40);
  }
  gsap.registerPlugin(ScrollTrigger);
  bootstrap();
})();

/* ═══════════════════════════════════════════════════════════
   BOOTSTRAP
═══════════════════════════════════════════════════════════ */
function bootstrap() {
  initLoader();
  initCursor();
  initCanvas();
  initNav();
  initSmoothScroll();
  initMagnetic();
  initHeroParallax();
  initScrollReveal();
  initLineReveal();
  initTilt();
  initSkillBars();
  initCounters();
  initWorkCards();
  initContactForm();
  initAmbient();
}

/* ═══════════════════════════════════════════════════════════
   1. LOADER
═══════════════════════════════════════════════════════════ */
function initLoader() {
  const loaderEl = document.getElementById('loader');
  const fillEl   = document.getElementById('loader-fill');
  const pctEl    = document.getElementById('loader-pct');
  if (!loaderEl) return;

  let current = 0;
  const target = 100;
  const inc = () => {
    current += Math.random() * 14 + 3;
    if (current >= target) {
      current = 100;
      fillEl.style.width = '100%';
      pctEl.textContent = '100';
      clearInterval(iv);
      // Small pause then fade out
      setTimeout(() => {
        loaderEl.classList.add('out');
        // Trigger hero entrance after loader gone
        setTimeout(heroEntrance, 300);
      }, 400);
      return;
    }
    fillEl.style.width = Math.min(current, 100) + '%';
    pctEl.textContent = Math.floor(Math.min(current, 100));
  };
  const iv = setInterval(inc, 80);
}

/* ═══════════════════════════════════════════════════════════
   2. HERO ENTRANCE
═══════════════════════════════════════════════════════════ */
function heroEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // Nav
  tl.from('#site-header', { y: -24, opacity: 0, duration: .8 }, 0);

  // Index tag
  tl.from('#hi-index', { opacity: 0, x: -20, duration: .6 }, .15);

  // Words fly up from clip
  tl.to('#hw1', { y: '0%', duration: 1.1, ease: 'expo.out' }, .2);
  tl.to('#hw2', { y: '0%', duration: 1.1, ease: 'expo.out' }, .38);

  // Descriptor lines
  tl.to('#dl1', { opacity: 1, x: 0, duration: .5 }, .55);
  tl.to('#dl2', { opacity: 1, x: 0, duration: .5 }, .68);
  tl.to('#dl3', { opacity: 1, x: 0, duration: .5 }, .81);

  // Bottom bar
  tl.to('#hero-bottom', { opacity: 1, y: 0, duration: .7 }, .9);

  // Corner markers
  tl.from('.corner', { opacity: 0, scale: .5, stagger: .08, duration: .5 }, .6);
}

/* ═══════════════════════════════════════════════════════════
   3. CANVAS — MESH WAVE
═══════════════════════════════════════════════════════════ */
function initCanvas() {
  const canvas = document.getElementById('mesh-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes = [], tick = 0;
  const COLS = 14, ROWS = 8, SPEED = 0.008;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildGrid();
  }

  function buildGrid() {
    nodes = [];
    for (let r = 0; r <= ROWS; r++) {
      for (let c = 0; c <= COLS; c++) {
        nodes.push({
          bx: (c / COLS) * W,
          by: (r / ROWS) * H,
          phase: Math.random() * Math.PI * 2,
          amp:   Math.random() * 18 + 6,
        });
      }
    }
  }

  function getPos(n) {
    return {
      x: n.bx,
      y: n.by + Math.sin(tick * SPEED * 60 + n.phase) * n.amp
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    tick++;

    // Draw mesh lines
    const gw = COLS + 1;

    // Horizontal
    for (let r = 0; r <= ROWS; r++) {
      ctx.beginPath();
      for (let c = 0; c <= COLS; c++) {
        const n = nodes[r * gw + c];
        const p = getPos(n);
        if (c === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      const alpha = 0.04 - (r / ROWS) * 0.03;
      ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
      ctx.lineWidth = .5;
      ctx.stroke();
    }

    // Vertical
    for (let c = 0; c <= COLS; c++) {
      ctx.beginPath();
      for (let r = 0; r <= ROWS; r++) {
        const n = nodes[r * gw + c];
        const p = getPos(n);
        if (r === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      const alpha = 0.025;
      ctx.strokeStyle = `rgba(200,169,110,${alpha})`;
      ctx.lineWidth = .4;
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

/* ═══════════════════════════════════════════════════════════
   4. CUSTOM CURSOR
═══════════════════════════════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    // Dot: near-instant
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    // Ring: lerp for trail
    rx += (mx - rx) * .1;
    ry += (my - ry) * .1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    requestAnimationFrame(loop);
  })();

  // Hover states
  document.querySelectorAll('a, button, .mag-btn, .sk-card, .wk-card, .pill, .ft-soc').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
  });
}

/* ═══════════════════════════════════════════════════════════
   5. NAV — scrolled class
═══════════════════════════════════════════════════════════ */
function initNav() {
  const hdr = document.getElementById('site-header');
  if (!hdr) return;
  ScrollTrigger.create({
    start: 'top -50',
    onUpdate: self => {
      hdr.classList.toggle('scrolled', self.scroll() > 50);
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   6. SMOOTH SCROLL
═══════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   7. MAGNETIC BUTTONS
═══════════════════════════════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll('.mag-btn').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const max  = Math.max(r.width, r.height) * .8;
      const f = Math.max(0, 1 - dist / max);
      gsap.to(el, { x: dx * f * .3, y: dy * f * .3, duration: .35, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1,.4)' });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   8. HERO PARALLAX on mouse
═══════════════════════════════════════════════════════════ */
function initHeroParallax() {
  const layer = document.getElementById('hero-layer');
  const orbs  = document.querySelectorAll('.orb');
  if (!layer) return;

  window.addEventListener('mousemove', e => {
    const xn = (e.clientX / window.innerWidth  - .5);
    const yn = (e.clientY / window.innerHeight - .5);

    gsap.to(layer, { x: xn * 18, y: yn * 10, duration: 1.3, ease: 'power2.out' });
    orbs.forEach((o, i) => {
      const f = (i + 1) * 22;
      gsap.to(o, { x: xn * f, y: yn * f, duration: 1.6 + i * .3, ease: 'power2.out' });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   9. SCROLL REVEAL (generic .js-reveal elements)
═══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  gsap.utils.toArray('.js-reveal').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 38 },
      {
        opacity: 1, y: 0,
        duration: .9, ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

/* ═══════════════════════════════════════════════════════════
   10. LINE REVEAL for headings (.js-line-reveal)
═══════════════════════════════════════════════════════════ */
function initLineReveal() {
  document.querySelectorAll('.js-line-reveal').forEach(el => {
    // Split by <br> or line
    const html  = el.innerHTML;
    const parts = html.split(/<br\s*\/?>/gi);

    el.innerHTML = parts.map(p =>
      `<span class="lr-wrap"><span class="lr-line">${p.trim()}</span></span>`
    ).join('');

    gsap.fromTo(
      el.querySelectorAll('.lr-line'),
      { y: '115%' },
      {
        y: '0%', duration: 1, stagger: .1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      }
    );
  });
}

/* ═══════════════════════════════════════════════════════════
   11. TILT CARD (about portrait)
═══════════════════════════════════════════════════════════ */
function initTilt() {
  const frame = document.getElementById('tilt-frame');
  if (!frame) return;

  frame.addEventListener('mousemove', e => {
    const r  = frame.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - .5;
    const y  = (e.clientY - r.top)  / r.height - .5;
    gsap.to(frame, {
      rotationY: x * 16, rotationX: -y * 16,
      transformPerspective: 800,
      duration: .4, ease: 'power2.out'
    });
  });
  frame.addEventListener('mouseleave', () => {
    gsap.to(frame, {
      rotationY: 0, rotationX: 0,
      duration: .7, ease: 'elastic.out(1,.5)'
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   12. SKILL BARS
═══════════════════════════════════════════════════════════ */
function initSkillBars() {
  document.querySelectorAll('.sk-bar').forEach(bar => {
    const w = bar.dataset.w;
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 92%',
      onEnter: () => {
        gsap.to(bar, { width: w + '%', duration: 1.4, ease: 'power3.out' });
      }
    });
  });

  // Stagger skill cards
  gsap.utils.toArray('.sk-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 46, scale: .97 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: .75, ease: 'power3.out',
        delay: i * .08,
        scrollTrigger: { trigger: card, start: 'top 90%' }
      }
    );
  });
}

/* ═══════════════════════════════════════════════════════════
   13. STAT COUNTERS
═══════════════════════════════════════════════════════════ */
function initCounters() {
  document.querySelectorAll('.m-val[data-target]').forEach(el => {
    const target = +el.dataset.target;
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 90%',
      onEnter: () => {
        gsap.to(obj, {
          val: target, duration: 1.6, ease: 'power3.out',
          onUpdate() { el.textContent = Math.round(obj.val); }
        });
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   14. WORK CARDS — stagger + accent glow
═══════════════════════════════════════════════════════════ */
function initWorkCards() {
  gsap.utils.toArray('.wk-card').forEach((card, i) => {
    const accent = card.dataset.accent || '#00d4ff';

    // Staggered entrance
    gsap.fromTo(card,
      { opacity: 0, y: 60 },
      {
        opacity: 1, y: 0, duration: .85,
        ease: 'power3.out', delay: i * .13,
        scrollTrigger: { trigger: card, start: 'top 88%' }
      }
    );

    // Hover border glow using accent color
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        boxShadow: `0 30px 70px rgba(0,0,0,.6), 0 0 50px ${accent}20`,
        duration: .4
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { boxShadow: 'none', duration: .4 });
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   15. CONTACT FORM
═══════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('c-form');
  const btn  = document.getElementById('cf-submit');
  if (!form || !btn) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const textEl = btn.querySelector('.cfs-text');
    btn.disabled = true;
    textEl.textContent = 'Sending...';
    gsap.to(btn, { opacity: .7, duration: .2 });

    setTimeout(() => {
      textEl.textContent = 'Message Sent ✓';
      btn.style.background = 'linear-gradient(135deg,#00ff9d,#00c87a)';
      btn.style.boxShadow = '0 0 30px rgba(0,255,157,.4)';
      gsap.to(btn, { opacity: 1, duration: .3 });
      form.reset();

      setTimeout(() => {
        textEl.textContent = 'Send Message';
        btn.style.background = '';
        btn.style.boxShadow = '';
        btn.disabled = false;
      }, 3000);
    }, 1800);
  });
}

/* ═══════════════════════════════════════════════════════════
   16. AMBIENT — continuous subtle motions
═══════════════════════════════════════════════════════════ */
function initAmbient() {
  // Float badge
  gsap.to('.about-float-card', {
    y: -10, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1
  });

  // Label lines gently shift
  gsap.to('.s-label', {
    x: 4, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 1
  });

  // Section parallax (slow scroll)
  gsap.utils.toArray('.s-section').forEach(sec => {
    const lbl = sec.querySelector('.s-label');
    if (!lbl) return;
    gsap.fromTo(lbl,
      { y: 0 },
      {
        y: -30, ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top bottom', end: 'bottom top',
          scrub: 1
        }
      }
    );
  });

  // Orbs scroll parallax
  gsap.to('.orb-a', {
    yPercent: -20, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });
  gsap.to('.orb-b', {
    yPercent: 25, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 }
  });

  // Window resize
  window.addEventListener('resize', () => ScrollTrigger.refresh());

  // Console easter egg
  console.log('%c JAYASURYA ', 'background:linear-gradient(135deg,#00d4ff,#c8a96e);color:#06060d;font-weight:900;font-size:16px;padding:6px 14px;border-radius:2px;');
  console.log('%c Portfolio v2025 · Dark Editorial / Cyberpunk-Luxury ', 'color:#00d4ff;font-size:11px;');
}