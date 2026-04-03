/* ═══════════════════════════════════════════════════════════
   LOVE CONFESSION — script.js
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── SCENES ────────────────────────────────────────────── */
const SCENES = [
  {
    gif:  'gif1.gif',
    // Fallback stock gif if local file missing
    fallback: 'https://media.tenor.com/X8OKgelm2FEAAAAC/love-heart.gif',
    text: 'Do you love me? 💗'
  },
  {
    gif:  'gif2.gif',
    fallback: 'https://media.tenor.com/gLCCsUPLzAMAAAAC/cute-love.gif',
    text: 'Think again, wisely… 🥺'
  },
  {
    gif:  'gif3.gif',
    fallback: 'https://media.tenor.com/R7z1xp4JTKMAAAAC/anime-love.gif',
    text: 'Are you really sure? 💔'
  },
  {
    gif:  'gif4.gif',
    fallback: 'https://media.tenor.com/0m_JhMXJEkIAAAAC/cute-cat.gif',
    text: 'Please reconsider… 🌹'
  },
  {
    gif:  'gif5.gif',
    fallback: 'https://media.tenor.com/cBMSxCKPwgQAAAAC/love-kawaii.gif',
    text: 'Last chance, my love 💗'
  }
];

/* ── DOM REFERENCES ────────────────────────────────────── */
const introScreen   = document.getElementById('screen-intro');
const cardScreen    = document.getElementById('screen-card');
const successScreen = document.getElementById('screen-success');
const gifEl         = document.getElementById('gif');
const gifShimmer    = document.getElementById('gifShimmer');
const questionEl    = document.getElementById('question');
const yesBtn        = document.getElementById('yes');
const noBtn         = document.getElementById('no');
const stepDotsEl    = document.getElementById('stepDots');
const successBurst  = document.getElementById('successBurst');
const music         = document.getElementById('bgMusic');

/* ── STATE ─────────────────────────────────────────────── */
let step             = 0;
let noTeleporting    = false;
let lastNoX          = -1;
let lastNoY          = -1;

/* ═══════════════════════════════════════════════════════════
   SCREEN MANAGEMENT
   ═══════════════════════════════════════════════════════ */
function showScreen(next) {
  const all = [introScreen, cardScreen, successScreen];
  all.forEach(s => {
    if (s === next) return;
    if (!s.classList.contains('active')) return;
    s.classList.add('exit');
    s.classList.remove('active');
    setTimeout(() => s.classList.remove('exit'), 600);
  });

  // Small delay so exit animation starts first
  setTimeout(() => {
    next.classList.add('active');
    next.classList.remove('exit');
  }, 80);
}

/* ═══════════════════════════════════════════════════════════
   SCENE LOADING
   ═══════════════════════════════════════════════════════ */
function buildStepDots() {
  stepDotsEl.innerHTML = '';
  SCENES.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'step-dot';
    if (i < step)  dot.classList.add('done');
    if (i === step) dot.classList.add('active');
    stepDotsEl.appendChild(dot);
  });
}

function loadScene(index) {
  const scene = SCENES[index];

  // Show shimmer while loading
  gifShimmer.classList.add('active');
  gifEl.classList.remove('loaded');

  // Animate question change
  questionEl.style.opacity = '0';
  questionEl.style.transform = 'translateY(8px)';

  setTimeout(() => {
    questionEl.textContent = scene.text;
    questionEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    questionEl.style.opacity = '1';
    questionEl.style.transform = 'translateY(0)';
  }, 200);

  // Load gif, fall back to online source if local file fails
  const img = new Image();
  img.onload = () => {
    gifEl.src = img.src;
    gifEl.classList.add('loaded');
    gifShimmer.classList.remove('active');
  };
  img.onerror = () => {
    if (img.src !== scene.fallback) {
      img.src = scene.fallback;
    } else {
      gifShimmer.classList.remove('active');
      gifEl.classList.add('loaded');
    }
  };
  img.src = scene.gif;

  buildStepDots();
}

/* ═══════════════════════════════════════════════════════════
   INTRO → CARD
   ═══════════════════════════════════════════════════════ */
