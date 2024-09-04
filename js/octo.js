const octoImage = new Image();
octoImage.src = 'icons/cool_evil_alien_22.png'; // Ensure you have this image
// megaBossAlienImage.src = ;

const octoArmImages = [];
for (let i = 1; i <= 8; i++) {
    const img = new Image();
    img.src = `icons/octo_arm_${i}.png`; // Ensure you have these images for each arm
    octoArmImages.push(img);
}

let octo = null;

function spawnOcto() {
    octo = {
        x: canvas.width / 2,
        y: 5,
        size: 100,
        speed: 0.5,
        hitpoints: 300,
        maxHitpoints: 300,
        arms: []
    };

    for (let i = 0; i < 8; i++) {
        octo.arms.push({
            length: 100,
            angle: (i / 8) * (2 * Math.PI),
            attackTimer: 0,
            attackInterval: 100 + i * 20, // Different attack intervals for each arm
            type: i % 4 // Different types of attacks
        });
    }
}

function updateOcto() {
    if (!octo) return;

    const dx = ship.x - octo.x;
    const dy = ship.y - octo.y;
    const angle = Math.atan2(dy, dx);

    octo.x += Math.cos(angle) * octo.speed;
    octo.y += Math.sin(angle) * octo.speed;

    octo.arms.forEach(arm => {
        arm.attackTimer++;
        if (arm.attackTimer >= arm.attackInterval) {
            arm.attackTimer = 0;
            performOctoArmAttack(arm);
        }
    });

    if (octo.x < 0) octo.x = canvas.width;
    else if (octo.x > canvas.width) octo.x = 0;
    if (octo.y < 0) octo.y = canvas.height;
    else if (octo.y > canvas.height) octo.y = 0;
}

function performOctoArmAttack(arm) {
    switch (arm.type) {
        case 0:
            shootOctoInk(arm);
            break;
        case 1:
            extendOctoTentacle(arm);
            break;
        case 2:
            releaseOctoBomb(arm);
            break;
        case 3:
            unleashOctoElectricShock(arm);
            break;
    }
}

let octoInkProjectiles = [];
let octoTentacles = [];
let octoBombs = [];
let octoElectricShocks = [];

function shootOctoInk(arm) {
    const inkSpeed = 2.5;
    const angleToShip = arm.angle;

    octoInkProjectiles.push({
        x: octo.x + Math.cos(arm.angle) * arm.length,
        y: octo.y + Math.sin(arm.angle) * arm.length,
        dx: Math.cos(angleToShip) * inkSpeed,
        dy: Math.sin(angleToShip) * inkSpeed
    });
}

function extendOctoTentacle(arm) {
    octoTentacles.push({
        x: octo.x,
        y: octo.y,
        length: 0,
        angle: arm.angle,
        maxLength: arm.length
    });
}

function releaseOctoBomb(arm) {
    octoBombs.push({
        x: octo.x + Math.cos(arm.angle) * arm.length,
        y: octo.y + Math.sin(arm.angle) * arm.length,
        timer: 100
    });
}

function unleashOctoElectricShock(arm) {
    octoElectricShocks.push({
        x: octo.x,
        y: octo.y,
        angle: arm.angle,
        range: arm.length,
        duration: 50
    });
}

function updateOctoProjectiles() {
    updateOctoInkProjectiles();
    updateOctoTentacles();
    updateOctoBombs();
    updateOctoElectricShocks();
}

function updateOctoInkProjectiles() {
    for (let i = octoInkProjectiles.length - 1; i >= 0; i--) {
        const ink = octoInkProjectiles[i];
        ink.x += ink.dx;
        ink.y += ink.dy;

        if (isColliding(ink, ship)) {
            processPlayerDeath();
        }

        if (ink.x < 0 || ink.x > canvas.width || ink.y < 0 || ink.y > canvas.height) {
            octoInkProjectiles.splice(i, 1);
        }
    }
}

