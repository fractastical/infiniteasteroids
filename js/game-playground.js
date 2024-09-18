

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

    activateWeaponClass('sonic');

    for (i = 0; i < 5; i++) {
        console.log("sonicup");
        applyUpgrade('Increase Sonic Blast Range');
        applyUpgrade('Decrease Sonic Blast Cooldown');
        applyUpgrade('Increase Sonic Blast Damage');

    }

}

// function flame5x() {

//     activateWeaponClass('flamethrower');

//     for (i = 0; i < 5; i++) {

//         applyUpgrade('Increase Flamethrower Range');
//         applyUpgrade('Increase Flamethrower Damage');
//         applyUpgrade('Decrease Flamethrower Cooldown');

//     }

// }


function acid5x() {

    activateWeaponClass('acid');

    for (i = 0; i < 5; i++) {
        applyUpgrade('Increase Acid Bomb Duration');
        applyUpgrade('Decrease Acid Bomb Cooldown');
        applyUpgrade('Increase Acid Bomb Size');

    }

}


function freeze5x() {

    activateWeaponClass('freeze');

    for (i = 0; i < 5; i++) {
        applyUpgrade('Activate Freeze Effect');
        applyUpgrade('Increase Freeze Duration');
        applyUpgrade('Decrease Freeze Cooldown');

    }

}


function drone5x() {

    activateWeaponClass('drone');

    for (i = 0; i < 5; i++) {
        // console.log("drone5x");
        applyUpgrade('Increase Drone Firerate');
        applyUpgrade('Increase Drone Damage');

    }

}


function exploding5x() {

    activateWeaponClass('explosive');

    for (i = 0; i < 5; i++) {
        // console.log("drone5x");
        applyUpgrade('Increase Explosive Laser Level');

    }

}


function chain5x() {

    activateWeaponClass('chainlightning');

    for (i = 0; i < 5; i++) {
        console.log("chain5");
        applyUpgrade('Increase Chain Lightning Range');
        applyUpgrade('Increase Chain Lightning Damage');
        applyUpgrade('Increase Chain Lightning Bounces');
        applyUpgrade('Decrease Chain Lightning Cooldown');

    }

}


function boom5x() {

    activateWeaponClass('boomerang');

    for (i = 0; i < 5; i++) {

        console.log("boom5x");

        applyUpgrade('Increase Boomerang Speed');
        applyUpgrade('Increase Boomerang Damage');

    }

}

function flame5x() {

    activateWeaponClass('flamethrower');

    for (i = 0; i < 5; i++) {
        console.log("flame5");
        applyUpgrade('Increase Flamethrower Range');
        applyUpgrade('Increase Flamethrower Damage');
        applyUpgrade('Decrease Flamethrower Cooldown');

    }

}


function flame1x() {

    activateWeaponClass('flamethrower');

    for (i = 0; i < 1; i++) {
        console.log("flame1");
        applyUpgrade('Increase Flamethrower Range');
        applyUpgrade('Increase Flamethrower Damage');
        applyUpgrade('Decrease Flamethrower Cooldown');

    }

}


