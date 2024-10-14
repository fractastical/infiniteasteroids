// Tutorial variables
let tutorialActive = false;
let tutorialAsteroid = null;
let tutorialAsteroidDestroyed = false;
let elementalAsteroidCreated = false;
let elementalAsteroidDestroyed = false;
let tutorialAlienCreated = false;
let tutorialAlienDestroyed = false;
let gemCollected = false;
let currentTutorialStep = 0;
let fullScreenMode = true;

// Function to detect if the device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Tutorial steps for desktop
const desktopTutorialSteps = [
    {
        text: "Use arrow keys to move your ship",
        position: { top: '66%', left: '50%' },
        arrowPosition: { top: '60%', left: '50%' },
        arrowRotation: 0,
        condition: () => keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown']
    },
    {
        text: "Press SPACE to shoot lasers",
        position: { top: '66%', left: '50%' },
        arrowPosition: { top: '60%', left: '50%' },
        arrowRotation: 0,
        condition: () => keys[' '] // Space key pressed
    },
    {
        text: "Shoot the tutorial asteroid to get XP!",
        position: { top: '45%', left: '22%' },
        arrowPosition: { top: '39%', left: '24%' },
        arrowRotation: 0,
        condition: () => tutorialAsteroidDestroyed
    },
    {
        text: "Collect glowing objects for an XP boost and special upgrades!",
        position: { top: '75%', left: '50%' },
        arrowPosition: { top: '70%', left: '50%' },
        arrowRotation: 0,
        condition: () => gemCollected
    },
    {
        text: "Pick an upgrade with XP!",
        position: { top: '0%', left: '25%' },
        arrowPosition: { top: '8%', left: '33%' },
        arrowRotation: 180,
        condition: () => level > 1 && elementalAsteroidCreated
    },
    {
        text: "Destroy the elemental asteroid to see its effect!",
        position: { top: '45%', left: '72%' },
        arrowPosition: { top: '39%', left: '74%' },
        arrowRotation: 0,
        condition: () => elementalAsteroidCreated && elementalAsteroidDestroyed
    },
    {
        text: "Everything green is an enemy. Now, shoot the alien ship before it gets you! ",
        position: { top: '65%', left: '75%' },
        arrowPosition: { top: '60%', left: '75%' },
        arrowRotation: 0,
        condition: () => tutorialAlienCreated && tutorialAlienDestroyed
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
        text: "Use the left and right buttons to steer your ship",
        position: { top: '58%', left: '70%' },
        arrowPosition: { top: '73%', left: '89%' },
        arrowRotation: 180,
        condition: () => keys['ArrowLeft'] || keys['ArrowRight']
    },
    {
        text: "Use the up button to accelerate",
        position: { top: '58%', left: '3%' },
        arrowPosition: { top: '70%', left: '5%' },
        arrowRotation: 180,
        condition: () => keys['ArrowUp']
    },
    {
        text: "Your ship fires automatically. Just aim!",
        position: { top: '20%', left: '50%' },
        arrowPosition: { top: '30%', left: '50%' },
        arrowRotation: 180,
        condition: () => ship.lasers.length > 0
    },
    {
        text: "Destroy the asteroid to get XP!",
        position: { top: '48%', left: '22%' },
        arrowPosition: { top: '41%', left: '24%' },
        arrowRotation: 0,
        condition: () => tutorialAsteroidDestroyed
    },
    {
        text: "Collect glowing objects for an XP boost and special upgrade!",
        position: { top: '75%', left: '50%' },
        arrowPosition: { top: '70%', left: '50%' },
        arrowRotation: 0,
        condition: () => gemCollected
    },
    {
        text: "Pick an upgrade with XP!",
        position: { top: '0%', left: '33%' },
        arrowPosition: { top: '9%', left: '33%' },
        arrowRotation: 180,
        condition: () => level > 1 && elementalAsteroidCreated
    },
    {
        text: "Destroy the elemental asteroid to see its effect!",
        position: { top: '48%', left: '72%' },
        arrowPosition: { top: '42%', left: '74%' },
        arrowRotation: 0,
        condition: () => elementalAsteroidCreated && elementalAsteroidDestroyed
    },
    {
        text: "Everything green is an enemy. Now, shoot the alien ship before it gets you! ",
        position: { top: '68%', left: '72%' },
        arrowPosition: { top: '62%', left: '74%' },
        arrowRotation: 0,
        condition: () => tutorialAlienCreated && tutorialAlienDestroyed
    },
    {
        text: "Use two fingers to activate your bomb (secondary weapon). Only three uses!",
        position: { top: '20%', left: '10%' },
        arrowPosition: { top: '14%', left: '13%' },
        arrowRotation: 0,
        condition: () => secondaryWeaponUsedOnMobile
    },
    {
        text: "This is your health. Don't let it reach zero!",
        position: { top: '20%', left: '5%' },
        arrowPosition: { top: '14%', left: '7%' },
        arrowRotation: 0,
        condition: () => keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp']
    }
];

