

// for leaderboard and telegram API 
let gameId = "InfiniteSpaceWar";



const joystick = document.getElementById('joystick');
const joystickInner = document.getElementById('joystick-inner');
const joystickHandle = document.getElementById('joystickHandle');
const restartButton = document.getElementById('restartButton');
const backgroundMusic = document.getElementById('background-music');
const megabossBackgroundMusic = document.getElementById('megaboss-background-music');
const superMegabossBackgroundMusic = document.getElementById('supermegaboss-background-music');
const octoBossBackgroundMusic = document.getElementById('octoboss-background-music');

let isTouchingJoystick = false;
let joystickStartX, joystickStartY;
let isMusicPlaying = true; // Flag to track music state

const coinsDisplay = document.getElementById('coins');

const laserLevelDisplay = document.getElementById('laserLevel');
// const accelerationLevelDisplay = document.getElementById('accelerationLevel');
const maxBulletsLevelDisplay = document.getElementById('maxBulletsLevel');
const rotationSpeedLevelDisplay = document.getElementById('rotationSpeedLevel');
const droneSpeedLevelDisplay = document.getElementById('droneSpeedLevel');
// const droneLaserSpeedLevelDisplay = document.getElementById('droneLaserSpeedLevel');
const droneLaserIntervalLevelDisplay = document.getElementById('droneLaserIntervalLevel');
let toggleMusicOff = false;
let toggleSoundOff = false;

const GameModes = {
    EASY: 'easy',
    NORMAL: 'normal',
    HARD: 'hard',
    HERO: 'heroic',
    METEORSHOWEREASY: 'meteorshowereasy',
    METEORSHOWERNORMAL: 'meteorshowernormal',
    METEORSHOWERHARD: 'meteorshowerhard',
    METEORSHOWERHERO: 'meteorshowerhero',
    PLANETEASY: 'planeteasy',
    PLANETNORMAL: 'planetnormal',
    PLANETHARD: 'planethard',
    PLANETHERO: 'planethero',
    ENDLESS_SLOW: 'endless_slow',
    COOP: 'coop'

};

let currentMode = GameModes.EASY; // Start with Easy mode by default
let modesUnlocked = {
    easy: true,
    normal: false,
    hard: false,
    hero: false,
    meteoreasy: false,
    meteornormal: false,
    meteorhard: false,
    planeteasy: false,
    planetnormal: false,
    planethard: false,
    planethero: false

};


const planet = {
    x: canvas.width / 2,  // X position in the middle of the canvas
    y: canvas.height / 2, // Y position in the middle of the canvas
    radius: 70            // Radius of the planet
};


let gravityStrength = 0;
let bonuslevelUpXPMultiplier = 1;
let fourthUpgradeUnlocked = false;
const levelUpModal = document.getElementById('levelUpModal');
let lastLevelUp = Date.now();


// Reset ship position
function resetShip(center = true) {
    if (center) {
        ship.x = canvas.width / 2;
        ship.y = canvas.height / 2; //TODO: somehow not working?
    }
    ship.velocityX = 0;
    ship.velocityY = 0;
    ship.speed = 0;
}


let explosiveRockets = [];



let gameStartTime;
let gameEndTime;

let damageBooster = 0;

let initialSlowDown = true;
let currentBackgroundImage = null;

let keys = {};
let isPaused = false;
let loginFormOpen = false;

let ship = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    size: 20,
    speed: 0,
    acceleration: 0.15,
    deceleration: 0.96,
    maxSpeed: 3,
    rotation: 0,
    rotationSpeed: 2.5,
    lasers: [],
    velocityX: 0,
    velocityY: 0,
    laserLevel: 2,
    accelerationLevel: 1,
    rotationSpeedLevel: 1,
    maxBulletsLevel: 1,
    explosiveLaserLevel: 0,
    laserCooldown: 30,
    laserTimer: 0,
    laserCooldownLevel: 1,
    weaponSlots: 5,
    upgradeSlots: 2,
    initialSlowDown: true,


};

let ship2 = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    size: 20,
    speed: 0,
    acceleration: 0.15,
    deceleration: 0.96,
    maxSpeed: 5,
    rotation: 0,
    rotationSpeed: 2.5,
    lasers: [],
    velocityX: 0,
    velocityY: 0,
    laserLevel: 2,
    accelerationLevel: 1,
    rotationSpeedLevel: 1,
    maxBulletsLevel: 1,
    explosiveLaserLevel: 0,
    laserCooldown: 30,
    laserTimer: 0,
    laserCooldownLevel: 1,
    weaponSlots: 5,
    upgradeSlots: 2,
    initialSlowDown: true,


};

let shipRelativeX = ship.x / canvas.width;
let shipRelativeY = ship.y / canvas.height;

function updateShipPositionAfterResize() {
    ship.x = shipRelativeX * canvas.width;
    ship.y = shipRelativeY * canvas.height;
}


let activeWeaponClasses = []; // Array to store active weapon classes
let particles = []; // Array to store thruster particles

let level = 1;
let xp = 0;
let xpToNextLevel = 300;

let asteroidDifficultySpeedMultiplier = 1;
let levelUpXPMultiplier = 1.2;
let meteorMode = false;
let planetMode = false;
let invincibilityDuration = 160; // 3.5 seconds (60 FPS)
let achievements = [];

