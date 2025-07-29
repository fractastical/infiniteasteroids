// js/gamepad.js
// Gamepad → keyboard shim with live overlay to aid mapping/configuration.
//
// Exposes `window.gamepadKeyMap` so you can tweak button → key mapping at
// runtime via browser dev-tools if a new joystick layout needs support.
// The small green overlay in the corner shows which gamepad buttons map to
// which keyboard keys and their current pressed state.

(function () {
  if (!('getGamepads' in navigator)) {
    console.warn('[Gamepad] Browser Gamepad API not supported');
    return;
  }

  // Default mapping – override this from the console if desired
  window.gamepadKeyMap = window.gamepadKeyMap || {
    0: 'ArrowUp',   // A / Cross → Thrust
    1: 'e',         // B / Circle → Secondary weapon
    7: ' ',         // RT / R2    → Primary fire (space)
  };

  // Ensure shared input object
  if (!window.keys) window.keys = {};

  // Debug overlay element
  let overlay;
  function ensureOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'gamepad-debug';
    Object.assign(overlay.style, {
      position: 'fixed', left: '6px', bottom: '6px', padding: '4px 6px',
      background: 'rgba(0,0,0,0.65)', color: '#0f0', font: '12px monospace',
      zIndex: 9999, pointerEvents: 'none', whiteSpace: 'pre'
    });
    overlay.textContent = 'Gamepad: —';
    document.body.appendChild(overlay);
  }

  function poll() {
    const gp = navigator.getGamepads()[0];
    ensureOverlay();
    if (gp) {
      const btns = gp.buttons;
      for (const [index, keyName] of Object.entries(window.gamepadKeyMap)) {
        const pressed = !!btns[Number(index)]?.pressed;
        window.keys[keyName] = pressed;
        if (keyName.length === 1) window.keys[keyName.toUpperCase()] = pressed;
      }

      const info = Object.entries(window.gamepadKeyMap)
        .map(([i, key]) => `${i}:${window.keys[key] ? '■' : '□'}→${key}`)
        .join('  ');
      overlay.textContent = gp.id + '\n' + info;
    } else {
      overlay.textContent = 'Gamepad: not connected';
    }
    requestAnimationFrame(poll);
  }

  window.addEventListener('gamepadconnected', (e) => {
    console.log('[Gamepad] connected:', e.gamepad.id);
    poll();
  });

  // Start immediately if already connected
  if (navigator.getGamepads()[0]) poll();
})();
// can play without rewriting input logic.  We translate specific
// gamepad buttons into the expected `keys` flags used throughout the game.
//
// Mapping (Xbox-style indices):
// We'll expose this mapping so that it can be adjusted at runtime if needed.
window.gamepadKeyMap = {
  0: 'ArrowUp',   // A / Cross – thrust
  1: 'e',         // B / Circle – secondary weapon
  7: ' '          // RT / R2  – primary fire
};
//   • Button 0 (A) → "ArrowUp"  (thrust)
//   • Button 1 (B) → "e"        (secondary weapon)
//   • Button 7 (RT) → primary fire held (maps to " ")
//   • Left stick X/Y → ship rotation / movement already handled by mouse/keys,
//     so we leave that for a later pass.
//
// The script relies on the browser Gamepad API and runs a requestAnimationFrame
// loop to keep `keys` updated each frame.
(function () {
  if (!('getGamepads' in navigator)) {
    console.warn('[Gamepad] Browser Gamepad API not supported');
    return;
  }

  // Fall-back in case the main game hasn’t defined the global yet
  if (!window.keys) window.keys = {};

  function pollGamepad() {
    const gp = navigator.getGamepads()[0]; // single-player: first pad only
    ensureDebugOverlay();
    if (gp) {
      // Buttons array safety
      const buttons = gp.buttons;
      // Apply mapping dynamically based on current map
      for (const [index, keyName] of Object.entries(window.gamepadKeyMap)) {
        const idx = Number(index);
        const pressed = !!buttons[idx]?.pressed;
        window.keys[keyName] = pressed;
        // For convenience keep uppercase twin if single-letter
        if (keyName.length === 1) window.keys[keyName.toUpperCase()] = pressed;
      }
      // Update overlay text
      const pressedInfo = Object.entries(window.gamepadKeyMap)
        .map(([i, key]) => `${i}:${window.keys[key] ? '■' : '□'}→${key}`)
        .join('  ');
      debugOverlay.textContent = gp.id + '\n' + pressedInfo;
    }
    requestAnimationFrame(pollGamepad);
  }

  window.addEventListener('gamepadconnected', (e) => {
    console.log('[Gamepad] connected:', e.gamepad.id);
    ensureDebugOverlay();
    pollGamepad();
  });

  // If a pad is already connected (some browsers), start immediately
  if (navigator.getGamepads()[0]) pollGamepad();


// of the game can stay unchanged.
// Buttons / axes mapping follows the standard X-Input (Xbox) layout:
//   Button 0 (A)         → Space  (primary fire)
//   Button 1 (B)         → Control (secondary / bomb)
//   Button 7 (RT)        → Space  (rapid fire)
//   Axes [0] (LX)        → left / right
//   Axes [1] (LY)        → up / down
// Feel free to tweak thresholds or add more bindings.


  const KEY_MAP = {
    left: "ArrowLeft",
    right: "ArrowRight",
    up: "ArrowUp",
    down: "ArrowDown",
    primary: " ", // Spacebar
    secondary: "Control", // Left Ctrl
  };

  // Ensure global keys object exists
  if (typeof window.keys === "undefined") {
    window.keys = {};
  }

  function applyButton(isDown, key) {
    if (key) window.keys[key] = isDown;
  }

  function pollGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = gamepads[0];
    if (gp) {
      // Axes
      const horiz = gp.axes[0] || 0;
      const vert = gp.axes[1] || 0;
      applyButton(horiz < -DEADZONE, KEY_MAP.left);
      applyButton(horiz > DEADZONE, KEY_MAP.right);
      applyButton(vert < -DEADZONE, KEY_MAP.up);
      applyButton(vert > DEADZONE, KEY_MAP.down);

      // Buttons (primary fire)
      const primaryPressed = gp.buttons[0]?.pressed || gp.buttons[7]?.pressed;
      const secondaryPressed = gp.buttons[1]?.pressed || false;
      applyButton(primaryPressed, KEY_MAP.primary);
      applyButton(secondaryPressed, KEY_MAP.secondary);
    }

    // Keep polling
    window.requestAnimationFrame(pollGamepad);
  }

  , () => {
    console.log("Gamepad connected");
    pollGamepad();
  });

  // Start immediately if a gamepad is already connected
  if (navigator.getGamepads && navigator.getGamepads()[0]) {
    pollGamepad();
  }

})();
