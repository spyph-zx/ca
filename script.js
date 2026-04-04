/* ═══════════════════════════════════════════════════════════
   LOVE CONFESSION — script.js
   Flow:
     Screen 1 (Intro)  → tap
     Screen 2 (Card)   → gif1 shown first
                          • First "No" → Screen 3 (video.mp4)
                          • Subsequent "No"s → gif2–gif5, then teleport
                          • "Yes" → Screen 4 (Success)
     Screen 3 (Video1) → "Continue" → back to Screen 2 (gif2 onwards)
     Screen 4 (Success)→ gif6 + "Next" button
     Screen 5 (Video2) → video2.mp4 autoplays, no button
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── SCENES (gif only — no box/wrapper) ─────────────────── */
const SCENES = [
  { gif: 'gif1.gif', fallback: 'https://media.tenor.com/X8OKgelm2FEAAAAC/love-heart.gif',   text: 'Do you love me? 💗' },
  { gif: 'gif2.gif', fallback: 'https://media.tenor.com/gLCCsUPLzAMAAAAC/cute-love.gif',    text: 'Think again, wisely… 🥺' },
  { gif: 'gif3.gif', fallback: 'https://media.tenor.com/R7z1xp4JTKMAAAAC/anime-love.gif',   text: 'Are you really sure? 💔' },
  { gif: 'gif4.gif', fallback: 'https://media.tenor.com/0m_JhMXJEkIAAAAC/cute-cat.gif',     text: 'Please reconsider… 🌹' },
  { gif: 'gif5.gif', fallback: 'https://media.tenor.com/cBMSxCKPwgQAAAAC/love-kawaii.gif',  text: 'Last chance, my love 💗' },
];

/* ── DOM ────────────────────────────────────────────────── */
const introScreen   = document.getElementById('screen-intro');
const cardScreen    = document.getElementById('screen-card');
const video1Screen  = document.getElementById('screen-video1');
const successScreen = document.getElementById('screen-success');
const video2Screen  = document.getElementById('screen-video2');

const gifEl            = document.getElementById('gif');
const questionEl       = document.getElementById('question');
const stepDotsEl       = document.getElementById('stepDots');
const btnRow           = document.getElementById('btnRow');
const yesBtn           = document.getElementById('yes');
const noBtn            = document.getElementById('no');
const successBurst     = document.getElementById('successBurst');
const successGifEl     = document.getElementById('successGif');
const nextAfterSuccess = document.getElementById('nextAfterSuccess');
const skipVideo1       = document.getElementById('skipVideo1');
const vid1             = document.getElementById('vid1');
const vid2             = document.getElementById('vid2');
const music            = document.getElementById('bgMusic');

/* ── STATE ──────────────────────────────────────────────── */
let step          = 0;       // which scene we're on
let firstNo       = true;    // first No triggers video, rest change scenes
let noTeleporting = false;
let lastNoX       = -1;
let lastNoY       = -1;

/* All screens list for showScreen() */
const ALL_SCREENS = [introScreen, cardScreen, video1Screen, successScreen, video2Screen];

/* ══════════════════════════════════════════════════════════
   SCREEN MANAGEMENT
══════════════════════════════════════════════════════════ */
function showScreen(next) {
  ALL_SCREENS.forEach(s => {
    s.classList.remove('active');
    s.style.pointerEvents = 'none';
  });
  next.classList.add('active');
  next.style.pointerEvents = 'all';
}

/* ══════════════════════════════════════════════════════════
   GIF LOADING (no shimmer wrapper needed — bare image)
══════════════════════════════════════════════════════════ */
function loadGif(src, fallback, onDone) {
  gifEl.classList.remove('loaded');
  const img = new Image();
  img.onload = () => {
    gifEl.src = img.src;
    gifEl.classList.add('loaded');
    if (onDone) onDone();
  };
  img.onerror = () => {
    if (fallback && img.src !== fallback) {
      img.src = fallback;
    } else {
      gifEl.classList.add('loaded');
      if (onDone) onDone();
    }
  };
  img.src = src;
}

function loadScene(index) {
  const scene = SCENES[index];

  // Fade question out then back in
  questionEl.style.opacity = '0';
  questionEl.style.transform = 'translateY(8px)';
  setTimeout(() => {
    questionEl.textContent = scene.text;
    questionEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    questionEl.style.opacity = '1';
    questionEl.style.transform = 'translateY(0)';
  }, 200);

  loadGif(scene.gif, scene.fallback);
  buildStepDots();
}

function buildStepDots() {
  stepDotsEl.innerHTML = '';
  SCENES.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'step-dot';
    if (i < step)   dot.classList.add('done');
    if (i === step) dot.classList.add('active');
    stepDotsEl.appendChild(dot);
  });
}

