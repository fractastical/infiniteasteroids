let acidAreas = [];



function createSmallerAsteroids(x, y, size, speed, hitpoints) {
    const baseAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];
    const speedMultiplier = 0.2; // Decrease speed for smaller asteroids
    const newSize = Math.max(4, size / 2); // New size for smaller asteroids

    for (let i = 0; i < 3; i++) {
        const angleVariation = (Math.random() - 0.5) * 0.7; // Random variation between -0.1 and 0.1 radians
        const angle = baseAngles[i] + angleVariation;

        let asteroid = {
            x: x,
            y: y,
            size: newSize,
            speed: speed * speedMultiplier,
            dx: Math.cos(angle) * speed * speedMultiplier,
            dy: Math.sin(angle) * speed * speedMultiplier,
            hitpoints: hitpoints / 2,
            initialHitpoints: hitpoints, // Store the initial hitpoints
            color: 'gray'
        };
        asteroids.push(asteroid);
    }
}

const asteroidImages = [];

function createAsteroids(side) {

    if (currentMode === GameModes.ENDLESS_SLOW) {
        createEndlessSlowAsteroids();
    } else {
        const asteroidImages = [
            'roids/8bitroid_9074.png',
            'roids/8bitroid_9292.png',
            'roids/8bitroid_9449.png',
            'roids/8bitroid_9460.png',
        ];

        let numberOfAsteroids = 10 + (wave - 1) * 1.8 + meteorBooster;
        if (meteorMode) {
            numberOfAsteroids += 35;
        }
        if (wave > 49 && wave < 53)
            numberOfAsteroids *= 0.2;
        else if (wave >= 53 && wave < 56)
            numberOfAsteroids *= 0.45;
        if (wave > 74 && wave < 78)
            numberOfAsteroids *= 0.2;
        else if (wave >= 78 && wave < 82)
            numberOfAsteroids *= 0.45;
        else if (wave >= 97 && wave < 106)
            numberOfAsteroids *= 0.3;

        for (let i = 0; i < numberOfAsteroids; i++) {
            let isLargeAsteroid = Math.random() < 0.1; // 10% chance for a large asteroid
            let isSmallAsteroid = Math.random() * 100 < chanceForSmallAsteroid;
            let isVerySmallAsteroid = Math.random() * 100 < chanceForVerySmallAsteroid;
            let isHardenedAsteroid = Math.random() * 100 < chanceForHardenedAsteroid;
            let isVeryHardenedAsteroid = Math.random() * 100 < chanceForVeryHardenedAsteroid;
            let isMegaHardenedAsteroid = Math.random() * 100 < chanceForMegaHardenedAsteroid;



            let isRareAsteroid = Math.random() < getRareAsteroidChance(wave); // 5% chance for a rare asteroid

            let dx = 1;
            let dy = 1;
            let asteroidSize = isLargeAsteroid ? 40 : isSmallAsteroid ? 10 : 20;
            asteroidSpeedMultiplier = isSmallAsteroid ? 0.3 : isLargeAsteroid ? 0.05 : 0.1;

            const randomIndex = Math.floor(Math.random() * asteroidImages.length);
            const asteroidImage = asteroidImages[randomIndex];

            if (isVerySmallAsteroid) {
                asteroidSize = 5;
                asteroidSpeedMultiplier = 0.5;
            }

            let x, y;
            let spawnArea = Math.random();

            if (!meteorMode) {
                let spawnPercentage = wave === 1 ? 0.2 : 0.03; // 20% for wave 1, 3% for others

                if (spawnArea < 0.25) {
                    // Top edge
                    x = Math.random() * canvas.width;
                    y = Math.random() * (canvas.height * spawnPercentage);
                } else if (spawnArea < 0.5) {
                    // Right edge
                    x = canvas.width * 0.97 + Math.random() * (canvas.width * spawnPercentage);
                    y = Math.random() * canvas.height;
                } else if (spawnArea < 0.75) {
                    // Bottom edge
                    x = Math.random() * canvas.width;
                    y = canvas.height * 0.97 + Math.random() * (canvas.height * spawnPercentage);
                } else {
                    // Left edge
                    x = Math.random() * (canvas.width * spawnPercentage);
                    y = Math.random() * canvas.height;
                }
            } else {
                x = side === 'left' ? 0 : canvas.width;
                y = Math.random() * canvas.height;
                dx = side === 'left' ? Math.random() * 2 : -Math.random() * 2;
                dy = (Math.random() * 2 - 1);
            }

            let hitpoints;
            let color;
            let type = 'normal';

            let hpBooster = 0;
            hpBooster = applyMultiWaveBoost(wave);

            if (isRareAsteroid) {
                // console.log("Rare asteroid created:", type, color);

                const rareTypes = ['exploding', 'freezing', 'chainLightning', 'acid'];
                type = rareTypes[Math.floor(Math.random() * rareTypes.length)];
                hitpoints = 5 + hpBooster; // Fixed hitpoints for rare asteroids on early waves
                switch (type) {
                    case 'exploding':
                        color = '#FF0000'; // Red
                        break;
                    case 'freezing':
                        color = '#00BFFF'; // Blue
                        break;
                    case 'chainLightning':
                        color = '#FFFF00'; // Yellow
                        break;
                    case 'acid':
                        color = '#00FF00'; // Green
                        break;
                }
            } else {
                if (isLargeAsteroid) {
                    hitpoints = wave; // Higher hit points for larger asteroids
                    color = 'darkgray';
                } else if (isMegaHardenedAsteroid) {
                    hitpoints = 10 + wave;
                    hitpoints += hpBooster;
                    color = '#47254d'; // Very dark purple for mega hardened asteroids
                } else if (isVeryHardenedAsteroid) {
                    hitpoints = 15;
                    hitpoints += hpBooster;
                    color = '#244747'; // Very dark green color for very hardened asteroids
                } else if (isHardenedAsteroid) {
                    hitpoints = Math.floor(Math.random() * 5) + 3; // Random hitpoints between 5 and 8
                    hitpoints += hpBooster;
                    color = '#274545'; // Dark green color for hardened asteroids
                } else {
                    hitpoints = 1;
                    hitpoints += hpBooster;
                    color = 'gray';
                }
            }

            let asteroid = {
                id: Date.now() + Math.random(), // Generate a unique ID for each asteroid
                x: x,
                y: y,
                size: asteroidSize,
                speed: calculateAsteroidSpeed(wave),
                dx: calculateAsteroidDx(wave, dx),
                dy: calculateAsteroidDy(wave, dy),
                hitpoints: calculateAsteroidHitpoints(wave, hitpoints),
                initialHitpoints: calculateAsteroidHitpoints(wave, hitpoints),
                color: color,
                isLarge: isLargeAsteroid,
                image: asteroidImage,
                type: type
            };
            asteroids.push(asteroid);
        }

        chanceForSmallAsteroid += 0.5;
        chanceForVerySmallAsteroid += 0.1;
        chanceForHardenedAsteroid += 0.5;
        chanceForVeryHardenedAsteroid += 0.2; // Increase the chance for very hardened asteroids
        chanceForMegaHardenedAsteroid += 0.1; // Increase the chance for mega hardened asteroids

        // Trigger the asteroid cluster every few waves (e.g., every 5 waves)
        if (wave % 3 === 0) {
            createAsteroidCluster();
        }

        if (wave % 7 === 0) {
            createSlowCluster();
        }

        if (wave % 10 === 0 && !miniBossAlien) {
            alien = {
                x: 20,
                y: 50,
                size: 60,
                speed: 0.3,
                direction: Math.PI / 2,
                shootTimer: 0,
                hitpoints: wave,
                shootInterval: 120 // Adjust the shooting interval as desired
            };
        }
    }
}

