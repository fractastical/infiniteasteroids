// Floating Island
const floatingIsland = {
    x: -100,
    y: canvas.height / 2,
    width: 150,
    height: 100,
    speed: 1,
    active: false,
    image: null
};

floatingIsland.image = new Image();
floatingIsland.image.src = 'icons/floatingisland.png';

// Mega Upgrades
const megaUpgrades = [
    {
        name: 'Glitch Effect',
        description: 'Randomly causes asteroids to malfunction and break apart.',
        icon: 'icons/upgrades/mainframe.png',
        cooldown: 30 * 60, // 30 seconds at 60 FPS
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
    {
        name: 'Time Dilation',
        description: 'Slows down time, making it easier to evade asteroids and aim.',
        icon: 'icons/upgrades/void.png',
        cooldown: 45 * 60, // 45 seconds at 60 FPS
        cooldownTimer: 0,
        effect: function () {
            timeDilation.active = true;
            timeDilation.timer = timeDilation.duration;
            this.cooldownTimer = this.cooldown;
        },
        update: function () {
            if (this.cooldownTimer > 0) {
                this.cooldownTimer--;
            }
            timeDilation.update();
        }
    },
    {
        name: 'Space Potato',
        description: 'Summons a space potato that orbits the ship, slowing down nearby objects.',
        icon: 'icons/upgrades/potato.png',
        cooldown: 60 * 60, // 60 seconds at 60 FPS
        cooldownTimer: 0,
        effect: function () {
            spacePotato.activate();
            this.cooldownTimer = this.cooldown;
        },
        update: function () {
            if (this.cooldownTimer > 0) {
                this.cooldownTimer--;
                spacePotato.update();
            } else {
                spacePotato.deactivate();
            }
        },
        draw: spacePotato.draw
    },
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
        icon: 'icons/upgrades/void.png', // Replace with appropriate icon
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
        icon: 'icons/upgrades/void.png', // Replace with appropriate icon
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
    }
];


function updateMegaUpgrades() {
    activeMegaUpgrades.forEach(upgrade => {
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

        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(x, y, upgradeSize, upgradeSize);

        // Draw icon
        const icon = new Image();
        icon.src = upgrade.icon;
        ctx.drawImage(icon, x, y, upgradeSize, upgradeSize);

        // Draw cooldown overlay if applicable
        if (upgrade.cooldown && upgrade.cooldownTimer) {
            const cooldownPercentage = upgrade.cooldownTimer / upgrade.cooldown;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(x, y + upgradeSize * (1 - cooldownPercentage), upgradeSize, upgradeSize * cooldownPercentage);
        }

        // Call the draw function if it exists (for upgrades like Space Potato)
        if (typeof upgrade.draw === 'function') {
            upgrade.draw();
        }
    });
}

// ... rest of the code remains the same
const activeMegaUpgrades = [];

function checkFloatingIslandSpawn() {
    if (wave % 15 === 0 && !floatingIsland.active) {
        floatingIsland.active = true;
        floatingIsland.x = -100;
    }
}

function updateFloatingIsland() {
    if (floatingIsland.active) {
        floatingIsland.x += floatingIsland.speed;
        if (floatingIsland.x > canvas.width) {
            floatingIsland.active = false;
        }
    }
}

function drawFloatingIsland() {
    if (floatingIsland.active) {
        ctx.drawImage(floatingIsland.image, floatingIsland.x, floatingIsland.y, floatingIsland.width, floatingIsland.height);
    }
}

function checkIslandCollision() {
    if (floatingIsland.active &&
        ship.x < floatingIsland.x + floatingIsland.width &&
        ship.x + ship.size > floatingIsland.x &&
        ship.y < floatingIsland.y + floatingIsland.height &&
        ship.y + ship.size > floatingIsland.y) {
        openUpgradeOptions();
    }
}

function openUpgradeOptions() {
    pauseGame();
    floatingIsland.active = false;

    const upgradeModal = document.createElement('div');
    upgradeModal.id = 'upgradeModal';
    upgradeModal.innerHTML = `
      <h2>Choose Your Upgrade</h2>
      <button id="megaUpgrade">Mega Upgrade</button>
      <button id="restoreHealth">Restore Health</button>
    `;
    document.body.appendChild(upgradeModal);

    document.getElementById('megaUpgrade').addEventListener('click', selectMegaUpgrade);
    document.getElementById('restoreHealth').addEventListener('click', restoreHealth);
}

function selectMegaUpgrade() {
    const availableMegaUpgrades = megaUpgrades.filter(upgrade => !activeMegaUpgrades.some(active => active.name === upgrade.name));
    if (availableMegaUpgrades.length > 0) {
        const megaUpgradeOptions = getRandomMegaUpgrades(availableMegaUpgrades, 3);
        displayMegaUpgradeOptions(megaUpgradeOptions);
    } else {
        alert("No more mega upgrades available!");
        closeUpgradeModal();
    }
}

function getRandomMegaUpgrades(upgrades, count) {
    const shuffled = upgrades.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displayMegaUpgradeOptions(megaUpgradeOptions) {
    const upgradeModal = document.getElementById('upgradeModal');
    upgradeModal.innerHTML = '<h2>Choose a Mega Upgrade</h2>';

    megaUpgradeOptions.forEach(upgrade => {
        const upgradeElement = document.createElement('div');
        upgradeElement.className = 'mega-upgrade-option';
        upgradeElement.innerHTML = `
        <img src="${upgrade.icon}" alt="${upgrade.name}" class="upgrade-icon">
        <h3>${upgrade.name}</h3>
        <p>${upgrade.description}</p>
      `;
        upgradeElement.addEventListener('click', () => applyMegaUpgrade(upgrade));
        upgradeModal.appendChild(upgradeElement);
    });
}

function applyMegaUpgrade(upgrade) {
    const newUpgrade = { ...upgrade, cooldownTimer: 0 };
    activeMegaUpgrades.push(newUpgrade);
    newUpgrade.effect();
    closeUpgradeModal();
    resumeGame();
}

function restoreHealth() {
    lives = Math.min(lives + 1, 3);
    closeUpgradeModal();
    resumeGame();
}

function closeUpgradeModal() {
    document.getElementById('upgradeModal').remove();
}

function updateMegaUpgrades() {
    activeMegaUpgrades.forEach(upgrade => {
        if (typeof upgrade.update === 'function') {
            upgrade.update();
        }
    });
}


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

