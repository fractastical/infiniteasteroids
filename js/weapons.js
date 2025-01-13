
const MAX_UPGRADE_COUNT = 10;

let boomerang = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 2,
    damage: 1,
    dx: 3,
    dy: 3,
    active: false
};

let boomerangUpgrades = {
    speed: 1,
    damage: 1
};


let explosiveRocket = {
    cooldown: 120, // Cooldown time in frames (2 seconds at 60 FPS)
    timer: 0, // Current cooldown timer
    speed: 3, // Speed of the rocket
    damage: 10, // Damage dealt by the rocket
    radius: 100, // Explosion radius
    active: false // Flag to track if the rocket is active
};

let explosiveRocketUpgrades = {
    damage: 1,
    radius: 1,
    cooldown: 1
};
let nanoswarm = {
    cooldown: 300,
    timer: 0,
    speed: 2,
    damage: 5,
    activeMissiles: []
};


let nanoswarmUpgrades = {
    speed: 1,
    damage: 1,
    cooldown: 1
};

let freezeEffect = {
    cooldown: 600, // Cooldown period for freeze effect (10 seconds at 60 FPS)
    timer: 0,
    duration: 300, // Duration the freeze effect lasts (5 seconds at 60 FPS)
    active: false,
    remainingDuration: 0
};

let bomberDroneUpgrades = {
    speed: 1,
    bombRadiusLevel: 1,
    bombRadius: 50,
    bombDamage: 2
};


let freezeEffectUpgrades = {
    duration: 1,
    cooldown: 1
};


let damageReport = {
    lasers: 0,
    explosive: 0,
    drones: 0,
    turret: 0,
    sonicBlast: 0,
    bomberDrones: 0,
    deathRay: 0,
    acid: 0,
    freeze: 0,
    boomerang: 0,
    nano: 0,
    explosiverocket: 0,
    flamethrower: 0,
    chainlightning: 0,
    fireAsteroid: 0,
    acidAsteroid: 0,
    lightningAsteroid: 0,
    iceAsteroid: 0


};


let chainLightning = {
    cooldown: 300, // Cooldown time in frames
    timer: 0, // Current cooldown timer
    range: 200, // Range of the chain lightning
    damage: 5, // Damage dealt per hit
    bounces: 2, // Number of bounces
    active: false // Flag to track if the chain lightning is active
};

let chainLightningUpgrades = {
    range: 1,
    damage: 1,
    bounces: 1,
    cooldown: 1
};

let deathRay = {
    length: 1000,
    width: 40,
    cooldown: 300,
    timer: 0
};

let deathRayActive = false;

let deathRayUpgrades = {
    length: 1,
    width: 1,
    cooldown: 1
};

let bomberDrones = [];

let drone = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 0.0001,
    direction: Math.random() * Math.PI * 2,
    lasers: [],
    damage: 1,
    laserSpeed: 3,
    laserInterval: 80, // Fire lasers every 120 frames (2 second)
    laserTimer: 0
};

let turret = {
    x: 0,
    y: 0,
    size: 4,
    rotationSpeed: 2,
    fireInterval: 120,
    fireTimer: 0,
    range: 400,
    damage: 3,
    color: 'cyan',
    lasers: [] // Initialize the turret's lasers array
};

let turretUpgrades = {
    range: 1,
    fireRate: 1,
    damage: 1
};

let sonicBlast = {
    cooldown: 300, // Cooldown time in frames (5 seconds at 60 FPS)
    timer: 0, // Current cooldown timer
    range: 120, // Range of the sonic blast
    speed: 2, // Speed of the sonic blast wave
    damage: 1, // Damage dealt by the sonic blast
    waves: [], // Array to store the active sonic blast waves
    rangeLevel: 1,
    damageLevel: 1,
    cooldownLevel: 1

};

let flamethrower = {
    cooldown: 10, // Cooldown time in frames
    timer: 0, // Current cooldown timer
    range: 130, // Range of the flamethrower
    damage: 1, // Damage dealt per frame
    active: false, // Flag to track if the flamethrower is active
    damagePerSecond: 1 // Damage dealt per second

};

let flamethrowerUpgrades = {
    range: 1,
    damage: 1,
    cooldown: 1
};

let plasmaCannon = {
    cooldown: 120, // Cooldown time in frames (2 seconds at 60 FPS)
    timer: 0, // Current cooldown timer
    damage: 15, // Damage dealt by the plasma shot
    speed: 4, // Speed of the plasma shot
    radius: 30, // Explosion radius on impact
    active: false // Flag to track if the plasma cannon is active
};

let plasmaCannonUpgrades = {
    damage: 1,
    radius: 1,
    cooldown: 1
};


const droneImages = {
    regularDrone: 'icons/laserdrone.png',
    bomberDrone: 'icons/bomberdrone.png',
    nanoDrone: 'icons/nanodrone.png',
};

function preloadDroneImages() {
    for (const droneType in droneImages) {
        const image = new Image();
        image.src = droneImages[droneType];
        droneImages[droneType] = image;
    }
}

// Call the preloadDroneImages function before starting the game
preloadDroneImages();



function firePlasmaCannon() {
    if (plasmaCannon.timer === 0) {
        const angle = ship.rotation * Math.PI / 180;
        const shot = {
            x: ship.x + Math.sin(angle) * 20,
            y: ship.y - Math.cos(angle) * 20,
            angle: angle,
            speed: plasmaCannon.speed,
            damage: plasmaCannon.damage,
            radius: plasmaCannon.radius,
            distance: 0
        };
        plasmaShots.push(shot);
        plasmaCannon.timer = plasmaCannon.cooldown;
    }
}

function updatePlasmaShots() {
    for (let i = plasmaShots.length - 1; i >= 0; i--) {
        const shot = plasmaShots[i];
        shot.x += Math.sin(shot.angle) * shot.speed;
        shot.y -= Math.cos(shot.angle) * shot.speed;
        shot.distance += shot.speed;

        if (shot.distance >= 300) { // Check if the shot has traveled a certain distance
            createExplosion(shot.x, shot.y, 0); // Create an explosion effect at the shot's position
            applyExplosiveDamage(shot); // Apply area damage to asteroids within the explosion radius
            plasmaShots.splice(i, 1); // Remove the shot from the array
            continue;
        }

        if (shot.x < 0 || shot.x > canvas.width || shot.y < 0 || shot.y > canvas.height) {
            plasmaShots.splice(i, 1);
        }
    }
}