const Achievements = {
    reach_wave_2: { reached: false, icon: 'achievements/whitehat.png', description: 'Reach Wave 2' },
    reach_wave_5: { reached: false, icon: 'achievements/whitehat.png', description: 'Reach Wave 5' },
    // reach_wave_57: { reached: false, icon: 'achievements/whitehat.png', description: 'Reach Wave 7' },
    reach_wave_10: { reached: false, icon: 'achievements/angelcapitan.png', description: 'Reach Wave 10. Unlock Sonic Blast.' },
    // reach_wave_15: { reached: false, icon: 'achievements/insanecat.png', description: 'Reach Wave 15' },
    reach_wave_20: { reached: false, icon: 'achievements/keroaccat.png', description: 'Reach Wave 20. Unlock Boomerang.' },
    // reach_wave_25: { reached: false, icon: 'achievements/onthemoon.png', description: 'Reach Wave 25' },
    destroy_100_asteroids: { reached: false, icon: 'achievements/speedy.png', description: 'Destroy 100 Asteroids in One Game. Unlock Drone.' },
    // destroy_500_asteroids: { reached: false, icon: 'achievements/_5973.png', description: 'Destroy 500 Asteroids in One Game' },
    complete_easy_mode: { reached: false, icon: 'achievements/whitehat.png', description: 'Complete Easy Mode.' },
    complete_normal_mode: { reached: false, icon: 'achievements/insanecat.png', description: 'Normal Mode. Unlock Acid Bomb.' },
    acid_bomb_damage: { reached: false, damage: 0, required: 2500, icon: 'achievements/acid.png', description: 'Deal 2,500 Damage with Acid Bomb. Unlock Flamethrower.' },
    laser_damage: { reached: false, damage: 0, required: 2500, icon: 'achievements/deathray2.png', description: 'Deal 2,500 Damage with Laser. Unlock Explosive Laser.' },
    drone_damage: { reached: false, damage: 0, required: 1500, icon: 'achievements/storm_drone.png', description: 'Deal 1,500 Damage with Drone. Unlock Drone Army.' },
    explosive_laser_damage: { reached: false, damage: 0, required: 5000, icon: 'achievements/explosive.png', description: 'Deal 5,000 Damage with Explosive Laser' },
    death_ray_damage: { reached: false, damage: 0, required: 10000, icon: 'achievements/deathray.png', description: 'Deal 10,000 Damage with Death Ray. Unlock Extra Choice.' },
    no_lives_lost: { reached: false, icon: 'achievements/orpheus.png', description: 'Survived with No Lives Lost. Unlock Nano Swarm.' },
    complete_hard_mode: { reached: false, icon: 'achievements/explosion.png', description: 'Hard Mode. Unlock Explosive Rocket.' },
    complete_hero_mode: { reached: false, icon: 'achievements/cyberpunk.png', description: 'Hero Mode. Unlock Extra Life.' },
    kill_5_aliens: { reached: false, icon: 'achievements/aliensign.png', description: 'Kill 5 Aliens. Unlock Death Ray.' },
    kill_50_aliens: { reached: false, icon: 'achievements/aliensign.png', description: 'Kill 50 Aliens. Unlock Chain Lightning.' },
    kill_500_aliens: { reached: false, icon: 'achievements/aliensign.png', description: 'Kill 500 Aliens. Unlock Sonic Boomerang.' },
    complete_meteor_easy_mode: { reached: false, icon: 'achievements/meteor_one.png', description: 'Shower Easy Mode. Unlock Starhawk' },
    complete_meteor_normal_mode: { reached: false, icon: 'achievements/meteor_acid.png', description: 'Shower Normal Mode. Unlock Double Turret.' },
    complete_meteor_hard_mode: { reached: false, icon: 'achievements/meteor_small.png', description: 'Shower Hard Mode. Unlock Solar Phoenix .' },
    complete_meteor_hero_mode: { reached: false, icon: 'achievements/death_meteor.png', description: 'Shower Hero Mode. Unlock Quantum Striker' },
    complete_planet_easy_mode: { reached: false, icon: 'achievements/planet_medium.png', description: 'Planet Easy Mode.' },
    complete_planet_normal_mode: { reached: false, icon: 'achievements/storm_medium.png', description: 'Planet Normal Mode. Unlock Triple Turret.' },
    complete_planet_hard_mode: { reached: false, icon: 'achievements/onthemoon.png', description: 'Planet Hard Mode. Unlock Explosive Rocket.' },
    complete_planet_hero_mode: { reached: false, icon: 'achievements/planet_huge.png', description: 'Planet Hero Mode' },
    alien_megaboss_killed: { reached: false, icon: 'achievements/planet_huge.png', description: 'Killed Alien Megaboss. Mega unlock.' },
    alien_supermegaboss_killed: { reached: false, icon: 'achievements/planet_huge.png', description: 'Killed Alien SuperMegaBoss. Super Secret unlock.' },
    alien_octopus_killed: { reached: false, icon: 'achievements/planet_huge.png', description: 'Killed Vampire Alien Octopus. Super Mega Secret unlock.' },
    million_score: { reached: false, icon: 'achievements/cyberpunk.png', description: 'Get a million points. Invincibility Shield.' },
    wave_60_endless: { reached: false, icon: 'achievements/cyberpunk.png', description: 'Reach wave 60 on Endless. Piercing Laser.' },
    space_pizza: { reached: false, icon: 'icons/upgrades/pizza.png', description: 'Find the Space Pizza.' },
    space_pickle: { reached: false, icon: 'icons/upgrades/pickle.png', description: 'Find the deep space pickle.' },
    space_pixie: { reached: false, icon: 'icons/upgrades/pixie.png', description: 'Find the pixie.' },
    space_monkey: { reached: false, icon: 'icons/upgrades/monkey.png', description: 'Find the space monkey.' },
    space_potato: { reached: false, icon: 'icons/upgrades/potato.png', description: 'Find the space potato.' },
    dark_side: { reached: false, icon: 'icons/upgrades/darkside.png', description: 'Make a deal with Dark Side.' },


};

let afterGameAchievements = null;




let touchAccelerating = false;


let acidBomb = {
    cooldown: 300,
    timer: 0,
    duration: 300, // Duration the acid effect lasts (5 seconds at 60 FPS)
    damagePerSecond: 1,
    size: 50,
    activeBombs: [],
    activeAreas: []
};

let acidBombUpgrades = {
    duration: 1,
    cooldown: 1,
    size: 1
};

let meteorBooster = 0;
let modeScoreMultiplier = 1;
let megaExplosions = [];




let droneArmy = false;



// KEY CONFIG VARs
let coins = 10000;


let score = 0;
let asteroids = [];
let gameLoop;
let explosions = [];
let lives = 3;
let testMode = false;

if (testMode)
    lives = 1;
let gameOver = false;
let invincible = false;
let invincibilityTimer = 0;


let wave = 1;
let waveMessageTimer = 0;
const waveMessageDuration = 180; // 3 seconds (60 FPS)
let asteroidsKilled = 0;
let aliensKilled = 0;
let drones = [];
const droneCost = 800;
let spawnCooldown = 12; // Cooldown time in seconds
let spawnTimer = spawnCooldown;
let bonusCoins = 0;

let droneUpgrades = {
    damageLevel: 1,
    speed: 1,
    laserSpeed: 1,
    laserInterval: 1

};


// Game loop
function startGame() {
    gameStartTime = Date.now();
    if (document.getElementById('endScreen'))
        document.getElementById('endScreen').style.display = 'none';
    if (document.getElementById('loginContainer'))
        document.getElementById('loginContainer').style.display = 'none';
    if (document.getElementById('loginPopup'))
        document.getElementById('loginPopup').style.display = 'none';
    if (document.getElementById('userInfo')) {
        document.getElementById('userInfo').classList.add('hidden');
        document.getElementById('userInfo').style.display = 'none';
    }
    if (document.getElementById('technologiesCount'))
        document.getElementById('technologiesCount').style.display = 'none';
    if (document.getElementById('startScreen'))
        document.getElementById('startScreen').style.display = 'none';
    if (document.getElementById('shipType'))
        document.getElementById('shipType').style.display = 'none';

    droneUpgrades = {
        speed: 1,
        laserSpeed: 1,
        laserInterval: 1,
        damageLevel: 1

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
    if (!toggleMusicOff)
        backgroundMusic.play(); // Play the background music
    isMusicPlaying = true;
}

// TEMP:(?) disable resize
const resizeCanvas = () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    resetShip();
    // Scale the canvas to handle high DPI screens
    // ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // // Reposition the ship to the center of the canvas
    // ship.x = canvas.width / 2 / window.devicePixelRatio;
    // ship.y = canvas.height - 50 / window.devicePixelRatio;
};
resizeCanvas();

// window.addEventListener('resize', resizeCanvas);


