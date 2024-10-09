// Tutorial variables
let tutorialActive = false;
let tutorialAsteroid = null;
let tutorialAsteroidDestroyed = false;
let elementalAsteroidCreated = false;
let elementalAsteroidDestroyed = false;
let gemCollected = false;
let currentTutorialStep = 0;

// Function to detect if the device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Tutorial steps for desktop
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
        text: "Watch out for glowing elemental asteroids! They have special effects when destroyed.",
        position: { top: '20%', left: '50%' },
        arrowPosition: { top: '30%', left: '50%' },
        arrowRotation: 180,
        condition: () => elementalAsteroidCreated && !elementalAsteroidDestroyed
    },
    {
        text: "Destroy the elemental asteroid to see its effect!",
        position: { top: '25%', left: '50%' },
        arrowPosition: { top: '35%', left: '50%' },
        arrowRotation: 180,
        condition: () => elementalAsteroidDestroyed
    },
    {
        text: "Collect glowing gems for XP boosts and special upgrades!",
        position: { top: '30%', left: '50%' },
        arrowPosition: { top: '40%', left: '50%' },
        arrowRotation: 180,
        condition: () => gemCollected
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
        condition: () => keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown']
    }
];

// Tutorial steps for mobile
const mobileTutorialSteps = [
    {
        text: "Use the left and right buttons to steer your ship (we suggest landscape mode)",
        position: { top: '50%', left: '75%' },
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
        text: "Watch out for glowing elemental asteroids! They have special effects when destroyed.",
        position: { top: '20%', left: '50%' },
        arrowPosition: { top: '30%', left: '50%' },
        arrowRotation: 180,
        condition: () => elementalAsteroidCreated && !elementalAsteroidDestroyed
    },
    {
        text: "Destroy the elemental asteroid to see its effect!",
        position: { top: '25%', left: '50%' },
        arrowPosition: { top: '35%', left: '50%' },
        arrowRotation: 180,
        condition: () => elementalAsteroidDestroyed
    },
    {
        text: "Collect glowing gems for XP boosts and special upgrades!",
        position: { top: '30%', left: '50%' },
        arrowPosition: { top: '40%', left: '50%' },
        arrowRotation: 180,
        condition: () => gemCollected
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
        position: { top: '29%', left: '11%' },
        arrowPosition: { top: '22%', left: '13.5%' },
        arrowRotation: 0,
        condition: () => secondaryWeaponUsedOnMobile
    },
    {
        text: "This is your health. Don't let it reach zero!",
        position: { top: '28%', left: '5%' },
        arrowPosition: { top: '22%', left: '7%' },
        arrowRotation: 0,
        condition: () => keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp']
    }
];

// Function to get the appropriate tutorial steps
function getTutorialSteps() {
    return isMobileDevice() ? mobileTutorialSteps : desktopTutorialSteps;
}

// Initialize the tutorial
function initializeTutorial() {
    tutorialActive = true;
    currentTutorialStep = 0;
    createTutorialOverlay();
    showCurrentTutorialStep();
    createTutorialAsteroidAndAddSecondary();
}

// Create the tutorial overlay
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
        color: black;
        padding: 10px !important;
        border-radius: 5px;
        max-width: 200px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        text-align: center;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
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

// Show the current tutorial step
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

// Create tutorial asteroid, elemental asteroid, and gem
function createTutorialAsteroidAndAddSecondary() {
    const asteroidDistance = 80;
    const angle = Math.random() * Math.PI * 2;

    // Create normal tutorial asteroid
    tutorialAsteroid = {
        x: ship.x + Math.cos(angle) * asteroidDistance,
        y: ship.y + Math.sin(angle) * asteroidDistance,
        size: 20,
        speed: 0,
        dx: 0,
        dy: 0,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: 0.02,
        hitpoints: 1,
        initialHitpoints: 1,
        isTutorialAsteroid: true,
        type: 'normal',
        color: 'gray'
    };
    asteroids.push(tutorialAsteroid);

    // Create elemental asteroid
    const elementalTypes = ['exploding', 'freezing', 'chainLightning', 'acid'];
    const randomType = elementalTypes[Math.floor(Math.random() * elementalTypes.length)];
    const elementalAsteroid = {
        x: ship.x + Math.cos(angle + Math.PI) * asteroidDistance,
        y: ship.y + Math.sin(angle + Math.PI) * asteroidDistance,
        size: 30,
        speed: 0,
        dx: 0,
        dy: 0,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: 0.02,
        hitpoints: 5,
        initialHitpoints: 5,
        type: randomType,
        isElemental: true,
        color: getElementalColor(randomType)
    };
    asteroids.push(elementalAsteroid);

    // Create a tutorial gem
    const tutorialGem = createTutorialGem();
    droppedGems.push(tutorialGem);

    elementalAsteroidCreated = true;

    const activeWeapon = Object.values(secondaryWeapons).find(weapon => weapon.isActive);
    if (activeWeapon) {
        activeWeapon.uses = 4;
    }
}

// Get color for elemental asteroids
function getElementalColor(type) {
    switch (type) {
        case 'exploding': return '#FF0000'; // Red
        case 'freezing': return '#00BFFF'; // Blue
        case 'chainLightning': return '#FFFF00'; // Yellow
        case 'acid': return '#00FF00'; // Green
        default: return 'white';
    }
}

// Create a tutorial gem
function createTutorialGem() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 20,
        type: 'common'
    };
}

// Update the tutorial
function updateTutorial() {
    if (!tutorialActive) return;

    const steps = getTutorialSteps();
    const currentStep = steps[currentTutorialStep];

    if (currentStep.condition()) {
        currentTutorialStep++;
        if (currentTutorialStep >= steps.length) {
            endTutorial();
        } else {
            showCurrentTutorialStep();
        }
    }

    // Check for elemental asteroid destruction
    if (elementalAsteroidCreated && !elementalAsteroidDestroyed) {
        elementalAsteroidDestroyed = asteroids.every(asteroid => !asteroid.isElemental);
    }

    // Check for gem collection
    if (!gemCollected) {
        gemCollected = droppedGems.length === 0;
    }

    if (tutorialAsteroid && !asteroids.includes(tutorialAsteroid) && !tutorialAsteroidDestroyed) {
        tutorialAsteroidDestroyed = true;
    }
}

// Highlight the tutorial asteroid
function highlightTutorialAsteroid() {
    if (!tutorialAsteroid) return;
    ctx.save();
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(tutorialAsteroid.x, tutorialAsteroid.y, tutorialAsteroid.size + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

// End the tutorial
function endTutorial() {
    tutorialActive = false;
    document.getElementById('tutorialOverlay').remove();
    localStorage.setItem('tutorialCompleted', 'true');
    gameSpeed = 1; // Reset game speed to normal
}