function calculateLineThickness(hitpoints) {
    if (hitpoints <= 1) return 1;
    if (hitpoints < 100) {
        // Linear scaling from 1-20 for hitpoints under 100
        return 1 + (hitpoints - 1) * (19 / 99);
    } else {
        // Logarithmic scaling for hitpoints 100 and above
        return 20 + 60 * (Math.log(hitpoints) - Math.log(100)) / (Math.log(500) - Math.log(100));
    }
}

function drawAsteroids() {
    for (let i = 0; i < asteroids.length; i++) {
        let asteroid = asteroids[i];
        // let hitpointAnalogue = asteroid.hitpoints + 1;


        ctx.lineWidth = calculateLineThickness(asteroid.hitpoints)


        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.size, 0, Math.PI * 2);
        ctx.closePath();

        if (asteroid.type !== 'normal') {
            // Fill rare asteroids
            ctx.fillStyle = asteroid.color;
            ctx.fill();
        } else {
            // Use shades of grey for non-rare asteroids
            ctx.strokeStyle = asteroid.color;
        }

        if (asteroid.hitpoints > 100) {
            const ringThickness = Math.min((asteroid.hitpoints - 10) / 5, 5); // Increase thickness with HP, max 5
            if (ringThickness > 0) {
                ctx.beginPath();
                ctx.arc(asteroid.x, asteroid.y, Math.abs(asteroid.size - ringThickness - 2), 0, Math.PI * 2);
                ctx.strokeStyle = getHPColor(asteroid.hitpoints);
                ctx.lineWidth = ringThickness;
                ctx.stroke();
            }
        }


        // Set stroke color for rare asteroids
        ctx.strokeStyle = asteroid.type !== 'normal' ? 'white' : ctx.strokeStyle;
        if (asteroid.frozen == true)
            ctx.strokeStyle = '#22EEEE';

        ctx.stroke(); // Stroke all asteroids

        // Debugging: Log asteroid drawing
        // console.log("Drawing asteroid:", asteroid.type, ctx.fillStyle, asteroid.x, asteroid.y);
    }
}


