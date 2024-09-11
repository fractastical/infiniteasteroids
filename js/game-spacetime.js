function drawGravityWellBackground(ctx, canvasWidth, canvasHeight) {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const gridSize = 40 * baseSizeIncrease;
    const holeRadius = 50;
    const distortionRadius = 150;
    const distortionRadiusSquared = distortionRadius * distortionRadius;
    const holeRadiusSquared = holeRadius * holeRadius;

    // Adjust grid size based on FPS
    // const gridSize = fps < 30 ? baseGridSize * (30 / fps) : baseGridSize;

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 100, 255, 0.5)';
    ctx.lineWidth = 1;

    // Pre-calculate constants
    const distortionFactor = 1 / (distortionRadius - holeRadius);
    const distortionFactor2 = distortionFactor * distortionFactor;

    // Draw horizontal lines
    for (let y = 0; y < canvasHeight; y += gridSize) {
        ctx.beginPath();
        const dy = y - centerY;
        const dy2 = dy * dy;
        for (let x = 0; x < canvasWidth; x += gridSize / 10) {
            const dx = x - centerX;
            const distanceSquared = dx * dx + dy2;

            if (distanceSquared < holeRadiusSquared) {
                if (x === 0 || x >= canvasWidth - gridSize / 10) ctx.moveTo(x, y);
                continue;
            }

            let distortedY = y;
            if (distanceSquared < distortionRadiusSquared) {
                const distance = Math.sqrt(distanceSquared);
                const distortionAmount = 1 - Math.pow((distance - holeRadius) * distortionFactor, 2);
                distortedY = y + (centerY - y) * distortionAmount * 0.5;
            }

            if (x === 0) ctx.moveTo(x, distortedY);
            else ctx.lineTo(x, distortedY);
        }
        ctx.stroke();
    }

    // Draw vertical lines
    for (let x = 0; x < canvasWidth; x += gridSize) {
        ctx.beginPath();
        const dx = x - centerX;
        const dx2 = dx * dx;
        for (let y = 0; y < canvasHeight; y += gridSize / 10) {
            const dy = y - centerY;
            const distanceSquared = dx2 + dy * dy;

            if (distanceSquared < holeRadiusSquared) {
                if (y === 0 || y >= canvasHeight - gridSize / 10) ctx.moveTo(x, y);
                continue;
            }

            let distortedX = x;
            if (distanceSquared < distortionRadiusSquared) {
                const distance = Math.sqrt(distanceSquared);
                const distortionAmount = 1 - Math.pow((distance - holeRadius) * distortionFactor, 2);
                distortedX = x + (centerX - x) * distortionAmount * 0.5;
            }

            if (y === 0) ctx.moveTo(distortedX, y);
            else ctx.lineTo(distortedX, y);
        }
        ctx.stroke();
    }

    // Draw the "hole"
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(centerX, centerY, holeRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw the distortion effect around the hole
    const gradient = ctx.createRadialGradient(centerX, centerY, holeRadius, centerX, centerY, distortionRadius);
    gradient.addColorStop(0, 'rgba(0, 100, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 100, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, distortionRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawGridBackground() {
    const gridSize = 50;
    const lineColor = '#00ffff'; // Cyan color for grid lines
    const backgroundColor = 'black';

    // Fill the background with black
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw vertical grid lines
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Draw horizontal grid lines
    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}



function drawGridWithPerspective() {
    const gridColor = '#00ffff'; // Cyan color for grid lines
    const backgroundColor = 'black';
    const horizonY = canvas.height * 0.6; // Y position of the horizon (adjust for more or less perspective)
    const numLines = 30; // Number of vertical and horizontal lines
    const spacing = 40; // Spacing between grid lines at the bottom

    // Fill the background with black
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Draw vertical lines with perspective
    for (let i = -numLines; i <= numLines; i++) {
        const x = i * spacing;
        const perspectiveX = canvas.width / 2 + (x / (canvas.height - horizonY)) * (canvas.height - horizonY);
        ctx.beginPath();
        ctx.moveTo(perspectiveX, horizonY);
        ctx.lineTo(canvas.width / 2 + x, canvas.height);
        ctx.stroke();
    }

    // Draw horizontal lines with perspective
    for (let j = 0; j < numLines; j++) {
        const y = horizonY + (j * spacing);
        const scale = (y - horizonY) / (canvas.height - horizonY);
        const startX = canvas.width / 2 - (canvas.width * scale) / 2;
        const endX = canvas.width / 2 + (canvas.width * scale) / 2;

        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
    }
}

function drawWarpedGrid() {
    const gridSize = 20; // Adjust this to change the density of the grid
    const warpFactor = 0.2; // Adjust this to change the intensity of the warping

    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)'; // Cyan with very low opacity
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        for (let y = 0; y <= canvas.height; y += 5) {
            const distX = x - canvas.width / 2;
            const distY = y - canvas.height / 2;
            const distance = Math.sqrt(distX * distX + distY * distY);
            const warp = Math.sin(distance * warpFactor) * gridSize / 2;

            if (y === 0) {
                ctx.moveTo(x + warp, y);
            } else {
                ctx.lineTo(x + warp, y);
            }
        }
        ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 5) {
            const distX = x - canvas.width / 2;
            const distY = y - canvas.height / 2;
            const distance = Math.sqrt(distX * distX + distY * distY);
            const warp = Math.sin(distance * warpFactor) * gridSize / 2;

            if (x === 0) {
                ctx.moveTo(x, y + warp);
            } else {
                ctx.lineTo(x, y + warp);
            }
        }
        ctx.stroke();
    }
}