/* ══════════════════════════════════════════════════════════
   SCREEN 1 — INTRO TAP
══════════════════════════════════════════════════════════ */
introScreen.addEventListener('click', startExperience);
introScreen.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') startExperience();
});

function startExperience() {
  music.play().catch(() => {});
  showScreen(cardScreen);
  loadScene(0);
}

/* ══════════════════════════════════════════════════════════
   YES BUTTON → SUCCESS SCREEN
══════════════════════════════════════════════════════════ */
yesBtn.addEventListener('click', () => {
  resetNoButton();
  vid1.pause();
  spawnSuccessBurst();
  loadSuccessGif();
  showScreen(successScreen);
});

function loadSuccessGif() {
  // gif6.gif is the success gif — no box, just the image
  const img = new Image();
  img.onload = () => { successGifEl.src = img.src; };
  img.onerror = () => {
    // fallback to a sweet tenor gif
    successGifEl.src = 'https://media.tenor.com/JqbHaO7UMiMAAAAC/love-heart.gif';
  };
  img.src = 'gif6.gif';
}

/* ══════════════════════════════════════════════════════════
   NO BUTTON
══════════════════════════════════════════════════════════ */
noBtn.addEventListener('click', handleNo);

noBtn.addEventListener('pointerenter', () => {
  if (noTeleporting) teleportNo();
});

function handleNo() {
  if (firstNo) {
    // Very first "No" → play video.mp4
    firstNo = false;
    vid1.currentTime = 0;
    vid1.play().catch(() => {});
    showScreen(video1Screen);
    return;
  }

  if (step < SCENES.length - 1) {
    step++;
    loadScene(step);
  } else {
    // All scenes exhausted — button runs away
    teleportNo();
  }
}

/* ══════════════════════════════════════════════════════════
   SCREEN 3 — VIDEO 1 "Continue" → back to card (scene 2+)
══════════════════════════════════════════════════════════ */
skipVideo1.addEventListener('click', () => {
  vid1.pause();
  // Move to scene 1 (gif2) since gif1 already shown before video
  step = 1;
  loadScene(step);
  showScreen(cardScreen);
});

/* ══════════════════════════════════════════════════════════
   SCREEN 4 — SUCCESS "Next" → play video2.mp4 with its own audio
   bgMusic pauses so video2's audio is heard clearly
══════════════════════════════════════════════════════════ */
nextAfterSuccess.addEventListener('click', () => {
  // Pause background music so video2's own audio plays cleanly
  music.pause();
  vid2.currentTime = 0;
  vid2.muted = false;           // ensure audio is on
  vid2.volume = 1.0;
  vid2.play().catch(() => {
    // If autoplay with audio is blocked, still show the screen
  });
  showScreen(video2Screen);
});

/* ══════════════════════════════════════════════════════════
   NO TELEPORT — button moved to body to escape
   CSS transform on .screen would break position:fixed,
   so we physically reparent the button to document.body.
══════════════════════════════════════════════════════════ */
function teleportNo() {
  if (!noTeleporting) {
    noTeleporting = true;
    noBtn.classList.add('teleporting');
    document.body.appendChild(noBtn);
    // Seed at centre so first jump is always visually far
    lastNoX = document.documentElement.clientWidth  / 2;
    lastNoY = document.documentElement.clientHeight / 2;
  }

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;

  const BTN_W  = 110;
  const BTN_H  = 48;
  const MARGIN = 32;

  const minX = MARGIN;
  const minY = MARGIN;
  const maxX = vw - BTN_W - MARGIN;
  const maxY = vh - BTN_H - MARGIN;

  if (maxX < minX || maxY < minY) return;

  const minDist = Math.min(vw, vh) * 0.30;
  let newX, newY, tries = 0;

  do {
    newX = minX + Math.random() * (maxX - minX);
    newY = minY + Math.random() * (maxY - minY);
    tries++;
  } while (Math.hypot(newX - lastNoX, newY - lastNoY) < minDist && tries < 80);

  // Hard clamp — mathematically cannot escape screen
  newX = Math.min(Math.max(newX, minX), maxX);
  newY = Math.min(Math.max(newY, minY), maxY);

  lastNoX = newX;
  lastNoY = newY;

  noBtn.style.left = newX + 'px';
  noBtn.style.top  = newY + 'px';
}

function resetNoButton() {
  if (!noTeleporting) return;
  const row = document.getElementById('btnRow');
  if (row && !row.contains(noBtn)) row.appendChild(noBtn);
  noBtn.classList.remove('teleporting');
  noBtn.style.left = '';
  noBtn.style.top  = '';
  noTeleporting = false;
  lastNoX = -1;
  lastNoY = -1;
}

