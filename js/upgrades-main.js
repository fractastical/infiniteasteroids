const upgrades = [
    {
        name: 'Glitch Effect',
        description: 'Applies a glitch effect to nearby asteroids, causing them to malfunction and break apart.',
        icon: 'icons/glitch-effect.png',
        rarity: 'rare',
        price: 100
    },
    {
        name: 'Time Dilation',
        description: 'Slows down time for a short duration, making it easier to evade asteroids and aim at targets.',
        icon: 'icons/time-dilation.png',
        rarity: 'common',
        price: 50
    },
    {
        name: 'Space Potato',
        description: 'Summons a giant space potato that orbits around the ship, absorbing incoming asteroids and projectiles.',
        icon: 'icons/space-potato.png',
        rarity: 'epic',
        price: 200
    },
    {
        name: 'Damage Booster',
        description: 'Temporarily boosts the damage output of all weapons.',
        icon: 'icons/damage-booster.png',
        rarity: 'common',
        price: 75
    },
    {
        name: 'Space Monkey',
        description: 'Deploys a mischievous space monkey that distracts and confuses nearby asteroids.',
        icon: 'icons/space-monkey.png',
        rarity: 'uncommon',
        price: 120
    },
    {
        name: 'Space Pizza',
        description: 'Launches a delicious space pizza that attracts and satisfies nearby asteroids, making them harmless.',
        icon: 'icons/space-pizza.png',
        rarity: 'common',
        price: 50
    },
    {
        name: 'Space Pixie',
        description: 'Summons a helpful space pixie that automatically collects power-ups and bonuses.',
        icon: 'icons/space-pixie.png',
        rarity: 'uncommon',
        price: 100
    },
    {
        name: 'Quantum Shield',
        description: 'Generates a shield that temporarily protects the ship from all damage.',
        icon: 'icons/quantum-shield.png',
        rarity: 'rare',
        price: 150
    },
    {
        name: 'Warp Drive',
        description: 'Allows the ship to make short teleportation jumps to avoid danger.',
        icon: 'icons/warp-drive.png',
        rarity: 'epic',
        price: 250
    },
    {
        name: 'Gravity Well',
        description: 'Creates a gravity well that pulls in nearby asteroids and projectiles.',
        icon: 'icons/gravity-well.png',
        rarity: 'rare',
        price: 175
    },
    {
        name: 'Plasma Cannon',
        description: 'Equips the ship with a powerful plasma cannon that deals heavy damage.',
        icon: 'icons/plasma-cannon.png',
        rarity: 'epic',
        price: 300
    },
    {
        name: 'Nano Repair Bots',
        description: 'Deploys nano bots that slowly repair the ship over time.',
        icon: 'icons/nano-repair-bots.png',
        rarity: 'uncommon',
        price: 100
    },
    {
        name: 'EMP Blast',
        description: 'Unleashes an EMP blast that disables all enemy electronics for a short duration.',
        icon: 'icons/emp-blast.png',
        rarity: 'rare',
        price: 150
    },
    {
        name: 'Homing Missiles',
        description: 'Equips the ship with homing missiles that track and destroy enemies.',
        icon: 'icons/homing-missiles.png',
        rarity: 'epic',
        price: 200
    },
    {
        name: 'Photon Beam',
        description: 'Fires a continuous photon beam that pierces through multiple targets.',
        icon: 'icons/photon-beam.png',
        rarity: 'epic',
        price: 250
    },
    {
        name: 'Energy Surge',
        description: 'Provides a temporary surge in energy, increasing fire rate and speed.',
        icon: 'icons/energy-surge.png',
        rarity: 'common',
        price: 75
    },
    {
        name: 'Cloaking Device',
        description: 'Renders the ship invisible to enemies for a short period.',
        icon: 'icons/cloaking-device.png',
        rarity: 'rare',
        price: 180
    },
    {
        name: 'Tachyon Drive',
        description: 'Increases the ship\'s speed and maneuverability significantly.',
        icon: 'icons/tachyon-drive.png',
        rarity: 'epic',
        price: 300
    },
    {
        name: 'Reflective Armor',
        description: 'Adds reflective armor that bounces off projectiles.',
        icon: 'icons/reflective-armor.png',
        rarity: 'uncommon',
        price: 120
    },
    {
        name: 'Shield Overcharge',
        description: 'Overcharges the ship\'s shield, providing extra protection.',
        icon: 'icons/shield-overcharge.png',
        rarity: 'common',
        price: 50
    },
    {
        name: 'Anti-Matter Missiles',
        description: 'Fires missiles that cause massive explosions upon impact.',
        icon: 'icons/anti-matter-missiles.png',
        rarity: 'epic',
        price: 300
    },
    {
        name: 'Ion Cannon',
        description: 'Fires a powerful ion beam that disintegrates enemies.',
        icon: 'icons/ion-cannon.png',
        rarity: 'rare',
        price: 200
    },
    {
        name: 'Temporal Shield',
        description: 'Creates a shield that temporarily stops time around the ship.',
        icon: 'icons/temporal-shield.png',
        rarity: 'epic',
        price: 250
    },
    {
        name: 'Black Hole Generator',
        description: 'Generates a black hole that sucks in and destroys everything in its vicinity.',
        icon: 'icons/black-hole-generator.png',
        rarity: 'legendary',
        price: 400
    },
    {
        name: 'Solar Flare',
        description: 'Unleashes a solar flare that burns all enemies on the screen.',
        icon: 'icons/solar-flare.png',
        rarity: 'rare',
        price: 220
    }

];


