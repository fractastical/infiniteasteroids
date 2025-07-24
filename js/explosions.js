// explosions.js - centralized explosion logic for Infinite Asteroids
// This should be loaded AFTER the global canvas context `ctx` is defined.
// The file defines the global `explosions` array and helper functions used by the game loop.
// Other modules (asteroids.js, game.js, etc.) should now rely on these global functions.

// If another script already created the array (legacy code) we reuse it; otherwise define it.
window.explosions = window.explosions || [];
// Debug flag – set to true to log explosion lifecycle
window.DEBUG_EXPLOSIONS = window.DEBUG_EXPLOSIONS || false;

// Default cap – falls back to previous global constant if present
const MAX_EXPLOSIONS = typeof HARDCAPONASTEROIDEXPLOSIONS !== 'undefined' ?
  HARDCAPONASTEROIDEXPLOSIONS : 150;

// ----- Color helpers -------------------------------------------------------
function getRandomPurpleShade() {
  const purpleShades = ['#B388FF', '#9C6EFF', '#7C4DFF', '#651FFF'];
  return purpleShades[Math.floor(Math.random() * purpleShades.length)];
}

function getRandomBlueShade() {
  const blueShades = ['#82B1FF', '#448AFF', '#2979FF', '#2962FF'];
  return blueShades[Math.floor(Math.random() * blueShades.length)];
}

function getRandomOrangeShade() {
  const orangeShades = ['#FFAB91', '#FF8A65', '#FF7043', '#FF5722'];
  return orangeShades[Math.floor(Math.random() * orangeShades.length)];
}

function getRandomExplosionColor() {
  // Weighted random choice between purple, blue, and orange shades
  const rand = Math.random();
  if (rand < 0.33) return getRandomPurpleShade();
  if (rand < 0.66) return getRandomBlueShade();
  return getRandomOrangeShade();
}

// ---------------------------------------------------------------------------
// Explosion API
// ---------------------------------------------------------------------------

/**
 * Creates a new explosion at the given coordinates.
 * @param {number} x - X coordinate (canvas space)
 * @param {number} y - Y coordinate (canvas space)
 * @param {number} [hitpoints=1] - Hitpoints of the source object; affects size.
 * @param {number} [sizeMultiplier=1] - Further size scaling.
 */
function createExplosion(x, y, hitpoints = 1, sizeMultiplier = 1) {
  const baseSize = 8 * sizeMultiplier;
  const sizeReductionFactor = 1.5;
  const randomSize = Math.max(5, baseSize - hitpoints * sizeReductionFactor);

  const randomAlphaDecay = 0.01 + Math.random() * 0.02; // 0.01 – 0.03
  const randomColor = getRandomExplosionColor();

  const explosion = {
    x,
    y,
    size: randomSize,
    alpha: 1,
    alphaDecay: randomAlphaDecay,
    color: randomColor,
  };

  if (window.explosions.length < MAX_EXPLOSIONS) {
    if (window.DEBUG_EXPLOSIONS) console.log('[Explosion] create', {x, y, size: randomSize});
    window.explosions.push(explosion);
  }
}

/**
 * Updates existing explosions. Should be called each game tick.
 */
function updateExplosions() {
  for (let i = 0; i < window.explosions.length; i++) {
    const e = window.explosions[i];
    e.size += 1;
    e.alpha -= e.alphaDecay;
    if (e.alpha <= 0) {
      if (window.DEBUG_EXPLOSIONS) console.log('[Explosion] remove', e);
      window.explosions.splice(i, 1);
      i--;
    }
  }
}

/**
 * Renders all active explosions to the canvas context `ctx`.
 * Assumes `ctx` is a 2D rendering context already available globally.
 */
function drawExplosions() {
  if (window.DEBUG_EXPLOSIONS) console.log('[Explosion] draw count', window.explosions.length);
  if (typeof ctx === 'undefined') return; // safeguard
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

// Expose API globally so existing code keeps working.
window.createExplosion = createExplosion;
window.updateExplosions = updateExplosions;
window.drawExplosions = drawExplosions;

// Support CommonJS environments (e.g., unit testing with Node)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    createExplosion,
    updateExplosions,
    drawExplosions,
    explosions: window.explosions,
  };
}
