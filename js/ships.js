let starHawk = false;
let currentShip = 'basic';
let currentShipType = 'basic';

const shipSwitcher = document.getElementById('shipType');

// Draw the ship
function drawShip() {
    if (!invincible || (invincibilityTimer % 20 < 10)) {
        ctx.lineWidth = 1;
        ctx.save();
        ctx.translate(ship.x, ship.y);
        ctx.rotate(ship.rotation * Math.PI / 180);

        // Draw the current ship
        ships[currentShip].draw();

        ctx.restore();
    }
}

function showShipSelectionModal() {
    const modal = document.getElementById('shipSelectionModal');
    modal.style.display = 'block';
    populateSelectors();
    updateShipPreview(); // Initialize with the first ship
}

function shootShotgunStyle() {
    const laserX = ship.x + 10 * Math.sin(ship.rotation * Math.PI / 180);
    const laserY = ship.y - 10 * Math.cos(ship.rotation * Math.PI / 180);

    // Calculate the spread angles
    const spreadAngle = 10; // Spread angle in degrees
    const baseRotation = ship.rotation;

    // Create three lasers with spread
    ship.lasers.push({ x: laserX, y: laserY, rotation: baseRotation - spreadAngle, size: ship.laserLevel + 1 });
    ship.lasers.push({ x: laserX, y: laserY, rotation: baseRotation, size: ship.laserLevel + 1 });
    ship.lasers.push({ x: laserX, y: laserY, rotation: baseRotation + spreadAngle, size: ship.laserLevel + 1 });

    // Set the laser timer to half the cooldown
    ship.laserTimer = ship.laserCooldown * 2; // Slow down fire interval by half
}

// shipSwitcher.addEventListener('click', (event) => {

//     showShipSelectionModal();
// console.log("switch");
// const shipNames = Object.keys(ships);
// let nextIndex = (shipNames.indexOf(currentShip) + 1) % shipNames.length;
// console.log(ships[shipNames[nextIndex]]);

// console.log(shipNames);
// console.log(nextIndex);

// // Find the next available ship based on the conditions
// while (!ships[shipNames[nextIndex]].condition()) {
//     console.log(ships[shipNames[nextIndex]]);

//     nextIndex = (nextIndex + 1) % shipNames.length;
// }
// console.log(nextIndex);

// currentShip = shipNames[nextIndex];
// console.log(currentShip);

// const shipData = ships[currentShip];
// console.log(shipData);


// shipSwitcher.innerHTML = `Ship type: ${shipData.name}`;

// console.log(shipSwitcher);

// // Update ship properties
// lives = shipData.lives;
// ship.laserLevel = shipData.laserLevel;
// ship.weaponSlots = shipData.weaponSlots;
// ship.upgradeSlots = shipData.upgradeSlots;

// });



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
    maxBulletsLevel: 70,
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
    starhawk: {
        name: 'Starhawk',
        lives: 3,
        laserLevel: 5,
        weaponSlots: 6,
        upgradeSlots: 3,
        draw: drawStarHawk,
        condition: () => Achievements.complete_meteor_easy_mode.reached
    },
    VvidWarden: {
        name: 'Void Warden',
        lives: 4,
        laserLevel: 4,
        weaponSlots: 4,
        upgradeSlots: 2,
        draw: drawVoidWarden,
        condition: () => Achievements.complete_meteor_hero_mode.reached
    },
    solarPhoenix: {
        name: 'Solar Phoenix',
        lives: 5,
        laserLevel: 3,
        weaponSlots: 3,
        upgradeSlots: 3,
        draw: drawSolarPhoenix,
        condition: () => Achievements.complete_planet_hard_mode.reached
    },
    quantumStriker: {
        name: 'Quantum Striker',
        lives: 2,
        laserLevel: 6,
        weaponSlots: 5,
        upgradeSlots: 2,
        draw: drawQuantumStriker,
        condition: () => Achievements.complete_meteor_hard_mode.reached,
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
    // Draw outer white line
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(10, 10);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.strokeStyle = 'white';
    ctx.stroke();

    // Draw inner magenta line
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -13);
    ctx.lineTo(8, 8);
    ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.strokeStyle = 'yellow';
    ctx.stroke();
}


