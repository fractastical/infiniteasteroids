// gamepad.js – Gamepad→Keyboard shim for Infinite Asteroids
// Maps the first connected gamepad to the existing `keys` object so the rest
// of the game can stay unchanged.
// Buttons / axes mapping follows the standard X-Input (Xbox) layout:
//   Button 0 (A)         → Space  (primary fire)
//   Button 1 (B)         → Control (secondary / bomb)
//   Button 7 (RT)        → Space  (rapid fire)
//   Axes [0] (LX)        → left / right
//   Axes [1] (LY)        → up / down
// Feel free to tweak thresholds or add more bindings.

(function () {
  const DEADZONE = 0.3;
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

  window.addEventListener("gamepadconnected", () => {
    console.log("Gamepad connected");
    pollGamepad();
  });

  // Start immediately if a gamepad is already connected
  if (navigator.getGamepads && navigator.getGamepads()[0]) {
    pollGamepad();
  }
})();
