// Floating Island
const floatingIsland = {
    x: -100,
    y: canvas.height / 2,
    width: 70,
    height: 70,
    speed: 0.3,
    active: false,
    image: null
};

floatingIsland.image = new Image();
floatingIsland.image.src = 'icons/gold-ore.png';

// Mega Upgrades
const megaUpgrades = [
    {
        name: 'Space Pizza',
        description: 'Grants an extra life every 10 waves.',
        icon: 'icons/upgrades/orbs/pizza_space_orb.png',
        achievedKey: 'space_pizza',
        effect: function () {
            spacePizza.activate();
        },
        update: function () {
            spacePizza.update();
        }
    },
    {
        name: 'Space Pickle',
        description: 'Temporarily increases all damage.',
        icon: 'icons/upgrades/orbs/pickle_orb.png',
        achievedKey: 'space_pickle',
        effect: function () {
            spacePickle.activate();
        },
        update: function () {
            spacePickle.update();
        }
    },
    {
        name: 'Pink Pixie',
        description: 'Temporarily increases the ship\'s fire rate.',
        icon: 'icons/upgrades/orbs/pink_pixie_orb2.png',
        achievedKey: 'pink_pixie',
        effect: function () {
            pinkPixie.activate();
        },
        update: function () {
            pinkPixie.update();
        }
    },
    {
        name: 'Purple Pixie',
        description: 'Doubles the damage booster',
        icon: 'icons/upgrades/orbs/purple_pixie_orb2.png',
        achievedKey: 'purple_pixie',
        effect: function () {
            purplePixie.activate();
        },
        update: function () {
            purplePixie.update();
        }
    },
    {
        name: 'Gold Pixie',
        description: 'Adds one to the damage booster every five waves',
        icon: 'icons/upgrades/orbs/gold_pixie_orb.png',
        achievedKey: 'gold_pixie',
        effect: function () {
            goldPixie.activate();
        },
        update: function () {
            goldPixie.update();
        }
    },
    // {
    //     name: 'Space Monkey',
    //     description: 'Spawns friendly "monkey asteroids" that destroy enemy asteroids.',
    //     icon: 'icons/upgrades/orbs/space_monkey_orb.png',
    //     achievedKey: 'space_monkey',
    //     effect: function () {
    //         spaceMonkey.activate();
    //     },
    //     update: function () {
    //         spaceMonkey.update();
    //     },
    //     draw: function () {
    //         spaceMonkey.draw();
    //     },
    // },
    // {
    //     name: 'Space Potato',
    //     description: 'Summons a space potato that orbits the ship, slowing down nearby objects.',
    //     icon: 'icons/upgrades/orbs/potato_orb.png',
    //     achievedKey: 'space_potato',
    //     cooldown: 60 * 60,
    //     cooldownTimer: 0,
    //     effect: function () {
    //         spacePotato.activate();
    //         this.cooldownTimer = this.cooldown;
    //     },
    //     update: function () {
    //         if (this.cooldownTimer > 0) {
    //             this.cooldownTimer--;
    //             spacePotato.update();
    //         } else {
    //             spacePotato.deactivate();
    //         }
    //     },
    //     draw: function () {
    //         spacePotato.draw();
    //     }

    // },
    {
        name: 'Dark Side',
        description: 'Allows you to overclock your weapons.',
        icon: 'icons/upgrades/orbs/darkerdarkside_orb3.png',
        achievedKey: 'dark_side',
        effect: function () {
            darkSide.activate();
            overClockingAllowed = true;
        },
        update: function () {
            darkSide.update();
        }
    },
    {
        name: 'Glitch Effect',
        achievedKey: 'complete_planet_hard_mode',
        description: 'Randomly causes asteroids to malfunction and break apart.',
        icon: 'icons/upgrades/mainframe.png',
        cooldown: 5 * 60, // 5 seconds at 60 FPS
        cooldownTimer: 0,
        effect: function () {
            glitchEffect.active = true;
            this.cooldownTimer = this.cooldown;
        },
        update: function () {
            if (this.cooldownTimer > 0) {
                this.cooldownTimer--;
                glitchEffect.update();
            } else {
                glitchEffect.active = false;
            }
        }
    },
    // {
    //     name: 'Time Dilation',
    //     description: 'Slows down time, making it easier to evade asteroids and aim.',
    //     icon: 'icons/upgrades/void.png',
    //     cooldown: 45 * 60, // 45 seconds at 60 FPS
    //     cooldownTimer: 0,
    //     effect: function () {
    //         timeDilation.active = true;
    //         timeDilation.timer = timeDilation.duration;
    //         this.cooldownTimer = this.cooldown;
    //     },
    //     update: function () {
    //         if (this.cooldownTimer > 0) {
    //             this.cooldownTimer--;
    //         }
    //         timeDilation.update();
    //     }
    // },
    {
        name: 'Gravity Bomb',
        description: 'Creates a gravity well that pulls in nearby asteroids.',
        icon: 'icons/upgrades/void.png', // Replace with appropriate icon
        cooldown: 40 * 60, // 40 seconds at 60 FPS
        cooldownTimer: 0,
        effect: function () {
            gravityBomb.activate();
            this.cooldownTimer = this.cooldown;
        },
        update: function () {
            if (this.cooldownTimer > 0) {
                this.cooldownTimer--;
            }
            gravityBomb.update();
        }
    },
    {
        name: 'Asteroid Splitter',
        description: 'Randomly splits asteroids into smaller pieces.',
        achievedKey: 'complete_planet_hero_mode',
        icon: 'icons/upgrades/asteroid_splitter_22.png', // Replace with appropriate icon
        cooldown: 50 * 60, // 50 seconds at 60 FPS
        cooldownTimer: 0,
        effect: function () {
            this.cooldownTimer = this.cooldown;
        },
        update: function () {
            if (this.cooldownTimer > 0) {
                this.cooldownTimer--;
                asteroidSplitter.update();
            }
        }
    },
    {
        name: 'Quantum Teleporter',
        description: 'Teleports the nearest asteroid to a random location around the ship.',
        icon: 'icons/upgrades/quantum_teleporter_22.png', // Replace with appropriate icon
        cooldown: 35 * 60, // 35 seconds at 60 FPS
        cooldownTimer: 0,
        effect: function () {
            quantumTeleporter.activate();
            this.cooldownTimer = this.cooldown;
        },
        update: function () {
            if (this.cooldownTimer > 0) {
                this.cooldownTimer--;
            }
            quantumTeleporter.update();
        }
    },
    {
        name: 'XP Boost',
        description: 'Boost XP gains by 10%.',
        icon: 'icons/upgrades/monkey.png', // Replace with appropriate icon
        cooldown: 45 * 60, // 45 seconds at 60 FPS
        cooldownTimer: 0,
        duration: 15 * 60, // 15 seconds duration at 60 FPS
        durationTimer: 0,
        effect: function () {
            // xpBooster.active = true;
            levelUpXPMultiplier *= 0.9; // Double the XP multiplier
        },
        update: function () {
            // No need to update anything since the effect is permanent
        }
    }

];