function applyUpgrade(upgrade) {
    const now = Date.now();

    switch (upgrade) {
        case 'Increase Laser Level':
            ship.laserLevel++;
            break;
        case 'Decrease Laser Cooldown':
            ship.laserCooldownLevel++;
            ship.maxBulletsLevel++;
            if (currentMode == GameModes.EASY)
                ship.laserCooldown = Math.max(5, ship.laserCooldown - 3);
            else
                ship.laserCooldown = Math.max(5, ship.laserCooldown - 2);
            break;
        case 'Max Speed':
            ship.maxspeed++;
            break;
        case 'Increase Rotation Speed':
            ship.rotationSpeedLevel++;
            ship.rotationSpeed = 1.55 + 0.05 * ship.rotationSpeedLevel;
            break;
        case 'Activate Explosive Laser':
            activateWeaponClass('explosive');
            damageReportStartTimes.explosive = now;
            break;
        case 'Increase Explosive Laser Level':
            ship.explosiveLaserLevel++;
            break;
        case 'Activate Turret':
            activateWeaponClass('turret');
            damageReportStartTimes.turret = now;
            break;
        case 'Increase Turret Range':
            turretUpgrades.range++;
            turret.range = 200 * turretUpgrades.range;
            break;
        case 'Increase Turret Firerate':
            turretUpgrades.fireRate++;
            turret.fireInterval = 120 / turretUpgrades.fireRate;
            break;
        case 'Increase Turret Damage':
            turretUpgrades.damage++;
            turret.damage = turretUpgrades.damage;
            break;
        case 'Activate Drone':
            activateWeaponClass('drone');
            damageReportStartTimes.drones = now;
            break;
        case 'Increase Drone Firerate':
            droneUpgrades.laserInterval++;
            drones.forEach(drone => {
                drone.laserInterval = 80 / droneUpgrades.laserInterval;
            });
            break;
        case 'Increase Drone Damage':
            droneUpgrades.damageLevel++;
            drones.forEach(drone => {
                drone.damage += 3;
            });
            break;
        case 'Activate Sonic Blast':
            activateWeaponClass('sonic');
            damageReportStartTimes.sonicBlast = now;
            break;
        case 'Increase Sonic Blast Range':
            sonicBlast.range += 50;
            sonicBlast.rangeLevel++;
            break;
        case 'Increase Sonic Blast Damage':
            sonicBlast.damageLevel++;
            sonicBlast.damage++;
            break;
        case 'Decrease Sonic Blast Cooldown':
            sonicBlast.cooldown = Math.max(60, sonicBlast.cooldown - 30);
            sonicBlast.cooldownLevel++;
            break;
        case 'Activate Bomber Drone':
            activateWeaponClass('bomberdrone');
            damageReportStartTimes.bomberDrones = now;
            break;
        case 'Increase Bomber Drone Speed':
            bomberDroneUpgrades.speed += 0.2;
            bomberDrones.forEach(drone => {
                drone.speed = 0.5 * bomberDroneUpgrades.speed;
            });
            break;
        case 'Increase Bomber Drone Bomb Radius':
            bomberDroneUpgrades.bombRadius += 10;
            bomberDroneUpgrades.bombRadiusLevel++;
            break;
        case 'Increase Bomber Drone Bomb Damage':
            bomberDroneUpgrades.bombDamage++;
            break;
        case 'Activate Death Ray':
            activateWeaponClass('deathray');
            damageReportStartTimes.deathRay = now;
            break;
        case 'Increase Death Ray Length':
            deathRayUpgrades.length++;
            deathRay.length = 1000 * deathRayUpgrades.length;
            break;
        case 'Increase Death Ray Width':
            deathRayUpgrades.width++;
            deathRay.width = 30 + (10 * deathRayUpgrades.width);
            break;
        case 'Decrease Death Ray Cooldown':
            deathRayUpgrades.cooldown++;
            deathRay.cooldown = Math.max(60, 300 - 30 * deathRayUpgrades.cooldown);
            break;
        case 'Activate Acid Bomb':
            activateWeaponClass('acid');
            damageReportStartTimes.acid = now;
            break;
        case 'Increase Acid Bomb Duration':
            acidBombUpgrades.duration++;
            acidBomb.duration = 300 * acidBombUpgrades.duration;
            break;
        case 'Decrease Acid Bomb Cooldown':
            acidBombUpgrades.cooldown++;
            acidBomb.cooldown = Math.max(60, 300 - 30 * acidBombUpgrades.cooldown);
            break;
        case 'Increase Acid Bomb Size':
            acidBombUpgrades.size++;
            acidBomb.size = 20 + (20 * acidBombUpgrades.size);
            break;
        case 'Activate Explosive Rocket':
            activateWeaponClass('explosiverocket');
            damageReportStartTimes.explosiveRocket = now;
            break;
        case 'Increase Explosive Rocket Damage':
            explosiveRocketUpgrades.damage++;
            explosiveRocket.damage = 10 * explosiveRocketUpgrades.damage;
            break;
        case 'Increase Explosive Rocket Radius':
            explosiveRocketUpgrades.radius++;
            explosiveRocket.radius = 100 + (20 * explosiveRocketUpgrades.radius);
            break;
        case 'Decrease Explosive Rocket Cooldown':
            explosiveRocketUpgrades.cooldown++;
            explosiveRocket.cooldown = Math.max(30, 120 - 10 * explosiveRocketUpgrades.cooldown);
            break;
        case 'Activate Freeze Effect':
            activateWeaponClass('freeze');
            damageReportStartTimes.freeze = now;
            break;
        case 'Increase Freeze Duration':
            freezeEffectUpgrades.duration++;
            freezeEffect.duration = 10 + (5 * freezeEffectUpgrades.duration);
            break;
        case 'Decrease Freeze Cooldown':
            freezeEffectUpgrades.cooldown++;
            freezeEffect.cooldown = Math.max(60, 600 - 30 * freezeEffectUpgrades.cooldown);
            break;
        case 'Activate Boomerang':
            activateWeaponClass('boomerang');
            damageReportStartTimes.boomerang = now;
            break;
        case 'Increase Boomerang Speed':
            boomerangUpgrades.speed++;
            boomerang.speed = 2 * boomerangUpgrades.speed;
            break;
        case 'Increase Boomerang Damage':
            boomerangUpgrades.damage++;
            boomerang.damage = boomerangUpgrades.damage;
            break;
        case 'Activate Nano Swarm':
            activateWeaponClass('nanoswarm');
            damageReportStartTimes.nano = now;
            break;
        case 'Boost Nano Swarm':
            nanoswarmUpgrades.damage++;
            nanoswarmUpgrades.speed++;
            break;
        case 'Decrease Nano Swarm Cooldown':
            nanoswarmUpgrades.cooldown++;
            nanoswarm.cooldown = Math.max(20, 120 - 30 * nanoswarmUpgrades.cooldown);
            break;
        case 'Wave Turret':
            doubleTurret = true;
            break;
        case 'Triple Turret':
            tripleTurret = true;
            break;
        case 'Drone Army':
            droneArmy = true;
            buyDrone();
            buyBomberDrone();
            break;
        case 'Damage Booster':
            damageBooster++;
            break;
        case 'Extra Upgrade Choice':
            fourthUpgradeUnlocked = true;
            break;
        case 'Activate Flamethrower':
            activateWeaponClass('flamethrower');
            damageReportStartTimes.flamethrower = now;
            break;
        case 'Increase Flamethrower Range':
            flamethrowerUpgrades.range++;
            flamethrower.range = 130 + (20 * flamethrowerUpgrades.range);
            break;
        case 'Increase Flamethrower Damage':
            flamethrowerUpgrades.damage++;
            flamethrower.damagePerSecond++;
            flamethrower.damage = flamethrowerUpgrades.damage;
            break;
        case 'Decrease Flamethrower Cooldown':
            flamethrowerUpgrades.cooldown++;
            flamethrower.cooldown = Math.max(1, 10 - flamethrowerUpgrades.cooldown);
            break;

        case 'Activate Chain Lightning':
            activateWeaponClass('chainlightning');
            damageReportStartTimes.chainlightning = now;
            break;
        case 'Increase Chain Lightning Range':
            chainLightningUpgrades.range++;
            chainLightning.range = 100 * chainLightningUpgrades.range;
            break;
        case 'Increase Chain Lightning Damage':
            chainLightningUpgrades.damage++;
            chainLightning.damage = 5 * chainLightningUpgrades.damage;
            break;
        case 'Increase Chain Lightning Bounces':
            chainLightningUpgrades.bounces++;
            chainLightning.bounces = 1 + chainLightningUpgrades.bounces;
            break;
        case 'Decrease Chain Lightning Cooldown':
            chainLightningUpgrades.cooldown++;
            chainLightning.cooldown = Math.max(60, 300 - 30 * chainLightningUpgrades.cooldown);
            break;
        case 'Chain of Flame':
            activateWeaponClass('chainofflame');
            activateComboFlameChainLightning();
            break;
        case 'Explo Drone':
            activateWeaponClass('explodrone');
            activateComboExplosiveDrone();
            break;
        case 'Sonic Boom':
            activateWeaponClass('sonicboom');
            activateComboSonicBoomerang();
            break;
        case 'Cryo Bomb':
            activateWeaponClass('cryobomb');
            activateComboCryoBomb();
            break;
        case 'GravityBlast':
            activateWeaponClass('gravityblast');

            activateComboGravityBlast();
            break;

    }

}

let damageReportStartTimes = {};

// Initialize total damage for each weapon
function initializeWeaponDamageTracking() {
    const weaponClasses = ['explosive', 'turret', 'drone', 'sonic', 'bomberdrone', 'deathray', 'acid', 'freeze', 'boomerang', 'nanoswarm', 'flamethrower', 'chainlightning', 'explosiverocket'];
    weaponClasses.forEach(weapon => {
        damageReport[weapon] = 0;
        damageReportStartTimes[weapon] = null;
    });
}

initializeWeaponDamageTracking();



function activateWeaponClass(weaponClass) {
    // temporarily remove restrictions
    if (!activeWeaponClasses.includes(weaponClass)) {
        activeWeaponClasses.push(weaponClass);
        // damageReportStartTimes[weaponClass] = Date.now();

        switch (weaponClass) {
            case 'explosive':
                ship.explosiveLaserLevel = 1;
                break;
            case 'turret':
                turret.bought = true;
                turretUpgrades.range = 1;
                turretUpgrades.fireRate = 1;
                turretUpgrades.damage = 1;
                break;
            case 'drone':
                buyDrone();
                break;
            case 'bomberdrone':
                bomberDroneUpgrades = {
                    speed: 1,
                    bombRadius: 50,
                    bombRadiusLevel: 1,
                    bombDamage: 2
                };
                buyBomberDrone();
                break;
            case 'sonic':
                sonicBlast.range = 200;
                sonicBlast.damage = 1;
                sonicBlast.cooldown = 300;
                break;
            case 'deathray':
                deathRay.length = 1000;
                deathRay.width = 50;
                deathRay.cooldown = 300;
                break;
            case 'nanoswarm':
                nanoswarm.cooldown = 120;
                nanoswarm.timer = 0;
                break;
            case 'freeze':
                freezeEffect.duration = 30;
                freezeEffect.cooldown = 600;
                break;
            case 'boomerang':
                activateBoomerang();
                break;

        }

    }
}

// Update function to draw active weapon classes with cooldown indicators
function drawActiveWeaponClasses() {
    const container = document.getElementById('activeWeaponClassesContainer');
    container.innerHTML = ''; // Clear previous content

    for (const weaponClass of activeWeaponClasses) {
        const iconContainer = document.createElement('div');
        iconContainer.classList.add('iconContainer');

        const icon = document.createElement('div');
        icon.classList.add('weaponClassIcon', `icon-${weaponClass.toLowerCase().replace(/\s+/g, '')}`);

        // Create a span element to display the number of upgrades
        const upgradeCount = document.createElement('span');
        upgradeCount.classList.add('upgradeCount');
        upgradeCount.textContent = getUpgradeCount(weaponClass); // Get the number of upgrades for the weapon class

        // Append the icon and upgrade count to the container
        iconContainer.appendChild(icon);
        iconContainer.appendChild(upgradeCount);
        container.appendChild(iconContainer);
    }
}


const weapons = [
    {
        name: 'Basic Laser',
        description: 'Standard weapon. Fires straight lasers.',
        icon: 'icon-basiclaser'
    },
    {
        name: 'Explosive Laser',
        description: 'Lasers explode on impact, causing area damage.',
        icon: 'icon-explosive'
    },
    {
        name: 'Laser Drone',
        description: 'Drone that flies around you shooting randomly.',
        icon: 'icon-drone'
    },
    {
        name: 'Bomber Drone',
        description: 'Drone that leaves protective mines.',
        icon: 'icon-bomberdrone'
    },
    {
        name: 'Acid Bomb',
        description: 'Releases acid that deals damage over time in an area.',
        icon: 'icon-acid'
    },
    {
        name: 'Sonic Blast',
        description: 'Creates a wave that damages all enemies in its path.',
        icon: 'icon-sonic'
    },
    {
        name: 'Death Ray',
        description: 'Fire a beam that melts and instakills everything in its path.',
        icon: 'icon-deathray'
    },
    {
        name: 'Boomerang',
        description: 'A boomerang that bounces around the level.',
        icon: 'icon-boomerang'
    },
    {
        name: 'Freeze Ray',
        description: 'Freezes enemies in place for a short duration.',
        icon: 'icon-freeze'
    },
    {
        name: 'Nano Swarm',
        description: 'A swarm of nanobots that seek and destroy enemies.',
        icon: 'icon-nanoswarm'
    },
    {
        name: 'Turret',
        description: 'Deploys a turret that automatically shoots at enemies.',
        icon: 'icon-turret'
    },
    {
        name: 'Flamethrower',
        description: 'Shoots a continuous stream of fire.',
        icon: 'icon-flamethrower'
    },
    {
        name: 'Chain Lightning',
        description: 'Fires a lightning bolt that bounces between asteroids.',
        icon: 'icon-chainlightning'
    },
    {
        name: 'Explosive Rocket',
        description: 'Fires a slow-moving rocket that causes explosive AoE damage on impact.',
        icon: 'icon-explosiverocket'
    },
    // {
    //     name: 'Plasma Cannon',
    //     description: 'Fires powerful plasma shots that explode on impact, dealing area damage.',
    //     icon: 'icon-plasmacannon'
    // },
    // {
    //     name: 'Gravity Well',
    //     description: 'Creates a gravity well that pulls in nearby asteroids, slowing them down.',
    //     icon: 'icon-gravitywell'
    // },
    // {
    //     name: 'Cryo Bomb',
    //     description: 'Combines Acid Bomb and Freeze Ray to create an explosive area effect that freezes enemies.',
    //     icon: 'icon-cryobomb'
    // },
    // {
    //     name: 'Gravity Blast',
    //     description: 'Combines Gravity Well and Sonic Blast to create a powerful gravitational explosion followed by a sonic wave.',
    //     icon: 'icon-gravityblast'
    // }

];


const damageReportMapping = {
    lasers: 'Basic Laser',
    explosive: 'Explosive Laser',
    drones: 'Laser Drone',
    turret: 'Turret',
    sonicBlast: 'Sonic Blast',
    bomberDrones: 'Bomber Drone',
    deathRay: 'Death Ray',
    acid: 'Acid Bomb',
    freeze: 'Freeze Ray',
    boomerang: 'Boomerang',
    nano: 'Nano Swarm',
    flamethrower: 'Flamethrower',
    chainlightning: 'Chain Lightning',
    fireasteroid: 'Fire Asteroid',
    acidAsteroid: 'Acid Asteroid',
    lightningAsteroid: 'Lightning  Asteroid'


};





