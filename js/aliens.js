const alienImage = new Image();
alienImage.src = 'icons/aliens/alien-bullet-ship.png';
// const alienBulletImage = new Image();
// alienBulletImage.src = 'icons/alien_bullet_ship2.png';

const bossAlienImage = new Image();
bossAlienImage.src = 'icons/aliens/alien_boss_ship_2.png';
const superBossAlienImage = new Image();
superBossAlienImage.src = 'icons/aliens/cool_evil_alien_22.png';
const megaBossAlienImage = new Image();
megaBossAlienImage.src = 'icons/aliens/alien_boss_ship_6.png';


const octoBossImage = new Image();
octoBossImage.src = 'icons/aliens/alien_boss_ship_17.png';

const OCTOBOSS_HP_MULTIPLIER = 0.7; // Adjust this value to change difficulty
const OCTOBOSS_REGEN_THRESHOLD = 0.25; // 25% health threshold
const OCTOBOSS_ARM_REGEN_PERCENT = 0.7; // 70% of original hitpoints
let octobossRegenerated = false; // 70% of original hitpoints

let bossMusicEnabled = false;

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
    LITTLE: { hitpoints: 15, color: 'purple', speed: 0.5, shootInterval: 180 },  // New type for little aliens around boss
    BLINKING: { hitpoints: 2, color: 'cyan', speed: 0.3, blinkCount: 5, blinkInterval: 60 }

};

let miniBossAlien = null;

let alienLaser = null;
const alienLaserSpeed = 2.2;
const alienLaserSize = 4;
let superbossAlien = null;
let superbossAlienSpawned = false;
let megaBossAlien = null;
let megaBossAlienSpawned = false;
let octoBoss = null;
let octoBossSpawned = false;



let swarmingAliens = [];

// let aliens = [];
let alienLasers = [];
let octoMode = false;

