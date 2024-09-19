
let bonuslevelUpXPMultiplier = 1;

const TAPER_WAVE = 85;

const MULTI_WAVE = 65;

const MULTI_WAVE_MULTIPLIER = 1.2;

let asteroidDifficultySpeedMultiplier = 1;
let xpToNextLevel = 300;
let meteorBooster = 0;
let modeScoreMultiplier = 1;

let chanceForSmallAsteroid = 3;
let chanceForVerySmallAsteroid = 1;
let chanceForHardenedAsteroid = 5;
let chanceForVeryHardenedAsteroid = 2; // Example chance for very hardened asteroid
let chanceForMegaHardenedAsteroid = 1; // Example chance for mega hardened asteroid

let asteroidSpeedMultiplier = 1;


const GameModes = {
    EASY: 'easy',
    NORMAL: 'normal',
    HARD: 'hard',
    HERO: 'heroic',
    METEORSHOWEREASY: 'meteorshowereasy',
    METEORSHOWERNORMAL: 'meteorshowernormal',
    METEORSHOWERHARD: 'meteorshowerhard',
    METEORSHOWERHERO: 'meteorshowerhero',
    PLANETEASY: 'planeteasy',
    PLANETNORMAL: 'planetnormal',
    PLANETHARD: 'planethard',
    PLANETHERO: 'planethero',
    ENDLESS_SLOW: 'endless_slow',
    COOP: 'coop'

};

const gameModes = [
    { id: GameModes.EASY, name: "Deep Space Easy" },
    { id: GameModes.NORMAL, name: "Deep Space Normal" },
    { id: GameModes.HARD, name: "Deep Space Hard" },
    { id: GameModes.HERO, name: "Deep Space Hero" },
    { id: GameModes.METEORSHOWEREASY, name: "Meteor Shower Easy" },
    { id: GameModes.METEORSHOWERNORMAL, name: "Meteor Shower Normal" },
    { id: GameModes.METEORSHOWERHARD, name: "Meteor Shower Hard" },
    { id: GameModes.METEORSHOWERHERO, name: "Meteor Shower Hero" },
    { id: GameModes.PLANETEASY, name: "Planet Easy" },
    { id: GameModes.PLANETNORMAL, name: "Planet Normal" },
    { id: GameModes.PLANETHARD, name: "Planet Hard" },
    { id: GameModes.PLANETHERO, name: "Planet Hero" },
    { id: GameModes.ENDLESS_SLOW, name: "Endless Slow" }
];


const ALIEN_SPAWN_WAVE_INTERVAL = 9;
const HUNTING_ALIEN_SPAWN_WAVE_INTERVAL = 7;
const SUPER_BOSS_SPAWN_WAVE = 50;
const MEGA_BOSS_SPAWN_WAVE = 75;
const OCTO_BOSS_SPAWN_WAVE = 100;

// Alien types and properties
// const SwarmingAlienTypes = {
//     TOP: { hitpoints: 1, speed: 0.5 },
//     BOTTOM: { hitpoints: 1, speed: 0.3 },
//     HORIZONTAL: { hitpoints: 2, speed: 0.4 },
//     HUNTING: { hitpoints: 1, speed: 0.15 },
//     LITTLE: { hitpoints: 15, speed: 0.5 },
//     BLINKING: { hitpoints: 2, speed: 0.3 }
// };

// Boss stats
const SUPER_BOSS_HP = 5000;
const MEGA_BOSS_HP = 10000;
const OCTO_BOSS_HP = 20000;

// Alien laser properties
// const alienLaserSpeed = 2.2;
// const alienLaserSize = 4;


// Function to determine number of aliens to spawn
function getAliensToSpawn(wave) {
    let booster = 0;
    if (currentMode == GameModes.NORMAL) booster++;
    else if (currentMode == GameModes.HARD) booster += 2;
    else if (currentMode == GameModes.HERO) booster += 3;

    if (wave > 50) return (parseInt(wave / 10)) + booster;
    if (wave == 50) return 4 + booster;
    if (wave == 45) return 4 + booster;
    if (wave == 40) return 3 + booster;
    if (wave == 35) return 3 + booster;
    if (wave == 30) return 1 + booster;
    if (wave == 25) return 2 + booster;
    if (wave == 15) return 1 + booster;
    if (wave == 10) return booster;
    if (wave == 5) return booster;
    return 0;
}

// Function to get rare asteroid chance
function getRareAsteroidChance(wave) {
    if (wave > 70) return 0.005;
    if (wave > 28) return 0.01;
    if (wave > 18) return 0.02;
    if (wave > 9) return 0.05;
    return 0.07;
}

function xpTaperingFactor() {

    return Math.max(0.3, 1 - (wave - 1) * 0.0015);

}


