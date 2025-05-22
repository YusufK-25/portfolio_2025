import Character from './Character.js';
import HomingProjectile from './HomingProjectile.js'; // Import the HomingProjectile class

// Define non-mutable constants as defaults
const SCALE_FACTOR = 25; // 1/nth of the height of the canvas
const STEP_FACTOR = 100; // 1/nth, or N steps up and across the canvas
const ANIMATION_RATE = 1; // 1/nth of the frame rate
const INIT_POSITION = { x: 0, y: 0 };

/**
 * Player is a dynamic class that manages the data and events for objects like a player 
 * 
 * This class uses a classic Java class pattern which is nice for managing object data and events.
 * 
 * @method bindEventListeners - Binds key event listeners to handle object movement.
 * @method handleKeyDown - Handles key down events to change the object's velocity.
 * @method handleKeyUp - Handles key up events to stop the object's velocity.
 */
class Player extends Character {
    /**
     * The constructor method is called when a new Player object is created.
     * 
     * @param {Object|null} data - The sprite data for the object. If null, a default red square is used.
     */
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.keypress = data?.keypress || {up: 87, left: 65, down: 83, right: 68};
        this.pressedKeys = {}; // active keys array
        this.bindMovementKeyListners();
        this.gravity = data.GRAVITY || false;
        this.acceleration = 0.001;
        this.time = 0;
        this.moved = false;
    }

    /**
     * Binds key event listeners to handle object movement.
     * 
     * This method binds keydown and keyup event listeners to handle object movement.
     * The .bind(this) method ensures that 'this' refers to the object object.
     */
    bindMovementKeyListners() {
        addEventListener('keydown', this.handleKeyDown.bind(this));
        addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown({ keyCode }) {
        // capture the pressed key in the active keys array
        this.pressedKeys[keyCode] = true;
        // set the velocity and direction based on the newly pressed key
        this.updateVelocityAndDirection();
    }

    /**
     * Handles key up events to stop the player's velocity.
     * 
     * This method stops the player's velocity based on the key released.
     * 
     * @param {Object} event - The keyup event object.
     */
    handleKeyUp({ keyCode }) {
        // remove the lifted key from the active keys array
        if (keyCode in this.pressedKeys) {
            delete this.pressedKeys[keyCode];
        }
        // adjust the velocity and direction based on the remaining keys
        this.updateVelocityAndDirection();
    }

    /**
     * Update the player's velocity and direction based on the pressed keys.
     */
    updateVelocityAndDirection() {
        this.velocity.x = 0;
        this.velocity.y = 0;

        // Multi-key movements (diagonals: upLeft, upRight, downLeft, downRight)
        if (this.pressedKeys[this.keypress.up] && this.pressedKeys[this.keypress.left]) {
            this.velocity.y -= this.yVelocity;
            this.velocity.x -= this.xVelocity;
            this.direction = 'upLeft';
        } else if (this.pressedKeys[this.keypress.up] && this.pressedKeys[this.keypress.right]) {
            this.velocity.y -= this.yVelocity;
            this.velocity.x += this.xVelocity;
            this.direction = 'upRight';
        } else if (this.pressedKeys[this.keypress.down] && this.pressedKeys[this.keypress.left]) {
            this.velocity.y += this.yVelocity;
            this.velocity.x -= this.xVelocity;
            this.direction = 'downLeft';
        } else if (this.pressedKeys[this.keypress.down] && this.pressedKeys[this.keypress.right]) {
            this.velocity.y += this.yVelocity;
            this.velocity.x += this.xVelocity;
            this.direction = 'downRight';
        // Single key movements (left, right, up, down) 
        } else if (this.pressedKeys[this.keypress.up]) {
            this.velocity.y -= this.yVelocity;
            this.direction = 'up';
            this.moved = true;
        } else if (this.pressedKeys[this.keypress.left]) {
            this.velocity.x -= this.xVelocity;
            this.direction = 'left';
            this.moved = true;
        } else if (this.pressedKeys[this.keypress.down]) {
            this.velocity.y += this.yVelocity;
            this.direction = 'down';
            this.moved = true;
        } else if (this.pressedKeys[this.keypress.right]) {
            this.velocity.x += this.xVelocity;
            this.direction = 'right';
            this.moved = true;
        } else{
            this.moved = false;
        }
    }
    update() {
        super.update();
        
        // Update projectiles more efficiently
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            
            if (!projectile.active) {
                // Remove inactive projectiles
                this.projectiles.splice(i, 1);
                
                // Also remove from game objects if it's still there
                const gameIndex = this.gameEnv.gameObjects.indexOf(projectile);
                if (gameIndex > -1) {
                    this.gameEnv.gameObjects.splice(gameIndex, 1);
                }
                continue;
            }
            
            // Update the projectile
            projectile.update();
            
            // Check if projectile went out of bounds
            if (projectile.position.x < -50 || projectile.position.x > this.gameEnv.innerWidth + 50 ||
                projectile.position.y < -50 || projectile.position.y > this.gameEnv.innerHeight + 50) {
                
                projectile.active = false;
                this.projectiles.splice(i, 1);
                
                // Remove from game objects array
                const gameIndex = this.gameEnv.gameObjects.indexOf(projectile);
                if (gameIndex > -1) {
                    this.gameEnv.gameObjects.splice(gameIndex, 1);
                }
            }
        }
        
        // Gravity logic
        if (!this.moved) {
            if (this.gravity) {
                    this.time += 1;
                    this.velocity.y += 0.5 + this.acceleration * this.time;
                }
            }
        else{
            this.time = 0;
        }
        }
        
    /**
     * Overrides the reaction to the collision to handle
     *  - clearing the pressed keys array
     *  - stopping the player's velocity
     *  - updating the player's direction   
     * @param {*} other - The object that the player is colliding with
     */
    handleCollisionReaction(other) {    
        this.pressedKeys = {};
        this.updateVelocityAndDirection();
        super.handleCollisionReaction(other);
    }
}

export default Player;