

// for leaderboard and telegram API 
let gameId = "InfiniteAsteroids";
let version = "1.009"
let crazyGamesMode = false;
let crazyGamesDebugMode = false;
let normalDebugMode = false;
let cgUser = null;

let testMode = false;

let activeMegaUpgrades = [];
let lastActivatedWave = 0;
let overClockingAllowed = false;

let totalDamage = 0;
let totalAsteroidsKilled = 0;
let totalAliensKilled = 0;
let aliens = [];

const joystick = document.getElementById('joystick');
const joystickInner = document.getElementById('joystick-inner');
const joystickHandle = document.getElementById('joystickHandle');
const restartButton = document.getElementById('restartButton');
const mainMenuButton = document.getElementById('mainMenuButton');

let isTouchingJoystick = false;
let joystickStartX, joystickStartY;
let isMusicPlaying = true; // Flag to track music state
let unclaimedLevelUps = 0;
let waitAndClaimMode = false;

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
let pixieBoost = 1;

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
    maxBulletsLevel: 70,
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


let activeWeaponClasses = ['basiclaser']; // Array to store active weapon classes
let particles = []; // Array to store thruster particles

let level = 1;
let xp = 0;
// let xpToNextLevel = 300;

let levelUpXPMultiplier = 1.2;
let meteorMode = false;
let planetMode = false;
let invincibilityDuration = 160; // 3.5 seconds (60 FPS)
let achievements = [];

