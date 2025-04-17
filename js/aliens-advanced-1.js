// Load new alien images
const ninjaAlienImage = new Image();
ninjaAlienImage.src = 'icons/aliens/alien_ninja_ship.png';

const teleporterAlienImage = new Image();
teleporterAlienImage.src = 'icons/aliens/alien_teleporter.png';

const shieldAlienImage = new Image();
shieldAlienImage.src = 'icons/aliens/alien_shield_ship.png';

const bomberAlienImage = new Image();
bomberAlienImage.src = 'icons/aliens/alien_bomber.png';

const laserGridAlienImage = new Image();
laserGridAlienImage.src = 'icons/aliens/alien_grid_ship.png';

// Add new alien types to SwarmingAlienTypes
const NewAlienTypes = {
    NINJA: { 
        hitpoints: 3, 
        color: 'indigo', 
        speed: 0.9, 
        vanishDuration: 60,
        attackCooldown: 180,
        image: ninjaAlienImage
    },
    TELEPORTER: { 
        hitpoints: 2, 
        color: 'orange', 
        speed: 0.4, 
        teleportInterval: 240,
        attackCooldown: 120,
        image: teleporterAlienImage
    },
    SHIELD: { 
        hitpoints: 8, 
        color: 'gold', 
        speed: 0.3, 
        shieldActive: true,
        shieldHitpoints: 10,
        attackCooldown: 300,
        image: shieldAlienImage
    },
    BOMBER: { 
        hitpoints: 5, 
        color: 'crimson', 
        speed: 0.25, 
        bombCooldown: 360,
        explosionRadius: 80,
        image: bomberAlienImage
    },
    LASERGRID: { 
        hitpoints: 6, 
        color: 'lime', 
        speed: 0.2, 
        gridCooldown: 420,
        gridSize: 4,
        gridSpacing: 50,
        image: laserGridAlienImage
    }
};

// Merge new alien types with existing ones
Object.assign(SwarmingAlienTypes, NewAlienTypes);

// Functions to spawn specific alien types
function spawnNinjaAliens(count) {
    for (let i = 0; i < count; i++) {
        const spawnEdge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
        let x, y;
        
        // Spawn from screen edges
        switch(spawnEdge) {
            case 0: // top
                x = Math.random() * canvas.width;
                y = -20;
                break;
            case 1: // right
                x = canvas.width + 20;
                y = Math.random() * canvas.height;
                break;
            case 2: // bottom
                x = Math.random() * canvas.width;
                y = canvas.height + 20;
                break;
            case 3: // left
                x = -20;
                y = Math.random() * canvas.height;
                break;
        }
        
        const newNinjaAlien = {
            x: x,
            y: y,
            size: 25,
            speed: SwarmingAlienTypes.NINJA.speed,
            hitpoints: SwarmingAlienTypes.NINJA.hitpoints,
            type: SwarmingAlienTypes.NINJA,
            image: SwarmingAlienTypes.NINJA.image,
            vanished: false,
            vanishTimer: 0,
            attackTimer: 0,
            lastX: x,
            lastY: y
        };
        
        aliens.push(newNinjaAlien);
    }
}

function spawnTeleporterAliens(count) {
    for (let i = 0; i < count; i++) {
        const newTeleporterAlien = {
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height / 4),
            size: 30,
            speed: SwarmingAlienTypes.TELEPORTER.speed,
            hitpoints: SwarmingAlienTypes.TELEPORTER.hitpoints,
            type: SwarmingAlienTypes.TELEPORTER,
            image: SwarmingAlienTypes.TELEPORTER.image,
            teleportTimer: 0,
            attackTimer: 0,
            lastPosition: { x: 0, y: 0 },
            teleporting: false,
            teleportDuration: 20
        };
        
        aliens.push(newTeleporterAlien);
    }
}