function toggleMusic() {
    if (!toggleMusicOff)
        toggleMusicOff = true;
    backgroundMusic.pause();

    if (isMusicPlaying) {
        backgroundMusic.pause();
    } else {
        backgroundMusic.play();
    }
    isMusicPlaying = !isMusicPlaying;
}

function toggleSound() {
    if (!toggleSoundOff)
        toggleSoundOff = true;
    else
        toggleSoundOff = false;

}




function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);

}



function update() {

    calculateAndAdjustFPS(); //optimize.js

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentMode == GameModes.EASY || currentMode == GameModes.NORMAL || currentMode == GameModes.HARD || currentMode == GameModes.HERO)
        drawSubtleGridBackground(ctx, canvas.width, canvas.height);
    else if (currentMode == GameModes.METEORSHOWEREASY || currentMode == GameModes.METEORSHOWERNORMAL || currentMode == GameModes.METEORSHOWERHARD || currentMode == GameModes.METEORSHOWERHERO)
        drawZigzagGridBackground(ctx, canvas.width, canvas.height);
    else if (currentMode == GameModes.PLANETEASY || currentMode == GameModes.PLANETNORMAL || currentMode == GameModes.PLANETHARD || currentMode == GameModes.PLANETHERO)
        drawGravityWellBackground(ctx, canvas.width, canvas.height);
    else if (currentMode == GameModes.ENDLESS_SLOW)
        drawWarpedBackground(ctx, canvas.width, canvas.height);

    // drawWarpedGrid();


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

    if (document.getElementById('loginPopup') && document.getElementById('loginPopup').style.display == 'none') {

        if (currentMode === GameModes.COOP) {
            updateShip(ship2, 'a', 'd', 'w', 's', 'q');
        } else {
            updateShip(ship, 'a', 'd', 'w', 's', 'q');

        }

    }



    checkFloatingIslandSpawn();
    updateFloatingIsland();
    checkIslandCollision();
    updateMegaUpgrades();
    drawFloatingIsland();
    drawActiveMegaUpgrades();
    drawRareAsteroidIndicators();
    drawMegaExplosions();

    if (planetMode) {
        applyGravity(ship);
        if (currentMode === GameModes.COOP) {
            applyGravity(ship2);
        }
    }

    // if (Math.abs(ship.velocityX) < 0.9 && Math.abs(ship.velocityY) < 0.9) {
    //   if (!toggleMusicOff) backgroundMusic.play(); // Resume the background music (if hasn't started)
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
    drawExplosiveRockets();

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
    // updateSwarmingAliens();
    // drawSwarmingAliens();
    drawAliens();
    updateBossAlien();
    drawBossAlien();
    updateBossAlienLaser();
    drawBossAlienLaser();
    updateSuperBossAlien();
    drawSuperBossAlien();
    updateMegaBossAlien();
    drawMegaBossAlien();
    updateOctoBoss();
    drawOctoBoss();
    updateAndDrawParticles();
    updateAndDrawShockwaves();
    drawAlienLasers();



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

    updateAndDrawFloatingUpgrades();

    if (gameOver) endGame();
    if (wave == 10 && currentMode == GameModes.EASY)
        updateAchievementsAtEnd();

    // if (wave == 30) updateAchievementsAtEnd();

    // Update and draw particles
    updateParticles();
    drawParticles();
    // drawEdgeOverlay();
    drawLives();
    drawScore();

    // if (gameOver) drawDamageReport();
    drawShip();


}

function processPlayerDeath() {
    resetShip(false);

    if (!invincible) {
        lives--;

        // Trigger the explosion immediately
        createExplosion(ship.x, ship.y, 10, 15);

        // Delay the area damage after the explosion (e.g., 1 second delay = 1000 milliseconds)
        setTimeout(() => {
            createAreaDamage(ship.x, ship.y, 170, 10);
        }, 1000); // 1000 milliseconds = 1 second delay
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
            invincibilityDuration = 180;
            modeScoreMultiplier = 4;
            break;
        case GameModes.HARD:
            asteroidDifficultySpeedMultiplier = 1.1;
            levelUpXPMultiplier = 1.27;
            invincibilityDuration = 140;
            modeScoreMultiplier = 6;
            break;
        case GameModes.HERO:
            asteroidDifficultySpeedMultiplier = 1.3;
            levelUpXPMultiplier = 1.35;
            invincibilityDuration = 130;
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
            invincibilityDuration = 150;

            meteorBooster = 7;
            meteorMode = true;
            break;
        case GameModes.METEORSHOWERHARD:
            asteroidDifficultySpeedMultiplier = 2;
            levelUpXPMultiplier = 1.3;
            meteorBooster = 14;
            modeScoreMultiplier = 6.2;
            invincibilityDuration = 140;
            meteorMode = true;
            break;
        case GameModes.METEORSHOWERHERO:
            asteroidDifficultySpeedMultiplier = 2.2;
            levelUpXPMultiplier = 1.4;
            meteorBooster = 21;
            modeScoreMultiplier = 8.2;
            meteorMode = true;
            invincibilityDuration = 120;
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
            invincibilityDuration = 140;

            modeScoreMultiplier = 5.4;
            break;
        case GameModes.PLANETHERO:
            asteroidDifficultySpeedMultiplier = 1.9;
            levelUpXPMultiplier = 1.4;
            meteorBooster = 25;
            gravityStrength = 140;
            planetMode = true;
            invincibilityDuration = 130;

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


function handleTouch(e) {
    e.preventDefault(); // Prevent default touch behaviors

    if (e.touches.length === 1) {
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const canvasWidth = canvas.width;
        const partWidth = canvasWidth / 5; // Divide the canvas width into 5 parts

        if (touchX < partWidth) {
            // Hard left turn
            ship.rotation -= (ship.rotationSpeed * 3);
        } else if (touchX < partWidth * 2) {
            // Soft left turn
            ship.rotation -= ship.rotationSpeed;
        } else if (touchX < partWidth * 3) {
            // Acceleration
            touchAccelerating = true;
        } else if (touchX < partWidth * 4) {
            // Soft right turn
            ship.rotation += ship.rotationSpeed;
        } else {
            // Hard right turn
            ship.rotation += (ship.rotationSpeed * 3);
        }

    }

    if (e.target === canvas && e.touches.length === 2) {
        // Two-finger touch for firing
        if (ship.lasers.length < (ship.maxBulletsLevel * 3) && ship.laserTimer === 0) {
            shootLasers();
        }
    }
}

function updateShip(ship, leftKey, rightKey, upKey, downKey, shootKey) {
    let angle = ship.rotation * Math.PI / 180;

    if (keys[leftKey]) {
        ship.rotation -= ship.rotationSpeed;
    }
    if (keys[rightKey]) {
        ship.rotation += ship.rotationSpeed;
    }

    if (keys[upKey] || (ship === ship && touchAccelerating)) {
        if (!toggleMusicOff) backgroundMusic.play();
        playRandomThrusterSound();

        let accelerationAmount = ship.acceleration;

        if (ship === ship && touchAccelerating)
            accelerationAmount *= 2;
        ship.velocityX += accelerationAmount * Math.sin(angle);
        ship.velocityY -= accelerationAmount * Math.cos(angle);

        generateThrusterParticles(ship);
        ship.initialSlowDown = true;

    } else if (keys[downKey]) {
        if (ship.initialSlowDown) {
            ship.velocityX *= 0.75;
            ship.velocityY *= 0.75;
            if (Math.abs(ship.velocityX) < 2 && Math.abs(ship.velocityY) < 2) {
                ship.initialSlowDown = false;
            }
        }
        else {
            ship.velocityX *= 0.95;
            ship.velocityY *= 0.95;
        }

        if (Math.abs(ship.velocityX) < 0.9 && Math.abs(ship.velocityY) < 0.9) {
            if (!toggleMusicOff) backgroundMusic.play();
            playRandomThrusterSound();

            const initialBackwardAcceleration = ship.acceleration * 1.5;
            const backwardSpeed = ship.maxSpeed;
            ship.velocityX -= initialBackwardAcceleration * Math.sin(angle);
            ship.velocityY += initialBackwardAcceleration * Math.cos(angle);

            generateThrusterParticles(ship);
        }
    } else {
        ship.velocityX *= ship.deceleration;
        ship.velocityY *= ship.deceleration;
    }

    // Limit the ship's speed to maxSpeed
    let speed = Math.sqrt(ship.velocityX * ship.velocityX + ship.velocityY * ship.velocityY);
    if (speed > ship.maxSpeed) {
        let ratio = ship.maxSpeed / speed;
        ship.velocityX *= ratio;
        ship.velocityY *= ratio;
    }

    if (keys[shootKey] && ship.lasers.length < (ship.maxBulletsLevel * 3) && ship.laserTimer === 0) {
        shootLasers(ship);
    }

    ship.x += ship.velocityX;
    ship.y += ship.velocityY;

    if (ship.x < 0) ship.x = canvas.width;
    else if (ship.x > canvas.width) ship.x = 0;
    if (ship.y < 0) ship.y = canvas.height;
    else if (ship.y > canvas.height) ship.y = 0;
}

function drawPlanet() {
    const gradient = ctx.createRadialGradient(
        planet.x,
        planet.y,
        0,
        planet.x,
        planet.y,
        planet.radius
    );
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)'); // Center color (solid red)
    gradient.addColorStop(1, 'rgba(128, 0, 0, 1)'); // Edge color (darker red)

    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.closePath();
}

function drawEdgeOverlay() {
    const overlayWidth = canvas.width * 0.05;
    const overlayHeight = canvas.height * 0.05;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.99)'; // Semi-transparent black color

    // Top overlay
    ctx.fillRect(0, 0, canvas.width, overlayHeight);
    // Bottom overlay
    ctx.fillRect(0, canvas.height - overlayHeight, canvas.width, overlayHeight);
    // Left overlay
    ctx.fillRect(0, 0, overlayWidth, canvas.height);
    // Right overlay
    ctx.fillRect(canvas.width - overlayWidth, 0, overlayWidth, canvas.height);
}