function activateMissile() {
    // Find the nearest asteroid to the ship
    let nearestAsteroid = null;
    let nearestDistance = Infinity;
    for (let i = 0; i < asteroids.length; i++) {
        let dx = ship.x - asteroids[i].x;
        let dy = ship.y - asteroids[i].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < nearestDistance) {
            nearestAsteroid = asteroids[i];
            nearestDistance = distance;
        }
    }

    if (nearestAsteroid) {
        // Create an explosion at the nearest asteroid's position
        createExplosion(nearestAsteroid.x, nearestAsteroid.y);
        // Remove the nearest asteroid
        let index = asteroids.indexOf(nearestAsteroid);
        asteroids.splice(index, 1);
        score += 50;
    }
}

function activateLaserBeam() {
    // Destroy all asteroids in a straight line in front of the ship
    let angle = ship.rotation * Math.PI / 180;
    let startX = ship.x;
    let startY = ship.y;
    let endX = ship.x + canvas.width * Math.sin(angle);
    let endY = ship.y - canvas.width * Math.cos(angle);

    for (let i = asteroids.length - 1; i >= 0; i--) {
        if (isPointOnLine(asteroids[i].x, asteroids[i].y, startX, startY, endX, endY)) {
            createExplosion(asteroids[i].x, asteroids[i].y);
            asteroids.splice(i, 1);
            score += 50;
        }
    }
}

function isPointOnLine(px, py, startX, startY, endX, endY) {
    let threshold = 10; // Adjust this value to control the thickness of the laser beam
    let distance = Math.abs((endY - startY) * px - (endX - startX) * py + endX * startY - endY * startX) / Math.sqrt(Math.pow(endY - startY, 2) + Math.pow(endX - startX, 2));
    return distance <= threshold;
}

function activateBomb() {
    // Destroy all asteroids within a certain radius of the ship
    let bombRadius = 100; // Adjust this value to control the size of the bomb explosion
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let dx = ship.x - asteroids[i].x;
        let dy = ship.y - asteroids[i].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= bombRadius) {
            createExplosion(asteroids[i].x, asteroids[i].y);
            asteroids.splice(i, 1);
            score += 50;
        }
    }
}

function activateFlamethrower() {
    flamethrower.active = true;
    flamethrower.timer = flamethrower.cooldown;
    playFlamethrowerSound();


}

function fireExplosiveRocket() {
    if (explosiveRocket.timer === 0) {
        const angle = ship.rotation * Math.PI / 180;
        const rocket = {
            x: ship.x + Math.sin(angle) * 20,
            y: ship.y - Math.cos(angle) * 20,
            angle: angle,
            speed: explosiveRocket.speed,
            damage: explosiveRocket.damage,
            radius: explosiveRocket.radius,
            distance: 0 // Add distance property to track rocket's travel distance
        };
        explosiveRockets.push(rocket);
        explosiveRocket.timer = explosiveRocket.cooldown;
    }
}

function updateExplosiveRockets() {
    for (let i = explosiveRockets.length - 1; i >= 0; i--) {
        const rocket = explosiveRockets[i];
        rocket.x += Math.sin(rocket.angle) * rocket.speed;
        rocket.y -= Math.cos(rocket.angle) * rocket.speed;
        rocket.distance += rocket.speed;

        let collided = false;

        // Check for collision with asteroids
        for (let j = 0; j < asteroids.length; j++) {
            if (isColliding(asteroids[j], rocket)) {
                collided = true;
                break;
            }
        }

        // Check for collision with aliens if no asteroid collision
        if (!collided) {
            for (let j = 0; j < aliens.length; j++) {
                if (isColliding(rocket, aliens[j])) {
                    collided = true;
                    break;
                }
            }
        }

        // Handle collision or distance-based explosion
        if (collided || rocket.distance >= 200) {
            createExplosion(rocket.x, rocket.y, 0);
            applyExplosiveDamage(rocket);
            explosiveRockets.splice(i, 1);
            continue;
        }

        // Remove the rocket if it goes off the canvas
        if (rocket.x < 0 || rocket.x > canvas.width || rocket.y < 0 || rocket.y > canvas.height) {
            explosiveRockets.splice(i, 1);
        }
    }
}

function drawExplosiveRockets() {
    ctx.fillStyle = 'red'; // Color of the rocket
    ctx.strokeStyle = 'orange'; // Outline color of the rocket
    ctx.lineWidth = 2;

    for (let i = 0; i < explosiveRockets.length; i++) {
        const rocket = explosiveRockets[i];

        // Save the context's state
        ctx.save();

        // Translate the context to the rocket's position
        ctx.translate(rocket.x, rocket.y);

        // Rotate the context to match the rocket's angle
        ctx.rotate(rocket.angle);

        // Draw the rocket as a simple rectangle
        ctx.beginPath();
        ctx.rect(-5, -10, 10, 20); // Adjust the size of the rocket as needed
        ctx.fill();
        ctx.stroke();

        // Restore the context's state
        ctx.restore();
    }
}

// Draw lasers
function drawLasers() {
    ctx.fillStyle = 'red';
    for (let i = 0; i < ship.lasers.length; i++) {
        ctx.fillRect(ship.lasers[i].x - 1, ship.lasers[i].y - 1, ship.laserLevel / 2 + 3, ship.laserLevel / 2 + 3); // Drawing lasers as small squares for better collision detection
    }
}




function firenanoswarm() {
    if (nanoswarm.timer === 0) {
        let missile = {
            x: ship.x,
            y: ship.y,
            target: findNearestAsteroid(),
            speed: 1 + (nanoswarmUpgrades.speed / 2),
            damage: nanoswarm.damage + (nanoswarmUpgrades.damage * 7),
            lifetime: 300 // Missile will expire after 300 frames (~5 seconds at 60 FPS)
        };
        nanoswarm.activeMissiles.push(missile);
        nanoswarm.timer = nanoswarm.cooldown;
    }
}

function updatenanoswarms() {
    for (let i = nanoswarm.activeMissiles.length - 1; i >= 0; i--) {
        let missile = nanoswarm.activeMissiles[i];

        // Decrement the missile's lifetime
        missile.lifetime--;

        // Check if the missile has expired
        if (missile.lifetime <= 0) {
            nanoswarm.activeMissiles.splice(i, 1);
            continue;
        }

        if (missile.target) {
            let dx = missile.target.x - missile.x;
            let dy = missile.target.y - missile.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < missile.target.size) {
                createExplosion(missile.target.x, missile.target.y);
                let index = asteroids.indexOf(missile.target);
                damageReport.nano += 5;
                increaseXP(5 * 20);
                asteroids.splice(index, 1);
                nanoswarm.activeMissiles.splice(i, 1);
                continue;
            }

            let angle = Math.atan2(dy, dx);
            missile.x += missile.speed * Math.cos(angle);
            missile.y += missile.speed * Math.sin(angle);
        } else {
            nanoswarm.activeMissiles.splice(i, 1);
        }
    }
}


function drawnanoswarms() {
    for (let i = 0; i < nanoswarm.activeMissiles.length; i++) {
        let missile = nanoswarm.activeMissiles[i];
        ctx.save();
        ctx.translate(missile.x, missile.y);

        // Calculate the rotation angle based on the missile's direction
        let angle = Math.atan2(missile.dy, missile.dx);
        ctx.rotate(angle);

        // Draw the nano missile image
        ctx.drawImage(droneImages.nanoDrone, -5, -5, 10, 10);
        ctx.restore();
    }
}

function handleLaserAlienCollision(laser, alien) {
    createExplosion(alien.x, alien.y);
    aliens.splice(aliens.indexOf(alien), 1);
    ship.lasers.splice(ship.lasers.indexOf(laser), 1);
    // console.log("removing laser collided in handleLaserAlienCollision");
    increaseXP(300);
    aliensKilled++;
    score += 300; // Adjust the score as needed
}



// Update lasers
function updateLasers() {
    for (let i = 0; i < ship.lasers.length; i++) {
        let laser = ship.lasers[i];

        // Move the laser in the direction of its rotation (keep velocity)
        laser.x += 10 * Math.sin(laser.rotation * Math.PI / 180);
        laser.y -= 10 * Math.cos(laser.rotation * Math.PI / 180);

        // Apply rotation if the laser has a rotation speed (spinning effect)
        if (laser.rotationSpeed) {
            laser.rotation += laser.rotationSpeed; // Adjust the laser's rotation by its rotation speed
        }

        // Remove lasers that are off-screen
        if (laser.x < 0 || laser.x > canvas.width || laser.y < 0 || laser.y > canvas.height) {
            ship.lasers.splice(i, 1); // Remove the laser if it's off-screen
            i--; // Adjust the index after removal to avoid skipping the next laser
        }
    }
}


function applyExplosiveDamage(rocket) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
        const asteroid = asteroids[j];
        const dx = rocket.x - asteroid.x;
        const dy = rocket.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < rocket.radius) {
            const damage = Math.min(rocket.damage, asteroid.hitpoints);
            asteroid.hitpoints -= damage;
            damageReport.explosiveRocket += damage;

            if (asteroid.hitpoints <= 0) {
                processAsteroidDeath(asteroid);
                asteroids.splice(j, 1);
            }
        }
    }
}



