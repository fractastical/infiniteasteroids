const alienImage = new Image();
alienImage.src = 'icons/little_alien_ship_green.png';
const bossAlienImage = new Image();
bossAlienImage.src = 'icons/alien_boss_ship_green.png';
const superBossAlienImage = new Image();
superBossAlienImage.src = 'icons/cool_evil_alien_22.png';
const megaBossAlienImage = new Image();
megaBossAlienImage.src = 'icons/cool_evil_alien_22.png';


// Load swarming alien images
const swarmingAlienImages = [];
for (let i = 1; i <= 9; i++) {
    const img = new Image();
    img.src = `icons/swarm/swarming_alien_${i}_green.png`;
    swarmingAlienImages.push(img);
}

const SwarmingAlienTypes = {
    TOP: { hitpoints: 1, color: 'blue', speed: 0.5, direction: 1 },  // direction 1 means downward
    BOTTOM: { hitpoints: 1, color: 'red', speed: 0.3, direction: -1 },  // direction -1 means upward
    HORIZONTAL: { hitpoints: 2, color: 'green', speed: 0.4, shootInterval: 250 },
    HUNTING: { hitpoints: 1, color: 'yellow', speed: 0.15 },  // New type for the original following aliens
    LITTLE: { hitpoints: 15, color: 'purple', speed: 0.5, shootInterval: 180 }  // New type for little aliens around boss
};

let alien = null;
let alienLaser = null;
const alienLaserSpeed = 2.2;
const alienLaserSize = 4;
let superbossAlien = null;
let megaBossAlien = null;
let swarmingAliens = [];

let aliens = [];
let alienLasers = [];
let octoMode = false;

function spawnAliens(wave) {

    if (testMode) {
        spawnSwarmingAliens(SwarmingAlienTypes.TOP, 10);
        spawnSwarmingAliens(SwarmingAlienTypes.BOTTOM, 10);
        // spawnSuperBossAlien();
        spawnHuntingAliens(10);

    }

    if (octoMode) {

        spawnOcto();

    }

    if (wave % 9 == 0) {
        const totalAliensToSpawn = wave;
        const topAliens = Math.floor(totalAliensToSpawn * 0.5);
        const bottomAliens = Math.floor(totalAliensToSpawn * 0.5);
        spawnHuntingAliens(wave);
        spawnSwarmingAliens(SwarmingAlienTypes.TOP, topAliens);
        spawnSwarmingAliens(SwarmingAlienTypes.BOTTOM, bottomAliens);
    }


    if (wave % 7 == 0) {


        spawnHuntingAliens(wave);

    }

    if (wave == 50) {
        spawnSuperBossAlien();
    }

    if (wave == 75) {
        spawnMegaBossAlien();
    }

    const aliensToSpawn = getAliensToSpawn(wave);
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
            type: SwarmingAlienTypes.LITTLE,
            hitpoints: 1,
            shootInterval: 220 // Adjust this value as needed
        };

        aliens.push(newAlien);
    }
}