function spawnShieldAliens(count) {
    for (let i = 0; i < count; i++) {
        const newShieldAlien = {
            x: 50 + Math.random() * (canvas.width - 100),
            y: 50 + Math.random() * (canvas.height / 4),
            size: 35,
            speed: SwarmingAlienTypes.SHIELD.speed,
            hitpoints: SwarmingAlienTypes.SHIELD.hitpoints,
            type: SwarmingAlienTypes.SHIELD,
            image: SwarmingAlienTypes.SHIELD.image,
            shieldActive: true,
            shieldHitpoints: SwarmingAlienTypes.SHIELD.shieldHitpoints,
            attackTimer: 0
        };
        
        aliens.push(newShieldAlien);
    }
}

function spawnBomberAliens(count) {
    for (let i = 0; i < count; i++) {
        const newBomberAlien = {
            x: Math.random() * canvas.width,
            y: Math.random() * (canvas.height / 3),
            size: 40,
            speed: SwarmingAlienTypes.BOMBER.speed,
            hitpoints: SwarmingAlienTypes.BOMBER.hitpoints,
            type: SwarmingAlienTypes.BOMBER,
            image: SwarmingAlienTypes.BOMBER.image,
            bombTimer: 0,
            targetX: 0,
            targetY: 0,
            bombing: false,
            bombDroptime: 60
        };
        
        aliens.push(newBomberAlien);
    }
}

function spawnLaserGridAliens(count) {
    for (let i = 0; i < count; i++) {
        const newLaserGridAlien = {
            x: 100 + Math.random() * (canvas.width - 200),
            y: 50 + Math.random() * (canvas.height / 5),
            size: 45,
            speed: SwarmingAlienTypes.LASERGRID.speed,
            hitpoints: SwarmingAlienTypes.LASERGRID.hitpoints,
            type: SwarmingAlienTypes.LASERGRID,
            image: SwarmingAlienTypes.LASERGRID.image,
            gridTimer: 0,
            firingGrid: false,
            gridDuration: 90
        };
        
        aliens.push(newLaserGridAlien);
    }
}

// Update function for all new aliens
function updateNewAliens() {
    aliens.forEach((alien, index) => {
        if (!freezeEffect.active) {
            // Handle each new alien type
            if (alien.type === SwarmingAlienTypes.NINJA) {
                updateNinjaAlien(alien);
            } else if (alien.type === SwarmingAlienTypes.TELEPORTER) {
                updateTeleporterAlien(alien);
            } else if (alien.type === SwarmingAlienTypes.SHIELD) {
                updateShieldAlien(alien);
            } else if (alien.type === SwarmingAlienTypes.BOMBER) {
                updateBomberAlien(alien);
            } else if (alien.type === SwarmingAlienTypes.LASERGRID) {
                updateLaserGridAlien(alien);
            }
            
            // Collision with player (for all alien types)
            if (!invincible && isColliding(alien, ship)) {
                processPlayerDeath();
            }
        }
    });
}

// Individual update functions for each alien type
function updateNinjaAlien(alien) {
    // Store last known position when visible
    if (!alien.vanished) {
        alien.lastX = alien.x;
        alien.lastY = alien.y;
    }
    
    // Vanish ability
    alien.vanishTimer++;
    if (alien.vanishTimer >= SwarmingAlienTypes.NINJA.vanishDuration) {
        alien.vanished = !alien.vanished;
        alien.vanishTimer = 0;
        
        // When reappearing, position closer to player
        if (!alien.vanished) {
            const angle = Math.atan2(ship.y - alien.y, ship.x - alien.x);
            alien.x = ship.x - Math.cos(angle) * 150;
            alien.y = ship.y - Math.sin(angle) * 150;
        }
    }
    
    // Only move and attack when visible
    if (!alien.vanished) {
        // Chase player
        const dx = ship.x - alien.x;
        const dy = ship.y - alien.y;
        const angle = Math.atan2(dy, dx);
        
        alien.x += Math.cos(angle) * alien.speed;
        alien.y += Math.sin(angle) * alien.speed;
        
        // Attack - quick dash toward player
        alien.attackTimer++;
        if (alien.attackTimer >= SwarmingAlienTypes.NINJA.attackCooldown) {
            alien.attackTimer = 0;
            
            // Create trail effect
            for (let i = 0; i < 10; i++) {
                createParticle(
                    alien.x, 
                    alien.y, 
                    Math.cos(angle) * 2, 
                    Math.sin(angle) * 2, 
                    10, 
                    'indigo'
                );
            }
            
            // Move quickly toward player
            alien.x += Math.cos(angle) * 100;
            alien.y += Math.sin(angle) * 100;
            
            // Shoot after dash
            shootAlienLaser(alien);
        }
    }
    
    // Screen wrapping
    if (alien.x < 0) alien.x = canvas.width;
    else if (alien.x > canvas.width) alien.x = 0;
    if (alien.y < 0) alien.y = canvas.height;
    else if (alien.y > canvas.height) alien.y = 0;
}