const Achievements = {
    reach_wave_2: { reached: false, icon: 'achievements/whitehat.png', description: 'Reach Wave 2. Unlock Turret and Bomber Drone.' },
    reach_wave_5: { reached: false, icon: 'achievements/cyberpunk.png', description: 'Reach Wave 5. Unlock Freeze and Cluster Bomb.' },
    // reach_wave_57: { reached: false, icon: 'achievements/whitehat.png', description: 'Reach Wave 7' },
    reach_wave_10: { reached: false, icon: 'achievements/angelcapitan.png', description: 'Reach Wave 10. Unlock Sonic Blast.' },
    // reach_wave_15: { reached: false, icon: 'achievements/insanecat.png', description: 'Reach Wave 15' },
    // reach_wave_20: { reached: false, icon: 'achievements/keroaccat.png', description: 'Reach Wave 20. ' },
    // reach_wave_25: { reached: false, icon: 'achievements/onthemoon.png', description: 'Reach Wave 25' },
    destroy_100_asteroids: { reached: false, icon: 'achievements/speedy.png', description: 'Destroy 100 Asteroids in One Game. Unlock Drone.' },
    destroy_1000_asteroids: { reached: false, icon: 'achievements/speedy.png', description: 'Destroy 1000 Asteroids in One Game. Unlock Damage Booster.' },

    // destroy_500_asteroids: { reached: false, icon: 'achievements/_5973.png', description: 'Destroy 500 Asteroids in One Game' },
    complete_easy_mode: { reached: false, icon: 'achievements/onthemoon.png', description: 'Reach Wave 30 Deep Space Easy. Unlock Boomerang.' },
    complete_normal_mode: { reached: false, icon: 'achievements/insanecat.png', description: 'Reach Wave 30 Deep Space Normal. Unlock Acid Bomb.' },
    acid_bomb_damage: { reached: false, damage: 0, required: 2500, icon: 'achievements/acid.png', description: 'Deal 2,500 Damage with Acid Bomb. Unlock Flamethrower.' },
    laser_damage: { reached: false, damage: 0, required: 2500, icon: 'achievements/deathray2.png', description: 'Deal 2,500 Damage with Laser. Unlock Explosive Laser.' },
    drone_damage: { reached: false, damage: 0, required: 1500, icon: 'achievements/storm_drone.png', description: 'Deal 1,500 Damage with Drone. Unlock Drone Army.' },
    explosive_laser_damage: { reached: false, damage: 0, required: 5000, icon: 'achievements/explosive.png', description: 'Deal 5,000 Damage with Explosive Laser. Unlock Void Warden.' },
    death_ray_damage: { reached: false, damage: 0, required: 10000, icon: 'achievements/deathray.png', description: 'Deal 10,000 Damage with Death Ray. Unlock Extra Choice.' },
    no_lives_lost: { reached: false, icon: 'achievements/orpheus.png', description: 'Wave 50 with No Lives Lost. Unlock Nano Swarm.' },
    complete_hard_mode: { reached: false, icon: 'achievements/explosion.png', description: 'Deep Space Hard Wave 30. Unlock Explosive Rocket.' },
    complete_hero_mode: { reached: false, icon: 'achievements/cyberpunk.png', description: 'Deep Space Hero Wave 30. Unlock Extra Life.' },
    kill_5_aliens: { reached: false, icon: 'achievements/aliensign.png', description: 'Kill 5 Aliens. Unlock Death Ray.' },
    kill_50_aliens: { reached: false, icon: 'achievements/aliensign.png', description: 'Kill 50 Aliens. Unlock Chain Lightning.' },
    kill_500_aliens: { reached: false, icon: 'achievements/aliensign.png', description: 'Kill 500 Aliens. Unlock Sonic Boom.' },
    complete_meteor_easy_mode: { reached: false, icon: 'achievements/meteor_one.png', description: 'Meteor Shower Easy Mode. Unlock Starhawk.' },
    complete_meteor_normal_mode: { reached: false, icon: 'achievements/meteor_acid.png', description: 'Meteor Shower Normal Wave 30. Unlock Wave Turret.' },
    complete_meteor_hard_mode: { reached: false, icon: 'achievements/meteor_small.png', description: 'Meteor Shower Hard Wave 30. Unlock Solar Phoenix.' },
    complete_meteor_hero_mode: { reached: false, icon: 'achievements/death_meteor.png', description: 'Meteor Shower Hero Wave 30. Unlock Quantum Striker.' },
    complete_planet_easy_mode: { reached: false, icon: 'achievements/planet_medium.png', description: 'Planet Easy Mode Wave 30. Unlock Elo Bomb.' },
    complete_planet_normal_mode: { reached: false, icon: 'achievements/storm_medium.png', description: 'Planet Normal Mode Wave 30. Unlock Triple Turret.' },
    complete_planet_hard_mode: { reached: false, icon: 'achievements/onthemoon.png', description: 'Planet Hard Mode Wave 30. Unlock Glitch Effect.' },
    complete_planet_hero_mode: { reached: false, icon: 'achievements/planet_huge.png', description: 'Planet Hero Mode Wave 30. Unlock Asteroid Splitter.' },
    alien_megaboss_killed: { reached: false, icon: 'icons/aliens/cool_evil_alien_22.png', description: 'Killed Wave 50 Alien Boss. Chain of Flame.' },
    alien_supermegaboss_killed: { reached: false, icon: 'icons/aliens/alien_boss_ship_14.png', description: 'Killed Wave 75 Alien MegaBoss. Explo Drone.' },
    alien_octopus_killed: { reached: false, icon: 'icons/aliens/alien_boss_ship_5.png', description: 'Killed Wave 100 Vampire Alien Octopus. CryoBomb.' },
    million_score: { reached: false, icon: 'achievements/cyberpunk.png', description: 'Get a million points. Invincibility Shield.' },
    wave_60_endless: { reached: false, icon: 'achievements/insanecat.png', description: 'Reach wave 60 on Endless. Piercing Laser.' },
    wave_120_endless: { reached: false, icon: 'achievements/insanecat.png', description: 'Reach wave 120 on Endless. Pentacule.' },
    space_pizza: { reached: false, icon: 'icons/upgrades/pizza.png', description: 'Find the space pizza.' },
    space_pickle: { reached: false, icon: 'icons/upgrades/pickle.png', description: 'Find the deep space pickle.' },
    pink_pixie: { reached: false, icon: 'icons/upgrades/pixie.png', description: 'Find the pink pixie.' },
    purple_pixie: { reached: false, icon: 'achievements/keroaccat.png', description: 'Find the purple pixie.' },
    gold_pixie: { reached: false, icon: 'icons/upgrades/pixie2.png', description: 'Find the gold pixie.' },
    // space_monkey: { reached: false, icon: 'icons/upgrades/monkey.png', description: 'Find the space monkey.' },
    // space_potato: { reached: false, icon: 'icons/upgrades/potato.png', description: 'Find the space potato.' },
    // all_normals: { reached: false, icon: 'achievements/insanecat.png', description: 'All normal modes wave 30. Unlock remixes in settings.' },
    all_hards: { reached: false, icon: 'achievements/insanecat.png', description: 'All hard modes wave 30. Unlock Tetragrammaton.' },
    all_modes: { reached: false, icon: 'achievements/planet_huge.png', description: 'All game modes wave 30. Unlock Hexarose.' },
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

// let meteorBooster = 0;
// let modeScoreMultiplier = 1;
let megaExplosions = [];




let droneArmy = false;



// KEY CONFIG VARs
let coins = 10000;


let score = 0;
let asteroids = [];
let gameLoop;
let explosions = [];
let lives = 3;

if (testMode)
    lives = 1;
let gameOver = true;
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

let lastCurrentShip = 'basic';


// Game loop
function startGame() {
    // updateMiniShipPreview();
    // userId = testCrazyGamesUserFlow();
    // console.log("user Id");
    // console.log(userId);
    lastCurrentShip = currentShip;
    gameOver = false;
    gameStartTime = Date.now();
    initializeLastDamageReport();
    // console.log(crazyGamesMode);
    // console.log(window.CrazyGames);

    if (crazyGamesMode && window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.game) {
        try {
            window.CrazyGames.SDK.game.gameplayStart();

        } catch (error) {
            console.log(error);
        }
    }

    if (isMobile()) {

        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) mobileControls.style.display = 'block';
    }

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
    invincibilityTimer += invincibilityDuration;
    // clearInterval(gameLoop);
    // if (mode == GameModes.ENDLESS_SLOW)
    //   spawnCooldown = 6;

    // const selectedUpgrades = getSelectedUpgrades(); // Implement this function to retrieve the selected upgrades

    // // Load the selected upgrades and their corresponding functions
    // selectedUpgrades.forEach(upgrade => {
    //   addUpgrade(upgrade);
    // });
    // console.log(currentShip);

    ship.laserLevel = ships[currentShip].laserLevel;
    // Specific actions for StarHawk
    if (currentShip === 'quantumStriker') {
        ship.laserCooldown = 40; // double length for shotgun style ship

    }
    if (currentShip === 'solarPhoenix') {
        ship.laserCooldown = 50; // double length for shotgun style ship

    }
    if (currentShip === 'tetragrammatonShip') {
        ship.laserCooldown = 60; // double length for shotgun style ship

    }
    if (currentShip === 'Pentacule') {
        ship.laserCooldown = 65; // double length for shotgun style ship

    }
    if (currentShip === 'hexShip') {
        ship.laserCooldown = 70; // double length for shotgun style ship

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

    resumeGame();

    if (!toggleMusicOff)
        backgroundMusic.play(); // Play the background music
    isMusicPlaying = true;
}

// TEMP:(?) disable resize. Re-enable for crazy games.

let widthRatio = 1;
let heightRatio = 1;

function resizeCanvas() {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // TODO: not sure why we had this year
    // resetShip();
    if (window.innerWidth > 1200)
        fullScreenMode = true;
    else
        fullScreenMode = false;

    widthRatio = canvas.width / oldWidth;
    heightRatio = canvas.height / oldHeight;

    // Update ship position
    if (ship) {
        ship.x *= widthRatio;
        ship.y *= heightRatio;

        // Update ship's lasers
        ship.lasers.forEach(laser => {
            laser.x *= widthRatio;
            laser.y *= heightRatio;
        });
    }

    // Update aliens positions
    aliens.forEach(alien => {
        alien.x *= widthRatio;
        alien.y *= heightRatio;
    });

    // Update asteroids positions
    asteroids.forEach(asteroid => {
        asteroid.x *= widthRatio;
        asteroid.y *= heightRatio;
    });

    droppedGems.forEach(asteroid => {
        asteroid.x *= widthRatio;
        asteroid.y *= heightRatio;
    });

    // Update alien lasers
    alienLasers.forEach(laser => {
        laser.x *= widthRatio;
        laser.y *= heightRatio;
    });

    // Update explosions
    explosions.forEach(explosion => {
        explosion.x *= widthRatio;
        explosion.y *= heightRatio;
        // If explosion size is stored, you might want to scale it too
        if (explosion.size) {
            explosion.size *= (widthRatio + heightRatio) / 2;
        }
    });

    // Optionally, adjust speeds if they're dependent on canvas size
    // const speedRatio = (widthRatio + heightRatio) / 2;
    // adjustGameSpeeds(speedRatio);

}



window.addEventListener('resize', resizeCanvas);


function toggleMusic() {
    if (!toggleMusicOff)
        toggleMusicOff = true;

    pauseAllMusic();

    if (isMusicPlaying) {
        pauseAllMusic();
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

let toggleBackgroundOff = false;

function toggleBackground() {
    if (!toggleBackgroundOff)
        toggleBackgroundOff = true;
    else
        toggleBackgroundOff = false;

}




function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);

}

let randomSeed = Math.random();

function update() {

    randomSeed = Math.random();

    calculateAndAdjustFPS(); //optimize.js

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // for now mobile fps is too low.
    if (!toggleBackgroundOff && !isMobile()) {

        if (currentMode == GameModes.EASY || currentMode == GameModes.NORMAL || currentMode == GameModes.HARD || currentMode == GameModes.HERO)
            drawSubtleGridBackground(ctx, canvas.width, canvas.height);
        else if (currentMode == GameModes.METEORSHOWEREASY || currentMode == GameModes.METEORSHOWERNORMAL || currentMode == GameModes.METEORSHOWERHARD || currentMode == GameModes.METEORSHOWERHERO)
            drawZigzagGridBackground(ctx, canvas.width, canvas.height);
        else if (currentMode == GameModes.PLANETEASY || currentMode == GameModes.PLANETNORMAL || currentMode == GameModes.PLANETHARD || currentMode == GameModes.PLANETHERO)
            drawGravityWellBackground(ctx, canvas.width, canvas.height);
        else if (currentMode == GameModes.ENDLESS_SLOW)
            drawWarpedBackground(ctx, canvas.width, canvas.height);
    }

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

    updateSecondaryWeapons();

    updateDrones();
    drawDrones();

    updateAsteroids();
    drawAsteroids();

    if (tutorialActive) {
        updateTutorial();
        // highlightTutorialAsteroid();
    } else {

    }

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
    updateBossFire();


    spawnTimer -= 1 / 60; // Assuming 60 FPS

    if (spawnTimer <= 0) {
        wave++;

        spawnTimer = spawnCooldown;

        if (wave == 10 && currentMode == GameModes.EASY)
            updateAchievementsAtEnd();

        if (meteorMode) {

            const side = Math.random() < 0.5 ? 'left' : 'right';
            showArrow(side);

        } else
            createAsteroids();

        spawnAliens(wave); // Spawn aliens based on the current wave
        checkForUpgradeSpawn();
        recordWeaponDamageForWave(); // Record the weapon damage for this wave



    }



    // if (wave == 30) updateAchievementsAtEnd();

    // Update and draw particles
    updateParticles();
    drawParticles();
    // drawEdgeOverlay();
    drawLives();
    drawScore();


    // if (gameOver) drawDamageReport();
    updateAndDrawFloatingUpgrades();
    //BUG : something annoyingly unpausing after paused on epic collect
    checkGemCollection();

    drawShip();

    if (gameOver) endGame();



}

function processPlayerDeath() {
    resetShip(false);

    xp = 0;
    updateXPBar();

    if (!invincible) {
        lives--;

        // Trigger the explosion immediately
        createExplosion(ship.x, ship.y, 10, 15);

        // Delay the area damage after the explosion (e.g., 1 second delay = 1000 milliseconds)
        setTimeout(() => {
            createAreaDamage(ship.x, ship.y, 170, 10);
        }, 200); // 1000 milliseconds = 1 second delay
    }

    playShipDestroyedSound();
    invincible = true;
    invincibilityTimer += invincibilityDuration;

    if (lives == 0) gameOver = true;
}

function initializeGame(mode, replay = false) {
    handleSelections();
    multiplierCalculator(mode);

    if (!Achievements.reach_wave_2.reached)
        initializeTutorial();

    if (replay)
        currentShip = lastCurrentShip;
    // console.log(currentShip);
    currentMode = mode;

    console.log("starting " + currentMode);

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
        // if (ship.lasers.length < (ship.maxBulletsLevel * 3) && ship.laserTimer === 0) {
        //     shootLasers();
        // }
        fireSecondaryWeapon();
        secondaryWeaponUsedOnMobile = true;
    }
}
let secondaryWeaponUsedOnMobile = false;

