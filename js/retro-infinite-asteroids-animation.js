const InfiniteAsteroidsAnimation = (function () {
    let canvas, ctx;
    const text = "INFINITE ASTEROIDS";
    const particles = [];
    const colors = ['#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3']; // Shades of grey
    const swarmingAlienImages = [];

    class Particle {
        constructor(x, y, targetX, targetY, isAlien) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.size = isAlien ? 12 : Math.random() * 2 + 1; // Smaller size for asteroids
            this.isAlien = isAlien;
            this.color = isAlien ? null : colors[Math.floor(Math.random() * colors.length)];
            this.alienImage = isAlien ? swarmingAlienImages[Math.floor(Math.random() * swarmingAlienImages.length)] : null;
            this.angle = Math.random() * Math.PI * 2;
            this.velocity = { x: 0, y: 0 };
            this.hitpoints = Math.floor(Math.random() * 3) + 1;
            this.type = Math.random() < 0.1 ? 'rare' : 'normal';
            this.frozen = Math.random() < 0.05;
        }

        update() {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0.5) { // Reduced distance threshold for stopping
                this.velocity.x = dx * 0.05; // Increased speed for faster convergence
                this.velocity.y = dy * 0.05;
                this.x += this.velocity.x;
                this.y += this.velocity.y;
                if (this.isAlien) {
                    this.angle += 0.05;
                }
            } else {
                this.x = this.targetX;
                this.y = this.targetY;
            }
        }

        draw() {
            if (this.isAlien) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.drawImage(this.alienImage, -this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            } else {
                ctx.lineWidth = this.hitpoints;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();

                if (this.type !== 'normal') {
                    ctx.fillStyle = this.color;
                    ctx.fill();
                } else {
                    ctx.strokeStyle = this.color;
                }

                ctx.strokeStyle = this.type !== 'normal' ? 'white' : ctx.strokeStyle;
                if (this.frozen) {
                    ctx.strokeStyle = '#22EEEE';
                }

                ctx.stroke();
            }
        }
    }

    function loadAlienImages() {
        return new Promise((resolve) => {
            let loadedCount = 0;
            for (let i = 1; i <= 9; i++) {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === 9) resolve();
                };
                img.src = `icons/swarm/swarming_alien_${i}_green.png`;
                swarmingAlienImages.push(img);
            }
        });
    }

    function getRandomEdgePosition() {
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: return { x: Math.random() * canvas.width, y: 0 }; // Top
            case 1: return { x: canvas.width, y: Math.random() * canvas.height }; // Right
            case 2: return { x: Math.random() * canvas.width, y: canvas.height }; // Bottom
            case 3: return { x: 0, y: Math.random() * canvas.height }; // Left
        }
    }

    function createTextPath() {
        console.log("Creating text path");
        ctx.font = 'bold 32px "Press Start 2P", monospace';
        ctx.textAlign = 'left'; // Changed to left alignment for more precise control
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';

        const characters = text.split('');
        const spacing = 12;
        const totalWidth = ctx.measureText(text).width + (characters.length - 1) * spacing;
        let startX = Math.max(10, (canvas.width - totalWidth) / 2); // Ensure at least 10px from left edge

        const letterCenters = [];
        let currentX = startX;
        characters.forEach((char, index) => {
            const charWidth = ctx.measureText(char).width;
            ctx.fillText(char, currentX, canvas.height / 2);
            letterCenters.push({
                x: currentX + charWidth / 2,
                y: canvas.height / 2,
                width: charWidth,
                pixels: [],
                char: char
            });
            currentX += charWidth + spacing;
        });

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < canvas.height; y += 1) {
            for (let x = 0; x < canvas.width; x += 1) {
                if (imageData.data[(y * canvas.width + x) * 4 + 3] > 128) {
                    const charIndex = letterCenters.findIndex(center =>
                        x >= center.x - center.width / 2 && x < center.x + center.width / 2);
                    if (charIndex >= 0) {
                        letterCenters[charIndex].pixels.push({ x, y });
                    }
                }
            }
        }

        const particlesPerLetter = 150;
        letterCenters.forEach((center, index) => {
            if (center.pixels.length === 0) {
                console.warn(`No pixels detected for letter at index ${index}. Skipping particle creation.`);
                return;
            }
            const isS = center.char.toLowerCase() === 's';
            let centerLine = [];
            if (isS) {
                // Create a center line for 'S'
                const sortedPixels = center.pixels.sort((a, b) => a.y - b.y);
                const step = Math.floor(sortedPixels.length / 20); // Divide into 20 segments
                for (let i = 0; i < sortedPixels.length; i += step) {
                    const segmentPixels = sortedPixels.slice(i, i + step);
                    const avgX = segmentPixels.reduce((sum, p) => sum + p.x, 0) / segmentPixels.length;
                    centerLine.push({ x: avgX, y: segmentPixels[0].y });
                }
            }
            for (let i = 0; i < particlesPerLetter; i++) {
                let pixel;
                if (isS && centerLine.length > 0) {
                    const centerPoint = centerLine[Math.floor(Math.random() * centerLine.length)];
                    const nearbyPixels = center.pixels.filter(p =>
                        Math.abs(p.y - centerPoint.y) < 5 && Math.abs(p.x - centerPoint.x) < 5);
                    pixel = nearbyPixels[Math.floor(Math.random() * nearbyPixels.length)] || centerPoint;
                } else {
                    pixel = center.pixels[Math.floor(Math.random() * center.pixels.length)];
                }
                const isAlien = Math.random() < 0.1;
                const edgePos = getRandomEdgePosition();
                particles.push(new Particle(
                    edgePos.x,
                    edgePos.y,
                    pixel.x,
                    pixel.y,
                    isAlien
                ));
            }
        });

        console.log(`Created ${particles.length} particles`);
    } function animate() {
        ctx.fillStyle = 'rgba(17, 17, 17, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    async function init(canvasId) {
        try {
            console.log("Initializing animation");
            canvas = document.getElementById(canvasId);
            if (!canvas) {
                throw new Error(`Canvas with id '${canvasId}' not found`);
            }
            ctx = canvas.getContext('2d');

            canvas.width = 840; // Increased from 800 to 840
            canvas.height = 200;

            console.log(`Canvas size: ${canvas.width}x${canvas.height}`);

            await loadAlienImages();
            createTextPath();
            animate();
        } catch (error) {
            console.error("Error initializing animation:", error);
        }
    }
    return {
        init: init
    };
})();