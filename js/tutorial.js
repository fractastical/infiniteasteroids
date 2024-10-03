// Canvas setup

// Game variables
// let ship, asteroids, lasers, gameLoop, gameSpeed, keys, score, lives;
let tutorialActive = false;
let tutorialAsteroid = null;
let tutorialAsteroidDestroyed = false;
let currentTutorialStep = 0;
let firstLevelUpRedeemed = false;

// Tutorial steps
const desktopTutorialSteps = [
    {
        text: "Use arrow keys to move your ship",
        position: { top: '30%', left: '42%' },
        arrowPosition: { top: '40%', left: '49%' },
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
        position: { top: '15%', left: '50%' },
        arrowPosition: { top: '25%', left: '50%' },
        arrowRotation: 180,
        condition: () => tutorialAsteroidDestroyed
    },
    {
        text: "Pick an upgrade with XP!",
        position: { top: '10%', left: '50%' },
        arrowPosition: { top: '15%', left: '50%' },
        arrowRotation: 180,
        condition: () => level > 1
    },

    {
        text: "Press E to use your bomb (secondary weapon). Only three uses!",
        position: { top: '14%', left: '12%' },
        arrowPosition: { top: '11%', left: '12%' },
        arrowRotation: 0,
        condition: () => keys['e'] // E key pressed
    },
    {
        text: "This is your health. Don't let it reach zero!",
        position: { top: '14%', left: '6%' },
        arrowPosition: { top: '11%', left: '6.6%' },
        arrowRotation: 0,
        condition: () => keys['ArrowUp'] || keys['ArrowDown']
    }
];


const mobileTutorialSteps = [
    {
        text: "Use the left and right buttons to steer your ship",
        position: { top: '60%', left: '75%' },
        arrowPosition: { top: '70%', left: '89%' },
        arrowRotation: 180,
        condition: () => keys['ArrowLeft'] || keys['ArrowRight']
    },
    {
        text: "Use the up button to accelerate",
        position: { top: '60%', left: '2%' },
        arrowPosition: { top: '70%', left: '5%' },
        arrowRotation: 180,
        condition: () => keys['ArrowUp']
    },
    {
        text: "Your ship fires automatically. Just aim!",
        position: { top: '120px', left: '480px' },
        arrowPosition: { top: '200px', left: '480px' },
        arrowRotation: 180,
        condition: () => ship.lasers.length > 0
    },
    {
        text: "Destroy the highlighted asteroid to get XP!",
        position: { top: '15%', left: '50%' },
        arrowPosition: { top: '25%', left: '50%' },
        arrowRotation: 180,
        condition: () => tutorialAsteroidDestroyed
    },
    {
        text: "Pick an upgrade with XP!",
        position: { top: '0%', left: '42%' },
        arrowPosition: { top: '10%', left: '49.5%' },
        arrowRotation: 180,
        condition: () => level > 1 || document.getElementById('levelUpModal').style.display === 'block'
    },
    {
        text: "Use two fingers to activate your bomb (secondary weapon). Only three uses!",
        position: { top: '19%', left: '11%' },
        arrowPosition: { top: '13%', left: '13.5%' },
        arrowRotation: 0,
        condition: () => secondaryWeaponUsedOnMobile // You'll need to implement this flag
    },
    {
        text: "This is your health. Don't let it reach zero!",
        position: { top: '19%', left: '5%' },
        arrowPosition: { top: '13%', left: '7%' },
        arrowRotation: 0,
        condition: () => keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp']
    }
];

function getTutorialSteps() {
    return isMobile() ? mobileTutorialSteps : desktopTutorialSteps;
}



// Tutorial functions
function initializeTutorial() {
    // if (localStorage.getItem('tutorialCompleted')) {
    //     return; // Skip tutorial if already completed
    // }

    tutorialActive = true;
    currentTutorialStep = 0;
    createTutorialOverlay();
    showCurrentTutorialStep();
    createTutorialAsteroidAndAddSecondary();

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
        padding: 10px !important;
        border-radius: 5px;
        max-width: 200px;
        font-family: Arial, sans-serif; // Add this for better readability
        font-size: 14px; // Add this to set an appropriate font size
        text-align: center; // Center the text
        box-shadow: 0 0 10px rgba(0,0,0,0.5); // Add a subtle shadow for better visibility
    `;

    stepElement.style.position = 'absolute';
    stepElement.style.backgroundColor = 'white';
    stepElement.style.color = 'black';
    stepElement.style.padding = '7px';  // Add padding explicitly
    stepElement.style.borderRadius = '5px';
    stepElement.style.maxWidth = '200px';
    stepElement.style.fontFamily = 'Arial, sans-serif';
    stepElement.style.fontSize = '14px';
    stepElement.style.textAlign = 'center';
    stepElement.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';

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
    const steps = getTutorialSteps();
    const step = steps[currentTutorialStep];
    const stepElement = document.getElementById('tutorialStep');
    const arrowElement = document.getElementById('tutorialArrow');

    stepElement.textContent = step.text;

    // Apply positions
    for (const [key, value] of Object.entries(step.position)) {
        stepElement.style[key] = value.endsWith('%') ? value : `${value}px`;
    }
    for (const [key, value] of Object.entries(step.arrowPosition)) {
        arrowElement.style[key] = value.endsWith('%') ? value : `${value}px`;
    }

    // Center horizontally if left is 50%
    if (step.position.left === '50%') {
        stepElement.style.transform = 'translateX(-50%)';
    } else {
        stepElement.style.transform = '';
    }
    if (step.arrowPosition.left === '50%') {
        arrowElement.style.transform = `translateX(-50%) rotate(${step.arrowRotation}deg)`;
    } else {
        arrowElement.style.transform = `rotate(${step.arrowRotation}deg)`;
    }
}

function createTutorialAsteroidAndAddSecondary() {
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

    const activeWeapon = Object.values(secondaryWeapons).find(weapon => weapon.isActive);
    if (activeWeapon) {
        activeWeapon.uses = 4;
    }

}

function updateTutorial() {
    if (!tutorialActive) return;

    const steps = getTutorialSteps();
    const currentStep = steps[currentTutorialStep];

    // Check if the current step is the "Pick an upgrade" step
    if (currentStep.text === "Pick an upgrade with XP!") {
        // If the level-up modal is about to be shown, consider this step completed
        if (level > 1 || document.getElementById('levelUpModal').style.display === 'block') {
            currentTutorialStep++;
            if (currentTutorialStep >= steps.length) {
                endTutorial();
            } else {
                showCurrentTutorialStep();
            }
        }
    } else if (currentStep.condition()) {
        currentTutorialStep++;
        if (currentTutorialStep >= steps.length) {
            endTutorial();
        } else {
            showCurrentTutorialStep();
            if (currentTutorialStep === 2) { // "Destroy the asteroid" step
                createTutorialAsteroidAndAddSecondary();
            }
        }
    }

    if (tutorialAsteroid && !asteroids.includes(tutorialAsteroid) && !tutorialAsteroidDestroyed) {
        tutorialAsteroidDestroyed = true;
        levelUp();
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

