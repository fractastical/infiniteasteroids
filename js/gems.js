const upgradeIcons = {
    'Increase Laser Level': 'laser',
    'Decrease Laser Cooldown': 'laser',
    'Increase Rotation Speed': 'rotation',
    'Increase Turret Range': 'turret',
    'Increase Turret Firerate': 'turret',
    'Increase Turret Damage': 'turret',
    'Activate Turret': 'turret',
    'Increase Bomber Drone Bomb Radius': 'bomberdrone',
    'Increase Bomber Drone Bomb Damage': 'bomberdrone',
    'Activate Bomber Drone': 'bomberdrone',
    'Increase Freeze Duration': 'freeze',
    'Decrease Freeze Cooldown': 'freeze',
    'Activate Freeze Effect': 'freeze',
    'Increase Explosive Laser Level': 'explosive',
    'Activate Explosive Laser': 'explosive',
    'Increase Sonic Blast Range': 'sonic',
    'Increase Sonic Blast Damage': 'sonic',
    'Decrease Sonic Blast Cooldown': 'sonic',
    'Activate Sonic Blast': 'sonic',
    'Increase Boomerang Speed': 'boomerang',
    'Increase Boomerang Damage': 'boomerang',
    'Activate Boomerang': 'boomerang',
    'Increase Acid Bomb Duration': 'acid',
    'Decrease Acid Bomb Cooldown': 'acid',
    'Increase Acid Bomb Size': 'acid',
    'Activate Acid Bomb': 'acid',
    'Increase Drone Firerate': 'drone',
    'Activate Drone': 'drone',
    'Increase Death Ray Length': 'deathray',
    'Increase Death Ray Width': 'deathray',
    'Decrease Death Ray Cooldown': 'deathray',
    'Activate Death Ray': 'deathray',
    'Increase Explosive Rocket Damage': 'explosiverocket',
    'Increase Explosive Rocket Radius': 'explosiverocket',
    'Decrease Explosive Rocket Cooldown': 'explosiverocket',
    'Activate Explosive Rocket': 'explosiverocket',
    'Increase Chain Lightning Range': 'chainlightning',
    'Increase Chain Lightning Damage': 'chainlightning',
    'Increase Chain Lightning Bounces': 'chainlightning',
    'Decrease Chain Lightning Cooldown': 'chainlightning',
    'Activate Chain Lightning': 'chainlightning',
    'Boost Nano Swarm': 'nanoswarm',
    'Decrease Nano Swarm Cooldown': 'nanoswarm',
    'Activate Nano Swarm': 'nanoswarm',
    'Increase Flamethrower Range': 'flamethrower',
    'Increase Flamethrower Damage': 'flamethrower',
    'Decrease Flamethrower Cooldown': 'flamethrower',
    'Activate Flamethrower': 'flamethrower',
    'Extra Upgrade Choice': 'extra',
    'Drone Army': 'dronearmy',
    'Double Turret': 'doubleturret',
    'Triple Turret': 'tripleturret',
    'Damage Booster': 'damagebooster'
};

const icons = [
    'explosive', 'turret', 'drone', 'bomberdrone', 'sonic', 'deathray',
    'acid', 'boomerang', 'freeze', 'chainlightning', 'flamethrower', 'explosiverocket'
];

const gemImages = {
    common: new Image(),
    rare: new Image(),
    epic: new Image()
};

gemImages.common.src = 'icons/common_gem.png';
gemImages.rare.src = 'icons/rare_gem.png';
gemImages.epic.src = 'icons/epic_gem.png';

let activeGemUpgrades = null;
const unlockSound = new Audio('../sounds/levelUp.mp3');

// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');

let droppedGems = [];

const planetx = {
    x: 550,
    y: 450, // Fixed position 250px from the top of the screen
    radius: 50
};

function createIconElement(iconClass) {
    const icon = document.createElement('div');
    icon.classList.add('icon', `icon-${iconClass}`);
    icon.style.backgroundColor = 'white'; // Set white background for visibility
    icon.style.borderRadius = '50%'; // Make the icon round for better appearance
    icon.style.position = 'absolute';
    icon.style.width = '30px';
    icon.style.height = '30px';

    return icon;
}

function positionIcons() {
    const rouletteIcons = document.getElementById('rouletteIcons');
    rouletteIcons.innerHTML = '';

    const rouletteContainer = document.getElementById('rouletteContainer');
    const containerWidth = rouletteContainer.offsetWidth;
    const containerHeight = rouletteContainer.offsetHeight;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(containerWidth, containerHeight) * 0.4;

    icons.forEach((iconClass, index) => {
        const icon = createIconElement(iconClass);
        rouletteIcons.appendChild(icon);

        const angle = (index / icons.length) * (2 * Math.PI);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        icon.style.left = `${x - icon.offsetWidth / 2}px`;
        icon.style.top = `${y - icon.offsetHeight / 2}px`;
    });

    rouletteIcons.style.display = 'none';
}

