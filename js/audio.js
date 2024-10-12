


let currentVolume = 8;

const backgroundMusic = document.getElementById('background-music');
const backgroundMusic2 = document.getElementById('background-music2');
// const backgroundMusic3 = document.getElementById('background-music3');

const megabossBackgroundMusic = document.getElementById('megaboss-background-music');
const superMegabossBackgroundMusic = document.getElementById('supermegaboss-background-music');
const octoBossBackgroundMusic = document.getElementById('octoboss-background-music');

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


const LightningSounds = [
    document.getElementById('lightning-sound')
];


const FlamethrowerSounds = [
    document.getElementById('flamethrower')
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

const alienLaserSounds = [
    document.getElementById('alien-laser-1'),
    document.getElementById('alien-laser-2'),
    document.getElementById('alien-laser-3')
];

const bossLaserSounds = [
    document.getElementById('boss-shoot-1'),
    document.getElementById('boss-shoot-2')
];

const bossDroneSounds = [
    document.getElementById('boss-drone-1')
];

const bossTakeDamageSounds = [
    document.getElementById('boss-take-damage-1')
];


const bossDieSounds = [
    document.getElementById('boss-die')
];



const alienLaughSounds = [
    document.getElementById('alien-laugh-sound'),
];

const gemCollectingSounds = [
    document.getElementById('gem-collecting-sound')
];


const spinSounds = [
    document.getElementById('spin-sound')
];



function playSpinSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * spinSounds.length);
        spinSounds[randomIndex].play();
    }
}

function stopSpinSound() {

    const randomIndex = Math.floor(Math.random() * spinSounds.length);
    spinSounds[randomIndex].pause();

}

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


function playAlienLaserSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * alienLaserSounds.length);
        alienLaserSounds[randomIndex].play();
    }
}

function playAlienLaughSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * alienLaughSounds.length);
        alienLaughSounds[randomIndex].play();
    }
}

function playFlamethrowerSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * FlamethrowerSounds.length);
        FlamethrowerSounds[randomIndex].play();
    }
}


function playLightningSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * LightningSounds.length);
        LightningSounds[randomIndex].play();
    }
}


function playBossLaserSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * bossLaserSounds.length);
        bossLaserSounds[randomIndex].play();
    }
}

function playBossDroneSpawnSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * bossDroneSounds.length);
        bossDroneSounds[randomIndex].play();
    }
}

function playBossTakeDamageSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * bossTakeDamageSounds.length);
        bossTakeDamageSounds[randomIndex].play();
    }
}

function playBossDieSound() {
    if (!toggleSoundOff) {
        const randomIndex = Math.floor(Math.random() * bossDieSounds.length);
        bossDieSounds[randomIndex].play();
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
    ...alienLaserSounds,
    ...LightningSounds,
    ...FlamethrowerSounds,
    ...bossLaserSounds,
    ...bossDroneSounds,
    ...bossTakeDamageSounds,
    ...bossDieSounds,
    backgroundMusic,
    backgroundMusic2,
    // backgroundMusic3,
    megabossBackgroundMusic,
    superMegabossBackgroundMusic,
    octoBossBackgroundMusic
];


// Function to show/hide the volume screen
//TODO: bizarre but can't figure out why this one modal won't consistently open
function toggleSettings() {
    // console.log("vol");
    const settingsModal = document.getElementById('settingsModal');
    settingsModal.style.display = settingsModal.style.display === 'none' ? 'block' : 'none';
    if (settingsModal.style.display === 'none') {
        const container = document.getElementById('activeWeaponClassesContainer');
        container.style.display = "block";

        resumeGame();

    } else {
        const container = document.getElementById('activeWeaponClassesContainer');
        container.style.display = "none";

        pauseGame();

    }

    console.log(settingsModal.style.display);
}

// Function to set the volume of all sounds
function setVolume(volume) {
    allSounds.forEach(sound => {
        sound.volume = volume / 10;
    });
    currentVolume = volume;
}

function pauseAllMusic() {
    if (backgroundMusic)
        backgroundMusic.pause(); // Stop al background music
    if (megabossBackgroundMusic)
        megabossBackgroundMusic.pause();
    if (superMegabossBackgroundMusic)
        superMegabossBackgroundMusic.pause();
    if (octoBossBackgroundMusic)
        octoBossBackgroundMusic.pause();
    if (backgroundMusic2)
        backgroundMusic2.pause();
    // if (backgroundMusic3)
    //     backgroundMusic3.pause();


}

// Event listener for volume slider
document.getElementById('volumeSlider').addEventListener('input', function () {
    const volume = this.value;
    document.getElementById('volumeValue').innerText = volume;
    setVolume(volume);
});

// Event listener for 'v' key to toggle volume screen
// document.addEventListener('keydown', function (e) {
//     if (e.key === 'v' || e.key === 'V') {
//         toggleVolumeScreen();
//     }
// });

// Function to initialize sounds and set their volume to the current volume
function initializeSounds() {
    allSounds.forEach(sound => {
        sound.volume = currentVolume / 10;
    });
}

// Call this function once to set initial volumes
initializeSounds();
