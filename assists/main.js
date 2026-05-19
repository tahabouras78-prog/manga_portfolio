/* ═══════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .power-card, .mission-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('active'); cursorRing.classList.add('active'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('active'); cursorRing.classList.remove('active'); });
});

/* ═══════════════════════════════════════════
   LOADING → INTRO
═══════════════════════════════════════════ */
const loadingEl = document.getElementById('loading');
const loadingText = document.getElementById('loadingText');
const loadSteps = ['INITIALIZING SYSTEM...','LOADING PROTAGONIST...','COMPILING POWERS...','SYSTEM ONLINE.'];
let li = 0;
const loadInterval = setInterval(() => {
  li++;
  if (li < loadSteps.length) loadingText.textContent = loadSteps[li];
  else {
    clearInterval(loadInterval);
    setTimeout(() => {
      loadingEl.classList.add('done');
      startIntro();
    }, 400);
  }
}, 400);

/* ═══════════════════════════════════════════
   INTRO SEQUENCE
═══════════════════════════════════════════ */
function startIntro() {
  const il1 = document.getElementById('il1');
  const ititle = document.getElementById('introTitle');
  const il2 = document.getElementById('il2');
  const isub = document.getElementById('introSub');
  const ebtn = document.getElementById('enterBtn');
  const prog = document.getElementById('introProgress');

  let progress = 0;
  const progInterval = setInterval(() => {
    progress += 0.5;
    prog.style.width = Math.min(progress, 100) + '%';
    if (progress >= 100) clearInterval(progInterval);
  }, 30);

  setTimeout(() => il1.classList.add('show'), 600);
  setTimeout(() => ititle.classList.add('show'), 1200);
  setTimeout(() => il2.classList.add('show'), 1900);
  setTimeout(() => isub.classList.add('show'), 2500);
  setTimeout(() => ebtn.classList.add('show'), 3000);
}

document.getElementById('enterBtn').addEventListener('click', () => {
  showSFX('SHING!', window.innerWidth/2, window.innerHeight/2);
  const intro = document.getElementById('intro');
  const main = document.getElementById('main-site');
  intro.classList.add('exit');

  setTimeout(() => {
    intro.style.display = 'none';
    main.classList.add('visible');
    triggerHeroAnimations();

    // Attach logo tap AFTER site is visible
    const logo = document.querySelector('.nav-logo');
    logo.addEventListener('click', handleLogoTap);
    logo.addEventListener('touchend', e => {
      e.preventDefault();
      handleLogoTap();
    });
  }, 800);
});

/* ═══════════════════════════════════════════
   HERO ANIMATIONS
═══════════════════════════════════════════ */
function triggerHeroAnimations() {
  ['heroEyebrow','heroName','heroTitleRow','heroBio','heroLinks','heroVisual'].forEach((id, i) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.classList.add('in-view');
    }, i * 150);
  });
}

/* ═══════════════════════════════════════════
   INTERSECTION OBSERVER
═══════════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('in-view'), delay);

      el.querySelectorAll('.power-bar').forEach(bar => {
        const level = bar.dataset.level;
        setTimeout(() => bar.style.width = level + '%', delay + 300);
      });
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.chapter-marker, .power-card, .mission-card, .contact-declaration, .contact-panel').forEach(el => {
  observer.observe(el);
});

/* ═══════════════════════════════════════════
   SFX POP
═══════════════════════════════════════════ */
const sfxWords = ['BOOM!','SHING!','CLICK','FLASH!','POWER!','STACK!'];
function showSFX(word, x, y) {
  const el = document.createElement('div');
  el.className = 'sfx-pop';
  el.textContent = word || sfxWords[Math.floor(Math.random() * sfxWords.length)];
  el.style.left = (x - 60) + 'px';
  el.style.top = (y - 40) + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 800);
}

document.querySelectorAll('.power-card').forEach(card => {
  card.addEventListener('click', e => showSFX(null, e.clientX, e.clientY));
});

/* ═══════════════════════════════════════════
   EASTER EGG FUNCTIONS — defined first
═══════════════════════════════════════════ */
function openEasterEgg() {
  showSFX('BOOM!', window.innerWidth/2, window.innerHeight/2);
  document.getElementById('easterEgg').classList.add('active');
}
function closeEasterEgg() {
  document.getElementById('easterEgg').classList.remove('active');
}

/* ═══════════════════════════════════════════
   EASTER EGG TRIGGERS
═══════════════════════════════════════════ */
// Keyboard — Konami code
const konami = [38,38,40,40,37,39,37,39,66,65];
let ki = 0;
document.addEventListener('keydown', e => {
  if (e.keyCode === konami[ki]) {
    ki++;
    if (ki === konami.length) { ki = 0; openEasterEgg(); }
  } else ki = 0;
});

// Mobile + desktop — tap logo 5 times
let logoTaps = 0, logoTimer;
function handleLogoTap() {
  logoTaps++;
  clearTimeout(logoTimer);
  if (logoTaps >= 5) {
    logoTaps = 0;
    openEasterEgg();
  }
  logoTimer = setTimeout(() => logoTaps = 0, 2000);
}

