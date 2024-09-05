const InfiniteAsteroidsAnimation = (function () {
    let canvas, ctx;
    const text = "INFINITE ASTEROIDS";
    const asteroids = [];
    const colors = ['#FF4500', '#FF6347', '#FF7F50', '#FFA500', '#00FF00']; // Retro orange and green palette

    class Asteroid {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.size = 2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += (this.targetX - this.x) * 0.1;
            this.y += (this.targetY - this.y) * 0.1;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function createTextPath() {
        console.log("Creating text path");
        ctx.font = 'bold 24px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';

        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < canvas.height; y += 2) {
            for (let x = 0; x < canvas.width; x += 2) {
                if (imageData.data[(y * canvas.width + x) * 4 + 3] > 128) {
                    asteroids.push(new Asteroid(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height,
                        x,
                        y
                    ));
                }
            }
        }
        console.log(`Created ${asteroids.length} asteroids`);
    }

    function animate() {
        ctx.fillStyle = 'rgba(17, 17, 17, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        asteroids.forEach(asteroid => {
            asteroid.update();
            asteroid.draw();
        });

        requestAnimationFrame(animate);
    }

    function init(canvasId) {
        console.log("Initializing animation");
        canvas = document.getElementById(canvasId);
        ctx = canvas.getContext('2d');

        canvas.width = 600;
        canvas.height = 200;

        console.log(`Canvas size: ${canvas.width}x${canvas.height}`);

        createTextPath();
        animate();
    }

    return {
        init: init
    };
})();