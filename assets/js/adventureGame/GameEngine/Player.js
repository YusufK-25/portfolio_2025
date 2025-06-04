import Character from './Character.js';
import HomingProjectile from './HomingProjectile.js';

// Define non-mutable constants as defaults
const SCALE_FACTOR = 25; // 1/nth of the height of the canvas
const STEP_FACTOR = 100; // 1/nth, or N steps up and across the canvas
const ANIMATION_RATE = 1; // 1/nth of the frame rate
const INIT_POSITION = { x: 0, y: 0 };

class Player extends Character {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
        this.keypress = data?.keypress || {up: 87, left: 65, down: 83, right: 68};
        this.pressedKeys = {}; // active keys array
        this.bindMovementKeyListners();
        this.bindShootKeyListener(); // Add shoot key listener
        this.gravity = data.GRAVITY || false;
        this.acceleration = 0.001;
        this.time = 0;
        this.moved = false;
        this.projectiles = []; // Array to store active projectiles
    }

    bindMovementKeyListners() {
        addEventListener('keydown', this.handleKeyDown.bind(this));
        addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    bindShootKeyListener() {
        addEventListener('keydown', this.handleShootKeyDown.bind(this));
    }

    handleKeyDown({ keyCode }) {
        // capture the pressed key in the active keys array
        this.pressedKeys[keyCode] = true;
        // set the velocity and direction based on the newly pressed key
        this.updateVelocityAndDirection();
    }

    handleKeyUp({ keyCode }) {
        // remove the lifted key from the active keys array
        if (keyCode in this.pressedKeys) {
            delete this.pressedKeys[keyCode];
        }
        // adjust the velocity and direction based on the remaining keys
        this.updateVelocityAndDirection();
    }

    handleShootKeyDown(event) {
        if (event.key === 'v' || event.key === 'V') {
            console.log('V key pressed - attempting to fire projectile');
            
            // Debug: Check if gameEnv and gameObjects exist
            if (!this.gameEnv) {
                console.error('gameEnv is not defined');
                return;
            }
            
            if (!this.gameEnv.gameObjects) {
                console.error('gameObjects is not defined');
                return;
            }
            
            console.log('Total game objects:', this.gameEnv.gameObjects.length);
            
            // Find enemies in the game environment with better filtering
            const enemies = this.gameEnv.gameObjects.filter(obj => {
                // Skip if this is the current player
                if (obj === this) {
                    return false;
                }
                
                // Check if object has enemy properties
                const isEnemy = obj?.spriteData?.isEnemy || obj?.isEnemy;
                
                // Debug log each object
                if (obj?.spriteData?.id) {
                    console.log(`Checking ${obj.spriteData.id}: isEnemy=${isEnemy}`);
                }
                
                return isEnemy;
            });
            
            console.log('Found enemies:', enemies.length);
            
            if (enemies.length === 0) {
                console.log('No enemies found to target');
                console.log('Available game objects:');
                this.gameEnv.gameObjects.forEach(obj => {
                    console.log(`- ${obj?.spriteData?.id || 'Unknown'}: isEnemy=${obj?.spriteData?.isEnemy || obj?.isEnemy}`);
                });
                return;
            }

            // Find the closest enemy with better error handling
            let closestEnemy = null;
            let closestDistance = Infinity;
            
            for (const enemy of enemies) {
                if (!enemy.position) {
                    console.warn('Enemy has no position:', enemy);
                    continue;
                }
                
                const dx = enemy.position.x - this.position.x;
                const dy = enemy.position.y - this.position.y;
                const distance = dx * dx + dy * dy;
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestEnemy = enemy;
                }
            }
            
            if (!closestEnemy) {
                console.log('No valid enemy with position found');
                return;
            }

            console.log('Targeting closest enemy:', closestEnemy.spriteData?.id || 'Unknown');

            // Create a homing projectile with error handling
            try {
                const projectile = new HomingProjectile(
                    this.position.x + (this.size?.width || 0) / 2, // Center of player
                    this.position.y + (this.size?.height || 0) / 2, // Center of player
                    closestEnemy,
                    this.gameEnv // Pass gameEnv as the 4th parameter
                );
                
                // Add to both local projectiles array and game objects
                this.projectiles.push(projectile);
                this.gameEnv.gameObjects.push(projectile);
                
                console.log('Projectile created and added to game');
            } catch (error) {
                console.error('Error creating projectile:', error);
            }
        }

        // Handle spacebar for hitting back fireballs
        if (event.code === 'Space' && this.spriteData.canHitFireballs) {
            event.preventDefault(); // Prevent page scroll
            this.hitBackFireball();
        }
    }

    /**
     * Hit back nearby fireballs toward the ghast
     */
    hitBackFireball() {
        if (!this.gameEnv || !this.gameEnv.gameObjects) return;
        
        const hitRange = 80; // Range to hit fireballs
        
        // Find GhastFireball objects that can be hit back
        const fireballs = this.gameEnv.gameObjects.filter(obj => 
            obj.constructor.name === 'GhastFireball' && 
            obj.spriteData?.canBeHitBack &&
            obj.spriteData?.damagePlayer && // Only hit back fireballs targeting player
            obj.active && !obj.exploding
        );
        
        console.log(`Found ${fireballs.length} fireballs that can be hit back`);
        
        for (const fireball of fireballs) {
            if (!fireball.position) continue;
            
            const dx = fireball.position.x - this.position.x;
            const dy = fireball.position.y - this.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            console.log(`Fireball distance: ${Math.round(distance)}, hit range: ${hitRange}`);
            
            if (distance <= hitRange) {
                // Hit the fireball back!
                this.reverseFireball(fireball);
                console.log("Successfully hit fireball back!");
                break; // Only hit one fireball per press
            }
        }
    }

    /**
     * Reverse a fireball's direction and make it target the ghast
     */
    reverseFireball(fireball) {
        // Find the ghast to target
        const ghasts = this.gameEnv.gameObjects.filter(obj => 
            obj.spriteData?.id === 'Ghast'
        );
        
        if (ghasts.length === 0) {
            console.log('No ghast found to target, reversing fireball direction');
            // No ghast to target, just reverse direction
            fireball.velocity.x *= -1.5;
            fireball.velocity.y *= -1.5;
            fireball.speed *= 1.5;
            return;
        }
        
        const ghast = ghasts[0];
        console.log('Targeting ghast at position:', ghast.position);
        
        // Use the fireball's built-in reverse method
        if (typeof fireball.reverseDirection === 'function') {
            fireball.reverseDirection(ghast);
        } else {
            // Fallback manual reversal
            const dx = ghast.position.x - fireball.position.x;
            const dy = ghast.position.y - fireball.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 0) {
                const speed = fireball.spriteData.hitBackSpeed || 6;
                fireball.velocity.x = (dx / distance) * speed;
                fireball.velocity.y = (dy / distance) * speed;
                fireball.speed = speed;
                
                // Change target and damage properties
                fireball.target = ghast;
                fireball.spriteData.damagePlayer = false;
                fireball.spriteData.damageGhast = true;
                
                console.log("Fireball manually reversed toward Ghast!");
            }
        }
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
                this.projectiles.splice(i, 1);
                const gameIndex = this.gameEnv.gameObjects.indexOf(projectile);
                if (gameIndex > -1) {
                    this.gameEnv.gameObjects.splice(gameIndex, 1);
                }
                continue;
            }
            
            projectile.update();
            
            // Check bounds
            if (projectile.position.x < -50 || projectile.position.x > this.gameEnv.innerWidth + 50 ||
                projectile.position.y < -50 || projectile.position.y > this.gameEnv.innerHeight + 50) {
                
                projectile.active = false;
                this.projectiles.splice(i, 1);
                
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
        } else {
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