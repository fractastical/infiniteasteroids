// js/death-effects.js
// Visual effects triggered when the player dies.
// Current effect: cascading replicas of the ship triangle expanding/fading for 60 seconds.
// Can be extended with background warp etc.
(function (global) {
  const DURATION_MS = 60_000; // 1 minute
  const SPAWN_INTERVAL_MS = 120;

  let overlayCanvas = null;
  let ctx = null;
  let clones = [];
  let lastSpawn = 0;
  let startTime = 0;

  function createOverlayCanvas() {
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return null;
    const c = document.createElement('canvas');
    c.width = gameCanvas.width;
    c.height = gameCanvas.height;
    c.style.position = 'absolute';
    c.style.left = gameCanvas.offsetLeft + 'px';
    c.style.top = gameCanvas.offsetTop + 'px';
    c.style.pointerEvents = 'none';
    gameCanvas.parentElement.appendChild(c);
    return c;
  }

  function spawnClone(x, y) {
    clones.push({
      x,
      y,
      scale: 1,
      alpha: 1,
    });
  }

  function drawClone(c) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.scale(c.scale, c.scale);
    ctx.globalAlpha = c.alpha;
    // Simple triangle ship (upward pointing).
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(7, 10);
    ctx.lineTo(-7, 10);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(0,255,255,0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  function loop(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    if (elapsed > DURATION_MS) {
      cleanup();
      return;
    }

    if (ts - lastSpawn > SPAWN_INTERVAL_MS) {
      lastSpawn = ts;
      // Spawn at random previous clones or center?
      // We'll just replicate at initial spawn center.
      spawnClone(loop.spawnX, loop.spawnY);
    }

    // Update clones
    clones.forEach(c => {
      c.scale += 0.01;
      c.alpha -= 0.01;
    });
    clones = clones.filter(c => c.alpha > 0);

    // Clear
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
    clones.forEach(drawClone);

    requestAnimationFrame(loop);
  }

  function cleanup() {
    if (overlayCanvas && overlayCanvas.parentElement) {
      overlayCanvas.parentElement.removeChild(overlayCanvas);
    }
    overlayCanvas = null;
    clones = [];
  }

  function play(x, y) {
    if (overlayCanvas) cleanup();
    overlayCanvas = createOverlayCanvas();
    if (!overlayCanvas) return;
    ctx = overlayCanvas.getContext('2d');
    loop.spawnX = x;
    loop.spawnY = y;
    startTime = 0;
    lastSpawn = 0;
    clones = [];
    requestAnimationFrame(loop);
  }

  global.DeathEffects = { play };
})(window);