let activeRotationRight = 0;
let activeRotationLeft = 0;

function updateShip(ship, leftKey, rightKey, upKey, downKey, shootKey) {
    let angle = ship.rotation * Math.PI / 180;

    if (keys[shootKey] && ship.laserTimer === 0) {
        shootLasers(ship);
    }

    if (keys[leftKey]) {
        ship.rotation -= ship.rotationSpeed;
        activeRotationLeft = ship.rotationSpeed;
    } else {
        activeRotationLeft = 0;
    }
    if (keys[rightKey]) {
        ship.rotation += ship.rotationSpeed;
        activeRotationRight = ship.rotationSpeed;
    } else {
        activeRotationRight = 0;
    }

    if (keys[upKey] || (ship === ship && touchAccelerating)) {

        if (!toggleMusicOff && !bossMusicEnabled) backgroundMusic.play();
        playRandomThrusterSound();

        let accelerationAmount = ship.acceleration;

        if (ship === ship && touchAccelerating)
            accelerationAmount *= 2;
        ship.velocityX += accelerationAmount * Math.sin(angle);

        ship.velocityY -= accelerationAmount * Math.cos(angle);
        if (!isMobile())
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
            // if (!toggleMusicOff) backgroundMusic.play();
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

    // if (keys[shootKey] && ship.lasers.length < (ship.maxBulletsLevel * 3) && ship.laserTimer === 0) {


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
    if (particles.length >= MAXPARTICLES) {
        return;
    } else
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

    // Damage asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];
        let dx = asteroid.x - x;
        let dy = asteroid.y - y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < radius) {
            let actualDamage = Math.min(damage + damageBooster * pixieBoost, asteroid.hitpoints);
            asteroid.hitpoints -= actualDamage;
            totalDamage += actualDamage;

            if (asteroid.hitpoints <= 0) {
                processAsteroidDeath(asteroid, true);
                asteroids.splice(i, 1);
            }

            coins += actualDamage * 15;
            increaseXP(actualDamage * 15);
            score += actualDamage * 50;
        }
    }

    // Damage aliens
    for (let i = aliens.length - 1; i >= 0; i--) {
        let alien = aliens[i];
        let dx = alien.x - x;
        let dy = alien.y - y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < radius) {
            let actualDamage = Math.min(damage + damageBooster * pixieBoost, alien.hitpoints);

            if (alien === octoBoss) {
                // Handle OctoBoss damage separately
                damageOctoBoss(actualDamage, x, y);
            } else {
                alien.hitpoints -= actualDamage;
                totalDamage += actualDamage;

                if (alien.hitpoints <= 0) {
                    // Handle alien death
                    createExplosion(alien.x, alien.y);
                    aliens.splice(i, 1);
                    aliensKilled++;
                }
            }

            coins += actualDamage * 20;
            increaseXP(actualDamage * 20);
            score += actualDamage * 75;
        }
    }

    return totalDamage;
}
function increaseXP(amount, isGem = false) {
    const currTimeInMS = Date.now();

    // Apply tapering based on wave number
    const taperingFactor = xpTaperingFactor();
    amount *= taperingFactor;

    if (xp >= (xpToNextLevel / 1)) {
        if (lastLevelUp + 2000 > currTimeInMS) {
            amount *= 0.05;
        } else if (lastLevelUp + 5000 > currTimeInMS) {
            amount *= 0.2;
        } else if (lastLevelUp + 8000 > currTimeInMS) {
            amount *= 0.3;
        }
    }

    xp += amount;
    document.getElementById('xpBarContainer').style.display = 'block';

    updateXPBar();

    if (xp >= xpToNextLevel && (currTimeInMS > (lastLevelUp + 8000) || isGem)) {
        const upgradeModal = document.getElementById('upgradeModal');
        // only display levelup if upgrade modal is not open
        if (!upgradeModal || upgradeModal.style.display == "block") {
            levelUp();

        }

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
        // console.log(distance < (obj1.size || 1) + obj2.size);
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
            document.getElementById('controlsInfo').textContent = "s[e]condary se[t]tings [p]ause [i]nfo";

    } else {
        document.getElementById('controlsInfo').textContent = '';
    }
}

function pauseGame() {
    // console.log("p");
    if (!isPaused) {

        // const modals = document.querySelectorAll('.modal');
        // const openModals = Array.from(modals).filter(modal => {
        //     return window.getComputedStyle(modal).display !== 'none';
        // });

        // const openModals = document.querySelectorAll('.modal:not([style*="display: none"])');    
        // if (openModals.length > 0 && !gameOver) {
        //     const container = document.getElementById('activeWeaponClassesContainer');
        //     container.style.display = "none";
        // }
        // console.log("p2");
        clearInterval(gameLoop);
        isPaused = true;
        // removed at CG request
        // if (crazyGamesMode && window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.game) {
        //     try {
        //         window.CrazyGames.SDK.game.gameplayStop();

        //     } catch (error) {
        //         console.log(error);
        //     }

        // }


    }
}

