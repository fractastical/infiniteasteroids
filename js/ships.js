

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


// Draw the ship
function drawShip() {
    if (!invincible || (invincibilityTimer % 20 < 10)) {

        // drawBasicShip();
        // drawStarHawk();
        // const shipImage = new Image();
        // shipImage.src = 'icons/nachospaceshipgold.png';

        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.rotation * Math.PI / 180);
        // drawStarHawk();
        // drawVoidWarden();
        drawBasicShip();
        // drawSolarPhoenix();
        // drawQuantumStriker();
        // ctx.drawImage(shipImage, -ship.size, -ship.size, ship.size * 2, ship.size * 2);
        ctx.restore();
    }
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
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(12, 10);
    ctx.lineTo(-12, 10);
    ctx.closePath();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
    // Draw flame trail
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 30);
    ctx.strokeStyle = 'yellow';
    ctx.stroke();
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