function applyMultiWaveBoost(wave) {

    let hpBooster = 0;
    if (wave > MULTI_WAVE) {
        let multiplier = wave - MULTI_WAVE;
        hpBooster = multiplier * MULTI_WAVE_MULTIPLIER;
    }
    return hpBooster;

}

function multiplierCalculator(mode) {

    switch (mode) {
        case GameModes.EASY:
            asteroidDifficultySpeedMultiplier = 0.7;
            levelUpXPMultiplier = 1.07;
            invincibilityDuration = 220;
            modeScoreMultiplier = 1;
            break;
        case GameModes.NORMAL:
            asteroidDifficultySpeedMultiplier = 0.9;
            levelUpXPMultiplier = 1.13;
            invincibilityDuration = 180;
            modeScoreMultiplier = 4;
            break;
        case GameModes.HARD:
            asteroidDifficultySpeedMultiplier = 1.1;
            levelUpXPMultiplier = 1.26;
            invincibilityDuration = 140;
            modeScoreMultiplier = 6;
            break;
        case GameModes.HERO:
            asteroidDifficultySpeedMultiplier = 1.3;
            levelUpXPMultiplier = 1.35;
            invincibilityDuration = 130;
            modeScoreMultiplier = 8;
            break;
        case GameModes.METEORSHOWEREASY:
            asteroidDifficultySpeedMultiplier = 1.6;
            levelUpXPMultiplier = 1.1;
            modeScoreMultiplier = 1.2;
            meteorMode = true;
            break;
        case GameModes.METEORSHOWERNORMAL:
            asteroidDifficultySpeedMultiplier = 1.8;
            levelUpXPMultiplier = 1.2;
            modeScoreMultiplier = 4.2;
            invincibilityDuration = 150;

            meteorBooster = 7;
            meteorMode = true;
            break;
        case GameModes.METEORSHOWERHARD:
            asteroidDifficultySpeedMultiplier = 2;
            levelUpXPMultiplier = 1.3;
            meteorBooster = 14;
            modeScoreMultiplier = 6.2;
            invincibilityDuration = 140;
            meteorMode = true;
            break;
        case GameModes.METEORSHOWERHERO:
            asteroidDifficultySpeedMultiplier = 2.2;
            levelUpXPMultiplier = 1.4;
            meteorBooster = 21;
            modeScoreMultiplier = 8.2;
            meteorMode = true;
            invincibilityDuration = 120;
            break;
        case GameModes.PLANETEASY:
            asteroidDifficultySpeedMultiplier = 1.3;
            levelUpXPMultiplier = 1.1;
            gravityStrength = 60;
            meteorBooster = 7;
            modeScoreMultiplier = 1.6;
            planetMode = true;
            break;
        case GameModes.PLANETNORMAL:
            asteroidDifficultySpeedMultiplier = 1.5;
            levelUpXPMultiplier = 1.2;
            meteorBooster = 10;
            gravityStrength = 80;
            modeScoreMultiplier = 3.6;
            planetMode = true;

            break;
        case GameModes.PLANETHARD:
            asteroidDifficultySpeedMultiplier = 1.7;
            levelUpXPMultiplier = 1.3;
            meteorBooster = 15;
            gravityStrength = 120;
            planetMode = true;
            invincibilityDuration = 140;
            modeScoreMultiplier = 5.4;
            break;
        case GameModes.PLANETHERO:
            asteroidDifficultySpeedMultiplier = 1.9;
            levelUpXPMultiplier = 1.4;
            meteorBooster = 25;
            gravityStrength = 140;
            planetMode = true;
            invincibilityDuration = 130;

            modeScoreMultiplier = 7.2;
            break;
        case GameModes.ENDLESS_SLOW:
            spawnCooldown = 10;
            asteroidDifficultySpeedMultiplier = 0.2; // Very slow asteroids
            levelUpXPMultiplier = 1.1;
            modeScoreMultiplier = 2;
            break;



    }


}

function levelXPCalculator() {

    return Math.floor(xpToNextLevel * levelUpXPMultiplier * bonuslevelUpXPMultiplier);

}

function bonusLevelUpCalculator() {

    if (wave > 75) {
        bonuslevelUpXPMultiplier = 1.5;
    } else if (wave > 50) {
        bonuslevelUpXPMultiplier = 1.2;
    }

}

function getRareAsteroidChance(wave) {

    let randomChance = 0.07;
    if (wave > 9)
        randomChance = 0.05;
    else if (wave > 18)
        randomChance = 0.02;
    else if (wave > 28)
        randomChance = 0.01;
    else if (wave > 70)
        randomChance = 0.005;

    return randomChance;

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
