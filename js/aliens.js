const alienImage = new Image();
alienImage.src = 'icons/little_alien_ship_green.png';
const bossAlienImage = new Image();
bossAlienImage.src = 'icons/alien_boss_ship_green.png';

// Load swarming alien images
const swarmingAlienImages = [];
for (let i = 1; i <= 9; i++) {
    const img = new Image();
    img.src = `icons/swarm/swarming_alien_${i}_green.png`;
    swarmingAlienImages.push(img);
}

const SwarmingAlienTypes = {
    EASY: { hitpoints: 1, color: 'blue' },
    MEDIUM: { hitpoints: 3, color: 'orange' },
    HARD: { hitpoints: 5, color: 'red' }
};

let alien = null;
let alienLaser = null;
const alienLaserSpeed = 2.2;
const alienLaserSize = 4;
let superbossAlien = null;
let swarmingAliens = [];

let aliens = [];
let alienLasers = [];

function spawnAliens(wave) {

    if (testMode) {
        spawnSwarmingAliens(SwarmingAlienTypes.EASY, 70);
        // spawnSwarmingAliens(SwarmingAlienTypes.MEDIUM, 2);
    }


    if (wave % 7 == 0) {
        spawnSwarmingAliens(SwarmingAlienTypes.EASY, wave);
    }

    if (wave === 50) {
        spawnSuperBossAlien();

    }


    const aliensToSpawn = getAliensToSpawn(wave);
    // console.log(aliensToSpawn);
    if (aliensToSpawn > 0)
        playAlienEnteringSound();

    const cornerOffset = 50; // Adjust the offset value as needed
    const corners = [
        { x: 0, y: 0 }, // Top-left corner
        { x: canvas.width, y: 0 }, // Top-right corner
        { x: 0, y: canvas.height }, // Bottom-left corner
        { x: canvas.width, y: canvas.height } // Bottom-right corner
    ];

    for (let i = 0; i < aliensToSpawn; i++) {
        const cornerIndex = i % corners.length;
        const { x, y } = corners[cornerIndex];

        // Adding randomness to the spawn position
        const offsetX = Math.random() * cornerOffset - (cornerOffset / 2);
        const offsetY = Math.random() * cornerOffset - (cornerOffset / 2);

        let newAlien = {
            x: x + offsetX,
            y: y + offsetY,
            size: 30,
            speed: 0.5,
            direction: Math.random() * Math.PI * 2,
            shootTimer: 0,
            hitpoints: 1,
            shootInterval: 150 // Adjust this value as needed
        };

        aliens.push(newAlien);
    }
}

function getAliensToSpawn(wave) {
    let booster = 0;
    if (currentMode == GameModes.NORMAL)
        booster++;
    else if (currentMode == GameModes.HARD)
        booster += 2;
    else if (currentMode == GameModes.HERO)
        booster += 3;

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
    // if (wave > 0) return 4;
    return 0;
}


function updateAliens() {
    if (!freezeEffect.active) {
        aliens.forEach(alien => {
            const dx = ship.x - alien.x;
            const dy = ship.y - alien.y;
            const angle = Math.atan2(dy, dx);

            alien.x += Math.cos(angle) * alien.speed;
            alien.y += Math.sin(angle) * alien.speed;

            alien.shootTimer++;
            if (alien.shootTimer >= alien.shootInterval) {
                alien.shootTimer = 0;
                shootAlienLaser(alien);
                playAlienLaserSound();
            }

            // Wrap the alien around the screen edges
            if (alien.x < 0) alien.x = canvas.width;
            else if (alien.x > canvas.width) alien.x = 0;
            if (alien.y < 0) alien.y = canvas.height;
            else if (alien.y > canvas.height) alien.y = 0;
        });
    }
}

function spawnSuperBossAlien() {

    const laughSound = new Audio('sounds/alien_laugh3.mp3');
    laughSound.play();


    superbossAlien = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 100,
        speed: 0.3,
        direction: Math.random() * Math.PI * 2,
        shootTimer: 0,
        spawnTimer: 0,
        hitpoints: 5000,
        maxHitpoints: 5000,
        shootInterval: 100 // Adjust this value as needed
    };
    aliens.push(superbossAlien);
}


