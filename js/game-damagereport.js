// Initialize the array to store weapon damage data per wave
let weaponDamagePerWave = [];

// Store the last recorded damage values
let lastDamageReport = {};
let isDamageChartVisible = false;

// List of all weapons (matching the keys in damageReport)
const weaponsList = [
    'lasers', 'explosive', 'drones', 'turret', 'sonicBlast', 'bomberDrones',
    'deathRay', 'acid', 'freeze', 'boomerang', 'nano', 'explosiverocket',
    'flamethrower', 'chainlightning', 'fireAsteroid', 'acidAsteroid',
    'lightningAsteroid', 'iceAsteroid'
];

// Function to initialize lastDamageReport
function initializeLastDamageReport() {
    weaponsList.forEach(weapon => {
        lastDamageReport[weapon] = 0;
    });
}

// Function to record the current wave's damage
function recordWeaponDamageForWave() {
    const currentWaveDamage = {};

    weaponsList.forEach(weapon => {
        // Calculate the delta (damage dealt in this wave)
        const deltaDamage = damageReport[weapon] - (lastDamageReport[weapon] || 0);
        currentWaveDamage[weapon] = deltaDamage;

        // Update lastDamageReport for the next wave
        lastDamageReport[weapon] = damageReport[weapon];
    });

    weaponDamagePerWave.push(currentWaveDamage);
}

// Function to get damage for a specific weapon at a specific wave
function getWeaponDamageAtWave(weapon, waveNumber) {
    if (waveNumber < 1 || waveNumber > weaponDamagePerWave.length) {
        console.error(`Wave ${waveNumber} data not available`);
        return null;
    }
    return weaponDamagePerWave[waveNumber - 1][weapon];
}

// Function to get all weapon damages for a specific wave
function getAllWeaponDamagesForWave(waveNumber) {
    if (waveNumber < 1 || waveNumber > weaponDamagePerWave.length) {
        console.error(`Wave ${waveNumber} data not available`);
        return null;
    }
    return weaponDamagePerWave[waveNumber - 1];
}

// Function to get damage history for a specific weapon
function getWeaponDamageHistory(weapon) {
    return weaponDamagePerWave.map((waveDamage, index) => ({
        wave: index + 1,
        damage: waveDamage[weapon]
    }));
}

// Function to print the current wave's damage report
function printCurrentWaveDamageReport() {
    const currentWave = weaponDamagePerWave.length;
    console.log(`Weapon Damage Report for Wave ${currentWave}:`);
    Object.entries(weaponDamagePerWave[currentWave - 1]).forEach(([weapon, damage]) => {
        console.log(`${weapon}: ${damage.toFixed(2)}`);
    });
}

// Function to get total damage dealt by all weapons in a specific wave
function getTotalDamageForWave(waveNumber) {
    const waveDamage = getAllWeaponDamagesForWave(waveNumber);
    if (!waveDamage) return null;
    return Object.values(waveDamage).reduce((total, damage) => total + damage, 0);
}

// Function to get the most effective weapon for a specific wave
function getMostEffectiveWeaponForWave(waveNumber) {
    const waveDamage = getAllWeaponDamagesForWave(waveNumber);
    if (!waveDamage) return null;
    return Object.entries(waveDamage).reduce((max, [weapon, damage]) =>
        damage > max.damage ? { weapon, damage } : max,
        { weapon: '', damage: -Infinity }
    );
}


let damageChart;

function createEndGameDamageChart() {

    const canvas = document.getElementById('endGameDamageChartContainer');
    if (!canvas) {
        console.error('End game damage chart canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d' , { alpha: false  , willReadFrequently: true});
    if (!ctx) {
        console.error('Unable to get 2D context from canvas');
        return;
    }

    // const ctx = document.getElementById('endGameDamageChartContainer').getContext('2d' , { alpha: false  , willReadFrequently: true});
    const endGameDamageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: weaponDamagePerWave.map((_, index) => `Wave ${index + 1}`),
            datasets: weaponsList.map(weapon => ({
                label: damageReportMapping[weapon] || weapon,
                data: weaponDamagePerWave.map(waveDamage => waveDamage[weapon] || 0),
                borderColor: getRandomColor(),
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.1
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Weapon Damage Per Wave',
                    font: {
                        size: 18,
                        color: '#ff00ff'
                    }
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Wave',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Damage',
                        color: '#ffffff'
                    },
                    ticks: {
                        color: '#ffffff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function getRandomColor() {
    const hue = Math.random() * 360;
    return `hsl(${hue}, 70%, 60%)`;
}


function initializeDamageChart() {
    const ctx = document.getElementById('weaponDamageChart').getContext('2d' , { alpha: false  , willReadFrequently: true});
    damageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: weaponsList.map(weapon => ({
                label: weapon,
                data: [],
                borderColor: getRandomColor(),
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                tension: 0.1 // Slight curve for smoother lines
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Weapon Damage Per Wave',
                    font: {
                        size: 18,
                        color: '#ff00ff' // Purple color for the title
                    }
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        color: '#ffffff' // White color for legend text
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Wave',
                        color: '#ffffff' // White color for axis title
                    },
                    ticks: {
                        color: '#ffffff' // White color for axis labels
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Slight white grid lines
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Damage',
                        color: '#ffffff' // White color for axis title
                    },
                    ticks: {
                        color: '#ffffff' // White color for axis labels
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)' // Slight white grid lines
                    }
                }
            }
        }
    });
}

function updateDamageChart() {
    if (!damageChart) {
        initializeDamageChart();
    }

    damageChart.data.labels = weaponDamagePerWave.map((_, index) => `Wave ${index + 1}`);
    damageChart.data.datasets.forEach((dataset, index) => {
        const weapon = weaponsList[index];
        dataset.data = weaponDamagePerWave.map(waveDamage => waveDamage[weapon]);
    });
    damageChart.update();
}

function getRandomColor() {
    const hue = Math.random() * 360;
    return `hsl(${hue}, 70%, 60%)`; // Using HSL for vibrant, distinct colors
}


function showWeaponDamageChart() {
    pauseGame();
    const modal = document.getElementById('weaponDamageChartModal');
    modal.style.display = 'block';
    if (!damageChart) {
        initializeDamageChart();
    }
    updateDamageChart();
}

function closeWeaponDamageChart() {
    const modal = document.getElementById('weaponDamageChartModal');
    modal.style.display = 'none';
    resumeGame();
}

// Event listener for the close button
document.getElementById('closeWeaponDamageChart').addEventListener('click', closeWeaponDamageChart);

function toggleDamageByWeaponWaveChart() {
    const chartModal = document.getElementById('weaponDamageChartModal');
    if (isDamageChartVisible) {
        chartModal.style.display = 'none';
        isDamageChartVisible = false;
        resumeGame();
    } else {
        chartModal.style.display = 'block';
        isDamageChartVisible = true;
        pauseGame()
        updateDamageChart(); // Ensure the chart is up-to-date
    }
}