const baseProbabilities = {
    legendary: 0.001,
    epic: 0.1,
    rare: 1,
    uncommon: 10
};

function getAdjustedProbability(baseProbability, wave) {
    return Math.min(baseProbability + (baseProbability * 0.5 * wave), 10); // Cap at 10%
}

function createProbabilityPool(upgrades, wave) {
    let pool = [];
    upgrades.forEach(upgrade => {
        const probability = getAdjustedProbability(baseProbabilities[upgrade.rarity], wave);
        const slots = Math.round(probability * 1000); // Convert probability to slots (multiplying by 1000)
        for (let i = 0; i < slots; i++) {
            pool.push(upgrade);
        }
    });
    return pool;
}

function getRandomAffordableUpgrades(coinSupply, wave) {
    // Create a probability pool based on wave level
    const pool = createProbabilityPool(upgrades, wave);

    // Filter the upgrades that the player can afford
    const affordablePool = pool.filter(upgrade => upgrade.price <= coinSupply);

    // Shuffle the affordable upgrades pool
    affordablePool.sort(() => 0.5 - Math.random());

    // Select up to three upgrades
    const selectedUpgrades = [];
    const selectedIndices = new Set();
    while (selectedUpgrades.length < 3 && affordablePool.length > 0) {
        const randomIndex = Math.floor(Math.random() * affordablePool.length);
        if (!selectedIndices.has(randomIndex)) {
            selectedUpgrades.push(affordablePool[randomIndex]);
            selectedIndices.add(randomIndex);
        }
    }

    return selectedUpgrades;
}


const activeUpgrades = [];

function addUpgrade(upgrade) {
    activeUpgrades.push(upgrade);
}

function removeUpgrade(upgrade) {
    const index = activeUpgrades.indexOf(upgrade);
    if (index !== -1) {
        activeUpgrades.splice(index, 1);
    }
}

function updateUpgrades() {
    activeUpgrades.forEach(upgrade => {
        if (typeof upgrade.update === 'function') {
            upgrade.update();
        }
    });
}

// // Example usage
// const currentCoinSupply = 100;
// const currentWave = 5;
// const selectedUpgrades = getRandomAffordableUpgrades(currentCoinSupply, currentWave);
// console.log(selectedUpgrades);
