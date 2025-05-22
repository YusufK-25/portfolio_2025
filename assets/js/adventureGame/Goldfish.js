import Enemy from './GameEngine/Enemy.js';
import Player from './GameEngine/Player.js';

class Goldfish extends Enemy {
    constructor(data = null, gameEnv = null) {
        super(data, gameEnv);
    }

    checkProximityToPlayer() {
        const players = this.gameEnv.gameObjects.filter(obj => obj instanceof Player);

        players.forEach(player => {
            if (player.spriteData?.name === 'mainplayer') {
                const dx = player.position.x - this.position.x;
                const dy = player.position.y - this.position.y;
                const distance = Math.sqrt(dx ** 2 + dy ** 2);

                if (distance > 10) {
                    this.velocity.x = this.gameEnv.innerWidth * (dx > 0 ? 0.0005 : -0.0005);
                    this.velocity.y = this.gameEnv.innerHeight * (dy > 0 ? 0.0005 : -0.0005);
                }
            }
        });
    }

    handleCollisionEvent() {
        const player = this.gameEnv.gameObjects.find(obj => obj instanceof Player);

        if (player && player.id === this.collisionData.touchPoints.other.id) {
            console.log("Goldfish collided with player!");
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.explode(player.position.x, player.position.y);
            player.destroy();
            this.playerDestroyed = true;

            setTimeout(() => {
                this.gameEnv.gameControl.currentLevel.restart = true;
            }, 2000);
        }
    }
}

export default Goldfish;