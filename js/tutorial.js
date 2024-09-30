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


// Tutorial functions
function initializeTutorial() {
    // if (localStorage.getItem('tutorialCompleted')) {
    //     return; // Skip tutorial if already completed
    // }

    tutorialActive = true;
    currentTutorialStep = 0;
    createTutorialOverlay();
    showCurrentTutorialStep();
    createTutorialAsteroid();

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