function getHPColor(hitpoints) {
    if (hitpoints <= 150) return '#FFA500'; // Orange
    if (hitpoints <= 300) return '#FF4500'; // OrangeRed
    if (hitpoints <= 500) return '#FF0000'; // Red
    return '#8B0000'; // DarkRed
}

function createEndlessSlowAsteroids() {
    const baseAsteroidCount = 20;
    const additionalAsteroidsPerWave = 1;
    const baseHitpoints = 1;
    const hitpointIncreasePerWave = 0.5;
    const speedVariation = 0.02; // 2% variation
    const angleVariation = 0.02; // 2% variation in radians

    let numberOfAsteroids = baseAsteroidCount + (wave - 1) * additionalAsteroidsPerWave;
    let spawnSide = 0;

    if ((wave > 49 && wave < 56) || (wave > 74 && wave < 82)) {
        numberOfAsteroids *= 0.55;
    }

    for (let i = 0; i < numberOfAsteroids; i++) {
        let hitpoints = Math.ceil(baseHitpoints + (wave - 1) * hitpointIncreasePerWave);

        let baseSpeed = 0.5;
        let speed = baseSpeed + (Math.random() * speedVariation * 2 - speedVariation);
        let baseAngle = 0;
        let angle = baseAngle + (Math.random() * angleVariation * 2 - angleVariation);

        let dx = Math.cos(angle) * speed;
        let dy = Math.sin(angle) * speed;

        let x, y;

        if ((wave > 49 && wave < 56) || (wave > 74 && wave < 82)) {
            x = 0;
            y = Math.random() * (canvas.height / 2);
        } else {
            switch (spawnSide) {
                case 0: // Left side
                    x = 0;
                    y = Math.random() * canvas.height;
                    break;
                case 1: // Top side
                    x = Math.random() * canvas.width;
                    y = 0;
                    break;
                case 2: // Right side
                    x = canvas.width;
                    y = Math.random() * canvas.height;
                    dx = -dx; // Reverse directionfor right side
                    break;
                case 3: // Bottom side
                    x = Math.random() * canvas.width;
                    y = canvas.height;
                    dy = -dy; // Reverse direction for bottom side
                    break;
            }
        }

        let asteroid = {
            x: x,
            y: y,
            size: 20,
            speed: speed,
            dx: dx,
            dy: dy,
            hitpoints: hitpoints,
            initialHitpoints: hitpoints,
            color: getAsteroidColor(hitpoints)
        };

        asteroids.push(asteroid);
    }
}

