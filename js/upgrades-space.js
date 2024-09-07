const floatingUpgrades = [
    {
        name: 'Space Pizza',
        icon: 'icons/upgrades/pizza.png',
        description: 'Find the Space Pizza.',
        achievedKey: 'space_pizza',
        mode: ['ENDLESS_SLOW', 'PLANET'],
    },
    {
        name: 'Space Pickle',
        icon: 'icons/upgrades/pickle.png',
        description: 'Find the deep space pickle.',
        achievedKey: 'space_pickle',
        mode: ['DEEP_SPACE', 'METEOR'],
    },
    {
        name: 'Space Pixie',
        icon: 'icons/upgrades/pixie.png',
        description: 'Find the pixie.',
        achievedKey: 'space_pixie',
        mode: ['DEEP_SPACE', 'METEOR'],
    },
    {
        name: 'Space Monkey',
        icon: 'icons/upgrades/monkey.png',
        description: 'Find the space monkey.',
        achievedKey: 'space_monkey',
        mode: ['PLANET', 'METEOR'],
    },
    {
        name: 'Space Potato',
        icon: 'icons/upgrades/potato.png',
        description: 'Find the space potato.',
        achievedKey: 'space_potato',
        mode: ['PLANET', 'DEEP_SPACE'],
    },
    {
        name: 'Dark Side',
        icon: 'icons/upgrades/darkside.png',
        description: 'Make a deal with Dark Side.',
        achievedKey: 'dark_side',
        mode: ['METEOR', 'DEEP_SPACE'],
    },
];

// Chance to spawn upgrades per wave based on difficulty
const spawnChances = {
    EASY: 0.005, // 0.5% chance per wave
    NORMAL: 0.01, // 1% chance per wave
    HARD: 0.02, // 2% chance per wave
    HERO: 0.04, // 4% chance per wave
};

let activeFloatingUpgrades = [];

function spawnRandomUpgrade() {
    const currentGameMode = currentMode;
    const waveNumber = wave;

    // Determine spawn probability based on the current difficulty
    let spawnChance = 0;
    switch (currentGameMode) {

        case GameModes.EASY:
            spawnChance = spawnChances.EASY;
            break;
        case GameModes.METEORSHOWEREASY:
            spawnChance = spawnChances.EASY;
            break;
        case GameModes.PLANETEASY:
            spawnChance = spawnChances.EASY;
            break;
        case GameModes.NORMAL:
            spawnChance = spawnChances.NORMAL;
            break;
        case GameModes.METEORSHOWERNORMAL:
            spawnChance = spawnChances.NORMAL;
            break;
        case GameModes.PLANETNORMAL:
            spawnChance = spawnChances.NORMAL;
            break;
        case GameModes.HARD:
            spawnChance = spawnChances.HARD;
            break;
        case GameModes.METEORSHOWERHARD:
            spawnChance = spawnChances.HARD;
            break;
        case GameModes.PLANETHARD:
            spawnChance = spawnChances.HARD;
            break;
        case GameModes.HERO:
            spawnChance = spawnChances.HERO;
            break;
        case GameModes.METEORSHOWERHERO:
            spawnChance = spawnChances.HERO;
            break;
        case GameModes.PLANETHERO:
            spawnChance = spawnChances.HERO;
            break;
        default:
            return;
    }

    // Random chance to spawn an upgrade
    if (Math.random() < spawnChance) {
        const availableUpgrades = floatingUpgrades.filter(upgrade =>
            !Achievements[upgrade.achievedKey].reached && // Only spawn if not achieved
            upgrade.mode.includes(currentGameMode) // Only spawn in applicable game modes
        );

        if (availableUpgrades.length > 0) {
            // Select a random upgrade from the available pool
            const randomUpgrade = availableUpgrades[Math.floor(Math.random() * availableUpgrades.length)];
            activeFloatingUpgrades.push(createFloatingUpgrade(randomUpgrade));
        }
    }
}

function createFloatingUpgrade(upgrade) {
    return {
        ...upgrade,
        x: Math.random() * canvas.width,  // Random x position
        y: Math.random() * canvas.height, // Random y position
        size: 50,
        collected: false,
    };
}

const time = Date.now() * 0.001; // Current time in seconds

activeFloatingUpgrades.forEach(upgrade => {
    ctx.save();

    // Create a pulsating effect for the glow
    const pulseFactor = Math.sin(time * 2) * 0.2 + 0.8; // Pulsate between 0.6 and 1.0

    // Increase glow size
    const glowSize = upgrade.size * 1.5; // 50% larger than the upgrade icon

    // Create a radial gradient for the glow
    const gradient = ctx.createRadialGradient(
        upgrade.x + upgrade.size / 2, upgrade.y + upgrade.size / 2, 0,
        upgrade.x + upgrade.size / 2, upgrade.y + upgrade.size / 2, glowSize
    );
    gradient.addColorStop(0, 'rgba(0, 150, 255, 0.8)'); // Intense blue
    gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');

    // Draw the glow
    ctx.globalAlpha = 0.9 * pulseFactor;
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(upgrade.x + upgrade.size / 2, upgrade.y + upgrade.size / 2,
        glowSize, 0, Math.PI * 2);
    ctx.fill();

    // Reset global alpha and draw the upgrade icon
    ctx.globalAlpha = 1;
    const img = new Image();
    img.src = upgrade.icon;
    ctx.drawImage(img, upgrade.x, upgrade.y, upgrade.size, upgrade.size);

    ctx.restore();
});
}

function collectFloatingUpgrade(upgrade) {
    addAchievement(upgrade.achievedKey);
    // Apply any specific effect from collecting the upgrade (optional)
    console.log(`${upgrade.name} collected!`);
}

function drawFloatingUpgrades() {
    activeFloatingUpgrades.forEach(upgrade => {
        const img = new Image();
        img.src = upgrade.icon;
        ctx.drawImage(img, upgrade.x, upgrade.y, upgrade.size, upgrade.size);
    });
}

// Call this function at the start of each wave
function checkForUpgradeSpawn() {
    if (wave >= 35) {  // Start spawning after wave 30
        spawnRandomUpgrade();
    }
}

// Call these functions in the game loop
function updateAndDrawFloatingUpgrades() {
    updateFloatingUpgrades();
    drawFloatingUpgrades();
}

// Add achievements for collected upgrades
function addAchievement(key) {
    if (!Achievements[key].reached) {
        Achievements[key].reached = true;
        console.log(`Achievement unlocked: ${Achievements[key].description}`);
    }
}
