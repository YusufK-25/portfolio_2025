import Character from './Character.js';
import Player from './Player.js';

class Enemy extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.playerDestroyed = false; // Tracks if the player has been "killed"
        this.bounceDistance = 10; // Distance to bounce back after collision
    }

    // Overrides the update method to handle collision detection and movement
    update() {
        // Start by drawing the object
        this.draw();

        // Check if the enemy collides with the player
        if (!this.playerDestroyed && this.collisionChecks()) {
            this.handleCollisionEvent();
            this.bounceBack(); // Bounce the enemy after collision
        }

        // Update enemy movement (you can adjust this depending on your movement logic)
        this.updateMovement();
    }

    // Checks if the Enemy collides with the Player.
    // Returns true if a collision is detected, otherwise false.
    collisionChecks() {
        for (const gameObj of this.gameEnv.gameObjects) {
            if (gameObj instanceof Player) {
                this.isCollision(gameObj);
                if (this.collisionData.hit) {
                    return true;
                }
            }
        }
        return false;
    }

    // Handles what happens when the player collides with the enemy.
    handleCollisionEvent() {
        console.log("Player collided with the Enemy. Player is dead.");
        this.playerDestroyed = true; // Mark the player as "dead"
        this.gameEnv.gameControl.currentLevel.continue = false; // Restart the level
    }

    // Make the enemy bounce back after a collision
    bounceBack() {
        // You can use this method to move the enemy back a bit after the collision
        // Assuming `this.velocityX` and `this.velocityY` control the enemy's movement
        // You can apply the bounce logic by reversing or reducing the movement direction
        this.velocityX = -Math.sign(this.velocityX) * this.bounceDistance; // Bounce horizontally
        this.velocityY = -Math.sign(this.velocityY) * this.bounceDistance; // Bounce vertically
    }

    // Assuming there's a method to update movement in the parent class
    updateMovement() {
        // Update movement based on current velocity
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}

export default Enemy;