function handleIntroTap() {
  // Try to play music (may be blocked until user gesture — this IS a gesture)
  music.play().catch(() => {/* silent */});
  showScreen(cardScreen);
  loadScene(step);
}

introScreen.addEventListener('click', handleIntroTap);
introScreen.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') handleIntroTap();
});

/* ═══════════════════════════════════════════════════════════
   YES BUTTON
   ═══════════════════════════════════════════════════════ */
yesBtn.addEventListener('click', () => {
  // Reset no button if it's floating
  resetNoButton();
  spawnSuccessBurst();
  showScreen(successScreen);
});

/* ═══════════════════════════════════════════════════════════
   NO BUTTON — ESCAPE LOGIC
   ═══════════════════════════════════════════════════════ */
noBtn.addEventListener('click', handleNo);

/* Also dodge on pointer-over once teleporting (harder to catch) */
noBtn.addEventListener('pointerenter', () => {
  if (noTeleporting) teleportNo();
});

function handleNo() {
  if (step < SCENES.length - 1) {
    step++;
    loadScene(step);
  } else {
    // All scenes exhausted — button starts running away
    teleportNo();
  }
}

function teleportNo() {
  // Use visualViewport when available — respects mobile browser chrome & keyboard
  const vw = window.visualViewport ? window.visualViewport.width  : window.innerWidth;
  const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;

  const BTN_W  = 110;
  const BTN_H  = 44;
  const MARGIN = 28; // generous safe area — never clips on any mobile edge

  const minX = MARGIN;
  const minY = MARGIN;
  const maxX = vw - BTN_W  - MARGIN;
  const maxY = vh - BTN_H  - MARGIN;

  if (!noTeleporting) {
    const rect = noBtn.getBoundingClientRect();
    noTeleporting = true;
    noBtn.classList.add('teleporting');
    lastNoX = Math.min(Math.max(rect.left, minX), maxX);
    lastNoY = Math.min(Math.max(rect.top,  minY), maxY);
    noBtn.style.left = lastNoX + 'px';
    noBtn.style.top  = lastNoY + 'px';
  }

  if (maxX <= minX || maxY <= minY) return;

  const minDist = Math.min(vw, vh) * 0.28;
  let newX, newY, tries = 0;

  do {
    newX = minX + Math.random() * (maxX - minX);
    newY = minY + Math.random() * (maxY - minY);
    tries++;
  } while (Math.hypot(newX - lastNoX, newY - lastNoY) < minDist && tries < 60);

  // Hard-clamp — guarantees fully inside viewport no matter what
  newX = Math.min(Math.max(newX, minX), maxX);
  newY = Math.min(Math.max(newY, minY), maxY);

  lastNoX = newX;
  lastNoY = newY;

  noBtn.style.left = newX + 'px';
  noBtn.style.top  = newY + 'px';
}

function resetNoButton() {
  if (!noTeleporting) return;
  noBtn.classList.remove('teleporting');
  noBtn.style.left = '';
  noBtn.style.top  = '';
  noBtn.style.width  = '';
  noBtn.style.height = '';
  noTeleporting = false;
}

/* Keep no button strictly within bounds on resize / orientation change */
function clampNoBtn() {
  if (!noTeleporting) return;
  const vw     = window.visualViewport ? window.visualViewport.width  : window.innerWidth;
  const vh     = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  const BTN_W  = 110;
  const BTN_H  = 44;
  const MARGIN = 28;
  const curL   = parseFloat(noBtn.style.left) || 0;
  const curT   = parseFloat(noBtn.style.top)  || 0;
  noBtn.style.left = Math.min(Math.max(curL, MARGIN), vw - BTN_W - MARGIN) + 'px';
  noBtn.style.top  = Math.min(Math.max(curT, MARGIN), vh - BTN_H - MARGIN) + 'px';
}
window.addEventListener('resize', clampNoBtn);
window.addEventListener('orientationchange', clampNoBtn);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', clampNoBtn);
}