function getAsteroidColor(hitpoints) {
    const colors = [
        '#F8F8F8', // Very Light Gray
        '#F0F0F0', // Light Gray
        '#E8E8E8',
        '#E0E0E0',
        '#D8D8D8',
        '#D0D0D0',
        '#C8C8C8',
        '#C0C0C0', // Silver
        '#B8B8B8',
        '#B0B0B0',
        '#A8A8A8',
        '#A0A0A0',
        '#989898',
        '#909090',
        '#888888'  // Medium Gray
    ];

    if (hitpoints <= 2) return colors[0];
    if (hitpoints <= 5) return colors[1];
    if (hitpoints <= 10) return colors[2];
    if (hitpoints <= 20) return colors[3];
    if (hitpoints <= 30) return colors[4];
    if (hitpoints <= 40) return colors[5];
    if (hitpoints <= 50) return colors[6];
    if (hitpoints <= 60) return colors[7];
    if (hitpoints <= 70) return colors[8];
    if (hitpoints <= 80) return colors[9];
    if (hitpoints <= 90) return colors[10];
    if (hitpoints <= 100) return colors[11];
    if (hitpoints <= 110) return colors[12];
    if (hitpoints <= 120) return colors[13];
    return colors[14];
}

function createAsteroidCluster() {
    const clusterSize = 10; // Number of asteroids in the cluster
    let clusterSpeed = 1.2 * Math.pow(1.02, wave - 1); // Base speed for the cluster
    // half speed clusters in easy
    if (currentMode == GameModes.EASY)
        clusterSpeed *= 0.5;
    if (currentMode == GameModes.NORMAL)
        clusterSpeed *= 0.7;

    const speedVariation = 0.02; // Speed variation percentage (1%)
    const angleVariation = Math.PI / 8; // Angle variation (in radians)

    // Determine the starting corner (top-left, top-right, bottom-left, bottom-right)
    const corners = [
        { x: 0, y: 0 },
        { x: canvas.width, y: 0 },
        { x: 0, y: canvas.height },
        { x: canvas.width, y: canvas.height }
    ];
    const startCorner = corners[Math.floor(Math.random() * corners.length)];

    // Determine the target corner (opposite of the starting corner)
    const targetCorner = {
        x: canvas.width - startCorner.x,
        y: canvas.height - startCorner.y
    };

    for (let i = 0; i < clusterSize; i++) {
        // Calculate a random variation in speed
        const speedMultiplier = 1 + (Math.random() * 2 - 1) * speedVariation;

        // Calculate a random variation in angle
        const angleOffset = (Math.random() * 2 - 1) * angleVariation;

        // Calculate the direction vector based on the target corner and angle variation
        const dx = Math.cos(Math.atan2(targetCorner.y - startCorner.y, targetCorner.x - startCorner.x) + angleOffset);
        const dy = Math.sin(Math.atan2(targetCorner.y - startCorner.y, targetCorner.x - startCorner.x) + angleOffset);

        // Create the asteroid with slightly varied speed and angle
        let asteroid = {
            x: startCorner.x + i * 4,
            y: startCorner.y + i * 4,
            size: 20,
            speed: clusterSpeed * speedMultiplier,
            dx: dx * clusterSpeed * speedMultiplier,
            dy: dy * clusterSpeed * speedMultiplier,
            hitpoints: 5, // Hit points for larger asteroids
            initialHitpoints: 5, // Store the initial hitpoints
            color: 'gray'
        };

        asteroids.push(asteroid);
    }
}