function resumeGame() {

    const modals = document.querySelectorAll('.modal');
    const openModals = Array.from(modals).filter(modal => {
        return window.getComputedStyle(modal).display !== 'none';
    });

    // const openModals = document.querySelectorAll('.modal:not([style*="display: none"])');
    console.log(openModals.length);

    if (openModals.length === 0 && !gameOver) {
        const container = document.getElementById('activeWeaponClassesContainer');
        container.style.display = "block";

        clearInterval(gameLoop);
        gameLoop = setInterval(update, 1000 / 60);
        isPaused = false;
        // Removed at CG request
        // if (crazyGamesMode && window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.game) {
        //     try {
        //         window.CrazyGames.SDK.game.gameplayStart();

        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
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

window.addEventListener("wheel", (event) => event.preventDefault(), {
    passive: false,
});


function handleKeyDown(event) {
    keys[event.key] = true;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
        event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault();
    }

    const visibleModal = document.querySelector('.modal:not([style*="display: none"])');
    const endScreen = document.getElementById('endScreen');
    const isEndScreenVisible = endScreen && endScreen.style.display !== 'none';


    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        let targetElement = visibleModal || (isEndScreenVisible ? endScreen : null);

        if (targetElement) {
            event.preventDefault();
            const focusableElements = Array.from(targetElement.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (!targetElement.contains(document.activeElement) ||
                (event.key === 'ArrowDown' && document.activeElement === lastElement) ||
                (event.key === 'ArrowUp' && document.activeElement === firstElement)) {
                event.key === 'ArrowDown' ? firstElement.focus() : lastElement.focus();
            } else {
                const currentIndex = focusableElements.indexOf(document.activeElement);
                const nextIndex = event.key === 'ArrowDown' ?
                    (currentIndex + 1) % focusableElements.length :
                    (currentIndex - 1 + focusableElements.length) % focusableElements.length;
                focusableElements[nextIndex].focus();
            }
        }
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
            if (!loginFormOpen) toggleSettings();
        } else if (event.key === 'e' || event.key === 'E') {
            fireSecondaryWeapon(); // Use the selected secondary weapon
        } else if ((event.key === 'r' || event.key === 'R')) {
            if (!gameOver)
                claimLevelUps(); // Claim level ups
        } else if ((event.key === 'o' || event.key === 'O') && normalDebugMode) {


            const pastScoresModal = document.getElementById('pastScoresModal');
            pastScoresModal.style.display = 'block';


        } else if (event.key === 'u' || event.key === 'U') {

            toggleDamageByWeaponWaveChart();

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
        const upgradeModal = document.getElementById('upgradeModal');
        if (upgradeModal) {
            if (upgradeModal.querySelector('.mega-upgrade-option')) {
                // If mega upgrade options are displayed
                if (event.key >= '1' && event.key <= '3') {
                    event.preventDefault();
                    const index = parseInt(event.key) - 1;
                    const megaUpgradeOptions = upgradeModal.querySelectorAll('.mega-upgrade-option');
                    if (megaUpgradeOptions[index]) {
                        megaUpgradeOptions[index].click();
                        closeUpgradeOptions();
                    }
                }
            } else {
                // Initial upgrade choice
                if (event.key === '1') {
                    event.preventDefault();
                    selectMegaUpgrade();
                } else if (event.key === '2') {
                    event.preventDefault();
                    restoreHealth();
                    closeUpgradeOptions();
                }
            }
        }
    }
}

function handleKeyUp(event) {
    keys[event.key] = false;
}


// function countTechnologies() {
//     let count = 2; // laser + bomb

//     // These are all the achievements that have a specific weapon unlock assigned
//     if (Achievements.reach_wave_2.reached) count += 2; //turret and bomber drone
//     if (Achievements.reach_wave_5.reached) count += 2;  //freeze and cluster bomb
//     if (Achievements.reach_wave_10.reached) count++;
//     if (Achievements.complete_easy_mode.reached) count++;
//     if (Achievements.complete_normal_mode.reached) count++;
//     if (Achievements.complete_hard_mode.reached) count++;
//     if (Achievements.complete_hero_mode.reached) count++;
//     if (Achievements.acid_bomb_damage.reached) count++;
//     if (Achievements.destroy_100_asteroids.reached) count++;
//     if (Achievements.destroy_1000_asteroids.reached) count++;

//     if (Achievements.kill_5_aliens.reached) count++;
//     if (Achievements.kill_50_aliens.reached) count++;
//     if (Achievements.kill_500_aliens.reached) count++;
//     if (Achievements.no_lives_lost.reached) count++;
//     if (Achievements.death_ray_damage.reached) count++;
//     if (Achievements.complete_meteor_normal_mode.reached) count++;
//     if (Achievements.complete_meteor_hard_mode.reached) count++;
//     if (Achievements.complete_meteor_hero_mode.reached) count++;


//     if (Achievements.complete_planet_easy_mode.reached) count++;
//     if (Achievements.complete_planet_normal_mode.reached) count++;
//     if (Achievements.complete_planet_hard_mode.reached) count++;
//     if (Achievements.complete_planet_hero_mode.reached) count++;
//     if (Achievements.complete_planet_hard_mode.reached && Achievements.complete_meteor_hard_mode.reached && Achievements.complete_hard_mode.reached) count++;

//     if (Achievements.drone_damage.reached) count++;
//     if (Achievements.laser_damage.reached) count++;
//     if (Achievements.wave_60_endless.reached) count++;

//     if (Achievements.wave_120_endless.reached) count++;
//     if (Achievements.million_score.reached) count++;
//     if (Achievements.all_modes.reached) count++;

//     // if (Achievements.space_potato.reached) count++;
//     if (Achievements.space_pizza.reached) count++;

//     // if (Achievements.space_monkey.reached) count++;
//     if (Achievements.pink_pixie.reached) count++;
//     if (Achievements.purple_pixie.reached) count++;
//     if (Achievements.gold_pixie.reached) count++;

//     if (Achievements.space_pickle.reached) count++;
//     if (Achievements.dark_side.reached) count++;

//     if (Achievements.alien_supermegaboss_killed.reached) count++;
//     if (Achievements.alien_octopus_killed.reached) count++;
//     if (Achievements.alien_megaboss_killed.reached) count++;

//     // 8 ship types to be unlocked  (including basic).

//     // Check the conditions of each ship
//     for (const ship in ships) {
//         if (ships.hasOwnProperty(ship)) {
//             if (ships[ship].condition()) count++;
//         }
//     }
//     // think we are at 41
//     return count;
// }

function countTechnologies() {
    // Start with 2 for laser and bomb
    let count = 3;

    if (Achievements.reach_wave_2.reached) count++; //turret and bomber drone
    if (Achievements.reach_wave_5.reached) count++;  //freeze and cluster bomb

    // Count reached achievements
    for (const achievement in Achievements) {
        if (Achievements[achievement].reached) {
            count++;
        }
    }

    // Count unlocked ships (assuming ships is defined elsewhere)
    // for (const ship in ships) {
    //     if (ships.hasOwnProperty(ship) && ships[ship].condition()) {
    //         count++;
    //     }
    // }

    return count;
}


function getAvailableWeaponIcons() {
    const upgradeDefinitions = {
        'Activate Turret': { icon: 'icon-turret' },
        'Activate Bomber Drone': { icon: 'icon-bomberdrone' },
        'Activate Freeze Effect': { icon: 'icon-freeze' },
        'Activate Explosive Laser': { icon: 'icon-explosive' },
        'Activate Sonic Blast': { icon: 'icon-sonic' },
        'Activate Boomerang': { icon: 'icon-boomerang' },
        'Activate Acid Bomb': { icon: 'icon-acid' },
        'Activate Drone': { icon: 'icon-drone' },
        'Activate Death Ray': { icon: 'icon-deathray' },
        'Activate Explosive Rocket': { icon: 'icon-explosiverocket' },
        'Activate Chain Lightning': { icon: 'icon-chainlightning' },
        'Activate Nano Swarm': { icon: 'icon-nanoswarm' },
        'Activate Flamethrower': { icon: 'icon-flamethrower' },
        'Sonic Boom': { icon: 'icon-sonicboom' },
        'Explo Drone': { icon: 'icon-explodrone' },
        'Chain of Flame': { icon: 'icon-chainofflame' },
        'CryoBomb': { icon: 'icon-cryobomb' },
        'Damage Booster': { icon: 'icon-ship' },
        'Triple Turret': { icon: 'icon-tripleTurret' },
        'Wave Turret': { icon: 'icon-doubleTurret' },
        'Drone Army': { icon: 'icon-droneArmy' }


    };

    const availableIcons = [];

    // Always include the basic laser icon
    availableIcons.push('icon-basiclaser');
    // availableIcons.push('icon-ship');

    if (activeWeaponClasses.includes('turret') || Achievements.reach_wave_2.reached) availableIcons.push(upgradeDefinitions['Activate Turret'].icon);
    if (activeWeaponClasses.includes('bomberdrone') || Achievements.reach_wave_2.reached) availableIcons.push(upgradeDefinitions['Activate Bomber Drone'].icon);
    if (activeWeaponClasses.includes('freeze') || Achievements.reach_wave_5.reached) availableIcons.push(upgradeDefinitions['Activate Freeze Effect'].icon);
    if (activeWeaponClasses.includes('explosive') || Achievements.laser_damage.reached) availableIcons.push(upgradeDefinitions['Activate Explosive Laser'].icon);
    if (activeWeaponClasses.includes('sonic') || Achievements.reach_wave_10.reached) availableIcons.push(upgradeDefinitions['Activate Sonic Blast'].icon);
    if (activeWeaponClasses.includes('boomerang') || Achievements.complete_easy_mode.reached) availableIcons.push(upgradeDefinitions['Activate Boomerang'].icon);
    if (activeWeaponClasses.includes('acid') || Achievements.complete_normal_mode.reached) availableIcons.push(upgradeDefinitions['Activate Acid Bomb'].icon);
    if (activeWeaponClasses.includes('drone') || Achievements.destroy_100_asteroids.reached) availableIcons.push(upgradeDefinitions['Activate Drone'].icon);
    if (Achievements.destroy_1000_asteroids.reached) availableIcons.push(upgradeDefinitions['Damage Booster'].icon);
    if (activeWeaponClasses.includes('deathray') || Achievements.kill_5_aliens.reached) availableIcons.push(upgradeDefinitions['Activate Death Ray'].icon);
    if (activeWeaponClasses.includes('explosiverocket') || Achievements.complete_hard_mode.reached) availableIcons.push(upgradeDefinitions['Activate Explosive Rocket'].icon);
    if (activeWeaponClasses.includes('chainlightning') || Achievements.kill_50_aliens.reached) availableIcons.push(upgradeDefinitions['Activate Chain Lightning'].icon);
    if (activeWeaponClasses.includes('nanoswarm') || Achievements.no_lives_lost.reached) availableIcons.push(upgradeDefinitions['Activate Nano Swarm'].icon);
    if (activeWeaponClasses.includes('flamethrower') || Achievements.acid_bomb_damage.reached) availableIcons.push(upgradeDefinitions['Activate Flamethrower'].icon);
    if (Achievements.alien_supermegaboss_killed.reached) availableIcons.push(upgradeDefinitions['Chain of Flame'].icon);
    if (Achievements.alien_megaboss_killed.reached) availableIcons.push(upgradeDefinitions['Explo Drone'].icon);
    if (Achievements.kill_500_aliens.reached) availableIcons.push(upgradeDefinitions['Sonic Boom'].icon);
    if (Achievements.alien_octopus_killed.reached) availableIcons.push(upgradeDefinitions['CryoBomb'].icon);
    if (Achievements.drone_damage.reached) availableIcons.push(upgradeDefinitions['Drone Army'].icon);
    if (Achievements.complete_meteor_normal_mode.reached) availableIcons.push(upgradeDefinitions['Wave Turret'].icon);
    if (Achievements.complete_planet_normal_mode.reached) availableIcons.push(upgradeDefinitions['Triple Turret'].icon);

    return availableIcons;
}


function populateAchievementIcons() {
    const achievementIconsList = document.getElementById('achievementIconsList');
    achievementIconsList.innerHTML = '';


    // Insert the total stats container at the beginning of achievementIconsList
    achievementIconsList.insertBefore(totalStatsContainer, achievementIconsList.firstChild);

    // Create containers for weapons and achievements
    const weaponsContainer = document.createElement('div');
    weaponsContainer.classList.add('icons-section', 'weapons-icons');
    const achievementsContainer = document.createElement('div');
    achievementsContainer.classList.add('icons-section', 'achievement-icons');

    // Add weapon icons
    const weaponIcons = getAvailableWeaponIcons();
    const totalWeapons = 22; // Adjust this number to match your total number of weapons

    const weaponsHeader = document.createElement('h4');
    weaponsHeader.textContent = `Weapons (${weaponIcons.length} / ${totalWeapons})`;
    weaponsContainer.appendChild(weaponsHeader);

    weaponIcons.forEach(icon => {
        const iconElement = document.createElement('div');
        iconElement.classList.add('achievement-icon', icon);
        weaponsContainer.appendChild(iconElement);
    });

    // Add achievement icons
    let achievedCount = 0;
    let totalAchievements = 0;

    for (const key in Achievements) {
        if (Achievements.hasOwnProperty(key)) {
            totalAchievements++;
            const achievement = Achievements[key];
            const achieved = achievement.reached || (achievement.damage && achievement.damage >= achievement.required);

            if (achieved) achievedCount++;

            const iconElement = document.createElement('div');
            iconElement.classList.add('achievement-icon');
            if (achievement.icon) {
                iconElement.classList.add(achievement.icon);
            } else {
                iconElement.classList.add('icon-generic-achievement');
            }

            if (!achieved) {
                iconElement.classList.add('unachieved');
            }

            // Add tooltip for the icon
            iconElement.title = achievement.description;

            achievementsContainer.appendChild(iconElement);
        }
    }

    const achievementsHeader = document.createElement('h4');
    achievementsHeader.textContent = `Achievements (${achievedCount} / ${totalAchievements})`;
    achievementsContainer.insertBefore(achievementsHeader, achievementsContainer.firstChild);

    // Append containers to the achievementIconsList
    achievementIconsList.appendChild(weaponsContainer);
    achievementIconsList.appendChild(achievementsContainer);
}
let currentGameModeIndex = 0;

function populateGameModes() {
    const gameModeSection = document.getElementById('gameModeSection');
    if (window.innerHeight > 500) {
        gameModeSection.innerHTML = `
        <h4 id="gameModeHeader">Select Game Mode</h4>
        <div class="selector">
            <button id="prevGameModeButton">&#60;</button>
            <span id="selectedGameMode">${gameModes[currentGameModeIndex].name}</span>
            <button id="nextGameModeButton">></button>
        </div>
    `;

    } else {

        gameModeSection.innerHTML = `
        <div class="selector">
            <button id="prevGameModeButton">&#60;</button>
            <span id="selectedGameMode">${gameModes[currentGameModeIndex].name}</span>
            <button id="nextGameModeButton">></button>
        </div>
    `;



    }

    function cycleGameMode(direction) {
        if (direction === 'next') {
            currentGameModeIndex = (currentGameModeIndex + 1) % gameModes.length;
        } else {
            currentGameModeIndex = (currentGameModeIndex - 1 + gameModes.length) % gameModes.length;
        }
        updateGameModeDisplay();
    }

    document.getElementById('nextGameModeButton').addEventListener('click', () => cycleGameMode('next'));
    document.getElementById('prevGameModeButton').addEventListener('click', () => cycleGameMode('prev'));

    updateGameModeDisplay();
}

function updateGameModeDisplay() {
    const selectedGameModeSpan = document.getElementById('selectedGameMode');
    selectedGameModeSpan.textContent = gameModes[currentGameModeIndex].name;

    // Update the play button or any other elements that depend on the game mode
    const playNowButton = document.getElementById('playNow');
    if (playNowButton) {
        // console.log("starting" + gameModes[currentGameModeIndex].name);
        playNowButton.onclick = () => initializeGame(gameModes[currentGameModeIndex].id);
    }
}
function getSelectedGameMode() {
    return gameModes[currentGameModeIndex].id;
}


let currentAchievementPage = 0;
const achievementsPerPage = 5; // Number of achievements to show per page



function populateAchievementsModal() {
    const achievementsDisplay = document.getElementById('achievementsDisplay');
    const totalAchievements = Object.keys(Achievements).length;

    // Clear existing content
    achievementsDisplay.innerHTML = '';

    // Add total stats section
    // const statsSection = document.createElement('div');
    // statsSection.className = 'achievement-stats';
    // statsSection.innerHTML = `
    //     <ul>
    //         <li>Total Damage Dealt: ${(totalDamage || 0).toLocaleString()}</li>
    //     </ul>
    // `;

    //     statsSection.innerHTML = `
    //     <h3>Total Stats</h3>
    //     <ul>
    //         <li>Total Damage Dealt: ${(totalDamage || 0).toLocaleString()}</li>
    //         <li>Total Asteroids Destroyed: ${(totalAsteroidsKilled || 0).toLocaleString()}</li>
    //         <li>Total Aliens Defeated: ${(totalAliensKilled || 0).toLocaleString()}</li>
    //     </ul>
    // `;

    // achievementsDisplay.appendChild(statsSection);

    // Add a separator
    const separator = document.createElement('hr');
    achievementsDisplay.appendChild(separator);

    // Add container for paginated achievements
    const paginatedAchievements = document.createElement('div');
    paginatedAchievements.id = 'paginatedAchievements';
    achievementsDisplay.appendChild(paginatedAchievements);

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalAchievements / achievementsPerPage);

    // Event listener for next button
    // document.getElementById('nextAchievement').addEventListener('click', function () {
    //     if (currentAchievementPage < totalPages - 1) {
    //         currentAchievementPage++;
    //         displayAchievementPage(currentAchievementPage);
    //     }
    // });

    // // Event listener for previous button
    // document.getElementById('prevAchievement').addEventListener('click', function () {
    //     if (currentAchievementPage > 0) {
    //         currentAchievementPage--;
    //         displayAchievementPage(currentAchievementPage);
    //     }
    // });


    // Event listener for next button
    const nextButton = document.getElementById('nextAchievement');
    const prevButton = document.getElementById('prevAchievement');

    // Remove existing event listeners to avoid duplicates
    nextButton.removeEventListener('click', handleNextAchievement);
    prevButton.removeEventListener('click', handlePrevAchievement);

    // Define the functions to handle next/previous page
    function handleNextAchievement() {
        if (currentAchievementPage < totalPages - 1) {
            currentAchievementPage++;
            displayAchievementPage(currentAchievementPage);
        }
    }

    function handlePrevAchievement() {
        if (currentAchievementPage > 0) {
            currentAchievementPage--;
            displayAchievementPage(currentAchievementPage);
        }
    }

    // Add new event listeners
    nextButton.addEventListener('click', handleNextAchievement);
    prevButton.addEventListener('click', handlePrevAchievement);


    // Initial display of the first page
    displayAchievementPage(currentAchievementPage);

    // console.log('Achievements modal populated:', achievementsDisplay.innerHTML);
}



