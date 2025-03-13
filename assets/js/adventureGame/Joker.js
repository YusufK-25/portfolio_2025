console.log("Joker.js loaded successfully!");
import GameObject from './GameObject.js';

class Joker extends GameObject {
    constructor(data = null, gameEnv = null) {
        console.log("Joker constructor called with data:", data);
        console.log("Game Environment: ", gameEnv);
        if (!data) throw new Error("Joker requires data!");
        super(gameEnv);

        this.keypress = data?.keypress || { left: 65, right: 68, attack: 74 };
        this.pressedKeys = {};  
        this.frameIndex = 0;
        this.animationRate = 200; // Adjusted to a more reasonable value
        this.currentAnimation = "idle"; 
        this.xVelocity = 1;
        this.x = 0;
        this.y = 0;
        this.velocity = { y: 0 };

        this.spriteData = data.spriteData || {};
        this.loadSpriteSheets(data);
        this.direction = 'right';

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.spriteData.attack.pixels.width;
        this.canvas.height = this.spriteData.attack.pixels.height;
        this.ctx = this.canvas.getContext('2d');
        this.gameEnv = gameEnv;
        document.getElementById("gameContainer").appendChild(this.canvas);

        this.bindMovementKeyListeners();
        this.lastFrameTime = 0;
        this.animationTimeAccumulator = 0; // Added accumulator to track frame timing
        requestAnimationFrame((timestamp) => this.update(timestamp));
    }

    loadSpriteSheets(data) {
        this.idleSheet = new Image();
        this.idleSheet.onload = () => { this.spriteLoaded(); };
        this.idleSheet.src = data.idleSheet;

        this.runningSheet = new Image();
        this.runningSheet.onload = () => { this.spriteLoaded(); };
        this.runningSheet.src = data.runningSheet;

        this.attackSheet = new Image();
        this.attackSheet.onload = () => { this.spriteLoaded(); };
        this.attackSheet.src = data.attackSheet;

        this.spritesLoaded = 0;
        this.totalSprites = 3;
    }

    spriteLoaded() {
        this.spritesLoaded++;
        if (this.spritesLoaded === this.totalSprites) {
            console.log("All sprites loaded successfully");
        }
    }

    draw() {
        if (!this.idleSheet || !this.runningSheet || !this.attackSheet) return;

        const now = Date.now();
        const deltaTime = now - this.lastFrameTime;

        const rows = { attack: 2, idle: 2, running: 2 };
        const columns = { attack: 4, idle: 4, running: 4 };
        let spriteSheet, frameWidth, frameHeight, frameX, frameY;

        // Select sprite sheet and calculate frame positions based on current animation
        if (this.currentAnimation === "attack") {
            spriteSheet = this.attackSheet;
            frameWidth = this.spriteData.attack.pixels.width / columns.attack;
            frameHeight = this.spriteData.attack.pixels.height / rows.attack;
            frameY = this.direction === 'left' ? frameHeight : 0;
        } else if (this.currentAnimation === "idle") {
            spriteSheet = this.idleSheet;
            frameWidth = this.spriteData.idle.pixels.width / columns.idle;
            frameHeight = this.spriteData.idle.pixels.height / rows.idle;
            frameY = this.direction === 'left' ? frameHeight : 0;
        } else if (this.currentAnimation === "running") {
            spriteSheet = this.runningSheet;
            frameWidth = this.spriteData.running.pixels.width / columns.running;
            frameHeight = this.spriteData.running.pixels.height / rows.running;
            frameY = this.direction === 'left' ? frameHeight : 0;
        }

        frameX = this.frameIndex * frameWidth;

        // Clear canvas before redrawing
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the sprite on the canvas
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.drawImage(spriteSheet, frameX, frameY, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
        this.ctx.restore();

        // Accumulate time for frame updates
        this.animationTimeAccumulator += deltaTime;
        if (this.animationTimeAccumulator >= this.animationRate) {
            this.frameIndex = (this.frameIndex + 1) % columns[this.currentAnimation];
            this.animationTimeAccumulator = 0; // reset accumulator after updating frame
        }
    }

    bindMovementKeyListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.keyCode === this.keypress.left) {
                this.pressedKeys.left = true;
                if (this.currentAnimation !== "attack") this.currentAnimation = "running";
            }
            if (event.keyCode === this.keypress.right) {
                this.pressedKeys.right = true;
                if (this.currentAnimation !== "attack") this.currentAnimation = "running";
            }
            if (event.keyCode === this.keypress.attack && this.currentAnimation !== "attack") {
                this.startAttack();
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.keyCode === this.keypress.left) this.pressedKeys.left = false;
            if (event.keyCode === this.keypress.right) this.pressedKeys.right = false;
            if (!this.pressedKeys.left && !this.pressedKeys.right && this.currentAnimation !== "attack") {
                this.currentAnimation = "idle";
            }
        });
    }

    startAttack() {
        if (this.currentAnimation === "attack") return;

        console.log("Attack started");
        this.currentAnimation = "attack";
        this.frameIndex = 0;

        const attackFrames = 4;
        const attackSpeed = 100;
        let attackFrameCounter = 0;

        const attackInterval = setInterval(() => {
            this.frameIndex++;
            if (this.frameIndex >= attackFrames) {
                clearInterval(attackInterval);
                this.frameIndex = 0;
                this.currentAnimation = (this.pressedKeys.left || this.pressedKeys.right) ? "running" : "idle";
            }
        }, attackSpeed);
    }

    updateMovement(deltaTime) {
        // Adjust velocity based on key press
        if (this.pressedKeys.left) {
            this.xVelocity = -0.5;
            this.direction = 'left';
        } else if (this.pressedKeys.right) {
            this.xVelocity = 0.5;
            this.direction = 'right';
        } else {
            this.xVelocity = 0;
        }

        // Apply deltaTime to make movement frame-rate independent
        this.x += this.xVelocity * deltaTime;
        this.canvas.style.left = `${this.x}px`;
        this.canvas.style.top = `${this.y}px`;
    }

    update(timestamp) {
        const now = Date.now();
        const deltaTime = now - this.lastFrameTime;

        this.updateMovement(deltaTime);  // Pass deltaTime here
        this.draw(timestamp);
        this.lastFrameTime = now;

        requestAnimationFrame((t) => this.update(t));
    }
}

export default Joker;