function updateSuperBossAlien() {
    if (!superbossAlien) return;
    if (!freezeEffect.active) {
        // Calculate direction towards the ship
        const dx = ship.x - superbossAlien.x;
        const dy = ship.y - superbossAlien.y;
        const angle = Math.atan2(dy, dx);

        // Update alien's position based on the new direction
        superbossAlien.x += Math.cos(angle) * superbossAlien.speed;
        superbossAlien.y += Math.sin(angle) * superbossAlien.speed;

        // Update alien's shooting timer
        superbossAlien.shootTimer++;
        if (superbossAlien.shootTimer >= superbossAlien.shootInterval) {
            superbossAlien.shootTimer = 0;
            shootSuperBossAlienLaser();
        }

        // Update alien's spawn timer
        superbossAlien.spawnTimer++;
        if (superbossAlien.spawnTimer >= 180) { // Spawn every 3 seconds (assuming 60 FPS)
            superbossAlien.spawnTimer = 0;
            spawnLittleAliensAroundBoss();
        }

        // Wrap the alien around the screen edges
        if (superbossAlien.x < 0) superbossAlien.x = canvas.width;
        else if (superbossAlien.x > canvas.width) superbossAlien.x = 0;
        if (superbossAlien.y < 0) superbossAlien.y = canvas.height;
        else if (superbossAlien.y > canvas.height) superbossAlien.y = 0;
    }
}


function shootSuperBossAlienLaser() {
    if (!superbossAlien) return;
    const spread = 5; // Number of lasers in a spread
    const spreadAngle = Math.PI / 4; // Spread angle in radians
    const angleToShip = Math.atan2(ship.y - superbossAlien.y, ship.x - superbossAlien.x);

    for (let i = 0; i < spread; i++) {
        const angle = angleToShip + (i - Math.floor(spread / 2)) * (spreadAngle / spread);

        alienLasers.push({
            x: superbossAlien.x,
            y: superbossAlien.y,
            dx: Math.cos(angle) * alienLaserSpeed,
            dy: Math.sin(angle) * alienLaserSpeed
        });
    }
}


function drawSuperBossAlien() {
    if (!superbossAlien) return;
    ctx.save();
    ctx.translate(superbossAlien.x, superbossAlien.y);
    ctx.drawImage(bossAlienImage, -superbossAlien.size / 2, -superbossAlien.size / 2, superbossAlien.size, superbossAlien.size);
    ctx.restore();
    drawBossHitpointBar();
}

function drawBossHitpointBar() {
    if (!superbossAlien) return;

    const barWidth = canvas.width * 0.8; // 80% of the canvas width
    const barHeight = 20;
    const barX = (canvas.width - barWidth) / 2;
    const barY = canvas.height - barHeight - 10; // 10 pixels from the bottom

    const hpRatio = superbossAlien.hitpoints / superbossAlien.maxHitpoints;
    const filledBarWidth = barWidth * hpRatio;

    // Draw the background of the hitpoint bar
    ctx.fillStyle = 'grey';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Draw the filled part of the hitpoint bar
    ctx.fillStyle = 'red';
    ctx.fillRect(barX, barY, filledBarWidth, barHeight);

    // Draw the border of the hitpoint bar
    ctx.strokeStyle = 'black';
    ctx.strokeRect(barX, barY, barWidth, barHeight);

}


function spawnLittleAliensAroundBoss() {
    const numberOfAliens = 4;
    const radius = 150;

    for (let i = 0; i < numberOfAliens; i++) {
        const angle = (i * 2 * Math.PI) / numberOfAliens;
        let newAlien = {
            x: superbossAlien.x + Math.cos(angle) * radius,
            y: superbossAlien.y + Math.sin(angle) * radius,
            size: 30,
            speed: 0.5,
            direction: Math.random() * Math.PI * 2,
            shootTimer: 0,
            hitpoints: 15,
            shootInterval: 150 // Adjust this value as needed
        };
        aliens.push(newAlien);
    }
}


// function drawAliens() {
//     aliens.forEach(alien => {
//         ctx.save();
//         ctx.translate(alien.x, alien.y);
//         ctx.drawImage(alienImage, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
//         ctx.restore();
//     });
// }

