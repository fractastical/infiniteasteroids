const weapons = [
    {
        name: 'Basic Laser',
        description: 'Standard weapon. Fires straight lasers.',
        icon: 'icons/Basiclaser.svg'
    },
    {
        name: 'Explosive Laser',
        description: 'Lasers explode on impact, causing area damage.',
        icon: 'icons/Explosivelaser.svg'
    },
    {
        name: 'Laser Drone',
        description: 'Drone that flies around you shooting randomly.',
        icon: 'icons/laserdrone.png'
    },
    {
        name: 'Bomber Drone',
        description: 'Drone that leaves protective mines that explode with area damage when an asteroid gets nearby.',
        icon: 'icons/Bomberdrone.svg'
    },
    {
        name: 'Acid Bomb',
        description: 'Releases acid that deals damage over time in an area.',
        icon: 'icons/Acidbomb.svg'
    },
    {
        name: 'Sonic Blast',
        description: 'Creates a wave that damages all enemies in its path.',
        icon: 'icons/Sonicray.svg'
    },
    {
        name: 'Death Ray',
        description: 'Fire a beam that melts and instakills everything in its path.',
        icon: 'icons/Deathray.svg'
    },
    {
        name: 'Boomerang',
        description: 'A boomerang that bounces around the level.',
        icon: 'icons/Boomerang.svg'
    },
    {
        name: 'Freeze Ray',
        description: 'Freezes enemies in place for a short duration.',
        icon: 'icons/Freeze.svg'
    },
    {
        name: 'Nano Swarm',
        description: 'A swarm of nanobots that seek and destroy enemies.',
        icon: 'icons/nanodrone.png'
    },
    {
        name: 'Turret',
        description: 'Deploys a turret that automatically shoots at enemies.',
        icon: 'icons/Autocannon.svg'
    },
    {
        name: 'Flamethrower',
        description: 'Shoots a continuous stream of fire.',
        icon: 'icons/flamethrower.png'
    },
    {
        name: 'Chain Lightning',
        description: 'Fires a lightning bolt that bounces between asteroids.',
        icon: 'icons/chainlightning.png'
    },
    {
        name: 'Explosive Rocket',
        description: 'Fires a slow-moving rocket that causes explosive AoE damage on impact.',
        icon: 'icons/explosive-rocket.png'
    }

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
    nano: 'Nano Swarm'
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


function updateFlamethrower() {
    if (flamethrower.active) {
        // Define the area of effect for the flamethrower
        let flameRange = flamethrower.range;
        let flameWidth = 20;

        // Calculate the endpoint of the flamethrower
        let endX = ship.x + flameRange * Math.sin(ship.rotation * Math.PI / 180);
        let endY = ship.y - flameRange * Math.cos(ship.rotation * Math.PI / 180);

        // Check for collisions with asteroids
        for (let i = asteroids.length - 1; i >= 0; i--) {
            let asteroid = asteroids[i];
            let dx = asteroid.x - ship.x;
            let dy = asteroid.y - ship.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < flameRange && Math.abs(dx * Math.cos(ship.rotation * Math.PI / 180) + dy * Math.sin(ship.rotation * Math.PI / 180)) < flameWidth / 2) {
                asteroid.isOnFire = true; // Set the asteroid on fire
                asteroid.fireTimer = 0; // Reset the fire timer
            }
        }

        // Draw the flamethrower
        ctx.save();
        ctx.strokeStyle = 'orange';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(ship.x, ship.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.restore();

        flamethrower.active = false;
    }
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
        } else {
            asteroid.color = 'gray'; // Reset the asteroid color if not on fire
        }
    }
}




function activateSonicBlast() {
    if (sonicBlast.timer === 0) {
        sonicBlast.waves.push({
            x: ship.x,
            y: ship.y,
            radius: 0,
            hitAsteroids: [], // Array to store the IDs of hit asteroids
        });
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

function fireChainLightning(target, bounces) {
    if (bounces <= 0 || !target) return;

    let damage = chainLightning.damage;
    let actualDamage = Math.min(damage + damageBooster, target.hitpoints);
    target.hitpoints -= actualDamage;
    damageReport.chainlightning += actualDamage;

    if (target.hitpoints <= 0) {
        createExplosion(target.x, target.y, target.hitpoints, target.image);
        let index = asteroids.indexOf(target);
        asteroids.splice(index, 1);
    }

    drawChainLightning(ship, target);

    let nextTarget = findNearestAsteroidInRange(target, chainLightning.range);
    if (nextTarget) {
        drawChainLightning(target, nextTarget);
        fireChainLightning(nextTarget, bounces - 1);
    }
}

function drawChainLightning(source, target) {
    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();
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

function createAcidExplosion(x, y, radius, duration) {
    createExplosion(x, y, 0); // Create visual explosion effect
    playRandomAcidBombSound();
    let acidArea = {
        x: x,
        y: y,
        radius: radius,
        duration: duration
    };
    acidBomb.activeAreas.push(acidArea);
}

function updateAcidAreas() {
    for (let i = acidBomb.activeAreas.length - 1; i >= 0; i--) {
        let area = acidBomb.activeAreas[i];
        area.duration--;

        for (let j = asteroids.length - 1; j >= 0; j--) {
            let asteroid = asteroids[j];
            let dx = asteroid.x - area.x;
            let dy = asteroid.y - area.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < area.radius) {
                let actualDamage = Math.min(acidBomb.damagePerSecond + damageBooster, asteroid.hitpoints);
                asteroid.hitpoints -= actualDamage;
                damageReport.acid += actualDamage;

                if (asteroid.hitpoints <= 0) {
                    processAsteroidDeath(asteroid);
                    asteroids.splice(j, 1);
                }
            }
        }

        if (area.duration <= 0) {
            acidBomb.activeAreas.splice(i, 1);
        }
    }
}


function drawAcidAreas() {
    ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
    for (let i = 0; i < acidBomb.activeAreas.length; i++) {
        let area = acidBomb.activeAreas[i];
        ctx.beginPath();
        ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 2);
        ctx.fill();
    }
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
                createExplosion(asteroid.x, asteroid.y, 1, asteroid.image);
                asteroids.splice(i, 1);
                damageReport.deathRay += asteroid.hitpoints;
                increaseXP(asteroid.hitpoints * 20);

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

