function drawAcidBombs() {
    if (fps >= 45) {
        // Cooler effect when FPS is above 45
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.fillStyle = 'green';
        ctx.shadowBlur = 10;
        for (let i = 0; i < acidBomb.activeBombs.length; i++) {
            let bomb = acidBomb.activeBombs[i];
            ctx.beginPath();
            ctx.arc(bomb.x, bomb.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0; // Reset shadow blur to avoid affecting other drawings
    } else {
        // Less sexy effect when FPS is below 45
        ctx.fillStyle = 'green';
        for (let i = 0; i < acidBomb.activeBombs.length; i++) {
            let bomb = acidBomb.activeBombs[i];
            ctx.beginPath();
            ctx.arc(bomb.x, bomb.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}


function drawFlameParticles() {
    ctx.save();
    let intensityFactor = fps >= 45 ? 1 : 0.5; // Scale effect based on FPS
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
    ctx.lineWidth = 2; // Increase line width for better visibility

    const simplifiedMode = fps < 30; // Fallback to simpler effects if FPS drops below 30

    for (let i = 0; i < sonicBlast.waves.length; i++) {
        const wave = sonicBlast.waves[i];

        if (simplifiedMode) {
            // Simplified mode: single layer, basic opacity
            ctx.strokeStyle = `rgba(0, 0, 255, 0.5)`;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            // Full effect: Multiple layers with dynamic opacity
            // First layer: Outer wave, faster, more transparent
            ctx.strokeStyle = `rgba(0, 0, 255, ${Math.max(0.1, 1 - wave.radius / wave.maxRadius)})`;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.stroke();

            // Second layer: Middle wave, slower, more opaque
            ctx.strokeStyle = `rgba(0, 0, 200, ${Math.max(0.3, 1 - wave.radius / (wave.maxRadius * 1.5))})`;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius * 0.8, 0, Math.PI * 2);
            ctx.stroke();

            // Third layer: Inner wave, slowest, most opaque
            ctx.strokeStyle = `rgba(0, 0, 150, ${Math.max(0.5, 1 - wave.radius / (wave.maxRadius * 2))})`;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius * 0.5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    ctx.restore();
}