function generateFlameParticles(startX, startY, endX, endY, flameWidth) {
    const angle = Math.atan2(endY - startY, endX - startX);
    const particleCount = 50; // Increase particle count for a denser flame effect

    for (let i = 0; i < particleCount; i++) {
        const distance = Math.random() * flamethrower.range;
        const widthAtDistance = flameWidth * (distance / flamethrower.range);
        const offsetX = (Math.random() - 0.5) * widthAtDistance;
        const offsetY = (Math.random() - 0.5) * widthAtDistance;

        const particle = {
            x: startX + Math.cos(angle) * distance + offsetX,
            y: startY + Math.sin(angle) * distance + offsetY,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 1 + 0.5,
            direction: angle + (Math.random() - 0.5) * 0.1,
            life: Math.random() * 20 + 10,
            maxLife: 30,
            color: `hsl(${Math.random() * 60 + 180}, 100%, ${Math.random() * 50 + 50}%)` // Blue to cyan flame particles
        };
        if (particles.length < MAXPARTICLES)
            particles.push(particle);
    }
}
function updateFlamethrower() {
    if (!flamethrower.active) return;

    const flameRange = flamethrower.range;
    const sideFlameOffset = Math.PI / 2;  // Offset for side flames, perpendicular to ship
    const rotationRad = ship.rotation * Math.PI / 180;

    // Calculate positions for left and right side flames
    const leftSideFlameX = ship.x + flameRange * Math.sin(rotationRad - sideFlameOffset);
    const leftSideFlameY = ship.y - flameRange * Math.cos(rotationRad - sideFlameOffset);
    const rightSideFlameX = ship.x + flameRange * Math.sin(rotationRad + sideFlameOffset);
    const rightSideFlameY = ship.y - flameRange * Math.cos(rotationRad + sideFlameOffset);

    // Collision detection for side flames
    function isInSideFlameCone(asteroidX, asteroidY, flameX, flameY) {
        const dx = asteroidX - ship.x;
        const dy = asteroidY - ship.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > flameRange) return false; // Out of range

        // Calculate angle between ship's position and the asteroid
        const angleToAsteroid = Math.atan2(dy, dx);
        const flameAngle = Math.atan2(flameY - ship.y, flameX - ship.x);

        // Check if asteroid is within a narrow angle in the direction of the side flames
        const angleDifference = Math.abs(angleToAsteroid - flameAngle);
        return angleDifference < Math.PI / 10;  // Narrow cone (adjust this value for width)
    }

    // Check for collisions with left and right side flames
    asteroids.forEach(asteroid => {
        const inLeftFlame = isInSideFlameCone(asteroid.x, asteroid.y, leftSideFlameX, leftSideFlameY);
        const inRightFlame = isInSideFlameCone(asteroid.x, asteroid.y, rightSideFlameX, rightSideFlameY);

        if (inLeftFlame || inRightFlame) {
            asteroid.isOnFire = true;
            asteroid.fireTimer = 0;
            asteroid.distanceFromCenter = Math.hypot(asteroid.x - ship.x, asteroid.y - ship.y);

            // Trigger chain lightning
            if (comboFlameChainLightningActive) {
                fireChainLightning(asteroid, chainLightning.bounces);
            }
        }
    });

    const bosses = [miniBossAlien, superbossAlien, megaBossAlien, octoBoss].filter(boss => boss != null);

    bosses.forEach(boss => {
        console.log("checking");

        if (isInSideFlameCone(boss.x, boss.y, leftSideFlameX, leftSideFlameY) ||
            isInSideFlameCone(boss.x, boss.y, rightSideFlameX, rightSideFlameY)) {
            console.log("bossincone");

            setBossOnFire(boss);
        }
    });


    // Draw the side flamethrower effect
    ctx.save();

    // Left flame gradient
    const leftFlameGradient = ctx.createRadialGradient(ship.x, ship.y, 0, leftSideFlameX, leftSideFlameY, flameRange);
    leftFlameGradient.addColorStop(0, 'rgba(255, 165, 0, 0.8)');
    leftFlameGradient.addColorStop(0.6, 'rgba(255, 69, 0, 0.5)');
    leftFlameGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

    ctx.fillStyle = leftFlameGradient;
    ctx.beginPath();
    ctx.moveTo(ship.x, ship.y);
    ctx.lineTo(leftSideFlameX, leftSideFlameY);
    ctx.closePath();
    ctx.fill();

    // Right flame gradient
    const rightFlameGradient = ctx.createRadialGradient(ship.x, ship.y, 0, rightSideFlameX, rightSideFlameY, flameRange);
    rightFlameGradient.addColorStop(0, 'rgba(255, 165, 0, 0.8)');
    rightFlameGradient.addColorStop(0.6, 'rgba(255, 69, 0, 0.5)');
    rightFlameGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');

    ctx.fillStyle = rightFlameGradient;
    ctx.beginPath();
    ctx.moveTo(ship.x, ship.y);
    ctx.lineTo(rightSideFlameX, rightSideFlameY);
    ctx.closePath();
    ctx.fill();

    // Side flame particle effects
    createSideFlameParticles(ship, flameRange, sideFlameOffset);

    ctx.restore();
    flamethrower.active = false;
}

function createSideFlameParticles(ship, flameRange, sideFlameOffset) {
    // Create particles for both left and right flames
    for (let i = 0; i < 10; i++) {
        // Left side particles
        let leftParticleAngle = ship.rotation * Math.PI / 180 - sideFlameOffset + (Math.random() - 0.5) * 0.2;  // Some random offset
        let leftParticleDistance = Math.random() * flameRange;
        let leftParticleX = ship.x + leftParticleDistance * Math.sin(leftParticleAngle);
        let leftParticleY = ship.y - leftParticleDistance * Math.cos(leftParticleAngle);

        ctx.fillStyle = `rgba(255, ${Math.random() * 165}, 0, ${Math.random() * 0.7 + 0.3})`;
        ctx.beginPath();
        ctx.arc(leftParticleX, leftParticleY, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();

        // Right side particles
        let rightParticleAngle = ship.rotation * Math.PI / 180 + sideFlameOffset + (Math.random() - 0.5) * 0.2;  // Some random offset
        let rightParticleDistance = Math.random() * flameRange;
        let rightParticleX = ship.x + rightParticleDistance * Math.sin(rightParticleAngle);
        let rightParticleY = ship.y - rightParticleDistance * Math.cos(rightParticleAngle);

        ctx.fillStyle = `rgba(255, ${Math.random() * 165}, 0, ${Math.random() * 0.7 + 0.3})`;
        ctx.beginPath();
        ctx.arc(rightParticleX, rightParticleY, Math.random() * 3 + 1, 0, Math.PI * 2);
        ctx.fill();
    }
}


function setAsteroidOnFire(asteroid) {
    asteroid.isOnFire = true; // Set the asteroid on fire
    asteroid.fireTimer = 0; // Reset the fire timer
    asteroid.distanceFromCenter = 0; // Track the distance from the center of the flame
    asteroid.color = 'darkred';
}


function updateAsteroidFire() {
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];
        if (asteroid.isOnFire) {
            asteroid.fireTimer++;
            if (asteroid.fireTimer >= 60) { // Damage applied every second (assuming 60 FPS)
                asteroid.hitpoints -= flamethrower.damagePerSecond;
                damageReport.flamethrower += flamethrower.damagePerSecond;
                asteroid.fireTimer = 0; // Reset the fire timer
            }

            asteroid.color = 'darkred'; // Change the asteroid color to dark red

            if (asteroid.hitpoints <= 0) {
                processAsteroidDeath(asteroid);
                asteroids.splice(i, 1);
            }
        }
    }
}




function activateSonicBlast() {
    if (sonicBlast.timer === 0) {
        sonicBlast.waves.push({
            x: ship.x,
            y: ship.y,
            radius: 0,
            color: 'white',
            hitAsteroids: [], // Array to store the IDs of hit asteroids
        });

        if (comboSonicBoomerangActive && boomerang) {

            sonicBlast.waves.push({
                x: boomerang.x,
                y: boomerang.y,
                radius: 0,
                color: 'yellow',
                hitAsteroids: [], // Array to store the IDs of hit asteroids
            });

        }

        sonicBlast.timer = sonicBlast.cooldown;
    }
}

function activateChainLightning() {

    if (chainLightning.timer === 0) {
        let target = findNearestAsteroid();
        if (target) {
            fireChainLightning(target, chainLightning.bounces);
            chainLightning.timer = chainLightning.cooldown;
        }
    }
    playLightningSound();

}

function fireChainLightning(target, bounces, roid = false) {
    if (bounces <= 0 || !target) return;

    let damage = chainLightning.damage;
    let actualDamage = Math.min(damage + damageBooster * pixieBoost, target.hitpoints);
    target.hitpoints -= actualDamage;
    if (roid)
        damageReport.lightningAsteroid += actualDamage;
    else
        damageReport.chainlightning += actualDamage;

    // console.log(comboFlameChainLightningActive);

    if (target.hitpoints <= 0) {
        createExplosion(target.x, target.y, target.hitpoints, target.image);
        let index = asteroids.indexOf(target);
        asteroids.splice(index, 1);
    } else if (comboFlameChainLightningActive) {
        console.log("setting on fire");
        setAsteroidOnFire(target);
    }

    drawChainLightning(ship, target);

    let nextTarget = findNearestAsteroidInRange(target, chainLightning.range);
    if (nextTarget) {
        drawChainLightning(target, nextTarget);
        fireChainLightning(nextTarget, bounces - 1);
    }
}

function drawChainLightning(source, target, branchProbability = 0.5, depth = 0, maxDepth = FRACTALLIGHTNINGDEPTH) {
    if (depth > maxDepth) return;

    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;

    // Add some randomness to the midpoint
    const offsetX = (Math.random() - 0.5) * 30;
    const offsetY = (Math.random() - 0.5) * 30;

    const midPoint = {
        x: midX + offsetX,
        y: midY + offsetY
    };

    // Draw the main branch
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(midPoint.x, midPoint.y);
    ctx.lineTo(target.x, target.y);

    // Set the stroke style
    ctx.strokeStyle = `rgba(0, 191, 255, ${1 - depth * 0.2})`; // Lighter blue color
    ctx.lineWidth = 3 - depth; // Thinner lines for sub-branches
    ctx.stroke();

    // Chance to create a fork
    if (Math.random() < branchProbability) {
        // Create a new branch point
        const branchOffsetX = (Math.random() - 0.5) * 50;
        const branchOffsetY = (Math.random() - 0.5) * 50;
        const newTarget = {
            x: midPoint.x + branchOffsetX,
            y: midPoint.y + branchOffsetY
        };

        // Recursively draw the new branch
        drawChainLightning(midPoint, newTarget, branchProbability * 0.8, depth + 1, maxDepth);
    }

    // Continue the main branch recursively
    if (depth < maxDepth) {
        drawChainLightning(midPoint, target, branchProbability * 0.8, depth + 1, maxDepth);
    }
}


function activateDeathRay() {
    if (deathRay.timer === 0) {
        deathRayActive = true;
        playRandomDeathRaySound();
        deathRay.timer = deathRay.cooldown;
    }
}

function activateFreezeEffect() {
    if (freezeEffect.timer === 0) {
        freezeEffect.active = true;
        playFreezeSound();
        freezeEffect.remainingDuration = freezeEffect.duration;
        freezeEffect.timer = freezeEffect.cooldown;
    }
}


function updateFreezeEffect() {
    if (freezeEffect.timer > 0) {
        freezeEffect.timer--;
    }

    if (freezeEffect.active) {
        freezeEffect.remainingDuration--;

        if (freezeEffect.remainingDuration <= 0) {
            freezeEffect.active = false;
        }
    }
}


function fireAcidBomb() {
    if (acidBomb.timer === 0) {
        let angle = Math.random() * 2 * Math.PI; // Random direction
        let bomb = {
            x: ship.x,
            y: ship.y,
            radius: acidBomb.size,
            duration: acidBomb.duration,
            dx: Math.cos(angle),
            dy: Math.sin(angle),
            distanceTraveled: 0
        };
        acidBomb.activeBombs.push(bomb);
        acidBomb.timer = acidBomb.cooldown;
    }
}

function updateAcidBombs() {
    for (let i = acidBomb.activeBombs.length - 1; i >= 0; i--) {
        let bomb = acidBomb.activeBombs[i];
        bomb.x += bomb.dx * 2;
        bomb.y += bomb.dy * 2;
        bomb.distanceTraveled += 2;

        if (bomb.distanceTraveled >= 150) {
            createAcidExplosion(bomb.x, bomb.y, bomb.radius, bomb.duration);
            acidBomb.activeBombs.splice(i, 1);
        }
    }
}

