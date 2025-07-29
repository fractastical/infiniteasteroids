// js/gamepad.js
// Clean single implementation – maps gamepad to window.keys and shows overlay.
(function () {
  if (!('getGamepads' in navigator)) return;

  window.gamepadKeyMap = {
    0: 'ArrowUp',
    1: 'e',
    7: ' '
  };

  if (!window.keys) window.keys = {};

  let overlay;
  const ensureOverlay = () => {
    if (overlay) return;
    overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed', left: '6px', bottom: '6px', background: 'rgba(0,0,0,.6)',
      color: '#0f0', font: '12px monospace', padding: '4px 6px', zIndex: 9999,
      whiteSpace: 'pre', pointerEvents: 'none'
    });
    document.body.appendChild(overlay);
  };

  const loop = () => {
    const gp = navigator.getGamepads()[0];
    ensureOverlay();
    if (gp) {
      for (const [idx, key] of Object.entries(window.gamepadKeyMap)) {
        const pressed = !!gp.buttons[+idx]?.pressed;
        window.keys[key] = pressed;
        if (key.length === 1) window.keys[key.toUpperCase()] = pressed;
      }
      overlay.textContent = gp.id + '\n' + Object.entries(window.gamepadKeyMap)
        .map(([i, k]) => `${i}:${window.keys[k] ? '■' : '□'}→${k}`).join(' ');
    } else overlay.textContent = 'Gamepad: not connected';
    requestAnimationFrame(loop);
  };

  window.addEventListener('gamepadconnected', loop);
  if (navigator.getGamepads()[0]) loop();
})();