function createSlowCluster() {
    const clusterSize = 3; // Number of asteroids in the cluster
    const clusterSpeed = 0.5; // Speed of the cluster
    const asteroidHitpoints = 50; // Hitpoints of each asteroid in the cluster
    const asteroidSize = 40; // Size of each asteroid in the cluster

    // Determine the starting position (left or right)
    const startX = Math.random() < 0.5 ? 0 : canvas.width;
    const startY = canvas.height / 2;

    // Determine the direction (left to right or right to left)
    const direction = startX === 0 ? 1 : -1;

    for (let i = 0; i < clusterSize; i++) {
        let asteroid = {
            x: startX,
            y: startY + (i - Math.floor(clusterSize / 2)) * asteroidSize * 2,
            size: asteroidSize,
            speed: clusterSpeed,
            dx: direction,
            dy: 0,
            hitpoints: asteroidHitpoints,
            initialHitpoints: asteroidHitpoints,
            color: 'darkgray'
        };

        asteroids.push(asteroid);
    }
}

// Update asteroids
function updateAsteroids() {
    if (currentMode === GameModes.ENDLESS_SLOW) {
        for (let i = 0; i < asteroids.length; i++) {
            asteroids[i].x += asteroids[i].dx;

            // Remove asteroids that have passed the right edge of the screen
            if (asteroids[i].x > canvas.width) {
                asteroids.splice(i, 1);
                i--;
            }
        }
    } else {
        if (!freezeEffect.active) {
            for (let i = 0; i < asteroids.length; i++) {
                applyGravity(asteroids[i]);

                asteroids[i].x += asteroids[i].dx * asteroids[i].speed;
                asteroids[i].y += asteroids[i].dy * asteroids[i].speed;

                if (!meteorMode) {
                    // Wrap asteroids around the screen
                    if (asteroids[i].x < 0) {
                        asteroids[i].x = canvas.width;
                    } else if (asteroids[i].x > canvas.width) {
                        asteroids[i].x = 0;
                    }
                    if (asteroids[i].y < 0) {
                        asteroids[i].y = canvas.height;
                    } else if (asteroids[i].y > canvas.height) {
                        asteroids[i].y = 0;
                    }
                } else {
                    if (
                        asteroids[i].x < 0 ||
                        asteroids[i].x > canvas.width ||
                        asteroids[i].y < 0 ||
                        asteroids[i].y > canvas.height
                    ) {
                        asteroids.splice(i, 1);
                        i--;
                    }
                }
            }
        }
    }
}


function createExplosion(x, y, hitpoints = 1, sizeMultiplier = 1) {
    const baseSize = 8 * sizeMultiplier; // Base size for explosions
    const sizeReductionFactor = 1.5; // Size reduction per hitpoint
    const randomSize = Math.max(5, baseSize - hitpoints * sizeReductionFactor);
    const randomAlphaDecay = Math.random() * 0.01 + 0.005; // Random alpha decay between 0.005 and 0.015

    let randomColor;
    if (hitpoints > 7) {
        randomColor = getRandomPurpleShade();
    } else if (hitpoints > 1) {
        randomColor = getRandomBlueShade();
    } else {
        randomColor = getRandomOrangeShade();
    }

    let explosion = {
        x: x,
        y: y,
        size: randomSize,
        alpha: 1,
        alphaDecay: randomAlphaDecay,
        color: randomColor
    };
    if (explosions.length < HARDCAPONASTEROIDEXPLOSIONS)
        explosions.push(explosion);
}

let lastRareAsteroids = [];
const maxRareAsteroidsDisplayed = 3;