function createAcidExplosion(x, y, radius, duration, roid = false) {
    createExplosion(x, y, 10); // Create visual explosion effect
    playRandomAcidBombSound();
    let acidArea = {
        x: x,
        y: y,
        radius: radius,
        duration: duration,
        roid: roid
    };
    acidBomb.activeAreas.push(acidArea);
}


function updateAcidAreas() {
    for (let i = acidBomb.activeAreas.length - 1; i >= 0; i--) {
        let area = acidBomb.activeAreas[i];

        // Decrease the duration
        area.duration--;

        // Apply damage to asteroids within the area
        for (let j = asteroids.length - 1; j >= 0; j--) {
            let asteroid = asteroids[j];
            //TODO: error on this line indicating one of these is entering without coordinates
            let dx = asteroid.x - area.x;
            let dy = asteroid.y - area.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < area.radius) {
                let actualDamage = Math.min(acidBomb.damagePerSecond + damageBooster * pixieBoost, asteroid.hitpoints);
                asteroid.hitpoints -= actualDamage;
                if (area.roid)
                    damageReport.acidAsteroid += actualDamage;
                else
                    damageReport.acid += actualDamage;

                if (comboCryoBombActive) {
                    asteroid.speed *= 0.93;
                    asteroid.dx *= 0.93;
                    asteroid.dy *= 0.93;

                }

                if (asteroid.hitpoints <= 0) {
                    processAsteroidDeath(asteroid);
                    asteroids.splice(j, 1);
                }

            }


        }

        // Remove the area if it has expired
        if (area.duration <= 0) {
            acidBomb.activeAreas.splice(i, 1);
        }
    }
}


function drawAcidAreas() {
    ctx.save();
    for (let i = 0; i < acidBomb.activeAreas.length; i++) {
        let area = acidBomb.activeAreas[i];

        // Draw the acid area
        ctx.beginPath();
        ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.fill();

        // Draw acid droplets for visual effect
        for (let j = 0; j < 5; j++) {
            let dropX = area.x + (Math.random() - 0.5) * area.radius * 2;
            let dropY = area.y + (Math.random() - 0.5) * area.radius * 2;
            ctx.beginPath();
            ctx.moveTo(dropX, dropY);
            ctx.lineTo(dropX, dropY + 10);
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
            ctx.stroke();
        }
    }
    ctx.restore();
}


function updateDeathRay() {
    if (deathRayActive) {
        // Define the area of effect for the Death Ray
        let rayLength = deathRay.length;
        let rayWidth = deathRay.width;

        // Calculate the angle for the endpoints to create a fan effect
        let spreadAngle = Math.PI / (15 - deathRayUpgrades.width); // Adjust the spread angle for a wider fan effect

        let endX = ship.x + rayLength * Math.sin(ship.rotation * Math.PI / 180);
        let endY = ship.y - rayLength * Math.cos(ship.rotation * Math.PI / 180);

        let leftEndX = ship.x + rayLength * Math.sin((ship.rotation * Math.PI / 180) - spreadAngle);
        let leftEndY = ship.y - rayLength * Math.cos((ship.rotation * Math.PI / 180) - spreadAngle);

        let rightEndX = ship.x + rayLength * Math.sin((ship.rotation * Math.PI / 180) + spreadAngle);
        let rightEndY = ship.y - rayLength * Math.cos((ship.rotation * Math.PI / 180) + spreadAngle);

        // Check for collisions with asteroids
        for (let i = asteroids.length - 1; i >= 0; i--) {
            let asteroid = asteroids[i];
            let dx = asteroid.x - ship.x;
            let dy = asteroid.y - ship.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < rayLength && Math.abs(dx * Math.cos(ship.rotation * Math.PI / 180) + dy * Math.sin(ship.rotation * Math.PI / 180)) < rayWidth / 2) {
                // createExplosion(asteroid.x, asteroid.y, 1, asteroid.image);
                processAsteroidDeath(asteroid);
                damageReport.deathRay += asteroid.hitpoints;
                increaseXP(asteroid.hitpoints * 20);
                asteroids.splice(i, 1);

            }
        }

        for (let j = aliens.length - 1; j >= 0; j--) {
            const alien = aliens[j];
            let dx = alien.x - ship.x;
            let dy = alien.y - ship.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < rayLength && Math.abs(dx * Math.cos(ship.rotation * Math.PI / 180) + dy * Math.sin(ship.rotation * Math.PI / 180)) < rayWidth / 2) {
                createExplosion(alien.x, alien.y, 12);
                aliens.splice(j, 1);
                damageReport.deathRay += 20;
                increaseXP(200);

            }
        }


        // Draw the Death Ray as a triangle
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y);
        ctx.lineTo(leftEndX, leftEndY);
        ctx.lineTo(rightEndX, rightEndY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        deathRayActive = false;
    }

    if (deathRay.timer > 0) {
        deathRay.timer--;
    }
}

// Function to buy drones
function buyDrone() {
    // if (coins >= droneCost) {
    //   coins -= droneCost;
    let drone = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 10,
        damage: 1,
        speed: 0.5 * droneUpgrades.speed,
        direction: Math.random() * Math.PI * 2,
        lasers: [],
        image: droneImages.regularDrone,
        laserSpeed: 2 * droneUpgrades.laserSpeed,
        laserInterval: 70 / droneUpgrades.laserInterval, // Fire lasers more frequently as the interval increases
        laserTimer: 0
    };
    //MAX 5 drones
    if (drones.length < 6) {
        drones.push(drone);
        playDeployDroneSound();

    }
    // updateCoinsDisplay();
    // }
}

function buyBomberDrone() {
    let bomberDrone = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 12,
        speed: 0.5 * bomberDroneUpgrades.speed,
        direction: Math.random() * Math.PI * 2,
        image: droneImages.bomberDrone,
        bombs: [],
        bombInterval: 120,
        bombTimer: 0
    };
    bomberDrones.push(bomberDrone);
    playDeployDroneSound();

}


function buyTurret() {
    if (!turret.bought) {
        // coins -= 1000;
        turret.bought = true;
        turret.x = ship.x;
        turret.y = ship.y;
        // updateCoinsDisplay();
    }
}


let doubleTurret = false;
let tripleTurret = false;




function updateTurretLasers() {
    for (let i = turret.lasers.length - 1; i >= 0; i--) {
        let laser = turret.lasers[i];
        laser.x += Math.cos(laser.rotation) * 2;
        laser.y += Math.sin(laser.rotation) * 2;
        if (laser.x < 0 || laser.x > canvas.width || laser.y < 0 || laser.y > canvas.height) {
            turret.lasers.splice(i, 1);
        }
    }
}

function drawTurret() {
    ctx.save();
    ctx.translate(turret.x, turret.y);

    // Draw the turret as a small cyan circle
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'cyan';
    ctx.fill();

    ctx.restore();
}
function updateTurret() {
    let nearestAsteroid = findNearestAsteroidInRange();
    if (nearestAsteroid) {
        let dx = nearestAsteroid.x - turret.x;
        let dy = nearestAsteroid.y - turret.y;
        let angle = Math.atan2(dy, dx);
        turret.rotation = angle;

        turret.fireTimer++;

        if (turret.fireTimer >= turret.fireInterval) {
            turret.fireTimer = 0;

            // Calculate the laser starting positions based on the turret's rotation
            let laserX = turret.x + Math.cos(turret.rotation) * turret.size;
            let laserY = turret.y + Math.sin(turret.rotation) * turret.size;

            let laser = {
                x: laserX,
                y: laserY,
                rotation: turret.rotation,
                size: 2,
                color: 'cyan'
            };
            turret.lasers.push(laser);

            if (doubleTurret) {
                let offset = Math.PI / 12; // 15 degrees offset
                let laser1 = {
                    x: laserX + Math.cos(turret.rotation + offset) * turret.size,
                    y: laserY + Math.sin(turret.rotation + offset) * turret.size,
                    rotation: turret.rotation + offset,
                    size: 2,
                    color: 'cyan'
                };
                turret.lasers.push(laser1);

                let laser2 = {
                    x: laserX + Math.cos(turret.rotation - offset) * turret.size,
                    y: laserY + Math.sin(turret.rotation - offset) * turret.size,
                    rotation: turret.rotation - offset,
                    size: 2,
                    color: 'cyan'
                };
                turret.lasers.push(laser2);
            }

            if (tripleTurret) {
                let offset = Math.PI / 8; // 22.5 degrees offset
                let laser1 = {
                    x: laserX + Math.cos(turret.rotation + offset) * turret.size,
                    y: laserY + Math.sin(turret.rotation + offset) * turret.size,
                    rotation: turret.rotation + offset,
                    size: 2,
                    color: 'cyan'
                };
                turret.lasers.push(laser1);

                let laser2 = {
                    x: laserX + Math.cos(turret.rotation - offset) * turret.size,
                    y: laserY + Math.sin(turret.rotation - offset) * turret.size,
                    rotation: turret.rotation - offset,
                    size: 2,
                    color: 'cyan'
                };
                turret.lasers.push(laser2);

                let laser3 = {
                    x: ship.x + Math.cos(turret.rotation + offset) * turret.size,
                    y: ship.y + Math.sin(turret.rotation + offset) * turret.size,
                    rotation: turret.rotation + offset,
                    size: 2,
                    color: 'cyan'
                };
                turret.lasers.push(laser3);

            }
        }
    }

    turret.x = ship.x;
    turret.y = ship.y;
}

