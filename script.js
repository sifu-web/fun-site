/* =========================================================
   SiFUU — script.js
   Handles: loading screen, page navigation, click sounds,
   ripple effect, particle background, funny quiz logic,
   trap-button dodge, warning popup, confetti finale.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Tiny click-sound synth (no external files) ---------- */
  let audioCtx = null;
  function playClick(freq = 620, duration = 0.09) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) { /* audio not available, fail silently */ }
  }

  /* ---------- Ripple + sound on every button ---------- */
  function attachButtonFX(btn) {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 620);
      playClick();
    });
  }
  document.querySelectorAll('.btn').forEach(attachButtonFX);

  /* ---------- Loading screen ---------- */
  const loadingScreen = document.getElementById('loading-screen');
  const app = document.getElementById('app');
  setTimeout(() => {
    app.hidden = false;
    setTimeout(() => loadingScreen.remove(), 650);
  }, 3000);

  /* ---------- Page navigation ---------- */
  const pages = ['page-1', 'page-2', 'page-3', 'page-final'];
  function goToPage(id) {
    const current = document.querySelector('.page.active');
    const next = document.getElementById(id);
    if (!next || next === current) return;
    if (current) {
      current.classList.add('leaving');
      current.classList.remove('active');
      setTimeout(() => current.classList.remove('leaving'), 600);
    }
    next.classList.add('active');
    if (id === 'page-final') launchConfetti();
  }

  /* ---------- PAGE 1: Verification ---------- */
  const verifyBtn = document.getElementById('verify-btn');
  const verifyResult = document.getElementById('verify-result');
  verifyBtn.addEventListener('click', () => {
    verifyBtn.disabled = true;
    verifyBtn.style.opacity = '0.6';
    verifyResult.hidden = false;
    setTimeout(() => goToPage('page-2'), 2000);
  });

  /* ---------- PAGE 2: Funny question (always "No") ---------- */
  const q2Buttons = document.querySelectorAll('#page-2 .btn-option');
  const q2Result = document.getElementById('q2-result');
  q2Buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      q2Buttons.forEach((b) => (b.disabled = true));
      q2Result.hidden = false;
      setTimeout(() => goToPage('page-3'), 1800);
    });
  });

  /* ---------- PAGE 3: Trap question ---------- */
  const trapRow = document.getElementById('trap-row');
  const trapA = document.getElementById('trap-btn-a');
  const trapB = document.getElementById('trap-btn-b');
  const warningPopup = document.getElementById('warning-popup');
  let dodgeCount = 0;
  const maxDodges = 3;

  function dodgeAway(btn, otherBtn) {
    const rowRect = trapRow.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const maxX = Math.max(0, rowRect.width - btnRect.width - 8);
    const randomX = Math.random() * maxX;
    const randomY = (Math.random() - 0.5) * 20;
    btn.style.position = 'absolute';
    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
  }

  function armDodge(btn, otherBtn) {
    btn.addEventListener('pointerenter', () => {
      if (dodgeCount >= maxDodges) return;
      dodgeCount++;
      dodgeAway(btn, otherBtn);
    });
  }
  armDodge(trapA, trapB);
  armDodge(trapB, trapA);

  function triggerInsult(clickedBtn) {
    [trapA, trapB].forEach((b) => (b.disabled = true));
    clickedBtn.classList.add('insulted');
    clickedBtn.textContent = 'Kuttar Baccha';
    warningPopup.hidden = false;
    setTimeout(() => {
      warningPopup.hidden = true;
      goToPage('page-final');
    }, 2000);
  }

  trapA.addEventListener('click', () => triggerInsult(trapA));
  trapB.addEventListener('click', () => triggerInsult(trapB));

  /* ---------- FINAL PAGE: money button just gives a little pulse ---------- */
  const moneyBtn = document.getElementById('money-btn');
  moneyBtn.addEventListener('click', () => {
    moneyBtn.style.transform = 'scale(0.94)';
    setTimeout(() => (moneyBtn.style.transform = ''), 180);
  });

  /* =========================================================
     Particle background (ambient, full-page canvas)
     ========================================================= */
  const pCanvas = document.getElementById('particles');
  const pCtx = pCanvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resizeParticleCanvas() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
  }
  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * pCanvas.width,
      y: Math.random() * pCanvas.height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.5 + 0.15,
    }));
  }
  function drawParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = pCanvas.width;
      if (p.x > pCanvas.width) p.x = 0;
      if (p.y < 0) p.y = pCanvas.height;
      if (p.y > pCanvas.height) p.y = 0;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(127, 208, 255, ${p.alpha})`;
      pCtx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  resizeParticleCanvas();
  initParticles();
  drawParticles();
  window.addEventListener('resize', () => {
    resizeParticleCanvas();
    initParticles();
  });

  /* =========================================================
     Confetti burst for the final page
     ========================================================= */
  const cCanvas = document.getElementById('confetti-canvas');
  const cCtx = cCanvas.getContext('2d');
  let confettiPieces = [];
  let confettiRunning = false;
  const CONFETTI_COLORS = ['#3ea6ff', '#7fd0ff', '#ffd166', '#ff9d3d', '#4ade80', '#ffffff'];

  function resizeConfettiCanvas() {
    const rect = cCanvas.parentElement.getBoundingClientRect();
    cCanvas.width = window.innerWidth;
    cCanvas.height = window.innerHeight;
  }

  function launchConfetti() {
    resizeConfettiCanvas();
    confettiPieces = Array.from({ length: 140 }, () => ({
      x: Math.random() * cCanvas.width,
      y: -20 - Math.random() * cCanvas.height * 0.5,
      w: Math.random() * 7 + 4,
      h: Math.random() * 12 + 6,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      vy: Math.random() * 2.5 + 2,
      vx: (Math.random() - 0.5) * 2,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 8,
    }));
    if (!confettiRunning) {
      confettiRunning = true;
      animateConfetti();
    }
    setTimeout(() => (confettiRunning = false), 5200);
  }

  function animateConfetti() {
    cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
    let stillFalling = false;
    confettiPieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y < cCanvas.height + 20) stillFalling = true;
      cCtx.save();
      cCtx.translate(p.x, p.y);
      cCtx.rotate((p.rot * Math.PI) / 180);
      cCtx.fillStyle = p.color;
      cCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cCtx.restore();
    });
    if (confettiRunning || stillFalling) {
      requestAnimationFrame(animateConfetti);
    } else {
      cCtx.clearRect(0, 0, cCanvas.width, cCanvas.height);
    }
  }

  window.addEventListener('resize', () => {
    if (document.getElementById('page-final').classList.contains('active')) {
      resizeConfettiCanvas();
    }
  });

});
