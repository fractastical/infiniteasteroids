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

  function randOf(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function randomExplosionColor() {
    const r = Math.random();
    if (r < 0.33) return randOf(PURPLES);
    if (r < 0.66) return randOf(BLUES);
    return randOf(ORANGES);
  }

  // ------------------------------------------------------------------
  // API
  // ------------------------------------------------------------------
  function createExplosion(x, y, hitpoints = 1, sizeMultiplier = 1) {
    createDamageText(x, y, hitpoints);
    if (window.explosions.length >= MAX_EXPLOSIONS) return;

    const baseSize = 8 * sizeMultiplier;
    const sizeReduction = 1.5;
    const size = Math.max(5, baseSize - hitpoints * sizeReduction);
    const alphaDecay = 0.01 + Math.random() * 0.02; // 0.01–0.03 per frame

    const explosion = {
      x,
      y,
      size,
      alpha: 1,
      alphaDecay,
      color: randomExplosionColor(),
    };

    window.explosions.push(explosion);
    if (window.DEBUG_EXPLOSIONS) console.log('[Explosion] create', explosion);
  }

  function updateExplosions() {
    updateDamageTexts();
    for (let i = window.explosions.length - 1; i >= 0; i--) {
      const e = window.explosions[i];
      e.size += 1;
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
