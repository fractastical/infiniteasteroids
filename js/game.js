
// Game loop
function startGame() {
    gameStartTime = Date.now();
    document.getElementById('endScreen').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('loginPopup').style.display = 'none';
    document.getElementById('userInfo').classList.add('hidden');
    document.getElementById('userInfo').style.display = 'none';

    document.getElementById('technologiesCount').style.display = 'none';
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('shipType').style.display = 'none';
    droneUpgrades = {
        speed: 1,
        laserSpeed: 1,
        laserInterval: 1
    };

    particles = [];
    shockwaves = [];


    // startGamingSessionApi();
    createAsteroids();
    invincible = true;
    ship.laserTimer = 0;
    turret.bought = false;
    resetShip();
    invincibilityTimer = invincibilityDuration;
    clearInterval(gameLoop);
    // if (mode == GameModes.ENDLESS_SLOW)
    //   spawnCooldown = 6;

    // const selectedUpgrades = getSelectedUpgrades(); // Implement this function to retrieve the selected upgrades

    // // Load the selected upgrades and their corresponding functions
    // selectedUpgrades.forEach(upgrade => {
    //   addUpgrade(upgrade);
    // });


    ship.laserLevel = ships[currentShip].laserLevel;
    // Specific actions for StarHawk
    if (currentShip === 'quantumStriker') {
        ship.laserCooldown = 40; // double length for shotgun style ship

    }
    if (currentShip === 'solarPhoenix') {
        ship.laserCooldown = 50; // double length for shotgun style ship

    }

    fourthUpgradeUnlocked = false;

    if (currentShip === 'starHawk') {
        activateWeaponClass('turret');
        damageReportStartTimes.turret = Date.now();

        turret = {
            x: 0,
            y: 0,
            size: 10,
            rotationSpeed: 2,
            fireInterval: 80,
            fireTimer: 0,
            range: 400,
            damage: 5,
            color: 'cyan',
            lasers: [] // Initialize the turret's lasers array
        };

        turret.bought = true;

        turretUpgrades = {
            range: 1,
            fireRate: 2,
            damage: 2
        };
    } else {
        turret = {
            x: 0,
            y: 0,
            size: 10,
            rotationSpeed: 2,
            fireInterval: 120,
            fireTimer: 0,
            range: 400,
            damage: 3,
            color: 'cyan',
            lasers: [] // Initialize the turret's lasers array
        };

        turretUpgrades = {
            range: 1,
            fireRate: 1,
            damage: 1
        };

        turret.bought = false;

    }

    gameLoop = setInterval(update, 1000 / 60); // 60 FPS
    if (!toggleOff)
        backgroundMusic.play(); // Play the background music
    isMusicPlaying = true;
}


