function getRandomUpgrades(count) {
    const availableUpgrades = [
        ...(getUpgradeCount('laser') <= 9 ? ['Increase Laser Level', 'Decrease Laser Cooldown', 'Increase Max Speed', 'Increase Rotation Speed'] : []),
        ...(activeWeaponClasses.includes('turret') ? (getUpgradeCount('turret') <= 9 ? ['Increase Turret Firerate', 'Increase Turret Damage'] : []) : ['Activate Turret'])

    ];

    if (Achievements.reach_wave_2.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('bomberdrone') ? (getUpgradeCount('bomberdrone') <= 9 ? ['Increase Bomber Drone Bomb Radius', 'Increase Bomber Drone Bomb Damage'] : []) : ['Activate Bomber Drone'])
        );
    if (Achievements.reach_wave_5.reached && (currentMode != GameModes.ENDLESS_SLOW))
        availableUpgrades.push(...(activeWeaponClasses.includes('freeze') ? (getUpgradeCount('freeze') <= 9 ? ['Increase Freeze Duration', 'Decrease Freeze Cooldown'] : []) : ['Activate Freeze Effect']));
    if (Achievements.laser_damage.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('explosive') ? (getUpgradeCount('explosive') <= 9 ? ['Increase Explosive Laser Level'] : []) : ['Activate Explosive Laser']));
    if (Achievements.reach_wave_10.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('sonic') ? (getUpgradeCount('sonic') <= 9 ? ['Increase Sonic Blast Range', 'Increase Sonic Blast Damage', 'Decrease Sonic Blast Cooldown'] : []) : ['Activate Sonic Blast']));
    if (Achievements.reach_wave_20.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('boomerang') ? (getUpgradeCount('boomerang') <= 9 ? ['Increase Boomerang Speed', 'Increase Boomerang Damage'] : []) : ['Activate Boomerang']));
    if (Achievements.complete_normal_mode.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('acid') ? (getUpgradeCount('acid') <= 9 ? ['Increase Acid Bomb Duration', 'Decrease Acid Bomb Cooldown', 'Increase Acid Bomb Size'] : []) : ['Activate Acid Bomb']));
    if (Achievements.destroy_100_asteroids.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('drone') ? (getUpgradeCount('drone') <= 9 ? ['Increase Drone Firerate', 'Increase Drone Damange'] : []) : ['Activate Drone']));
    if (Achievements.kill_5_aliens.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('deathray') ? (getUpgradeCount('deathray') <= 9 ? ['Increase Death Ray Length', 'Increase Death Ray Width', 'Decrease Death Ray Cooldown'] : []) : ['Activate Death Ray']));
    // TEMP
    if (Achievements.complete_hard_mode.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('explosiverocket') ? (getUpgradeCount('explosiverocket') <= 9 ? ['Increase Explosive Rocket Damage', 'Increase Explosive Rocket Radius', 'Decrease Explosive Rocket Cooldown'] : []) : ['Activate Explosive Rocket']));

    if (Achievements.kill_15_aliens.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('chainlightning') ? (getUpgradeCount('chainlightning') <= 9 ? ['Increase Chain Lightning Range', 'Increase Chain Lightning Damage', 'Increase Chain Lightning Bounces', 'Decrease Chain Lightning Cooldown'] : []) : ['Activate Chain Lightning']));

    if (Achievements.no_lives_lost.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('nanoswarm') ? (getUpgradeCount('nanoswarm') <= 9 ? ['Boost Nano Swarm', 'Decrease Nano Swarm Cooldown'] : []) : ['Activate Nano Swarm']));


    if (Achievements.acid_bomb_damage.reached)
        availableUpgrades.push(...(activeWeaponClasses.includes('flamethrower') ? (getUpgradeCount('flamethrower') <= 9 ? ['Increase Flamethrower Range', 'Increase Flamethrower Damage', 'Decrease Flamethrower Cooldown'] : []) : ['Activate Flamethrower']));

    if (!fourthUpgradeUnlocked && Achievements.death_ray_damage.reached)
        availableUpgrades.push('Extra Upgrade Choice');
    if ((activeWeaponClasses.includes('drone') || activeWeaponClasses.includes('bomberdrone')) && Achievements.drone_damage.reached)
        availableUpgrades.push('Drone Army');
    if (Achievements.complete_meteor_normal_mode.reached && activeWeaponClasses.includes('turret') && !doubleTurret)
        availableUpgrades.push('Double Turret');
    if (Achievements.complete_planet_normal_mode.reached && activeWeaponClasses.includes('turret') && !tripleTurret)
        availableUpgrades.push('Triple Turret');
    // if (Achievements.complete_hard_mode.reached)
    //   availableUpgrades.push('Damage Booster');

    //TODO: add achievements
    const comboWeapons = canActivateComboWeapons();
    if (comboWeapons.flameChainLightning) {
        availableUpgrades.push('Activate Flame Chain Lightning');
    }
    if (comboWeapons.explosiveDrone) {
        availableUpgrades.push('Activate Explosive Drone');
    }
    if (comboWeapons.sonicBoomerang && Achievements.kill_50_aliens.reached) {
        availableUpgrades.push('Activate Sonic Boomerang');
    }


    const upgrades = [];
    for (let i = 0; i < count; i++) {
        if (availableUpgrades.length === 0) break; // Exit loop if no more upgrades available
        const randomIndex = Math.floor(Math.random() * availableUpgrades.length);
        upgrades.push(availableUpgrades[randomIndex]);
        availableUpgrades.splice(randomIndex, 1);
    }
    return upgrades;
}
