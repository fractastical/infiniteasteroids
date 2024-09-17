const TAPER_WAVE = 85;

const MULTI_WAVE = 65;

function xpTaperingFactor() {

    return Math.max(0.3, 1 - (wave - 1) * 0.0015);

}


function calculateAsteroidSpeed(wave) {
    const baseSpeed = 2;
    const growthRate = 1.02;

    if (wave <= TAPER_WAVE) {
        return baseSpeed * Math.pow(growthRate, wave - 1) * asteroidDifficultySpeedMultiplier;
    } else {
        const maxExponentialSpeed = baseSpeed * Math.pow(growthRate, TAPER_WAVE - 1);
        const linearIncrease = (wave - TAPER_WAVE) * 0.05; // Adjust 0.05 for desired linear growth
        return (maxExponentialSpeed + linearIncrease) * asteroidDifficultySpeedMultiplier;
    }
}

function calculateAsteroidDx(wave, dx) {
    return dx * (Math.random() * 2 - 1) * asteroidSpeedMultiplier * calculateAsteroidSpeed(wave) / 2;
}

function calculateAsteroidDy(wave, dy) {
    return dy * (Math.random() * 2 - 1) * asteroidSpeedMultiplier * calculateAsteroidSpeed(wave) / 2;
}

function calculateAsteroidHitpoints(wave, baseHitpoints) {
    const normalGrowthRate = 1.02; // Slight increase for waves before TAPER_WAVE
    const exponentialGrowthRate = 1.015; // Stronger increase for waves after TAPER_WAVE

    if (wave <= TAPER_WAVE) {
        return baseHitpoints;
        // return baseHitpoints * Math.pow(normalGrowthRate, wave - 1));
    } else {
        const baseExponentialHitpoints = baseHitpoints * Math.pow(normalGrowthRate, TAPER_WAVE - 1);
        return Math.round(baseExponentialHitpoints * Math.pow(exponentialGrowthRate, wave - TAPER_WAVE));
    }
}
