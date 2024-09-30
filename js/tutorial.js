// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
// let ship, asteroids, lasers, gameLoop, gameSpeed, keys, score, lives;
let tutorialActive = false;
let tutorialAsteroid = null;
let tutorialAsteroidDestroyed = false;
let currentTutorialStep = 0;

// Tutorial steps
const tutorialSteps = [
    {
        text: "Use arrow keys to move your ship",
        position: { top: '50%', left: '50%' },
        arrowPosition: { top: '60%', left: '50%' },
        arrowRotation: 180,
        condition: () => keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown']
    },
    {
        text: "Press SPACE to shoot lasers",
        position: { top: '50%', left: '50%' },
        arrowPosition: { top: '60%', left: '50%' },
        arrowRotation: 180,
        condition: () => keys[' '] // Space key pressed
    },
    {
        text: "Shoot the highlighted asteroid",
        position: { top: '20%', left: '50%' },
        arrowPosition: { top: '30%', left: '50%' },
        arrowRotation: 180,
        condition: () => tutorialAsteroidDestroyed
    },
    {
        text: "Press E to use your bomb (secondary weapon)",
        position: { top: '80%', left: '20%' },
        arrowPosition: { top: '70%', left: '20%' },
        arrowRotation: 0,
        condition: () => keys['e'] // E key pressed
    },
    {
        text: "This is your health. Don't let it reach zero!",
        position: { top: '10%', right: '20%' },
        arrowPosition: { top: '20%', right: '20%' },
        arrowRotation: 180,
        condition: () => true // Auto-complete this step
    }
];

// Initialize game
function initGame() {
    ship = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 20,
        angle: 0,
        rotationSpeed: 0.1,
        speed: 0,
        maxSpeed: 5
    };
    asteroids = [];
    lasers = [];
    keys = {};
    score = 0;
    lives = 3;
    gameSpeed = 1;

    initializeTutorial();
    gameLoop = setInterval(update, 1000 / 60); // 60 FPS
}

// Tutorial functions
function initializeTutorial() {
    if (localStorage.getItem('tutorialCompleted')) {
        return; // Skip tutorial if already completed
    }

    tutorialActive = true;
    currentTutorialStep = 0;
    createTutorialOverlay();
    showCurrentTutorialStep();
    createTutorialAsteroid();

    gameSpeed = 0.2; // Slow down the game during tutorial
}

function createTutorialOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'tutorialOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        pointer-events: none;
    `;

    const stepElement = document.createElement('div');
    stepElement.id = 'tutorialStep';
    stepElement.style.cssText = `
        position: absolute;
        background-color: white;
        padding: 10px;
        border-radius: 5px;
        max-width: 200px;
    `;

    const arrowElement = document.createElement('div');
    arrowElement.id = 'tutorialArrow';
    arrowElement.style.cssText = `
        position: absolute;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 20px solid white;
    `;

    overlay.appendChild(stepElement);
    overlay.appendChild(arrowElement);
    document.body.appendChild(overlay);
}

function showCurrentTutorialStep() {
    const step = tutorialSteps[currentTutorialStep];
    const stepElement = document.getElementById('tutorialStep');
    const arrowElement = document.getElementById('tutorialArrow');

    stepElement.textContent = step.text;
    Object.assign(stepElement.style, step.position);
    Object.assign(arrowElement.style, step.arrowPosition);
    arrowElement.style.transform = `rotate(${step.arrowRotation}deg)`;
}

function createTutorialAsteroid() {
    const asteroidDistance = 150;
    const angle = Math.random() * Math.PI * 2;

    tutorialAsteroid = {
        x: ship.x + Math.cos(angle) * asteroidDistance,
        y: ship.y + Math.sin(angle) * asteroidDistance,
        radius: 30,
        speed: 0,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: 0.02,
        hitpoints: 1,
        isTutorialAsteroid: true
    };

    asteroids.push(tutorialAsteroid);
}

function updateTutorial() {
    if (!tutorialActive) return;

    const currentStep = tutorialSteps[currentTutorialStep];
    if (currentStep.condition()) {
        currentTutorialStep++;
        if (currentTutorialStep >= tutorialSteps.length) {
            endTutorial();
        } else {
            showCurrentTutorialStep();
            if (currentTutorialStep === 2) { // "Shoot the asteroid" step
                createTutorialAsteroid();
            }
        }
    }

    if (tutorialAsteroid && !asteroids.includes(tutorialAsteroid)) {
        tutorialAsteroidDestroyed = true;
    }
}

function highlightTutorialAsteroid() {
    if (!tutorialAsteroid) return;
    ctx.save();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(tutorialAsteroid.x, tutorialAsteroid.y, tutorialAsteroid.radius + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

function endTutorial() {
    tutorialActive = false;
    document.getElementById('tutorialOverlay').remove();
    localStorage.setItem('tutorialCompleted', 'true');
    gameSpeed = 1;
}

// Game update function
function update() {
    // Clear canvas
    // Update tutorial if active
    if (tutorialActive) {
        updateTutorial();
        highlightTutorialAsteroid();
    }
}

// Ship functions
function updateShip() {
    if (keys['ArrowLeft']) ship.angle -= ship.rotationSpeed * gameSpeed;
    if (keys['ArrowRight']) ship.angle += ship.rotationSpeed * gameSpeed;

    if (keys['ArrowUp']) {
        ship.speed += 0.1 * gameSpeed;
        if (ship.speed > ship.maxSpeed) ship.speed = ship.maxSpeed;
    } else {
        ship.speed *= 0.98;
    }

    ship.x += Math.cos(ship.angle) * ship.speed * gameSpeed;
    ship.y += Math.sin(ship.angle) * ship.speed * gameSpeed;

    // Wrap around screen
    if (ship.x < 0) ship.x = canvas.width;
    if (ship.x > canvas.width) ship.x = 0;
    if (ship.y < 0) ship.y = canvas.height;
    if (ship.y > canvas.height) ship.y = 0;
}

function drawShip() {
    ctx.save();
    ctx.translate(ship.x, ship.y);
    ctx.rotate(ship.angle);
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-10, 10);
    ctx.lineTo(-10, -10);
    ctx.closePath();
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.restore();
}

// Asteroid functions
function updateAsteroids() {
    for (let asteroid of asteroids) {
        asteroid.x += Math.cos(asteroid.angle) * asteroid.speed * gameSpeed;
        asteroid.y += Math.sin(asteroid.angle) * asteroid.speed * gameSpeed;

        // Wrap around screen
        if (asteroid.x < 0) asteroid.x = canvas.width;
        if (asteroid.x > canvas.width) asteroid.x = 0;
        if (asteroid.y < 0) asteroid.y = canvas.height;
        if (asteroid.y > canvas.height) asteroid.y = 0;

        // Draw asteroid
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'gray';
        ctx.fill();
    }
}

// Laser functions
function updateLasers() {
    for (let i = lasers.length - 1; i >= 0; i--) {
        let laser = lasers[i];
        laser.x += Math.cos(laser.angle) * laser.speed * gameSpeed;
        laser.y += Math.sin(laser.angle) * laser.speed * gameSpeed;

        // Remove laser if off screen
        if (laser.x < 0 || laser.x > canvas.width || laser.y < 0 || laser.y > canvas.height) {
            lasers.splice(i, 1);
            continue;
        }

        // Draw laser
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    }
}

// Collision detection
function checkCollisions() {
    // Check laser-asteroid collisions
    for (let i = lasers.length - 1; i >= 0; i--) {
        for (let j = asteroids.length - 1; j >= 0; j--) {
            if (distance(lasers[i], asteroids[j]) < asteroids[j].radius) {
                // Destroy asteroid
                if (asteroids[j].isTutorialAsteroid) {
                    tutorialAsteroidDestroyed = true;
                }
                asteroids.splice(j, 1);
                lasers.splice(i, 1);
                score += 10;
                break;
            }
        }
    }

    // Check ship-asteroid collisions
    for (let asteroid of asteroids) {
        if (distance(ship, asteroid) < ship.radius + asteroid.radius) {
            // Game over logic
            lives--;
            if (lives <= 0) {
                // End game
                clearInterval(gameLoop);
                alert('Game Over! Your score: ' + score);
                initGame(); // Restart game
            } else {
                // Reset ship position
                ship.x = canvas.width / 2;
                ship.y = canvas.height / 2;
                ship.speed = 0;
            }
        }
    }
}

// Utility functions
function distance(obj1, obj2) {
    return Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2);
}

function drawUI() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
    ctx.fillText('Lives: ' + lives, 10, 60);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ') { // Spacebar
        lasers.push({
            x: ship.x + Math.cos(ship.angle) * 20,
            y: ship.y + Math.sin(ship.angle) * 20,
            angle: ship.angle,
            speed: 5
        });
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

// Start the game
initGame();