function processAsteroidDeath(asteroid, fromArea = false) {
    createExplosion(asteroid.x, asteroid.y, asteroid.hitpoints);
    asteroidsKilled++;

    //No special effects from area damage to prevent call stack overflow
    if (!fromArea) {

        // Handle rare asteroid effects
        switch (asteroid.type) {
            case 'exploding':
                const explosionRadius = 100;
                const explosionDamage = asteroid.initialHitpoints;
                createAreaDamage(asteroid.x, asteroid.y, explosionRadius, explosionDamage);
                createExplosion(asteroid.x, asteroid.y, 7, 2.5);
                addRareAsteroidToDisplay(asteroid.type, '#FF0000');  // Red
                break;
            case 'freezing':
                applyFreezeEffect(asteroid.x, asteroid.y);
                addRareAsteroidToDisplay(asteroid.type, '#00BFFF');  // Blue
                break;
            case 'chainLightning':
                fireChainLightningFromAsteroid(asteroid);
                addRareAsteroidToDisplay(asteroid.type, '#FFFF00');  // Yellow
                break;
            case 'acid':
                createAcidExplosion(asteroid.x, asteroid.y, 100, 1000, true);
                addRareAsteroidToDisplay(asteroid.type, '#00FF00');  // Green
                break;
        }

    }




    let baseDropChance = 0.15; // 10% base chance to drop a gem

    if (wave > 55)
        baseDropChance = 0.0015; // 10% base chance to drop a gem
    if (wave > 55)
        baseDropChance = 0.0025; // 10% base chance to drop a gem
    if (wave > 45)
        baseDropChance = 0.005; // 10% base chance to drop a gem
    else if (wave > 35)
        baseDropChance = 0.01; // 10% base chance to drop a gem
    else if (wave > 25)
        baseDropChance = 0.02; // 10% base chance to drop a gem
    else if (wave > 15)
        baseDropChance = 0.04; // 10% base chance to drop a gem
    else if (wave > 7)
        baseDropChance = 0.07; // 10% base chance to drop a gem

    const hitpointFactor = 0.0005; // Increase drop chance by 0.05% per hitpoint
    const dropChance = Math.min(baseDropChance + (asteroid.initialHitpoints * hitpointFactor), 1);

    if (Math.random() < dropChance && droppedGems.length < 40) {
        let gemType = selectGemType(asteroid.initialHitpoints);
        if (gemType == 'epic') {

            // max one epic gem every 7 waves starting with 7th wave
            if (lastEpicWave > wave - 7)
                gemType = 'rare';
            else
                lastEpicWave = wave;

        }


        droppedGems.push({
            x: asteroid.x,
            y: asteroid.y,
            size: 15,
            type: gemType,
            dx: asteroid.dx / 5,
            dy: asteroid.dy / 5
        });
    }
}

let lastEpicWave = 0;

function addRareAsteroidToDisplay(type, color) {
    if (type !== 'normal') {
        lastRareAsteroids.unshift({ type, color });
        if (lastRareAsteroids.length > maxRareAsteroidsDisplayed) {
            lastRareAsteroids.pop();
        }
    }

    if (lastRareAsteroids.length === 3) {
        if (lastRareAsteroids.every(asteroid => asteroid.type === 'exploding')) {
            triggerMegaExplosion();
            lastRareAsteroids = [];
        } else if (lastRareAsteroids.every(asteroid => asteroid.type === 'chainLightning')) {
            triggerLightningStorm();
            lastRareAsteroids = [];
        } else if (lastRareAsteroids.every(asteroid => asteroid.type === 'acid')) {
            triggerAcidRain();
            lastRareAsteroids = [];
        } else if (lastRareAsteroids.every(asteroid => asteroid.type === 'freezing')) {
            triggerMegaFreeze();
            lastRareAsteroids = [];
        }
    }
}

let lightningStormPower = 5;

function triggerLightningStorm() {
    console.log("Lightning Storm Triggered!");
    // Create multiple chain lightning effects across the screen
    playLightningSound();

    for (let i = 0; i < lightningStormPower; i++) {
        let randomAsteroid = asteroids[Math.floor(Math.random() * asteroids.length)];
        if (randomAsteroid) {
            fireChainLightningFromAsteroid(randomAsteroid);
        }
    }
    // increase effect each time it triggers
    lightningStormPower++;

    screenShake(10, 500);
    playLightningSound();

    // Add screen flash effect
    // ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    // setTimeout(() => {
    //     ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);
    // }, 100);

    // playSound('thunder');
}