function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // document.getElementById('leaderboard-container').style.display = 'none';
    if (currentBackgroundImage) {
        ctx.drawImage(currentBackgroundImage, 0, 0, canvas.width, canvas.height);
    }


    if (planetMode) {
        drawPlanet();
    }


    // don't let people play with negative lives
    if (lives < 0)
        return;

    if (ship.laserTimer > 0) {
        ship.laserTimer--;
    }

    let angle = ship.rotation * Math.PI / 180;

    if (isMobile()) {
        keys[' '] = true;
    }

    // const secondsUntilNextWave = Math.ceil(spawnTimer);
    // document.getElementById('waveCounter').textContent = `Next Wave: ${secondsUntilNextWave}s`;

    updateShip(ship, 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ');

    if (currentMode === GameModes.COOP) {
        updateShip(ship2, 'a', 'd', 'w', 's', 'q');
    } else {

        updateShip(ship, 'a', 'd', 'w', 's', 'q');

    }


    checkFloatingIslandSpawn();
    updateFloatingIsland();
    checkIslandCollision();
    updateMegaUpgrades();
    drawFloatingIsland();
    drawActiveMegaUpgrades();
    drawRareAsteroidIndicators();

    if (planetMode) {
        applyGravity(ship);
        if (currentMode === GameModes.COOP) {
            applyGravity(ship2);
        }
    }

    // if (Math.abs(ship.velocityX) < 0.9 && Math.abs(ship.velocityY) < 0.9) {
    //   if (!toggleOff) backgroundMusic.play(); // Resume the background music (if hasn't started)
    //   playRandomThrusterSound();

    //   // Move backwards with higher initial acceleration
    //   const initialBackwardAcceleration = ship.acceleration * 1.5; // Increased initial backward acceleration
    //   const backwardSpeed = ship.maxSpeed; // Increased backward speed limit
    //   ship.velocityX -= initialBackwardAcceleration * Math.sin(angle);
    //   ship.velocityY += initialBackwardAcceleration * Math.cos(angle);

    //   // Limit backward speed
    //   // const currentSpeed = Math.sqrt(ship.velocityX * ship.velocityX + ship.velocityY * ship.velocityY);
    //   // if (currentSpeed > backwardSpeed) {
    //   //   ship.velocityX = (ship.velocityX / currentSpeed) * backwardSpeed;
    //   //   ship.velocityY = (ship.velocityY / currentSpeed) * backwardSpeed;
    //   // }

    //   // Generate thruster particles for backward movement
    //   generateThrusterParticles();

    // } else {
    //   // Apply natural deceleration when no thrust key is pressed
    //   ship.velocityX *= ship.deceleration;
    //   ship.velocityY *= ship.deceleration;
    // }


    // // Update ship position based on velocity
    // ship.x += ship.velocityX;
    // ship.y += ship.velocityY;

    // // Wrap the ship around the screen edges
    // if (ship.x < 0) ship.x = canvas.width;
    // else if (ship.x > canvas.width) ship.x = 0;
    // if (ship.y < 0) ship.y = canvas.height;
    // else if (ship.y > canvas.height) ship.y = 0;

    // // Handle ship rotation based on key states
    // if (keys['ArrowLeft'] || keys['a']) {
    //   ship.rotation -= ship.rotationSpeed;
    // }
    // if (keys['ArrowRight'] || keys['d']) {
    //   ship.rotation += ship.rotationSpeed;
    // }

    // // Handle shooting based on key state and cooldown
    // if (keys[' '] && ship.lasers.length < (ship.maxBulletsLevel * 3) && ship.laserTimer === 0) {
    //   shootLasers();
    // }

    checkGemCollection();
    updateGems();
    drawGems();

    if (activeWeaponClasses.includes('sonic')) {
        // Update sonic blast cooldown
        if (sonicBlast.timer > 0) {
            sonicBlast.timer--;
        } else {
            activateSonicBlast();
        }
    }

    // Update sonic blast waves
    updateSonicBlast();
    drawSonicBlast();

    if (activeWeaponClasses.includes('deathray')) {
        if (deathRay.timer > 0) {
            deathRay.timer--;
        } else {
            activateDeathRay();
        }
    }

    if (deathRayActive) {
        updateDeathRay();
    }

    if (activeWeaponClasses.includes('explosiverocket')) {
        if (explosiveRocket.timer > 0) {
            explosiveRocket.timer--;
        } else {
            fireExplosiveRocket();
        }
    }
    updateExplosiveRockets();

    if (activeWeaponClasses.includes('acid')) {
        if (acidBomb.timer > 0) {
            acidBomb.timer--;
        } else {
            fireAcidBomb();
        }
    }


    updateAcidBombs();
    updateAcidAreas();
    drawAcidBombs();
    drawAcidAreas();


    if (activeWeaponClasses.includes('freeze')) {
        if (freezeEffect.timer > 0) {
            freezeEffect.timer--;
        } else {
            activateFreezeEffect();
        }
    }


    updateFreezeEffect();

    if (activeWeaponClasses.includes('flamethrower')) {
        if (flamethrower.timer > 0) {
            flamethrower.timer--;
        } else if (keys[' ']) {
            activateFlamethrower();
        }
    }
    updateFlamethrower();
    updateAsteroidFire();

    if (activeWeaponClasses.includes('chainlightning')) {
        if (chainLightning.timer > 0) {
            chainLightning.timer--;
        } else {
            activateChainLightning();
        }
    }



    drawShip();
    drawActiveWeaponClasses();

    updateBoomerang();
    drawBoomerang();

    updateLasers();
    drawLasers();

    if (activeWeaponClasses.includes('nanoswarm')) {
        if (nanoswarm.timer > 0) {
            nanoswarm.timer--;
        } else {
            firenanoswarm();
        }
    }

    updatenanoswarms();
    drawnanoswarms();


    if (turret.bought) {
        updateTurret();
        updateTurretLasers();
        drawTurretLasers();
        drawTurret();
    }

    if (activeWeaponClasses.includes('bomberdrone')) {
        updateBomberDrones();
        drawBomberDrones();
    }

    updateDrones();
    drawDrones();

    updateAsteroids();
    drawAsteroids();

    if (!invincible) {
        for (let i = 0; i < asteroids.length; i++) {
            if (isColliding(ship, asteroids[i])) {
                processPlayerDeath();
            }
        }
    }

    checkLaserCollisions(ship.lasers, true);

    if (turret.bought) {
        checkLaserCollisions(turret.lasers, false);
    }

    if (invincible) {
        invincibilityTimer--;
        if (invincibilityTimer <= 0) invincible = false;
    }

    updateExplosions();
    drawExplosions();
    // drawMegaBossAlienLaser();


    updateAliens();
    updateAlienLasers();
    updateSwarmingAliens();
    drawSwarmingAliens();
    drawAliens();
    drawAlienLasers();
    updateBossAlien();
    drawBossAlien();
    updateBossAlienLaser();
    drawBossAlienLaser();
    updateSuperBossAlien();
    drawSuperBossAlien();
    updateMegaBossAlien();
    drawMegaBossAlien();
    updateAndDrawParticles();
    updateAndDrawShockwaves();



    spawnTimer -= 1 / 60; // Assuming 60 FPS

    if (spawnTimer <= 0) {
        wave++;
        if (meteorMode) {

            const side = Math.random() < 0.5 ? 'left' : 'right';
            showArrow(side);

        } else
            createAsteroids();
        spawnAliens(wave); // Spawn aliens based on the current wave
        spawnTimer = spawnCooldown;


    }

    if (gameOver) endGame();
    if (wave == 10 && currentMode == gameMode.EASY)
        updateAchievementsAtEnd();

    // if (wave == 30) updateAchievementsAtEnd();

    // Update and draw particles
    updateParticles();
    drawParticles();

    // drawEdgeOverlay();
    drawLives();
    drawScore();
    // if (gameOver) drawDamageReport();


}