function drawAliens() {
    aliens.forEach(alien => {
        ctx.save();
        ctx.translate(alien.x, alien.y);
        ctx.drawImage(alienImage, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
        ctx.restore();
    });
}

function shootAlienLaser(alien) {
    const dx = ship.x - alien.x;
    const dy = ship.y - alien.y;
    const angle = Math.atan2(dy, dx);

    alienLasers.push({
        x: alien.x,
        y: alien.y,
        dx: Math.cos(angle) * alienLaserSpeed,
        dy: Math.sin(angle) * alienLaserSpeed
    });
}

function updateAlienLasers() {

    for (let i = alienLasers.length - 1; i >= 0; i--) {
        const laser = alienLasers[i];
        laser.x += laser.dx;
        laser.y += laser.dy;

        if (!invincible && isColliding(laser, ship)) {

            createExplosion(ship.x, ship.y);
            resetShip();
            lives--;
            playShipDestroyedSound();
            invincible = true;
            invincibilityTimer = invincibilityDuration;
            if (lives === 0) gameOver = true;
            return;
        }


        // Remove the laser if it goes off-screen
        if (laser.x < 0 || laser.x > canvas.width || laser.y < 0 || laser.y > canvas.height) {
            alienLasers.splice(i, 1);
        }
    }
}

function drawAlienLasers() {
    alienLasers.forEach(laser => {
        ctx.fillStyle = 'purple';
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, alienLaserSize, 0, Math.PI * 2);
        ctx.fill();
    });
}


function shootAlienLaser(alien) {
    const dx = ship.x - alien.x;
    const dy = ship.y - alien.y;
    const angle = Math.atan2(dy, dx);

    alienLasers.push({
        x: alien.x,
        y: alien.y,
        dx: Math.cos(angle) * alienLaserSpeed,
        dy: Math.sin(angle) * alienLaserSpeed
    });
}


function drawAlienLasers() {
    alienLasers.forEach(laser => {
        ctx.fillStyle = 'purple';
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, alienLaserSize, 0, Math.PI * 2);
        ctx.fill();
    });
}

function updateBossAlien() {
    if (!alien) return;
    if (!freezeEffect.active) {

        // Calculate direction towards the ship
        const dx = ship.x - alien.x;
        const dy = ship.y - alien.y;
        const angle = Math.atan2(dy, dx);

        // Update alien's position based on the new direction
        alien.x += Math.cos(angle) * alien.speed;
        alien.y += Math.sin(angle) * alien.speed;

        // Update alien's shooting timer
        alien.shootTimer++;
        if (alien.shootTimer >= alien.shootInterval) {
            alien.shootTimer = 0;
            shootBossAlienLaser();
        }

        // Wrap the alien around the screen edges
        if (alien.x < 0) alien.x = canvas.width;
        else if (alien.x > canvas.width) alien.x = 0;
        if (alien.y < 0) alien.y = canvas.height;
        else if (alien.y > canvas.height) alien.y = 0;
    }
}

function drawBossAlien() {
    if (!alien) return;
    // console.log("drawing alien");
    ctx.save();
    ctx.translate(alien.x, alien.y);
    ctx.drawImage(bossAlienImage, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
    ctx.restore();
}

function shootBossAlienLaser() {
    if (!alien) return;
    // console.log("shooting laser");
    const dx = ship.x - alien.x;
    const dy = ship.y - alien.y;
    const angle = Math.atan2(dy, dx);

    alienLaser = {
        x: alien.x,
        y: alien.y,
        dx: Math.cos(angle) * alienLaserSpeed,
        dy: Math.sin(angle) * alienLaserSpeed
    };
}

function updateBossAlienLaser() {
    if (!alienLaser) return;

    alienLaser.x += alienLaser.dx;
    alienLaser.y += alienLaser.dy;

    if (!invincible && isColliding(alienLaser, ship)) {
        alienLaser = null;
        createExplosion(ship.x, ship.y);
        resetShip();
        lives--;
        playShipDestroyedSound();
        invincible = true;
        invincibilityTimer = invincibilityDuration;
        if (lives === 0) gameOver = true;
        return;
    }


    // Remove the laser if it goes off-screen
    if (
        alienLaser.x < 0 ||
        alienLaser.x > canvas.width ||
        alienLaser.y < 0 ||
        alienLaser.y > canvas.height
    ) {
        alienLaser = null;
    }
}

function drawBossAlienLaser() {
    if (!alienLaser) return;

    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(alienLaser.x, alienLaser.y, 6, 0, Math.PI * 2);
    ctx.fill();
}

function updateSuperBossAlienLasers() {
    for (let i = alienLasers.length - 1; i >= 0; i--) {
        const laser = alienLasers[i];
        laser.x += laser.dx;
        laser.y += laser.dy;

        if (!invincible && isColliding(laser, ship)) {
            createExplosion(ship.x, ship.y);
            resetShip();
            lives--;
            playShipDestroyedSound();
            invincible = true;
            invincibilityTimer = invincibilityDuration;
            if (lives === 0) gameOver = true;
            return;
        }

        // Remove the laser if it goes off-screen
        if (laser.x < 0 || laser.x > canvas.width || laser.y < 0 || laser.y > canvas.height) {
            alienLasers.splice(i, 1);
        }
    }
}

function drawSuperBossAlienLasers() {
    alienLasers.forEach(laser => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, 6, 0, Math.PI * 2);
        ctx.fill();
    });
}