function drawTurretLasers() {
    for (let i = 0; i < turret.lasers.length; i++) {
        let laser = turret.lasers[i];
        ctx.fillStyle = laser.color;
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, laser.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function updateBoomerang() {
    if (!boomerang.active) return;

    boomerang.x += boomerang.dx * boomerang.speed;
    boomerang.y += boomerang.dy * boomerang.speed;

    // Calculate the rotation angle based on the boomerang's velocity
    boomerang.angle = Math.atan2(boomerang.dy, boomerang.dx);

    // Bounce off the edges of the screen
    if (boomerang.x < 0 || boomerang.x > canvas.width) {
        boomerang.dx = -boomerang.dx;
    }
    if (boomerang.y < 0 || boomerang.y > canvas.height) {
        boomerang.dy = -boomerang.dy;
    }

    // Check collision with asteroids
    for (let i = 0; i < asteroids.length; i++) {
        let asteroid = asteroids[i];
        if (isColliding(boomerang, asteroid)) {
            let actualDamage = Math.min(boomerang.damage + damageBooster * pixieBoost, asteroid.hitpoints);
            asteroid.hitpoints -= actualDamage;
            damageReport.boomerang += actualDamage;


            if (asteroid.hitpoints <= 0) {
                processAsteroidDeath(asteroid);
                asteroids.splice(i, 1);
                score += actualDamage * 50;
                coins += actualDamage * 20;
                increaseXP(actualDamage * 20);
            }
        }
    }

    checkAlienDamage(boomerang);
    // commenting out because appears to be a bug in damage caculation for boomerang
    // damageReport.boomerang += checkAlienDamage(boomerang);
}

function triggerSonicBlastEffect(x, y, range) {
    let wave = {
        x: x,
        y: y,
        radius: 0,
        hitAsteroids: [] // Array to store the IDs of hit asteroids
    };
    sonicBlast.waves.push(wave);

    // Update sonic blast waves to expand and deal damage
    for (let i = sonicBlast.waves.length - 1; i >= 0; i--) {
        let wave = sonicBlast.waves[i];
        wave.radius += sonicBlast.speed;

        for (let j = asteroids.length - 1; j >= 0; j--) {
            let asteroid = asteroids[j];
            let dx = asteroid.x - wave.x;
            let dy = asteroid.y - wave.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < wave.radius && !wave.hitAsteroids.includes(asteroid)) {
                let actualDamage = Math.min(sonicBlast.damage + damageBooster * pixieBoost, asteroid.hitpoints);
                asteroid.hitpoints -= actualDamage;
                damageReport.sonicBlast += actualDamage;
                wave.hitAsteroids.push(asteroid);

                if (asteroid.hitpoints <= 0) {
                    processAsteroidDeath(asteroid);
                    asteroids.splice(j, 1);
                    score += actualDamage * 50;
                    coins += actualDamage * 20;
                    increaseXP(actualDamage * 20);
                }
            }
        }

        if (wave.radius > range) {
            sonicBlast.waves.splice(i, 1);
        }
    }
}

const boomerangImage = new Image();
boomerangImage.src = 'icons/Boomeranggold.png';

function drawBoomerang() {
    if (!boomerang.active) return;

    // ctx.fillStyle = 'orange';
    // ctx.beginPath();
    // ctx.arc(boomerang.x, boomerang.y, boomerang.size, 0, Math.PI * 2);
    // ctx.closePath();
    // ctx.fill();

    ctx.save();
    ctx.translate(boomerang.x, boomerang.y);
    ctx.rotate(boomerang.angle);
    ctx.drawImage(boomerangImage, -boomerang.size / 2, -boomerang.size / 2, boomerang.size * 3, boomerang.size * 3);
    ctx.restore();

}

function activateBoomerang() {
    boomerang.active = true;
    boomerang.x = canvas.width / 2;
    boomerang.y = canvas.height / 2;
    boomerang.dx = (Math.random() * 2.2 - 1) * boomerang.speed;
    boomerang.dy = (Math.random() * 2.2 - 1) * boomerang.speed;
}


function shootLasers() {
    // if (!toggleMusicOff) backgroundMusic.play(); // Resume the background music (if hasn't started)

    // Use the custom shoot function if it exists, otherwise use default shooting
    if (ships[currentShip] && typeof ships[currentShip].shoot === 'function') {
        ships[currentShip].shoot(); // Call the custom shoot function
    } else {
        const laserSize = ship.laserLevel + 1; // Laser size depends on the ship's laser level

        // Convert rotation to radians
        const rotationRad = ship.rotation * Math.PI / 180;

        // Calculate the position at the front of the ship
        const frontX = ship.x + Math.sin(rotationRad) * ship.size / 2;
        const frontY = ship.y - Math.cos(rotationRad) * ship.size / 2;


        // const laserX = ship.x + 10 * Math.sin(ship.rotation * Math.PI / 180);
        // const laserY = ship.y - 10 * Math.cos(ship.rotation * Math.PI / 180);

        // Calculate the laser's starting position
        const laserX = frontX + (laserSize / 2);
        const laserY = frontY + (laserSize / 2);

        // const laserX = ship.x + Math.cos(ship.rotation);
        // const laserY = ship.y + Math.sin(ship.rotation);


        // Push the new laser to the array, with its position, size, and rotation

        if (laserSize > 5) {
            ship.lasers.push({
                x: laserX - laserSize / 1.3,
                y: laserY - laserSize / 1.3,
                rotation: ship.rotation,
                size: laserSize
            });

        } else {

            ship.lasers.push({
                x: laserX,
                y: laserY,
                rotation: ship.rotation,
                size: laserSize
            });
        }

        // Reset the laser cooldown timer
        ship.laserTimer = ship.laserCooldown;
    }

    playRandomShotSound(); // Play shooting sound
}




function findNearestAsteroid() {
    let nearestAsteroid = null;
    let nearestDistance = Infinity;
    for (let i = 0; i < asteroids.length; i++) {
        let dx = ship.x - asteroids[i].x;
        let dy = ship.y - asteroids[i].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < nearestDistance) {
            nearestAsteroid = asteroids[i];
            nearestDistance = distance;
        }
    }
    return nearestAsteroid;
}


function findNearestAsteroidInRange() {
    let nearestAsteroid = null;
    let nearestDistance = Infinity;
    for (let i = 0; i < asteroids.length; i++) {
        let dx = turret.x - asteroids[i].x;
        let dy = turret.y - asteroids[i].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < nearestDistance && distance <= turret.range) {
            nearestAsteroid = asteroids[i];
            nearestDistance = distance;
        }
    }
    return nearestAsteroid;
}



let mostRecentUpgradeApplied = false;

function selectUpgrade(index) {
    const selectedUpgrade = window.levelUpgrades[index - 1];
    console.log(selectedUpgrade);
    if (selectedUpgrade && selectedUpgrade.name) {
        applyUpgrades([selectedUpgrade.name]); // Pass the upgrade name as an array
        unclaimedLevelUps--;
        document.getElementById('leveluptitle').innerHTML = 'Claim ' + unclaimedLevelUps + ' upgrades';

        // drawLives();


    }

    // Close the modal

    if (unclaimedLevelUps > 0 && waitAndClaimMode) {

        let upgradesToRetrieve = fourthUpgradeUnlocked ? 4 : 3;

        document.getElementById('upgradeOptions').innerHTML = '';
        const upgrades = getRandomUpgrades(upgradesToRetrieve);

        // Display the level-up modal
        // const levelUpModal = document.getElementById('levelUpModal');
        const upgradeOptionsHTML = createUpgradeOptionsHTML(upgrades);
        document.getElementById('upgradeOptions').innerHTML = upgradeOptionsHTML;

        // Show the modal
        // levelUpModal.style.display = 'block';

        // Store upgrades in a global variable for later use
        window.levelUpgrades = upgrades;

    } else {

        document.getElementById('levelUpModal').style.display = 'none';

        // Resume the game
        resumeGame();
    }


}

function updateSonicBlast() {
    for (let i = sonicBlast.waves.length - 1; i >= 0; i--) {
        let wave = sonicBlast.waves[i];
        wave.radius += sonicBlast.speed;

        for (let j = asteroids.length - 1; j >= 0; j--) {
            //TODO: this one also is erroring, probalby because of the splicing.
            let asteroid = asteroids[j];
            let dx = asteroid.x - wave.x;
            let dy = asteroid.y - wave.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < wave.radius && !wave.hitAsteroids.includes(asteroid)) {
                let actualDamage = Math.min(sonicBlast.damage + damageBooster * pixieBoost, asteroid.hitpoints);
                asteroid.hitpoints -= actualDamage;
                damageReport.sonicBlast += actualDamage;
                wave.hitAsteroids.push(asteroid);

                if (asteroid.hitpoints <= 0) {
                    processAsteroidDeath(asteroid);
                    asteroids.splice(j, 1);
                    score += actualDamage * 50;
                    coins += actualDamage * 20;
                    increaseXP(actualDamage * 20);
                }
            }
        }

        if (wave.radius > sonicBlast.range) {
            sonicBlast.waves.splice(i, 1);
        }
    }
}

function upgradeDrone(attribute) {
    const cost = 200;
    // if (coins >= cost) {
    //   coins -= cost;
    droneUpgrades[attribute]++;

    // Update existing drones with new upgrade levels
    drones.forEach(drone => {
        switch (attribute) {
            case 'speed':
                drone.speed = 2 * droneUpgrades.speed;
                break;
            case 'laserSpeed':
                drone.laserSpeed = 5 * droneUpgrades.laserSpeed;
                break;
            case 'laserInterval':
                drone.laserInterval = 120 / droneUpgrades.laserInterval;
                break;
            case 'damageLevel':
                drone.damageLevel += 1;
                break;

        }
    });
    // updateCoinsDisplay();
    // updateMarketplaceDisplay();

}

function applyGravity(object) {
    const dx = planet.x - object.x;
    const dy = planet.y - object.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    let force = gravityStrength / (distance * distance); // Inverse-square law
    if (force > 0.9) {
        // console.log(force);
        force = 0.9;
    }

    object.dx += force * dx / distance;
    object.dy += force * dy / distance;
}

// Update all drones
function updateDrones() {
    drones.forEach(drone => {
        const dx = ship.x - drone.x;
        const dy = ship.y - drone.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 250) {
            const angleToShip = Math.atan2(dy, dx);
            // Add randomization to the direction, +/- 10 degrees
            const randomAngle = (Math.random() - 0.5) * (20 * Math.PI / 180);
            drone.direction = angleToShip + randomAngle;
        }

        drone.x += Math.cos(drone.direction) * drone.speed;
        drone.y += Math.sin(drone.direction) * drone.speed;

        if (drone.x < 0) drone.x = canvas.width;
        else if (drone.x > canvas.width) drone.x = 0;
        if (drone.y < 0) drone.y = canvas.height;
        else if (drone.y > canvas.height) drone.y = 0;

        for (let i = drone.lasers.length - 1; i >= 0; i--) {
            let laser = drone.lasers[i];
            laser.x += Math.cos(laser.direction) * drone.laserSpeed;
            laser.y += Math.sin(laser.direction) * drone.laserSpeed;

            if (laser.x < 0 || laser.x > canvas.width || laser.y < 0 || laser.y > canvas.height) {
                drone.lasers.splice(i, 1);
            }
        }

        drone.laserTimer++;
        if (drone.laserTimer >= drone.laserInterval) {
            drone.laserTimer = 0;
            let laser = {
                x: drone.x,
                y: drone.y,
                direction: Math.random() * Math.PI * 2,
                size: 2
            };
            drone.lasers.push(laser);
        }

        drone.lasers.forEach(laser => {
            for (let j = asteroids.length - 1; j >= 0; j--) {
                let asteroid = asteroids[j];
                if (isColliding(laser, asteroid)) {
                    let actualDamage = Math.min(drone.damage + damageBooster * pixieBoost, asteroid.hitpoints);
                    asteroid.hitpoints -= actualDamage;
                    damageReport.drones += actualDamage;

                    console.log(comboExplosiveDroneActive);

                    if (comboExplosiveDroneActive) {
                        console.log("explodronedamage");
                        createExplosion(asteroid.x, asteroid.y, 0);
                        applyExplosiveDamageToNearbyAsteroids(asteroid);
                    }

                    if (asteroid.hitpoints <= 0) {
                        processAsteroidDeath(asteroid);
                        asteroids.splice(j, 1);
                        score += actualDamage * 50;
                        coins += actualDamage * 20;
                        increaseXP(actualDamage * 20);
                    }
                }
            }
        });

        checkLaserCollisions(drone.lasers, false);
    });
}

let explodingDrone = {
    damage: 10,
    explosionRadius: 150
}

