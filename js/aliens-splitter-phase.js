// Aliens: Splitter and Phase Wraith
// ----------------------------------
// This file defines two new alien types that begin to appear from wave 23.
// They are added on top of the existing alien system without requiring any
// core-file modifications.  The required hooks are patched at runtime.
//
// • Splitter – on destruction it splits into two smaller Splitter aliens
//               (green vector art: icons/aliens/alien_splitter.png).
// • Phase Wraith – intermittently phases in/out becoming translucent and
//                  moves towards the player (green vector art:
//                  icons/aliens/alien_phase_wraith.png).
// ----------------------------------------------------------------------

// --- Image Assets ------------------------------------------------------
const splitterAlienImage = new Image();
splitterAlienImage.src = 'icons/aliens/alien_splitter.png';

const phaseWraithAlienImage = new Image();
phaseWraithAlienImage.src = 'icons/aliens/alien_phase_wraith.png';

// --- Extend SwarmingAlienTypes ----------------------------------------
const ExtraAlienTypes = {
    SPLITTER: {
        hitpoints: 3,
        color: 'lime',
        speed: 0.4,
        splitCount: 2, // number of child aliens spawned on death
        image: splitterAlienImage
    },
    PHASE_WRAITH: {
        hitpoints: 4,
        color: 'lightgreen',
        speed: 0.45,
        phaseDuration: 90,  // frames invisible
        solidDuration: 120, // frames visible / vulnerable
        image: phaseWraithAlienImage
    }
};

// Merge with existing SwarmingAlienTypes (defined in aliens.js)
if (typeof SwarmingAlienTypes !== 'undefined') {
    Object.assign(SwarmingAlienTypes, ExtraAlienTypes);
}

// --- Helper Spawn Functions -------------------------------------------
function spawnSplitterAliens(count) {
    for (let i = 0; i < count; i++) {
        const spawnEdge = Math.floor(Math.random() * 4); // 0‑top 1‑right 2‑bottom 3‑left
        let x, y;
        switch (spawnEdge) {
            case 0: x = Math.random() * canvas.width;            y = -20; break;
            case 1: x = canvas.width + 20;                      y = Math.random() * canvas.height; break;
            case 2: x = Math.random() * canvas.width;            y = canvas.height + 20; break;
            case 3: x = -20;                                    y = Math.random() * canvas.height; break;
        }
        aliens.push({
            x,
            y,
            size: 28,
            speed: ExtraAlienTypes.SPLITTER.speed,
            hitpoints: ExtraAlienTypes.SPLITTER.hitpoints,
            type: SwarmingAlienTypes.SPLITTER,
            image: ExtraAlienTypes.SPLITTER.image
        });
    }
}

function spawnPhaseWraithAliens(count) {
    for (let i = 0; i < count; i++) {
        aliens.push({
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height / 3),
            size: 32,
            speed: ExtraAlienTypes.PHASE_WRAITH.speed,
            hitpoints: ExtraAlienTypes.PHASE_WRAITH.hitpoints,
            type: SwarmingAlienTypes.PHASE_WRAITH,
            image: ExtraAlienTypes.PHASE_WRAITH.image,
            phaseTimer: 0,
            phasedOut: false
        });
    }
}

