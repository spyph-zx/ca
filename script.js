/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   LOVE CONFESSION \u2014 script.js  (performance edition)
   \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
'use strict';

/* \u2500\u2500 SCENES \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
const SCENES = [
  { gif: 'gif1.gif', fallback: 'https://media.tenor.com/X8OKgelm2FEAAAAC/love-heart.gif',  text: 'Do you love me? \ud83d\udc97' },
  { gif: 'gif2.gif', fallback: 'https://media.tenor.com/gLCCsUPLzAMAAAAC/cute-love.gif',   text: 'Think again, wisely\u2026 \ud83e\udd7a' },
  { gif: 'gif3.gif', fallback: 'https://media.tenor.com/R7z1xp4JTKMAAAAC/anime-love.gif',  text: 'Are you really sure? \ud83d\udc94' },
  { gif: 'gif4.gif', fallback: 'https://media.tenor.com/0m_JhMXJEkIAAAAC/cute-cat.gif',    text: 'Please reconsider\u2026 \ud83c\udf39' },
  { gif: 'gif5.gif', fallback: 'https://media.tenor.com/cBMSxCKPwgQAAAAC/love-kawaii.gif', text: 'Last chance, my love \ud83d\udc97' },
];

/* \u2500\u2500 DOM \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
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

/* \u2500\u2500 STATE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
let step          = 0;
let firstNo       = true;
let noTeleporting = false;
let lastNoX       = -1;
let lastNoY       = -1;
let transitioning = false;   // guard against double-taps during transitions

const ALL_SCREENS = [introScreen, cardScreen, video1Screen, successScreen, video2Screen];

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   ZEROX BUTTON
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
if (typeof CONFIG !== 'undefined' && CONFIG.chatRoomLink) {
  zeroxBtn.href = CONFIG.chatRoomLink;
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   PRE-LOAD vid2 early so it's buffered before the user gets there.
   We use preload="auto" + load() and keep it muted + paused.
   This eliminates the stutter when "Next \ud83d\udc97" is tapped.
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
function preloadVid2() {
  vid2.preload = 'auto';
  vid2.muted   = true;   // muted so browser allows buffering without user gesture
  vid2.load();
}
// Start buffering immediately \u2014 the user has to tap intro first,
// giving the browser plenty of time before vid2 is needed.
preloadVid2();

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   SCREEN MANAGEMENT \u2014 GPU-composited opacity transitions only
   will-change is set on active screen, cleared after hide
   so the browser can manage layer memory properly.
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
function showScreen(next, onShown) {
  if (transitioning) return;
  transitioning = true;

  // Mark next screen for GPU promotion before opacity change
  next.style.willChange = 'opacity';

  ALL_SCREENS.forEach(s => {
    if (s === next) return;
    s.classList.remove('active');
    s.style.pointerEvents = 'none';
    // Release GPU layer after transition completes
    setTimeout(() => { s.style.willChange = 'auto'; }, 600);
  });

  // Use rAF to batch the class add into the next paint frame
  requestAnimationFrame(() => {
    next.classList.add('active');
    next.style.pointerEvents = 'all';
    // Unlock after CSS transition (550ms) + small buffer
    setTimeout(() => {
      transitioning = false;
      next.style.willChange = 'auto';
      if (onShown) onShown();
    }, 620);
  });
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   MUSIC HELPERS \u2014 Web Animations API instead of setInterval
   AudioParam.linearRampToValueAtTime is smoother than polling.
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
let audioCtx      = null;
let musicSource   = null;
let gainNode      = null;
let musicFadeRAF  = null;

// Lightweight rAF-based volume fade \u2014 no setInterval, no GC pressure
function fadeOutMusic(durationMs, onDone) {
  cancelAnimationFrame(musicFadeRAF);
  const start    = performance.now();
  const startVol = music.volume;

  function tick(now) {
    const t = Math.min((now - start) / durationMs, 1);
    music.volume = startVol * (1 - t);
    if (t < 1) {
      musicFadeRAF = requestAnimationFrame(tick);
    } else {
      music.volume = 0;
      music.pause();
      music.volume = startVol;
      if (onDone) onDone();
    }
  }
  musicFadeRAF = requestAnimationFrame(tick);
}

function fadeInMusic(durationMs) {
  cancelAnimationFrame(musicFadeRAF);
  music.volume = 0;
  music.play().catch(() => {});
  const start  = performance.now();
  const target = 1.0;

  function tick(now) {
    const t = Math.min((now - start) / durationMs, 1);
    music.volume = target * t;
    if (t < 1) musicFadeRAF = requestAnimationFrame(tick);
  }
  musicFadeRAF = requestAnimationFrame(tick);
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   SCREEN 1 \u2014 INTRO TAP
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   GIF LOADING
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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
  questionEl.style.opacity   = '0';
  questionEl.style.transform = 'translateY(8px)';
  setTimeout(() => {
    questionEl.textContent = scene.text;
    questionEl.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    questionEl.style.opacity    = '1';
    questionEl.style.transform  = 'translateY(0)';
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

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   YES \u2192 SUCCESS
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
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

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   NO BUTTON
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
noBtn.addEventListener('click', handleNo);
noBtn.addEventListener('pointerenter', () => { if (noTeleporting) teleportNo(); });

function handleNo() {
  if (firstNo) {
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
    teleportNo();
  }
}

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   VIDEO 1 \u2014 auto-advance when clip ends; Continue = manual skip
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
function leaveVideo1() {
  vid1.pause();
  step = 1;
  loadScene(step);
  showScreen(cardScreen);
}

vid1.addEventListener('ended', leaveVideo1);
skipVideo1.addEventListener('click', leaveVideo1);

/* \u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
   SUCCESS "Next \ud83d\udc97" \u2192 VIDEO 2
   \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
   SMOOTH SEQUENCE:
   1. Switch screen immediately (CSS fade handles the visual)
   2. Start music fade-out (rAF-based, off main thread pressure)
   3. Once music is silent \u2192 unmute & play vid2 (already buffered)
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550 */
nextAfterSuccess.addEventListener('click', () => {
  // Show video2 screen right away \u2014 it fades in via CSS (550ms)
  showScreen(video2Screen, () => {
    // Called once