function applyExplosiveDamageToNearbyAsteroids(explodedAsteroid) {
    for (let j = asteroids.length - 1; j >= 0; j--) {
        const asteroid = asteroids[j];
        const dx = explodedAsteroid.x - asteroid.x;
        const dy = explodedAsteroid.y - asteroid.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < explodingDrone.explosionRadius) {
            const damage = Math.min(explodingDrone.damage, asteroid.hitpoints);
            asteroid.hitpoints -= damage;
            damageReport.drones += damage;

            if (asteroid.hitpoints <= 0) {
                processAsteroidDeath(asteroid);
                asteroids.splice(j, 1);
            }
        }
    }
}


function updateBomberDrones() {
    bomberDrones.forEach(drone => {
        const dx = ship.x - drone.x;
        const dy = ship.y - drone.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 200) {
            const angleToShip = Math.atan2(dy, dx);
            const deviationAngle = (Math.random() - 0.5) * (Math.PI / 3);
            drone.direction = angleToShip + deviationAngle;

        }

        drone.x += Math.cos(drone.direction) * drone.speed;
        drone.y += Math.sin(drone.direction) * drone.speed;

        if (drone.x < 0) drone.x = canvas.width;
        else if (drone.x > canvas.width) drone.x = 0;
        if (drone.y < 0) drone.y = canvas.height;
        else if (drone.y > canvas.height) drone.y = 0;

        drone.bombTimer++;
        if (drone.bombTimer >= drone.bombInterval) {
            drone.bombTimer = 0;
            let bomb = {
                x: drone.x,
                y: drone.y,
                radius: bomberDroneUpgrades.bombRadius,
                damage: bomberDroneUpgrades.bombDamage
            };
            drone.bombs.push(bomb);
            playRandomBombLaySound();
        }

        for (let i = drone.bombs.length - 1; i >= 0; i--) {
            let bomb = drone.bombs[i];
            for (let j = asteroids.length - 1; j >= 0; j--) {
                let asteroid = asteroids[j];
                let dx = bomb.x - asteroid.x;
                let dy = bomb.y - asteroid.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < bomb.radius + asteroid.size) {
                    let actualDamage = Math.min(bomb.damage + damageBooster * pixieBoost, asteroid.hitpoints);
                    asteroid.hitpoints -= actualDamage;
                    damageReport.bomberDrones += actualDamage;

                    if (asteroid.hitpoints <= 0) {
                        asteroids.splice(j, 1);
                        processAsteroidDeath(asteroid);
                        score += 50;
                        increaseXP(20);
                    }
                    createExplosion(bomb.x, bomb.y, 1);
                    drone.bombs.splice(i, 1);
                    break;
                }
            }
            if (bomb.x < 0 || bomb.x > canvas.width || bomb.y < 0 || bomb.y > canvas.height) {
                drone.bombs.splice(i, 1);
            }
        }
    });
}

function drawDrones() {
    drones.forEach(drone => {

        ctx.save();
        ctx.translate(drone.x, drone.y);
        ctx.rotate(drone.direction);
        ctx.drawImage(drone.image, -drone.size, -drone.size, drone.size * 2, drone.size * 2);
        ctx.restore();

        // ctx.save();
        // ctx.translate(drone.x, drone.y);
        // ctx.rotate(drone.direction);
        // ctx.beginPath();
        // ctx.moveTo(0, -drone.size);
        // ctx.lineTo(-drone.size, drone.size);
        // ctx.lineTo(drone.size, drone.size);
        // ctx.closePath();
        // ctx.fillStyle = 'cyan';
        // ctx.fill();
        // ctx.restore();

        ctx.fillStyle = 'cyan';
        for (let i = 0; i < drone.lasers.length; i++) {
            let laser = drone.lasers[i];
            ctx.fillRect(laser.x - 1, laser.y - 1, 2, 2);
        }
    });
}