// Function to generate thruster particles
function generateThrusterParticles() {
    const angle = ship.rotation * Math.PI / 180;
    const particle = {
        x: ship.x - Math.sin(angle) * ship.size,
        y: ship.y + Math.cos(angle) * ship.size,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1,
        direction: angle + Math.PI,
        life: Math.random() * 30 + 20,
        color: 'rgba(255, 165, 0, 0.8)'
    };
    particles.push(particle);
}

// Function to update particles
function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += Math.sin(particle.direction) * particle.speed;
        particle.y -= Math.cos(particle.direction) * particle.speed;
        particle.life--;
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

// Function to draw particles
function drawParticles() {
    for (const particle of particles) {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    }
}



// Function to create area damage
function createAreaDamage(x, y, radius, damage = 1) {
    let totalDamage = 0;
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];
        let dx = asteroid.x - x;
        let dy = asteroid.y - y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < radius) {
            let actualDamage = Math.min(damage + damageBooster, asteroid.hitpoints);
            asteroid.hitpoints -= actualDamage;
            totalDamage += actualDamage;

            if (asteroid.hitpoints <= 0) {
                // processAsteroidDeath(asteroid);
                asteroids.splice(i, 1);
            }

            coins += actualDamage * 15;
            increaseXP(actualDamage * 15);
            score += actualDamage * 50;
        }
    }
    return totalDamage;
}


function increaseXP(amount) {

    const currTimeInMS = Date.now();
    if (xp >= (xpToNextLevel / 1)) {
        if (lastLevelUp + 2000 > currTimeInMS) {
            amount *= 0.05;
        } else if (lastLevelUp + 5000 > currTimeInMS) {
            amount *= .2;
        } else if (lastLevelUp + 8000 > currTimeInMS) {
            amount *= .3;
        }
    }
    xp += amount;
    document.getElementById('xpBarContainer').style.display = 'block';

    updateXPBar();

    if (xp >= xpToNextLevel && currTimeInMS > (lastLevelUp + 8000)) {

        levelUp();
    }
}

function updateXPBar() {
    if (!megaBossAlien && !superbossAlien) {
        const xpBar = document.getElementById('xpBar');
        xpBar.style.backgroundColor = '#0f0';
        const xpPercentage = (xp / xpToNextLevel) * 100;
        xpBar.style.width = xpPercentage + '%';

    }

}



// Function to get a random shade of orange
function getRandomOrangeShade() {
    const shades = ['#FF4500', '#FF6347', '#FF8C00', '#FFA500', '#FF7F50'];
    return shades[Math.floor(Math.random() * shades.length)];
}

function getRandomBlueShade() {
    const shades = ['#1E90FF', '#00BFFF', '#87CEFA', '#4682B4', '#5F9EA0'];
    return shades[Math.floor(Math.random() * shades.length)];
}

function getRandomPurpleShade() {
    const shades = ['#800080', '#8B008B', '#9370DB', '#9400D3', '#9932CC', '#BA55D3', '#DA70D6', '#DDA0DD', '#EE82EE', '#FF00FF'];
    return shades[Math.floor(Math.random() * shades.length)];
}

function getRandomRedShade() {
    const shades = ['#FF0000', '#DC143C', '#B22222', '#FF6347', '#FF4500'];
    return shades[Math.floor(Math.random() * shades.length)];
}

// Draw the explosions on the canvas
function drawExplosions() {
    for (let i = 0; i < explosions.length; i++) {
        let explosion = explosions[i];
        ctx.fillStyle = explosion.color;
        ctx.globalAlpha = explosion.alpha;
        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        explosion.alpha -= explosion.alphaDecay;
        if (explosion.alpha <= 0) {
            explosions.splice(i, 1);
            i--;
        }
    }
}

// Update explosions with random alpha decay
function updateExplosions() {
    for (let i = 0; i < explosions.length; i++) {
        explosions[i].size += 1;
        explosions[i].alpha -= explosions[i].alphaDecay;
        if (explosions[i].alpha <= 0) {
            explosions.splice(i, 1);
            i--;
        }
    }
}