function updateMegaUpgrades() {

    activeMegaUpgrades.forEach(upgrade => {
        // console.log(upgrade.name);
        // console.log(upgrade.timer);

        if (typeof upgrade.update === 'function') {
            upgrade.update();

        }
    });
}

function drawActiveMegaUpgrades() {
    const upgradeSize = 40;
    const padding = 10;
    const startX = canvas.width - upgradeSize - padding;
    const startY = padding;

    activeMegaUpgrades.forEach((upgrade, index) => {
        const x = startX;
        const y = startY + (upgradeSize + padding) * index;

        ctx.save();  // Save the current canvas state

        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x, y, upgradeSize, upgradeSize);

        // Draw icon (if no custom draw function)
        // if (!upgrade.draw) {
        const icon = new Image();
        icon.src = upgrade.icon;
        ctx.drawImage(icon, x, y, upgradeSize, upgradeSize);
        // }

        // Draw cooldown overlay if applicable
        if (upgrade.cooldown && upgrade.cooldownTimer) {
            const cooldownPercentage = upgrade.cooldownTimer / upgrade.cooldown;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(x, y + upgradeSize * (1 - cooldownPercentage), upgradeSize, upgradeSize * cooldownPercentage);
        }
        // console.log(upgrade);
        // Call the upgrade's custom draw function if it exists
        if (typeof upgrade.draw === 'function') {
            ctx.translate(x, y);  // Translate context to upgrade's position
            console.log("calling draw");
            upgrade.draw(ctx, upgradeSize);  // Pass context and size to the draw function
            ctx.translate(-x, -y);  // Translate back
        }

        ctx.restore();  // Restore the canvas state
    });
}

function checkFloatingIslandSpawn() {
    // prevent island from being activated multiple times in same wave
    if (wave % 20 === 0 && !floatingIsland.active && wave != lastActivatedWave) {

        lastActivatedWave = wave;
        floatingIsland.active = true;

        floatingIsland.x = 0;
        floatingIsland.y = 0;

    }
    if (testMode && !floatingIsland.active) {

        console.log("reset");
        floatingIsland.active = true;
        floatingIsland.x = 0;
        floatingIsland.y = 0;
    }

}