function updateTeleporterAlien(alien) {
    // If currently teleporting
    if (alien.teleporting) {
        alien.teleportDuration--;
        
        // Create teleport effect
        createParticle(
            alien.lastPosition.x + (Math.random() - 0.5) * 20, 
            alien.lastPosition.y + (Math.random() - 0.5) * 20, 
            (Math.random() - 0.5) * 2, 
            (Math.random() - 0.5) * 2, 
            30, 
            'orange'
        );
        
        // Finish teleporting
        if (alien.teleportDuration <= 0) {
            alien.teleporting = false;
            alien.teleportDuration = 20;
            
            // Shoot immediately after teleporting
            for (let i = 0; i < 8; i++) {
                const spreadAngle = (i * Math.PI / 4);
                alienLasers.push({
                    x: alien.x,
                    y: alien.y,
                    dx: Math.cos(spreadAngle) * alienLaserSpeed,
                    dy: Math.sin(spreadAngle) * alienLaserSpeed
                });
            }
            playAlienLaserSound();
        }
        return;
    }

    // Normal movement
    const dx = ship.x - alien.x;
    const dy = ship.y - alien.y;
    const angle = Math.atan2(dy, dx);
    alien.x += Math.cos(angle) * alien.speed;
    alien.y += Math.sin(angle) * alien.speed;
    
    // Teleport ability
    alien.teleportTimer++;
    if (alien.teleportTimer >= SwarmingAlienTypes.TELEPORTER.teleportInterval) {
        alien.teleportTimer = 0;
        alien.lastPosition = { x: alien.x, y: alien.y };
        alien.teleporting = true;
        
        // Calculate new position close to player but not too close
        const teleportDistance = 150 + Math.random() * 100;
        const teleportAngle = Math.random() * Math.PI * 2;
        alien.x = ship.x + Math.cos(teleportAngle) * teleportDistance;
        alien.y = ship.y + Math.sin(teleportAngle) * teleportDistance;
        
        // Keep within screen bounds
        alien.x = Math.max(20, Math.min(canvas.width - 20, alien.x));
        alien.y = Math.max(20, Math.min(canvas.height - 20, alien.y));
    }
    
    // Regular attacks
    alien.attackTimer++;
    if (alien.attackTimer >= SwarmingAlienTypes.TELEPORTER.attackCooldown) {
        alien.attackTimer = 0;
        shootAlienLaser(alien);
    }
}

function updateShieldAlien(alien) {
    // Move slower when shield is active
    const speedModifier = alien.shieldActive ? 0.6 : 1.2;
    
    const dx = ship.x - alien.x;
    const dy = ship.y - alien.y;
    const angle = Math.atan2(dy, dx);
    alien.x += Math.cos(angle) * alien.speed * speedModifier;
    alien.y += Math.sin(angle) * alien.speed * speedModifier;
    
    // Regular attacks
    alien.attackTimer++;
    if (alien.attackTimer >= SwarmingAlienTypes.SHIELD.attackCooldown) {
        alien.attackTimer = 0;
        
        // Special attack - shoots three lasers in a spread
        const spreadAngle = Math.PI / 8;
        for (let i = -1; i <= 1; i++) {
            const fireAngle = angle + (i * spreadAngle);
            alienLasers.push({
                x: alien.x,
                y: alien.y,
                dx: Math.cos(fireAngle) * alienLaserSpeed,
                dy: Math.sin(fireAngle) * alienLaserSpeed
            });
        }
        playAlienLaserSound();
        
        // Drop shield temporarily after firing
        alien.shieldActive = false;
        setTimeout(() => {
            if (alien && alien.hitpoints > 0) {
                alien.shieldActive = true;
                alien.shieldHitpoints = SwarmingAlienTypes.SHIELD.shieldHitpoints;
            }
        }, 2000);
    }
    
    // Regenerate shield if it's been destroyed
    if (!alien.shieldActive && Math.random() < 0.001) {
        alien.shieldActive = true;
        alien.shieldHitpoints = SwarmingAlienTypes.SHIELD.shieldHitpoints;
    }
    
    // Screen wrapping
    if (alien.x < 0) alien.x = canvas.width;
    else if (alien.x > canvas.width) alien.x = 0;
    if (alien.y < 0) alien.y = canvas.height;
    else if (alien.y > canvas.height) alien.y = 0;
}