/* ═══════════════════════════════════════════════════════════
   SUCCESS BURST RINGS
   ═══════════════════════════════════════════════════════ */
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
      width:  ${size}px;
      height: ${size}px;
      border-color: ${c.color};
      box-shadow: ${c.shadow};
      animation-delay: ${i * 0.14}s;
    `;
    successBurst.appendChild(ring);
  });
}

/* ═══════════════════════════════════════════════════════════
   PETALS
   ═══════════════════════════════════════════════════════ */
const PETAL_COLORS = [
  'rgba(255,181,200,0.78)',   // blush
  'rgba(232,67,106,0.62)',   // rose
  'rgba(194,0,95,0.48)',     // magenta
  'rgba(255,232,239,0.65)',  // champagne
  'rgba(255,140,170,0.55)',  // mid pink
  'rgba(110,0,48,0.45)',     // wine
];

const PETAL_SHADOWS = [
  '0 0 6px rgba(255,181,200,0.8)',
  '0 0 6px rgba(232,67,106,0.7)',
  '0 0 6px rgba(194,0,95,0.6)',
  '0 0 5px rgba(255,232,239,0.7)',
];

(function spawnPetals() {
  const container = document.getElementById('petals-container');
  const COUNT = 55;

  for (let i = 0; i < COUNT; i++) {
    const p  = document.createElement('div');
    p.className = 'petal';

    const w    = 7  + Math.random() * 10;
    const h    = w  * (1.4 + Math.random() * 0.6);
    const left = Math.random() * 110 - 5;
    const dur  = 7  + Math.random() * 9;
    const del  = Math.random() * -18;
    const dx   = (Math.random() - 0.5) * 140;
    const col  = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
    const sha  = PETAL_SHADOWS[Math.floor(Math.random() * PETAL_SHADOWS.length)];
    const blur = 0.2 + Math.random() * 0.7;

    // Slightly varied border-radius per petal for organic feel
    const rx1 = 60 + Math.random() * 30;
    const rx2 = 15 + Math.random() * 20;
    const ry1 = 45 + Math.random() * 25;
    const ry2 = 20 + Math.random() * 25;

    p.style.cssText = `
      left: ${left}%;
      width: ${w}px;
      height: ${h}px;
      background: ${col};
      --dx: ${dx}px;
      animation-duration: ${dur}s;
      animation-delay: ${del}s;
      filter: blur(${blur}px);
      box-shadow: ${sha};
      border-radius: ${rx1}% ${rx2}% ${rx1}% ${rx2}% / ${ry1}% ${ry2}% ${ry1}% ${ry2}%;
    `;
    container.appendChild(p);
  }
})();

/* ═══════════════════════════════════════════════════════════
   SPARKLES
   ═══════════════════════════════════════════════════════ */
const SPARKLE_PRESETS = [
  { color: '#FFB5C8', shadow: '0 0 8px #FFB5C8, 0 0 16px #E8436A77' },
  { color: '#E8436A', shadow: '0 0 8px #E8436A, 0 0 18px #C2005F88' },
  { color: '#FFE8EF', shadow: '0 0 6px #FFE8EF, 0 0 14px #FFB5C888' },
  { color: '#C2005F', shadow: '0 0 10px #C2005F, 0 0 20px #6E003077' },
];

(function spawnSparkles() {
  const container = document.getElementById('sparkles-container');
  const COUNT = 28;

  for (let i = 0; i < COUNT; i++) {
    const s    = document.createElement('div');
    s.className = 'sparkle';

    const size    = 2 + Math.random() * 5;
    const preset  = SPARKLE_PRESETS[Math.floor(Math.random() * SPARKLE_PRESETS.length)];
    const left    = Math.random() * 100;
    const top     = Math.random() * 100;
    const dur     = 2 + Math.random() * 4;
    const del     = Math.random() * -6;

    s.style.cssText = `
      left: ${left}%;
      top:  ${top}%;
      width:  ${size}px;
      height: ${size}px;
      background: ${preset.color};
      box-shadow: ${preset.shadow};
      animation-duration: ${dur}s;
      animation-delay: ${del}s;
    `;
    container.appendChild(s);
  }
})();
