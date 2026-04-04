/* ═══════════════════════════════════════════════════════════
   LOVE CONFESSION — script.js
   ═══════════════════════════════════════════════════════ */
'use strict';

/* ── SCENES ────────────────────────────────────────────── */
const SCENES = [
  { gif: 'gif1.gif', fallback: 'https://media.tenor.com/X8OKgelm2FEAAAAC/love-heart.gif',  text: 'Do you love me? 💗' },
  { gif: 'gif2.gif', fallback: 'https://media.tenor.com/gLCCsUPLzAMAAAAC/cute-love.gif',   text: 'Think again, wisely… 🥺' },
  { gif: 'gif3.gif', fallback: 'https://media.tenor.com/R7z1xp4JTKMAAAAC/anime-love.gif',  text: 'Are you really sure? 💔' },
  { gif: 'gif4.gif', fallback: 'https://media.tenor.com/0m_JhMXJEkIAAAAC/cute-cat.gif',    text: 'Please reconsider… 🌹' },
  { gif: 'gif5.gif', fallback: 'https://media.tenor.com/cBMSxCKPwgQAAAAC/love-kawaii.gif', text: 'Last chance, my love 💗' },
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
const zeroxBtn         = document.getElementById('zeroxBtn');
const vid1             = document.getElementById('vid1');
const vid2             = document.getElementById('vid2');
const music            = document.getElementById('bgMusic');

/* ── STATE ──────────────────────────────────────────────── */
let step          = 0;
let firstNo       = true;
let noTeleporting = false;
let lastNoX       = -1;
let lastNoY       = -1;

const ALL_SCREENS = [introScreen, cardScreen, video1Screen, successScreen, video2Screen];

/* ══════════════════════════════════════════════════════════
   ZEROX BUTTON — set href from config.js
══════════════════════════════════════════════════════════ */
if (typeof CONFIG !== 'undefined' && CONFIG.chatRoomLink) {
  zeroxBtn.href = CONFIG.chatRoomLink;
}

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
   MUSIC HELPERS — fade out then pause, fade in on resume
══════════════════════════════════════════════════════════ */
let musicFadeTimer = null;

function fadeOutMusic(duration, onDone) {
  clearInterval(musicFadeTimer);
  const steps    = 20;
  const interval = duration / steps;
  const startVol = music.volume;
  let   current  = 0;

  musicFadeTimer = setInterval(() => {
    current++;
    music.volume = Math.max(0, startVol * (1 - current / steps));
    if (current >= steps) {
      clearInterval(musicFadeTimer);
      music.pause();
      music.volume = startVol; // restore for next time
      if (onDone) onDone();
    }
  }, interval);
}

function fadeInMusic(duration) {
  clearInterval(musicFadeTimer);
  music.volume = 0;
  music.play().catch(() => {});
  const steps    = 20;
  const interval = duration / steps;
  const target   = 1.0;
  let   current  = 0;

  musicFadeTimer = setInterval(() => {
    current++;
    music.volume = Math.min(target, target * (current / steps));
    if (current >= steps) clearInterval(musicFadeTimer);
  }, interval);
}

/* ══════════════════════════════════════════════════════════
   SCREEN 1 — INTRO TAP
══════════════════════════════════════════════════════════ */
introScreen.addEventListener('click', startExperience);
introScreen.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') startExperience();
});

function startExperience() {
  music.volume = 1.0;
  music.play().catch(() => {});
  showScreen(cardScreen);
  loadScene(0);
}

/* ══════════════════════════════════════════════════════════
   GIF LOADING
══════════════════════════════════════════════════════════ */
function loadGif(src, fallback) {
  gifEl.classList.remove('loaded');
  const img = new Image();
  img.onload = () => { gifEl.src = img.src; gifEl.classList.add('loaded'); };
  img.onerror = () => {
    if (fallback && img.src !== fallback) { img.src = fallback; }
    else { gifEl.classList.add('loaded'); }
  };
  img.src = src;
}