function updateBomberAlien(alien) {
    // Move in a more deliberate pattern
    const dx = ship.x - alien.x;
    const dy = ship.y - alien.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Stay at a certain distance from player
    const idealDistance = 200;
    let angle = Math.atan2(dy, dx);
    
    if (distance < idealDistance) {
        // Move away from player
        angle += Math.PI;
    }
    
    alien.x += Math.cos(angle) * alien.speed;
    alien.y += Math.sin(angle) * alien.speed;
    
    // Bombing logic
    alien.bombTimer++;
    if (alien.bombTimer >= SwarmingAlienTypes.BOMBER.bombCooldown && !alien.bombing) {
        alien.bombTimer = 0;
        alien.bombing = true;
        alien.targetX = ship.x;
        alien.targetY = ship.y;
        
        // Visual indicator that bomb is being prepared
        createParticle(alien.x, alien.y, 0, 0, 30, 'yellow', 30);
    }
    
    if (alien.bombing) {
        alien.bombDroptime--;
        
        // Countdown visual effect
        if (alien.bombDroptime % 10 === 0) {
            createParticle(alien.x, alien.y, 0, 0, 10, 'yellow', 10);
        }
        
        if (alien.bombDroptime <= 0) {
            dropBomb(alien);
            alien.bombing = false;
            alien.bombDroptime = 60;
        }
    }
    
    // Screen wrapping
    if (alien.x < 0) alien.x = canvas.width;
    else if (alien.x > canvas.width) alien.x = 0;
    if (alien.y < 0) alien.y = canvas.height;
    else if (alien.y > canvas.height) alien.y = 0;
}

function updateLaserGridAlien(alien) {
    // Move slowly in a circular pattern
    const time = Date.now() * 0.001;
    if (!alien.firingGrid) {
        alien.x += Math.sin(time) * alien.speed;
        alien.y += Math.cos(time) * alien.speed * 0.5;
        
        // Keep within reasonable bounds
        if (alien.x < 50) alien.x = 50;
        if (alien.x > canvas.width - 50) alien.x = canvas.width - 50;
        if (alien.y < 50) alien.y = 50;
        if (alien.y > canvas.height / 2) alien.y = canvas.height / 2;
    }
    
    // Grid attack logic
    alien.gridTimer++;
    if (alien.gridTimer >= SwarmingAlienTypes.LASERGRID.gridCooldown && !alien.firingGrid) {
        alien.gridTimer = 0;
        alien.firingGrid = true;
        createLaserGrid(alien);
    }
    
    if (alien.firingGrid) {
        alien.gridDuration--;
        
        // Visual effect while grid is active
        if (alien.gridDuration % 5 === 0) {
            createParticle(
                alien.x + (Math.random() - 0.5) * 40, 
                alien.y + (Math.random() - 0.5) * 40, 
                0, 0, 15, 'lime', 10
            );
        }
        
        if (alien.gridDuration <= 0) {
            alien.firingGrid = false;
            alien.gridDuration = 90;
        }
    }
}

// Helper functions for new alien abilities
function dropBomb(alien) {
    // Create bomb effect
    createExplosion(alien.targetX, alien.targetY, SwarmingAlienTypes.BOMBER.explosionRadius);
    
    // Check if player is in explosion radius
    const dx = ship.x - alien.targetX;
    const dy = ship.y - alien.targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < SwarmingAlienTypes.BOMBER.explosionRadius && !invincible) {
        processPlayerDeath();
    }
    
    // Play explosion sound
    playExplosionSound();
}

