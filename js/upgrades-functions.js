
let globalTimeScale = 1;

const glitchEffect = {
    update: function () {
        for (let i = 0; i < asteroids.length; i++) {
            if (Math.random() < 0.01) {
                if (asteroids[i].hitpoints > 2) {
                    createSmallerAsteroids(asteroids[i].x, asteroids[i].y, asteroids[i].size, asteroids[i].speed, asteroids[i].hitpoints);
                    asteroids.splice(i, 1);
                    i--;
                }
                break;
            }
        }
    }
};

const timeDilation = {
    active: false,
    duration: 300,
    timer: 0,
    update: function () {
        if (this.active) {
            this.timer--;
            if (this.timer <= 0) {
                this.active = false;
            }
        }
    }
};

const spacePizza = {
    active: false,
    collectedWave: 0,
    wavesPerExtraLife: 10,
    activate: function () {
        this.active = true;
        this.collectedWave = wave;
        console.log("Space Pizza collected on wave: " + this.collectedWave);
    },
    update: function () {
        if (this.active) {
            this.checkForExtraLife();
        }
    },
    checkForExtraLife: function () {
        const wavesSinceCollection = wave - this.collectedWave;
        if (wavesSinceCollection >= this.wavesPerExtraLife) {
            this.grantExtraLife();
            this.collectedWave = wave;
        }
    },
    grantExtraLife: function () {
        lives++;
        console.log("Extra life granted! Current lives: " + lives);
    }
};

const spacePickle = {
    active: false,
    duration: 300,
    timer: 0,
    shieldStrength: 2,
    activate: function () {
        this.active = true;
        this.timer = this.duration;
        damageBooster += 10;
    },
    update: function () {
        if (this.active) {
            this.timer--;
            if (this.timer <= 0) {
                this.deactivate();
            }
        }
    },
    deactivate: function () {
        this.active = false;
        damageBooster -= 10;
    }
};



const pinkPixie = {
    active: false,
    duration: 450,
    timer: 0,
    fireRateBoost: 5,
    cooldown: 1000,
    oldCooldown: 100,
    activate: function () {
        this.active = true;
        this.timer = this.duration;
        ship.laserCooldownLevel += this.fireRateBoost;
        this.oldCooldown = ship.laserCooldown;
        ship.laserCooldown = Math.max(3, (ship.laserCooldown - this.fireRateBoost * 5));

    },
    update: function () {

        this.cooldown--;
        if (this.cooldown <= 0) {
            this.activate();
            this.cooldown = 1000;

        }
        if (this.active) {
            this.timer--;
            if (this.timer <= 0) {
                this.deactivate();
            }
        }
    },
    deactivate: function () {
        this.active = false;
        ship.laserCooldownLevel -= this.fireRateBoost;
        ship.laserCooldown = this.oldCooldown;

    }
};

const purplePixie = {
    active: false,
    duration: 450,
    timer: 0,
    fireRateBoost: 5,
    cooldown: 1000,
    activate: function () {
        this.active = true;
        this.timer = this.duration;
        damageBooster *= 2;
    },
    update: function () {

        this.cooldown--;
        if (this.cooldown <= 0) {
            this.activate();
            this.cooldown = 1000;

        }
        if (this.active) {
            this.timer--;
            if (this.timer <= 0) {
                this.deactivate();
            }
        }
    },
    deactivate: function () {
        this.active = false;
        damageBooster /= 2;

    }
};

const goldPixie = {
    active: false,
    collectedWave: 0,
    wavesPerDamageBoost: 5,
    activate: function () {
        this.active = true;
        this.collectedWave = wave;
        console.log("goldPixie collected on wave: " + this.collectedWave);
    },
    update: function () {
        if (this.active) {
            this.checkForDamageBoost();
        }
    },
    checkForDamageBoost: function () {
        const wavesSinceCollection = wave - this.collectedWave;
        if (wavesSinceCollection >= this.wavesPerExtraLife) {
            this.grantDamageBoost();
            this.collectedWave = wave;
        }
    },
    grantDamageBoost: function () {
        damageBooster++;
        console.log("Damage boost granted! Current lives: " + damageBooster);
    }
};



