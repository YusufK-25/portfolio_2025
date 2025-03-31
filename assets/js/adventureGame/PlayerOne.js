
import GameObject from './GameObject.js';

class PlayerOne extends GameObject {
    constructor(data = null, gameEnv = null) {
        super(gameEnv);
        this.data = data || {};
        
        // Initialize spriteData for collision detection
        this.spriteData = {
            id: this.data.id || "PlayerOne",
            greeting: this.data.greeting || "I am Player One!",
            reaction: this.data.reaction || (() => console.log("Player One collision"))
        };
        
        // Initialize properties with defaults if not provided in data
        this.keypress = this.data.keypress || {up: 87, left: 65, down: 83, right: 68};
        this.velocity = this.data.velocity || { x: 0, y: 0 };
        this.xVelocity = 5; // Default step size
        this.yVelocity = 5; // Default step size
        this.direction = 'down'; // Default direction
        this.pressedKeys = {}; // active keys array
        
        // Create canvas for the player
        this.canvas = document.createElement("canvas");
        this.canvas.id = this.data.id || "playerOne";
        this.canvas.width = this.data.pixels?.width || 50;
        this.canvas.height = this.data.pixels?.height || 50;
        this.ctx = this.canvas.getContext('2d');
        
        // Add canvas to game container
        document.getElementById("gameContainer").appendChild(this.canvas);
        
        // Set initial position
        this.position = this.data.INIT_POSITION || { x: 0, y: 0 };
        
        // Set size
        this.width = 50;
        this.height = 50;
        
        // Bind event listeners
        this.bindMovementKeyListners();
    }

    /**
     * Binds key event listeners to handle object movement.
     */
    bindMovementKeyListners() {
        addEventListener('keydown', this.handleKeyDown.bind(this));
        addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    /**
     * Handles key down events to change the player's velocity.
     */
    handleKeyDown({ keyCode }) {
        switch (keyCode) {
            case 87: // 'W' key
                this.velocity.y = -this.yVelocity;
                this.direction = 'up';
                break;
            case 65: // 'A' key
                this.velocity.x = -this.xVelocity;
                this.direction = 'left';
                break;
            case 83: // 'S' key
                this.velocity.y = this.yVelocity;
                this.direction = 'down';
                break;
            case 68: // 'D' key
                this.velocity.x = this.xVelocity;
                this.direction = 'right';
                break;
        }
    }

    /**
     * Handles key up events to stop the player's velocity.
     */
    handleKeyUp({ keyCode }) {
        switch (keyCode) {
            case 87: // 'W' key
                if (this.velocity.y < 0) this.velocity.y = 0;
                break;
            case 65: // 'A' key
                if (this.velocity.x < 0) this.velocity.x = 0;
                break;
            case 83: // 'S' key
                if (this.velocity.y > 0) this.velocity.y = 0;
                break;
            case 68: // 'D' key
                if (this.velocity.x > 0) this.velocity.x = 0;
                break;
        }
    }
    
    // Other methods omitted for brevity...
}

export default PlayerOne;