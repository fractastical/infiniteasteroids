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
    ctx.lineWidth = 2;

    const simplifiedMode = fps < 30;

    for (let i = 0; i < sonicBlast.waves.length; i++) {
        const wave = sonicBlast.waves[i];
        const opacityFactor = Math.max(0.1, 1 - wave.radius / wave.maxRadius);

        if (simplifiedMode) {
            // Simplified mode: single layer, medium blue
            ctx.strokeStyle = `rgba(30, 144, 255, ${opacityFactor})`;
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
            ctx.stroke();
        } else {
            // Full effect: Multiple layers with dynamic opacity and different blue shades

            // Outer wave: Light blue, faster, more transparent
            ctx.strokeStyle = `rgba(135, 206, 250, ${opacityFactor})`;
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
