console.log("Joker.js loaded successfully!");
import GameObject from './GameObject.js';

class Joker extends GameObject {
    constructor(data = null, gameEnv = null) {
        console.log("Joker constructor called with data:", data);
        console.log("Game Environment: ", gameEnv);
        if (!data) throw new Error("Joker requires data!");
        super(gameEnv); 
        console.log("Game Environment 22222: ", gameEnv);

        // Initialize properties
        this.keypress = data?.keypress || { left: 65, right: 68, attack: 74 };
        this.pressedKeys = {};  
        this.frameIndex = 0;
        this.frameCounter = 0;
        this.animationRate = 10;
        this.currentAnimation = "idle"; 
        this.xVelocity = 1;
        this.x = 0; // Start position

        // Initialize spriteData here
        this.spriteData = data.spriteData || {};  // This is where the spriteData is set

        this.loadSpriteSheets(data); // Ensure sprites are loaded

        this.direction = 'right'; // Default direction
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.spriteData.idle.pixels.width;
        this.canvas.height = this.spriteData.idle.pixels.height;
        this.ctx = this.canvas.getContext('2d');
        this.gameEnv = gameEnv;
        document.getElementById("gameContainer").appendChild(this.canvas);

        this.bindMovementKeyListeners();
    }

    loadSpriteSheets(data) {
        // Load the sprite sheets with onload event
        this.idleSheet = new Image();
        this.idleSheet.onload = () => { this.spriteLoaded() }; // Trigger once loaded
        this.idleSheet.src = data.idleSheet;

        this.runningSheet = new Image();
        this.runningSheet.onload = () => { this.spriteLoaded() };
        this.runningSheet.src = data.runningSheet;

        this.attackSheet = new Image();
        this.attackSheet.onload = () => { this.spriteLoaded() };
        this.attackSheet.src = data.attackSheet;

        // Placeholder for ensuring that all sprites are loaded
        this.spritesLoaded = 0;
        this.totalSprites = 3; // Total number of sprite sheets
    }

    spriteLoaded() {
        // Increment loaded sprites count and check if all are loaded
        this.spritesLoaded++;
        if (this.spritesLoaded === this.totalSprites) {
            console.log("All sprites loaded successfully");
        }
    }

    draw() {
        if (!this.idleSheet || !this.runningSheet || !this.attackSheet) {
            console.log('kys');
            return; // Don't draw anything if sprites are not loaded
        }
    
        let frameWidth, frameHeight, frameX, frameY;
        let spriteSheet;
    
        // Define rows and columns for each animation
        const rows = {
            attack: 2,
            idle: 2,  // Idle has 2 rows: one for left, one for right
            running: 1,
        };
        const columns = {
            attack: 4,
            idle: 4,
            running: 4,
        };
    
        // Now you can safely use this.spriteData
        const spriteData = this.spriteData;
    
        if (this.currentAnimation === "attack") {
            spriteSheet = this.attackSheet;
            frameWidth = spriteData.attack.pixels.width / columns.attack;
            frameHeight = spriteData.attack.pixels.height / rows.attack;
            if(this.direction === 'left'){
                frameY = frameHeight;
            }
            else{
                frameY = 0;
            }
        } else if (this.currentAnimation === "idle") {
            spriteSheet = this.idleSheet;
            frameWidth = spriteData.idle.pixels.width / columns.idle;
            frameHeight = spriteData.idle.pixels.height / rows.idle;
            // Idle animation depends on direction, 0 for left, frameHeight for right
            if(this.direction === 'left'){
                frameY = frameHeight;
            }
            else{
                frameY = 0;
            } 
        } else if (this.currentAnimation === "running") {
            spriteSheet = this.runningSheet;
            frameWidth = spriteData.running.pixels.width / columns.running;
            frameHeight = spriteData.running.pixels.height / rows.running;
            frameY = 0; // Only one row for running
        }
    
        frameX = this.frameIndex * frameWidth;
    
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Drawing logic for left or right direction

            this.ctx.drawImage(
                spriteSheet,
                frameX, frameY, frameWidth, frameHeight,
                0, 0, this.canvas.width, this.canvas.height
            );
    
        this.frameCounter++;
        if (this.frameCounter % this.animationRate === 0) {
            if (this.currentAnimation === "attack") {
                this.frameIndex = (this.frameIndex + 1) % columns.attack;
                if (this.frameIndex === 0) {
                    this.currentAnimation = "idle";
                }
            } else {
                this.frameIndex = (this.frameIndex + 1) % columns[this.currentAnimation];
            }
        }
    }            

    // Bind movement keys and setup event listeners
    bindMovementKeyListeners() {
        window.addEventListener('keydown', (event) => {
            if (event.keyCode === this.keypress.left) {
                this.pressedKeys.left = true;
            }
            if (event.keyCode === this.keypress.right) {
                this.pressedKeys.right = true;
            }
            if (event.keyCode === this.keypress.attack) {
                this.pressedKeys.attack = true;
                this.currentAnimation = "attack";
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.keyCode === this.keypress.left) {
                this.pressedKeys.left = false;
            }
            if (event.keyCode === this.keypress.right) {
                this.pressedKeys.right = false;
            }
            if (event.keyCode === this.keypress.attack) {
                this.pressedKeys.attack = false;
            }

            if (!this.pressedKeys.left && !this.pressedKeys.right) {
                this.currentAnimation = "idle";
            } else if (this.pressedKeys.left || this.pressedKeys.right) {
                this.currentAnimation = "running";
            }
        });
    }

    // Movement logic (left and right)
    updateMovement() {
        if (this.pressedKeys.left) {
            this.xVelocity = -1;
            this.direction = 'left';
        } else if (this.pressedKeys.right) {
            this.xVelocity = 1;
            this.direction = 'right';
        } else {
            this.xVelocity = 0;
        }

        // Update the Joker's position
        this.x += this.xVelocity;
    }

    // Update the Joker state
    update() {
        this.updateMovement();  // Update position
        this.draw();            // Draw at new position
        this.collisionChecks();
    }
}

export default Joker;