// New functions for swarming aliens
function spawnSwarmingAliens(type, count) {
    const alienSize = 20;
    const spacing = 2; // 2 pixels in between each alien
    const totalSize = alienSize + spacing; // Total size including spacing

    // Determine the number of aliens per row/column for the clump
    const clumpWidth = Math.ceil(Math.sqrt(count));

    // Choose a random edge of the map
    const edge = Math.floor(Math.random() * 4);
    let startX, startY;

    switch (edge) {
        case 0: // Top edge
            startX = Math.random() * canvas.width;
            startY = 0;
            break;
        case 1: // Bottom edge
            startX = Math.random() * canvas.width;
            startY = canvas.height;
            break;
        case 2: // Left edge
            startX = 0;
            startY = Math.random() * canvas.height;
            break;
        case 3: // Right edge
            startX = canvas.width;
            startY = Math.random() * canvas.height;
            break;
    }

    for (let i = 0; i < count; i++) {
        let row = Math.floor(i / clumpWidth);
        let col = i % clumpWidth;
        let offsetX = col * totalSize;
        let offsetY = row * totalSize;

        let newSwarmingAlien = {
            x: startX + offsetX,
            y: startY + offsetY,
            size: alienSize,
            speed: 0.15,
            direction: Math.random() * Math.PI * 2,
            hitpoints: type.hitpoints,
            type: type,
            image: swarmingAlienImages[Math.floor(Math.random() * swarmingAlienImages.length)]
        };

        // Ensure the alien stays within the canvas bounds
        if (newSwarmingAlien.x >= canvas.width) newSwarmingAlien.x = canvas.width - alienSize;
        if (newSwarmingAlien.x < 0) newSwarmingAlien.x = 0;
        if (newSwarmingAlien.y >= canvas.height) newSwarmingAlien.y = canvas.height - alienSize;
        if (newSwarmingAlien.y < 0) newSwarmingAlien.y = 0;

        swarmingAliens.push(newSwarmingAlien);
    }
}

function updateSwarmingAliens() {
    if (!freezeEffect.active) {
        swarmingAliens.forEach(alien => {
            const dx = ship.x - alien.x;
            const dy = ship.y - alien.y;
            const angle = Math.atan2(dy, dx);

            alien.x += Math.cos(angle) * alien.speed;
            alien.y += Math.sin(angle) * alien.speed;

            // Check for incoming projectiles
            alienLasers.forEach(laser => {
                const laserDx = laser.dx;
                const laserDy = laser.dy;
                const laserAngle = Math.atan2(laserDy, laserDx);
                const distance = Math.hypot(alien.x - laser.x, alien.y - laser.y);
                const angleDifference = Math.abs(laserAngle - angle);

                if (distance < 100 && angleDifference < Math.PI / 6) { // If laser is close and within a certain angle range
                    alien.x += Math.cos(laserAngle + Math.PI / 2) * alien.speed;
                    alien.y += Math.sin(laserAngle + Math.PI / 2) * alien.speed;
                }
            });

            // Check for collision with player
            if (!invincible && isColliding(alien, ship)) {
                createExplosion(ship.x, ship.y);
                resetShip();
                lives--;
                playShipDestroyedSound();
                invincible = true;
                invincibilityTimer = invincibilityDuration;
                if (lives === 0) gameOver = true;
                return;
            }

            // Wrap the alien around the screen edges
            if (alien.x < 0) alien.x = canvas.width;
            else if (alien.x > canvas.width) alien.x = 0;
            if (alien.y < 0) alien.y = canvas.height;
            else if (alien.y > canvas.height) alien.y = 0;
        });
    }
}

function drawSwarmingAliens() {
    swarmingAliens.forEach(alien => {
        ctx.save();
        ctx.translate(alien.x, alien.y);
        ctx.drawImage(alien.image, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
        ctx.restore();
    });
}

