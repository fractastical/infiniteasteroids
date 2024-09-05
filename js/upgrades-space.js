// Achievements and Upgrade Data
const floatingUpgrades = [
    {
        name: "Space Pizza",
        description: "Find the Space Pizza.",
        icon: "icons/upgrades/pizza.png",
        reached: false,
        mode: "deep_space", // Only appears in Deep Space
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
        angle: 0,
        rotationSpeed: Math.random() * 0.05,
        scale: 1,
        scaleDirection: 1
    },
    {
        name: "Space Pickle",
        description: "Find the Deep Space Pickle.",
        icon: "icons/upgrades/pickle.png",
        reached: false,
        mode: "planet", // Only appears in Planet mode
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
        angle: 0,
        rotationSpeed: Math.random() * 0.05,
        scale: 1,
        scaleDirection: 1
    },
    {
        name: "Space Pixie",
        description: "Find the Pixie.",
        icon: "icons/upgrades/pixie.png",
        reached: false,
        mode: "meteor_mode", // Only appears in Meteor mode
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
        angle: 0,
        rotationSpeed: Math.random() * 0.05,
        scale: 1,
        scaleDirection: 1
    },
    {
        name: "Space Monkey",
        description: "Find the Space Monkey.",
        icon: "icons/upgrades/monkey.png",
        reached: false,
        mode: "deep_space",
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
        angle: 0,
        rotationSpeed: Math.random() * 0.05,
        scale: 1,
        scaleDirection: 1
    },
    {
        name: "Space Potato",
        description: "Find the Space Potato.",
        icon: "icons/upgrades/potato.png",
        reached: false,
        mode: "planet",
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
        angle: 0,
        rotationSpeed: Math.random() * 0.05,
        scale: 1,
        scaleDirection: 1
    },
    {
        name: "Dark Side",
        description: "Make a deal with Dark Side.",
        icon: "icons/upgrades/darkside.png",
        reached: false,
        mode: "meteor_mode",
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        velocityX: (Math.random() - 0.5) * 0.5,
        velocityY: (Math.random() - 0.5) * 0.5,
        angle: 0,
        rotationSpeed: Math.random() * 0.05,
        scale: 1,
        scaleDirection: 1
    }
];

// Load each upgrade's icon
floatingUpgrades.forEach(upgrade => {
    upgrade.sprite = new Image();
    upgrade.sprite.src = upgrade.icon;
});

// Update floating upgrades
function updateFloatingUpgrades() {
    floatingUpgrades.forEach(upgrade => {
        // Move the upgrade
        upgrade.x += upgrade.velocityX;
        upgrade.y += upgrade.velocityY;

        // Keep upgrades within the canvas bounds (bounce off edges)
        if (upgrade.x < 0 || upgrade.x > canvas.width) upgrade.velocityX *= -1;
        if (upgrade.y < 0 || upgrade.y > canvas.height) upgrade.velocityY *= -1;

        // Rotate the upgrade
        upgrade.angle += upgrade.rotationSpeed;

        // Apply scaling effect (wobble effect)
        if (upgrade.scaleDirection === 1) {
            upgrade.scale += 0.005;
            if (upgrade.scale >= 1.2) {
                upgrade.scaleDirection = -1;
            }
        } else {
            upgrade.scale -= 0.005;
            if (upgrade.scale <= 0.8) {
                upgrade.scaleDirection = 1;
            }
        }
    });
}

// Draw floating upgrades on the canvas
function drawFloatingUpgrades() {
    floatingUpgrades.forEach(upgrade => {
        // Save canvas state before transformation
        ctx.save();

        // Translate to the upgrade's position
        ctx.translate(upgrade.x, upgrade.y);

        // Rotate and scale the sprite
        ctx.rotate(upgrade.angle);
        ctx.scale(upgrade.scale, upgrade.scale);

        // Draw the sprite centered at its position
        ctx.drawImage(upgrade.sprite, -upgrade.sprite.width / 2, -upgrade.sprite.height / 2, 40, 40);

        // Restore canvas state after transformation
        ctx.restore();
    });
}

// Check for collision with ship
function checkUpgradeCollision() {
    floatingUpgrades.forEach((upgrade, index) => {
        const distance = Math.hypot(ship.x - upgrade.x, ship.y - upgrade.y);

        if (distance < 30) { // Collision detection radius
            // Mark achievement as reached
            upgrade.reached = true;

            // Add achievement logic or unlock bonus
            unlockAchievement(upgrade);

            // Remove upgrade from the array
            floatingUpgrades.splice(index, 1);
        }
    });
}

// Unlock achievements or bonuses
function unlockAchievement(upgrade) {
    // Add any logic for tracking unlocked achievements
    console.log(`Achievement unlocked: ${upgrade.name}`);
}

// Spawn floating upgrades based on wave number and game mode
function spawnFloatingUpgrade() {
    if (wave >= 55 && Math.random() < 0.01) { // 1% chance after wave 55
        const availableUpgrades = floatingUpgrades.filter(upgrade => upgrade.mode === currentMode && !upgrade.reached);
        if (availableUpgrades.length > 0) {
            const randomUpgrade = availableUpgrades[Math.floor(Math.random() * availableUpgrades.length)];
            randomUpgrade.x = Math.random() * canvas.width;
            randomUpgrade.y = Math.random() * canvas.height;
            randomUpgrade.velocityX = (Math.random() - 0.5) * 1.5;
            randomUpgrade.velocityY = (Math.random() - 0.5) * 1.5;
            floatingUpgrades.push(randomUpgrade);
        }
    }
}

// Integrate into game loop
function updateGame() {
    updateFloatingUpgrades(); // Update positions and effects of floating upgrades
    checkUpgradeCollision(); // Check for player collisions with upgrades
    drawFloatingUpgrades();  // Render floating upgrades
}
