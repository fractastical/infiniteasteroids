const glitchEffect = {
    update: function () {
        for (let i = 0; i < asteroids.length; i++) {
            if (Math.random() < 0.05) {
                createSmallerAsteroids(asteroids[i].x, asteroids[i].y, asteroids[i].size, asteroids[i].speed, 1);
                asteroids.splice(i, 1);
                i--;
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


const gravityBomb = {
    radius: 200,
    duration: 300,
    timer: 0,
    pull: 0.5,
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
                        const angle = Math.atan2(dy, dx);
                        asteroids[i].dx += Math.cos(angle) * this.pull;
                        asteroids[i].dy += Math.sin(angle) * this.pull;
                    }
                }
            }
        }
    },
    activate: function () {
        this.active = true;
        this.timer = this.duration;
    }
};


const asteroidSplitter = {
    chance: 0.1,
    splitCount: 2,
    update: function () {
        for (let i = asteroids.length - 1; i >= 0; i--) {
            if (Math.random() < this.chance) {
                const asteroid = asteroids[i];
                for (let j = 0; j < this.splitCount; j++) {
                    const newAsteroid = {
                        x: asteroid.x,
                        y: asteroid.y,
                        size: asteroid.size / 2,
                        speed: asteroid.speed * 1.5,
                        dx: Math.random() * 2 - 1,
                        dy: Math.random() * 2 - 1,
                        hitpoints: Math.floor(asteroid.hitpoints / 2),
                        color: asteroid.color
                    };
                    asteroids.push(newAsteroid);
                }
                asteroids.splice(i, 1);
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

const spacePotato = {
    x: 0,
    y: 0,
    radius: 100,
    slowdownFactor: 0.5,
    rotationSpeed: 0.01,
    angle: 0,
    active: false,
    update: function () {
        if (this.active) {
            this.angle += this.rotationSpeed;
            this.x = ship.x + Math.cos(this.angle) * this.radius;
            this.y = ship.y + Math.sin(this.angle) * this.radius;

            for (let i = 0; i < asteroids.length; i++) {
                const dx = this.x - asteroids[i].x;
                const dy = this.y - asteroids[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.radius) {
                    asteroids[i].speed *= this.slowdownFactor;
                }
            }

            for (let i = 0; i < aliens.length; i++) {
                const dx = this.x - aliens[i].x;
                const dy = this.y - aliens[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.radius) {
                    aliens[i].speed *= this.slowdownFactor;
                }
            }

            for (let i = 0; i < alienLasers.length; i++) {
                const dx = this.x - alienLasers[i].x;
                const dy = this.y - alienLasers[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.radius) {
                    alienLasers[i].speed *= this.slowdownFactor;
                }
            }
        }
    },
    draw: function () {
        if (this.active) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.drawImage(potatoImage, -potatoImage.width / 2, -potatoImage.height / 2);
            ctx.restore();
        }
    },
    activate: function () {
        this.active = true;
    },
    deactivate: function () {
        this.active = false;
    }
};