// Draw explosions with random colors
function drawExplosions() {
    for (let i = 0; i < explosions.length; i++) {
        ctx.save();
        ctx.globalAlpha = explosions[i].alpha;
        ctx.beginPath();
        ctx.arc(explosions[i].x, explosions[i].y, explosions[i].size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = explosions[i].color;
        ctx.fill();
        ctx.restore();
    }
}

function isColliding(obj1, obj2) {
    if (obj1.radius) {
        // Circular collision detection for sonic blast wave
        let dx = obj1.x - obj2.x;
        let dy = obj1.y - obj2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < obj1.radius + obj2.size;
    } else {
        // Original collision detection
        let dx = obj1.x - obj2.x;
        let dy = obj1.y - obj2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (obj1.size || 1) + obj2.size;
    }
}

function drawScore() {
    const secondsUntilNextWave = Math.ceil(spawnTimer);

    document.getElementById('waveCounter').textContent = `Wave: ${wave} ${secondsUntilNextWave}s`;

    if (!isMobile()) {
        // document.getElementById('controlsInfo').textContent = "[m]usic sou[n]d [v]olume [p]ause [i]nfo";
        if (waitAndClaimMode)
            document.getElementById('controlsInfo').textContent = "[r]edeem s[e]c se[t]tings [p]ause [i]nfo";
        else
            document.getElementById('controlsInfo').textContent = "s[e]c se[t]tings [p]ause [i]nfo";

    } else {
        document.getElementById('controlsInfo').textContent = '';
    }
}

function pauseGame() {
    if (!isPaused) {
        clearInterval(gameLoop);
        isPaused = true;
    }
}

function resumeGame() {

    const modals = document.querySelectorAll('.modal');
    const openModals = Array.from(modals).filter(modal => {
        return window.getComputedStyle(modal).display !== 'none';
    });

    // const openModals = document.querySelectorAll('.modal:not([style*="display: none"])');
    console.log(openModals.length);

    if (openModals.length === 0) {
        clearInterval(gameLoop);
        gameLoop = setInterval(update, 1000 / 60);
        isPaused = false;
    }
}

// Draw wave message
function drawWaveMessage() {
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Wave ' + wave, canvas.width / 2, canvas.height / 2);
}


document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        // Store ship's position relative to canvas size
        shipRelativeX = ship.x / canvas.width;
        shipRelativeY = ship.y / canvas.height;

        // Adjust canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Update ship's position based on new canvas size
        updateShipPositionAfterResize();
    } else {
        // Handle exit full screen if needed
        shipRelativeX = ship.x / canvas.width;
        shipRelativeY = ship.y / canvas.height;

        // Reset canvas size (example: original width and height)
        canvas.width = originalWidth;
        canvas.height = originalHeight;

        // Update ship's position based on new canvas size
        updateShipPositionAfterResize();
    }
});

// window.addEventListener('resize', () => {
//     if (document.fullscreenElement) {
//         // Store ship's position relative to canvas size
//         shipRelativeX = ship.x / canvas.width;
//         shipRelativeY = ship.y / canvas.height;

//         // Adjust canvas size
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;

//         // Update ship's position based on new canvas size
//         updateShipPositionAfterResize();
//     }
// });


canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', () => {
    touchAccelerating = false;
});


function handleKeyDown(event) {
    keys[event.key] = true;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
        event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault();
    }

    if (document.getElementById('loginPopup') && document.getElementById('loginPopup').style.display == 'none') {

        // Player 2 controls
        if (event.key === 'a' || event.key === 'd' ||
            event.key === 'w' || event.key === 's' || event.key === 'q') {
            event.preventDefault();
        }

        if (event.key === 'Enter') {
            if (document.getElementById('rouletteContainer').style.display == 'block') {
                startRoulette();

            }
        } else if (event.key === 'a' || event.key === 'A') {
            activateGemUpgrades();
        } else if (event.key === 'i' || event.key === 'I') {
            toggleWeaponInfo();
        } else if (event.key === 'p' || event.key === 'P') {
            if (isPaused) {
                resumeGame();
            } else {
                if (document.getElementById('rouletteContainer').style.display == 'none' && document.getElementById('endScreen').style.display == 'none') {
                    pauseGame();
                }
            }
        } else if (event.key === 'm' || event.key === 'M') {
            toggleMusic();
        } else if (event.key === 'n' || event.key === 'N') {
            toggleSound();
            // } else if (event.key === 'u' || event.key === 'U') {
            //     clearInterval(gameLoop);
            //     isPaused = true;
            //     document.getElementById('rouletteContainer').style.display = 'block';
        } else if (event.key === 't' || event.key === 'T') {
            if (!loginFormOpen) toggleVolumeScreen();
        } else if (event.key === 'e' || event.key === 'E') {
            fireSecondaryWeapon(); // Use the selected secondary weapon
        } else if (event.key === 'r' || event.key === 'R') {
            claimLevelUps(); // Claim level ups
        }

        // Upgrade selection during level up
        if (document.getElementById('levelUpModal').style.display === 'block') {
            if (event.key === '1') {
                selectUpgrade(1);
            } else if (event.key === '2') {
                selectUpgrade(2);
            } else if (event.key === '3') {
                selectUpgrade(3);
            } else if (fourthUpgradeUnlocked && event.key === '4') {
                selectUpgrade(4);
            }
        }

        // Handle mega upgrade selection
        if (document.getElementById('upgradeModal')) {
            const megaUpgradeOptions = document.querySelectorAll('.mega-upgrade-option');
            if (event.key === '1' && megaUpgradeOptions[0]) {
                megaUpgradeOptions[0].click(); // Select the first upgrade
            } else if (event.key === '2' && megaUpgradeOptions[1]) {
                megaUpgradeOptions[1].click(); // Select the second upgrade
            } else if (event.key === '3' && megaUpgradeOptions[2]) {
                megaUpgradeOptions[2].click(); // Select the third upgrade
            }
        }
    }
}

function handleKeyUp(event) {
    keys[event.key] = false;
}


