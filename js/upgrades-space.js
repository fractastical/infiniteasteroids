
let collectedSpacePizza = false;
let collectedPurplePixie = false;
let collectedGoldPixie = false;
let collectedPinkPixie = false;
let collectedSpacePickle = false;
let collectedDarkSide = false;



const floatingUpgrades = [
    {
        name: 'Space Pizza',
        icon: 'icons/upgrades/orbs/pizza_space_orb.png',
        description: 'Find the Space Pizza.',
        achievedKey: 'space_pizza',
        mode: ['ENDLESS_SLOW', 'PLANET'],
    },
    {
        name: 'Space Pickle',
        icon: 'icons/upgrades/orbs/pickle_orb.png',
        description: 'Find the deep space pickle.',
        achievedKey: 'space_pickle',
        mode: ['DEEP_SPACE', 'METEOR'],
    },
    {
        name: 'Pink Pixie',
        icon: 'icons/upgrades/orbs/pink_pixie_orb2.png',
        description: 'Find the pink pixie.',
        achievedKey: 'pink_pixie',
        mode: ['DEEP_SPACE', 'METEOR'],
    },
    {
        name: 'Purple Pixie',
        icon: 'icons/upgrades/orbs/pink_pixie_orb2.png',
        description: 'Find the purple pixie.',
        achievedKey: 'purple_pixie',
        mode: ['DEEP_SPACE', 'METEOR'],
    },
    {
        name: 'Gold Pixie',
        icon: 'icons/upgrades/orbs/pink_pixie_orb2.png',
        description: 'Find the gold pixie.',
        achievedKey: 'gold_pixie',
        mode: ['DEEP_SPACE', 'METEOR'],
    },
    // {
    //     name: 'Space Monkey',
    //     icon: 'icons/upgrades/orbs/space_monkey_orb.png',
    //     description: 'Find the space monkey.',
    //     achievedKey: 'space_monkey',
    //     mode: ['PLANET', 'METEOR'],
    // },
    // {
    //     name: 'Space Potato',
    //     icon: 'icons/upgrades/orbs/potato_orb.png',
    //     description: 'Find the space potato.',
    //     achievedKey: 'space_potato',
    //     mode: ['PLANET', 'DEEP_SPACE'],
    // },
    {
        name: 'Dark Side',
        icon: 'icons/upgrades/orbs/darkerdarkside_orb3.png',
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

function activateFloatingUpgrade(achievedKey) {
    switch (achievedKey) {
        case 'space_pizza': spacePizza.activate(); break;
        case 'space_pickle': spacePickle.activate(); break;
        case 'pink_pixie': pinkPixie.activate(); break;
        case 'purple_pixie': purplePixie.activate(); break;
        case 'gold_pixie': goldPixie.activate(); break;
        case 'space_monkey': spaceMonkey.activate(); break;
        case 'space_potato': spacePotato.activate(); break;
        case 'dark_side': darkSide.activate(); break;
    }
}


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

    // console.log(spawnChance);

    const availableUpgrades = floatingUpgrades.filter(upgrade =>
        !Achievements[upgrade.achievedKey].reached  // Only spawn if not achieved
    );

    if (availableUpgrades.length > 3)
        spawnChance += 0.025;
    if (availableUpgrades.length > 4)
        spawnChance += 0.015;
    if (availableUpgrades.length > 5)
        spawnChance += 0.015;

    // Random chance to spawn an upgrade
    if (Math.random() < spawnChance) {
        console.log("spawning");


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

function drawFloatingUpgrades() {
    // console.log("Drawing upgrades. Count:", activeFloatingUpgrades.length);
    activeFloatingUpgrades.forEach((upgrade, index) => {
        ctx.save();

        // Draw glow
        const glowSize = upgrade.size * 1.5;
        const gradient = ctx.createRadialGradient(
            upgrade.x + upgrade.size / 2, upgrade.y + upgrade.size / 2, 0,
            upgrade.x + upgrade.size / 2, upgrade.y + upgrade.size / 2, glowSize
        );
        gradient.addColorStop(0, `rgba(0, 150, 255, ${upgrade.glowIntensity})`);
        gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(upgrade.x + upgrade.size / 2, upgrade.y + upgrade.size / 2,
            glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw upgrade icon
        const img = new Image();
        img.src = upgrade.icon;
        img.onload = () => {
            ctx.drawImage(img, upgrade.x, upgrade.y, upgrade.size, upgrade.size);
            // console.log(`Drew upgrade ${index} at:`, upgrade.x, upgrade.y);
        };
        img.onerror = () => {
            console.error(`Failed to load image for upgrade ${index}:`, upgrade.icon);
            // Draw a placeholder
            ctx.fillStyle = 'red';
            ctx.fillRect(upgrade.x, upgrade.y, upgrade.size, upgrade.size);
        };

        ctx.restore();
    });
}



function collectFloatingUpgrade(upgrade) {
    addAchievement(upgrade.achievedKey);


    // Apply any specific effect from collecting the upgrade (optional)
    console.log(`${upgrade.name} collected!`);
}

// function drawFloatingUpgrades() {
//     activeFloatingUpgrades.forEach(upgrade => {
//         const img = new Image();
//         img.src = upgrade.icon;
//         ctx.drawImage(img, upgrade.x, upgrade.y, upgrade.size, upgrade.size);
//     });
// }

// Call this function at the start of each wave
function checkForUpgradeSpawn() {
    if (wave >= 30) {  // Start spawning after wave 30
        spawnRandomUpgrade();
    }
}

// Call these functions in the game loop
function updateAndDrawFloatingUpgrades() {
    updateFloatingUpgrades();
    drawFloatingUpgrades();

}

let currentMatchAchievements = new Set();

// Add achievements for collected upgrades
function addAchievement(key) {
    if (!Achievements[key].reached) {
        Achievements[key].reached = true;
        currentMatchAchievements.add(key);
        console.log(`Achievement unlocked: ${Achievements[key].description}`);
    }
}


function updateFloatingUpgrades() {
    activeFloatingUpgrades.forEach(upgrade => {
        // Initialize properties if they don't exist
        if (typeof upgrade.angle === 'undefined') {
            upgrade.angle = Math.random() * Math.PI * 2; // Random start angle
            upgrade.radius = Math.min(canvas.width, canvas.height) * 0.4; // Start at 40% of screen size
            upgrade.centerX = canvas.width / 2;
            upgrade.centerY = canvas.height / 2;
            upgrade.spiralProgress = 0;
            upgrade.glowIntensity = 0.8; // Initial glow intensity
        }

        // Update the angle, radius, and spiral progress
        upgrade.angle += 0.0002; // Adjust for rotation speed
        upgrade.radius *= 0.99999; // Gradually decrease radius
        upgrade.spiralProgress += 0.00001; // Move towards center

        // Ensure radius doesn't get too small
        if (upgrade.radius < 10) {
            upgrade.radius = Math.min(canvas.width, canvas.height) * 0.4; // Reset radius when too small
        }

        // Calculate new position based on angle and radius
        upgrade.x = upgrade.centerX + upgrade.radius * Math.cos(upgrade.angle);
        upgrade.y = upgrade.centerY + upgrade.radius * Math.sin(upgrade.angle);

        // Update glow effect
        upgrade.glowIntensity = 0.6 + Math.sin(Date.now() * 0.005) * 0.2; // Pulsate between 0.4 and 0.8

        // Check for collision with player
        const dx = ship.x - upgrade.x;
        const dy = ship.y - upgrade.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ship.size / 2 + upgrade.size / 2 + 10) {
            collectFloatingUpgrade(upgrade);
            if (upgrade.achievedKey === 'space_pizza')
                collectedSpacePizza = true;
            if (upgrade.achievedKey === 'purple_pixie')
                collectedPurplePixie = true;
            if (upgrade.achievedKey === 'pink_pixie')
                collectedPinkPixie = true;
            if (upgrade.achievedKey === 'gold_pixie')
                collectedGoldPixie = true;
            if (upgrade.achievedKey === 'space_pickle')
                collectedSpacePickle = true;
            if (upgrade.achievedKey === 'dark_side')
                collectedDarkSide = true;





            // Remove the collected upgrade from activeFloatingUpgrades
            const index = activeFloatingUpgrades.indexOf(upgrade);
            if (index > -1) {
                activeFloatingUpgrades.splice(index, 1);
            }
        }

        // Optionally: remove upgrade if it spirals too close to center
        if (upgrade.spiralProgress >= 1 || upgrade.radius < 5) {
            const index = activeFloatingUpgrades.indexOf(upgrade);
            if (index > -1) {
                activeFloatingUpgrades.splice(index, 1);
            }
        }
    });
}