function createLaserGrid(alien) {
    const gridSize = SwarmingAlienTypes.LASERGRID.gridSize;
    const spacing = SwarmingAlienTypes.LASERGRID.gridSpacing;
    
    // Create horizontal grid lines
    for (let i = 0; i < gridSize; i++) {
        const y = alien.y + (i - Math.floor(gridSize/2)) * spacing;
        
        for (let x = 0; x < canvas.width; x += 10) {
            alienLasers.push({
                x: x,
                y: y,
                dx: alienLaserSpeed,
                dy: 0,
                isGridLaser: true
            });
        }
    }
    
    // Create vertical grid lines
    for (let i = 0; i < gridSize; i++) {
        const x = alien.x + (i - Math.floor(gridSize/2)) * spacing;
        
        for (let y = 0; y < canvas.height; y += 10) {
            alienLasers.push({
                x: x,
                y: y,
                dx: 0,
                dy: alienLaserSpeed,
                isGridLaser: true
            });
        }
    }
    
    playAlienLaserSound();
}

// Drawing functions for new aliens
function drawNewAliens() {
    aliens.forEach(alien => {
        // Skip drawing ninja aliens when vanished
        if (alien.type === SwarmingAlienTypes.NINJA && alien.vanished) {
            return;
        }
        
        // Skip drawing teleporter aliens during teleport
        if (alien.type === SwarmingAlienTypes.TELEPORTER && alien.teleporting) {
            return;
        }
        
        ctx.save();
        ctx.translate(alien.x, alien.y);
        
        // Draw shield for shield aliens
        if (alien.type === SwarmingAlienTypes.SHIELD && alien.shieldActive) {
            ctx.beginPath();
            ctx.arc(0, 0, alien.size * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.fill();
            ctx.strokeStyle = 'gold';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw bombing target for bomber aliens
        if (alien.type === SwarmingAlienTypes.BOMBER && alien.bombing) {
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, alien.size * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 50, 50, 0.2)';
            ctx.fill();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Draw grid effect for laser grid aliens
        if (alien.type === SwarmingAlienTypes.LASERGRID && alien.firingGrid) {
            ctx.beginPath();
            ctx.arc(0, 0, alien.size * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
            ctx.fill();
            ctx.strokeStyle = 'lime';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Calculate angle to face the player's ship
        const dx = ship.x - alien.x;
        const dy = ship.y - alien.y;
        const angle = Math.atan2(dy, dx) + Math.PI / 2; // Add 90 degrees
        
        // Rotate the context
        ctx.rotate(angle);
        
        // Draw the alien image
        ctx.drawImage(alien.image, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
        
        ctx.restore();
    });
}

// Special drawing for alien lasers
function drawAlienLasers(time = currentTime) {
    alienLasers.forEach((laser, i) => {
        ctx.save();
        
        // Special formatting for grid lasers
        if (laser.isGridLaser) {
            const pulseFactor = Math.sin(time * 5) * 0.2 + 0.8;
            ctx.fillStyle = 'lime';
            ctx.globalAlpha = 0.7 * pulseFactor;
            ctx.fillRect(laser.x - 1, laser.y - 1, 2, 2);
        }
        // Special formatting for ink
        else if (laser.isInk) {
            ctx.fillStyle = 'purple';
            ctx.beginPath();
            ctx.arc(laser.x, laser.y, laser.size || alienLaserSize, 0, Math.PI * 2);
            ctx.fill();
        }
        // Standard lasers (existing code)
        else {
            const pulseFactor = Math.sin(time * 3 + i) * 0.2 + 0.8;
            
            if (!fpsThrottleMode) {
                const gradient = ctx.createRadialGradient(
                    laser.x, laser.y, 0,
                    laser.x, laser.y, alienLaserSize * 2
                );
                
                gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.globalAlpha = 0.7 * pulseFactor;
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(laser.x, laser.y, alienLaserSize, 0, Math.PI * 2);
                ctx.fill();
            }
            
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
        }
        
        ctx.globalAlpha = 1;
        ctx.restore();
    });
}

// Particle system implementation
let particles = [];

function createParticle(x, y, dx, dy, size, color, life = 30) {
    particles.push({
        x: x,
        y: y,
        dx: dx,
        dy: dy,
        size: size,
        color: color,
        life: life,
        maxLife: life
    });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Update position
        particle.x += particle.dx;
        particle.y += particle.dy;
        
        // Decrease life
        particle.life--;
        
        // Remove dead particles
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.life / particle.maxLife;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * (particle.life / particle.maxLife), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

// Integration with main game loop

// Function to spawn powerups (integrate with your existing powerup system)
function spawnPowerup(x, y) {
    // This should be connected to your existing powerup system
    // Basic implementation if needed:
    const powerupTypes = ['shield', 'tripleShot', 'speedBoost', 'healthUp'];
    const type = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
    
    powerups.push({
        x: x,
        y: y,
        type: type,
        size: 20,
        collected: false
    });
}

// Modify your existing game loop to include these new updates
function gameLoop() {
    // ... Your existing code
    
    updateParticles();
    
    // ... Your existing code
    
    drawParticles();
    
    // ... Your existing code
}

// Add collision detection for the special alien types
function checkLaserAlienCollisions() {
    for (let i = lasers.length - 1; i >= 0; i--) {
        const laser = lasers[i];
        
        for (let j = aliens.length - 1; j >= 0; j--) {
            const alien = aliens[j];
            
            if (isColliding(laser, alien)) {
                lasers.splice(i, 1);
                
                // Special handling for new alien types
                if (Object.values(NewAlienTypes).includes(alien.type)) {
                    handleSpecialAlienCollision(alien, laser, j);
                } else {
                    // Your existing alien collision logic
                    alien.hitpoints -= (ship.laserLevel + damageBooster);
                    
                    if (alien.hitpoints <= 0) {
                        createExplosion(alien.x, alien.y);
                        aliens.splice(j, 1);
                        addScore(50);
                    }
                }
                
                return; // Laser hit something
            }
        }
    }
}

function spawnAliens(wave) {
    // Your existing code...
    
    // Add new alien types based on wave number
    if (wave % 12 == 0) {
        spawnNinjaAliens(Math.floor(wave / 12));
    }
    
    if (wave % 15 == 0) {
        spawnTeleporterAliens(Math.floor(wave / 15));
    }
    
    if (wave % 18 == 0) {
        spawnShieldAliens(Math.floor(wave / 18));
    }
    
    if (wave % 20 == 0) {
        spawnBomberAliens(Math.floor(wave / 20));
    }
    
    if (wave % 25 == 0) {
        spawnLaserGridAliens(Math.floor(wave / 25));
    }
    
    // Mix of different alien types for variety
    if (wave > 30 && wave % 10 == 0) {
        const mixAmount = Math.floor(wave / 30);
        spawnNinjaAliens(mixAmount);
        spawnTeleporterAliens(mixAmount);
    }
    
    // Special wave combinations for higher difficulty
    if (wave >= 40 && wave % 40 == 0) {
        console.log("Spawning special combination wave!");
        const specialAmount = Math.floor(wave / 40) + 1;
        
        // Shield + Laser Grid combo
        spawnShieldAliens(specialAmount);
        spawnLaserGridAliens(specialAmount);
        
        // Create a warning message
        displayWarningMessage("SPECIAL ATTACK FORMATION DETECTED!");
    }
    
    // Your existing code...
}

// Helper function to display warning messages
function displayWarningMessage(message) {
    const warningElement = document.createElement('div');
    warningElement.innerText = message;
    warningElement.style.position = 'absolute';
    warningElement.style.top = '30%';
    warningElement.style.left = '50%';
    warningElement.style.transform = 'translate(-50%, -50%)';
    warningElement.style.color = 'red';
    warningElement.style.fontFamily = 'Arial, sans-serif';
    warningElement.style.fontSize = '24px';
    warningElement.style.fontWeight = 'bold';
    warningElement.style.textShadow = '0 0 10px #fff';
    warningElement.style.zIndex = '1000';
    document.body.appendChild(warningElement);
    
    // Remove the warning after a few seconds
    setTimeout(() => {
        document.body.removeChild(warningElement);
    }, 3000);
}

// Example integration with your existing game code

// EXAMPLE: How to modify the existing updateGame function
function updateGame() {
    // Your existing update code
    
    updateAliens();
    updateAlienLasers();
    if (superbossAlien) updateSuperBossAlien();
    if (megaBossAlien) updateMegaBossAlien();
    if (octoBoss) updateOctoBoss();
    updateParticles(); // Add this line to update particles
    
    // Your other update code
}

// EXAMPLE: How to modify the existing drawGame function
function drawGame() {
    // Your existing drawing code
    
    drawAliens();
    drawAlienLasers();
    if (superbossAlien) drawSuperBossAlien();
    if (megaBossAlien) drawMegaBossAlien();
    if (octoBoss) drawOctoBoss();
    drawParticles(); // Add this line to draw particles
    
    // Your other drawing code
}

// Modified version of your updateAliens function
function updateAliens() {
    if (!freezeEffect.active) {
        // Your existing alien update code
        aliens.forEach((alien, index) => {
            // Standard alien types from your original code
            switch (alien.type) {
                case SwarmingAlienTypes.HUNTING:
                    // Your existing HUNTING alien update code...
                    break;
                case SwarmingAlienTypes.TOP:
                case SwarmingAlienTypes.BOTTOM:
                    // Your existing TOP/BOTTOM alien update code...
                    break;
                case SwarmingAlienTypes.HORIZONTAL:
                    // Your existing HORIZONTAL alien update code...
                    break;
                case SwarmingAlienTypes.BLINKING:
                    // Your existing BLINKING alien update code...
                    break;
                case SwarmingAlienTypes.LITTLE:
                    // Your existing LITTLE alien update code...
                    break;
                    
                // New alien types
                case SwarmingAlienTypes.NINJA:
                    updateNinjaAlien(alien);
                    break;
                case SwarmingAlienTypes.TELEPORTER:
                    updateTeleporterAlien(alien);
                    break;
                case SwarmingAlienTypes.SHIELD:
                    updateShieldAlien(alien);
                    break;
                case SwarmingAlienTypes.BOMBER:
                    updateBomberAlien(alien);
                    break;
                case SwarmingAlienTypes.LASERGRID:
                    updateLaserGridAlien(alien);
                    break;
            }
            
            // Collision with player (for all alien types)
            if (!invincible && isColliding(alien, ship)) {
                processPlayerDeath();
            }
        });
    }
}

// Modified version of your drawAliens function
function drawAliens() {
    aliens.forEach(alien => {
        // Skip drawing ninja aliens when vanished
        if (alien.type === SwarmingAlienTypes.NINJA && alien.vanished) {
            return;
        }
        
        // Skip drawing teleporter aliens during teleport
        if (alien.type === SwarmingAlienTypes.TELEPORTER && alien.teleporting) {
            return;
        }
        
        ctx.save();
        ctx.translate(alien.x, alien.y);
        
        // Special rendering for new alien types
        if (alien.type === SwarmingAlienTypes.SHIELD && alien.shieldActive) {
            // Draw shield
            ctx.beginPath();
            ctx.arc(0, 0, alien.size * 1.3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.fill();
            ctx.strokeStyle = 'gold';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (alien.type === SwarmingAlienTypes.BOMBER && alien.bombing) {
            // Draw bombing indicator
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(0, 0, alien.size * 1.2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 50, 50, 0.2)';
            ctx.fill();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else if (alien.type === SwarmingAlienTypes.LASERGRID && alien.firingGrid) {
            // Draw grid effect
            ctx.beginPath();
            ctx.arc(0, 0, alien.size * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
            ctx.fill();
            ctx.strokeStyle = 'lime';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        
        // Calculate angle to face the player's ship
        const dx = ship.x - alien.x;
        const dy = ship.y - alien.y;
        const angle = Math.atan2(dy, dx) + Math.PI / 2; // Add 90 degrees
        
        // Rotate the context
        ctx.rotate(angle);
        
        // Draw the appropriate alien image
        if (alien.image) {
            ctx.drawImage(alien.image, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
        } else {
            // Default to original alien image if no specific image is assigned
            ctx.drawImage(alienImage, -alien.size / 2, -alien.size / 2, alien.size, alien.size);
        }
        
        ctx.restore();
    });
}

// Special handling for laser-alien collisions in your checkLaserAlienCollisions function
function handleSpecialAlienCollision(alien, laser, index) {
    if (alien.type === SwarmingAlienTypes.SHIELD && alien.shieldActive) {
        // Shield absorbs hit
        alien.shieldHitpoints--;
        
        // Create shield impact effect
        createParticle(
            laser.x, 
            laser.y, 
            (Math.random() - 0.5) * 2, 
            (Math.random() - 0.5) * 2, 
            15, 
            'gold'
        );
        
        // Shield breaks
        if (alien.shieldHitpoints <= 0) {
            alien.shieldActive = false;
        }
        
        return true; // Shield blocked the laser
    }
    
    // Normal collision handling
    alien.hitpoints -= (ship.laserLevel + damageBooster);
    
    if (alien.hitpoints <= 0) {
        // Special effects for different alien types when destroyed
        switch(alien.type) {
            case SwarmingAlienTypes.NINJA:
                createExplosion(alien.x, alien.y, 20, 'indigo');
                break;
                
            case SwarmingAlienTypes.TELEPORTER:
                createExplosion(alien.x, alien.y, 30, 'orange');
                // Create after-images
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        createParticle(
                            alien.x + (Math.random() - 0.5) * 30, 
                            alien.y + (Math.random() - 0.5) * 30, 
                            0, 0, 20, 'orange', 15
                        );
                    }, i * 100);
                }
                break;
                
            case SwarmingAlienTypes.SHIELD:
                createExplosion(alien.x, alien.y, 40, 'gold');
                break;
                
            case SwarmingAlienTypes.BOMBER:
                // Create a chain reaction explosion
                createExplosion(alien.x, alien.y, 30, 'crimson');
                setTimeout(() => {
                    createExplosion(alien.x, alien.y, 60, 'orange');
                }, 100);
                
                // Drop last bomb as final attack
                dropBomb(alien);
                break;
                
            case SwarmingAlienTypes.LASERGRID:
                createExplosion(alien.x, alien.y, 35, 'lime');
                
                // Final grid attack
                if (Math.random() < 0.5) {
                    const gridSize = 3;
                    const spacing = 60;
                    
                    // Create smaller final grid
                    for (let i = 0; i < gridSize; i++) {
                        const y = alien.y + (i - Math.floor(gridSize/2)) * spacing;
                        const x = alien.x + (i - Math.floor(gridSize/2)) * spacing;
                        
                        alienLasers.push({
                            x: x,
                            y: y,
                            dx: Math.cos(i * Math.PI/3) * alienLaserSpeed,
                            dy: Math.sin(i * Math.PI/3) * alienLaserSpeed,
                            isGridLaser: true
                        });
                    }
                }
                break;
                
            default:
                createExplosion(alien.x, alien.y);
        }
        
        // Add score based on alien type
        switch(alien.type) {
            case SwarmingAlienTypes.NINJA:
                addScore(100);
                break;
            case SwarmingAlienTypes.TELEPORTER:
                addScore(150);
                break;
            case SwarmingAlienTypes.SHIELD:
                addScore(200);
                break;
            case SwarmingAlienTypes.BOMBER:
                addScore(250);
                break;
            case SwarmingAlienTypes.LASERGRID:
                addScore(300);
                break;
            default:
                addScore(50);
        }
        
        // Remove the alien
        aliens.splice(index, 1);
        
        // Maybe drop a powerup
        const powerupChance = alien.type === SwarmingAlienTypes.SHIELD ? 0.2 : 0.1;
        if (Math.random() < powerupChance) {
            spawnPowerup(alien.x, alien.y);
        }
    } else {
        // Hit effect for damage
        createParticle(
            laser.x, 
            laser.y, 
            (Math.random() - 0.5) * 2, 
            (Math.random() - 0.5) * 2, 
            10, 
            'white'
        );
    }
    
    return true; // Handled collision
}