// Mobile hint
const hint = document.getElementById('secretHint');
const isMobile = window.matchMedia('(max-width: 768px)').matches;
if (hint) hint.textContent = isMobile ? '[ tap logo × 5 ]' : '↑↑↓↓←→←→BA';

/* ═══════════════════════════════════════════
   CONTACT SUBMIT
═══════════════════════════════════════════ */
function handleContactSubmit() {
  const name    = document.querySelector('.contact-input[placeholder="Your name..."]').value.trim();
  const email   = document.querySelector('.contact-input[placeholder="your@email.com"]').value.trim();
  const message = document.querySelector('.contact-textarea').value.trim();
  const btn     = document.querySelector('.contact-submit');

  if (!name || !email || !message) {
    showSFX('ERROR!', window.innerWidth/2, window.innerHeight * 0.7);
    btn.textContent = '⚠ FILL ALL FIELDS';
    btn.style.background = '#1a1a1a';
    btn.style.color = '#ff4444';
    btn.style.border = '1px solid #ff4444';
    setTimeout(() => {
      btn.textContent = 'SEND TRANSMISSION';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.border = '';
    }, 2000);
    return;
  }

  btn.textContent = '... TRANSMITTING';
  btn.disabled = true;

  emailjs.send('service_ygclygf', 'template_jeqylq8', {
    from_name:  name,
    from_email: email,
    message:    message,
  })
  .then(() => {
    showSFX('SENT!', window.innerWidth/2, window.innerHeight * 0.7);
    btn.textContent = '✓ TRANSMISSION SENT';
    btn.style.background = '#1a1a1a';
    btn.style.color = 'var(--red)';
    btn.style.border = '1px solid var(--red)';
    // Clear fields
    document.querySelector('.contact-input[placeholder="Your name..."]').value = '';
    document.querySelector('.contact-input[placeholder="your@email.com"]').value = '';
    document.querySelector('.contact-textarea').value = '';
    setTimeout(() => {
      btn.textContent = 'SEND TRANSMISSION';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.border = '';
      btn.disabled = false;
    }, 3000);
  })
  .catch(() => {
    showSFX('ERROR!', window.innerWidth/2, window.innerHeight * 0.7);
    btn.textContent = '✗ TRANSMISSION FAILED';
    btn.style.background = '#1a1a1a';
    btn.style.color = '#ff4444';
    btn.style.border = '1px solid #ff4444';
    setTimeout(() => {
      btn.textContent = 'SEND TRANSMISSION';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.border = '';
      btn.disabled = false;
    }, 3000);
  });
}

/* ═══════════════════════════════════════════
   MINI GAME — SPACE DEFENDER
═══════════════════════════════════════════ */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let gameRunning = false, gameScore = 0, gameLives = 3;
let player, bullets, enemies, animId;

function resizeCanvas() {
  const wrap = document.querySelector('.game-canvas-wrap');
  canvas.width = wrap.offsetWidth;
  canvas.height = wrap.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function initGame() {
  gameScore = 0; gameLives = 3;
  player = { x: canvas.width / 2, y: canvas.height - 30, w: 24, h: 16, speed: 4 };
  bullets = []; enemies = [];
  updateHUD();
  spawnEnemies();
}

function spawnEnemies() {
  enemies = [];
  const cols = Math.floor(canvas.width / 60);
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < cols; c++) {
      enemies.push({ x: 30 + c * 60, y: 20 + r * 32, w: 18, h: 14, dir: 1, speed: 0.5 + gameScore * 0.002 });
    }
  }
}

function updateHUD() {
  document.getElementById('game-score').textContent = String(gameScore).padStart(3, '0');
  document.getElementById('game-lives').textContent = '♥'.repeat(gameLives) + '♡'.repeat(Math.max(0, 3 - gameLives));
}

function drawPlayer(x, y) {
  ctx.fillStyle = '#e8001c';
  ctx.beginPath();
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x + 10, y + 8);
  ctx.lineTo(x, y + 4);
  ctx.lineTo(x - 10, y + 8);
  ctx.closePath();
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#e8001c';
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawEnemy(x, y) {
  ctx.fillStyle = '#f0ece4';
  ctx.fillRect(x - 9, y - 7, 18, 14);
  ctx.fillStyle = '#080808';
  ctx.fillRect(x - 5, y - 4, 4, 4);
  ctx.fillRect(x + 1, y - 4, 4, 4);
}

let enemyBullets = [];
const keys = {};