// --- Behaviour Updates -------------------------------------------------
function updateSplitterPhaseAliens() {
    // Iterate backwards so we can safely remove aliens inside the loop
    for (let i = aliens.length - 1; i >= 0; i--) {
        const alien = aliens[i];

        if (alien.type === SwarmingAlienTypes.SPLITTER) {
            // Basic homing movement (similar to HUNTING)
            const dx = ship.x - alien.x;
            const dy = ship.y - alien.y;
            const angle = Math.atan2(dy, dx);
            alien.x += Math.cos(angle) * alien.speed;
            alien.y += Math.sin(angle) * alien.speed;

            // Wrap around edges
            if (alien.x < 0) alien.x = canvas.width;
            else if (alien.x > canvas.width) alien.x = 0;
            if (alien.y < 0) alien.y = canvas.height;
            else if (alien.y > canvas.height) alien.y = 0;

            // Split on death
            if (alien.hitpoints <= 0) {
                createExplosion(alien.x, alien.y);
                for (let c = 0; c < ExtraAlienTypes.SPLITTER.splitCount; c++) {
                    aliens.push({
                        x: alien.x + (Math.random() - 0.5) * 30,
                        y: alien.y + (Math.random() - 0.5) * 30,
                        size: alien.size * 0.6,
                        speed: alien.speed * 1.3,
                        hitpoints: 1,
                        type: SwarmingAlienTypes.SPLITTER,
                        image: ExtraAlienTypes.SPLITTER.image
                    });
                }
                aliens.splice(i, 1);
                addScore(75);
                continue;
            }
        } else if (alien.type === SwarmingAlienTypes.PHASE_WRAITH) {
            // Phase timer handling
            alien.phaseTimer++;
            if (!alien.phasedOut && alien.phaseTimer >= ExtraAlienTypes.PHASE_WRAITH.solidDuration) {
                alien.phasedOut = true;
                alien.phaseTimer = 0;
            } else if (alien.phasedOut && alien.phaseTimer >= ExtraAlienTypes.PHASE_WRAITH.phaseDuration) {
                alien.phasedOut = false;
                alien.phaseTimer = 0;
            }

            // Movement (only when solid so player can anticipate)
            if (!alien.phasedOut) {
                const dx = ship.x - alien.x;
                const dy = ship.y - alien.y;
                const angle = Math.atan2(dy, dx);
                alien.x += Math.cos(angle) * alien.speed;
                alien.y += Math.sin(angle) * alien.speed;
            }

            // Wrap
            if (alien.x < 0) alien.x = canvas.width;
            else if (alien.x > canvas.width) alien.x = 0;
            if (alien.y < 0) alien.y = canvas.height;
            else if (alien.y > canvas.height) alien.y = 0;

            // Death & effects
            if (alien.hitpoints <= 0) {
                createExplosion(alien.x, alien.y);
                aliens.splice(i, 1);
                addScore(100);
                continue;
            }
        }
    }
}

// --- Drawing overlay (for phased‑out transparency) --------------------
function drawPhaseWraithOverlay(ctxRef) {
    aliens.forEach(alien => {
        if (alien.type === SwarmingAlienTypes.PHASE_WRAITH && alien.phasedOut) {
            ctxRef.save();
            ctxRef.globalAlpha = 0.25; // ghost‑like transparency
            ctxRef.drawImage(alien.image, alien.x - alien.size / 2, alien.y - alien.size / 2, alien.size, alien.size);
            ctxRef.restore();
        }
    });
}

// --- Runtime Patching --------------------------------------------------
// Attach new behaviour into the existing game loop without altering core files.

if (typeof spawnAliens === 'function') {
    const _spawnAliens = spawnAliens;
    spawnAliens = function (wave) {
        _spawnAliens(wave);
        if (wave >= 23) {
            if (wave % 6 === 0) {
                spawnSplitterAliens(Math.max(1, Math.floor(wave / 12)));
            }
            if (wave % 8 === 0) {
                spawnPhaseWraithAliens(Math.max(1, Math.floor(wave / 16)));
            }
        }
    };
}

if (typeof updateAliens === 'function') {
    const _updateAliens = updateAliens;
    updateAliens = function () {
        _updateAliens();
        updateSplitterPhaseAliens();
    };
}

if (typeof drawAliens === 'function') {
    const _drawAliens = drawAliens;
    drawAliens = function (time) {
        _drawAliens(time);
        // Phase Wraith overlay (drawn after main alien rendering to apply transparency)
        drawPhaseWraithOverlay(ctx);
    };
}

console.log('Splitter & Phase Wraith alien module loaded.');