function countTechnologies() {
    let count = 0;

    // These are all the achievements that have a specific weapon unlock assigned
    if (Achievements.reach_wave_2.reached) count++;
    if (Achievements.reach_wave_5.reached) count++;
    if (Achievements.reach_wave_10.reached) count++;
    if (Achievements.reach_wave_20.reached) count++;
    if (Achievements.complete_normal_mode.reached) count++;
    if (Achievements.complete_hard_mode.reached) count++;
    if (Achievements.complete_hero_mode.reached) count++;
    if (Achievements.acid_bomb_damage.reached) count++;
    if (Achievements.destroy_100_asteroids.reached) count++;
    if (Achievements.kill_5_aliens.reached) count++;
    if (Achievements.kill_50_aliens.reached) count++;
    if (Achievements.kill_500_aliens.reached) count++;
    if (Achievements.no_lives_lost.reached) count++;
    if (Achievements.death_ray_damage.reached) count++;
    if (Achievements.complete_meteor_normal_mode.reached) count++;
    if (Achievements.complete_meteor_hard_mode.reached) count++;
    if (Achievements.complete_meteor_hero_mode.reached) count++;

    if (Achievements.complete_planet_normal_mode.reached) count++;
    if (Achievements.complete_planet_hard_mode.reached) count++;
    if (Achievements.drone_damage.reached) count++;
    if (Achievements.laser_damage.reached) count++;
    if (Achievements.alien_megaboss_killed.reached) count++;
    if (Achievements.wave_60_endless.reached) count++;
    if (Achievements.million_score.reached) count++;

    if (Achievements.space_potato.reached) count++;
    if (Achievements.space_pizza.reached) count++;
    if (Achievements.space_monkey.reached) count++;
    if (Achievements.space_pixie.reached) count++;
    if (Achievements.space_pickle.reached) count++;
    if (Achievements.dark_side.reached) count++;

    if (Achievements.alien_supermegaboss_killed.reached) count++;
    if (Achievements.alien_octopus_killed.reached) count++;
    if (Achievements.alien_megaboss_killed.reached) count++;

    // 4 ship types to be unlocked + basic ship.

    // Check the conditions of each ship
    for (const ship in ships) {
        if (ships.hasOwnProperty(ship)) {
            if (ships[ship].condition()) count++;
        }
    }
    // think we are at 38
    return count;
}


function populateAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    achievementsList.innerHTML = '';

    // document.getElementById('normalButton').disabled = !Achievements.complete_easy_mode.reached;
    document.getElementById('hardButton').disabled = !Achievements.complete_normal_mode.reached;
    document.getElementById('heroButton').disabled = !Achievements.complete_hard_mode.reached;


    document.getElementById('meteorEasyButton').disabled = !Achievements.complete_normal_mode.reached;
    document.getElementById('meteorNormalButton').disabled = !Achievements.complete_meteor_easy_mode.reached;
    document.getElementById('meteorHardButton').disabled = !Achievements.complete_meteor_normal_mode.reached;
    document.getElementById('meteorHeroButton').disabled = !Achievements.complete_meteor_hard_mode.reached;

    document.getElementById('planetEasyButton').disabled = !Achievements.complete_meteor_normal_mode.reached;
    document.getElementById('planetNormalButton').disabled = !Achievements.complete_planet_easy_mode.reached;
    document.getElementById('planetHardButton').disabled = !Achievements.complete_planet_normal_mode.reached;
    document.getElementById('planetHeroButton').disabled = !Achievements.complete_planet_hard_mode.reached;

    console.log(Achievements);
    // console.log("pop");
    for (const key in Achievements) {
        if (Achievements.hasOwnProperty(key)) {
            // console.log("pop" + key);

            const achievement = Achievements[key];
            const achieved = achievement.reached || (achievement.damage && achievement.damage >= achievement.required);

            const achievementElement = document.createElement('div');
            achievementElement.classList.add('achievement');
            achievementElement.style.opacity = achieved ? '1' : '0.5';

            const icon = document.createElement('img');
            icon.src = achievement.icon;
            icon.alt = achievement.description;
            achievementElement.appendChild(icon);
            const description = document.createElement('span');
            description.textContent = achievement.description;
            achievementElement.appendChild(description);

            achievementsList.appendChild(achievementElement);
        }
    }

    let count = countTechnologies();
    const technologiesCountElement = document.getElementById('technologiesCount');
    let totalTechnologyCount = 0;
    totalTechnologyCount += 5; //ships
    totalTechnologyCount += 13; //weapons
    totalTechnologyCount += 7; //boosters
    totalTechnologyCount += 17; //upgrades
    technologiesCountElement.textContent = `${count} of ${totalTechnologyCount}  technologies unlocked`;

}



function updateAchievementsAtEnd() {

    const newlyUnlockedAchievements = [];

    const newlyUnlockedWeapons = [];

    const addAchievement = (achievementKey) => {
        if (!Achievements[achievementKey].reached) {
            Achievements[achievementKey].reached = true;
            newlyUnlockedAchievements.push(Achievements[achievementKey].description);
        }
    };

    if (wave >= 2) addAchievement('reach_wave_2');
    if (wave >= 5) addAchievement('reach_wave_5');
    if (wave >= 10) addAchievement('reach_wave_10');
    if (wave >= 20) addAchievement('reach_wave_20');
    if (score >= 1000000) addAchievement('million_score');

    if (damageReport.acid >= Achievements.acid_bomb_damage.required) addAchievement('acid_bomb_damage');
    if (damageReport.explosive >= Achievements.explosive_laser_damage.required) addAchievement('explosive_laser_damage');
    if (asteroidsKilled >= 100) addAchievement('destroy_100_asteroids');
    if (lives === 3) addAchievement('no_lives_lost');

    const gameModeAchievements = [
        { key: 'complete_easy_mode', mode: GameModes.EASY },
        { key: 'complete_normal_mode', mode: GameModes.NORMAL },
        { key: 'complete_hard_mode', mode: GameModes.HARD },
        { key: 'complete_hero_mode', mode: GameModes.HERO },
        { key: 'complete_meteor_easy_mode', mode: GameModes.METEORSHOWEREASY },
        { key: 'complete_meteor_normal_mode', mode: GameModes.METEORSHOWERNORMAL },
        { key: 'complete_meteor_hard_mode', mode: GameModes.METEORSHOWERHARD },
        { key: 'complete_meteor_hero_mode', mode: GameModes.METEORSHOWERHERO },
        { key: 'complete_planet_easy_mode', mode: GameModes.PLANETEASY },
        { key: 'complete_planet_normal_mode', mode: GameModes.PLANETNORMAL },
        { key: 'complete_planet_hard_mode', mode: GameModes.PLANETHARD },
        { key: 'complete_planet_hero_mode', mode: GameModes.PLANETHERO }
    ];

    gameModeAchievements.forEach(({ key, mode }) => {
        if (currentMode === mode && wave >= 30) addAchievement(key);
    });
    if (currentMode == GameModes.ENDLESS_SLOW && wave >= 30)
        addAchievement('space_pizza');


    if (currentMode == GameModes.ENDLESS_SLOW && wave >= 60)
        addAchievement('wave_60_endless');

    // addAchievement('space_potato')


    if (damageReport.deathRay >= Achievements.death_ray_damage.required) addAchievement('death_ray_damage');
    if (damageReport.drones >= Achievements.drone_damage.required) addAchievement('drone_damage');
    if (damageReport.lasers >= Achievements.laser_damage.required) addAchievement('laser_damage');

    if (aliensKilled >= 5) addAchievement('kill_5_aliens');
    if (aliensKilled >= 50) addAchievement('kill_50_aliens');
    if (aliensKilled >= 500) addAchievement('kill_500_aliens');


    localStorage.setItem('achievements', JSON.stringify(Achievements));
    populateAchievements();

    // Determine newly unlocked weapons based on the achievements unlocked
    const achievementToWeaponMap = {
        'reach_wave_2': 'Bomber Drone',
        'reach_wave_5': 'Freeze Effect',
        'laser_damage': 'Explosive Laser',
        'reach_wave_10': 'Sonic Blast',
        'reach_wave_20': 'Boomerang',
        'complete_normal_mode': 'Acid Bomb',
        'destroy_100_asteroids': 'Drone',
        'kill_5_aliens': 'Death Ray',
        'complete_planet_hard_mode': 'Explosive Rocket',
        'kill_50_aliens': 'Chain Lightning',
        'kill_500_aliens': 'SonicBoomerang',
        'no_lives_lost': 'Nano Swarm',
        'acid_bomb_damage': 'Flamethrower'
    };

    newlyUnlockedAchievements.forEach(achievement => {
        if (achievement in achievementToWeaponMap) {
            newlyUnlockedWeapons.push(achievementToWeaponMap[achievement]);
        }
    });
    console.log(newlyUnlockedAchievements);
    console.log(newlyUnlockedWeapons);

    return { newlyUnlockedAchievements, newlyUnlockedWeapons };
}