function drawPlanetx() {
    const gradient = ctx.createRadialGradient(
        planetx.x,
        planetx.y,
        0,
        planetx.x,
        planetx.y,
        planetx.radius
    );
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)'); // Center color (solid red)
    gradient.addColorStop(1, 'rgba(128, 0, 0, 1)'); // Edge color (darker red)

    ctx.beginPath();
    ctx.arc(planetx.x, planetx.y, planetx.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}

function updateIconPositions(angle) {

    const rouletteIcons = document.getElementById('rouletteIcons').children;
    const rouletteContainer = document.getElementById('rouletteContainer');
    const containerWidth = rouletteContainer.offsetWidth;
    const containerHeight = rouletteContainer.offsetHeight;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const radius = Math.min(containerWidth, containerHeight) * 0.4;
    const angleStep = (2 * Math.PI) / icons.length;

    Array.from(rouletteIcons).forEach((icon, index) => {
        const currentAngle = angle + angleStep * index;
        const x = centerX + radius * Math.cos(currentAngle);
        const y = centerY + radius * Math.sin(currentAngle);

        icon.style.left = `${x - icon.offsetWidth / 2}px`;
        icon.style.top = `${y - icon.offsetHeight / 2}px`;
    });

}


function startRoulette() {
    const rouletteContainer = document.getElementById('rouletteContainer');
    rouletteContainer.style.display = 'flex';
    // rouletteContainer.style.display = 'block';
    // rouletteContainer.style.position = 'absolute';
    // rouletteContainer.style.top = '200px'; // Fix the position 250px from the top
    // rouletteContainer.style.left = `${canvas.width / 2 - 200}px`; // Adjust the left position to center the icons around the planet
    positionIcons(); // Position the icons when the roulette is started
    updateIconPositions(0); // Set initial positions of the icons
    rouletteIcons.style.display = 'block';

    const spinButton = document.getElementById('spinButton');
    spinButton.disabled = true;
    spinButton.style.display = 'none';

    // Add keyboard control indicator
    const keyboardHint = document.createElement('div');
    // keyboardHint.textContent = 'Press ENTER to activate upgrades';
    // keyboardHint.style.marginTop = '10px';
    // document.getElementById('rouletteContainer').appendChild(keyboardHint);


    //doublecheck that it didn't unpause
    clearInterval(gameLoop);
    isPaused = true;

    let angle = 0;
    const spinDuration = 2500; // Total spin duration
    const spinInterval = 20; // Interval for updating the rotation
    const totalRotations = 5; // Complete at least 5 rotations
    const totalSpins = totalRotations * 2 * Math.PI; // Total radians for 5 full rotations

    const spinSound = new Audio('sounds/upgrade_loop.mp3');
    if (!toggleSoundOff)
        spinSound.play();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createGemExplosion();


    const interval = setInterval(() => {
        angle += totalSpins / (spinDuration / spinInterval);
        updateIconPositions(angle);
        updateDisplayGems();
        drawDisplayGems();
        // too much
        if (angle >= totalSpins / 1.2) {
            createGemExplosion(.005);
        }
        // if (angle >= totalSpins / 2) {
        //     createGemExplosion(1.2);
        // }

        if (angle >= totalSpins) {
            clearInterval(interval);
            spinSound.pause();

            // Remove the planet from the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Get three random upgrades
            activeGemUpgrades = getRandomUpgrades(3);

            // Display the chosen upgrades and their icons
            const upgradeDisplay = document.getElementById('upgradeDisplay');
            upgradeDisplay.innerHTML = '';
            activeGemUpgrades.forEach((upgrade) => {
                const upgradeItem = document.createElement('div');
                upgradeItem.classList.add('upgrade-item');

                // const iconClass = upgradeIcons[upgrade];
                // const icon = createIconElement(iconClass);
                // upgradeItem.appendChild(icon);

                const upgradeText = document.createElement('div');
                upgradeText.classList.add('upgrade-text');
                upgradeText.textContent = upgrade;
                upgradeItem.appendChild(upgradeText);

                upgradeDisplay.appendChild(upgradeItem);
            });

            const okButton = document.createElement('button');
            okButton.textContent = 'Activate [ENTER]';
            okButton.onclick = () => {

                activateGemUpgrades();

            };
            upgradeDisplay.appendChild(okButton);

            spinButton.disabled = false;
        }
    }, spinInterval);
}

let displayGems = [];

function activateGemUpgrades() {

    applyUpgrades(activeGemUpgrades);
    activeGemUpgrades = null;
    spinButton.disabled = false;
    spinButton.style.display = 'block';
    rouletteContainer.style.display = 'none';
    upgradeDisplay.innerHTML = '';
    // keyboardHint.remove(); // Remove the keyboard hint

    isPaused = false;
    // unlockSound.play();
    displayGems = [];
    clearInterval(gameLoop);
    gameLoop = setInterval(update, 1000 / 60);

}

function createGemExplosion(angleBooster = 0) {

    const centerX = canvas.width / 2;
    const centerY = 250; // Same fixed position as planet
    const numGems = 50;
    const speed = 5;

    for (let i = 0; i < numGems; i++) {
        const angle = Math.random() * 2 * Math.PI + angleBooster;
        const gemType = ['common', 'rare', 'epic'][Math.floor(Math.random() * 3)]; // Random gem type
        const gem = {
            x: centerX,
            y: centerY,
            dx: speed * Math.cos(angle),
            dy: speed * Math.sin(angle),
            type: gemType,
            size: Math.random() * 10 + 10
        };
        displayGems.push(gem);
    }
}


