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
let tutorialAnimationFrame = 0;
let highlightPulse = 0;

// Function to detect if the device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

let healthConditionTimerPassed = false;

// Start the timer when the tutorial begins or at an appropriate time
const lastStep = (() => setTimeout(() => {
    healthConditionTimerPassed = true;
}, 3000));

// Tutorial steps for desktop - UNCHANGED POSITIONS
const desktopTutorialSteps = [
    {
        text: "Use arrow keys or A,W,S,D or press the A button on your controller to move your ship",
        position: { top: '66%', left: '5%' },
        arrowPosition: { top: '60%', left: '5%' },
        arrowRotation: 0,
        center: true,
        icon: '🎮',
        condition: () => keys['ArrowLeft'] || keys['a'] || keys['s'] || keys['d'] || keys['w'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown']
    },
    {
        text: "Press SPACE to shoot lasers",
        position: { top: '66%', left: '5%' },
        arrowPosition: { top: '60%', left: '5%' },
        arrowRotation: 0,
        center: true,
        icon: '🔫',
        condition: () => keys[' '] // Space key pressed
    },
    {
        text: "Shoot the tutorial asteroid to get XP!",
        position: { top: '45%', left: '22%' },
        arrowPosition: { top: '39%', left: '24%' },
        arrowRotation: 0,
        asteroid: true,
        icon: '🎯',
        condition: () => tutorialAsteroidDestroyed
    },
    {
        text: "Collect glowing objects for an XP boost and special upgrades!",
        position: { top: '75%', left: '50%' },
        arrowPosition: { top: '70%', left: '50%' },
        arrowRotation: 0,
        icon: '✨',
        condition: () => gemCollected
    },
    {
        text: "Pick an upgrade with XP!",
        position: { top: '40%', left: '49%' },
        arrowPosition: { top: '0%', left: '61%' },
        arrowRotation: 180,
        textRotation: 90,
        icon: '⬆️',
        condition: () => level > 1 // Simplified condition to just check level
    },
    {
        text: "Destroy the elemental asteroid to see its effect!",
        position: { top: '45%', left: '72%' },
        arrowPosition: { top: '39%', left: '74%' },
        arrowRotation: 0,
        elementAsteroid: true,
        icon: '💥',
        condition: () => elementalAsteroidCreated && elementalAsteroidDestroyed
    },
    {
        text: "Everything green is an enemy. Now, shoot the alien ship before it gets you!",
        position: { top: '45%', left: '22%' },
        arrowPosition: { top: '39%', left: '24%' },
        arrowRotation: 0,
        asteroid: true,
        icon: '👾',
        condition: () => tutorialAlienCreated && tutorialAlienDestroyed
    },
    {
        text: "Press E to use your bomb (secondary weapon). Only three uses!",
        position: { top: '100', left: '90' },
        arrowPosition: { top: '70', left: '110' },
        arrowRotation: 0,
        icon: '💣',
        condition: () => keys['e'] // E key pressed
    },
    {
        text: "This is your health. Don't let it reach zero!",
        position: { top: '100', left: '60' },
        arrowPosition: { top: '70', left: '80' },
        arrowRotation: 0,
        icon: '❤️',
        condition: () => healthConditionTimerPassed
    }
];

// Tutorial steps for mobile - UNCHANGED POSITIONS
const mobileTutorialSteps = [
    {
        text: "Use the left and right buttons to steer your ship",
        position: { bottom: '160', right: '10' },
        arrowPosition: { bottom: '130', right: '100' },
        arrowRotation: 180,
        icon: '👈👉',
        condition: () => keys['ArrowLeft'] || keys['ArrowRight']
    },
    {
        text: "Use the up button to accelerate",
        position: { bottom: '160', left: '10' },
        arrowPosition: { bottom: '130', left: '50' },
        arrowRotation: 180,
        icon: '👆',
        condition: () => keys['ArrowUp']
    },
    {
        text: "Destroy the asteroid to get XP!",
        position: { top: '40%', left: '20%' },
        arrowPosition: { top: '41%', left: '24%' },
        arrowRotation: 0,
        asteroid: true,
        icon: '🎯',
        condition: () => tutorialAsteroidDestroyed
    },
    {
        text: "Collect glowing objects for an XP boost and special upgrade!",
        position: { top: '75%', left: '50%' },
        arrowPosition: { top: '70%', left: '50%' },
        arrowRotation: 0,
        icon: '✨',
        condition: () => gemCollected
    },
    {
        text: "Pick an upgrade with XP!",
        position: { top: '0%', left: '49%' },
        arrowPosition: { top: '0%', left: '61%' },
        arrowRotation: 180,
        textRotation: 90,
        icon: '⬆️',
        condition: () => level > 1 && elementalAsteroidCreated
    },
    {
        text: "Destroy the elemental asteroid to see its effect!",
        position: { top: '48%', left: '72%' },
        arrowPosition: { top: '42%', left: '74%' },
        arrowRotation: 0,
        elementAsteroid: true,
        icon: '💥',
        condition: () => elementalAsteroidCreated && elementalAsteroidDestroyed
    },
    {
        text: "Everything green is an enemy. Now, shoot the alien ship before it gets you!",
        position: { top: '48%', left: '22%' },
        arrowPosition: { top: '41%', left: '24%' },
        arrowRotation: 0,
        asteroid: true,
        icon: '👾',
        condition: () => tutorialAlienCreated && tutorialAlienDestroyed
    },
    {
        text: "Double tap to activate your bomb (secondary weapon). Only three uses!",
        position: { top: '100', left: '90' },
        arrowPosition: { top: '70', left: '110' },
        arrowRotation: 0,
        icon: '💣',
        condition: () => secondaryWeaponUsedOnMobile
    },
    {
        text: "This is your health. Don't let it reach zero!",
        position: { top: '100', left: '60' },
        arrowPosition: { top: '70', left: '80' },
        arrowRotation: 0,
        icon: '❤️',
        condition: () => healthConditionTimerPassed
    }
];

// Tutorial steps for fullscreen mode - UNCHANGED POSITIONS
const fullscreenTutorialSteps = [
    {
        text: "Use arrow keys or A,W,S,D or press the A button on your controller to move your ship",
        position: { top: '57%', left: '5%' },
        arrowPosition: { top: '54%', left: '5%' },
        arrowRotation: 0,
        center: true,
        icon: '🎮',
        condition: () => keys['ArrowLeft'] || keys['a'] || keys['s'] || keys['d'] || keys['w'] || keys['ArrowRight'] || keys['ArrowUp'] || keys['ArrowDown']
    },
    {
        text: "Press SPACE to shoot lasers",
        position: { top: '57%', left: '5%' },
        arrowPosition: { top: '54%', left: '5%' },
        arrowRotation: 0,
        center: true,
        icon: '🔫',
        condition: () => keys[' '] // Space key pressed
    },
    {
        text: "Shoot the tutorial asteroid to get XP!",
        position: { top: '37%', left: '22%' },
        arrowPosition: { top: '34%', left: '24.5%' },
        arrowRotation: 0,
        asteroid: true,
        icon: '🎯',
        condition: () => tutorialAsteroidDestroyed
    },
    {
        text: "Collect glowing objects for an XP boost and special upgrades!",
        position: { top: '73%', left: '50%' },
        arrowPosition: { top: '70%', left: '50%' },
        arrowRotation: 0,
        icon: '✨',
        condition: () => gemCollected
    },
    {
        text: "Pick an upgrade with XP!",
        position: { top: '0%', left: '49%' },
        arrowPosition: { top: '0%', left: '61%' },
        arrowRotation: 180,
        textRotation: 90,
        icon: '⬆️',
        condition: () => level > 1 && elementalAsteroidCreated
    },
    {
        text: "Destroy the elemental asteroid to see its effect!",
        position: { top: '38%', left: '72%' },
        arrowPosition: { top: '35%', left: '74.5%' },
        arrowRotation: 0,
        elementAsteroid: true,
        icon: '💥',
        condition: () => elementalAsteroidCreated && elementalAsteroidDestroyed
    },
    {
        text: "Everything green is an enemy. Now, shoot the alien ship before it gets you!",
        position: { top: '45%', left: '22%' },
        arrowPosition: { top: '39%', left: '24%' },
        arrowRotation: 0,
        asteroid: true,
        icon: '👾',
        condition: () => tutorialAlienCreated && tutorialAlienDestroyed
    },
    {
        text: "Press E to use your bomb (secondary weapon). Only three uses!",
        position: { top: '100', left: '90' },
        arrowPosition: { top: '70', left: '110' },
        arrowRotation: 0,
        icon: '💣',
        condition: () => keys['e'] // E key pressed
    },
    {
        text: "This is your health. Don't let it reach zero!",
        position: { top: '100', left: '60' },
        arrowPosition: { top: '70', left: '80' },
        arrowRotation: 0,
        icon: '❤️',
        condition: () => healthConditionTimerPassed
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

// Create the tutorial alien - UNCHANGED
function createTutorialAlien() {
    const tutorialAlien = {
        x: canvas.width * 0.25,
        y: canvas.height * 0.3,
        size: 40,
        speed: 0.2,
        hitpoints: 1,
        isTutorialAlien: true
    };
    aliens.push(tutorialAlien);
    tutorialAlienCreated = true;
}

// Create the tutorial overlay with modern styling but keeping original structure
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
        z-index: 100;
        pointer-events: none;
    `;

    const stepElement = document.createElement('div');
    stepElement.id = 'tutorialStep';
    stepElement.style.cssText = `
        position: absolute;
        background-color: rgba(10, 20, 40, 0.85);
        color: white;
        padding: 10px !important;
        border-radius: 8px;
        max-width: 200px;
        font-family: 'Press Start 2P', monospace;
        letter-spacing: 0;
        font-size: 12px;
        text-align: center;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(100, 150, 255, 0.5);
    `;

    const arrowElement = document.createElement('div');
    arrowElement.id = 'tutorialArrow';
    arrowElement.style.cssText = `
        position: absolute;
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 20px solid rgba(100, 150, 255, 0.7);
    `;

    // Add icon container but keep original structure
    const stepContent = document.createElement('div');
    stepContent.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
    `;

    const stepIcon = document.createElement('div');
    stepIcon.id = 'tutorialIcon';
    stepIcon.style.cssText = `
        font-size: 20px;
        margin-bottom: 5px;
    `;

    const stepText = document.createElement('div');
    stepText.id = 'tutorialText';

    // Create a simple progress bar
    const stepProgress = document.createElement('div');
    stepProgress.id = 'tutorialProgress';
    stepProgress.style.cssText = `
        width: 100%;
        height: 3px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 2px;
        margin-top: 8px;
        overflow: hidden;
    `;

    const stepProgressBar = document.createElement('div');
    stepProgressBar.id = 'tutorialProgressBar';
    stepProgressBar.style.cssText = `
        height: 100%;
        background-color: rgba(100, 150, 255, 0.8);
        width: 0%;
    `;

    // Assemble the elements
    stepProgress.appendChild(stepProgressBar);
    stepContent.appendChild(stepIcon);
    stepContent.appendChild(stepText);
    stepElement.appendChild(stepContent);
    stepElement.appendChild(stepProgress);

    overlay.appendChild(stepElement);
    overlay.appendChild(arrowElement);
    document.body.appendChild(overlay);
}

// Show the current tutorial step - PRESERVING ORIGINAL POSITIONING LOGIC
function showCurrentTutorialStep() {
    const steps = getTutorialSteps();
    const step = steps[currentTutorialStep];
    const stepElement = document.getElementById('tutorialStep');
    const arrowElement = document.getElementById('tutorialArrow');
    const iconElement = document.getElementById('tutorialIcon');
    const textElement = document.getElementById('tutorialText');
    const progressBar = document.getElementById('tutorialProgressBar');

    // Reset positioning exactly as in original
    stepElement.style.bottom = 'unset';
    stepElement.style.right = 'unset';
    arrowElement.style.bottom = 'unset';
    arrowElement.style.right = 'unset';
    stepElement.style.top = 'unset';
    stepElement.style.left = 'unset';
    arrowElement.style.top = 'unset';
    arrowElement.style.left = 'unset';
    arrowElement.style.maxWidth = "auto";

    // Set content
    textElement.textContent = step.text;
    iconElement.textContent = step.icon || '';

    // Update progress
    const progress = ((currentTutorialStep + 1) / steps.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Apply position based on step type - EXACT SAME LOGIC AS ORIGINAL
    if (step.asteroid === true) {
        stepElement.style.transform = `translateX(${(canvas.width * 0.25) - 90}px) translateY(${(canvas.height * 0.3) + 70}px)`;
        arrowElement.style.transform = `translateX(${(canvas.width * 0.25)}px) translateY(${(canvas.height * 0.3) + 40}px)`;
    }
    else if (step.elementAsteroid === true) {
        stepElement.style.transform = `translateX(${(canvas.width * 0.75) - 120}px) translateY(${(canvas.height * 0.3) + 70}px)`;
        arrowElement.style.transform = `translateX(${(canvas.width * 0.75) - 10}px) translateY(${(canvas.height * 0.3) + 40}px)`;
    }
    else if (step.center === true) {
        stepElement.style.transform = `translateX(${(canvas.width * 0.5) - 80}px) translateY(${(canvas.height * .5) + 70}px)`;
        arrowElement.style.transform = `translateX(${(canvas.width * 0.5)}px) translateY(${(canvas.height * 0.5) + 40}px)`;
    }
    else {
        for (const [key, value] of Object.entries(step.position)) {
            stepElement.style[key] = value.endsWith('%') ? value : `${value}px`;
        }
        for (const [key, value] of Object.entries(step.arrowPosition)) {
            arrowElement.style[key] = value.endsWith('%') ? value : `${value}px`;
        }
    }

    // Center horizontally if left is 50% - EXACT SAME LOGIC AS ORIGINAL
    if (step.position.left === '50%') {
        stepElement.style.transform = 'translateX(-50%)';
    }
    else {
        if (step.textRotation !== undefined) {
            const screenWidth = window.innerWidth;
            if (screenWidth < 450 && canvas.height < 650) {
                stepElement.style.top = `10px`;
                arrowElement.style.top = '18px';
                arrowElement.style.left = "75%";
            }
            else if (canvas.height < 616) {
                stepElement.style.top = `10px`;
                arrowElement.style.top = '18px';
                arrowElement.style.left = "65%";
            }
            else if (canvas.height < 800) {
                stepElement.style.top = "1%";
                stepElement.style.left = "50%";
                stepElement.style.transform = 'translateX(-50%)';
                arrowElement.style.top = "7%";
                arrowElement.style.left = "50%";
            }
            else {
                if (!isMobileDevice() && canvas.height > canvas.width) {
                    stepElement.style.top = "27%";
                    arrowElement.style.top = "30%";
                    arrowElement.style.left = "50%";
                }
                else {
                    stepElement.style.top = "15%";
                    stepElement.style.left = "50%";
                    stepElement.style.transform = 'translateX(-50%)';
                    arrowElement.style.top = "20%";
                    arrowElement.style.left = "50%";
                }
            }
        }
        else if (step.asteroid !== true && step.elementAsteroid !== true && step.center !== true) {
            stepElement.style.transform = `unset`;
            stepElement.style.translate = `unset`;
        }
    }

    if (step.arrowPosition.left === '50%') {
        arrowElement.style.transform = `translateX(-50%) rotate(${step.arrowRotation}deg)`;
    } else if (step.asteroid !== true && step.elementAsteroid !== true && step.center !== true) {
        arrowElement.style.transform = `rotate(${step.arrowRotation}deg)`;
    }
}

// Create tutorial asteroid - UNCHANGED POSITION AND PROPERTIES
function createTutorialAsteroidAndAddSecondary() {
    // Create normal tutorial asteroid
    tutorialAsteroid = {
        x: canvas.width * 0.26,
        y: canvas.height * 0.3,
        size: 20,
        speed: 0,
        dx: 0,
        dy: 0,
        angle: 0,
        rotationSpeed: 0,
        hitpoints: 1,
        initialHitpoints: 1,
        isTutorialAsteroid: true,
        type: 'normal',
        color: 'gray',
        label: 'Tutorial Asteroid'
    };
    asteroids.push(tutorialAsteroid);

    // Set ship position - UNCHANGED
    ship.x = canvas.width * 0.5;
    ship.y = canvas.height * 0.8;

    const activeWeapon = Object.values(secondaryWeapons).find(weapon => weapon.isActive);
    if (activeWeapon) {
        activeWeapon.uses = 3;
    }
}

// Create tutorial elemental asteroid - UNCHANGED POSITION AND PROPERTIES
function createTutorialElementalAsteroid() {
    // Create elemental asteroid
    if (!elementalAsteroidCreated && level > 1) {
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
}

// Create a tutorial gem - UNCHANGED POSITION AND PROPERTIES
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

// Update the tutorial - SAME LOGIC AS ORIGINAL
function updateTutorial() {
    if (!tutorialActive) return;

    const steps = getTutorialSteps();
    const currentStep = steps[currentTutorialStep];

    // Update animation frame counter for highlight effect
    tutorialAnimationFrame++;
    highlightPulse = Math.sin(tutorialAnimationFrame * 0.1) * 0.2 + 0.8;

    // Check for gem collection - COMMENTED OUT AS IN ORIGINAL
    // if (!gemCollected) {
    //     gemCollected = !droppedGems.some(gem => gem.label === 'Tutorial Gem');
    // }

    // Check for elemental asteroid destruction
    if (elementalAsteroidCreated && !elementalAsteroidDestroyed) {
        elementalAsteroidDestroyed = !asteroids.some(asteroid => asteroid.isElemental);
        if (elementalAsteroidDestroyed) {
            createTutorialAlien();
        }
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
        console.log(steps.length, "---", currentTutorialStep);
        if (currentTutorialStep === steps.length - 2) {
            lastStep();
        }
    }

    if (currentStep.condition()) {
        currentTutorialStep++;
        if (currentTutorialStep >= steps.length) {
            endTutorial();
            console.log("tutorial end");
        } else {
            showCurrentTutorialStep();
        }
    }
}

// Highlight the tutorial asteroid - SIMILAR TO ORIGINAL
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

// End the tutorial - ORIGINAL FUNCTIONALITY
function endTutorial() {
    tutorialActive = false;
    if (document.getElementById('tutorialOverlay'))
        document.getElementById('tutorialOverlay').remove();
    localStorage.setItem('tutorialCompleted', 'true');
    gameSpeed = 1; // Reset game speed to normal
}

// Draw all tutorial elements
function drawTutorial() {
    if (!tutorialActive) return;

    // Highlight the current tutorial object
    const steps = getTutorialSteps();
    const currentStep = steps[currentTutorialStep];

    if (currentStep.asteroid && tutorialAsteroid) {
        highlightTutorialAsteroid();
    } else if (currentStep.elementAsteroid && elementalAsteroidCreated && !elementalAsteroidDestroyed) {
        // Highlight elemental asteroid
        const elementalAsteroid = asteroids.find(a => a.isElemental);
        if (elementalAsteroid) {
            ctx.save();
            ctx.strokeStyle = elementalAsteroid.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(elementalAsteroid.x, elementalAsteroid.y, elementalAsteroid.size + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    } else if (currentTutorialStep === 3 && !gemCollected) {
        // Highlight the gem
        const gem = droppedGems.find(g => g.label === 'Tutorial Gem');
        if (gem) {
            ctx.save();
            ctx.strokeStyle = 'gold';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(gem.x, gem.y, gem.size + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    } else if (currentTutorialStep === 6 && tutorialAlienCreated && !tutorialAlienDestroyed) {
        // Highlight the alien
        const alien = aliens.find(a => a.isTutorialAlien);
        if (alien) {
            ctx.save();
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(alien.x, alien.y, alien.size + 5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }
}

// Add this function to the main game loop
function updateGameWithTutorial(deltaTime) {
    // Update regular game elements
    updateGame(deltaTime);

    // Update tutorial elements if active
    if (tutorialActive) {
        updateTutorial();
        drawTutorial();
    }
}

// Initialize everything
function initGame() {
    // ... existing initialization code

    // Initialize tutorial if not completed
    if (!localStorage.getItem('tutorialCompleted')) {
        initializeTutorial();
    }
}