function triggerAcidRain() {
    console.log("Acid Rain Triggered!");
    // Create multiple acid areas across the screen
    for (let i = 0; i < 10; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        createAcidExplosion(x, y, 50, 5000); // smaller radius, longer duration
    }

    // Add a green tint to the screen
    ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // playSound('acidRain');
}

function triggerMegaFreeze() {
    console.log("Mega Freeze Triggered!");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const megaFreezeRadius = Math.min(canvas.width, canvas.height) / 2;
    const freezeDuration = 10000; // 10 seconds

    applyMegaFreezeEffect(centerX, centerY, megaFreezeRadius, freezeDuration);

    // Add a blue tint to the screen
    // looks green
    // ctx.fillStyle = 'rgba(0, 191, 255, 0.2)';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Create a visual freeze effect
    // createFreezeVisualEffect(centerX, centerY, megaFreezeRadius);

    // playSound('megaFreeze');
}

function applyMegaFreezeEffect(x, y, radius, duration) {
    for (let asteroid of asteroids) {
        let dx = asteroid.x - x;
        let dy = asteroid.y - y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < radius) {
            asteroid.frozen = true;
            asteroid.frozenDuration = duration;
            asteroid.originalSpeed = asteroid.speed;
            asteroid.speed *= 0.1; // Slow down to 10% of original speed
        }
    }
}



function triggerMegaExplosion() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const megaExplosionRadius = Math.min(canvas.width, canvas.height) / 3;
    const megaExplosionDamage = 300; // Adjust this value as needed

    // Create visual effect for mega explosion
    createMegaExplosionEffect(centerX, centerY, megaExplosionRadius);

    // Apply area damage
    createAreaDamage(centerX, centerY, megaExplosionRadius, megaExplosionDamage);

    // Add screen shake or other visual effects here
    screenShake(20, 1000); // Example: 20 pixel shake for 1000ms

    // Play a sound effect if you have one
    // playSound('megaExplosion');

    console.log("Mega Explosion Triggered!");
}

function createMegaExplosionEffect(x, y, radius) {
    const duration = 60; // Number of frames the explosion lasts
    const explosionColors = ['#FF0000', '#FF5500', '#FFAA00', '#FFFF00', '#FFFFFF'];

    let megaExplosion = {
        x: x,
        y: y,
        radius: radius,
        currentRadius: 0,
        duration: duration,
        colors: explosionColors,
        currentColorIndex: 0
    };

    // Add to a new array for mega explosions if you don't want to use the regular explosions array
    megaExplosions.push(megaExplosion);
}