function drawWarpedBackground(ctx, canvasWidth, canvasHeight) {
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
    const numRings = 20 / baseSizeIncrease;
    const numRadialLines = 36 / baseSizeIncrease;

    ctx.save();
    ctx.strokeStyle = 'rgba(0, 100, 255, 0.5)';
    ctx.lineWidth = 1;

    // Draw concentric circles
    for (let i = 0; i < numRings; i++) {
        const radius = (i / numRings) * maxRadius;
        const warpFactor = 1 - Math.pow(radius / maxRadius, 2);

        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const warpedY = centerY + (y - centerY) * warpFactor;

            if (angle === 0) {
                ctx.moveTo(x, warpedY);
            } else {
                ctx.lineTo(x, warpedY);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }

    // Draw radial lines
    for (let i = 0; i < numRadialLines; i++) {
        const angle = (i / numRadialLines) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        for (let r = 0; r <= maxRadius; r += 5) {
            const warpFactor = 1 - Math.pow(r / maxRadius, 2);
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            const warpedY = centerY + (y - centerY) * warpFactor;
            ctx.lineTo(x, warpedY);
        }
        ctx.stroke();
    }

    ctx.restore();
}

function drawZigzagGridBackground(ctx, canvasWidth, canvasHeight) {
    const gridSize = 80 * baseSizeIncrease; // Base size of each grid cell

    // const gridSize = fps < 30 ? baseGridSize * (30 / fps) : baseGridSize;

    const zigzagOffset = 10; // How far the zigzag deviates from straight line
    const lineColor = 'rgb(128, 0, 128)'; // Purple color

    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1;

    // Optimized function to draw a zigzag line
    function drawZigzagLine(startX, startY, endX, endY, zigzagFrequency) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.floor(distance / zigzagFrequency);

        if (steps === 0) {
            ctx.lineTo(endX, endY);
            ctx.stroke();
            return;
        }

        const stepX = dx / steps;
        const stepY = dy / steps;
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        const offsetX = zigzagOffset * Math.cos(angle);
        const offsetY = zigzagOffset * Math.sin(angle);

        for (let i = 1; i <= steps; i++) {
            const x = startX + stepX * i;
            const y = startY + stepY * i;
            const offset = i % 2 === 0 ? 1 : -1;

            ctx.lineTo(x + offsetX * offset, y + offsetY * offset);
        }

        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    // Draw vertical zigzag lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
        drawZigzagLine(x, 0, x, canvasHeight, gridSize / 2);
    }

    // Draw horizontal zigzag lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
        drawZigzagLine(0, y, canvasWidth, y, gridSize / 2);
    }

    ctx.restore();
}


function drawSubtleGridBackground(ctx, canvasWidth, canvasHeight) {
    const gridSize = 40 * baseSizeIncrease; // Base size of each grid cell
    // const gridSize = fps < 30 ? baseGridSize * (30 / fps) : baseGridSize;
    const zigzagOffset = 3; // Reduced zigzag effect
    const lineColor = 'rgba(128, 0, 128, 0.3)'; // More transparent purple color

    ctx.save();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;

    function drawSubtleLine(startX, startY, endX, endY, zigzagFrequency) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        const dx = endX - startX;
        const dy = endY - startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.floor(distance / zigzagFrequency);

        if (steps === 0) {
            ctx.lineTo(endX, endY);
            ctx.stroke();
            return;
        }

        const stepX = dx / steps;
        const stepY = dy / steps;
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        const offsetX = zigzagOffset * Math.cos(angle);
        const offsetY = zigzagOffset * Math.sin(angle);

        for (let i = 1; i <= steps; i++) {
            const x = startX + stepX * i;
            const y = startY + stepY * i;
            const offset = Math.sin(i * Math.PI); // Smoother zigzag

            ctx.lineTo(x + offsetX * offset, y + offsetY * offset);
        }

        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    // Draw vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
        drawSubtleLine(x, 0, x, canvasHeight, gridSize / 2);
    }

    // Draw horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
        drawSubtleLine(0, y, canvasWidth, y, gridSize / 2);
    }

    ctx.restore();
}