const spaceMonkey = {
    active: false,
    duration: 900, // 15 seconds at 60 FPS
    timer: 0,
    cooldown: 1200,
    monkeyAsteroids: [],
    activate: function () {
        console.log("Activating Space Monkey");
        this.active = true;
        this.timer = this.duration;
        this.monkeyAsteroids = []; // Clear existing monkeys
        this.spawnMonkeyAsteroids();
    },
    update: function () {


        this.cooldown--;
        if (this.cooldown <= 0) {
            this.activate();
            this.cooldown = 1200;
        }

        if (!this.active) return;

        this.timer--;
        if (this.timer <= 0) {
            this.deactivate();
            return;
        }

        try {
            this.updateMonkeyAsteroids();
        } catch (error) {
            console.error("Error in updateMonkeyAsteroids:", error);
            this.deactivate(); // Safely deactivate on error
        }
    },
    spawnMonkeyAsteroids: function () {
        console.log("Spawning monkey asteroids");
        for (let i = 0; i < 5; i++) {
            this.monkeyAsteroids.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: 30,
                speed: 2,
                angle: Math.random() * Math.PI * 2
            });
        }
        console.log(`Spawned ${this.monkeyAsteroids.length} monkey asteroids`);
    },
    updateMonkeyAsteroids: function () {
        if (!Array.isArray(this.monkeyAsteroids)) {
            console.error("monkeyAsteroids is not an array");
            return;
        }

        console.log(this.timer);

        for (let i = this.monkeyAsteroids.length - 1; i >= 0; i--) {
            let monkey = this.monkeyAsteroids[i];

            // Move monkey asteroid
            monkey.x += monkey.speed * Math.cos(monkey.angle);
            monkey.y += monkey.speed * Math.sin(monkey.angle);

            // Wrap around screen edges
            monkey.x = (monkey.x + canvas.width) % canvas.width;
            monkey.y = (monkey.y + canvas.height) % canvas.height;
            console.log("moving monkey asteroid");

            // Check for collisions with enemy asteroids
            if (Array.isArray(asteroids)) {
                for (let j = asteroids.length - 1; j >= 0; j--) {
                    let asteroid = asteroids[j];
                    let dx = monkey.x - asteroid.x;
                    let dy = monkey.y - asteroid.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < monkey.size / 2 + asteroid.size / 2) {
                        // Collision detected, remove both monkey and enemy asteroid
                        this.monkeyAsteroids.splice(i, 1);
                        asteroids.splice(j, 1);
                        console.log("Monkey asteroid collision detected");
                        break;
                    }
                }
            } else {
                console.error("asteroids is not an array");
            }
        }
    },
    draw: function () {
        console.log("brown");
        if (!this.active || !Array.isArray(this.monkeyAsteroids)) return;
        console.log("ast");

        ctx.save();
        ctx.fillStyle = 'brown';
        this.monkeyAsteroids.forEach(monkey => {
            ctx.beginPath();
            ctx.arc(monkey.x, monkey.y, monkey.size / 2, 0, Math.PI * 2);
            ctx.fill();

            console.log(monkey.x);

            // Draw a simple face
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(monkey.x - 5, monkey.y - 5, 3, 0, Math.PI * 2);
            ctx.arc(monkey.x + 5, monkey.y - 5, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(monkey.x, monkey.y + 5, 5, 0, Math.PI);
            ctx.stroke();
        });
        ctx.restore();
    },
    deactivate: function () {
        console.log("Deactivating Space Monkey");
        this.active = false;
        this.monkeyAsteroids = [];
    }
};


const darkSide = {
    active: false,
    duration: 600,
    timer: 0,
    damageMultiplier: 2,
    activate: function () {
        this.active = true;
        this.timer = this.duration;
        ship.laserDamage *= this.damageMultiplier;
        ship.color = 'purple';
    },
    update: function () {
        if (this.active) {
            this.timer--;
            if (this.timer <= 0) {
                this.deactivate();
            }
            if (Math.random() < 0.05) {
                this.spawnDarkEnergyBall();
            }
        }
    },
    spawnDarkEnergyBall: function () {
        // Implement dark energy ball spawning
    },
    deactivate: function () {
        this.active = false;
        ship.laserDamage /= this.damageMultiplier;
        ship.color = 'white';
    }
};


const gravityBomb = {
    radius: 200,
    duration: 300,
    timer: 0,
    active: false,
    update: function () {
        if (this.active) {
            this.timer--;
            if (this.timer <= 0) {
                this.active = false;
            } else {
                for (let i = 0; i < asteroids.length; i++) {
                    const dx = ship.x - asteroids[i].x;
                    const dy = ship.y - asteroids[i].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < this.radius) {


                        const currentSpeed = Math.sqrt(asteroids[i].dx * asteroids[i].dx + asteroids[i].dy * asteroids[i].dy);

                        // Calculate gravitational pull (stronger for closer asteroids)
                        const pullStrength = 0.05 * (1 - distance / this.radius);
                        const pullX = dx / distance * pullStrength;
                        const pullY = dy / distance * pullStrength;

                        // Apply gravitational pull
                        asteroids[i].dx += pullX;
                        asteroids[i].dy += pullY;

                        // Reduce speed
                        const speedReduction = 0.95; // Reduce speed by 5%
                        const newSpeed = currentSpeed * speedReduction;

                        // Calculate new velocity components
                        const newVelocityMagnitude = Math.sqrt(asteroids[i].dx * asteroids[i].dx + asteroids[i].dy * asteroids[i].dy);
                        asteroids[i].dx = (asteroids[i].dx / newVelocityMagnitude) * newSpeed;
                        asteroids[i].dy = (asteroids[i].dy / newVelocityMagnitude) * newSpeed;

                        // Optional: Add minimum speed to prevent asteroids from stopping
                        const minSpeed = 0.1;
                        if (newSpeed < minSpeed) {
                            const angle = Math.atan2(asteroids[i].dy, asteroids[i].dx);
                            asteroids[i].dx = Math.cos(angle) * minSpeed;
                            asteroids[i].dy = Math.sin(angle) * minSpeed;
                        }





                    }
                }
            }
        }
    },
    activate: function () {
        this.active = true;
        this.timer = this.duration;
    },
    getNearestCorner: function (asteroid) {
        const corners = [
            { x: 0, y: 0 }, // Top-left corner
            { x: canvas.width, y: 0 }, // Top-right corner
            { x: 0, y: canvas.height }, // Bottom-left corner
            { x: canvas.width, y: canvas.height } // Bottom-right corner
        ];
        let nearestCorner = corners[0];
        let minDistance = this.getDistance(asteroid, corners[0]);

        for (let i = 1; i < corners.length; i++) {
            const distance = this.getDistance(asteroid, corners[i]);
            if (distance < minDistance) {
                minDistance = distance;
                nearestCorner = corners[i];
            }
        }
        return nearestCorner;
    },
    getDistance: function (asteroid, corner) {
        const dx = asteroid.x - corner.x;
        const dy = asteroid.y - corner.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
};