function spawnHuntingAliens(count) {
    const alienSize = 20;
    const corners = [
        { x: 0, y: 0 },
        { x: canvas.width, y: 0 },
        { x: 0, y: canvas.height },
        { x: canvas.width, y: canvas.height }
    ];
    const cornerOffset = 50;

    for (let i = 0; i < count; i++) {
        const cornerIndex = i % corners.length;
        const { x, y } = corners[cornerIndex];

        const offsetX = Math.random() * cornerOffset - (cornerOffset / 2);
        const offsetY = Math.random() * cornerOffset - (cornerOffset / 2);

        let newHuntingAlien = {
            x: x + offsetX,
            y: y + offsetY,
            size: alienSize,
            speed: SwarmingAlienTypes.HUNTING.speed,
            hitpoints: SwarmingAlienTypes.HUNTING.hitpoints,
            type: SwarmingAlienTypes.HUNTING,
            image: alienImage  // Assuming you have an image for this type
        };

        aliens.push(newHuntingAlien);
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
    return 0;
}

function updateAliens() {
    if (!freezeEffect.active) {
        let dropHorizontalSwarm = false;

        aliens.forEach(alien => {
            switch (alien.type) {
                case SwarmingAlienTypes.HUNTING:
                    // Hunting aliens follow the player
                    const dx = ship.x - alien.x;
                    const dy = ship.y - alien.y;
                    const angle = Math.atan2(dy, dx);

                    alien.x += Math.cos(angle) * alien.speed;
                    alien.y += Math.sin(angle) * alien.speed;

                    // Wrap around screen edges
                    if (alien.x < 0) alien.x = canvas.width;
                    else if (alien.x > canvas.width) alien.x = 0;
                    if (alien.y < 0) alien.y = canvas.height;
                    else if (alien.y > canvas.height) alien.y = 0;
                    break;

                case SwarmingAlienTypes.TOP:
                case SwarmingAlienTypes.BOTTOM:
                    // Vertical movement
                    alien.y += alien.speed * alien.direction;

                    // Wrap around vertically
                    if (alien.y > canvas.height) {
                        alien.y = -alien.size;
                    } else if (alien.y < -alien.size) {
                        alien.y = canvas.height;
                    }

                    // Shooting logic
                    alien.shootTimer++;
                    if (alien.shootTimer >= alien.shootInterval) {
                        alien.shootTimer = 0;
                        shootAlienLaser(alien);
                        alien.shootInterval = Math.random() * 4000 + 1000; // Reset shoot interval
                    }
                    break;

                case SwarmingAlienTypes.HORIZONTAL:
                    // Horizontal movement
                    if (frameCount % horizontalSwarmMoveInterval === 0) {
                        alien.x += horizontalSwarmDirection * alien.speed;

                        if (alien.x <= 0 || alien.x >= canvas.width - alien.size) {
                            dropHorizontalSwarm = true;
                        }
                    }

                    // Shooting logic
                    alien.shootTimer++;
                    if (alien.shootTimer >= alien.shootInterval) {
                        alien.shootTimer = 0;
                        shootAlienLaser(alien);
                    }
                    break;

                case SwarmingAlienTypes.LITTLE:
                    // Little aliens around bosses
                    const dxLittle = ship.x - alien.x;
                    const dyLittle = ship.y - alien.y;
                    const angleLittle = Math.atan2(dyLittle, dxLittle);

                    alien.x += Math.cos(angleLittle) * alien.speed;
                    alien.y += Math.sin(angleLittle) * alien.speed;

                    // Wrap around screen edges
                    if (alien.x < 0) alien.x = canvas.width;
                    else if (alien.x > canvas.width) alien.x = 0;
                    if (alien.y < 0) alien.y = canvas.height;
                    else if (alien.y > canvas.height) alien.y = 0;

                    // Shooting logic
                    alien.shootTimer++;
                    if (alien.shootTimer >= alien.shootInterval) {
                        alien.shootTimer = 0;
                        shootAlienLaser(alien);
                        alien.shootInterval = Math.random() * 4000 + 1000; // Reset shoot interval
                    }
                    break;


            }

            // Collision with player (for all alien types)
            if (!invincible && isColliding(alien, ship)) {
                processPlayerDeath();
            }
        });

        // Drop horizontal swarm if needed
        if (dropHorizontalSwarm) {
            horizontalSwarmDirection *= -1;
            aliens.forEach(alien => {
                if (alien.type === SwarmingAlienTypes.HORIZONTAL) {
                    alien.y += horizontalSwarmDropDistance;
                }
            });
        }
    }
}

function spawnSuperBossAlien() {
    const laughSound = new Audio('sounds/alien_laugh3.mp3');
    if (!toggleSoundOff)
        laughSound.play();

    superbossAlien = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 80,
        speed: 0.3,
        direction: Math.random() * Math.PI * 2,
        shootTimer: 0,
        spawnTimer: 0,
        hitpoints: 5000,
        maxHitpoints: 5000,
        shootInterval: 220 // Adjust this value as needed
    };

    if (testMode)
        superbossAlien.hitpoints = 20;

    aliens.push(superbossAlien);
}

