
let basicShip = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    size: 20,
    speed: 0,
    acceleration: 0.09,
    deceleration: 0.98,
    maxSpeed: 3,
    rotation: 0,
    rotationSpeed: 2.5,
    lasers: [],
    velocityX: 0,
    velocityY: 0,
    laserLevel: 1,
    accelerationLevel: 1,
    rotationSpeedLevel: 1,
    maxBulletsLevel: 1,
    explosiveLaserLevel: 0,
    laserCooldown: 30,
    laserTimer: 0,
    laserCooldownLevel: 1,

};


const ships = {
    basic: {
        name: 'Basic',
        lives: 3,
        laserLevel: 1,
        weaponSlots: 1,
        upgradeSlots: 1,
        draw: drawBasicShip,
        condition: () => true // Always available
    },
    starHawk: {
        name: 'Starhawk',
        lives: 3,
        laserLevel: 5,
        weaponSlots: 6,
        upgradeSlots: 3,
        draw: drawStarHawk,
        condition: () => Achievements.reach_wave_2.reached
    },
    voidWarden: {
        name: 'Void Warden',
        lives: 4,
        laserLevel: 4,
        weaponSlots: 4,
        upgradeSlots: 2,
        draw: drawVoidWarden,
        condition: () => Achievements.reach_wave_2.reached
    },
    solarPhoenix: {
        name: 'Solar Phoenix',
        lives: 5,
        laserLevel: 3,
        weaponSlots: 3,
        upgradeSlots: 3,
        draw: drawSolarPhoenix,
        condition: () => Achievements.reach_wave_2.reached
    },
    quantumStriker: {
        name: 'Quantum Striker',
        lives: 2,
        laserLevel: 6,
        weaponSlots: 5,
        upgradeSlots: 2,
        draw: drawQuantumStriker,
        condition: () => Achievements.reach_wave_2.reached,
        shoot: shootShotgunStyle // Add custom shooting function
    }
};



function drawShieldShip() {
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(10, 10);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.strokeStyle = 'green';
    ctx.stroke();

    // Draw blast shield
    ctx.beginPath();
    ctx.arc(0, 0, 20, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = 'blue';
    ctx.stroke();
}



function drawBasicShip() {
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(10, 10);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.strokeStyle = 'white';
    ctx.stroke();
}


function drawStarHawk() {
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(10, 10);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.strokeStyle = 'red';
    ctx.stroke();
}

function drawVoidWarden() {
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(12, 12);
    ctx.lineTo(-12, 12);
    ctx.closePath();
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    // Draw blast shield
    ctx.beginPath();
    ctx.arc(0, 0, 25, Math.PI, 2 * Math.PI);
    ctx.strokeStyle = 'cyan';
    ctx.stroke();
}

function drawSolarPhoenix() {
    // ctx.save();
    // ctx.translate(ship.x, ship.y);
    // ctx.rotate(ship.rotation * Math.PI / 180);

    // Main body
    ctx.beginPath();
    ctx.moveTo(0, -20); // Nose
    ctx.lineTo(15, 15); // Right wing tip
    ctx.lineTo(-15, 15); // Left wing tip
    ctx.closePath();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
    ctx.fillStyle = 'orange';
    ctx.fill();

    // Inner body triangle
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(10, 10);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.strokeStyle = 'red';
    ctx.stroke();
    ctx.fillStyle = 'red';
    ctx.fill();

    // Left flame
    ctx.beginPath();
    ctx.moveTo(-7, 15);
    ctx.lineTo(-10, 30);
    ctx.lineTo(-4, 15);
    ctx.closePath();
    ctx.strokeStyle = 'yellow';
    ctx.stroke();
    ctx.fillStyle = 'yellow';
    ctx.fill();

    // Right flame
    ctx.beginPath();
    ctx.moveTo(7, 15);
    ctx.lineTo(10, 30);
    ctx.lineTo(4, 15);
    ctx.closePath();
    ctx.strokeStyle = 'yellow';
    ctx.stroke();
    ctx.fillStyle = 'yellow';
    ctx.fill();

    // Center flame
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(3, 30);
    ctx.lineTo(-3, 30);
    ctx.closePath();
    ctx.strokeStyle = 'yellow';
    ctx.stroke();
    ctx.fillStyle = 'yellow';
    ctx.fill();

    ctx.restore();
}

function drawNebulaGhost() {
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(10, 10);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.strokeStyle = 'purple';
    ctx.globalAlpha = 0.5; // Semi-transparent
    ctx.stroke();
    ctx.globalAlpha = 1.0;
}

function drawQuantumStriker() {
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(12, 15);
    ctx.lineTo(-12, 15);
    ctx.closePath();
    ctx.strokeStyle = 'silver';
    ctx.stroke();
    // Draw quantum effects
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.strokeStyle = 'cyan';
    ctx.stroke();
}