function processPlayerDeath() {

    createExplosion(ship.x, ship.y);
    resetShip(false);

    if (!invincible) {
        lives--;
        // clear area after death
        createAreaDamage(ship.x, ship.y, 200, 10);
    }

    playShipDestroyedSound();
    invincible = true;
    invincibilityTimer = invincibilityDuration;
    if (lives === 0) gameOver = true;

}

function initializeGame(mode) {
    switch (mode) {
        case GameModes.EASY:
            asteroidDifficultySpeedMultiplier = 0.7;
            levelUpXPMultiplier = 1.07;
            invincibilityDuration = 220;
            modeScoreMultiplier = 1;
            break;
        case GameModes.NORMAL:
            asteroidDifficultySpeedMultiplier = 0.9;
            levelUpXPMultiplier = 1.17;
            invincibilityDuration = 190;
            modeScoreMultiplier = 4;
            break;
        case GameModes.HARD:
            asteroidDifficultySpeedMultiplier = 1.1;
            levelUpXPMultiplier = 1.27;
            modeScoreMultiplier = 6;
            break;
        case GameModes.HERO:
            asteroidDifficultySpeedMultiplier = 1.3;
            levelUpXPMultiplier = 1.35;
            modeScoreMultiplier = 8;
            break;
        case GameModes.METEORSHOWEREASY:
            asteroidDifficultySpeedMultiplier = 1.6;
            levelUpXPMultiplier = 1.1;
            modeScoreMultiplier = 1.2;
            meteorMode = true;
            break;
        case GameModes.METEORSHOWERNORMAL:
            asteroidDifficultySpeedMultiplier = 1.8;
            levelUpXPMultiplier = 1.2;
            modeScoreMultiplier = 4.2;
            meteorBooster = 7;
            meteorMode = true;
            break;
        case GameModes.METEORSHOWERHARD:
            asteroidDifficultySpeedMultiplier = 2;
            levelUpXPMultiplier = 1.3;
            meteorBooster = 14;
            modeScoreMultiplier = 6.2;
            meteorMode = true;
            break;
        case GameModes.METEORSHOWERHERO:
            asteroidDifficultySpeedMultiplier = 2.2;
            levelUpXPMultiplier = 1.4;
            meteorBooster = 21;
            modeScoreMultiplier = 8.2;
            meteorMode = true;
            break;
        case GameModes.PLANETEASY:
            asteroidDifficultySpeedMultiplier = 1.3;
            levelUpXPMultiplier = 1.1;
            gravityStrength = 60;
            meteorBooster = 7;
            modeScoreMultiplier = 1.6;
            planetMode = true;
            break;
        case GameModes.PLANETNORMAL:
            asteroidDifficultySpeedMultiplier = 1.5;
            levelUpXPMultiplier = 1.2;
            meteorBooster = 10;
            gravityStrength = 90;
            modeScoreMultiplier = 3.6;
            planetMode = true;

            break;
        case GameModes.PLANETHARD:
            asteroidDifficultySpeedMultiplier = 1.7;
            levelUpXPMultiplier = 1.3;
            meteorBooster = 15;
            gravityStrength = 120;
            planetMode = true;
            modeScoreMultiplier = 5.4;
            break;
        case GameModes.PLANETHERO:
            asteroidDifficultySpeedMultiplier = 1.9;
            levelUpXPMultiplier = 1.4;
            meteorBooster = 25;
            gravityStrength = 140;
            planetMode = true;
            modeScoreMultiplier = 7.2;
            break;
        case GameModes.ENDLESS_SLOW:
            asteroidDifficultySpeedMultiplier = 0.2; // Very slow asteroids
            levelUpXPMultiplier = 1.1;
            modeScoreMultiplier = 2;
            spawnCooldown = 6;
            break;



    }
    currentMode = mode;

    startGame();
}
