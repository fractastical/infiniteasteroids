function getRandomUpgrades(count) {
    let upgradeLimit = 9;
    if (overClockingAllowed)
        upgradeLimit += 5;

    const upgradeDefinitions = {
        'Increase Laser Level': { icon: 'icon-basiclaser', description: 'Enhances your main laser weapon' },
        'Decrease Laser Cooldown': { icon: 'icon-basiclaser', description: 'Fire lasers more frequently' },
        'Increase Max Speed': { icon: 'icon-ship', description: 'Boost your ship\'s top speed' },
        'Increase Rotation Speed': { icon: 'icon-ship', description: 'Improve ship maneuverability' },
        'Activate Turret': { icon: 'icon-turret', description: 'Deploy a powerful defensive turret' },
        'Increase Turret Firerate': { icon: 'icon-turret', description: 'Enhance turret attack speed' },
        'Increase Turret Damage': { icon: 'icon-turret', description: 'Boost turret damage output' },
        'Activate Bomber Drone': { icon: 'icon-bomberdrone', description: 'Deploy a drone that lays mines' },
        'Increase Bomber Drone Bomb Radius': { icon: 'icon-bomberdrone', description: 'Expand explosion radius' },
        'Increase Bomber Drone Bomb Damage': { icon: 'icon-bomberdrone', description: 'Increase bomb damage' },
        'Activate Explosive Laser': { icon: 'icon-explosive', description: 'Equip lasers with explosive power' },
        'Increase Explosive Laser Level': { icon: 'icon-explosive', description: 'Enhance explosive laser potency' },
        'Activate Sonic Blast': { icon: 'icon-sonic', description: 'Unleash devastating sonic waves' },
        'Increase Sonic Blast Range': { icon: 'icon-sonic', description: 'Extend sonic blast reach' },
        'Increase Sonic Blast Damage': { icon: 'icon-sonic', description: 'Amplify sonic blast power' },
        'Decrease Sonic Blast Cooldown': { icon: 'icon-sonic', description: 'Reduce time between sonic blasts' },
        'Activate Boomerang': { icon: 'icon-boomerang', description: 'Deploy a returning projectile' },
        'Increase Boomerang Speed': { icon: 'icon-boomerang', description: 'Boost boomerang velocity' },
        'Increase Boomerang Damage': { icon: 'icon-boomerang', description: 'Enhance boomerang impact' },
        'Activate Freeze Effect': { icon: 'icon-freeze', description: 'Gain the ability to freeze enemies' },
        'Increase Freeze Duration': { icon: 'icon-freeze', description: 'Extend freeze effect time' },
        'Decrease Freeze Cooldown': { icon: 'icon-freeze', description: 'Use freeze ability more often' },
        'Activate Acid Bomb': { icon: 'icon-acid', description: 'Gain corrosive area attack' },
        'Increase Acid Bomb Duration': { icon: 'icon-acid', description: 'Prolong acid effect' },
        'Decrease Acid Bomb Cooldown': { icon: 'icon-acid', description: 'Deploy acid bombs more frequently' },
        'Increase Acid Bomb Size': { icon: 'icon-acid', description: 'Expand acid coverage area' },
        'Activate Drone': { icon: 'icon-drone', description: 'Deploy an autonomous combat drone' },
        'Increase Drone Firerate': { icon: 'icon-drone', description: 'Boost drone attack speed' },
        'Increase Drone Damage': { icon: 'icon-drone', description: 'Enhance drone weapon power' },
        'Activate Death Ray': { icon: 'icon-deathray', description: 'Unlock devastating beam weapon' },
        'Increase Death Ray Length': { icon: 'icon-deathray', description: 'Extend death ray reach' },
        'Increase Death Ray Width': { icon: 'icon-deathray', description: 'Widen death ray beam' },
        'Decrease Death Ray Cooldown': { icon: 'icon-deathray', description: 'Reduce death ray recharge time' },
        'Activate Explosive Rocket': { icon: 'icon-explosiverocket', description: 'Launch powerful explosive rockets' },
        'Increase Explosive Rocket Damage': { icon: 'icon-explosiverocket', description: 'Boost rocket explosion power' },
        'Increase Explosive Rocket Radius': { icon: 'icon-explosiverocket', description: 'Expand rocket blast radius' },
        'Decrease Explosive Rocket Cooldown': { icon: 'icon-explosiverocket', description: 'Launch rockets more frequently' },
        'Activate Chain Lightning': { icon: 'icon-chainlightning', description: 'Unleash arcing electrical attacks' },
        'Increase Chain Lightning Range': { icon: 'icon-chainlightning', description: 'Extend lightning jump distance' },
        'Increase Chain Lightning Damage': { icon: 'icon-chainlightning', description: 'Amplify lightning damage' },
        'Increase Chain Lightning Bounces': { icon: 'icon-chainlightning', description: 'Chain to more targets' },
        'Decrease Chain Lightning Cooldown': { icon: 'icon-chainlightning', description: 'Reduce time between lightning strikes' },
        'Activate Nano Swarm': { icon: 'icon-nanoswarm', description: 'Deploy a cloud of nanobots' },
        'Boost Nano Swarm': { icon: 'icon-nanoswarm', description: 'Enhance nanobot effectiveness' },
        'Decrease Nano Swarm Cooldown': { icon: 'icon-nanoswarm', description: 'Deploy nano swarms more often' },
        'Activate Flamethrower': { icon: 'icon-flamethrower', description: 'Equip short-range flame weapon' },
        'Increase Flamethrower Range': { icon: 'icon-flamethrower', description: 'Extend flame reach' },
        'Increase Flamethrower Damage': { icon: 'icon-flamethrower', description: 'Intensify flame damage' },
        'Decrease Flamethrower Cooldown': { icon: 'icon-flamethrower', description: 'Reduce flamethrower cooldown' },
        'Extra Upgrade Choice': { icon: 'icon-extra', description: 'Gain an additional upgrade option' },
        'Drone Army': { icon: 'icon-droneArmy', description: 'Multiply your drone force' },
        'Wave Turret': { icon: 'icon-doubleTurret', description: 'Add two defensive turret that shoot at an angle' },
        'Triple Turret': { icon: 'icon-tripleTurret', description: 'Deploy three more turrets' },
        'Chain of Flame': { icon: 'icon-chainofflame', description: 'Lighthing powers also burn asteroids they hit' },
        'Explo Drone': { icon: 'icon-explodrone', description: 'Equip drones with explosives' },
        'Sonic Boom': { icon: 'icon-sonicboom', description: 'Launch sonic-powered boomerangs' },
        'Cryo Bomb': { icon: 'icon-cryobomb', description: 'Acid bombs also slow their opponents' },
        'Damage Booster': { icon: 'icon-ship', description: 'Add one to damage from all weapons' }

    };


    const availableUpgrades = [
        ...(getUpgradeCount('basiclaser') <= upgradeLimit + 50 ? ['Increase Laser Level', 'Decrease Laser Cooldown', 'Increase Max Speed', 'Increase Rotation Speed'] : []),
        ...(activeWeaponClasses.includes('turret') ? (getUpgradeCount('turret') <= upgradeLimit ? ['Increase Turret Firerate', 'Increase Turret Damage'] : []) : ['Activate Turret'])

    ];

    if (Achievements.reach_wave_2.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('bomberdrone') ? (getUpgradeCount('bomberdrone') <= upgradeLimit ? ['Increase Bomber Drone Bomb Radius', 'Increase Bomber Drone Bomb Damage'] : []) : ['Activate Bomber Drone'])
        );
    if (Achievements.reach_wave_5.reached && (currentMode != GameModes.ENDLESS_SLOW))
        availableUpgrades.push(...(activeWeaponClasses.includes('freeze') ? (getUpgradeCount('freeze') <= upgradeLimit ? ['Increase Freeze Duration', 'Decrease Freeze Cooldown'] : []) : ['Activate Freeze Effect']));
    if (Achievements.laser_damage.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('explosive') ? (getUpgradeCount('explosive') <= upgradeLimit ? ['Increase Explosive Laser Level'] : []) : ['Activate Explosive Laser']));
    if (Achievements.reach_wave_10.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('sonic') ? (getUpgradeCount('sonic') <= upgradeLimit ? ['Increase Sonic Blast Range', 'Increase Sonic Blast Damage', 'Decrease Sonic Blast Cooldown'] : []) : ['Activate Sonic Blast']));
    if (Achievements.complete_easy_mode.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('boomerang') ? (getUpgradeCount('boomerang') <= upgradeLimit ? ['Increase Boomerang Speed', 'Increase Boomerang Damage'] : []) : ['Activate Boomerang']));
    if (Achievements.complete_normal_mode.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('acid') ? (getUpgradeCount('acid') <= upgradeLimit ? ['Increase Acid Bomb Duration', 'Decrease Acid Bomb Cooldown', 'Increase Acid Bomb Size'] : []) : ['Activate Acid Bomb']));
    if (Achievements.destroy_100_asteroids.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('drone') ? (getUpgradeCount('drone') <= upgradeLimit ? ['Increase Drone Firerate', 'Increase Drone Damage'] : []) : ['Activate Drone']));
    if (Achievements.kill_5_aliens.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('deathray') ? (getUpgradeCount('deathray') <= upgradeLimit ? ['Increase Death Ray Length', 'Increase Death Ray Width', 'Decrease Death Ray Cooldown'] : []) : ['Activate Death Ray']));
    // TEMP
    if (Achievements.complete_hard_mode.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('explosiverocket') ? (getUpgradeCount('explosiverocket') <= upgradeLimit ? ['Increase Explosive Rocket Damage', 'Increase Explosive Rocket Radius', 'Decrease Explosive Rocket Cooldown'] : []) : ['Activate Explosive Rocket']));

    if (Achievements.kill_50_aliens.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('chainlightning') ? (getUpgradeCount('chainlightning') <= upgradeLimit ? ['Increase Chain Lightning Range', 'Increase Chain Lightning Damage', 'Increase Chain Lightning Bounces', 'Decrease Chain Lightning Cooldown'] : []) : ['Activate Chain Lightning']));

    if (Achievements.no_lives_lost.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('nanoswarm') ? (getUpgradeCount('nanoswarm') <= upgradeLimit ? ['Boost Nano Swarm', 'Decrease Nano Swarm Cooldown'] : []) : ['Activate Nano Swarm']));


    if (Achievements.acid_bomb_damage.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('flamethrower') ? (getUpgradeCount('flamethrower') <= upgradeLimit ? ['Increase Flamethrower Range', 'Increase Flamethrower Damage', 'Decrease Flamethrower Cooldown'] : []) : ['Activate Flamethrower']));

    if (!fourthUpgradeUnlocked && Achievements.death_ray_damage.reached)
        availableUpgrades.push('Extra Upgrade Choice');
    if ((activeWeaponClasses.includes('drone') || activeWeaponClasses.includes('bomberdrone')) && Achievements.drone_damage.reached && !droneArmy)
        availableUpgrades.push('Drone Army');
    if (Achievements.complete_meteor_normal_mode.reached && activeWeaponClasses.includes('turret') && !doubleTurret)
        availableUpgrades.push('Wave Turret');
    if (Achievements.complete_planet_normal_mode.reached && activeWeaponClasses.includes('turret') && !tripleTurret)
        availableUpgrades.push('Triple Turret');
    if (Achievements.complete_hard_mode.reached)
        availableUpgrades.push('Damage Booster');

    //TODO: add achievements
    const comboWeapons = canActivateComboWeapons();
    if (!comboFlameChainLightningActive && comboWeapons.flameChainLightning && Achievements.alien_megaboss_killed) {
        availableUpgrades.push('Chain of Flame');
    }
    if (!comboExplosiveDroneActive && comboWeapons.explosiveDrone && Achievements.alien_supermegaboss_killed) {
        availableUpgrades.push('Explo Drone');
    }
    if (!comboSonicBoomerangActive && comboWeapons.sonicBoomerang && Achievements.kill_500_aliens.reached) {
        availableUpgrades.push('Sonic Boom');
    }
    if (!comboCryoBombActive && comboWeapons.cryoBomb && Achievements.alien_octopus_killed.reached) {
        availableUpgrades.push('Cryo Bomb');
    }

    const upgrades = [];
    for (let i = 0; i < count; i++) {
        if (availableUpgrades.length === 0) break;
        const randomIndex = Math.floor(Math.random() * availableUpgrades.length);
        const upgradeName = availableUpgrades[randomIndex];
        // console.log(upgradeDefinitions);
        // console.log(availableUpgrades[randomIndex]);
        upgrades.push({
            name: upgradeName,
            icon: upgradeDefinitions[upgradeName].icon,
            description: upgradeDefinitions[upgradeName].description
        });
        availableUpgrades.splice(randomIndex, 1);
    }
    return upgrades;
}