function drawBomberDrones() {
    bomberDrones.forEach(drone => {

        ctx.save();
        ctx.translate(drone.x, drone.y);
        ctx.rotate(drone.direction);
        ctx.drawImage(drone.image, -drone.size, -drone.size, drone.size * 2, drone.size * 2);
        ctx.restore();

        // ctx.save();
        // ctx.translate(drone.x, drone.y);
        // ctx.rotate(drone.direction);
        // ctx.beginPath();
        // ctx.moveTo(0, -drone.size);
        // ctx.lineTo(-drone.size, drone.size);
        // ctx.lineTo(drone.size, drone.size);
        // ctx.closePath();
        // ctx.fillStyle = 'magenta';
        // ctx.fill();
        // ctx.restore();

        // Draw bombs
        ctx.fillStyle = 'orange';
        drone.bombs.forEach(bomb => {
            ctx.beginPath();
            ctx.arc(bomb.x, bomb.y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    });
}

function canActivateComboWeapons() {
    const flamethrowerMaxed = getUpgradeCount('flamethrower') >= MAX_UPGRADE_COUNT;
    const chainLightningMaxed = getUpgradeCount('chainlightning') >= MAX_UPGRADE_COUNT;
    const explosiveLaserMaxed = getUpgradeCount('explosive') >= MAX_UPGRADE_COUNT;
    const droneMaxed = getUpgradeCount('drone') >= MAX_UPGRADE_COUNT;
    const boomerangMaxed = getUpgradeCount('boomerang') >= MAX_UPGRADE_COUNT;
    const sonicBlastMaxed = getUpgradeCount('sonic') >= MAX_UPGRADE_COUNT;
    const acidBombMaxed = getUpgradeCount('acid') >= MAX_UPGRADE_COUNT;
    const freezeRayMaxed = getUpgradeCount('freeze') >= MAX_UPGRADE_COUNT;
    const gravityWellMaxed = getUpgradeCount('gravitywell') >= MAX_UPGRADE_COUNT;

    return {
        flameChainLightning: flamethrowerMaxed && chainLightningMaxed,
        explosiveDrone: explosiveLaserMaxed && droneMaxed,
        sonicBoomerang: boomerangMaxed && sonicBlastMaxed,
        cryoBomb: acidBombMaxed && freezeRayMaxed,
        gravityBlast: gravityWellMaxed && sonicBlastMaxed,

    };
}

let comboFlameChainLightningActive = false;
let comboExplosiveDroneActive = false;
let comboSonicBoomerangActive = false;
let comboCryoBombActive = false;
let comboGravityBlastActive = false;

function activateComboFlameChainLightning() {
    if (canActivateComboWeapons().flameChainLightning) {
        console.log("comboFlameChainLightningActive");
        activateWeaponClass("chainofflame");
        comboFlameChainLightningActive = true;

    }
}

function activateComboExplosiveDrone() {
    console.log("activateComboExplosiveDrone");

    if (canActivateComboWeapons().explosiveDrone) {
        activateWeaponClass("explodrone");
        comboExplosiveDroneActive = true;
        console.log("activateComboExplosiveDrone");

    }
}

function activateComboSonicBoomerang() {
    if (canActivateComboWeapons().sonicBoomerang) {
        activateWeaponClass("sonicboom");
        comboSonicBoomerangActive = true;
    }
}

function activateComboCryoBomb() {
    if (canActivateComboWeapons().cryoBomb) {
        activateWeaponClass("cryobomb");
        comboCryoBombActive = true;
    }
}

function activateComboGravityBlast() {
    if (canActivateComboWeapons().gravityBlast) {
        activateWeaponClass("gravityblast");
        comboGravityBlastActive = true;
    }
}


function checkAlienDamage(weapon) {

    let actualDamage = 0;

    for (let j = swarmingAliens.length - 1; j >= 0; j--) {
        const swarmingalien = swarmingAliens[j];
        if (isColliding(weapon, swarmingalien)) {
            swarmingAliens.splice(j, 1);
            increaseXP(40);
            score += 40;
            actualDamage += 1;
            createExplosion(swarmingalien.x, swarmingalien.y, 1);
            break;
        }


    }

    for (let j = aliens.length - 1; j >= 0; j--) {
        const alien = aliens[j];
        actualDamage += 1;
        if (isColliding(weapon, alien)) {
            createExplosion(alien.x, alien.y);
            aliens.splice(aliens.indexOf(alien), 1);
            increaseXP(300);
            aliensKilled++;
            score += 300; // Adjust the score as needed
            break;
        }
    }

    // if (alien && isColliding(weapon, alien)) {

    //     actualDamage = Math.min(weapon.damage + damageBooster, alien.hitpoints); // Ensure we don't overkill the asteroid
    //     alien.hitpoints -= actualDamage;

    //     createExplosion(alien.x, alien.y);

    //     if (alien.hitpoints <= 0) {
    //         createExplosion(alien.x, alien.y, 15);
    //         alien = null; // Destroy alien
    //         aliensKilled++;
    //         increaseXP(30 * 20);
    //         score += 1000;
    //     }
    // }


    if (superbossAlien && isColliding(weapon, superbossAlien)) {

        actualDamage = Math.min(weapon.damage + damageBooster * pixieBoost, superbossAlien.hitpoints); // Ensure we don't overkill the asteroid
        superbossAlien.hitpoints -= actualDamage;
        createExplosion(superbossAlien.x, superbossAlien.y);
        playBossTakeDamageSound();

        if (superbossAlien.hitpoints <= 0) {
            createExplosion(superbossAlien.x, superbossAlien.y, 50);
            createBossExplosion(superbossAlien.x, superbossAlien.y, 150);
            superbossAlien = null; // Destroy alien
            pauseAllMusic();
            if (backgroundMusic2)
                backgroundMusic2.play();
            playBossDieSound();

            if (crazyGamesMode && window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.game) {
                try {
                    window.CrazyGames.SDK.game.happytime();

                } catch (error) {
                    console.log(error);
                }

            }

            aliensKilled++;
            const xpBar = document.getElementById('xpBar');
            xpBar.style.backgroundColor = 'green';

            // Achievements.alien_megaboss_killed.reached = true;
            increaseXP(30 * 20);
            score += 100000;
        }
    }


    if (megaBossAlien && isColliding(weapon, megaBossAlien)) {

        actualDamage = Math.min(weapon.damage + damageBooster * pixieBoost, megaBossAlien.hitpoints); // Ensure we don't overkill the asteroid
        megaBossAlien.hitpoints -= actualDamage;

        createExplosion(megaBossAlien.x, megaBossAlien.y);
        playBossTakeDamageSound();

        if (megaBossAlien.hitpoints <= 0) {
            createExplosion(megaBossAlien.x, megaBossAlien.y, 50);
            megaBossAlien = null; // Destroy alien
            createBossExplosion(megaBossAlien.x, megaBossAlien.y, 250);

            aliensKilled++;
            // Achievements.alien_megaboss_killed.reached = true;
            playBossDieSound();
            pauseAllMusic();
            backgroundMusic2.play();


            increaseXP(30 * 20);
            score += 100000;
            if (crazyGamesMode && window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.game) {
                try {
                    window.CrazyGames.SDK.game.happytime();

                } catch (error) {
                    console.log(error);
                }

            }
            const xpBar = document.getElementById('xpBar');
            xpBar.style.backgroundColor = 'green';


        }
    }

    return actualDamage;
}


// Function to handle laser collisions
function checkLaserCollisions(lasers, isShip) {
    for (let i = lasers.length - 1; i >= 0; i--) {
        let laser = lasers[i];


        for (let j = swarmingAliens.length - 1; j >= 0; j--) {
            const swarmingalien = swarmingAliens[j];
            if (isColliding(laser, swarmingalien)) {
                swarmingAliens.splice(j, 1);
                increaseXP(40);
                score += 40;
                createExplosion(swarmingalien.x, swarmingalien.y, 1);
                lasers.splice(i, 1); // Remove laser
                // console.log("removing laser collided with swarming alien");

                break;
            }


        }


        for (let j = aliens.length - 1; j >= 0; j--) {
            const alien = aliens[j];
            if (isColliding(laser, alien)) {
                handleLaserAlienCollision(laser, alien);
                // console.log("removing laser collided with  alien");
                break;
            }
        }

        if (miniBossAlien && isColliding(laser, miniBossAlien)) {

            let damage = isShip ? ship.laserLevel : 1; // Damage based on laserLevel for ship lasers
            let actualDamage = Math.min(damage + damageBooster * pixieBoost, miniBossAlien.hitpoints); // Ensure we don't overkill the asteroid
            miniBossAlien.hitpoints -= actualDamage;

            createExplosion(miniBossAlien.x, miniBossAlien.y);

            if (miniBossAlien.hitpoints <= 0) {
                createExplosion(miniBossAlien.x, miniBossAlien.y, 15);
                miniBossAlien = null; // Destroy alien
                aliensKilled++;
                increaseXP(30 * 20);
                score += 1000;
            }
            lasers.splice(i, 1); // Remove laser
            // console.log("removing laser collided with basic boss alien");

            break;
        }


        if (superbossAlien && isColliding(superbossAlien, laser)) {

            let damage = isShip ? ship.laserLevel : 1; // Damage based on laserLevel for ship lasers
            let actualDamage = Math.min(damage + damageBooster * pixieBoost, superbossAlien.hitpoints); // Ensure we don't overkill the asteroid
            superbossAlien.hitpoints -= actualDamage;

            createExplosion(superbossAlien.x, superbossAlien.y);

            if (superbossAlien.hitpoints <= 0) {
                createExplosion(superbossAlien.x, superbossAlien.y, 50);
                createBossExplosion(superbossAlien.x, superbossAlien.y, 150);

                superbossAlien = null; // Destroy alien
                pauseAllMusic();
                backgroundMusic2.play();

                aliensKilled++;
                // addAchievement('alien_supermegaboss_killed');
                increaseXP(30 * 20);
                score += 100000;
                if (crazyGamesMode && window.CrazyGames && window.CrazyGames.SDK && window.CrazyGames.SDK.game) {
                    try {
                        window.CrazyGames.SDK.game.happytime();

                    } catch (error) {
                        console.log(error);
                    }

                }
                const xpBar = document.getElementById('xpBar');
                xpBar.style.backgroundColor = 'green';



            }
            lasers.splice(i, 1); // Remove laser
            // console.log("removing laser collided with super boss alien");

            break;
        }


        if (octoBoss && checkLaserOctoBossCollision(laser)) {
            let damage = isShip ? ship.laserLevel : 1;
            damageOctoBoss(damage + damageBooster * pixieBoost, laser.x, laser.y);
            createExplosion(laser.x, laser.y);
            if (octoBoss.hitpoints <= 0) {
                createExplosion(octoBoss.x, octoBoss.y, 50, 40);
                createBossExplosion(octoBoss.x, octoBoss.y, 150);
                octoBoss = null; // Destroy alien
                aliensKilled++;
                // addAchievement('alien_octopus_killed');
                // Achievements.alien_octopus_killed.reached = true;
                increaseXP(30 * 40);
                score += 200000;
            }

            lasers.splice(i, 1);
            console.log("removing laser collided with OctoBoss");
            continue; // Move to next laser
        }


        if (megaBossAlien && isColliding(megaBossAlien, laser)) {

            let damage = isShip ? ship.laserLevel : 1; // Damage based on laserLevel for ship lasers
            let actualDamage = Math.min(damage + damageBooster * pixieBoost, megaBossAlien.hitpoints); // Ensure we don't overkill the asteroid
            megaBossAlien.hitpoints -= actualDamage;

            createExplosion(megaBossAlien.x, megaBossAlien.y);

            if (megaBossAlien.hitpoints <= 0) {
                createExplosion(megaBossAlien.x, megaBossAlien.y, 50);
                createBossExplosion(megaBossAlien.x, megaBossAlien.y, 250);
                megaBossAlien = null; // Destroy alien
                pauseAllMusic();
                playBossDieSound();
                backgroundMusic2.play();
                aliensKilled++;
                // addAchievement('alien_supermegaboss_killed');

                // Achievements.alien_supermegaboss_killed.reached = true;
                increaseXP(30 * 20);
                score += 100000;
            }
            lasers.splice(i, 1); // Remove laser
            // console.log("removing laser collided with mega boss alien");

            break;
        }

        for (let j = asteroids.length - 1; j >= 0; j--) {
            let asteroid = asteroids[j];
            if (isColliding(laser, asteroid)) {
                let damage = isShip ? ship.laserLevel : 1; // Damage based on laserLevel for ship lasers

                let actualDamage = Math.min(damage + damageBooster * pixieBoost, asteroid.hitpoints); // Ensure we don't overkill the asteroid
                asteroid.hitpoints -= actualDamage;

                if (asteroid.hitpoints <= 0) {
                    //shrapnel
                    if (asteroid.isLarge) {
                        createSmallerAsteroids(asteroid.x, asteroid.y, asteroid.size, asteroid.speed, 1); // Split into smaller asteroids
                    }
                    asteroids.splice(j, 1);

                    processAsteroidDeath(asteroid);


                } else {
                    // Lighten the color slightly
                    // let colorValue = Math.max(40, 30 + (asteroid.hitpoints * 3)); // Adjust color value
                    // asteroid.color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
                }

                lasers.splice(i, 1);
                // console.log("removing laser collided with asteroid");

                score += actualDamage * 50; // Increase score based on actual damage

                playRandomMeteorDestroySound();
                coins += actualDamage * 20; // Add coins based on actual damage
                increaseXP(actualDamage * 20); // Increase XP based on actual damage

                // Track damage
                if (isShip) {
                    damageReport.lasers += actualDamage;

                    // Handle explosive laser effect
                    if (ship.explosiveLaserLevel > 0) {
                        createExplosion(laser.x, laser.y, 0);
                        let areaDamage = createAreaDamage(laser.x, laser.y, ship.explosiveLaserLevel * 15, ship.laserLevel); // Increase radius based on explosiveLaserLevel and damage based on laserLevel
                        damageReport.explosive += areaDamage;
                    }
                } else {
                    damageReport.turret += actualDamage;
                }

                break;
            }
        }
    }
}


function selectGemType(hitpoints) {
    const epicThreshold = 70;
    const rareThreshold = 15;

    // Probabilities (adjust these to fine-tune gem distribution)
    let commonProb = 0.84;
    let rareProb = 0.15;
    let epicProb = 0.01;
    if (testMode) {
        commonProb -= 0.3;
        epicProb += 0.3;
        console.log(epicProb);
    }

    // Adjust probabilities based on hitpoints
    if (hitpoints > epicThreshold) {
        epicProb += 0.05;
        rareProb += 0.20;
        commonProb -= 0.25;
    } else if (hitpoints > rareThreshold) {
        rareProb += 0.15;
        epicProb += 0.03;
        commonProb -= 0.20;
    }

    // Normalize probabilities
    const total = commonProb + rareProb + epicProb;
    commonProb /= total;
    rareProb /= total;
    epicProb /= total;

    // Weighted random selection
    const rand = Math.random();
    console.log(rand);
    if (rand < commonProb) return 'common';
    if (rand < commonProb + rareProb) return 'rare';
    return 'epic';
}

const lifeWidth = 10;  // Width of each life rectangle
const lifeHeight = 30; // Height of each life rectangle (3 times the width)

function drawLives() {
    const spacing = 5;     // Space between life rectangles
    // document.getElementById('livesDisplay').textContent = `Health:`;
    // const startX = 55;     // Starting X position for the first life
    // const startY = 5;     // Starting X position for the first life

    const startX = document.getElementById('miniShipPreview').getBoundingClientRect().right + 5;     // Starting X position for the first life
    const startY = document.getElementById('miniShipPreview').getBoundingClientRect().top;     // Starting X position for the first life
    // console.log(document.getElementById('xpBar').getBoundingClientRect().right);
    // console.log(document.getElementById('bottomContent').getBoundingClientRect().bottom);
    // console.log("s" + startY);
    // const startY = canvas.height - 40    // console.log(startX);
    // console.log(canvas.height + 40);

    ctx.fillStyle = 'green';

    if (currentMode === GameModes.COOP) {
        // Draw lives for Player 1
        for (let i = 0; i < ship.lives; i++) {
            const x = startX + (lifeWidth + spacing) * i;
            ctx.fillRect(x, startY, lifeWidth, lifeHeight);
        }

        // Draw lives for Player 2
        const player2StartX = canvas.width - startX - (lifeWidth + spacing) * ship2.lives;
        for (let i = 0; i < ship2.lives; i++) {
            const x = player2StartX + (lifeWidth + spacing) * i;
            ctx.fillRect(x, startY, lifeWidth, lifeHeight);
        }

        // Update HTML display
        document.getElementById('livesDisplay').textContent = `P1 Health: ${ship.lives} | P2 Health: ${ship2.lives}`;
    } else {
        // Single player mode
        let finalX = startX;

        for (let i = 0; i < lives; i++) {
            const x = startX + (lifeWidth + spacing) * i;
            finalX = x;
            ctx.fillRect(x, startY, lifeWidth, lifeHeight);
        }

        displayWeaponInfo(finalX + 10, startY);

        // Update HTML display
        // document.getElementById('livesDisplay').textContent = `Health: ${lives}`;

    }
}


function drawCoins() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Press Start 2P';
    ctx.textAlign = 'left';
    let coinmessage = 'Coins: ' + coins;
    if (isMobile())
        coinmessage = coinmessage + '    tap for store';
    else
        coinmessage = coinmessage + "    'b' for store";

    ctx.fillText(coinmessage, 20, canvas.height - 30);
}

// function drawDrone() {
//   ctx.save();
//   ctx.translate(drone.x, drone.y);
//   ctx.rotate(drone.direction);
//   ctx.beginPath();
//   ctx.moveTo(0, -drone.size);
//   ctx.lineTo(-drone.size, drone.size);
//   ctx.lineTo(drone.size, drone.size);
//   ctx.closePath();
//   ctx.fillStyle = 'cyan';
//   ctx.fill();
//   ctx.restore();

//   // Draw drone lasers
//   ctx.fillStyle = 'cyan';
//   for (let i = 0; i < drone.lasers.length; i++) {
//     let laser = drone.lasers[i];
//     ctx.fillRect(laser.x - 1, laser.y - 1, 2, 2);
//   }
// }
