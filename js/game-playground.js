

function laser5x() {

    for (i = 0; i < 5; i++) {
        applyUpgrade('Increase Laser Level');
        applyUpgrade('Decrease Laser Cooldown');
    }
}


function spawnRandomUpgrade100x() {
    for (i = 0; i < 100; i++)
        spawnRandomUpgrade();
}


function waveIncrement10x() {
    for (i = 0; i < 10; i++)
        wave++;
}



function sonic5x() {

    for (i = 0; i < 5; i++) {
        console.log("sonicup");
        applyUpgrade('Increase Sonic Blast Range');
        applyUpgrade('Decrease Sonic Blast Cooldown');
        applyUpgrade('Increase Sonic Blast Damage');

    }

}