function displayAchievementPage(page) {
    const paginatedAchievements = document.getElementById('paginatedAchievements');
    if (!paginatedAchievements) {
        console.error('Paginated achievements container not found');
        return;
    }
    paginatedAchievements.innerHTML = ''; // Clear only the paginated achievements

    // Get the achievements for the current page
    const achievementKeys = Object.keys(Achievements);
    const start = page * achievementsPerPage;
    const end = Math.min(start + achievementsPerPage, achievementKeys.length);

    // Loop through the achievements to display on this page
    for (let i = start; i < end; i++) {
        const achievement = Achievements[achievementKeys[i]];

        // Create achievement element
        const achievementElement = document.createElement('div');
        achievementElement.classList.add('achievement');
        achievementElement.style.opacity = achievement.reached ? '1' : '0.5';

        // Create and append icon
        const iconElement = document.createElement('img');
        iconElement.src = achievement.icon || 'default-icon.png'; // Fallback to a default icon
        iconElement.alt = achievement.description;
        iconElement.classList.add('achievement-icon-small');
        achievementElement.appendChild(iconElement);

        // Create and append description
        const descriptionElement = document.createElement('span');
        descriptionElement.textContent = achievement.description;
        achievementElement.appendChild(descriptionElement);

        paginatedAchievements.appendChild(achievementElement);
    }

    // Update navigation buttons
    document.getElementById('prevAchievement').disabled = (page === 0);
    document.getElementById('nextAchievement').disabled = (page === Math.ceil(achievementKeys.length / achievementsPerPage) - 1);
}