function updateFloatingIsland() {
    if (floatingIsland.active) {
        // Initialize properties if they don't exist
        if (typeof floatingIsland.angle === 'undefined') {
            floatingIsland.angle = 0;
            floatingIsland.radius = Math.min(canvas.width, canvas.height) * 0.4; // Start at 40% of screen size
            floatingIsland.centerX = canvas.width / 2;
            floatingIsland.centerY = canvas.height / 2;
            floatingIsland.spiralProgress = 0;
        }

        // Check if radius and angle are finite
        if (!isFinite(floatingIsland.radius) || !isFinite(floatingIsland.angle)) {
            console.error('Invalid radius or angle:', floatingIsland.radius, floatingIsland.angle);
            floatingIsland.radius = Math.min(canvas.width, canvas.height) * 0.4; // Reset to a valid radius
            floatingIsland.angle = 0; // Reset angle
        }

        // Update the angle and radius
        floatingIsland.angle += 0.002; // Adjust for rotation speed
        floatingIsland.radius *= 0.9999; // Gradually decrease radius
        floatingIsland.spiralProgress += 0.0001; // Move towards center

        // Validate radius
        if (floatingIsland.radius < 10) {
            floatingIsland.radius = Math.min(canvas.width, canvas.height) * 0.4; // Reset radius when too small
        }

        // Calculate new position based on angle and radius
        floatingIsland.x = floatingIsland.centerX + floatingIsland.radius * Math.cos(floatingIsland.angle);
        floatingIsland.y = floatingIsland.centerY + floatingIsland.radius * Math.sin(floatingIsland.angle);

        // If x or y is NaN, log error
        if (!isFinite(floatingIsland.x) || !isFinite(floatingIsland.y)) {
            console.error('Invalid position for floatingIsland:', floatingIsland.x, floatingIsland.y);
            floatingIsland.x = floatingIsland.centerX; // Reset to center
            floatingIsland.y = floatingIsland.centerY;
        }

        // Optionally: trigger an event when the island reaches the center
        if (floatingIsland.spiralProgress >= 1 || floatingIsland.radius < 10) {
            console.log('Island has reached the center.');
            // You can reset the island here, trigger an event, or reward
        }
    }
}
function resetFloatingIsland() {
    floatingIsland.angle = Math.random() * Math.PI * 2; // Randomize starting angle
    floatingIsland.radius = Math.min(canvas.width, canvas.height) * 0.4; // Reset radius to 40% of screen size
    floatingIsland.spiralProgress = 0; // Reset spiral progress
    floatingIsland.active = true; // Ensure the island is active again
}



