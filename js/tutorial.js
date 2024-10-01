// Canvas setup

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
        position: { top: '30%', left: '50%' },
        arrowPosition: { top: '40%', left: '50%' },
        arrowRotation: 180,
        condition: () => keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown']
    },
    {
        text: "Press SPACE to shoot lasers",
        position: { top: '40%', left: '70%' },
        arrowPosition: { top: '50%', left: '70%' },
        arrowRotation: 180,
        condition: () => keys[' '] // Space key pressed
    },
    {
        text: "Shoot the highlighted asteroid to get XP!",
        position: { top: '20%', left: '50%' },
        arrowPosition: { top: '30%', left: '50%' },
        arrowRotation: 180,
        condition: () => tutorialAsteroidDestroyed
    },
    {
        text: "Pick an upgrade with XP!",
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
        text: "Here is how many you have left)",
        position: { top: '10%', left: '25%' },
        arrowPosition: { top: '6%', right: '12%' },
        arrowRotation: 0,
        condition: () => keys['f'] // E key pressed
    },
    {
        text: "This is your health. Don't let it reach zero!",
        position: { top: '10%', right: '20%' },
        arrowPosition: { top: '20%', right: '4%' },
        arrowRotation: 180,
        condition: () => keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown']
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
        color: black; // Add this line to set the text color
        padding: 10px;
        border-radius: 5px;
        max-width: 200px;
        font-family: Arial, sans-serif; // Add this for better readability
        font-size: 14px; // Add this to set an appropriate font size
        text-align: center; // Center the text
        box-shadow: 0 0 10px rgba(0,0,0,0.5); // Add a subtle shadow for better visibility
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
    const asteroidDistance = 10;
    const angle = Math.random() * Math.PI * 2;

    tutorialAsteroid = {
        x: ship.x,
        y: ship.y - 80,
        size: 20,
        speed: 0,
        dx: 0,
        dy: 0,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: 0.02,
        hitpoints: 1,
        initialHitpoints: 1,
        isTutorialAsteroid: true,
        type: 'normal'
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