const asteroidSplitter = {
    chance: 0.01,
    splitCount: 2,
    update: function () {
        const guess = Math.random();
        if (guess < this.chance) {
            for (let i = asteroids.length - 1; i >= 0; i--) {
                if (guess < this.chance) {
                    const asteroid = asteroids[i];
                    if (asteroid.hitpoints > 2) {

                        for (let j = 0; j < this.splitCount; j++) {
                            const newAsteroid = {
                                x: asteroid.x,
                                y: asteroid.y,
                                size: Math.max(4, asteroid.size / 2),
                                speed: asteroid.speed * 0.2,
                                dx: Math.random() * 1.5 - 1,
                                dy: Math.random() * 1.5 - 1,
                                hitpoints: Math.floor(asteroid.hitpoints / 2),
                                color: asteroid.color
                            };
                            asteroids.push(newAsteroid);
                        }
                        asteroids.splice(i, 1);
                    }

                    break;
                }
            }
        }
    }
};


const quantumTeleporter = {
    cooldown: 300,
    timer: 0,
    range: 200,
    activate: function () {
        if (this.timer === 0) {
            const nearestAsteroid = findNearestAsteroid();
            if (nearestAsteroid) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * (this.range - nearestAsteroid.size) + nearestAsteroid.size;
                nearestAsteroid.x = ship.x + Math.cos(angle) * distance;
                nearestAsteroid.y = ship.y + Math.sin(angle) * distance;
                this.timer = this.cooldown;
            }
        }
    },
    update: function () {
        if (this.timer > 0) {
            this.timer--;
        }
    }
};

function findNearestAsteroid() {
    let nearestAsteroid = null;
    let nearestDistance = Infinity;
    for (let i = 0; i < asteroids.length; i++) {
        const dx = ship.x - asteroids[i].x;
        const dy = ship.y - asteroids[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < nearestDistance) {
            nearestAsteroid = asteroids[i];
            nearestDistance = distance;
        }
    }
    return nearestAsteroid;
}

// const potatoImage = new Image();
// potatoImage.src = 'icons/upgrades/potatoroid_10.png';
// let potatoImageLoaded = false;
// potatoImage.onload = function () {
//     potatoImageLoaded = true;
// };

const spacePotato = {
    x: 0,
    y: 0,
    radius: 60, // Reduced radius for closer orbit
    slowdownFactor: 0.5,
    rotationSpeed: 0.05, // Increased for more noticeable rotation
    angle: 0,
    size: 40,
    active: false,
    update: function () {
        if (this.active) {
            this.angle += this.rotationSpeed;

            // Calculate position relative to the ship
            const offsetX = Math.cos(this.angle) * this.radius;
            const offsetY = Math.sin(this.angle) * this.radius;

            // Update potato position
            this.x = ship.x + offsetX;
            this.y = ship.y + offsetY;

            // Apply slowdown effect to nearby objects
            this.applySlowdownEffect(asteroids);
            this.applySlowdownEffect(aliens);
            this.applySlowdownEffect(alienLasers);
        }
    },
    applySlowdownEffect: function (objects) {
        for (let i = 0; i < objects.length; i++) {
            const dx = this.x - objects[i].x;
            const dy = this.y - objects[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.radius) {
                if (objects[i].speed) {
                    objects[i].speed *= this.slowdownFactor;
                }
                if (objects[i].dx && objects[i].dy) {
                    objects[i].dx *= this.slowdownFactor;
                    objects[i].dy *= this.slowdownFactor;
                }
            }
        }
    },
    draw: function () {
        console.log("po");

        if (this.active && potatoImageLoaded) {
            console.log("ta");
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.drawImage(potatoImage, -this.size / 2, -this.size / 2, this.size, this.size);

            // Optionally, draw a circle to show the slowdown effect radius
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.stroke();

            ctx.restore();
        }
    },
    activate: function () {
        this.active = true;
        this.x = ship.x;
        this.y = ship.y;
        this.angle = Math.random() * Math.PI * 2; // Start at a random angle
    },
    deactivate: function () {
        this.active = false;
    }
};