// Function to open the achievements modal
function openAchievementsModal() {
    const modal = document.getElementById('achievementsModal');
    modal.style.display = 'block';
    populateAchievementsModal();
    const firstAchievement = modal.querySelector('.achievement');
    if (firstAchievement) {
        firstAchievement.focus();
    }

}

// Function to close the achievements modal
document.getElementById('closeAchievementsModal').addEventListener('click', function () {
    const modal = document.getElementById('achievementsModal');
    modal.style.display = 'none';
});


// Function to display a specific page of achievements

// Function to open the achievements modal
// function openAchievementsModal() {
//     const modal = document.getElementById('achievementsModal');
//     modal.style.display = 'block';
//     populateAchievementsModal();
// }

// Function to close the achievements modal
// document.getElementById('closeAchievementsModal').addEventListener('click', function () {
//     const modal = document.getElementById('achievementsModal');
//     modal.style.display = 'none';
// });

function populateAchievements() {
    const achievementsList = document.getElementById('achievementsList');
    const achievementIconsList = document.getElementById('achievementIconsList');
    achievementsList.innerHTML = '';
    achievementIconsList.innerHTML = '';


    // const totalStatsContainer = document.createElement('div');
    // totalStatsContainer.classList.add('total-stats');

    // // Add total stats
    // const statsHeader = document.createElement('h3');
    // statsHeader.textContent = 'Total Stats';
    // totalStatsContainer.appendChild(statsHeader);

    // const statslist = document.createElement('ul');
    // statslist.innerHTML = `
    //     <li>Total Damage Dealt: ${totalDamage.toLocaleString()}</li>
    //     <li>Total Asteroids Destroyed: ${totalAsteroidsKilled.toLocaleString()}</li>
    //     <li>Total Aliens Defeated: ${totalAliensKilled.toLocaleString()}</li>
    // `;
    // totalStatsContainer.appendChild(statslist);


    // Create containers for ships, weapons, secondary weapons, and achievements icons
    const shipsContainer = document.createElement('div');
    shipsContainer.classList.add('icons-section', 'ships-icons');
    const weaponsContainer = document.createElement('div');
    weaponsContainer.classList.add('icons-section', 'weapons-icons');
    const secondaryWeaponsContainer = document.createElement('div');
    secondaryWeaponsContainer.classList.add('icons-section', 'secondary-weapons-icons');
    const achievementsIconsContainer = document.createElement('div');
    achievementsIconsContainer.classList.add('icons-section', 'achievement-icons');


    // Add ship icons
    let availableShips = [];
    Object.keys(ships).forEach(shipKey => {
        if (ships[shipKey].condition()) {
            availableShips.push({ key: shipKey, name: ships[shipKey].name });
        }
    });
    const totalShips = Object.keys(ships).length;

    const shipsHeader = document.createElement('h4');
    shipsHeader.textContent = `Ships (${availableShips.length} / ${totalShips})`;
    shipsContainer.appendChild(shipsHeader);

    availableShips.forEach(ship => {
        const iconElement = document.createElement('div');
        iconElement.classList.add('achievement-icon', `icon-ship-${ship.key}`);
        iconElement.title = ship.name;
        shipsContainer.appendChild(iconElement);
    });

    // Add weapon icons
    const weaponIcons = getAvailableWeaponIcons();
    const totalWeapons = 22; // Adjust this number to match your total number of weapons

    const weaponsHeader = document.createElement('h4');
    weaponsHeader.textContent = `Weapons (${weaponIcons.length} / ${totalWeapons})`;
    weaponsContainer.appendChild(weaponsHeader);

    weaponIcons.forEach(icon => {
        const iconElement = document.createElement('div');
        iconElement.classList.add('achievement-icon', icon);
        weaponsContainer.appendChild(iconElement);
    });

    // Add secondary weapon icons
    let availableSecondaryWeapons = [];
    Object.keys(secondaryWeapons).forEach(weaponKey => {
        if (secondaryWeapons[weaponKey].isAvailable()) {
            availableSecondaryWeapons.push({ key: weaponKey, name: secondaryWeapons[weaponKey].name });
        }
    });


    const spaceWeapons = [
        // { key: 'space_potato', name: 'Space Potato' },
        // { key: 'space_monkey', name: 'Space Monkey' },
        { key: 'space_pizza', name: 'Space Pizza' },
        { key: 'pink_pixie', name: 'Pink Pixie' },
        { key: 'purple_pixie', name: 'Purple Pixie' },
        { key: 'gold_pixie', name: 'Gold Pixie' },
        { key: 'space_pickle', name: 'Space Pickle' },
        { key: 'complete_planet_hard_mode', name: 'Glitch Effect' },
        { key: 'complete_planet_hero_mode', name: 'Asteroid Splitter' }

    ];

    spaceWeapons.forEach(weapon => {
        if (Achievements[weapon.key].reached) {
            availableSecondaryWeapons.push({
                key: weapon.key,
                name: weapon.name,
                icon: Achievements[weapon.key].icon
            });
        }
    });

    let totalSecondaryWeapons = Object.keys(secondaryWeapons).length + spaceWeapons.length;

    const secondaryWeaponsHeader = document.createElement('h4');
    secondaryWeaponsHeader.textContent = `Secondary Weapons and Upgrades (${availableSecondaryWeapons.length} / ${totalSecondaryWeapons})`;
    secondaryWeaponsContainer.appendChild(secondaryWeaponsHeader);

    availableSecondaryWeapons.forEach(weapon => {
        const iconElement = document.createElement('div');
        iconElement.classList.add('achievement-icon');

        if (weapon.icon) {
            // Use the weapon's icon if available
            iconElement.style.backgroundImage = `url('${weapon.icon}')`;
        } else {
            // Fallback to a generic icon class if no specific icon is available
            iconElement.classList.add(`icon-secondary-weapon-${weapon.key}`);
        }

        iconElement.title = weapon.name;
        secondaryWeaponsContainer.appendChild(iconElement);
    });

    // Add achievement icons and full list
    let achievedCount = 0;
    let totalAchievements = 0;

    for (const key in Achievements) {
        if (Achievements.hasOwnProperty(key)) {
            totalAchievements++;
            const achievement = Achievements[key];
            const achieved = achievement.reached || (achievement.damage && achievement.damage >= achievement.required);

            if (achieved) achievedCount++;

            // Create icon
            const iconElement = document.createElement('div');
            iconElement.classList.add('achievement-icon');
            if (achievement.icon) {
                iconElement.classList.add(achievement.icon);
            } else {
                iconElement.classList.add('icon-generic-achievement');
            }
            if (!achieved) {
                iconElement.classList.add('unachieved');
            }
            iconElement.title = achievement.description;
            achievementsIconsContainer.appendChild(iconElement);

            // Create full description element
            const achievementElement = document.createElement('div');
            achievementElement.classList.add('achievement');
            achievementElement.style.opacity = achieved ? '1' : '0.5';

            // Add icon to the full description
            const iconImg = document.createElement('img');
            iconImg.src = achievement.icon;
            iconImg.alt = achievement.description;
            iconImg.classList.add('achievement-icon-small');
            achievementElement.appendChild(iconImg);

            const description = document.createElement('span');
            description.textContent = achievement.description;
            achievementElement.appendChild(description);

            achievementsList.appendChild(achievementElement);
        }
    }

    const achievementsHeader = document.createElement('h4');
    achievementsHeader.textContent = `Achievements (${achievedCount} / ${totalAchievements})`;
    achievementsIconsContainer.insertBefore(achievementsHeader, achievementsIconsContainer.firstChild);


    // Append containers to the achievementIconsList
    achievementIconsList.appendChild(weaponsContainer);
    achievementIconsList.appendChild(secondaryWeaponsContainer);
    achievementIconsList.appendChild(shipsContainer);


    // achievementIconsList.appendChild(achievementsIconsContainer);

    // Update technologies count
    let count = countTechnologies();
    const technologiesCountElement = document.getElementById('technologiesCount');
    const totalTechnologyCount = Object.keys(Achievements).length + 5;

    // let totalTechnologyCount = 44; // 8 ships + 22 weapons + 12 secondary  
    // VERSION VERSION VERSION
    technologiesCountElement.textContent = `${count} of ${totalTechnologyCount} technologies unlocked`;

    // populateSelectors();
    // Populate game modes
    populateGameModes();
}

