/* seal.js — Aetherion Seal entry experience
 * Handles: canvas animation, glyph timing, entry choreography
 * All timings derived from v01 MIDI data (canonical)
 */

(function () {
  'use strict';

  const TOTAL  = 7.0;
  const N_BARS = 220;
  const EVENTS = [
    { t: 0.00, color: '#7b9fbf', name: 'Aether'   },
    { t: 1.00, color: '#c4a535', name: 'Gold'     },
    { t: 2.15, color: '#c0a0e0', name: 'Antimony' },
    { t: 3.60, color: '#70b090', name: 'Stone'    },
    { t: 5.10, color: '#8060a0', name: 'Void'     },
    { t: 6.40, color: '#3a3a5a', name: 'Seal'     },
  ];

  const waveData = new Float32Array(N_BARS);
  for (let i = 0; i < N_BARS; i++) {
    const t = i / N_BARS * TOTAL;
    let h;
    if      (t < 0.8)  h = 0.06 + 0.20 * (t / 0.8);
    else if (t < 1.0)  h = 0.26 + 0.48 * ((t - 0.8) / 0.2);
    else if (t < 2.15) h = Math.max(0.30, Math.min(0.74, 0.58 + 0.10 * Math.sin((t - 1) * 4)));
    else if (t < 2.35) h = 0.38 + 0.50 * ((t - 2.15) / 0.20);
    else if (t < 3.60) h = Math.max(0.18, Math.min(0.70, 0.64 - 0.18 * ((t - 2.35) / 1.25)));
    else if (t < 3.80) h = 0.26 + 0.32 * ((t - 3.60) / 0.20);
    else if (t < 5.10) h = Math.max(0.20, Math.min(0.58, 0.54 - 0.14 * ((t - 3.80) / 1.30)));
    else if (t < 5.40) h = 0.38 + 0.26 * ((t - 5.10) / 0.30);
    else if (t < 6.40) h = Math.max(0.03, 0.60 - 0.57 * ((t - 5.40) / 1.00));
    else               h = 0.02;
    waveData[i] = Math.max(0.02, Math.min(0.96, h));
  }

  function getColorAt(t) {
    let c = EVENTS[0].color;
    for (const e of EVENTS) { if (t >= e.t) c = e.color; }
    return c;
  }

  const canvas = document.getElementById('seal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.3 + 0.05,
      });
    }
  }

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  let animStart = null, animFrame = null, currentT = 0;

  function drawFrame(ts) {
    if (!animStart) animStart = ts;
    currentT = Math.min((ts - animStart) / 1000, TOTAL);
    const pct = currentT / TOTAL;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,165,53,${p.alpha * (0.2 + pct * 0.4)})`;
      ctx.fill();
    }

    const barW   = Math.max(2, (canvas.width * 0.7) / N_BARS - 1);
    const startX = canvas.width * 0.15;
    const cy     = canvas.height * 0.5;
    const maxH   = canvas.height * 0.18;

    for (let i = 0; i < N_BARS; i++) {
      const x    = startX + i * (barW + 1);
      const barT = (i / N_BARS) * TOTAL;
      const h    = waveData[i] * maxH;
      const col  = getColorAt(barT);
      const alpha = barT <= currentT ? 0.85 : barT <= currentT + 0.1 ? 0.40 : 0.08;
      ctx.fillStyle = col + Math.round(alpha * 255).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(x, cy - h, barW, h * 2, 1)
        : ctx.rect(x, cy - h, barW, h * 2);
      ctx.fill();
    }

    handleTimingEvents(currentT);
    if (currentT < TOTAL) {
      animFrame = requestAnimationFrame(drawFrame);
    } else {
      onSealComplete();
    }
  }

  const nameEl   = document.getElementById('entry-name');
  const byEl     = document.getElementById('entry-by');
  const scrollEl = document.getElementById('entry-scroll');
  const replayEl = document.getElementById('replay-btn');
  let nameShown = false, byShown = false, scrollShown = false;

  function handleTimingEvents(t) {
    if (!nameShown   && t >= 1.0)  { nameEl?.classList.add('visible');   nameShown   = true; }
    if (!byShown     && t >= 2.15) { byEl?.classList.add('visible');     byShown     = true; }
    if (!scrollShown && t >= 6.40) { scrollEl?.classList.add('visible'); scrollShown = true; }
  }

  function onSealComplete() {
    replayEl?.classList.add('visible');
    setTimeout(() => {
      document.getElementById('entry')?.classList.add('exiting');
      document.getElementById('nav')?.classList.add('visible');
      setTimeout(() => { document.getElementById('entry').style.display = 'none'; }, 1000);
    }, 1800);
  }

  function startSeal() {
    if (animFrame) cancelAnimationFrame(animFrame);
    animStart = null; nameShown = false; byShown = false; scrollShown = false;
    nameEl?.classList.remove('visible');
    byEl?.classList.remove('visible');
    scrollEl?.classList.remove('visible');
    replayEl?.classList.remove('visible');
    animFrame = requestAnimationFrame(drawFrame);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('replay-btn')?.addEventListener('click', startSeal);
    setTimeout(startSeal, 200);
  });

  window.SealAnimation = { start: startSeal, getCurrentT: () => currentT };
})();