function drawStarHawk() {
    ctx.save();

    // Main body
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(15, 10);
    ctx.lineTo(-15, 10);
    ctx.closePath();

    // Create gradient for the body
    let gradient = ctx.createLinearGradient(0, -20, 0, 10);
    gradient.addColorStop(0, '#FF4500');  // OrangeRed at the top
    gradient.addColorStop(1, '#8B0000');  // DarkRed at the bottom
    ctx.fillStyle = gradient;
    ctx.fill();

    // Outline
    ctx.strokeStyle = '#FFA500';  // Orange outline
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wings
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(25, -5);
    ctx.lineTo(20, 15);
    ctx.lineTo(15, 10);
    ctx.moveTo(-15, 0);
    ctx.lineTo(-25, -5);
    ctx.lineTo(-20, 15);
    ctx.lineTo(-15, 10);
    ctx.fillStyle = '#B22222';  // FireBrick red for wings
    ctx.fill();
    ctx.strokeStyle = '#FFD700';  // Gold outline for wings
    ctx.stroke();

    // Cockpit
    ctx.beginPath();
    ctx.ellipse(0, -5, 5, 10, 0, 0, Math.PI * 2);
    gradient = ctx.createRadialGradient(0, -5, 0, 0, -5, 10);
    gradient.addColorStop(0, 'rgba(135, 206, 250, 0.8)');  // Light sky blue
    gradient.addColorStop(1, 'rgba(30, 144, 255, 0.4)');  // Dodger blue
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.strokeStyle = '#4169E1';  // Royal Blue
    ctx.stroke();

    // Thrusters
    ctx.beginPath();
    ctx.rect(-8, 10, 5, 5);
    ctx.rect(3, 10, 5, 5);
    ctx.fillStyle = '#1E90FF';  // Dodger Blue
    ctx.fill();
    ctx.strokeStyle = '#00BFFF';  // Deep Sky Blue
    ctx.stroke();

    // Thruster glow
    ctx.beginPath();
    gradient = ctx.createLinearGradient(0, 15, 0, 20);
    gradient.addColorStop(0, 'rgba(255, 255, 0, 0.8)');  // Yellow
    gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');  // Fade to transparent
    ctx.fillStyle = gradient;
    ctx.moveTo(-8, 15);
    ctx.lineTo(-3, 15);
    ctx.lineTo(-5.5, 20);
    ctx.moveTo(8, 15);
    ctx.lineTo(3, 15);
    ctx.lineTo(5.5, 20);
    ctx.fill();

    ctx.restore();
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
    ctx.save();

    // Main body
    ctx.beginPath();
    ctx.moveTo(0, -25);
    ctx.lineTo(15, 15);
    ctx.lineTo(-15, 15);
    ctx.closePath();

    // Gradient for the body
    let gradient = ctx.createLinearGradient(0, -25, 0, 15);
    gradient.addColorStop(0, '#4B0082');  // Indigo
    gradient.addColorStop(0.5, '#8A2BE2');  // Blue Violet
    gradient.addColorStop(1, '#9400D3');  // Dark Violet
    ctx.fillStyle = gradient;
    ctx.fill();

    // Outline
    ctx.strokeStyle = '#E6E8FA';  // Platinum
    ctx.lineWidth = 2;
    ctx.stroke();

    // Quantum field effect
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, 20 - i * 5, 30 - i * 7, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 + i * 0.1})`;  // Cyan with increasing opacity
        ctx.stroke();
    }

    // Energy core
    ctx.beginPath();
    gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 10);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');  // White core
    gradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.5)');  // Cyan middle
    gradient.addColorStop(1, 'rgba(0, 0, 255, 0)');  // Fade to transparent blue
    ctx.fillStyle = gradient;
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    // Quantum particles
    for (let i = 0; i < 5; i++) {
        let angle = Math.random() * Math.PI * 2;
        let distance = Math.random() * 20;
        let x = Math.cos(angle) * distance;
        let y = Math.sin(angle) * distance;

        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';  // Cyan particles
        ctx.fill();
    }

    // Wing accents
    ctx.beginPath();
    ctx.moveTo(-15, 15);
    ctx.lineTo(-5, 0);
    ctx.moveTo(15, 15);
    ctx.lineTo(5, 0);
    ctx.strokeStyle = '#00FFFF';  // Cyan
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
}


function drawOldQuantumStriker() {
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


function updateShipPreview(shipKey = "basic") {
    // console.log(`Attempting to update ship preview for: ${shipKey}`);

    const canvas = document.getElementById('shipPreviewCanvas');
    if (!canvas) {
        console.error("Ship preview canvas not found");
        return;
    }

    // console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);

    const previewCtx = canvas.getContext('2d');
    let oldContext = ctx;
    ctx = canvas.getContext('2d');

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // // Set up the context for drawing
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    // // Draw a background to ensure the canvas is visible
    // previewCtx.fillStyle = 'rgba(0, 0, 255, 0.1)'; // Light blue background
    // previewCtx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

    // Draw the selected ship
    if (ships[shipKey] && typeof ships[shipKey].draw === 'function') {
        // console.log(`Drawing ship: ${shipKey}`);
        try {
            // Draw the ship at the center of the canvas
            ships[shipKey].draw();
            // console.log(`Ship draw function called successfully`);
        } catch (error) {
            console.error(`Error drawing ship "${shipKey}":`, error);
        }
    } else {
        console.error(`Unable to draw ship "${shipKey}". Ship not found or draw function not available.`);
    }

    ctx.restore();
    ctx = oldContext;

    // Update the ship name display
    const shipNameElement = document.getElementById('selectedShip');
    if (shipNameElement) {
        shipNameElement.textContent = ships[shipKey].name;
    } else {
        console.warn("Ship name display element not found");
    }
    currentShip = shipKey;
    updateMiniShipPreview(shipKey);
}

// Function to populate the selectors with unlocked options
function populateSelectors() {
    const selectedShipSpan = document.getElementById('selectedShip');
    const selectedSecondaryWeaponSpan = document.getElementById('selectedSecondaryWeapon');
    const prevShipButton = document.getElementById('prevShipButton');
    const nextShipButton = document.getElementById('nextShipButton');
    const prevSecondaryWeaponButton = document.getElementById('prevSecondaryWeaponButton');
    const nextSecondaryWeaponButton = document.getElementById('nextSecondaryWeaponButton');

    let availableShips = [];
    let availableSecondaryWeapons = [];
    let currentShipIndex = 0;
    let currentSecondaryWeaponIndex = 0;

    // Populate available ships
    Object.keys(ships).forEach(shipKey => {
        if (ships[shipKey].condition()) {
            availableShips.push({ key: shipKey, name: ships[shipKey].name });
        }
    });

    // console.log("availableShips");
    // console.log(availableShips.length);
    // console.log(availableShips);

    // Populate available secondary weapons
    Object.keys(secondaryWeapons).forEach(weaponKey => {
        if (secondaryWeapons[weaponKey].isAvailable()) {
            availableSecondaryWeapons.push({ key: weaponKey, name: secondaryWeapons[weaponKey].name });
        }
    });

    // Function to cycle through options
    function cycleOption(array, currentIndex, direction) {
        if (direction === 'next') {
            return (currentIndex + 1) % array.length;
        } else {
            return (currentIndex - 1 + array.length) % array.length;
        }
    }

    // Update display functions
    function updateShipDisplay() {
        selectedShipSpan.textContent = availableShips[currentShipIndex].name;
        updateShipPreview(availableShips[currentShipIndex].key);
    }

    function updateSecondaryWeaponDisplay() {
        selectedSecondaryWeaponSpan.textContent = availableSecondaryWeapons[currentSecondaryWeaponIndex].name;
    }

    // Set initial values
    if (availableShips.length > 0) {
        updateShipDisplay();
    }
    if (availableSecondaryWeapons.length > 0) {
        updateSecondaryWeaponDisplay();
    }

    // Add event listeners for ship buttons
    nextShipButton.addEventListener('click', () => {
        currentShipIndex = cycleOption(availableShips, currentShipIndex, 'next');
        updateShipDisplay();
    });

    prevShipButton.addEventListener('click', () => {
        currentShipIndex = cycleOption(availableShips, currentShipIndex, 'prev');
        updateShipDisplay();
    });

    // Add event listeners for secondary weapon buttons
    nextSecondaryWeaponButton.addEventListener('click', () => {
        currentSecondaryWeaponIndex = cycleOption(availableSecondaryWeapons, currentSecondaryWeaponIndex, 'next');
        updateSecondaryWeaponDisplay();
    });

    prevSecondaryWeaponButton.addEventListener('click', () => {
        currentSecondaryWeaponIndex = cycleOption(availableSecondaryWeapons, currentSecondaryWeaponIndex, 'prev');
        updateSecondaryWeaponDisplay();
    });

    // Function to get current selections
    window.getSelectedShip = () => availableShips[currentShipIndex].key;
    window.getSelectedSecondaryWeapon = () => availableSecondaryWeapons[currentSecondaryWeaponIndex].key;
}
// Function to handle selections and start the game
function handleSelections() {
    const selectedShip = document.getElementById('selectedShip').innerHTML;
    const selectedWeapon = document.getElementById('selectedSecondaryWeapon').innerHTML;
    // const selectedUpgrade = document.getElementById('upgradeSelector').value;

    // Apply selections to the game
    // currentShip = selectedShip;

    selectSecondaryWeapon(selectedWeapon.toLowerCase());
    // applyUpgrade(selectedUpgrade);
    // Close the modal and start the game
    // document.getElementById('shipSelectionModal').style.display = 'none';
    updateShipTypeDisplay(); // Add this line

}

function updateMiniShipPreview() {
    // currentShip = shipKey;
    const canvas = document.getElementById('miniShipPreview');
    const miniCtx = canvas.getContext('2d');

    // Clear the canvas
    miniCtx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up the context for drawing
    miniCtx.save();
    miniCtx.translate(canvas.width / 2, canvas.height / 2);
    miniCtx.scale(.7, .7); // Adjust scale if needed

    // Temporarily replace the global ctx with our mini context
    const originalCtx = ctx;
    ctx = miniCtx;

    // console.log(currentShip);
    // Draw the current ship
    ships[currentShip].draw();

    // Restore the original context
    ctx = originalCtx;

    miniCtx.restore();
}

// Call this function whenever the ship changes or when the game starts
function updateShipTypeDisplay() {
    const shipTypeElement = document.getElementById('shipType');
    // console.log(currentShip);

    // shipTypeElement.textContent = `Ship: ${ships[currentShip].name}`;
    updateMiniShipPreview();
}


// Event listener for the save button
// document.getElementById('saveSelections').addEventListener('click', handleSelections);
// document.getElementById('shipSelector').addEventListener('change', updateShipPreview);
// document.getElementById('cancelSelections').addEventListener('click', closeModalWithoutSaving);

function closeModalWithoutSaving() {
    const modal = document.getElementById('shipSelectionModal');
    modal.style.display = 'none'; // Hide the modal
}