function gameLoop() {
  if (!gameRunning) return;
  ctx.fillStyle = '#020202';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grid
  ctx.strokeStyle = 'rgba(232,0,28,0.04)';
  ctx.lineWidth = 0.5;
  for (let i = 0; i < canvas.width; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); }
  for (let j = 0; j < canvas.height; j += 40) { ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(canvas.width, j); ctx.stroke(); }

  // Player move
  if (keys['ArrowLeft'] || keys['a']) player.x = Math.max(15, player.x - player.speed);
  if (keys['ArrowRight'] || keys['d']) player.x = Math.min(canvas.width - 15, player.x + player.speed);
  drawPlayer(player.x, player.y);

  // Player bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].y -= 6;
    ctx.fillStyle = '#e8001c';
    ctx.shadowBlur = 6; ctx.shadowColor = '#e8001c';
    ctx.fillRect(bullets[i].x - 2, bullets[i].y, 4, 10);
    ctx.shadowBlur = 0;
    if (bullets[i].y < 0) { bullets.splice(i, 1); continue; }
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (bullets[i] && Math.abs(bullets[i].x - e.x) < 12 && Math.abs(bullets[i].y - e.y) < 10) {
        enemies.splice(j, 1);
        bullets.splice(i, 1);
        gameScore += 10;
        updateHUD();
        break;
      }
    }
  }

  // Enemies
  let hitEdge = false;
  for (const e of enemies) {
    e.x += e.dir * e.speed;
    if (e.x > canvas.width - 15 || e.x < 15) hitEdge = true;
    drawEnemy(e.x, e.y);
    if (e.y > canvas.height - 30) {
      gameLives--;
      updateHUD();
      enemies = [];
      if (gameLives <= 0) { endGame(); return; }
      spawnEnemies();
      break;
    }
  }
  if (hitEdge) {
    for (const e of enemies) { e.dir *= -1; e.y += 10; }
  }
  if (enemies.length === 0) spawnEnemies();

  // Enemy bullets
  if (Math.random() < 0.008 && enemies.length) {
    const e = enemies[Math.floor(Math.random() * enemies.length)];
    enemyBullets.push({ x: e.x, y: e.y });
  }
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    enemyBullets[i].y += 3;
    ctx.fillStyle = '#aaa';
    ctx.fillRect(enemyBullets[i].x - 1, enemyBullets[i].y, 2, 8);
    if (enemyBullets[i].y > canvas.height) { enemyBullets.splice(i, 1); continue; }
    if (Math.abs(enemyBullets[i].x - player.x) < 12 && Math.abs(enemyBullets[i].y - player.y) < 16) {
      gameLives--;
      updateHUD();
      enemyBullets.splice(i, 1);
      if (gameLives <= 0) { endGame(); return; }
    }
  }

  animId = requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
  keys[e.key] = true;
  if (e.key === ' ' && gameRunning) {
    e.preventDefault();
    bullets.push({ x: player.x, y: player.y - 12 });
  }
});
document.addEventListener('keyup', e => keys[e.key] = false);

// Touch controls
let touchStartX = 0;
canvas.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  if (gameRunning) bullets.push({ x: player.x, y: player.y - 12 });
});
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const dx = e.touches[0].clientX - touchStartX;
  touchStartX = e.touches[0].clientX;
  player.x = Math.max(15, Math.min(canvas.width - 15, player.x + dx));
}, { passive: false });

function endGame() {
  gameRunning = false;
  cancelAnimationFrame(animId);
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#e8001c';
  ctx.font = 'bold 28px "Bebas Neue"';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 10);
  ctx.fillStyle = '#f0ece4';
  ctx.font = '14px "Share Tech Mono"';
  ctx.fillText('SCORE: ' + gameScore, canvas.width / 2, canvas.height / 2 + 20);
  ctx.textAlign = 'left';
  document.getElementById('startGameBtn').textContent = '► PLAY AGAIN';
  document.getElementById('startGameBtn').classList.remove('active');
}

document.getElementById('startGameBtn').addEventListener('click', function() {
  if (gameRunning) return;
  initGame();
  enemyBullets = [];
  gameRunning = true;
  this.classList.add('active');
  this.textContent = '■ RUNNING';
  gameLoop();
  showSFX('START!', canvas.getBoundingClientRect().left + canvas.width/2, canvas.getBoundingClientRect().top + 30);
});

document.getElementById('resetGameBtn').addEventListener('click', function() {
  cancelAnimationFrame(animId);
  gameRunning = false;
  enemyBullets = [];
  initGame();
  ctx.fillStyle = '#020202';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPlayer(canvas.width / 2, canvas.height - 30);
  ctx.fillStyle = 'rgba(232,0,28,0.5)';
  ctx.font = '12px "Share Tech Mono"';
  ctx.textAlign = 'center';
  ctx.fillText('PRESS START', canvas.width / 2, canvas.height / 2);
  ctx.textAlign = 'left';
  document.getElementById('startGameBtn').classList.remove('active');
  document.getElementById('startGameBtn').textContent = '► START GAME';
});

// Idle state
initGame();
ctx.fillStyle = '#020202';
ctx.fillRect(0, 0, canvas.width, canvas.height);
drawPlayer(canvas.width / 2, canvas.height - 30);
ctx.fillStyle = 'rgba(232,0,28,0.5)';
ctx.font = '12px "Share Tech Mono"';
ctx.textAlign = 'center';
ctx.fillText('PRESS START', canvas.width / 2, canvas.height / 2);
ctx.textAlign = 'left';

/* ═══════════════════════════════════════════
   SCROLL SFX
═══════════════════════════════════════════ */
let lastScrollSfx = 0;
window.addEventListener('scroll', () => {
  const now = Date.now();
  if (now - lastScrollSfx > 4000 && window.scrollY > 200) {
    lastScrollSfx = now;
  }
});