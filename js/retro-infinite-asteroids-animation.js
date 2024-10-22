const InfiniteAsteroidsAnimation = (function () {
    let canvas, ctx;
    const text = "Infinite Asteroids";
    const particles = [];
    const colors = ['#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3']; // Shades of grey
    const swarmingAlienImages = [];

    class Ship {
        constructor(canvas) {
            this.canvas = canvas;
            this.x = -50; // Start off-screen
            this.y = canvas.height / 2;
            this.width = 20;
            this.height = 20;
            this.speed = 2;
            this.lasers = [];
            this.laserLevel = 8;
            this.lastFireTime = 0;
            this.fireInterval = 500; // Time between shots in milliseconds
        }

        update(currentTime) {
            this.x += this.speed;
            if (this.x > this.canvas.width + 550) {
                this.x = -50; // Reset position when it goes off-screen
            }

            // Auto-fire lasers
            if (currentTime - this.lastFireTime > this.fireInterval) {
                this.fireLaser();
                this.lastFireTime = currentTime;
            }

            // Update laser positions
            this.lasers = this.lasers.filter(laser => {
                laser.x += 10; // Increased laser speed
                return laser.x < this.canvas.width;
            });
        }

        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);

            // Draw the ship pointing to the right
            this.drawBasicShip(ctx);

            // Draw lasers
            this.drawLasers(ctx);

            ctx.restore();
        }

        drawBasicShip(ctx) {
            // Draw outer white line
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(this.width, 0);
            ctx.lineTo(-this.width / 2, -this.height / 2);
            ctx.lineTo(-this.width / 2, this.height / 2);
            ctx.closePath();
            ctx.strokeStyle = 'white';
            ctx.stroke();

            // Draw inner yellow line
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.width - 2, 0);
            ctx.lineTo(-this.width / 2 + 2, -this.height / 2 + 2);
            ctx.lineTo(-this.width / 2 + 2, this.height / 2 - 2);
            ctx.closePath();
            ctx.strokeStyle = 'yellow';
            ctx.stroke();
        }

        drawLasers(ctx) {
            ctx.fillStyle = 'red';
            for (let laser of this.lasers) {
                ctx.fillRect(
                    laser.x - this.x,
                    laser.y - this.y - this.laserLevel / 4,
                    this.laserLevel + 3,
                    this.laserLevel / 2 + 3
                );
            }
        }

        fireLaser() {
            this.lasers.push({ x: this.x + this.width, y: this.y });
        }
    }

    function checkCollisions() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            for (let j = ship.lasers.length - 1; j >= 0; j--) {
                const laser = ship.lasers[j];
                const dx = particle.x - laser.x;
                const dy = particle.y - laser.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < particle.size + ship.laserLevel / 2) {
                    // Collision detected
                    createExplosion(particle.x, particle.y);
                    particles.splice(i, 1);
                    // ship.lasers.splice(j, 1);
                    break;
                }
            }
        }
    }

    function animate(currentTime) {
        ctx.fillStyle = 'rgba(17, 17, 17, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Update and draw ship
        ship.update(currentTime);
        ship.draw(ctx);

        // Check for collisions
        checkCollisions();

        // Draw explosions
        drawExplosions();

        // Draw instruction text
        ctx.font = '20px "Press Start 2P", monospace';
        ctx.fillStyle = '#FFFFFF';
        let instruction;
        if (isMobile())
            instruction = mobileInstructions[instructionPhase];
        else
            instruction = instructions[instructionPhase];

        const textWidth = ctx.measureText(instruction).width;
        ctx.fillText(instruction, ship.x - ship.width - 480, ship.y + 2);

        // Change instruction when ship resets
        if (ship.x <= -50) {
            instructionPhase = (instructionPhase + 1) % instructions.length;
        }

        requestAnimationFrame(animate);
    }
    class Particle {
        constructor(x, y, targetX, targetY, isAlien, isS) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.isAlien = isAlien;
            this.isS = isS;

            if (isS) {
                this.size = isAlien ? 8 : Math.random() * 1 + 0.5;
            } else {
                this.size = isAlien ? 12 : Math.random() * 2 + 1;
            }

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
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';

        const characters = text.split('');
        const spacing = 12;
        const totalWidth = ctx.measureText(text).width + (characters.length - 1) * spacing;
        let startX = Math.max(10, (canvas.width - totalWidth) / 2);

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
            for (let i = 0; i < particlesPerLetter; i++) {
                const pixel = center.pixels[Math.floor(Math.random() * center.pixels.length)];
                const isAlien = Math.random() < 0.1;
                const edgePos = getRandomEdgePosition();
                particles.push(new Particle(
                    edgePos.x,
                    edgePos.y,
                    pixel.x,
                    pixel.y,
                    isAlien,
                    isS
                ));
            }
        });

        console.log(`Created ${particles.length} particles`);
    }

    let ship;
    let instructionPhase = 0;
    const instructions = [
        "Press SPACE to fire",
        "Press E for bomb",
        "Beat wave 30 to advance",
        "Final boss on wave 100"
    ];

    const mobileInstructions = [
        "Arrows to steer",
        "Double tap for bomb",
        "Beat wave 30 to advance",
        "Final boss on wave 100"
    ];

    let explosions = [];

    function createExplosion(x, y) {
        explosions.push({
            x: x,
            y: y,
            size: Math.random() * 3 + 2,
            alpha: 1,
            alphaDecay: Math.random() * 0.02 + 0.02,
            color: `hsl(${Math.random() * 50 + 10}, 100%, 50%)`
        });
    }

    function drawExplosions() {
        for (let i = 0; i < explosions.length; i++) {
            let explosion = explosions[i];
            ctx.fillStyle = explosion.color;
            ctx.globalAlpha = explosion.alpha;
            ctx.beginPath();
            ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            explosion.alpha -= explosion.alphaDecay;
            if (explosion.alpha <= 0) {
                explosions.splice(i, 1);
                i--;
            }
        }
    }

    // function animate(currentTime) {
    //     ctx.fillStyle = 'rgba(17, 17, 17, 0.3)';
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);

    //     particles.forEach(particle => {
    //         particle.update();
    //         particle.draw();
    //     });

    //     // Update and draw ship
    //     ship.update(currentTime);
    //     ship.draw(ctx);

    //     // Draw explosions
    //     drawExplosions();

    //     // Randomly create explosions
    //     if (Math.random() < 0.05) {
    //         createExplosion(Math.random() * canvas.width, Math.random() * canvas.height);
    //     }

    //     // Draw instruction text
    //     ctx.font = '20px "Press Start 2P", monospace';
    //     ctx.fillStyle = '#FFFFFF';
    //     const instruction = instructions[instructionPhase];
    //     const textWidth = ctx.measureText(instruction).width;
    //     ctx.fillText(instruction, ship.x + ship.width + 20, ship.y + 7);

    //     // Change instruction when ship resets
    //     if (ship.x <= 0) {
    //         instructionPhase = (instructionPhase + 1) % instructions.length;
    //     }

    //     requestAnimationFrame(animate);
    // }

    // function animate() {
    //     ctx.fillStyle = 'rgba(17, 17, 17, 0.3)';
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);

    //     particles.forEach(particle => {
    //         particle.update();
    //         particle.draw();
    //     });

    //     requestAnimationFrame(animate);
    // }

    async function init(canvasId) {
        try {
            // console.log("Initializing animation");
            canvas = document.getElementById(canvasId);
            if (!canvas) {
                throw new Error(`Canvas with id '${canvasId}' not found`);
            }
            ctx = canvas.getContext('2d' , { alpha: false  , willReadFrequently: true});

            canvas.width = 840;
            canvas.height = 60;

            // console.log(`Canvas size: ${canvas.width}x${canvas.height}`);

            await loadAlienImages();
            // createTextPath();

            // Initialize ship
            ship = new Ship(canvas);

            // Start the animation
            requestAnimationFrame(animate);
        } catch (error) {
            console.error("Error initializing animation:", error);
        }
    } return {
        init: init
    };


})();