function updateAchievementsAtEnd() {

    const newlyUnlockedAchievements = [];
    const newlyUnlockedWeapons = [];
    const allAchieved = new Set();

    const addAchievement = (achievementKey) => {
        if (!Achievements[achievementKey].reached || currentMatchAchievements.has(achievementKey)) {
            Achievements[achievementKey].reached = true;
            newlyUnlockedAchievements.push(Achievements[achievementKey].description);
            currentMatchAchievements.delete(achievementKey); // Remove from set to avoid duplication
        }
    };



    if (wave >= 2) addAchievement('reach_wave_2');
    if (wave >= 5) addAchievement('reach_wave_5');
    if (wave >= 10) addAchievement('reach_wave_10');
    // if (wave >= 20) addAchievement('reach_wave_20');
    if (score >= 1000000) addAchievement('million_score');

    if (damageReport.acid >= Achievements.acid_bomb_damage.required) addAchievement('acid_bomb_damage');
    if (damageReport.explosive >= Achievements.explosive_laser_damage.required) addAchievement('explosive_laser_damage');
    if (asteroidsKilled >= 100) addAchievement('destroy_100_asteroids');
    if (asteroidsKilled >= 1000) addAchievement('destroy_1000_asteroids');

    if (wave >= 50 && lives === 3) addAchievement('no_lives_lost');

    if (megaBossAlienSpawned && megaBossAlien == null) addAchievement('alien_megaboss_killed');
    if (superbossAlienSpawned && superbossAlien == null) addAchievement('alien_supermegaboss_killed');
    if (octoBossSpawned && octoBoss == null) addAchievement('alien_octopus_killed');

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
    // if (currentMode == GameModes.ENDLESS_SLOW && wave >= 30)
    //     addAchievement('space_pizza');

    if (collectedSpacePizza)
        addAchievement('space_pizza');
    if (collectedPurplePixie)
        addAchievement('purple_pixie');
    if (collectedPinkPixie)
        addAchievement('pink_pixie');
    if (collectedGoldPixie)
        addAchievement('gold_pixie');
    if (collectedSpacePickle)
        addAchievement('space_pickle');
    if (collectedDarkSide)
        addAchievement('dark_side');




    if (currentMode == GameModes.ENDLESS_SLOW && wave >= 60)
        addAchievement('wave_60_endless');
    if (currentMode == GameModes.ENDLESS_SLOW && wave >= 120)
        addAchievement('wave_120_endless');


    // addAchievement('space_potato')


    if (damageReport.deathRay >= Achievements.death_ray_damage.required) addAchievement('death_ray_damage');
    if (damageReport.drones >= Achievements.drone_damage.required) addAchievement('drone_damage');
    if (damageReport.lasers >= Achievements.laser_damage.required) addAchievement('laser_damage');

    if (aliensKilled >= 5) addAchievement('kill_5_aliens');
    if (aliensKilled >= 50) addAchievement('kill_50_aliens');
    if (aliensKilled >= 500) addAchievement('kill_500_aliens');

    for (const key of currentMatchAchievements) {
        newlyUnlockedAchievements.push(Achievements[key].description);
    }

    // Clear the current match achievements for the next game
    currentMatchAchievements.clear();

    for (const [key, achievement] of Object.entries(Achievements)) {
        if (achievement.reached) {
            allAchieved.add(key);
        }
    }

    // if (allAchieved.has('complete_planet_normal_mode') &&
    //     allAchieved.has('complete_meteor_normal_mode') &&
    //     allAchieved.has('complete_normal_mode')) {
    //     addAchievement('all_normals');
    // }


    if (allAchieved.has('complete_planet_hard_mode') &&
        allAchieved.has('complete_meteor_hard_mode') &&
        allAchieved.has('complete_hard_mode')) {
        addAchievement('all_hards');
    }

    if (allAchieved.has('complete_normal_mode') &&
        allAchieved.has('complete_meteor_normal_mode') &&
        allAchieved.has('complete_planet_normal_mode') &&
        allAchieved.has('complete_planet_hard_mode') &&
        allAchieved.has('complete_meteor_hard_mode') &&
        allAchieved.has('complete_hard_mode') &&
        allAchieved.has('complete_planet_hero_mode') &&
        allAchieved.has('complete_meteor_hero_mode') &&
        allAchieved.has('complete_hero_mode')) {
        addAchievement('all_modes');
    }


    try {
        localStorage.setItem('achievements', JSON.stringify(Achievements));

    } catch (e) {

    }
    populateAchievements();

    // Determine newly unlocked weapons based on the achievements unlocked
    const achievementToWeaponMap = {
        'reach_wave_2': 'Bomber Drone',
        'reach_wave_5': 'Freeze Effect',
        'laser_damage': 'Explosive Laser',
        'reach_wave_10': 'Sonic Blast',
        'complete_easy_mode': 'Boomerang',
        'complete_normal_mode': 'Acid Bomb',
        'destroy_100_asteroids': 'Drone',
        'kill_5_aliens': 'Death Ray',
        'complete_planet_hard_mode': 'Explosive Rocket',
        'kill_50_aliens': 'Chain Lightning',
        'kill_500_aliens': 'Sonic Boom',
        'no_lives_lost': 'Nano Swarm',
        'acid_bomb_damage': 'Flamethrower'
    };


    newlyUnlockedAchievements.forEach(achievement => {
        if (achievement in achievementToWeaponMap) {
            newlyUnlockedWeapons.push(achievementToWeaponMap[achievement]);
        }
    });
    // console.log(newlyUnlockedAchievements);
    // console.log(newlyUnlockedWeapons);

    return { newlyUnlockedAchievements, newlyUnlockedWeapons };
}

function createUpgradeOptionsHTML(upgrades, isSmall = false) {
    if (!isSmall) {
        return upgrades.map((upgrade, index) => `
            <div class="upgrade-option" onclick="selectUpgrade(${index + 1})" >
                <div class="upgrade-number">${index + 1}</div>
                <div class="upgrade-icon ${upgrade.icon}"></div>
                <div class="upgrade-details">
                    <p class="upgrade-name">${upgrade.name}</p>
                    <p class="upgrade-description">${upgrade.description}</p>
                </div>
            </div >
            `).join('');
    } else {
        return upgrades.map((upgrade, index) => `
        <div class="upgrade-option" onclick="selectUpgrade(${index + 1})" >
            <div class="upgrade-number">${index + 1}</div>
            <div class="upgrade-icon ${upgrade.icon}"></div>
            <div class="upgrade-details">
                <p class="upgrade-name-small">${upgrade.name}</p>
                <p class="upgrade-description-small">${upgrade.description}</p>
            </div>
        </div >
        `).join('');


    }



}


function claimLevelUps() {

    if (unclaimedLevelUps > 0 && document.getElementById('levelUpModal').style.display != "block") {


        let upgradesToRetrieve = fourthUpgradeUnlocked ? 4 : 3;

        // Get random upgrades
        const upgrades = getRandomUpgrades(upgradesToRetrieve);
        if (upgrades.length >= 1) {

            document.getElementById('leveluptitle').innerHTML = 'Claim ' + unclaimedLevelUps + ' upgrades';


            // Display the level-up modal
            const levelUpModal = document.getElementById('levelUpModal');
            console.log(levelUpModal);

            let upgradeOptionsHTML;
            if (isMobile() || fourthUpgradeUnlocked)
                upgradeOptionsHTML = createUpgradeOptionsHTML(upgrades, true);
            else
                upgradeOptionsHTML = createUpgradeOptionsHTML(upgrades);

            if (document.getElementById('upgradeOptions'))
                document.getElementById('upgradeOptions').innerHTML = upgradeOptionsHTML;

            // Show the modal
            const container = document.getElementById('activeWeaponClassesContainer');
            container.style.display = "none";

            levelUpModal.style.display = 'block';
            // Store upgrades in a global variable for later use
            window.levelUpgrades = upgrades;
            // Pause the game
            pauseGame();

            // Activate temporary invincibility

            invincible = true;
            invincibilityTimer += invincibilityDuration;

        } else {

            waitAndClaimMode = true;
            resumeGame();

        }

    }
    resumeGame();


}