function drawFloatingIsland() {
    if (floatingIsland.active) {
        // Ensure the floatingIsland has valid properties
        if (!isFinite(floatingIsland.x) || !isFinite(floatingIsland.y) || !isFinite(floatingIsland.width) || !isFinite(floatingIsland.height)) {
            console.error('Invalid floatingIsland properties:', floatingIsland);
            return; // Exit the function if the properties are invalid
        }

        ctx.save();

        // Create a pulsating effect for the glow
        const time = Date.now() * 0.001; // Current time in seconds
        const pulseFactor = Math.sin(time * 2) * 0.2 + 0.8; // Pulsate between 0.6 and 1.0

        // Increase glow size
        const glowSize = floatingIsland.width * 1.2; // 20% larger than the island

        // Ensure the glow size is valid before creating the gradient
        if (!isFinite(glowSize)) {
            console.error('Invalid glowSize:', glowSize);
            return; // Exit the function if the glowSize is invalid
        }

        // Create a radial gradient for the glow
        const gradient = ctx.createRadialGradient(
            floatingIsland.x + floatingIsland.width / 2, floatingIsland.y + floatingIsland.height / 2, 0,
            floatingIsland.x + floatingIsland.width / 2, floatingIsland.y + floatingIsland.height / 2, glowSize
        );
        gradient.addColorStop(0, 'rgba(0, 150, 255, 0.8)'); // More intense blue
        gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');

        // Draw the glow
        ctx.globalAlpha = 0.9 * pulseFactor; // Increased base opacity
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(floatingIsland.x + floatingIsland.width / 2, floatingIsland.y + floatingIsland.height / 2,
            glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Reset global alpha and draw the island image
        ctx.globalAlpha = 1;
        ctx.drawImage(floatingIsland.image, floatingIsland.x, floatingIsland.y, floatingIsland.width, floatingIsland.height);

        ctx.restore();
    }
}

function checkIslandCollision() {
    if (floatingIsland.active &&
        ship.x < floatingIsland.x + floatingIsland.width &&
        ship.x + ship.size > floatingIsland.x &&
        ship.y < floatingIsland.y + floatingIsland.height &&
        ship.y + ship.size > floatingIsland.y) {
        openUpgradeOptions();
        // Respawn the island after collision
        resetFloatingIsland();
    }
}

function openUpgradeOptions() {
    if (floatingIsland.active) {
        floatingIsland.active = false;
        pauseGame();
        // floatingIsland.active = false;
        // floatingIsland.x = 0;
        // floatingIsland.y = 0;

        const container = document.getElementById('activeWeaponClassesContainer');
        container.style.display = "none";

        const upgradeModal = document.createElement('div');
        upgradeModal.id = 'upgradeModal';
        upgradeModal.innerHTML = `
          <h2>Choose Your Upgrade</h2>
          <button id="megaUpgrade" class="upgrade-option">Mega Upgrade [1]</button>
          <button id="restoreHealth" class="upgrade-option">Restore Health [2]</button>
        `;
        document.body.appendChild(upgradeModal);

        // Add event listeners for mouse click
        document.getElementById('megaUpgrade').addEventListener('click', selectMegaUpgrade);
        document.getElementById('restoreHealth').addEventListener('click', restoreHealth);

        // Clean up function
        window.closeUpgradeOptions = function () {
            const upgradeModal = document.getElementById('upgradeModal');
            if (upgradeModal) {
                document.body.removeChild(upgradeModal);
            }
            resumeGame();
        };

    }
}


function selectMegaUpgrade() {
    const availableMegaUpgrades = megaUpgrades.filter(upgrade =>
        !upgrade.achievedKey || // Include upgrades without an achievedKey
        (upgrade.achievedKey && Achievements[upgrade.achievedKey].reached) // Include achieved upgrades
    ).filter(upgrade =>
        !activeMegaUpgrades.some(active => active.name === upgrade.name) // Exclude already active upgrades
    );

    if (availableMegaUpgrades.length > 0) {
        const megaUpgradeOptions = getRandomMegaUpgrades(availableMegaUpgrades, 3);
        displayMegaUpgradeOptions(megaUpgradeOptions);
    } else {
        alert("No more mega upgrades available!");
        closeUpgradeModal();
        resumeGame();
    }
}


// function getRandomMegaUpgrades(upgrades, count) {
//     const shuffled = [...upgrades].sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, Math.min(count, shuffled.length));
// }



function getRandomMegaUpgrades(upgrades, count) {
    const shuffled = upgrades.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayMegaUpgradeOptions(megaUpgradeOptions) {
    const upgradeModal = document.getElementById('upgradeModal');
    upgradeModal.innerHTML = '<h2>Choose a Mega Upgrade</h2>';

    // Add numbered mega upgrade options
    megaUpgradeOptions.forEach((upgrade, index) => {
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'mega-upgrade-option';
        upgradeElement.innerHTML = `
        <div class="upgrade-content">
            <img src="${upgrade.icon}" alt="${upgrade.name}" class="upgrade-icon">
            <div class="upgrade-details">
                <h3>${index + 1}: ${upgrade.name}</h3>
                <p>${upgrade.description}</p>
            </div>
        </div>
      `;
        upgradeElement.addEventListener('click', () => applyMegaUpgrade(upgrade));  // Click selection still works
        upgradeModal.appendChild(upgradeElement);
    });
}

// function applyMegaUpgrade(upgrade) {
//     const newUpgrade = { ...upgrade, cooldownTimer: 0 };
//     activeMegaUpgrades.push(newUpgrade);
//     newUpgrade.effect();
//     closeUpgradeModal();
// }

function closeUpgradeModal() {
    floatingIsland.active = false;
    document.getElementById('upgradeModal').remove();
    resumeGame();
}

function applyMegaUpgrade(upgrade) {
    const newUpgrade = { ...upgrade, cooldownTimer: 0 };
    activeMegaUpgrades.push(newUpgrade);
    // if (floatingIsland.active)
    newUpgrade.effect();
    closeUpgradeModal();
    resumeGame();
}

function restoreHealth() {
    // if (floatingIsland.active)
    lives++;
    closeUpgradeModal();
    resumeGame();
}

function closeUpgradeModal() {
    floatingIsland.active = false;
    document.getElementById('upgradeModal').remove();
}

// function updateMegaUpgrades() {
//     activeMegaUpgrades.forEach(upgrade => {
//         if (typeof upgrade.update === 'function') {
//             upgrade.update();
//         }
//     });
// }


function handleMegaUpgradeClick(event) {
    const upgradeSize = 40;
    const padding = 10;
    const startX = canvas.width - upgradeSize - padding;
    const startY = padding;

    const clickX = event.clientX - canvas.offsetLeft;
    const clickY = event.clientY - canvas.offsetTop;

    activeMegaUpgrades.forEach((upgrade, index) => {
        const x = startX;
        const y = startY + (upgradeSize + padding) * index;

        if (clickX >= x && clickX <= x + upgradeSize &&
            clickY >= y && clickY <= y + upgradeSize) {
            if (upgrade.cooldownTimer === 0) {
                upgrade.effect();
            }
        }
    });
}

// Event Listeners
canvas.addEventListener('click', handleMegaUpgradeClick);