function updateSuperBossAlien() {
    if (!superbossAlien) return;
    if (!freezeEffect.active) {
        const dx = ship.x - superbossAlien.x;
        const dy = ship.y - superbossAlien.y;
        const angle = Math.atan2(dy, dx);

        superbossAlien.x += Math.cos(angle) * superbossAlien.speed;
        superbossAlien.y += Math.sin(angle) * superbossAlien.speed;

        superbossAlien.shootTimer++;
        if (superbossAlien.shootTimer >= superbossAlien.shootInterval) {
            superbossAlien.shootTimer = 0;
            shootSuperBossAlienLaser();
        }

        superbossAlien.spawnTimer++;
        if (superbossAlien.spawnTimer >= 250) {
            superbossAlien.spawnTimer = 0;
            spawnLittleAliensAroundSuperBoss();
        }

        if (superbossAlien.x < 0) superbossAlien.x = canvas.width;
        else if (superbossAlien.x > canvas.width) superbossAlien.x = 0;
        if (superbossAlien.y < 0) superbossAlien.y = canvas.height;
        else if (superbossAlien.y > canvas.height) superbossAlien.y = 0;
    }
}

function shootSuperBossAlienLaser() {
    if (!superbossAlien) return;
    const spread = 5;
    const spreadAngle = Math.PI / 4;
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
    ctx.drawImage(superBossAlienImage, -superbossAlien.size / 2, -superbossAlien.size / 2, superbossAlien.size, superbossAlien.size);
    ctx.restore();
    drawSuperBossHitpointBar();
}

function spawnMegaBossAlien() {
    const laughSound = new Audio('sounds/alien_laugh3.mp3');
    if (!toggleSoundOff)
        laughSound.play();

    megaBossAlien = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 140,
        speed: 0.2,
        direction: Math.random() * Math.PI * 2,
        shootTimer: 0,
        spawnTimer: 0,
        hitpoints: 10000,
        maxHitpoints: 10000,
        shootInterval: 100 // Adjust this value as needed
    };
    aliens.push(megaBossAlien);
}


function shootMegaBossAlienLaser() {
    if (!megaBossAlien) return;
    const spread = 7;
    const spreadAngle = Math.PI / 3;
    const angleToShip = Math.atan2(ship.y - megaBossAlien.y, ship.x - megaBossAlien.x);

    for (let i = 0; i < spread; i++) {
        const angle = angleToShip + (i - Math.floor(spread / 2)) * (spreadAngle / spread);

        alienLasers.push({
            x: megaBossAlien.x,
            y: megaBossAlien.y,
            dx: Math.cos(angle) * alienLaserSpeed,
            dy: Math.sin(angle) * alienLaserSpeed
        });
    }
}