function drawMegaExplosions() {
    for (let i = megaExplosions.length - 1; i >= 0; i--) {
        let explosion = megaExplosions[i];

        ctx.beginPath();
        ctx.arc(explosion.x, explosion.y, explosion.currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = explosion.colors[explosion.currentColorIndex];
        ctx.fill();

        // Update explosion
        explosion.currentRadius += explosion.radius / explosion.duration;
        explosion.duration--;

        // Cycle through colors
        if (explosion.duration % 5 === 0) {
            explosion.currentColorIndex = (explosion.currentColorIndex + 1) % explosion.colors.length;
        }

        // Remove finished explosions
        if (explosion.duration <= 0) {
            megaExplosions.splice(i, 1);
        }
    }
}



function screenShake(intensity, duration) {
    let shakeTimeLeft = duration;

    function shake() {
        if (shakeTimeLeft > 0) {
            let shakeX = (Math.random() - 0.5) * intensity;
            let shakeY = (Math.random() - 0.5) * intensity;

            ctx.translate(shakeX, shakeY);

            shakeTimeLeft -= 16; // Assuming 60 FPS
            requestAnimationFrame(shake);
        } else {
            ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the canvas transform
        }
    }

    shake();
}

function drawRareAsteroidIndicators() {
    const indicatorSize = 30;
    const padding = 10;
    const startX = canvas.width - (indicatorSize + padding) * maxRareAsteroidsDisplayed;
    const startY = canvas.height - indicatorSize - padding;

    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    lastRareAsteroids.forEach((asteroid, index) => {
        const x = startX + (indicatorSize + padding) * index;

        // Draw colored circle
        ctx.beginPath();
        ctx.arc(x + indicatorSize / 2, startY + indicatorSize / 2, indicatorSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = asteroid.color;
        ctx.fill();

        // Draw asteroid type initial
        ctx.fillStyle = 'white';
        ctx.fillText(asteroid.type[0].toUpperCase(), x + indicatorSize / 2, startY + indicatorSize / 2);
    });
}


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

// function handleRareAsteroidEffects(asteroid) {
//     switch (asteroid.type) {
//         case 'exploding':
//             createExplosion(asteroid.x, asteroid.y, asteroid.hitpoints);
//             break;
//         case 'freezing':
//             applyFreezeEffect(asteroid.x, asteroid.y);
//             break;
//         case 'chainLightning':
//             fireChainLightningFromAsteroid(asteroid);
//             break;
//         case 'acid':
//             createAcidArea(asteroid.x, asteroid.y);
//             break;
//     }
// }

function applyFreezeEffect(x, y, radius = 250) {
    const freezeRadius = radius;
    for (let i = 0; i < asteroids.length; i++) {
        let dx = asteroids[i].x - x;
        let dy = asteroids[i].y - y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < freezeRadius) {
            asteroids[i].dx *= 0.2;
            asteroids[i].dy *= 0.2;
            asteroids[i].frozen = true;
            // setTimeout(() => {
            //     if (asteroids[i]) {
            //         asteroids[i].dx = Math.random() * 2 - 1;
            //         asteroids[i].dy = Math.random() * 2 - 1;
            //     }
            // }, 3000);
        }
    }
}

function fireChainLightningFromAsteroid(asteroid) {
    const lightningRange = 150;
    let target = findNearestAsteroidInRange(asteroid, lightningRange);
    if (target) {
        drawChainLightning(asteroid, target);
        fireChainLightning(target, 3, true);
    }
}


function updateAsteroids() {
    if (currentMode === GameModes.ENDLESS_SLOW) {
        for (let i = 0; i < asteroids.length; i++) {
            asteroids[i].x += asteroids[i].dx;

            // Remove asteroids that have passed the right edge of the screen
            if (asteroids[i].x > canvas.width) {
                asteroids.splice(i, 1);
                i--;
            }
        }
    } else {
        if (!freezeEffect.active) {
            for (let i = 0; i < asteroids.length; i++) {
                applyGravity(asteroids[i]);

                asteroids[i].x += asteroids[i].dx * asteroids[i].speed;
                asteroids[i].y += asteroids[i].dy * asteroids[i].speed;

                if (!meteorMode) {
                    // Wrap asteroids around the screen
                    if (asteroids[i].x < 0) {
                        asteroids[i].x = canvas.width;
                    } else if (asteroids[i].x > canvas.width) {
                        asteroids[i].x = 0;
                    }
                    if (asteroids[i].y < 0) {
                        asteroids[i].y = canvas.height;
                    } else if (asteroids[i].y > canvas.height) {
                        asteroids[i].y = 0;
                    }
                } else {
                    if (
                        asteroids[i].x < 0 ||
                        asteroids[i].x > canvas.width ||
                        asteroids[i].y < 0 ||
                        asteroids[i].y > canvas.height
                    ) {
                        asteroids.splice(i, 1);
                        i--;
                    }
                }

                // if (asteroids[i].hitpoints <= 0) {
                //     handleRareAsteroidEffects(asteroids[i]);
                //     asteroids.splice(i, 1);
                // }
            }
        }
    }
}




