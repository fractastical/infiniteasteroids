let HARDCAPONASTEROIDEXPLOSIONS = 50;
let FRACTALLIGHTNINGDEPTH = 3;

const desiredFPS = 60;
let lastFrameTime = performance.now();
let frameCount = 0;
let halfFPSCount = 0;
let fps = 60; // Assume a target of 60 FPS
const checkInterval = 1000; // Check FPS every 1000ms (1 second)

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
    if (fps < desiredFPS * 0.5) { // If FPS drops below 50% of the target FPS
        // Reduce the intensity of effects significantly
        console.log("fps:" + fps);
        halfFPSCount++;
        // reduceParticleCount(0.5);
        // lowerEffectResolution(0.5);
    } else if (fps < desiredFPS * 0.75) { // If FPS drops below 75% of the target FPS
        // Reduce the intensity of effects moderately
        console.log("fps:" + fps);
        // reduceParticleCount(0.75);
        // lowerEffectResolution(0.75);
    } else {
        // Use full intensity if FPS is sufficient
        // restoreFullIntensity();
    }
}

