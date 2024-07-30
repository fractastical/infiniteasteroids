let acidAreas = [];


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
            numberOfAsteroids *= 0.3;
        else if (wave >= 53 && wave < 56)
            numberOfAsteroids *= 0.55;
        if (wave > 74 && wave < 78)
            numberOfAsteroids *= 0.3;
        else if (wave >= 78 && wave < 82)
            numberOfAsteroids *= 0.55;

        for (let i = 0; i < numberOfAsteroids; i++) {
            let isLargeAsteroid = Math.random() < 0.1; // 10% chance for a large asteroid
            let isSmallAsteroid = Math.random() * 100 < chanceForSmallAsteroid;
            let isVerySmallAsteroid = Math.random() * 100 < chanceForVerySmallAsteroid;
            let isHardenedAsteroid = Math.random() * 100 < chanceForHardenedAsteroid;
            let isVeryHardenedAsteroid = Math.random() * 100 < chanceForVeryHardenedAsteroid;
            let isMegaHardenedAsteroid = Math.random() * 100 < chanceForMegaHardenedAsteroid;
            let isRareAsteroid = Math.random() < 0.05; // 5% chance for a rare asteroid

            let dx = 1;
            let dy = 1;
            let asteroidSize = isLargeAsteroid ? 40 : isSmallAsteroid ? 10 : 20;
            let asteroidSpeedMultiplier = isSmallAsteroid ? 0.3 : isLargeAsteroid ? 0.05 : 0.1;

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
                    x = canvas.width * 0.9 + Math.random() * (canvas.width * spawnPercentage);
                    y = Math.random() * canvas.height;
                } else if (spawnArea < 0.75) {
                    // Bottom edge
                    x = Math.random() * canvas.width;
                    y = canvas.height * 0.9 + Math.random() * (canvas.height * spawnPercentage);
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

            if (isRareAsteroid) {
                console.log("Rare asteroid created:", type, color);

                const rareTypes = ['exploding', 'freezing', 'chainLightning', 'acid'];
                type = rareTypes[Math.floor(Math.random() * rareTypes.length)];
                hitpoints = 5; // Fixed hitpoints for rare asteroids
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
                    color = '#301934'; // Very dark purple for mega hardened asteroids
                } else if (isVeryHardenedAsteroid) {
                    hitpoints = 15;
                    color = '#0A1414'; // Very dark green color for very hardened asteroids
                } else if (isHardenedAsteroid) {
                    hitpoints = Math.floor(Math.random() * 5) + 3; // Random hitpoints between 5 and 8
                    color = '#172727'; // Dark green color for hardened asteroids
                } else {
                    hitpoints = 1;
                    color = 'gray';
                }
            }

            let asteroid = {
                id: Date.now() + Math.random(), // Generate a unique ID for each asteroid
                x: x,
                y: y,
                size: asteroidSize,
                speed: 2 * Math.pow(1.02, wave - 1) * asteroidDifficultySpeedMultiplier,
                dx: dx * (Math.random() * 2 - 1) * asteroidSpeedMultiplier * Math.pow(1.02, wave - 1) * asteroidDifficultySpeedMultiplier,
                dy: dy * (Math.random() * 2 - 1) * asteroidSpeedMultiplier * Math.pow(1.02, wave - 1) * asteroidDifficultySpeedMultiplier,
                hitpoints: hitpoints,
                initialHitpoints: hitpoints,
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

        if (wave % 10 === 0 && !alien) {
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

function drawAsteroids() {
    for (let i = 0; i < asteroids.length; i++) {
        let asteroid = asteroids[i];

        ctx.lineWidth = asteroid.hitpoints + 1;

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

        // Set stroke color for rare asteroids
        ctx.strokeStyle = asteroid.type !== 'normal' ? 'white' : ctx.strokeStyle;
        ctx.stroke(); // Stroke all asteroids

        // Debugging: Log asteroid drawing
        // console.log("Drawing asteroid:", asteroid.type, ctx.fillStyle, asteroid.x, asteroid.y);
    }
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
        'gray', 'darkgray', '#172727', '#0A1414', '#301934',
        '#4B0082', '#483D8B', '#8A2BE2', '#9370DB', '#9400D3',
        '#7B68EE', '#6A5ACD', '#8B0000', '#B22222', '#FF4500'
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
    const baseSize = 15 * sizeMultiplier; // Base size for explosions
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
    explosions.push(explosion);
}

let lastRareAsteroids = [];
const maxRareAsteroidsDisplayed = 3;


function processAsteroidDeath(asteroid) {
    createExplosion(asteroid.x, asteroid.y, asteroid.hitpoints);
    asteroidsKilled++;

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
            createAcidExplosion(asteroid.x, asteroid.y, 100, 1000);
            addRareAsteroidToDisplay(asteroid.type, '#00FF00');  // Green
            break;
    }


    const baseDropChance = 0.1; // 10% base chance to drop a gem
    const hitpointFactor = 0.005; // Increase drop chance by 0.5% per hitpoint
    const dropChance = Math.min(baseDropChance + (asteroid.initialHitpoints * hitpointFactor), 1);

    if (Math.random() < dropChance && droppedGems.length < 40) {
        const gemType = selectGemType(asteroid.initialHitpoints);
        droppedGems.push({
            x: asteroid.x,
            y: asteroid.y,
            size: 10,
            type: gemType,
            dx: asteroid.dx / 5,
            dy: asteroid.dy / 5
        });
    }
}

function addRareAsteroidToDisplay(type, color) {
    if (type !== 'normal') {
        lastRareAsteroids.unshift({ type, color });
        if (lastRareAsteroids.length > maxRareAsteroidsDisplayed) {
            lastRareAsteroids.pop();
        }
    }

    if (lastRareAsteroids.length === 3 &&
        lastRareAsteroids.every(asteroid => asteroid.type === 'exploding')) {
        triggerMegaExplosion();
        // Clear the lastRareAsteroids array after triggering mega explosion
        lastRareAsteroids = [];
    }

}

function triggerMegaExplosion() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const megaExplosionRadius = Math.min(canvas.width, canvas.height) / 2;
    const megaExplosionDamage = 100; // Adjust this value as needed

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

function applyFreezeEffect(x, y, radius = 1000) {
    const freezeRadius = radius;
    for (let i = 0; i < asteroids.length; i++) {
        let dx = asteroids[i].x - x;
        let dy = asteroids[i].y - y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < freezeRadius) {
            asteroids[i].dx *= 0.5;
            asteroids[i].dy *= 0.5;
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
        fireChainLightning(target, 3);
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



// Initialize acid areas array