function createUpgradeOptionsHTML(upgrades) {
    return upgrades.map((upgrade, index) => `
        <div class="upgrade-option" onclick="selectUpgrade(${index + 1})">
            <div class="upgrade-number">${index + 1}</div>
            <div class="upgrade-icon ${upgrade.icon}"></div>
            <div class="upgrade-details">
                <p class="upgrade-name">${upgrade.name}</p>
                <p class="upgrade-description">${upgrade.description}</p>
            </div>
        </div>
    `).join('');
}

let unclaimedLevelUps = 0;
let waitAndClaimMode = true;

function claimLevelUps() {

    if (unclaimedLevelUps > 0) {

        let upgradesToRetrieve = fourthUpgradeUnlocked ? 4 : 3;

        // Get random upgrades
        const upgrades = getRandomUpgrades(upgradesToRetrieve);

        document.getElementById('leveluptitle').innerHTML = 'Claim ' + unclaimedLevelUps + ' upgrades';


        // Display the level-up modal
        const levelUpModal = document.getElementById('levelUpModal');
        const upgradeOptionsHTML = createUpgradeOptionsHTML(upgrades);
        document.getElementById('upgradeOptions').innerHTML = upgradeOptionsHTML;

        // Show the modal
        levelUpModal.style.display = 'block';
        // Store upgrades in a global variable for later use
        window.levelUpgrades = upgrades;
        // Pause the game
        pauseGame();

        // Activate temporary invincibility

    }
    invincible = true;
    invincibilityTimer = invincibilityDuration;
    resumeGame();


}

function toggleRedeemMode() {

    if (waitAndClaimMode)
        waitAndClaimMode = false;
    else
        waitAndClaimMode = true;

    let redeemText = "on"
    if (!waitAndClaimMode)
        redeemText = "off"
    document.getElementById('redeemModeStatus').innerHTML = redeemText;

}



function levelUp() {

    level++;
    unclaimedLevelUps++;
    let prevLevelUp = lastLevelUp;
    lastLevelUp = Date.now();
    console.log(lastLevelUp - prevLevelUp);
    xp = 0;  // Reset XP

    if (wave > 75) {
        bonuslevelUpXPMultiplier = 1.5;
    } else if (wave > 50) {
        bonuslevelUpXPMultiplier = 1.2;
    }

    xpToNextLevel = Math.floor(xpToNextLevel * levelUpXPMultiplier * bonuslevelUpXPMultiplier);
    updateXPBar();

    // Determine number of upgrades to show
    if (!waitAndClaimMode) {

        document.getElementById('leveluptitle').innerHTML = 'Level Up!';

        let upgradesToRetrieve = fourthUpgradeUnlocked ? 4 : 3;

        // Get random upgrades
        const upgrades = getRandomUpgrades(upgradesToRetrieve);

        // Display the level-up modal
        const levelUpModal = document.getElementById('levelUpModal');
        const upgradeOptionsHTML = createUpgradeOptionsHTML(upgrades);
        document.getElementById('upgradeOptions').innerHTML = upgradeOptionsHTML;

        // Show the modal
        levelUpModal.style.display = 'block';

        // Store upgrades in a global variable for later use
        window.levelUpgrades = upgrades;
        // Pause the game
        pauseGame();

        // Activate temporary invincibility
        invincible = true;
        invincibilityTimer = invincibilityDuration;

    }

    // Play level up sound (if you have one)
    // playSound('levelUpSound');

    // Update UI to reflect new level
    // updateLevelDisplay();

    // Reset flag for upgrade application
    mostRecentUpgradeApplied = false;
}


function drawCooldownIndicator(x, y, radius, cooldown, maxCooldown) {
    if (cooldown <= 0) return;

    const startAngle = -Math.PI / 2; // Start at the top
    const endAngle = startAngle + (2 * Math.PI * (1 - cooldown / maxCooldown));

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.stroke();
    ctx.restore();
}



function getUpgradeCount(weaponClass) {
    switch (weaponClass) {
        case 'explosive':
            return ship.explosiveLaserLevel;
        case 'turret':
            return turretUpgrades.range + turretUpgrades.fireRate + turretUpgrades.damage - 2;
        case 'drone':
            return droneUpgrades.laserInterval + droneUpgrades.damageLevel; // Assuming this is the main upgrade for drones
        case 'sonic':
            return sonicBlast.rangeLevel + sonicBlast.damageLevel + sonicBlast.cooldownLevel - 2; // Example calculation
        case 'bomberdrone':
            return bomberDroneUpgrades.speed + bomberDroneUpgrades.bombRadiusLevel + bomberDroneUpgrades.bombDamage - 3;
        case 'deathray':
            return deathRayUpgrades.length + deathRayUpgrades.width + deathRayUpgrades.cooldown - 2;
        case 'acid':
            return acidBombUpgrades.duration + acidBombUpgrades.cooldown + acidBombUpgrades.size - 2;
        case 'freeze':
            return freezeEffectUpgrades.duration + freezeEffectUpgrades.cooldown - 1;
        case 'boomerang':
            return boomerangUpgrades.speed + boomerangUpgrades.damage - 1;
        case 'nanoswarm':
            return nanoswarmUpgrades.speed + nanoswarmUpgrades.damage + nanoswarmUpgrades.cooldown - 2;
        case 'flamethrower':
            return flamethrowerUpgrades.range + flamethrowerUpgrades.damage + flamethrowerUpgrades.cooldown - 2;
        case 'chainlightning':
            return chainLightningUpgrades.range + chainLightningUpgrades.damage + chainLightningUpgrades.bounces + chainLightningUpgrades.cooldown - 3;
        case 'explosiverocket':
            return explosiveRocketUpgrades.damage + explosiveRocketUpgrades.radius + explosiveRocketUpgrades.cooldown - 2;

        default:
            return 0;
    }
}


function saveTimeTaken(timeTaken) {
    localStorage.setItem('timeTaken', timeTaken);
}

function getTimeTaken() {
    return localStorage.getItem('timeTaken');
}

let timeTaken = 0;


