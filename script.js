document.addEventListener("DOMContentLoaded", () => {
  // --- PARTICLES BACKGROUND ---
  const canvas = document.getElementById("particles");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particleCount = Math.floor((width * height) / 10000);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.2
    }));

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // --- LOADING SCREEN ---
  const loadingScreen = document.getElementById("loading-screen");
  const app = document.getElementById("app");

  setTimeout(() => {
    if (loadingScreen) loadingScreen.style.display = "none";
    if (app) app.hidden = false;
  }, 2500);

  // --- PAGE SWITCHING LOGIC ---
  function goToPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
      page.classList.remove("active");
    });
    const nextPage = document.getElementById(pageId);
    if (nextPage) {
      nextPage.classList.add("active");
    }
  }

  // --- PAGE 1: VERIFICATION ---
  const verifyBtn = document.getElementById("verify-btn");
  const verifyResult = document.getElementById("verify-result");

  if (verifyBtn) {
    verifyBtn.addEventListener("click", () => {
      verifyBtn.style.display = "none";
      if (verifyResult) verifyResult.hidden = false;

      setTimeout(() => {
        goToPage("page-2");
      }, 2000);
    });
  }

  // --- PAGE 2: FUNNY QUESTION ---
  const q2Options = document.querySelectorAll("#page-2 .btn-option");
  const q2Result = document.getElementById("q2-result");

  q2Options.forEach(btn => {
    btn.addEventListener("click", () => {
      if (q2Result) q2Result.hidden = false;

      setTimeout(() => {
        goToPage("page-3");
      }, 2200);
    });
  });

  // --- PAGE 3: TRAP BUTTONS & WARNING POPUP ---
  const trapBtnA = document.getElementById("trap-btn-a");
  const trapBtnB = document.getElementById("trap-btn-b");
  const warningPopup = document.getElementById("warning-popup");

  function handleTrap() {
    if (warningPopup) warningPopup.hidden = false;

    setTimeout(() => {
      if (warningPopup) warningPopup.hidden = true;
      goToPage("page-final");
      triggerConfetti();
    }, 2500);
  }

  if (trapBtnA) trapBtnA.addEventListener("click", handleTrap);
  if (trapBtnB) trapBtnB.addEventListener("click", handleTrap);

  // --- FINAL PAGE: CONFETTI EFFECT ---
  function triggerConfetti() {
    const cCanvas = document.getElementById("confetti-canvas");
    if (!cCanvas) return;
    const cCtx = cCanvas.getContext("2d");
    let cW = (cCanvas.width = window.innerWidth);
    let cH = (cCanvas.height = window.innerHeight);

    const pieces = Array.from({ length: 100 }, () => ({
      x: Math.random() * cW,
      y: Math.random() * cH - cH,
      r: Math.random() * 6 + 4,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      dy: Math.random() * 3 + 2,
      dx: (Math.random() - 0.5) * 2
    }));

    function drawConfetti() {
      cCtx.clearRect(0, 0, cW, cH);
      pieces.forEach(p => {
        p.y += p.dy;
        p.x += p.dx;
        if (p.y > cH) p.y = -10;

        cCtx.beginPath();
        cCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cCtx.fillStyle = p.color;
        cCtx.fill();
      });
      requestAnimationFrame(drawConfetti);
    }
    drawConfetti();
  }

  // --- MONEY BUTTON CALL ACTION ---
  const moneyBtn = document.getElementById("money-btn");
  if (moneyBtn) {
    moneyBtn.addEventListener("click", () => {
      window.location.href = "tel:999";
    });
  }
});
