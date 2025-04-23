// Elite Alien logic – standalone augmentation module
// Adds a sinusoidal strafing "ELITE" alien type without modifying aliens.js directly.
// Include this script AFTER aliens.js or game.js in index.html.

(function () {
    // Ensure dependencies exist
    if (typeof SwarmingAlienTypes === 'undefined' || typeof spawnAliens === 'undefined' || typeof updateAliens === 'undefined') {
        console.warn('[eliteAliens] Core game objects not found – aborting. Ensure this script loads after aliens.js.');
        return;
    }

    // 1. Extend SwarmingAlienTypes with ELITE
    SwarmingAlienTypes.ELITE = {
        hitpoints: 6,
        color: 'gold',
        speed: 0.35,
        shootInterval: 140 // initial; randomised later
    };

    // 2. Spawner helper
    function spawnEliteAliens(count) {
        const size = 24;
        for (let i = 0; i < count; i++) {
            const spawnX = Math.random() * canvas.width;
            aliens.push({
                // position & movement
                x: spawnX,
                spawnX, // centre line for weave
                y: -size,
                strafePhase: Math.random() * Math.PI * 2,
                amplitude: 60,

                // stats
                size,
                speed: SwarmingAlienTypes.ELITE.speed,
                hitpoints: SwarmingAlienTypes.ELITE.hitpoints,
                type: SwarmingAlienTypes.ELITE,
                image: swarmingAlienImages[Math.floor(Math.random() * swarmingAlienImages.length)],

                // shooting
                shootTimer: 0,
                shootInterval: SwarmingAlienTypes.ELITE.shootInterval
            });
        }
    }

    // 3. Monkey‑patch spawnAliens to inject elites every 6th wave
    const originalSpawnAliens = spawnAliens;
    window.spawnAliens = function (wave) {
        originalSpawnAliens(wave);
        if (wave % 6 === 0) {
            spawnEliteAliens(Math.ceil(wave / 12)); // scale slowly with progression
        }
    };

    // 4. Movement & shooting for ELITE aliens; run before original updateAliens collisions
    const originalUpdateAliens = updateAliens;
    window.updateAliens = function () {
        // Update all elite aliens first
        aliens.forEach(alien => {
            if (alien.type === SwarmingAlienTypes.ELITE) {
                // sinusoidal weave
                alien.strafePhase += 0.05; // weave speed
                alien.y += alien.speed;
                alien.x = alien.spawnX + Math.sin(alien.strafePhase) * alien.amplitude;

                // vertical wrap
                if (alien.y > canvas.height) alien.y = -alien.size;

                // horizontal clamp
                if (alien.x < 0) alien.x = 0;
                if (alien.x > canvas.width) alien.x = canvas.width;

                // shooting
                alien.shootTimer++;
                if (alien.shootTimer >= alien.shootInterval) {
                    alien.shootTimer = 0;
                    shootAlienLaser(alien);
                    alien.shootInterval = Math.random() * 4000 + 1000;
                }
            }
        });

        // Continue with original logic (handles collisions, other types)
        originalUpdateAliens();
    };

    console.log('[eliteAliens] Module initialised – ELITE enemies will spawn every 6th wave.');
})();