function endGame() {
    // Stop the game loop and background music

    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('userInfo').style.display = 'block';

    clearInterval(gameLoop);
    backgroundMusic.pause(); // Stop the background music
    gameEndTime = new Date();
    resetShip();

    // Calculate the time taken and save it
    timeTaken = gameEndTime - gameStartTime; // Time in milliseconds
    saveTimeTaken(timeTaken); // Save the time taken to local storage

    console.log("this run: " + timeTaken);
    score = Math.floor(score * modeScoreMultiplier); // Ensure score is a whole number

    // quick fix for unkown negative nubmer problem 
    score = Math.abs(score);

    // Calculate top six weapons by damage
    const topSixWeapons = Object.entries(damageReport)
        .filter(([weapon, damage]) => damage > 0) // Only include weapons with damage
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([weapon, damage]) => ({ weapon, damage }));

    const gameData = {
        score: score,
        topWeapons: topSixWeapons
    };

    saveUserScore(userId, gameId, gameData);

    // Load and display the leaderboard
    loadLeaderboard(gameId, currentMode);

    // Update achievements and handle end game server logic
    const { newlyUnlockedAchievements, newlyUnlockedWeapons } = updateAchievementsAtEnd();

    // Get three random affordable upgrades
    // const affordableUpgrades = getRandomAffordableUpgrades(coins);

    // Display the end game screen
    displayEndGameScreen(topSixWeapons, newlyUnlockedAchievements, newlyUnlockedWeapons);
}
function displayEndGameScreen(topWeapons, newlyUnlockedAchievements, newlyUnlockedWeapons, affordableUpgrades) {
    const endScreen = document.getElementById('endScreen');
    const waveElement = document.getElementById('wave');
    const scoreElement = document.getElementById('score');
    const asteroidsDestroyedElement = document.getElementById('asteroidsDestroyed');
    const currentCoinsElement = document.getElementById('currentCoins');
    const damageReportList = document.getElementById('damageReportList');
    const unlockedWeaponsList = document.getElementById('unlockedWeaponsList');
    const newAchievementsList = document.getElementById('newAchievementsList');
    const achievementSound = unlockSound;
    // document.getElementById('achievementSound');

    // Set game stats
    if (currentMode === GameModes.ENDLESS_SLOW) {
        waveElement.textContent = `Waves Survived: ${wave}`;
    } else {
        waveElement.textContent = `Wave: ${wave}`;
    }

    if (currentMode === GameModes.COOP) {
        const totalScore = ship.score + ship2.score;
        score = totalScore; // Set the total score for saving to leaderboard
        scoreElement.textContent = `Total Score: ${totalScore} (P1: ${ship.score}, P2: ${ship2.score})`;
    } else {
        scoreElement.textContent = `Score: ${score}`;
    }

    asteroidsDestroyedElement.textContent = `Asteroids Destroyed: ${asteroidsKilled}`;

    // Clear and set damage report
    damageReportList.innerHTML = '';
    const weaponDPM = calculateWeaponDPM();
    topWeapons.forEach(({ weapon, damage }) => {
        const weaponName = damageReportMapping[weapon];
        const weaponInfo = weapons.find(w => w.name === weaponName);
        if (weaponInfo) {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';

            const icon = document.createElement('div');
            icon.classList.add('weaponClassIcon', weaponInfo.icon);
            icon.style.width = '24px';
            icon.style.height = '24px';
            icon.style.marginRight = '10px';

            const text = document.createElement('span');
            text.textContent = `${weaponInfo.name}: ${damage} (DPM: ${weaponDPM[weapon]})`;

            li.appendChild(icon);
            li.appendChild(text);
            damageReportList.appendChild(li);
        }
    });

    // Clear and set recently unlocked weapons
    unlockedWeaponsList.innerHTML = '';
    newlyUnlockedWeapons.forEach(weaponName => {
        const weaponInfo = weapons.find(w => w.name === weaponName);
        if (weaponInfo) {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';

            const icon = document.createElement('div');
            icon.classList.add('weaponClassIcon', weaponInfo.icon);
            icon.style.width = '24px';
            icon.style.height = '24px';
            icon.style.marginRight = '10px';

            const text = document.createElement('span');
            text.textContent = weaponInfo.name;

            li.appendChild(icon);
            li.appendChild(text);
            unlockedWeaponsList.appendChild(li);
        }
    });

    // Clear and set achievements
    newAchievementsList.innerHTML = '';
    function displayAchievementsSequentially(index) {
        if (index >= newlyUnlockedAchievements.length) return;

        const achievement = newlyUnlockedAchievements[index];
        const li = document.createElement('li');
        li.textContent = achievement;
        li.classList.add('flash'); // Add the flashing animation class
        newAchievementsList.appendChild(li);
        if (!toggleSoundOff)
            achievementSound.play();

        // Remove the flash class after the animation duration (1 second)
        setTimeout(() => {
            li.classList.remove('flash');
            displayAchievementsSequentially(index + 1); // Display the next achievement
        }, 1000); // Adjust the duration as needed
    }

    displayAchievementsSequentially(0); // Start displaying achievements from the first one

    // Show the end screen
    endScreen.style.display = 'flex';
    levelUpModal.style.display = 'none';
}


function saveUserUpgrades(userId, gameId, data) {
    // Example function to save user upgrades and coins to the server
    fetch(`/api/saveUserUpgrades?userId=${userId}&gameId=${gameId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log('User upgrades saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving user upgrades:', error);
        });
}


function saveUserUpgrades(userId, gameId, data) {
    // Example function to save user upgrades and coins to the server
    fetch(`/ api / saveUserUpgrades ? userId = ${userId}& gameId=${gameId} `, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log('User upgrades saved successfully:', data);
        })
        .catch(error => {
            console.error('Error saving user upgrades:', error);
        });
}


function calculateWeaponDPM() {
    const weaponDPM = {};
    const endTime = Date.now();
    damageReportStartTimes.lasers = gameStartTime;

    Object.keys(damageReport).forEach(weapon => {
        const activeTime = (endTime - damageReportStartTimes[weapon]) / 60000; // Time in minutes
        weaponDPM[weapon] = activeTime > 0 ? (damageReport[weapon] / activeTime).toFixed(2) : 0;
    });

    return weaponDPM;
}

function drawDamageReport() {
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Damage Report: `, 20, canvas.height - 340);

    const weaponDPM = {};
    const endTime = Date.now();

    damageReportStartTimes.lasers = gameStartTime;
    damageReportStartTimes.fireAsteroid = gameStartTime;
    damageReportStartTimes.lightningAsteroid = gameStartTime;
    damageReportStartTimes.acidAsteroid = gameStartTime;

    Object.keys(damageReport).forEach(weapon => {
        const activeTime = (endTime - damageReportStartTimes[weapon]) / 60000; // Time in minutes
        weaponDPM[weapon] = activeTime > 0 ? (damageReport[weapon] / activeTime).toFixed(2) : 0;
    });

    let yOffset = canvas.height - 320;
    Object.keys(damageReport).forEach(weapon => {
        if (damageReport[weapon] > 0) {
            yOffset += 20;
            ctx.fillText(`${weapon.charAt(0).toUpperCase() + weapon.slice(1)}: ${damageReport[weapon]} (DPM: ${weaponDPM[weapon]})`, 20, yOffset);
        }
    });
}