function drawDisplayGems() {
    for (let i = 0; i < displayGems.length; i++) {
        let gem = displayGems[i];
        ctx.drawImage(gemImages[gem.type], gem.x - gem.size / 2, gem.y - gem.size / 2, gem.size, gem.size);
    }
}


function drawGems() {
    for (let i = 0; i < droppedGems.length; i++) {
        let gem = droppedGems[i];
        ctx.drawImage(gemImages[gem.type], gem.x - gem.size / 2, gem.y - gem.size / 2, gem.size, gem.size);
    }
}

function checkGemCollection() {
    for (let i = droppedGems.length - 1; i >= 0; i--) {
        let gem = droppedGems[i];
        let xpBoost = 0;

        if (isColliding(ship, gem)) {
            // Determine the XP boost based on the gem type
            playGemCollectingSound();
            switch (gem.type) {
                case 'common':
                    xpBoost = xpToNextLevel * 0.1; // 10% of XP to next level
                    if (testMode) {
                        clearInterval(gameLoop);
                        isPaused = true;
                        // drawPlanetx(); // Draw the planet
                        document.getElementById('rouletteContainer').style.display = 'block';
                    }

                    break;
                case 'rare':
                    xpBoost = xpToNextLevel * 0.6; // 25% of XP to next level
                    break;
                case 'epic':
                    // xpBoost = xpToNextLevel * 0.95; // 50% of XP to next level
                    clearInterval(gameLoop);
                    isPaused = true;
                    // drawPlanetx(); // Draw the planet
                    document.getElementById('rouletteContainer').style.display = 'block';
                    break;
            }

            // Increase the XP and check for level up
            increaseXp(xpBoost);
            updateXPBar();

            // Remove the collected gem
            droppedGems.splice(i, 1);
        }
    }
}

function updateDisplayGems() {
    const centerX = canvas.width / 2;
    const centerY = 100; // Same fixed position as planet
    const speedFactor = 0.2; // Adjust this factor to control the speed

    for (let i = 0; i < displayGems.length; i++) {
        let gem = displayGems[i];

        // Calculate the direction away from the center
        let directionX = gem.x - centerX;
        let directionY = gem.y - centerY;

        // Normalize the direction vector
        let distance = Math.sqrt(directionX * directionX + directionY * directionY);
        directionX /= distance;
        directionY /= distance;

        // Add a small amount of speed away from the center
        gem.dx += directionX * speedFactor;
        gem.dy += directionY * speedFactor;

        // Update gem position
        gem.x += gem.dx;
        gem.y += gem.dy;

        // Remove gems that go off-screen
        if (gem.x < 0 || gem.x > canvas.width || gem.y < 0 || gem.y > canvas.height) {
            displayGems.splice(i, 1);
            i--;
        }
    }
}


function updateGems() {
    const centerX = canvas.width / 2;
    const centerY = 250; // Same fixed position as planet
    const baseSpeedFactor = 0.05; // Adjust this value to control overall speed
    const minDistance = 5; // Minimum distance from center
    const maxSpeed = 2; // Maximum speed limit

    for (let i = 0; i < droppedGems.length; i++) {
        let gem = droppedGems[i];

        // Calculate the direction towards the center
        let directionX = centerX - gem.x;
        let directionY = centerY - gem.y;

        // Calculate distance
        let distance = Math.sqrt(directionX * directionX + directionY * directionY);

        if (distance > minDistance) {  // Only move if not too close to center
            // Normalize the direction vector
            directionX /= distance;
            directionY /= distance;

            // Speed increases with distance, but slows down near the center
            let speedFactor = baseSpeedFactor * (1 + distance / 100);

            // Set the velocity
            gem.dx = directionX * speedFactor;
            gem.dy = directionY * speedFactor;

            // Limit the speed
            let speed = Math.sqrt(gem.dx * gem.dx + gem.dy * gem.dy);
            if (speed > maxSpeed) {
                let scaleFactor = maxSpeed / speed;
                gem.dx *= scaleFactor;
                gem.dy *= scaleFactor;
            }

            // Update gem position
            gem.x += gem.dx;
            gem.y += gem.dy;
        } else {
            // If very close to center, set position to center
            gem.x = centerX;
            gem.y = centerY;
        }
    }
}
function applyUpgrades(upgrades) {
    upgrades.forEach(upgrade => {
        // Apply each upgrade logic here
        console.log(`Applying upgrade: ${upgrade}`);
        applyUpgrade(upgrade);
        // Example: applyUpgrade(upgrade); 
    });
}

// Call positionIcons to initially position the icons around the roulette wheel
positionIcons();

// Add draw loop to keep updating the canvas
// function draw() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     drawPlanetx();
//     drawGems();
//     requestAnimationFrame(draw);
// }

// draw();
