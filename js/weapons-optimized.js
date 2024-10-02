function drawAcidBombs() {
    const time = Date.now() * 0.001; // Current time in seconds for animation

    ctx.save();

    if (!fpsThrottleMode) {
        // High-performance effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(0, 255, 0, 0.5)';

        acidBomb.activeBombs.forEach(bomb => {
            // Create a gradient for each bomb
            const gradient = ctx.createRadialGradient(bomb.x, bomb.y, 0, bomb.x, bomb.y, 8);
            gradient.addColorStop(0, 'rgba(0, 255, 0, 0.8)');
            gradient.addColorStop(0.6, 'rgba(0, 200, 0, 0.6)');
            gradient.addColorStop(1, 'rgba(0, 150, 0, 0.2)');

            ctx.fillStyle = gradient;

            // Draw main bubble
            ctx.beginPath();
            ctx.arc(bomb.x, bomb.y, 6 + Math.sin(time * 5 + bomb.x) * 2, 0, Math.PI * 2);
            ctx.fill();

            // Draw highlight
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(bomb.x - 2, bomb.y - 2, 2, 0, Math.PI * 2);
            ctx.fill();

            // Draw small bubbles around
            for (let i = 0; i < 3; i++) {
                const angle = time * 3 + i * (Math.PI * 2 / 3);
                const x = bomb.x + Math.cos(angle) * 8;
                const y = bomb.y + Math.sin(angle) * 8;
                ctx.beginPath();
                ctx.arc(x, y, 1 + Math.sin(time * 10 + i) * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    } else {
        // Low-performance effect
        ctx.fillStyle = 'rgba(0, 200, 0, 0.8)';
        acidBomb.activeBombs.forEach(bomb => {
            ctx.beginPath();
            ctx.arc(bomb.x, bomb.y, 5 + Math.sin(time * 3 + bomb.x) * 1.5, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    ctx.restore();
}


function drawFlameParticles() {
    ctx.save();
    let intensityFactor = !fpsThrottleMode ? 1 : 0.5; // Scale effect based on FPS
    particles.forEach((particle, index) => {
        ctx.globalAlpha = (particle.life / particle.maxLife) * intensityFactor;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * intensityFactor, 0, Math.PI * 2);
        ctx.fill();

        // Update particle position
        particle.x += Math.cos(particle.direction) * particle.speed * intensityFactor;
        particle.y += Math.sin(particle.direction) * particle.speed * intensityFactor;

        // Reduce particle life
        particle.life -= intensityFactor;
        if (particle.life <= 0) {
            particles.splice(index, 1);
        }
    });
    ctx.restore();
}

function drawSonicBlast() {
    ctx.save();
    ctx.lineWidth = 2;

    const simplifiedMode = fps < 30;

    for (let i = 0; i < sonicBlast.waves.length; i++) {
        const wave = sonicBlast.waves[i];
        const opacityFactor = Math.max(0.1, 1 - wave.radius / wave.maxRadius);

        if (fpsThrottleMode) {
            // Simplified mode: single layer, medium blue
            ctx.strokeStyle = wave.color;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            // Full effect: Multiple layers with dynamic opacity and different blue shades

            // Outer wave: Light blue, faster, more transparent
            ctx.strokeStyle = wave.color;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.stroke();

            // Middle wave: Medium blue, slower, more opaque
            ctx.strokeStyle = `rgba(30, 144, 255, ${Math.max(0.3, opacityFactor * 1.2)})`;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius * 0.8, 0, Math.PI * 2);
            ctx.stroke();

            // Inner wave: Dark blue, slowest, most opaque
            ctx.strokeStyle = `rgba(0, 0, 139, ${Math.max(0.5, opacityFactor * 1.5)})`;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius * 0.5, 0, Math.PI * 2);
            ctx.stroke();

            // Optional: Add a very light blue center for extra effect
            ctx.strokeStyle = `rgba(173, 216, 230, ${Math.max(0.7, opacityFactor * 2)})`;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius * 0.2, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    ctx.restore();
}
