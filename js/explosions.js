// explosions.js – centralized explosion logic for Infinite Asteroids
// This file defines and exports createExplosion, updateExplosions, and drawExplosions.
// It must be loaded after the canvas context `ctx` is created in index.html but
// before any scripts that call createExplosion (asteroids, weapons, etc.).
//
// The code is self-contained and does NOT override an existing implementation –
// if another script already defined window.createExplosion we bail out to avoid
// duplicate declarations.

(() => {
  // If another copy is already present, do nothing.
  if (typeof window.createExplosion === 'function' &&
      typeof window.updateExplosions === 'function' &&
      typeof window.drawExplosions === 'function') {
    console.debug('[explosions.js] Using existing explosion implementation');
    return;
  }

  // ------------------------------------------------------------------
  // Globals & Constants
  // ------------------------------------------------------------------
  window.explosions = window.explosions || [];
window.damageTexts = window.damageTexts || [];

  // Cap explosions to avoid memory bloat; fallback to old constant if present.
  const MAX_EXPLOSIONS = typeof HARDCAPONASTEROIDEXPLOSIONS !== 'undefined'
    ? HARDCAPONASTEROIDEXPLOSIONS
    : 200;

  // Toggle for console logging – enable in DevTools:  window.DEBUG_EXPLOSIONS = true
  window.DEBUG_EXPLOSIONS = window.DEBUG_EXPLOSIONS || false;

  // ------------------------------------------------------------------
  // Helper: random colors
  // ------------------------------------------------------------------
  const PURPLES = ['#B388FF', '#9C6EFF', '#7C4DFF', '#651FFF'];
  const BLUES   = ['#82B1FF', '#448AFF', '#2979FF', '#2962FF'];
  const ORANGES = ['#FFAB91', '#FF8A65', '#FF7043', '#FF5722'];

  // ------------------------------------------------------------------
  // Explosion type configurations
  // ------------------------------------------------------------------
  const EXPLOSION_TYPES = {
    normal: {
      colors: [...PURPLES, ...BLUES, ...ORANGES],
      growth: 1,
      alphaDecay: [0.01, 0.03],
    },
    plasma: {
      colors: ['#FF00FF', '#FF66FF', '#CC00CC'],
      growth: 1.5,
      alphaDecay: [0.015, 0.035],
    },
    ice: {
      colors: ['#A1D8FF', '#6EC9FF', '#3AB3FF'],
      growth: 0.8,
      alphaDecay: [0.008, 0.02],
    },
    acid: {
      colors: ['#AAFF00', '#CCFF33', '#99FF00'],
      growth: 1.2,
      alphaDecay: [0.012, 0.025],
    },
    electric: {
      colors: ['#FFFF66', '#FFFF00', '#FFDD00'],
      growth: 1.3,
      alphaDecay: [0.015, 0.03],
    },
  };

  // ------------------------------------------------------------------
  // Damage numbers (retro floating text)
  // ------------------------------------------------------------------
  const DAMAGE_FLOAT_SPEED = -0.3;
  const DAMAGE_FADE_SPEED = 0.01;

  function createDamageText(x, y, damage) {
    window.damageTexts.push({
      x,
      y,
      text: damage.toString(),
      alpha: 1,
      dy: DAMAGE_FLOAT_SPEED,
    });
  }

  function updateDamageTexts() {
    for (let i = window.damageTexts.length - 1; i >= 0; i--) {
      const t = window.damageTexts[i];
      t.y += t.dy;
      t.alpha -= DAMAGE_FADE_SPEED;
      if (t.alpha <= 0) {
        window.damageTexts.splice(i, 1);
      }
    }
  }

  function drawDamageTexts() {
    if (typeof ctx === 'undefined') return;
    ctx.save();
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    for (const t of window.damageTexts) {
      ctx.globalAlpha = t.alpha;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(t.text, t.x, t.y);
    }
    ctx.restore();
  }

  function randOf(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function getRandomColorFor(type) {
    const cfg = EXPLOSION_TYPES[type] || EXPLOSION_TYPES.normal;
    return randOf(cfg.colors);
  }

  // ------------------------------------------------------------------
  // API
  // ------------------------------------------------------------------
  // type can be 'normal', 'plasma', 'ice', 'acid', 'electric', etc.
  function createExplosion(x, y, hitpoints = 1, sizeMultiplier = 1, type = 'normal') {
    createDamageText(x, y, hitpoints);
    if (window.explosions.length >= MAX_EXPLOSIONS) return;

    const baseSize = 8 * sizeMultiplier;
    const sizeReduction = 1.5;
    const size = Math.max(5, baseSize - hitpoints * sizeReduction);
    const cfg = EXPLOSION_TYPES[type] || EXPLOSION_TYPES.normal;
    const [decayMin, decayMax] = cfg.alphaDecay;
    const alphaDecay = decayMin + Math.random() * (decayMax - decayMin);

    const explosion = {
      x,
      y,
      size,
      growth: cfg.growth,
      alpha: 1,
      alphaDecay,
      color: getRandomColorFor(type),
    };

    window.explosions.push(explosion);
    if (window.DEBUG_EXPLOSIONS) console.log('[Explosion] create', explosion);
  }

  function updateExplosions() {
    updateDamageTexts();
    for (let i = window.explosions.length - 1; i >= 0; i--) {
      const e = window.explosions[i];
      e.size += (e.growth || 1);
      e.alpha -= e.alphaDecay;
      if (e.alpha <= 0) {
        window.explosions.splice(i, 1);
        if (window.DEBUG_EXPLOSIONS) console.log('[Explosion] remove', e);
      }
    }
  }

  function drawExplosions() {
    drawDamageTexts();
    if (typeof ctx === 'undefined') return; // ctx not ready yet
    if (window.DEBUG_EXPLOSIONS) console.log('[Explosion] draw', window.explosions.length);
    for (let i = 0; i < window.explosions.length; i++) {
      const e = window.explosions[i];
      ctx.save();
      ctx.globalAlpha = e.alpha;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = e.color;
      ctx.fill();
      ctx.restore();
    }
  }

  // Expose globally so existing code continues to work.
  window.createExplosion = createExplosion;
  window.updateExplosions = updateExplosions;
  window.drawExplosions = drawExplosions;

  console.debug('[explosions.js] Centralized explosion logic initialized');
})();