function updateOctoTentacles() {
    octoTentacles.forEach(tentacle => {
        tentacle.length += 2;
        if (tentacle.length > tentacle.maxLength) {
            tentacle.length = tentacle.maxLength;
        }

        const endX = tentacle.x + Math.cos(tentacle.angle) * tentacle.length;
        const endY = tentacle.y + Math.sin(tentacle.angle) * tentacle.length;

        if (isColliding({ x: endX, y: endY }, ship)) {
            processPlayerDeath();
        }
    });
}

function updateOctoBombs() {
    octoBombs.forEach((bomb, index) => {
        bomb.timer--;
        if (bomb.timer <= 0) {
            createExplosion(bomb.x, bomb.y);
            octoBombs.splice(index, 1);
        }
    });
}

function updateOctoElectricShocks() {
    octoElectricShocks.forEach((shock, index) => {
        shock.duration--;
        if (shock.duration <= 0) {
            octoElectricShocks.splice(index, 1);
        } else {
            const endX = shock.x + Math.cos(shock.angle) * shock.range;
            const endY = shock.y + Math.sin(shock.angle) * shock.range;

            if (isColliding({ x: endX, y: endY }, ship)) {
                processPlayerDeath();
            }
        }
    });
}

function drawOctoProjectiles() {
    drawOctoInkProjectiles();
    drawOctoTentacles();
    drawOctoBombs();
    drawOctoElectricShocks();
}

function drawOctoInkProjectiles() {
    octoInkProjectiles.forEach(ink => {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(ink.x, ink.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawOctoTentacles() {
    octoTentacles.forEach(tentacle => {
        const endX = tentacle.x + Math.cos(tentacle.angle) * tentacle.length;
        const endY = tentacle.y + Math.sin(tentacle.angle) * tentacle.length;

        ctx.strokeStyle = 'purple';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(tentacle.x, tentacle.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    });
}

function drawOctoBombs() {
    octoBombs.forEach(bomb => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, 10, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawOctoElectricShocks() {
    octoElectricShocks.forEach(shock => {
        const endX = shock.x + Math.cos(shock.angle) * shock.range;
        const endY = shock.y + Math.sin(shock.angle) * shock.range;

        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shock.x, shock.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    });
}

function drawOcto() {
    if (!octo) return;

    ctx.save();
    ctx.translate(octo.x, octo.y);
    ctx.drawImage(octoImage, -octo.size / 2, -octo.size / 2, octo.size, octo.size);
    ctx.restore();

    octo.arms.forEach((arm, index) => {
        const armX = octo.x + Math.cos(arm.angle) * arm.length;
        const armY = octo.y + Math.sin(arm.angle) * arm.length;

        ctx.save();
        ctx.translate(armX, armY);
        ctx.rotate(arm.angle);
        ctx.drawImage(octoArmImages[index], -25, -25, 50, 50);
        ctx.restore();
    });

    drawOctoHitpointBar();
}

function drawOctoHitpointBar() {
    if (!octo) return;

    const barWidth = canvas.width * 0.8; // ```javascript
    const barHeight = 20;
    const barX = (canvas.width - barWidth) / 2;
    const barY = canvas.height - barHeight - 10; // 10 pixels from the bottom

    const hpRatio = octo.hitpoints / octo.maxHitpoints;
    const filledBarWidth = barWidth * hpRatio;

    // Draw the background of the hitpoint bar
    ctx.fillStyle = 'grey';
    ctx.fillRect(barX, barY, barWidth, barHeight);

    // Draw the filled part of the hitpoint bar
    ctx.fillStyle = 'red';
    ctx.fillRect(barX, barY, filledBarWidth, barHeight);

    // Draw the border of the hitpoint bar
    ctx.strokeStyle = 'black';
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}


// TODO add to main update function 
// updateOcto();
// updateOctoProjectiles();
// drawOcto();
// drawOctoProjectiles();

// if (wave === 30) {
//     spawnOcto();
// }