function toggleRedeemMode() {

    if (waitAndClaimMode)
        waitAndClaimMode = false;
    else
        waitAndClaimMode = true;

    let redeemText = "On"
    if (!waitAndClaimMode)
        redeemText = "Off"
    document.getElementById('redeemModeStatus').innerHTML = redeemText;

}



function levelUp() {
    level++;
    unclaimedLevelUps++;
    let prevLevelUp = lastLevelUp;
    lastLevelUp = Date.now();
    bonusLevelUpCalculator();

    if (!waitAndClaimMode) {
        pauseGame();
        document.getElementById('leveluptitle').innerHTML = 'Level Up!';

        let upgradesToRetrieve = fourthUpgradeUnlocked ? 4 : 3;
        const upgrades = getRandomUpgrades(upgradesToRetrieve);

        if (upgrades.length <= 2) {
            waitAndClaimMode = true;
            resumeGame();
        } else {
            pauseGame();

            // Update tutorial before showing the level-up modal
            updateTutorial();

            const levelUpModal = document.getElementById('levelUpModal');
            const upgradeOptionsHTML = createUpgradeOptionsHTML(upgrades);
            if (document.getElementById('upgradeOptions')) {
                document.getElementById('upgradeOptions').innerHTML = upgradeOptionsHTML;
                const container = document.getElementById('activeWeaponClassesContainer');
                container.style.display = "none";

                levelUpModal.style.display = 'block';
                window.levelUpgrades = upgrades;

                invincible = true;
                invincibilityTimer += invincibilityDuration;
            }
        }
    }

    xp = 0;
    xpToNextLevel = levelXPCalculator();
    updateXPBar();
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
        case 'basiclaser':
            return ship.laserLevel + ship.laserCooldownLevel - 1;
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
            return nanoswarmUpgrades.damage + nanoswarmUpgrades.cooldown - 1;
        case 'flamethrower':
            return flamethrowerUpgrades.range + flamethrowerUpgrades.damage + flamethrowerUpgrades.cooldown - 2;
        case 'chainlightning':
            return chainLightningUpgrades.range + chainLightningUpgrades.damage + chainLightningUpgrades.bounces + chainLightningUpgrades.cooldown - 3;
        case 'explosiverocket':
            return explosiveRocketUpgrades.damage + explosiveRocketUpgrades.radius + explosiveRocketUpgrades.cooldown - 2;
        case 'sonicboom':
            return 1
        case 'explodrone':
            return 1
        case 'cryobomb':
            return 1
        case 'chainofflame':
            return 1
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
    endTutorial();

    // document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('userInfo').style.display = 'block';
    xp = 0;
    pauseGame();
    // clearInterval(gameLoop);
    pauseAllMusic();


    if (crazyGamesMode && window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.game) {
        try {
            window.CrazyGames.SDK.game.gameplayStop();

        } catch (error) {
            console.log(error);
        }

    }

    if (isMobile()) {

        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) mobileControls.style.display = 'none';
    }


    resetShip();


    // Calculate the time taken and save it
    gameEndTime = new Date();
    timeTaken = gameEndTime - gameStartTime; // Time in milliseconds

    score = Math.floor(Math.abs(score * modeScoreMultiplier)); // Ensure score is a positive whole number

    const activeMegaUpgradesData = activeMegaUpgrades.map(upgrade => ({
        name: upgrade.name
    }));

    // Calculate top six weapons by damage
    const topSixWeapons = Object.entries(damageReport)
        .filter(([weapon, damage]) => damage > 0) // Only include weapons with damage
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([weapon, damage]) => ({ weapon, damage }));

    const gameData = {
        score: score,
        topWeapons: topSixWeapons,
        sessionLength: timeTaken,
        gameMode: currentMode,
        activeMegaUpgrades: activeMegaUpgradesData,
        asteroidsKilled: asteroidsKilled,
        aliensKilled: aliensKilled,
        wave: wave
    };


    // Update achievements and handle end game server logic
    const { newlyUnlockedAchievements, newlyUnlockedWeapons } = updateAchievementsAtEnd();

    // Ensure we have a valid userId before saving
    if (userId) {
        saveUserScore(userId, gameData);
    } else {
        console.error('No valid userId available, unable to save score');
    }

    // Load and display the leaderboard
    loadLeaderboardOptimized(gameId, currentMode);

    populateSelectors();

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
    const damageReportList = document.getElementById('damageReportList');
    const unlockedWeaponsList = document.getElementById('unlockedWeaponsList');
    const unlockedWeaponsHeader = document.getElementById('unlockedWeaponsHeader');
    const newAchievementsList = document.getElementById('newAchievementsList');
    const newAchievementsHeader = document.getElementById('newAchievementsHeader');
    const achievementSound = unlockSound;
    const container = document.getElementById('activeWeaponClassesContainer');
    container.innerHTML = ''; // Clear previous content

    // Set game stats
    if (currentMode === GameModes.ENDLESS_SLOW) {
        waveElement.textContent = `Waves Survived: ${wave}`;
    } else {
        waveElement.textContent = `Wave: ${wave}`;
    }

    if (isMobile()) {

        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) mobileControls.style.display = 'none';
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

    Object.entries(damageReport).forEach(([weapon, damage]) => {
        const weaponName = damageReportMapping[weapon];
        const weaponInfo = weapons.find(w => w.name === weaponName);

        if (weaponInfo && damage > 0) {  // Only create elements for weapons with damage > 0
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.tabIndex = 0; // Make it focusable

            const icon = document.createElement('div');
            icon.classList.add('weaponClassIcon', weaponInfo.icon);
            icon.style.width = '24px';
            icon.style.height = '24px';
            icon.style.marginRight = '10px';

            const text = document.createElement('span');
            const roundedDamage = Math.round(damage);
            const roundedDPM = Math.round(weaponDPM[weapon] || 0);  // Use 0 if DPM is undefined
            text.textContent = `${weaponInfo.name}: ${roundedDamage} (DPM: ${roundedDPM})`;

            li.appendChild(icon);
            li.appendChild(text);
            damageReportList.appendChild(li);
        }
    });


    // Clear and set recently unlocked weapons
    unlockedWeaponsList.innerHTML = '';
    if (newlyUnlockedWeapons.length === 0) {
        unlockedWeaponsHeader.style.display = 'none';
    } else {
        unlockedWeaponsHeader.style.display = 'block';
    }
    newlyUnlockedWeapons.forEach((weaponName, index) => {
        const weaponInfo = weapons.find(w => w.name === weaponName);
        if (weaponInfo) {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.tabIndex = 0; // Make it focusable

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
    if (newlyUnlockedAchievements.length === 0) {
        newAchievementsHeader.style.display = 'none';
    } else {
        newAchievementsHeader.style.display = 'block';
    }


    function displayAchievementsSequentially(index) {
        if (index >= newlyUnlockedAchievements.length) return;

        const achievement = newlyUnlockedAchievements[index];
        const li = document.createElement('li');
        li.textContent = achievement;
        li.classList.add('flash'); // Add the flashing animation class
        li.tabIndex = 0; // Make it focusable
        newAchievementsList.appendChild(li);
        if (!toggleSoundOff) {
            achievementSound.play();
        }

        // Remove the flash class after the animation duration (1 second)
        setTimeout(() => {
            li.classList.remove('flash');
            displayAchievementsSequentially(index + 1); // Display the next achievement
        }, 1000); // Adjust the duration as needed
    }

    displayAchievementsSequentially(0); // Start displaying achievements from the first one


    // Create and display the chart
    // createEndGameDamageChart();

    // Show the end screen
    endScreen.style.display = 'flex';
    levelUpModal.style.display = 'none';

    // Load and display the leaderboard
    loadLeaderboardOptimized(gameId, currentMode);

    // Set focus to the first focusable element in the end screen
    const firstFocusableElement = endScreen.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }

    // Add keyboard navigation
    endScreen.addEventListener('keydown', handleEndScreenKeydown);
}


function handleEndScreenKeydown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const focusableElements = Array.from(document.getElementById('endScreen').querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
        const currentIndex = focusableElements.indexOf(document.activeElement);
        let nextIndex;

        if (event.key === 'ArrowDown') {
            nextIndex = (currentIndex + 1) % focusableElements.length;
        } else {
            nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
        }

        focusableElements[nextIndex].focus();
    }
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

    // Possible quickfix for weapon underreporting 
    // damageReportStartTimes.fireAsteroid = gameStartTime;
    // damageReportStartTimes.lightningAsteroid = gameStartTime;
    // damageReportStartTimes.acidAsteroid = gameStartTime;

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