function drawBossAlien() {
    if (!alien) return;
    ctx.save();
    ctx.translate(alien.x, alien.y);
    ctx.drawImage(bossAlienImage, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
    ctx.restore();
    // drawBossHitpointBar();
}

function drawMegaBossAlien() {
    if (!megaBossAlien) return;
    ctx.save();
    ctx.translate(megaBossAlien.x, megaBossAlien.y);
    ctx.drawImage(bossAlienImage, -megaBossAlien.size / 2, -megaBossAlien.size / 2, megaBossAlien.size, megaBossAlien.size);
    ctx.restore();
    drawMegaBossHitpointBar();
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

function drawAliens() {
    aliens.forEach(alien => {
        ctx.save();
        ctx.translate(alien.x, alien.y);
        if (alien.image)
            ctx.drawImage(alien.image, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
        else
            ctx.drawImage(alienImage, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
        ctx.restore();
    });
}

function updateMegaBossAlien() {
    if (!megaBossAlien) return;
    if (!freezeEffect.active) {
        // Calculate direction towards the ship
        const dx = ship.x - megaBossAlien.x;
        const dy = ship.y - megaBossAlien.y;
        const angle = Math.atan2(dy, dx);

        // Update alien's position based on the new direction
        megaBossAlien.x += Math.cos(angle) * megaBossAlien.speed;
        megaBossAlien.y += Math.sin(angle) * megaBossAlien.speed;

        // Update alien's shooting timer
        megaBossAlien.shootTimer++;
        if (megaBossAlien.shootTimer >= megaBossAlien.shootInterval) {
            megaBossAlien.shootTimer = 0;
            shootMegaBossAlienLaser();
        }

        // Update alien's spawn timer
        megaBossAlien.spawnTimer++;
        if (megaBossAlien.spawnTimer >= 180) { // Spawn every 3 seconds (assuming 60 FPS)
            megaBossAlien.spawnTimer = 0;
            spawnLittleAliensAroundMegaBoss();
        }

        // Wrap the alien around the screen edges
        if (megaBossAlien.x < 0) megaBossAlien.x = canvas.width;
        else if (megaBossAlien.x > canvas.width) megaBossAlien.x = 0;
        if (megaBossAlien.y < 0) megaBossAlien.y = canvas.height;
        else if (megaBossAlien.y > canvas.height) megaBossAlien.y = 0;
    }
}


function drawSuperBossHitpointBar() {
    if (!superbossAlien) return;

    const barWidth = canvas.width * 0.8;
    const barHeight = 20;
    const barX = (canvas.width - barWidth) / 2;
    const barY = canvas.height - barHeight - 10;

    const hpRatio = superbossAlien.hitpoints / superbossAlien.maxHitpoints;
    const filledBarWidth = barWidth * hpRatio;

    ctx.fillStyle = 'grey';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    ctx.fillStyle = 'red';
    ctx.fillRect(barX, barY, filledBarWidth, barHeight);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}


function drawMegaBossHitpointBar() {
    if (!megaBossAlien) return;

    const barWidth = canvas.width * 0.8;
    const barHeight = 20;
    const barX = (canvas.width - barWidth) / 2;
    const barY = canvas.height - barHeight - 10;

    const hpRatio = megaBossAlien.hitpoints / megaBossAlien.maxHitpoints;
    const filledBarWidth = barWidth * hpRatio;

    ctx.fillStyle = 'grey';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    ctx.fillStyle = 'red';
    ctx.fillRect(barX, barY, filledBarWidth, barHeight);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}


function spawnLittleAliensAroundSuperBoss() {
    const numberOfAliens = 4;
    const radius = 150;

    for (let i = 0; i < numberOfAliens; i++) {
        const angle = (i * 2 * Math.PI) / numberOfAliens;
        let newAlien = {
            x: superbossAlien.x + Math.cos(angle) * radius,
            y: superbossAlien.y + Math.sin(angle) * radius,
            size: 25,
            speed: 0.5,
            direction: Math.random() * Math.PI * 2,
            shootTimer: 0,
            type: SwarmingAlienTypes.LITTLE,
            hitpoints: 15,
            shootInterval: 180
        };
        aliens.push(newAlien);
    }
}

function spawnLittleAliensAroundMegaBoss() {

    const numberOfAliens = 6;
    const radius = 250;

    for (let i = 0; i < numberOfAliens; i++) {
        const angle = (i * 2 * Math.PI) / numberOfAliens;
        let newAlien = {
            x: megaBossAlien.x + Math.cos(angle) * radius,
            y: megaBossAlien.y + Math.sin(angle) * radius,
            size: 30,
            speed: 0.5,
            direction: Math.random() * Math.PI * 2,
            shootTimer: 0,
            type: SwarmingAlienTypes.LITTLE,
            hitpoints: 30,
            shootInterval: 120
        };
        aliens.push(newAlien);
    }
}

function updateAlienLasers() {
    for (let i = alienLasers.length - 1; i >= 0; i--) {
        const laser = alienLasers[i];
        laser.x += laser.dx;
        laser.y += laser.dy;

        if (!invincible && isColliding(laser, ship)) {
            processPlayerDeath();
        }

        if (laser.x < 0 || laser.x > canvas.width || laser.y < 0 || laser.y > canvas.height) {
            alienLasers.splice(i, 1);
        }
    }
}

function drawAlienLasers() {
    alienLasers.forEach(laser => {
        ctx.fillStyle = 'pink';
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, alienLaserSize, 0, Math.PI * 2);
        ctx.fill();
    });
}

function shootAlienLaser(alien) {
    let laserSpeed = alienLaserSpeed;
    let laserDx = 0;
    let laserDy = 0;

    if (alien.type === SwarmingAlienTypes.TOP) {
        // laserDy = laserSpeed; // Downward
        laserDx = 1;
        // if (alien.x < canvas.width / 2) {
        //     laserDx = laserSpeed; // Rightward
        // } else {
        //     laserDx = -laserSpeed; // Leftward
        // }

    } else if (alien.type === SwarmingAlienTypes.BOTTOM) {

        if (alien.x < canvas.width / 2) {
            laserDx = laserSpeed; // Rightward
        } else {
            laserDx = -laserSpeed; // Leftward
        }

        // laserDy = -laserSpeed; // Upward
    } else if (alien.type === SwarmingAlienTypes.HORIZONTAL) {
        // Determine horizontal laser direction based on position
        if (alien.x < canvas.width / 2) {
            laserDx = laserSpeed; // Rightward
        } else {
            laserDx = -laserSpeed; // Leftward
        }
    } else {
        laserDy = laserSpeed; // Default to downward for unknown types
    }

    const laser = {
        x: alien.x + alien.size / 2,
        y: alien.y + (laserDy !== 0 ? (laserDy > 0 ? alien.size : 0) : alien.size / 2),
        dx: laserDx,
        dy: laserDy
    };

    alienLasers.push(laser);
    playAlienLaserSound();
}

function shootBossAlienLaser() {
    if (!alien) return;
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

function drawBossAlienLaser() {
    if (!alienLaser) return;

    ctx.fillStyle = 'pink';
    ctx.beginPath();
    ctx.arc(alienLaser.x, alienLaser.y, 6, 0, Math.PI * 2);
    ctx.fill();
}

function updateBossAlienLaser() {
    if (!alienLaser) return;

    alienLaser.x += alienLaser.dx;
    alienLaser.y += alienLaser.dy;

    if (!invincible && isColliding(alienLaser, ship)) {
        processPlayerDeath();
    }

    if (alienLaser.x < 0 || alienLaser.x > canvas.width || alienLaser.y < 0 || alienLaser.y > canvas.height) {
        alienLaser = null;
    }
}

function updateSuperBossAlienLasers() {
    for (let i = alienLasers.length - 1; i >= 0; i--) {
        const laser = alienLasers[i];
        laser.x += laser.dx;
        laser.y += laser.dy;

        if (!invincible && isColliding(laser, ship)) {
            processPlayerDeath();
        }

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

// function updateSwarmingAliens() {
//     if (!freezeEffect.active) {
//         swarmingAliens.forEach(alien => {
//             // Move vertically
//             alien.y += alien.speed * alien.direction;

//             // Wrap around vertically
//             if (alien.y > canvas.height) {
//                 alien.y = -alien.size;
//             } else if (alien.y < -alien.size) {
//                 alien.y = canvas.height;
//             }

//             // Shooting logic
//             alien.shootTimer++;
//             if (alien.shootTimer >= alien.shootInterval) {
//                 alien.shootTimer = 0;
//                 shootSwarmingAlienLaser(alien);
//                 // Reset shoot interval
//                 alien.shootInterval = Math.random() * 4000 + 1000;
//             }

//             // Collision with player
//             if (!invincible && isColliding(alien, ship)) {
//                 processPlayerDeath();
//             }
//         });
//     }
// }


// function shootSwarmingAlienLaser(alien) {
//     const laser = {
//         x: alien.x + alien.size / 2,
//         y: alien.y + (alien.direction === 1 ? alien.size : 0),
//         dx: 0,
//         dy: alienLaserSpeed * alien.direction
//     };
//     alienLasers.push(laser);
//     playAlienLaserSound();
// }


function spawnSwarmingAliens(type, count) {
    const alienSize = 20;
    const spacing = 6;
    const totalSize = alienSize + spacing;
    const clumpWidth = Math.ceil(Math.sqrt(count));

    let startY;
    if (type === SwarmingAlienTypes.TOP) {
        startY = 0;
    } else {
        startY = canvas.height - alienSize;
    }

    for (let i = 0; i < count; i++) {
        let row = Math.floor(i / clumpWidth);
        let col = i % clumpWidth;
        let offsetX = col * totalSize;
        let offsetY = row * totalSize * type.direction;

        let newSwarmingAlien = {
            x: offsetX,
            y: startY + offsetY,
            size: alienSize,
            speed: type.speed,
            direction: type.direction,
            hitpoints: type.hitpoints,
            type: type,
            image: swarmingAlienImages[Math.floor(Math.random() * swarmingAlienImages.length)],
            shootTimer: 0,
            shootInterval: Math.random() * 4000 + 1000  // Random interval between 1000 and 5000
        };

        // Ensure the alien stays within the canvas bounds
        if (newSwarmingAlien.x >= canvas.width) newSwarmingAlien.x = canvas.width - alienSize;
        if (newSwarmingAlien.x < 0) newSwarmingAlien.x = 0;

        aliens.push(newSwarmingAlien);
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
