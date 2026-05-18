/* main.js — Black Crown platform
 * Handles: audio player, seal sequence sync, scroll reveals, nav state
 */

(function () {
  'use strict';

  const EVENTS = [
    { t: 0.00, sel: '[data-t="0"]',    color: '#7b9fbf' },
    { t: 1.00, sel: '[data-t="1"]',    color: '#c4a535' },
    { t: 2.15, sel: '[data-t="2.15"]', color: '#c0a0e0' },
    { t: 3.60, sel: '[data-t="3.6"]',  color: '#70b090' },
    { t: 5.10, sel: '[data-t="5.1"]',  color: '#8060a0' },
    { t: 6.40, sel: '[data-t="6.4"]',  color: '#3a3a5a' },
  ];

  const TOTAL   = 7.0;
  const N_WBARS = 180;

  const waveData = new Float32Array(N_WBARS);
  for (let i = 0; i < N_WBARS; i++) {
    const t = i / N_WBARS * TOTAL;
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
    const cols = ['#7b9fbf','#c4a535','#c0a0e0','#70b090','#8060a0','#3a3a5a'];
    const ts   = [0, 1, 2.15, 3.60, 5.10, 6.40];
    let c = cols[0];
    for (let i = 0; i < ts.length; i++) { if (t >= ts[i]) c = cols[i]; }
    return c;
  }

  function buildWaveform() {
    const wf = document.getElementById('waveform');
    if (!wf) return;
    wf.innerHTML = '';
    for (let i = 0; i < N_WBARS; i++) {
      const bar = document.createElement('div');
      bar.className = 'wbar';
      bar.style.height = (waveData[i] * 100) + '%';
      wf.appendChild(bar);
    }
  }

  function buildEventDots() {
    const pe = document.getElementById('player-events');
    if (!pe) return;
    pe.innerHTML = '';
    const labels    = ['A3','C4','F#4','D4','G#2','——'];
    const positions = [0, 14.3, 30.7, 51.4, 72.9, 91.4];
    const colors    = ['#7b9fbf','#c4a535','#c0a0e0','#70b090','#8060a0','#3a3a5a'];
    pe.style.cssText = 'position:relative;height:24px';
    labels.forEach((lbl, i) => {
      const d = document.createElement('div');
      d.className = 'player-event-dot';
      d.id = 'ped-' + i;
      d.style.cssText = `position:absolute;left:${positions[i]}%`;
      d.innerHTML = `<div class="ped-dot" style="background:${colors[i]}"></div><div class="ped-note" style="color:${colors[i]}">${lbl}</div>`;
      pe.appendChild(d);
    });
  }

  function updateWaveform(pct, currentT) {
    document.querySelectorAll('.wbar').forEach((bar, i) => {
      const barT = (i / N_WBARS) * TOTAL;
      if (barT <= currentT) {
        bar.classList.add('active');
        bar.classList.remove('past');
        bar.style.background = getColorAt(barT);
      } else {
        bar.classList.remove('active');
        bar.classList.add('past');
        bar.style.background = '';
      }
    });
  }

  function updateEventDots(currentT) {
    const ts = [0, 1, 2.15, 3.60, 5.10, 6.40];
    ts.forEach((t, i) => {
      const dot = document.getElementById('ped-' + i);
      if (!dot) return;
      dot.classList.toggle('active', currentT >= t && currentT < (ts[i+1] ?? TOTAL+1));
    });
  }

  function updateSeqItems(currentT) {
    EVENTS.forEach((e, i) => {
      const el = document.querySelector(e.sel);
      if (!el) return;
      const nextT = EVENTS[i+1]?.t ?? (TOTAL+1);
      el.classList.remove('active','done');
      if (currentT >= e.t && currentT < nextT) el.classList.add('active');
      else if (currentT >= nextT) el.classList.add('done');
    });
  }

  function initPlayer() {
    const audio     = document.getElementById('seal-audio');
    const playBtn   = document.getElementById('play-btn');
    const playIcon  = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const fill      = document.getElementById('progress-fill');
    const timeEl    = document.getElementById('player-time');
    const wfEl      = document.getElementById('waveform');
    if (!audio || !playBtn) return;

    const setPlaying = (on) => {
      if (playIcon)  playIcon.style.display  = on ? 'none' : '';
      if (pauseIcon) pauseIcon.style.display = on ? ''     : 'none';
    };

    playBtn.addEventListener('click', () => {
      if (audio.paused) audio.play().catch(runVisualOnly);
      else audio.pause();
    });

    audio.addEventListener('play',  () => setPlaying(true));
    audio.addEventListener('pause', () => setPlaying(false));
    audio.addEventListener('ended', () => setPlaying(false));
    audio.addEventListener('timeupdate', () => {
      const t = audio.currentTime;
      if (fill)   fill.style.width = (t / TOTAL * 100) + '%';
      if (timeEl) timeEl.textContent = t.toFixed(1);
      updateWaveform(t / TOTAL, t);
      updateEventDots(t);
      updateSeqItems(t);
    });

    wfEl?.addEventListener('click', (e) => {
      const rect = wfEl.getBoundingClientRect();
      audio.currentTime = ((e.clientX - rect.left) / rect.width) * TOTAL;
    });

    let voStart = null, voFrame = null;
    function runVisualOnly() {
      setPlaying(true);
      voStart = performance.now();
      (function step(ts) {
        const t = Math.min((ts - voStart) / 1000, TOTAL);
        if (fill)   fill.style.width = (t / TOTAL * 100) + '%';
        if (timeEl) timeEl.textContent = t.toFixed(1);
        updateWaveform(t / TOTAL, t);
        updateEventDots(t);
        updateSeqItems(t);
        if (t < TOTAL) voFrame = requestAnimationFrame(step);
        else setPlaying(false);
      })(voStart);
    }
  }

  function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.section-heading,.section-sub,.glyph-card,.access-card,.about-text p,.brand-row > div,.seal-player,.seal-sequence,.pull-quote,.caption'
    );
    targets.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = ((i % 5) * 0.08) + 's';
    });
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    targets.forEach(el => obs.observe(el));
  }

  function initNavHighlight() {
    const links = document.querySelectorAll('.nav-link');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => { l.style.color = l.getAttribute('href') === '#' + e.target.id ? 'var(--gold)' : ''; });
        }
      }),
      { threshold: 0.4 }
    );
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildWaveform();
    buildEventDots();
    initPlayer();
    initScrollReveal();
    initNavHighlight();
  });
})();