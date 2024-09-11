let HARDCAPONASTEROIDEXPLOSIONS = 50;
let FRACTALLIGHTNINGDEPTH = 3;

const desiredFPS = 60;
let lastFrameTime = performance.now();
let frameCount = 0;
let fps = 60; // Assume a target of 60 FPS
const checkInterval = 1000; // Check FPS every 1000ms (1 second)
let fpsThrottleMode = false;

// Variables for FPS drop tracking
const fpsDropThreshold = desiredFPS * 0.75; // Consider it a drop if FPS is below 75% of desired
const maxDropsBeforeThrottle = 10; // Enter throttle mode after 10 drops
let totalFpsDrops = 0;
// let gameStartTime = performance.now();

function calculateAndAdjustFPS() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastFrameTime;
    frameCount++;

    if (deltaTime >= checkInterval) {
        fps = (frameCount * 1000) / deltaTime;
        frameCount = 0;
        lastFrameTime = currentTime;
        adjustEffectIntensity(fps);
    }
}

function adjustEffectIntensity(fps) {
    if (fps < fpsDropThreshold) {
        totalFpsDrops++;
        console.log("FPS drop detected. Total drops: " + totalFpsDrops);

        if (fps < desiredFPS * 0.5) {
            console.log("fps: " + fps + " (below 50% of target)");
            // reduceParticleCount(0.5);
            // lowerEffectResolution(0.5);
        } else {
            console.log("fps: " + fps + " (below 75% of target)");
            // reduceParticleCount(0.75);
            // lowerEffectResolution(0.75);
        }

        checkThrottleMode();
    } else {
        // restoreFullIntensity();
    }
}

function checkThrottleMode() {
    if (totalFpsDrops >= maxDropsBeforeThrottle && !fpsThrottleMode) {
        fpsThrottleMode = true;
        console.log("Entering FPS Throttle Mode");
        applyThrottleMode();
    } else if (totalFpsDrops < maxDropsBeforeThrottle && fpsThrottleMode) {
        fpsThrottleMode = false;
        console.log("Exiting FPS Throttle Mode");
        removeThrottleMode();
    }
}

function applyThrottleMode() {
    // Implement more aggressive performance optimizations
    HARDCAPONASTEROIDEXPLOSIONS = 25; // Reduce by 50%
    FRACTALLIGHTNINGDEPTH = 2; // Reduce by 1 level
    // Add other throttling measures as needed
}

function removeThrottleMode() {
    // Restore normal settings
    HARDCAPONASTEROIDEXPLOSIONS = 50;
    FRACTALLIGHTNINGDEPTH = 3;
    // Revert other throttling measures
}

// Reset function to be called when starting a new game or level
function resetPerformanceMonitoring() {
    totalFpsDrops = 0;
    fpsThrottleMode = false;
    gameStartTime = performance.now();
    removeThrottleMode();
}


// Function to get total FPS drops (formerly halfFPSCount)
function getTotalFpsDrops() {
    return totalFpsDrops;
}