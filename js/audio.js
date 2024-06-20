


let currentVolume = 8;

const meteorDestroySounds = [
    document.getElementById('meteor-destroy-1'),
    document.getElementById('meteor-destroy-2'),
    document.getElementById('meteor-destroy-3')
];

// Get the audio elements for shots
const shotSounds = [
    document.getElementById('shot-sound-1'),
    document.getElementById('shot-sound-2'),
    document.getElementById('shot-sound-3')
];

// Get the audio elements for thrusters
const thrusterSounds = [
    document.getElementById('thruster-sound-1'),
    document.getElementById('thruster-sound-2'),
    document.getElementById('thruster-sound-3')
];


// Get the audio elements for thrusters
const shipDestroyedSounds = [
    document.getElementById('ship-destroyed')
];


const freezeSounds = [
    document.getElementById('freeze-sound'),
    document.getElementById('freeze-sound-2')

];

const deathRaySounds = [
    document.getElementById('death-ray-sound')
];

const deployDroneSounds = [
    document.getElementById('deploy-drone-sound')
];

const acidBombSounds = [
    document.getElementById('acid-bomb-sound')
];

const bombLaySounds = [
    document.getElementById('bomb-lay-sound')
];

const alienEnteringSounds = [
    document.getElementById('alien-entering-sound')
];

const gemCollectingSounds = [
    document.getElementById('gem-collecting-sound')
];

// Function to play a random shot sound
function playRandomShotSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * shotSounds.length);
        shotSounds[randomIndex].play();
    }
}

function playRandomDeathRaySound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * deathRaySounds.length);
        deathRaySounds[randomIndex].play();
    }
}

function playRandomBombLaySound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * bombLaySounds.length);
        bombLaySounds[randomIndex].play();
    }
}

function playRandomAcidBombSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * acidBombSounds.length);
        acidBombSounds[randomIndex].play();
    }
}

function playDeployDroneSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * deployDroneSounds.length);
        deployDroneSounds[randomIndex].play();
    }
}

function playFreezeSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * freezeSounds.length);
        freezeSounds[randomIndex].play();
    }
}


// Function to play a random thruster sound
function playRandomThrusterSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * thrusterSounds.length);
        thrusterSounds[randomIndex].play();
    }
}

function playRandomMeteorDestroySound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * meteorDestroySounds.length);
        meteorDestroySounds[randomIndex].play();
    }
}


function playShipDestroyedSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * shipDestroyedSounds.length);
        shipDestroyedSounds[randomIndex].play();
    }
}

function playGemCollectingSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * gemCollectingSounds.length);
        gemCollectingSounds[randomIndex].play();
    }
}

function playAlienEnteringSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * alienEnteringSounds.length);
        alienEnteringSounds[randomIndex].play();
    }
}


// Get all sound arrays together
const allSounds = [
    ...meteorDestroySounds,
    ...shotSounds,
    ...thrusterSounds,
    ...shipDestroyedSounds,
    ...freezeSounds,
    ...deathRaySounds,
    ...deployDroneSounds,
    ...acidBombSounds,
    ...bombLaySounds,
    ...alienEnteringSounds,
    ...gemCollectingSounds,
    backgroundMusic // Include background music in the volume control
];

// Function to show/hide the volume screen
function toggleVolumeScreen() {
    const volumeScreen = document.getElementById('volumeScreen');
    volumeScreen.style.display = volumeScreen.style.display === 'none' ? 'block' : 'none';
}

// Function to set the volume of all sounds
function setVolume(volume) {
    allSounds.forEach(sound => {
        sound.volume = volume / 10;
    });
    currentVolume = volume;
}

// Event listener for volume slider
document.getElementById('volumeSlider').addEventListener('input', function () {
    const volume = this.value;
    document.getElementById('volumeValue').innerText = volume;
    setVolume(volume);
});

// Event listener for 'v' key to toggle volume screen
document.addEventListener('keydown', function (e) {
    if (e.key === 'v' || e.key === 'V') {
        toggleVolumeScreen();
    }
});

// Function to initialize sounds and set their volume to the current volume
function initializeSounds() {
    allSounds.forEach(sound => {
        sound.volume = currentVolume / 10;
    });
}

// Call this function once to set initial volumes
initializeSounds();