function clampNoBtn() {
  if (!noTeleporting) return;
  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const MARGIN = 32;
  const curL = parseFloat(noBtn.style.left) || 0;
  const curT = parseFloat(noBtn.style.top)  || 0;
  noBtn.style.left = Math.min(Math.max(curL, MARGIN), vw - 110 - MARGIN) + 'px';
  noBtn.style.top  = Math.min(Math.max(curT, MARGIN), vh -  48 - MARGIN) + 'px';
}

window.addEventListener('resize', clampNoBtn);
window.addEventListener('orientationchange', () => setTimeout(clampNoBtn, 150));

/* ══════════════════════════════════════════════════════════
   SUCCESS BURST RINGS
══════════════════════════════════════════════════════════ */
const BURST_COLORS = [
  { color: '#E8436A', shadow: '0 0 14px #E8436A, 0 0 30px #C2005F' },
  { color: '#FFB5C8', shadow: '0 0 10px #FFB5C8, 0 0 22px #E8436A88' },
  { color: '#C2005F', shadow: '0 0 16px #C2005F, 0 0 36px #6E003099' },
  { color: '#FFE8EF', shadow: '0 0 8px #FFE8EF, 0 0 18px #FFB5C888' },
];

function spawnSuccessBurst() {
  successBurst.innerHTML = '';
  BURST_COLORS.forEach((c, i) => {
    const ring = document.createElement('div');
    ring.className = 'burst-ring';
    const size = 60 + i * 30;
    ring.style.cssText = `
      width: ${size}px; height: ${size}px;
      border-color: ${c.color};
      box-shadow: ${c.shadow};
      animation-delay: ${i * 0.14}s;
    `;
    successBurst.appendChild(ring);
  });
}

/* ══════════════════════════════════════════════════════════
   PETALS
══════════════════════════════════════════════════════════ */
(function spawnPetals() {
  const container = document.getElementById('petals-container');
  const PETAL_COLORS = [
    'rgba(255,181,200,0.78)', 'rgba(232,67,106,0.62)',
    'rgba(194,0,95,0.48)',    'rgba(255,232,239,0.65)',
    'rgba(255,140,170,0.55)', 'rgba(110,0,48,0.45)',
  ];
  const PETAL_SHADOWS = [
    '0 0 6px rgba(255,181,200,0.8)', '0 0 6px rgba(232,67,106,0.7)',
    '0 0 6px rgba(194,0,95,0.6)',    '0 0 5px rgba(255,232,239,0.7)',
  ];

  for (let i = 0; i < 55; i++) {
    const p   = document.createElement('div');
    p.className = 'petal';
    const w   = 7 + Math.random() * 10;
    const h   = w * (1.4 + Math.random() * 0.6);
    const dx  = (Math.random() - 0.5) * 140;
    const rx1 = 60 + Math.random() * 30;
    const rx2 = 15 + Math.random() * 20;
    const ry1 = 45 + Math.random() * 25;
    const ry2 = 20 + Math.random() * 25;
    p.style.cssText = `
      left: ${Math.random() * 110 - 5}%;
      width: ${w}px; height: ${h}px;
      background: ${PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]};
      --dx: ${dx}px;
      animation-duration: ${7 + Math.random() * 9}s;
      animation-delay: ${Math.random() * -18}s;
      filter: blur(${0.2 + Math.random() * 0.7}px);
      box-shadow: ${PETAL_SHADOWS[Math.floor(Math.random() * PETAL_SHADOWS.length)]};
      border-radius: ${rx1}% ${rx2}% ${rx1}% ${rx2}% / ${ry1}% ${ry2}% ${ry1}% ${ry2}%;
    `;
    container.appendChild(p);
  }
})();

/* ══════════════════════════════════════════════════════════
   SPARKLES
══════════════════════════════════════════════════════════ */
(function spawnSparkles() {
  const container = document.getElementById('sparkles-container');
  const PRESETS = [
    { color: '#FFB5C8', shadow: '0 0 8px #FFB5C8, 0 0 16px #E8436A77' },
    { color: '#E8436A', shadow: '0 0 8px #E8436A, 0 0 18px #C2005F88' },
    { color: '#FFE8EF', shadow: '0 0 6px #FFE8EF, 0 0 14px #FFB5C888' },
    { color: '#C2005F', shadow: '0 0 10px #C2005F, 0 0 20px #6E003077' },
  ];
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const pr = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    const sz = 2 + Math.random() * 5;
    s.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      width: ${sz}px; height: ${sz}px;
      background: ${pr.color};
      box-shadow: ${pr.shadow};
      animation-duration: ${2 + Math.random() * 4}s;
      animation-delay: ${Math.random() * -6}s;
    `;
    container.appendChild(s);
  }
})();
