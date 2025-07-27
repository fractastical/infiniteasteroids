// js/gamepad.js
// Lightweight Gamepad → keyboard shim so that controller users (including Raspberry Pi builds)
// can play without rewriting input logic.  We translate specific
// gamepad buttons into the expected `keys` flags used throughout the game.
//
// Mapping (Xbox-style indices):
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
    if (gp) {
      // Buttons array safety
      const buttons = gp.buttons;
      // Map A -> thrust (ArrowUp)
      window.keys['ArrowUp'] = !!buttons[0]?.pressed;
      // Map B -> secondary weapon (key 'e')
      window.keys['e'] = !!buttons[1]?.pressed;
      window.keys['E'] = window.keys['e']; // handle uppercase checks
      // Map RT (index 7) to primary fire (space bar) – many consoles treat RT as digital too
      window.keys[' '] = !!buttons[7]?.pressed;
    }
    requestAnimationFrame(pollGamepad);
  }

  window.addEventListener('gamepadconnected', (e) => {
    console.log('[Gamepad] connected:', e.gamepad.id);
    pollGamepad();
  });

  // If a pad is already connected (some browsers), start immediately
  if (navigator.getGamepads()[0]) pollGamepad();
})();
