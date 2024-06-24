const upgrades = [
    {
        name: 'Glitch Effect',
        description: 'Applies a glitch effect to nearby asteroids, causing them to malfunction and break apart.',
        icon: 'icons/glitch-effect.png',
        rarity: 'rare',
        price: 100
    },
    {
        name: 'Time Dilation',
        description: 'Slows down time for a short duration, making it easier to evade asteroids and aim at targets.',
        icon: 'icons/time-dilation.png',
        rarity: 'common',
        price: 50
    },
    {
        name: 'Space Potato',
        description: 'Summons a giant space potato that orbits around the ship, absorbing incoming asteroids and projectiles.',
        icon: 'icons/space-potato.png',
        rarity: 'epic',
        price: 200
    },
    {
        name: 'Damage Booster',
        description: 'Temporarily boosts the damage output of all weapons.',
        icon: 'icons/damage-booster.png',
        rarity: 'common',
        price: 75
    },
    {
        name: 'Space Monkey',
        description: 'Deploys a mischievous space monkey that distracts and confuses nearby asteroids.',
        icon: 'icons/space-monkey.png',
        rarity: 'uncommon',
        price: 120
    },
    {
        name: 'Space Pizza',
        description: 'Launches a delicious space pizza that attracts and satisfies nearby asteroids, making them harmless.',
        icon: 'icons/space-pizza.png',
        rarity: 'common',
        price: 50
    },
    {
        name: 'Space Pixie',
        description: 'Summons a helpful space pixie that automatically collects power-ups and bonuses.',
        icon: 'icons/space-pixie.png',
        rarity: 'uncommon',
        price: 100
    }
];


function getRandomAffordableUpgrades(coinSupply) {
    // Filter the upgrades that the player can afford
    const affordableUpgrades = upgrades.filter(upgrade => upgrade.price <= coinSupply);

    // Shuffle the affordable upgrades array
    affordableUpgrades.sort(() => 0.5 - Math.random());

    // Select up to three upgrades
    return affordableUpgrades.slice(0, 3);
}