const fullscreenTutorialSteps = [
    {
        text: "Use arrow keys to move your ship",
        position: { top: '57%', left: '50%' },
        arrowPosition: { top: '54%', left: '50%' },
        arrowRotation: 0,
        condition: () => keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown']
    },
    {
        text: "Press SPACE to shoot lasers",
        position: { top: '57%', left: '50%' },
        arrowPosition: { top: '54%', left: '50%' },
        arrowRotation: 0,
        condition: () => keys[' '] // Space key pressed
    },
    {
        text: "Shoot the tutorial asteroid to get XP!",
        position: { top: '37%', left: '22%' },
        arrowPosition: { top: '34%', left: '24.5%' },
        arrowRotation: 0,
        condition: () => tutorialAsteroidDestroyed
    },
    {
        text: "Collect glowing objects for an XP boost and special upgrades!",
        position: { top: '73%', left: '50%' },
        arrowPosition: { top: '70%', left: '50%' },
        arrowRotation: 0,
        condition: () => gemCollected
    },
    {
        text: "Pick an upgrade with XP!",
        position: { top: '1%', left: '37%' },
        arrowPosition: { top: '5%', left: '41%' },
        arrowRotation: 180,
        condition: () => level > 1 && elementalAsteroidCreated
    },
    {
        text: "Destroy the elemental asteroid to see its effect!",
        position: { top: '38%', left: '72%' },
        arrowPosition: { top: '35%', left: '74.5%' },
        arrowRotation: 0,
        condition: () => elementalAsteroidCreated && elementalAsteroidDestroyed
    },
    {
        text: "Everything green is an enemy. Now, shoot the alien ship before it gets you! ",
        position: { top: '57%', left: '73%' },
        arrowPosition: { top: '54%', left: '74.5%' },
        arrowRotation: 0,
        condition: () => tutorialAlienCreated && tutorialAlienDestroyed
    },
    {
        text: "Press E to use your bomb (secondary weapon). Only three uses!",
        position: { top: '9%', left: '5%' },
        arrowPosition: { top: '6%', left: '6.5%' },
        arrowRotation: 0,
        condition: () => keys['e'] // E key pressed
    },
    {
        text: "This is your health. Don't let it reach zero!",
        position: { top: '9%', left: '2%' },
        arrowPosition: { top: '6%', left: '3.5%' },
        arrowRotation: 0,
        condition: () => keys['ArrowLeft'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown']
    }
];

// Function to get the appropriate tutorial steps
function getTutorialSteps() {
    if (!fullScreenMode)
        return isMobileDevice() ? mobileTutorialSteps : desktopTutorialSteps;
    else
        return fullscreenTutorialSteps;
}

// Initialize the tutorial
function initializeTutorial() {
    tutorialActive = true;
    currentTutorialStep = 0;
    createTutorialOverlay();
    showCurrentTutorialStep();
    createTutorialAsteroidAndAddSecondary();
}

function createTutorialAlien() {
    const tutorialAlien = {
        x: canvas.width * 0.75,
        y: canvas.height * 0.50,
        size: 40,
        speed: 0.2,
        hitpoints: 1,
        isTutorialAlien: true
    };
    aliens.push(tutorialAlien);
    tutorialAlienCreated = true;
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
        background-color: rgba(0, 0, 0, 0.2);
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
    // Create normal tutorial asteroid
    tutorialAsteroid = {
        x: canvas.width * 0.25,
        y: canvas.height * 0.3,
        size: 20,
        speed: 0,
        dx: 0,
        dy: 0,
        angle: 0,
        rotationSpeed: 0.02,
        hitpoints: 1,
        initialHitpoints: 1,
        isTutorialAsteroid: true,
        type: 'normal',
        color: 'gray',
        label: 'Tutorial Asteroid'
    };
    asteroids.push(tutorialAsteroid);


    // Set ship position
    ship.x = canvas.width * 0.5;
    ship.y = canvas.height * 0.8;

    const activeWeapon = Object.values(secondaryWeapons).find(weapon => weapon.isActive);
    if (activeWeapon) {
        activeWeapon.uses = 4;
    }
}

function createTutorialElementalAsteroid() {

    // Create elemental asteroid
    const elementalTypes = ['exploding', 'freezing', 'chainLightning', 'acid'];
    const randomType = elementalTypes[Math.floor(Math.random() * elementalTypes.length)];
    const elementalAsteroid = {
        x: canvas.width * 0.75,
        y: canvas.height * 0.3,
        size: 30,
        speed: 0,
        dx: 0,
        dy: 0,
        angle: 0,
        rotationSpeed: 0.02,
        hitpoints: 5,
        initialHitpoints: 5,
        type: randomType,
        isElemental: true,
        color: getElementalColor(randomType),
        label: 'Elemental Asteroid'
    };
    asteroids.push(elementalAsteroid);

    elementalAsteroidCreated = true;

}

function createTutorialGem() {

    // Create a tutorial gem
    const tutorialGem = {
        x: canvas.width * 0.5,
        y: canvas.height * 0.7,
        size: 20,
        type: 'common',
        label: 'Tutorial Gem'
    };
    droppedGems.push(tutorialGem);


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

// Update the tutorial
function updateTutorial() {
    if (!tutorialActive) return;

    const steps = getTutorialSteps();
    const currentStep = steps[currentTutorialStep];

    // Check for gem collection
    // if (!gemCollected) {
    //     gemCollected = !droppedGems.some(gem => gem.label === 'Tutorial Gem');
    // }

    // Check for elemental asteroid destruction
    if (elementalAsteroidCreated && !elementalAsteroidDestroyed) {
        elementalAsteroidDestroyed = !asteroids.some(asteroid => asteroid.isElemental);
        if (elementalAsteroidDestroyed)
            createTutorialAlien();

    }

    // Check if tutorial asteroid is destroyed
    if (tutorialAsteroid && !asteroids.includes(tutorialAsteroid) && !tutorialAsteroidDestroyed) {
        tutorialAsteroidDestroyed = true;
        createTutorialGem();
    }

    // Check for tutorial alien destruction
    if (tutorialAlienCreated && !tutorialAlienDestroyed) {
        tutorialAlienDestroyed = !aliens.some(alien => alien.isTutorialAlien);
    }

    if (currentStep.condition()) {
        currentTutorialStep++;
        if (currentTutorialStep >= steps.length) {
            endTutorial();
        } else {
            showCurrentTutorialStep();
        }
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
    if (document.getElementById('tutorialOverlay'))
        document.getElementById('tutorialOverlay').remove();
    localStorage.setItem('tutorialCompleted', 'true');
    gameSpeed = 1; // Reset game speed to normal
}

// We don't need to export anything if not using modules