function spawnAliens(wave) {

    if (testMode) {
        spawnSwarmingAliens(SwarmingAlienTypes.TOP, 10);
        spawnSwarmingAliens(SwarmingAlienTypes.BOTTOM, 10);
        // spawnSuperBossAlien();
        spawnHuntingAliens(10);

    }

    // if (wave % 5 == 0) {  // Spawn blinking aliens every 5 waves, for example
    //     spawnBlinkingAliens(Math.floor(wave / 5));  // Increase number of blinking aliens as waves progress
    // }

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


    if (wave == 100)
        spawnOctoBoss();


    const aliensToSpawn = getAliensToSpawn(wave);
    // if (aliensToSpawn > 0)
    //     playAlienEnteringSound();

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

        aliens.forEach((alien, index) => {
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
                        alien.x += 10;
                    } else if (alien.y < -alien.size) {
                        alien.y = canvas.height;
                        alien.x += 10;

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

                case SwarmingAlienTypes.BLINKING:
                    // Move randomly
                    alien.x += alien.dx * alien.speed;
                    alien.y += alien.dy * alien.speed;

                    // Bounce off screen edges
                    if (alien.x <= 0 || alien.x >= canvas.width) alien.dx *= -1;
                    if (alien.y <= 0 || alien.y >= canvas.height) alien.dy *= -1;

                    // Blink logic
                    if (alien.blinkCount < SwarmingAlienTypes.BLINKING.blinkCount) {
                        alien.blinkTimer++;
                        if (alien.blinkTimer >= SwarmingAlienTypes.BLINKING.blinkInterval) {
                            alien.blinkState = !alien.blinkState;
                            alien.blinkTimer = 0;
                            if (alien.blinkState) alien.blinkCount++;
                        }
                    } else {
                        // Start exploding
                        alien.explodeTimer++;
                        if (alien.explodeTimer >= 60) {  // Explode after 1 second
                            createExplosion(alien.x, alien.y);
                            aliens.splice(index, 1);
                        }
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

function setBossOnFire(boss) {
    console.log("setting boss");
    boss.isOnFire = true;
    boss.fireTimer = 0;
    boss.fireDuration = 600; // 10 seconds at 60 FPS
}

function updateBossFire() {
    const bosses = [miniBossAlien, superbossAlien, megaBossAlien, octoBoss].filter(boss => boss != null);

    bosses.forEach(boss => {
        if (boss.isOnFire) {
            boss.fireTimer++;

            if (boss.fireTimer % 60 === 0) { // Apply damage every second
                const fireDamage = flamethrower.damagePerSecond;
                // double fire damage for bosses
                boss.hitpoints -= fireDamage * 2;
                damageReport.flamethrower += fireDamage;
            }

            if (boss.fireTimer >= boss.fireDuration) {
                boss.isOnFire = false;
                boss.fireTimer = 0;
            }

            if (boss.hitpoints <= 0) {
                // if (boss === miniBossAlien) destroyBossAlien();
                // else if (boss === superbossAlien) destroySuperBossAlien();
                // else if (boss === megaBossAlien) destroyMegaBossAlien();
                // else if (boss === octoBoss) destroyOctoBoss();
            }
        }
    });
}


function spawnSuperBossAlien() {
    superbossAlienSpawned = true;

    if (!toggleSoundOff)
        playAlienLaughSound();
    if (!toggleMusicOff) {
        pauseAllMusic();
        bossMusicEnabled = true;
        superMegabossBackgroundMusic.play();

    }


    superbossAlien = {
        x: canvas.width / 2,
        y: 2,
        size: 80,
        speed: 0.3,
        direction: Math.random() * Math.PI * 2,
        shootTimer: 0,
        radius: 20,
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
            playBossLaserSound();
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
    drawBossWithFireEffect(superbossAlien);

}

function spawnMegaBossAlien() {

    megaBossAlienSpawned = true;

    if (!toggleMusicOff) {
        pauseAllMusic();
        bossMusicEnabled = true;
        megabossBackgroundMusic.play();

    }
    if (!toggleSoundOff)
        playAlienLaughSound();



    megaBossAlien = {
        x: canvas.width / 2,
        y: 2,
        size: 240,
        speed: 0.2,
        direction: Math.random() * Math.PI * 2,
        shootTimer: 0,
        spawnTimer: 0,
        hitpoints: 10000,
        radius: 30,
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

function spawnBlinkingAliens(count) {
    for (let i = 0; i < count; i++) {
        let newBlinkingAlien = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 25,
            speed: SwarmingAlienTypes.BLINKING.speed,
            hitpoints: SwarmingAlienTypes.BLINKING.hitpoints,
            type: SwarmingAlienTypes.BLINKING,
            image: alienImage,  // You might want to use a different image for this type
            blinkCount: 0,
            blinkTimer: 0,
            blinkState: true,
            explodeTimer: 0,
            dx: (Math.random() - 0.5) * 2,  // Random horizontal direction
            dy: (Math.random() - 0.5) * 2   // Random vertical direction
        };
        aliens.push(newBlinkingAlien);
    }
}



function drawBossAlien() {
    if (!miniBossAlien) return;
    ctx.save();
    ctx.translate(miniBossAlien.x, miniBossAlien.y);
    ctx.drawImage(bossAlienImage, -miniBossAlien.size / 2, -miniBossAlien.size / 2, miniBossAlien.size, miniBossAlien.size);
    ctx.restore();
    // drawBossHitpointBar();
}

function drawMegaBossAlien() {
    if (!megaBossAlien) return;
    ctx.save();
    ctx.translate(megaBossAlien.x, megaBossAlien.y);
    ctx.drawImage(megaBossAlienImage, -megaBossAlien.size / 2, -megaBossAlien.size / 2, megaBossAlien.size, megaBossAlien.size);
    ctx.restore();
    drawMegaBossHitpointBar();

    drawBossWithFireEffect(megaBossAlien);

}

function drawBossWithFireEffect(boss) {
    // ... (existing boss drawing code)

    if (boss.isOnFire) {
        console.log("drawing bossflame");
        ctx.save();
        ctx.globalAlpha = 0.7;  // Adjust transparency if needed
        ctx.fillStyle = 'orange';

        // Draw flickering flames around the boss
        for (let i = 0; i < 8; i++) {
            // Create an angle for each flame and add some flicker by using a time-based offset
            const angle = (i / 8) * Math.PI * 2 + (Date.now() % 1000) / 1000 * Math.PI;

            // Calculate the position of each flame around the boss
            const flameX = boss.x + Math.cos(angle) * (boss.size / 2 + randomSeed * 10);  // Random offset for flickering
            const flameY = boss.y + Math.sin(angle) * (boss.size / 2 + Math.random() * 10);

            // Draw a small flame as a flickering circle
            ctx.beginPath();
            ctx.arc(flameX, flameY, randomSeed * 5 + 5, 0, Math.PI * 2);  // Random size for flickering effect
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

}


function updateBossAlien() {
    if (!miniBossAlien) return;
    if (!freezeEffect.active) {
        // Calculate direction towards the ship
        const dx = ship.x - miniBossAlien.x;
        const dy = ship.y - miniBossAlien.y;
        const angle = Math.atan2(dy, dx);

        // Update alien's position based on the new direction
        miniBossAlien.x += Math.cos(angle) * miniBossAlien.speed;
        miniBossAlien.y += Math.sin(angle) * miniBossAlien.speed;

        // Update alien's shooting timer
        miniBossAlien.shootTimer++;
        if (miniBossAlien.shootTimer >= miniBossAlien.shootInterval) {
            miniBossAlien.shootTimer = 0;
            shootBossAlienLaser();
        }

        // Wrap the alien around the screen edges
        if (miniBossAlien.x < 0) miniBossAlien.x = canvas.width;
        else if (miniBossAlien.x > canvas.width) miniBossAlien.x = 0;
        if (miniBossAlien.y < 0) miniBossAlien.y = canvas.height;
        else if (miniBossAlien.y > canvas.height) miniBossAlien.y = 0;
    }
}

function drawAliens() {
    aliens.forEach(alien => {
        ctx.save();
        ctx.translate(alien.x, alien.y);

        if (alien.type === SwarmingAlienTypes.BLINKING && !alien.blinkState) {
            // Don't draw the alien when it's in the "off" blink state
        } else {
            // Calculate angle to face the player's ship

            if (alien.image) {
                const dx = ship.x - alien.x;
                const dy = ship.y - alien.y;
                const angle = Math.atan2(dy, dx) + Math.PI / 2; // Add 90 degrees

                // Rotate the context
                ctx.rotate(angle);

                // Draw the rotated custom alien image
                ctx.drawImage(alien.image, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
            } else {
                // Draw the rotated default alien image
                ctx.drawImage(alienImage, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
            }
        }

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
            playBossLaserSound();

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

    const xpBar = document.getElementById('xpBar');
    const hpPercentage = Math.round(100 * (superbossAlien.hitpoints / superbossAlien.maxHitpoints));
    xpBar.style.backgroundColor = 'red';
    xpBar.style.width = hpPercentage + '%';

}


function drawMegaBossHitpointBar() {
    if (!megaBossAlien) return;

    const xpBar = document.getElementById('xpBar');
    const hpPercentage = Math.round(100 * (megaBossAlien.hitpoints / megaBossAlien.maxHitpoints));
    // console.log(megaBossAlien.maxHitpoints);
    // console.log(megaBossAlien.hitpoints);
    // console.log(hpPercentage);
    xpBar.style.backgroundColor = 'red';
    xpBar.style.width = hpPercentage + '%';

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
    playBossDroneSpawnSound();

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
    playBossDroneSpawnSound();

}



function updateAlienLasers() {
    // console.log("l");

    for (let i = alienLasers.length - 1; i >= 0; i--) {
        // console.log(i);
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

function drawAlienLasers(time = currentTime) {
    alienLasers.forEach((laser, i) => {
        ctx.save();

        // Pulsating effect (adjusting size dynamically)
        const pulseFactor = Math.sin(time * 3 + i) * 0.2 + 0.8; // Pulsate between 0.6 and 1.0

        if (!fpsThrottleMode) {
            // Create and draw the glow effect using radial gradient
            const gradient = ctx.createRadialGradient(
                laser.x, laser.y, 0,             // Inner radius at the laser's position
                laser.x, laser.y, alienLaserSize * 2 // Outer radius for the glow effect
            );

            // Add color stops for the glowing effect (red glow)
            gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');  // Strong red at center
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');      // Fade to transparent black

            // Apply glow with pulsating effect
            ctx.globalAlpha = 0.7 * pulseFactor;  // Adjust the transparency based on pulse
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(laser.x, laser.y, alienLaserSize, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw the main laser
        if (Math.abs(laser.dx) > alienLaserSpeed * 2 || Math.abs(laser.dy) > alienLaserSpeed * 2) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(laser.x, laser.y, alienLaserSize * 1.3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = 'pink';
            ctx.beginPath();
            ctx.arc(laser.x, laser.y, alienLaserSize, 0, Math.PI * 2);
            ctx.fill();
        }


        // Reset alpha back to full for subsequent drawings
        ctx.globalAlpha = 1;
        ctx.restore();
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
    if (!miniBossAlien) return;
    const dx = ship.x - miniBossAlien.x;
    const dy = ship.y - miniBossAlien.y;
    const angle = Math.atan2(dy, dx);

    alienLaser = {
        x: miniBossAlien.x,
        y: miniBossAlien.y,
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
    drawBossWithFireEffect(miniBossAlien);

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

const OctoBossArmState = {
    ACTIVE: 'active',
    DESTROYED: 'destroyed',
    GROWING: 'growing'
};



// Update the OctoBoss spawning function
function spawnOctoBoss() {
    octoBossSpawned = true;

    if (!toggleMusicOff) {
        pauseAllMusic();
        bossMusicEnabled = true;
        octoBossBackgroundMusic.play();
    }
    if (!toggleSoundOff)
        playAlienLaughSound();

    octoBoss = {
        x: canvas.width / 2,
        y: 15,
        size: 260,
        bodyRadius: 120,
        speed: 0.1,
        hitpoints: 20000 * OCTOBOSS_HP_MULTIPLIER,
        armRegrowthTimer: 0,
        armRegrowthInterval: 1000,
        maxHitpoints: 20000 * OCTOBOSS_HP_MULTIPLIER,
        shootTimer: 0,
        shootInterval: 150,
        arms: [],
        specialAttackTimer: 0,
        specialAttackInterval: Math.random() * 2000 + 2000,
        isSpecialAttacking: false,
        specialAttackDuration: 60,
        armReverseTimer: 0,
        armReverseInterval: Math.random() * 300 + 300,
        inkShootTimer: 0,
        inkShootInterval: Math.random() * 200 + 200,
        isArmReversed: false
    };

    // Create 8 arms with 3 segments each
    for (let i = 0; i < 8; i++) {
        const baseAngle = (i * Math.PI) / 4;
        octoBoss.arms.push({
            segments: [
                createSegment(baseAngle, 150, 350, 1000 * OCTOBOSS_HP_MULTIPLIER),
                createSegment(baseAngle + Math.PI / 6, 100, 300, 1000 * OCTOBOSS_HP_MULTIPLIER),
                createSegment(baseAngle - Math.PI / 6, 50, 200, 1000 * OCTOBOSS_HP_MULTIPLIER)
            ]
        });
    }

    aliens.push(octoBoss);
}

function createSegment(angle, initialLength, maxLength, initialHitpoints) {
    return {
        angle: Number(angle) || 0,
        length: Number(initialLength) || 200,
        maxLength: Number(maxLength) || 200,
        state: OctoBossArmState.ACTIVE, // Start as active instead of growing
        hitpoints: Number(initialHitpoints) || 500,
        maxHitpoints: Number(initialHitpoints) || 500,
        growthRate: 0.01
    };
}

// Update the health calculation function
function calculateTotalOctoBossHealth() {
    if (!octoBoss) return { current: 0, max: 1 }; // Prevent division by zero

    let totalHealth = octoBoss.hitpoints;
    let totalMaxHealth = octoBoss.maxHitpoints;

    octoBoss.arms.forEach(arm => {
        arm.segments.forEach(segment => {
            totalHealth += segment.hitpoints;
            totalMaxHealth += segment.maxHitpoints;
        });
    });

    return { current: totalHealth, max: totalMaxHealth };
}

// The drawOctoBossHitpointBar function remains the same
function drawOctoBossHitpointBar() {
    const xpBar = document.getElementById('xpBar');
    const health = calculateTotalOctoBossHealth();
    const hpPercentage = Math.round(100 * (health.current / health.max));

    const gradient = `linear-gradient(90deg, red ${hpPercentage}%, purple ${hpPercentage}%)`;
    xpBar.style.background = gradient;
    xpBar.style.width = '100%';

    xpBar.textContent = `${Math.round(health.current)}/${Math.round(health.max)}`;
    drawBossWithFireEffect(octoBoss);

}

function validateOctoBossState() {

    if (!octoBoss || freezeEffect.active) return;

    validateOctoBossState();

    resetNegativeHitpoints();

    octoBoss.arms.forEach((arm, armIndex) => {
        arm.segments = arm.segments.map((segment, segIndex) => {
            const sanitizedSegment = sanitizeSegment(segment);
            if (JSON.stringify(segment) !== JSON.stringify(sanitizedSegment)) {
                console.warn(`Fixed invalid data in arm ${armIndex}, segment ${segIndex}`);
            }
            return sanitizedSegment;
        });
    });
}

function updateOctoBoss() {
    if (!octoBoss) return;
    if (freezeEffect.active) return;

    const dx = ship.x - octoBoss.x;
    const dy = ship.y - octoBoss.y;
    const angle = Math.atan2(dy, dx);
    octoBoss.x += Math.cos(angle) * octoBoss.speed;
    octoBoss.y += Math.sin(angle) * octoBoss.speed;

    // Special attack logic
    octoBoss.specialAttackTimer++;
    if (octoBoss.specialAttackTimer >= octoBoss.specialAttackInterval) {
        octoBoss.isSpecialAttacking = true;
        octoBoss.specialAttackTimer = 0;
        octoBoss.specialAttackInterval = randomSeed * 2000 + 1000; // Set next interval
        octoBoss.specialAttackDuration = 60; // Reset duration
    }

    const totalHealth = calculateTotalOctoBossHealth();
    if (!octobossRegenerated && (totalHealth.current / totalHealth.max <= OCTOBOSS_REGEN_THRESHOLD)) {
        regenerateAllArms();
        octobossRegenerated = true;
    }

    if (octoBoss.isSpecialAttacking) {
        console.log("special attack");
        performSpecialAttack();
        octoBoss.specialAttackDuration--;
        if (octoBoss.specialAttackDuration <= 0) {
            octoBoss.isSpecialAttacking = false;
        }
    } else {
        // Normal shooting logic
        octoBoss.shootTimer++;
        if (octoBoss.shootTimer >= octoBoss.shootInterval) {
            console.log("normal attack");
            octoBoss.shootTimer = 0;
            shootOctoBossLaser();
            playBossLaserSound();

        }
    }


    octoBoss.armReverseTimer++;
    if (octoBoss.armReverseTimer >= octoBoss.armReverseInterval) {
        octoBoss.isArmReversed = !octoBoss.isArmReversed;
        octoBoss.armReverseTimer = 0;
        octoBoss.armReverseInterval = Math.random() * 300 + 300; // Set next interval
    }

    // Ink shooting logic
    octoBoss.inkShootTimer++;
    if (octoBoss.inkShootTimer >= octoBoss.inkShootInterval) {
        if (octoBoss.hitpoints < 10500)
            shootInk();
        octoBoss.inkShootTimer = 0;
        octoBoss.inkShootInterval = Math.random() * 200 + 200; // Set next interval
    }


    octoBoss.armRegrowthTimer++;
    if (octoBoss.armRegrowthTimer >= octoBoss.armRegrowthInterval) {
        console.log("Attempting regrowth");
        octoBoss.armRegrowthTimer = 0;

        const destroyedArms = octoBoss.arms.filter(arm =>
            arm.segments.every(seg => seg.state === OctoBossArmState.DESTROYED)
        );

        if (destroyedArms.length > 0) {
            console.log("Regenerating arm");
            regenerateArm();
        } else {
            console.log("No arms to regenerate");
        }
    }


    // Update arm segment angles and lengths
    const targetAngle = Math.atan2(ship.y - octoBoss.y, ship.x - octoBoss.x);
    octoBoss.arms.forEach((arm, index) => {
        const baseAngle = octoBoss.isSpecialAttacking
            ? targetAngle
            : (index * Math.PI) / 4 + Date.now() * 0.001 * (octoBoss.isArmReversed ? -1 : 1);

        arm.segments.forEach((segment, segIndex) => {
            if (segment.state !== OctoBossArmState.DESTROYED) {
                if (octoBoss.isSpecialAttacking) {
                    segment.angle = baseAngle + (Math.random() - 0.5) * Math.PI / 10;
                } else {
                    segment.angle = baseAngle + (segIndex - 1) * Math.PI / 6 * Math.sin(Date.now() * 0.002 * (octoBoss.isArmReversed ? -1 : 1));
                }

                if (segment.state === OctoBossArmState.GROWING) {
                    segment.length = Math.min(segment.length + segment.growthRate, segment.maxLength);
                    if (segment.length === segment.maxLength) {
                        segment.state = OctoBossArmState.ACTIVE;
                    }
                }
            }
        });
    });


    // Check for collision with player
    if (!invincible && isColliding(octoBoss, ship)) {
        processPlayerDeath();
    }
}

function regenerateAllArms() {
    console.log("OctoBoss is regenerating all arms!");
    octoBoss.arms.forEach((arm, index) => {
        const baseAngle = (index * Math.PI) / 4;
        arm.segments = [
            createSegment(baseAngle, 50, 350, 1000 * OCTOBOSS_HP_MULTIPLIER * OCTOBOSS_ARM_REGEN_PERCENT),
            createSegment(baseAngle + Math.PI / 6, 100, 300, 1000 * OCTOBOSS_HP_MULTIPLIER * OCTOBOSS_ARM_REGEN_PERCENT),
            createSegment(baseAngle - Math.PI / 6, 50, 200, 1000 * OCTOBOSS_HP_MULTIPLIER * OCTOBOSS_ARM_REGEN_PERCENT)
        ];
    });

    if (!toggleSoundOff)
        playAlienLaughSound();

    // Play a regeneration sound or create a visual effect
    // playRegenerationSound();
    // createRegenerationEffect();
}

function performSpecialAttack() {
    const targetAngle = Math.atan2(ship.y - octoBoss.y, ship.x - octoBoss.x);

    octoBoss.arms.forEach(arm => {
        const activeOrGrowingSegments = arm.segments.filter(seg =>
            seg.state === OctoBossArmState.ACTIVE || seg.state === OctoBossArmState.GROWING
        );
        if (activeOrGrowingSegments.length > 0) {
            let laserStartX = octoBoss.x;
            let laserStartY = octoBoss.y;
            activeOrGrowingSegments.forEach(segment => {
                laserStartX += Math.cos(segment.angle) * segment.length;
                laserStartY += Math.sin(segment.angle) * segment.length;
            });

            // Add slight randomness to the laser direction
            const randomAngle = targetAngle + (Math.random() - 0.5) * Math.PI / 30; // +/- 3.3% randomness

            alienLasers.push({
                x: laserStartX,
                y: laserStartY,
                dx: Math.cos(randomAngle) * alienLaserSpeed * 1.5, // Faster special attack lasers
                dy: Math.sin(randomAngle) * alienLaserSpeed * 1.5
            });
        }
    });
    playBossLaserSound();
}

function drawOctoBoss() {
    if (!octoBoss) return;

    ctx.save();
    ctx.translate(octoBoss.x, octoBoss.y);

    // Draw arms
    octoBoss.arms.forEach(arm => {
        let startX = 0;
        let startY = 0;
        arm.segments.forEach(segment => {
            if (segment.state !== OctoBossArmState.DESTROYED) {
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                const endX = startX + Math.cos(segment.angle) * segment.length;
                const endY = startY + Math.sin(segment.angle) * segment.length;
                ctx.lineTo(endX, endY);
                ctx.lineWidth = 10;
                if (octoBoss.isSpecialAttacking) {
                    ctx.strokeStyle = 'red'; // Change color during special attack
                } else {
                    ctx.strokeStyle = segment.state === OctoBossArmState.GROWING ? 'rgba(0, 255, 0, 0.5)' : 'green';
                }
                ctx.stroke();
                startX = endX;
                startY = endY;
            }
        });
    });

    // Draw body on top of arms
    ctx.drawImage(octoBossImage, -octoBoss.size / 2, -octoBoss.size / 2, octoBoss.size, octoBoss.size);

    ctx.restore();
    drawOctoBossHitpointBar();
}

function shootOctoBossLaser() {
    console.log("shoot");
    let activeCount = 0;
    // Shoot from arms
    octoBoss.arms.forEach(arm => {
        const activeOrGrowingSegments = arm.segments.filter(seg =>
            seg.state === OctoBossArmState.ACTIVE || seg.state === OctoBossArmState.GROWING
        );
        if (activeOrGrowingSegments.length > 0) {
            let laserStartX = octoBoss.x;
            let laserStartY = octoBoss.y;
            let lastAngle = 0;
            activeOrGrowingSegments.forEach(segment => {
                laserStartX += Math.cos(segment.angle) * segment.length;
                laserStartY += Math.sin(segment.angle) * segment.length;
                lastAngle = segment.angle;
                activeCount++;
            });
            console.log("push arm laser");
            alienLasers.push({
                x: laserStartX,
                y: laserStartY,
                dx: Math.cos(lastAngle) * alienLaserSpeed,
                dy: Math.sin(lastAngle) * alienLaserSpeed
            });
        }
    });

    // Shoot from eyes
    const eyeSpread = 65; // 30px apart
    const eyeY = octoBoss.y - 25; // Assuming the eyes are at the top of the boss
    const leftEyeX = octoBoss.x - eyeSpread;
    const rightEyeX = octoBoss.x + eyeSpread;
    const middleEyeX = octoBoss.x;
    let armSpeedBooster = 1;
    if (activeCount < 16)
        armSpeedBooster *= 1.2;
    if (activeCount < 8)
        armSpeedBooster *= 1.2;

    const targetAngle = Math.atan2(ship.y - eyeY, ship.x - octoBoss.x);

    // Left eye laser
    // console.log("push left eye laser");
    alienLasers.push({
        x: leftEyeX,
        y: eyeY,
        dx: Math.cos(targetAngle) * alienLaserSpeed * 2.5 * armSpeedBooster, // 4x speed
        dy: Math.sin(targetAngle) * alienLaserSpeed * 2.5 * armSpeedBooster
    });


    alienLasers.push({
        x: middleEyeX,
        y: eyeY - 20,
        dx: Math.cos(targetAngle) * alienLaserSpeed * 2.5 * armSpeedBooster, // 4x speed
        dy: Math.sin(targetAngle) * alienLaserSpeed * 2.5 * armSpeedBooster
    });


    // Right eye laser
    // console.log("push right eye laser");
    alienLasers.push({
        x: rightEyeX,
        y: eyeY,
        dx: Math.cos(targetAngle) * alienLaserSpeed * 2.5 * armSpeedBooster, // 4x speed
        dy: Math.sin(targetAngle) * alienLaserSpeed * 2.5 * armSpeedBooster
    });

    playAlienLaserSound();
}
// function performSpecialAttack() {
//     octoBoss.arms.forEach(arm => {
//         const activeSegments = arm.segments.filter(seg => seg.state === OctoBossArmState.ACTIVE);
//         if (activeSegments.length > 0) {
//             let laserStartX = octoBoss.x;
//             let laserStartY = octoBoss.y;
//             let lastAngle = 0;
//             activeSegments.forEach(segment => {
//                 laserStartX += Math.cos(segment.angle) * segment.length;
//                 laserStartY += Math.sin(segment.angle) * segment.length;
//                 lastAngle = segment.angle;
//             });

//             // Add randomness to the laser direction
//             const randomAngle = lastAngle + (Math.random() - 0.5) * Math.PI / 5; // +/- 20% randomness

//             alienLasers.push({
//                 x: laserStartX,
//                 y: laserStartY,
//                 dx: Math.cos(randomAngle) * alienLaserSpeed,
//                 dy: Math.sin(randomAngle) * alienLaserSpeed
//             });
//         }
//     });
//     playAlienLaserSound();
// }

function damageOctoBoss(damage, laserX, laserY) {
    // First, try to damage the closest vulnerable arm segment
    let closestSegment = null;
    let closestDistance = Infinity;
    let closestArmIndex = -1;
    let closestSegmentIndex = -1;
    let closestSegmentEndX = 0;
    let closestSegmentEndY = 0;

    octoBoss.arms.forEach((arm, armIndex) => {
        let segmentStartX = octoBoss.x;
        let segmentStartY = octoBoss.y;

        arm.segments.forEach((segment, segmentIndex) => {
            if (segment.state === OctoBossArmState.ACTIVE || segment.state === OctoBossArmState.GROWING) {
                const segmentEndX = segmentStartX + Math.cos(segment.angle) * segment.length;
                const segmentEndY = segmentStartY + Math.sin(segment.angle) * segment.length;

                // Calculate distance from laser to segment
                const distance = pointToLineDistance(laserX, laserY, segmentStartX, segmentStartY, segmentEndX, segmentEndY);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestSegment = segment;
                    closestArmIndex = armIndex;
                    closestSegmentIndex = segmentIndex;
                    closestSegmentEndX = segmentEndX;
                    closestSegmentEndY = segmentEndY;
                }
            }

            // Update start position for next segment
            segmentStartX += Math.cos(segment.angle) * segment.length;
            segmentStartY += Math.sin(segment.angle) * segment.length;
        });
    });



    if (closestSegment) {
        console.log(closestSegment);
        console.log(damage);

        console.log(`Damaging arm ${closestArmIndex}, segment ${closestSegmentIndex}`);
        closestSegment.hitpoints -= damage;
        console.log("Segment hit points:", closestSegment.hitpoints);

        if (closestSegment.hitpoints <= 0) {
            closestSegment.state = OctoBossArmState.DESTROYED;
            createExplosion(closestSegmentEndX, closestSegmentEndY);
            checkArmDestruction(closestArmIndex);
        }
    } else {
        console.log("Damaging body");
        octoBoss.hitpoints -= damage;
        if (octoBoss.hitpoints <= 0) {
            destroyOctoBoss();
        }
    }

}

function resetNegativeHitpoints() {
    octoBoss.arms.forEach(arm => {
        arm.segments.forEach(segment => {
            if (segment.hitpoints < 0) {
                console.log("Resetting negative hitpoints to 0");
                segment.hitpoints = 0;
                segment.state = OctoBossArmState.DESTROYED;
            }
        });
    });
}


function checkArmDestruction(armIndex) {
    const arm = octoBoss.arms[armIndex];
    if (arm.segments.every(segment => segment.state === OctoBossArmState.DESTROYED)) {
        console.log(`Arm ${armIndex} completely destroyed`);
        // You might want to add additional effects or score here
    }
}

function regenerateArm() {
    const destroyedArmIndex = octoBoss.arms.findIndex(arm =>
        arm.segments.every(segment => segment.state === OctoBossArmState.DESTROYED)
    );

    if (destroyedArmIndex !== -1) {
        console.log(`Regenerating arm ${destroyedArmIndex}`);
        const baseAngle = (destroyedArmIndex * Math.PI) / 4;
        octoBoss.arms[destroyedArmIndex] = {
            segments: [
                createSegment(baseAngle, 10, 150, 500 * OCTOBOSS_HP_MULTIPLIER),
                createSegment(baseAngle + Math.PI / 6, 10, 120, 400 * OCTOBOSS_HP_MULTIPLIER),
                createSegment(baseAngle - Math.PI / 6, 10, 100, 300 * OCTOBOSS_HP_MULTIPLIER)
            ]
        };
    } else {
        console.log("No arms to regenerate");
    }
}




function createNewArm(index) {
    const baseAngle = (index * Math.PI) / 4;
    return {
        segments: [
            {
                angle: baseAngle,
                length: 10, // Start small
                maxLength: 150,
                state: OctoBossArmState.GROWING,
                hitpoints: 500,
                growthRate: 0.5
            }
        ]
    };
}



// Helper function to calculate the distance from a point to a line segment
function pointToLineDistance(x, y, x1, y1, x2, y2) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) // in case of 0 length line
        param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

// function drawOctoBossHitpointBar() {
//     const xpBar = document.getElementById('xpBar');
//     const hpPercentage = Math.round(100 * (octoBoss.hitpoints / octoBoss.maxHitpoints));
//     xpBar.style.backgroundColor = 'purple';
//     xpBar.style.width = hpPercentage + '%';


// }

function destroyOctoBoss() {
    createExplosion(octoBoss.x, octoBoss.y);
    aliens = aliens.filter(alien => alien !== octoBoss);
    octoBoss = null;
    playBossDieSound();

    const xpBar = document.getElementById('xpBar');
    xpBar.style.background = 'green'; // Reset background to solid green
    xpBar.style.backgroundColor = 'green'; // Reset background to solid green
    xpBar.style.width = '100%'; // Reset the width to full
    xpBar.textContent = ''; // Display defeat message

    if (!toggleMusicOff) {

        pauseAllMusic();
        backgroundMusic2.play();
    }
    // Add any additional logic for when the OctoBoss is destroyed (e.g., score, powerups)
}

function checkLaserOctoBossCollision(laser) {
    if (!octoBoss) return false;

    // Check collision with OctoBoss body
    const distanceToBody = Math.hypot(laser.x - octoBoss.x, laser.y - octoBoss.y);
    if (distanceToBody <= octoBoss.bodyRadius + laser.size / 2) {
        damageOctoBoss(ship.laserLevel + damageBooster * pixieBoost, laser.x, laser.y);
        return true;
    }

    // Check collision with OctoBoss arms
    for (let armIndex = 0; armIndex < octoBoss.arms.length; armIndex++) {
        let arm = octoBoss.arms[armIndex];
        let startX = octoBoss.x;
        let startY = octoBoss.y;
        for (let segIndex = 0; segIndex < arm.segments.length; segIndex++) {
            let segment = arm.segments[segIndex];
            if (segment.state !== OctoBossArmState.DESTROYED) {
                const endX = startX + Math.cos(segment.angle) * segment.length;
                const endY = startY + Math.sin(segment.angle) * segment.length;

                if (lineCircleIntersection(startX, startY, endX, endY, laser.x, laser.y, laser.size / 2)) {
                    damageOctoBoss(ship.laserLevel + damageBooster * pixieBoost, laser.x, laser.y);
                    return true;
                }

                startX = endX;
                startY = endY;
            }
        }
    }

    return false;
}


function lineCircleIntersection(x1, y1, x2, y2, cx, cy, r) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const a = dx * dx + dy * dy;
    const b = 2 * (dx * (x1 - cx) + dy * (y1 - cy));
    const c = cx * cx + cy * cy + x1 * x1 + y1 * y1 - 2 * (cx * x1 + cy * y1) - r * r;
    const determinant = b * b - 4 * a * c;

    if (determinant < 0) return false;

    const t1 = (-b + Math.sqrt(determinant)) / (2 * a);
    const t2 = (-b - Math.sqrt(determinant)) / (2 * a);

    return (t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1);
}


function shootInk() {
    const inkCount = 20; // Number of ink particles
    for (let i = 0; i < inkCount; i++) {
        const angle = randomSeed * Math.PI * 2;
        const speed = randomSeed * 2 + .5;
        alienLasers.push({
            x: octoBoss.x,
            y: octoBoss.y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            isInk: true,
            size: Math.random() * 5 + 5 // Random size between 5 and 10
        });
    }
    playAlienLaserSound(); // You might want to create a separate ink sound
}


