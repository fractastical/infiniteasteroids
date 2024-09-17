// Initialize the array to store weapon damage data per wave
let weaponDamagePerWave = [];

// List of all weapons
const weaponsList = [
    'Basic Laser', 'Explosive Laser', 'Turret', 'Drone', 'Bomber Drone',
    'Sonic Blast', 'Death Ray', 'Acid Bomb', 'Freeze Ray', 'Boomerang',
    'Nano Swarm', 'Flamethrower', 'Chain Lightning', 'Explosive Rocket'
];

// Function to calculate and store weapon damage for the current wave
function recordWeaponDamageForWave() {
    const currentWaveDamage = {};

    weaponsList.forEach(weapon => {
        let damage = 0;
        switch (weapon) {
            case 'Basic Laser':
                damage = ship.laserLevel + damageBooster * pixieBoost;
                break;
            case 'Explosive Laser':
                damage = (ship.laserLevel + damageBooster * pixieBoost) * (1 + ship.explosiveLaserLevel * 0.5);
                break;
            case 'Turret':
                const perTurretDamage = turret.damage + damageBooster * pixieBoost;
                damage = perTurretDamage;
                if (doubleTurret)
                    perTurretDamage += perTurretDamage * 2;
                if (tripleTurret)
                    perTurretDamage += perTurretDamage * 3;
                break;
            case 'Drone':
                damage = drones.length * (drones[0].damage + damageBooster * pixieBoost);
                break;
            case 'Bomber Drone':
                damage = bomberDrones.length * (bomberDroneUpgrades.bombDamage + damageBooster * pixieBoost);
                break;
            case 'Sonic Blast':
                damage = sonicBlast.damage + damageBooster * pixieBoost;
                break;
            case 'Death Ray':
                damage = 100 + damageBooster * pixieBoost;
                break;
            case 'Acid Bomb':
                damage = acidBomb.damagePerSecond * acidBomb.size + damageBooster * pixieBoost;
                break;
            case 'Freeze Ray':
                damage = 5 + damageBooster * pixieBoost;
                break;
            case 'Boomerang':
                damage = boomerang.damage + damageBooster * pixieBoost;
                break;
            case 'Nano Swarm':
                damage = nanoswarm.damage + damageBooster * pixieBoost;
                break;
            case 'Flamethrower':
                damage = flamethrower.damagePerSecond + damageBooster * pixieBoost;
                break;
            case 'Chain Lightning':
                damage = chainLightning.damage + damageBooster * pixieBoost;
                break;
            case 'Explosive Rocket':
                damage = explosiveRocket.damage + damageBooster * pixieBoost;
                break;
        }
        currentWaveDamage[weapon] = Number(damage.toFixed(2));
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
        console.log(`${weapon}: ${damage}`);
    });
}
let damageChart;

function initializeDamageChart() {
    const ctx = document.getElementById('weaponDamageChart').getContext('2d');
    damageChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: weaponsList.map(weapon => ({
                label: weapon,
                data: [],
                borderColor: getRandomColor(),
                fill: false
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: 'Weapon Damage Per Wave'
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Wave'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Damage Per Shot'
                    }
                }
            }
        }
    });
}

function updateDamageChart() {
    damageChart.data.labels = weaponDamagePerWave.map((_, index) => `Wave ${index + 1}`);
    damageChart.data.datasets.forEach((dataset, index) => {
        dataset.data = weaponDamagePerWave.map(waveDamage => waveDamage[weaponsList[index]]);
    });
    damageChart.update();
}

function getRandomColor() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
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