function loadScene(index) {
  const scene = SCENES[index];
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
   YES → SUCCESS
══════════════════════════════════════════════════════════ */
yesBtn.addEventListener('click', () => {
  resetNoButton();
  vid1.pause();
  spawnSuccessBurst();
  loadSuccessGif();
  showScreen(successScreen);
});

function loadSuccessGif() {
  const img = new Image();
  img.onload  = () => { successGifEl.src = img.src; };
  img.onerror = () => { successGifEl.src = 'https://media.tenor.com/JqbHaO7UMiMAAAAC/love-heart.gif'; };
  img.src = 'gif6.gif';
}

/* ══════════════════════════════════════════════════════════
   NO BUTTON
══════════════════════════════════════════════════════════ */
noBtn.addEventListener('click', handleNo);
noBtn.addEventListener('pointerenter', () => { if (noTeleporting) teleportNo(); });

function handleNo() {
  if (firstNo) {
    firstNo = false;
    vid1.currentTime = 0;
    // vid1 is muted — song.mp3 keeps playing during video1
    vid1.play().catch(() => {});
    showScreen(video1Screen);
    return;
  }
  if (step < SCENES.length - 1) {
    step++;
    loadScene(step);
  } else {
    teleportNo();
  }
}

/* ══════════════════════════════════════════════════════════
   VIDEO 1 — auto-advance when clip ends (plays once then continues)
   "Continue" button remains as manual fallback
══════════════════════════════════════════════════════════ */
vid1.addEventListener('ended', () => {
  vid1.pause();
  step = 1;
  loadScene(step);
  showScreen(cardScreen);
});

skipVideo1.addEventListener('click', () => {
  vid1.pause();
  step = 1;
  loadScene(step);
  showScreen(cardScreen);
});

/* ══════════════════════════════════════════════════════════
   SUCCESS "Next" → VIDEO 2
   song.mp3 fades out → vid2 plays with its own audio
══════════════════════════════════════════════════════════ */
nextAfterSuccess.addEventListener('click', () => {
  showScreen(video2Screen);

  // Fade out song.mp3 over 800ms then play vid2 with audio
  fadeOutMusic(800, () => {
    vid2.currentTime = 0;
    vid2.muted  = false;
    vid2.volume = 1.0;
    vid2.play().catch(() => {
      // Autoplay with audio sometimes blocked on mobile.
      // vid2 is already visible — user can tap it to play.
    });
  });
});

/* ══════════════════════════════════════════════════════════
   NO TELEPORT
   Button reparented to body so CSS transform on .screen
   doesn't break position:fixed.
══════════════════════════════════════════════════════════ */
function teleportNo() {
  if (!noTeleporting) {
    noTeleporting = true;
    noBtn.classList.add('teleporting');
    document.body.appendChild(noBtn);
    lastNoX = document.documentElement.clientWidth  / 2;
    lastNoY = document.documentElement.clientHeight / 2;
  }

  const vw = document.documentElement.clientWidth;
  const vh = document.documentElement.clientHeight;
  const BTN_W = 110, BTN_H = 48, MARGIN = 32;
  const minX = MARGIN, minY = MARGIN;
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

  newX = Math.min(Math.max(newX, minX), maxX);
  newY = Math.min(Math.max(newY, minY), maxY);
  lastNoX = newX; lastNoY = newY;
  noBtn.style.left = newX + 'px';
  noBtn.style.top  = newY + 'px';
}

function resetNoButton() {
  if (!noTeleporting) return;
  const row = document.getElementById('btnRow');
  if (row && !row.contains(noBtn)) row.appendChild(noBtn);
  noBtn.classList.remove('teleporting');
  noBtn.style.left = noBtn.style.top = '';
  noTeleporting = false; lastNoX = lastNoY = -1;
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
    ring.style.cssText = `width:${size}px;height:${size}px;border-color:${c.color};box-shadow:${c.shadow};animation-delay:${i*0.14}s;`;
    successBurst.appendChild(ring);
  });
}

/* ══════════════════════════════════════════════════════════
   PETALS
══════════════════════════════════════════════════════════ */
(function spawnPetals() {
  const container = document.getElementById('petals-container');
  const COLS = ['rgba(255,181,200,0.78)','rgba(232,67,106,0.62)','rgba(194,0,95,0.48)','rgba(255,232,239,0.65)','rgba(255,140,170,0.55)','rgba(110,0,48,0.45)'];
  const SHAD = ['0 0 6px rgba(255,181,200,0.8)','0 0 6px rgba(232,67,106,0.7)','0 0 6px rgba(194,0,95,0.6)','0 0 5px rgba(255,232,239,0.7)'];
  for (let i = 0; i < 55; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const w = 7 + Math.random()*10, h = w*(1.4+Math.random()*0.6);
    const dx = (Math.random()-0.5)*140;
    const rx1=60+Math.random()*30, rx2=15+Math.random()*20, ry1=45+Math.random()*25, ry2=20+Math.random()*25;
    p.style.cssText = `left:${Math.random()*110-5}%;width:${w}px;height:${h}px;background:${COLS[Math.floor(Math.random()*COLS.length)]};--dx:${dx}px;animation-duration:${7+Math.random()*9}s;animation-delay:${Math.random()*-18}s;filter:blur(${0.2+Math.random()*0.7}px);box-shadow:${SHAD[Math.floor(Math.random()*SHAD.length)]};border-radius:${rx1}% ${rx2}% ${rx1}% ${rx2}% / ${ry1}% ${ry2}% ${ry1}% ${ry2}%;`;
    container.appendChild(p);
  }
})();

/* ══════════════════════════════════════════════════════════
   SPARKLES
══════════════════════════════════════════════════════════ */
(function spawnSparkles() {
  const container = document.getElementById('sparkles-container');
  const PR = [{color:'#FFB5C8',shadow:'0 0 8px #FFB5C8, 0 0 16px #E8436A77'},{color:'#E8436A',shadow:'0 0 8px #E8436A, 0 0 18px #C2005F88'},{color:'#FFE8EF',shadow:'0 0 6px #FFE8EF, 0 0 14px #FFB5C888'},{color:'#C2005F',shadow:'0 0 10px #C2005F, 0 0 20px #6E003077'}];
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    const pr = PR[Math.floor(Math.random()*PR.length)], sz = 2+Math.random()*5;
    s.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;background:${pr.color};box-shadow:${pr.shadow};animation-duration:${2+Math.random()*4}s;animation-delay:${Math.random()*-6}s;`;
    container.appendChild(s);
  }
})();
