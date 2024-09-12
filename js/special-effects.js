let shockwaves = [];


function createMultiExplosion(x, y, size) {
    const explosionCount = 10;
    const maxDelay = 1000; // Maximum delay in milliseconds

    for (let i = 0; i < explosionCount; i++) {
        setTimeout(() => {
            createBossExplosion(
                x + (Math.random() - 0.5) * size,
                y + (Math.random() - 0.5) * size,
                Math.random() * size * 0.5 + size * 0.25
            );
        }, Math.random() * maxDelay);
    }
}

function createBossExplosion(x, y, size) {
    const particleCount = 50;
    const colorSchemes = [
        { base: 'rgba(255, 0, 0', highlight: 'rgba(255, 255, 0' },  // Red to Yellow
        { base: 'rgba(0, 0, 255', highlight: 'rgba(0, 255, 255' },  // Blue to Cyan
        { base: 'rgba(255, 165, 0', highlight: 'rgba(255, 255, 255' }  // Orange to White
    ];
    const colorScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];

    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        const particleSize = Math.random() * 5 + 2;
        const life = Math.random() * 60 + 60;
        const color = Math.random() > 0.5 ? colorScheme.base : colorScheme.highlight;

        particles.push({
            x: x,
            y: y,
            size: particleSize,
            speed: speed,
            direction: angle,
            life: life,
            maxLife: life,
            color: color
        });
    }

    // Create a shockwave effect
    createShockwave(x, y, size);
}

function createShockwave(x, y, size) {
    shockwaves.push({
        x: x,
        y: y,
        size: 0,
        maxSize: size * 2,
        life: 30,
        maxLife: 30
    });
}

function updateAndDrawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i];

        // Update position
        particle.x += Math.cos(particle.direction) * particle.speed;
        particle.y += Math.sin(particle.direction) * particle.speed;

        // Update life
        particle.life--;

        // Remove dead particles
        if (particle.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        // Draw particle
        ctx.globalAlpha = particle.life / particle.maxLife;
        ctx.fillStyle = particle.color + `, ${ctx.globalAlpha})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function updateAndDrawShockwaves() {
    for (let i = shockwaves.length - 1; i >= 0; i--) {
        let shockwave = shockwaves[i];

        // Update size
        shockwave.size += (shockwave.maxSize - shockwave.size) * 0.3;

        // Update life
        shockwave.life--;

        // Remove dead shockwaves
        if (shockwave.life <= 0) {
            shockwaves.splice(i, 1);
            continue;
        }

        // Draw shockwave
        ctx.globalAlpha = shockwave.life / shockwave.maxLife;
        ctx.strokeStyle = `rgba(255, 255, 255, ${ctx.globalAlpha})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(shockwave.x, shockwave.y, shockwave.size, 0, Math.PI * 2);
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
}