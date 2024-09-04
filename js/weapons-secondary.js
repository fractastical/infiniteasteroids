const secondaryWeapons = {
    invincibilityShield: {
        name: 'Invincibility Shield',
        duration: 300, // duration in frames (e.g., 5 seconds at 60 FPS)
        cooldown: 600, // cooldown in frames (e.g., 10 seconds at 60 FPS)
        uses: 3,
        isActive: false,
        isAvailable: () => Achievements.million_score.reached,
        activate: function () {
            this.isActive = true;
        },
        deactivate: function () {
            this.isActive = false;
        },
        useWeapon: function () {
            if (this.uses > 0) {
                this.uses--;
                activateInvincibility(this.duration);
                this.cooldown = 600; // Reset cooldown after use
            } else {
                console.log('Cannot use Invincibility Shield right now.');
            }
        }
    },
    explosiveBurst: {
        name: 'Bomb',
        damage: 50,
        radius: 400, // radius of explosion
        cooldown: 500,
        uses: 3,
        isActive: true,
        isAvailable: () => true,
        activate: function () {
            this.isActive = true;
        },
        deactivate: function () {
            this.isActive = false;
        },
        useWeapon: function () {
            console.log("bursting");
            if (this.uses > 0) {
                this.uses--;
                createAreaDamage(ship.x, ship.y, this.radius, this.damage);
                createExplosion(ship.x, ship.y, 50, 15);
                this.cooldown = 500; // Reset cooldown after use
            } else {
                console.log('Cannot use Explosive Burst right now.');
            }
        }
    },
    piercingLaser: {
        name: 'Piercing Laser',
        damage: 100,
        cooldown: 400,
        uses: 5,
        isActive: false,
        isAvailable: () => Achievements.wave_60_endless.reached,
        activate: function () {
            this.isActive = true;
        },
        deactivate: function () {
            this.isActive = false;
        },
        useWeapon: function () {
            if (this.uses > 0) {
                this.uses--;
                shootPiercingLaser(ship.x, ship.y, ship.rotation, this.damage);
                this.cooldown = 400; // Reset cooldown after use
            } else {
                console.log('Cannot use Piercing Laser right now.');
            }
        }
    }
};

function selectSecondaryWeapon(weaponName) {
    Object.keys(secondaryWeapons).forEach(weapon => {
        secondaryWeapons[weapon].deactivate(); // Deactivate all weapons
    });

    secondaryWeapons[weaponName].isActive = true; // Activate the selected weapon
    console.log(`${secondaryWeapons[weaponName].name} selected as secondary weapon.`);
}

// Example of binding to keypress (assuming keys '1', '2', '3' are used to select)
document.addEventListener('keydown', (event) => {
    if (event.key === '1') {
        selectSecondaryWeapon('invincibilityShield');
    } else if (event.key === '2') {
        selectSecondaryWeapon('explosiveBurst');
    } else if (event.key === '3') {
        selectSecondaryWeapon('piercingLaser');
    }
});

function fireSecondaryWeapon() {
    console.log("firing secondary");
    const activeWeapon = Object.values(secondaryWeapons).find(weapon => weapon.isActive);
    if (activeWeapon) {
        activeWeapon.useWeapon();
    }
}

// Example of binding to a keypress (e.g., 'F' key for firing secondary weapon)
// document.addEventListener('keydown', (event) => {
//     if (event.key === 'F') {
//         fireSecondaryWeapon();
//     }
// });

function updateSecondaryWeapons() {
    Object.values(secondaryWeapons).forEach(weapon => {
        if (weapon.isActive && weapon.cooldown > 0) {
            weapon.cooldown--;
        }
    });
}

// let invincibilityTimer = 0;
// let invincible = false;

function activateInvincibility(duration) {
    invincible = true;
    invincibilityTimer = duration;

    const invincibilityInterval = setInterval(() => {
        invincibilityTimer--;
        if (invincibilityTimer <= 0) {
            invincible = false;
            clearInterval(invincibilityInterval);
        }
    }, 1000 / 60); // Assuming 60 FPS
}


function shootPiercingLaser(x, y, rotation, damage) {
    // Calculate laser direction based on the ship's rotation
    const laserX = x + 10 * Math.sin(rotation * Math.PI / 180);
    const laserY = y - 10 * Math.cos(rotation * Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(laserX, laserY);
    ctx.lineTo(laserX + 1000 * Math.sin(rotation * Math.PI / 180), laserY - 1000 * Math.cos(rotation * Math.PI / 180));
    ctx.strokeStyle = 'cyan';
    ctx.stroke();

    // Check collision with all asteroids/enemies along the laser path
    asteroids.forEach(asteroid => {
        const dist = Math.abs((asteroid.x - laserX) * Math.cos(rotation * Math.PI / 180) - (asteroid.y - laserY) * Math.sin(rotation * Math.PI / 180));
        if (dist < asteroid.size) {
            asteroid.health -= damage;
            if (asteroid.health <= 0) {
                destroyAsteroid(asteroid);
            }
        }
    });
}

function unlockWeapons() {
    Object.keys(secondaryWeapons).forEach(weapon => {
        if (secondaryWeapons[weapon].isAvailable()) {
            console.log(`${secondaryWeapons[weapon].name} is now available!`);
        }
    });
}



function displayWeaponInfo(startX, startY) {
    console.log("updating weapon info and upgrades");
    const spacing = 5;     // Space between life rectangles

    let finalX = 0;
    const activeWeapon = Object.values(secondaryWeapons).find(weapon => weapon.isActive);
    if (activeWeapon) {
        document.getElementById('secondaryWeaponInfo').innerText = `${activeWeapon.name}: ${activeWeapon.uses} uses left`;
        ctx.fillStyle = 'blue';

        for (let i = 0; i < activeWeapon.uses; i++) {
            const x = startX + (lifeWidth + spacing) * i;
            finalX = x;
            ctx.fillRect(x + 10, startY, lifeWidth, lifeHeight);
        }

    }

    if (waitAndClaimMode) {
        ctx.fillStyle = 'yellow';

        for (let i = 0; i < unclaimedLevelUps; i++) {
            const x = finalX + (lifeWidth + spacing) * i;
            ctx.fillRect(x + 10, startY, lifeWidth, lifeHeight);
        }
    }

}





