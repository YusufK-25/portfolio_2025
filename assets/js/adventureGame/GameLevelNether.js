import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';
import GhastFireball from './GameEngine/GhastFireball.js';

class GameLevelNether {
  constructor(gameEnv) {
    this.gameEnv = gameEnv;
    
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_src_nether = path + "/images/gamify/nether_background.png";
    const image_data_nether = {
      name: 'Nether-Background',
      src: image_src_nether,
      pixels: { height: 570, width: 1025 }
    };

    const sprite_src_steve = path + "/images/gamify/steve.png";
    const STEVE_SCALE_FACTOR = 6;
    const sprite_data_steve = {
      id: 'Steve',
      greeting: "Hi, I am Steve.",
      src: sprite_src_steve,
      SCALE_FACTOR: STEVE_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 25,
      INIT_POSITION: { x: width/16, y: height/2 },
      pixels: {height: 256, width: 128},
      orientation: {rows: 8, columns: 4 },
      down: {row: 1, start: 0, columns: 4 },
      downRight: {row: 7, start: 0, columns: 4, rotate: Math.PI/8 },
      downLeft: {row: 5, start: 0, columns: 4, rotate: -Math.PI/8 },
      left: {row: 5, start: 0, columns: 4 },
      right: {row: 7, start: 0, columns: 4 },
      up: {row: 3, start: 0, columns: 4 },
      upLeft: {row: 5, start: 0, columns: 4, rotate: Math.PI/8 },
      upRight: {row: 7, start: 0, columns: 4, rotate: -Math.PI/8 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
      health: 100,
      canHitFireballs: true,
      isAttacking: false,
      attackCooldown: 0,
      
      gameEnv: gameEnv,
      
      handleAttack: function() {
          if (this.attackCooldown <= 0) {
              this.isAttacking = true;
              this.attackCooldown = 20;
              
              this.checkFireballHit();
              
              setTimeout(() => {
                  this.isAttacking = false;
              }, 300);
          }
      },
      
      checkFireballHit: function() {
          if (!this.gameEnv || !this.gameEnv.gameObjects) return;
          
          const playerPos = this.parent ? this.parent.position : null;
          if (!playerPos) return;
          
          const fireballs = this.gameEnv.gameObjects.filter(obj => 
              obj instanceof GhastFireball && 
              obj.spriteData && 
              obj.spriteData.canBeHitBack &&
              obj.spriteData.damagePlayer === true
          );
          
          for (let fireball of fireballs) {
              if (!fireball.position) continue;
              
              const dx = fireball.position.x - playerPos.x;
              const dy = fireball.position.y - playerPos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              if (distance < 80) {
                  const ghasts = this.gameEnv.gameObjects.filter(obj =>
                      obj.spriteData && obj.spriteData.id === 'Ghast'
                  );
                  
                  if (ghasts.length > 0) {
                      fireball.reverseDirection(ghasts[0]);
                  }
                  break;
              }
          }
      },
      
      reaction: function () {
        if (this.health > 0) {
          this.health -= 20;
          if (this.health <= 0) {
            this.handleGameOver();
          }
        }
      },
      
      handleGameOver: function() {
        this.showGameOverScreen();
        setTimeout(() => {
          location.reload();
        }, 3000);
      },
      
      showGameOverScreen: function() {
        const gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'game-over-screen';
        gameOverDiv.style.cssText = `
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-color: rgba(0, 0, 0, 0.8); display: flex; flex-direction: column;
          justify-content: center; align-items: center; z-index: 10000;
          color: #FF0000; font-size: 48px; font-family: Arial, sans-serif;
        `;
        gameOverDiv.innerHTML = `
          <div>GAME OVER</div>
          <div style="font-size: 24px; margin-top: 20px;">Restarting in 3 seconds...</div>
        `;
        document.body.appendChild(gameOverDiv);
      }
    };

    const sprite_src_ghast = path + "/images/gamify/ghast_sprite.png";
    const GHAST_SCALE_FACTOR = 3;
    const sprite_data_ghast = {
      id: 'Ghast',
      down: { row: 0, start: 0, columns: 4 },
      greeting: "ROOOOOAAAAAR! *shoots fireballs*",
      src: sprite_src_ghast,
      SCALE_FACTOR: GHAST_SCALE_FACTOR,
      ANIMATION_RATE: 100,
      pixels: { width: 256, height: 256 },
      INIT_POSITION: { x: width - 300, y: 100 },
      orientation: { rows: 2, columns: 4 },
      idle: { row: 0, start: 0, columns: 4 },
      shooting: { row: 1, start: 0, columns: 4 },
      hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 },
      health: 150,
      fireballCooldown: 0,
      fireballRate: 120,
      isEnemy: true,
      
      gameEnv: gameEnv,
      lastFireballTime: 0,
      
      reaction: function () {
        this.health -= 30;
        if (this.health <= 0) {
          if (this.parent && this.gameEnv && this.gameEnv.gameObjects) {
            const index = this.gameEnv.gameObjects.indexOf(this.parent);
            if (index > -1) {
              this.gameEnv.gameObjects.splice(index, 1);
            }
          }
        }
      }
    };

    const sprite_src_portal = path + "/images/gamify/nether_portal.png";
    const sprite_data_portal = {
      id: 'Nether-Portal',
      greeting: "Return to the Desert?",
      src: sprite_src_portal,
      SCALE_FACTOR: 4,
      ANIMATION_RATE: 100,
      pixels: { width: 640, height: 800 },
      INIT_POSITION: { x: 50, y: height - 250 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 2, heightPercentage: 2 },
      dialogues: [
        "The portal shimmers with otherworldly energy.",
        "You can return to the Desert through this portal.",
        "The familiar world awaits beyond this threshold."
      ],
      interact: function () {
        const confirmReturn = confirm("Return to the Desert? (This will end the Nether challenge)");
        if (confirmReturn) {
          if (gameEnv && gameEnv.gameControl) {
            this.cleanupNetherLevel();
            gameEnv.gameControl.goToLevel("Desert");
          }
        }
      },
      cleanupNetherLevel: function() {
        const netherElements = document.querySelectorAll('[id*="nether"], [id*="fireball"], [id*="ghast"]');
        netherElements.forEach(element => element.remove());
      }
    };

    const sprite_src_lava = path + "/images/gamify/lava.png";
    const sprite_data_lava = {
      id: 'Lava-Pool',
      src: sprite_src_lava,
      SCALE_FACTOR: 8,
      ANIMATION_RATE: 75,
      pixels: { width: 128, height: 64 },
      INIT_POSITION: { x: width / 2, y: height - 100 },
      orientation: { rows: 1, columns: 8 },
      down: { row: 0, start: 0, columns: 8 },
      hitbox: { widthPercentage: 0.9, heightPercentage: 0.5 },
      damage: 15,
      reaction: function () {
      }
    };

    const sprite_src_potion = path + "/images/gamify/health_potion.png";
    const sprite_data_potion = {
      id: 'Health-Potion',
      greeting: "Health Potion - restores 50 HP",
      src: sprite_src_potion,
      SCALE_FACTOR: 12,
      pixels: { width: 32, height: 32 },
      INIT_POSITION: { x: width * 0.75, y: height - 200 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.8, heightPercentage: 0.8 },
      isPickup: true,
      healAmount: 50,
      reaction: function () {
        const players = this.gameEnv.gameObjects.filter(obj =>
          obj.constructor.name === 'Player' && obj.spriteData.id === 'Steve'
        );
        
        if (players.length > 0) {
          const player = players[0];
          player.spriteData.health = Math.min(player.spriteData.health + this.spriteData.healAmount, 100);
          
          const index = this.gameEnv.gameObjects.indexOf(this);
          if (index > -1) {
            this.gameEnv.gameObjects.splice(index, 1);
          }
        }
      }
    };

    this.classes = [
      { class: GameEnvBackground, data: image_data_nether },
      { class: Player, data: sprite_data_steve, 
        postCreate: (playerInstance) => {
          const originalHandleKeyDown = playerInstance.handleKeyDown ? playerInstance.handleKeyDown.bind(playerInstance) : null;
          
          playerInstance.handleKeyDown = function(event) {
            if (originalHandleKeyDown) {
              originalHandleKeyDown(event);
            }
            
            if (event.code === 'Space' && this.spriteData && this.spriteData.handleAttack) {
              event.preventDefault();
              this.spriteData.handleAttack();
            }
          };
          
          sprite_data_steve.parent = playerInstance;
          
          document.addEventListener('keydown', playerInstance.handleKeyDown.bind(playerInstance));
        }
      },
      { class: Npc, data: sprite_data_ghast, 
        postCreate: (npcInstance) => {
          sprite_data_ghast.parent = npcInstance;
          
          const forceSetSize = () => {
            const pixels = sprite_data_ghast.pixels;
            const scale = sprite_data_ghast.SCALE_FACTOR;
            
            const calculatedSize = {
              width: pixels.width * scale,
              height: pixels.height * scale
            };
            
            npcInstance.size = calculatedSize;
            
            sprite_data_ghast.size = calculatedSize;
            
            return calculatedSize;
          };
          
          const initializeGhast = (attempt = 1, maxAttempts = 15) => {
            const size = forceSetSize();
            
            const hasPosition = npcInstance.position && 
                               !isNaN(npcInstance.position.x) && 
                               !isNaN(npcInstance.position.y);
            
            if (!hasPosition) {
              if (attempt < maxAttempts) {
                setTimeout(() => initializeGhast(attempt + 1, maxAttempts), 50);
                return;
              } else {
                npcInstance.position = { ...sprite_data_ghast.INIT_POSITION };
              }
            }
            
            if (npcInstance.position && npcInstance.size && 
                npcInstance.size.width > 0 && npcInstance.size.height > 0) {
            } else if (attempt < maxAttempts) {
              setTimeout(() => initializeGhast(attempt + 1, maxAttempts), 100);
              return;
            } else {
              return;
            }
            
            npcInstance.shootFireball = function(target) {
              if (!target || !target.position) {
                return;
              }
              
              if (!this.position) {
                return;
              }
              
              if (!this.size) {
                forceSetSize();
                if (!this.size) {
                  return;
                }
              }
              
              const ghastLeft = this.position.x;
              const ghastTop = this.position.y;
              const ghastWidth = this.size.width;
              const ghastHeight = this.size.height;
              
              const mouthX = ghastLeft + (ghastWidth * 0.5);
              const mouthY = ghastTop + (ghastHeight * 0.75);
              
              const offsetX = (Math.random() - 0.5) * 10;
              const offsetY = (Math.random() - 0.5) * 5;
              
              const finalMouthX = mouthX + offsetX;
              const finalMouthY = mouthY + offsetY;
              
              if (isNaN(finalMouthX) || isNaN(finalMouthY)) {
                return;
              }
              
              try {
                const fireball = new GhastFireball(
                  finalMouthX,
                  finalMouthY,
                  target,
                  this.gameEnv,
                  3,
                  0.06
                );
                
                if (!fireball.position || isNaN(fireball.position.x) || isNaN(fireball.position.y)) {
                  fireball.destroy();
                  return;
                }
                
                if (this.gameEnv && this.gameEnv.gameObjects) {
                  this.gameEnv.gameObjects.push(fireball);
                } else {
                  fireball.destroy();
                }
                
              } catch (error) {
              }
            };
            
            const originalUpdate = npcInstance.update.bind(npcInstance);
            npcInstance.update = function() {
              originalUpdate();
              
              if (!this.size) {
                forceSetSize();
              }
              
              if (this.position && this.size) {
                this.updateGhastBehavior();
              }
            };
            
            npcInstance.updateGhastBehavior = function() {
              if (this.spriteData.fireballCooldown > 0) {
                this.spriteData.fireballCooldown--;
              }

              const players = this.gameEnv.gameObjects.filter(obj =>
                obj.constructor.name === 'Player' && obj.spriteData.id === 'Steve'
              );

              if (players.length === 0) return;
              
              const player = players[0];
              if (!player.position || !this.position) return;
              
              const dx = player.position.x - this.position.x;
              const dy = player.position.y - this.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (this.spriteData.fireballCooldown <= 0 && distance < 600) {
                this.shootFireball(player);
                this.spriteData.fireballCooldown = this.spriteData.fireballRate;
                this.direction = 'shooting';
              } else {
                this.direction = 'idle';
              }
            };
          };
          
          setTimeout(() => initializeGhast(), 20);
        }
      },
      { class: Npc, data: sprite_data_portal },
      { class: Npc, data: sprite_data_lava },
      { class: Npc, data: sprite_data_potion }
    ];
    
    this.cleanupPreviousLevel(gameEnv);
  }

  initialize() {
    this.setupFireballCollisionDetection();
  }

  setupFireballCollisionDetection() {
  }

  update() {
    if (this.gameEnv && this.gameEnv.gameObjects) {
      const fireballsToRemove = this.gameEnv.gameObjects.filter(obj => 
        obj instanceof GhastFireball && obj.shouldRemove && obj.shouldRemove()
      );
      
      fireballsToRemove.forEach(fireball => {
        fireball.markForRemoval();
      });
    }
  }

  cleanupPreviousLevel(gameEnv) {
    const essentialElements = this.preserveEssentialElements();
    this.clearGameObjects(gameEnv);
    this.removePreviousUI(essentialElements);
    this.clearIntervals();
    this.resetGlobalStates();
    this.cleanupEventListeners();
  }
  
  preserveEssentialElements() {
    const essentialSelectors = [
      'canvas',
      '#gameContainer',
      '[data-game-env]',
      '.game-engine'
    ];
    
    const essential = [];
    essentialSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => essential.push(el));
    });
    
    return essential;
  }
  
  clearGameObjects(gameEnv) {
    if (gameEnv && gameEnv.gameObjects) {
      const objectsToRemove = [...gameEnv.gameObjects];
      
      objectsToRemove.forEach(obj => {
        try {
          if (obj && typeof obj.destroy === 'function') {
            obj.destroy();
          }
          
          if (obj && obj.element && obj.element.parentNode) {
            if (obj.element.tagName !== 'CANVAS') {
              obj.element.parentNode.removeChild(obj.element);
            }
          }
          
          if (obj.intervalId) {
            clearInterval(obj.intervalId);
          }
          
          if (obj.timeoutId) {
            clearTimeout(obj.timeoutId);
          }
          
        } catch (error) {
          console.warn('Error cleaning up object:', error);
        }
      });
      
      gameEnv.gameObjects.length = 0;
    }
  }
  
  removePreviousUI(essentialElements = []) {
    const essentialSet = new Set(essentialElements);
    
    const elementsToRemove = [
      'eye-counter-container', 'game-timer', 'dom-portal', 
      'game-over-screen', 'dialogue-container', 'level-ui', 
      'score-display', 'health-bar'
    ];
    
    elementsToRemove.forEach(id => {
      const element = document.getElementById(id);
      if (element && !essentialSet.has(element)) {
        element.remove();
      }
    });
  }
  
  clearIntervals() {
    if (window.gameIntervals) {
      window.gameIntervals.forEach(interval => clearInterval(interval));
      window.gameIntervals = [];
    }
    
    if (window.gameTimeouts) {
      window.gameTimeouts.forEach(timeout => clearTimeout(timeout));
      window.gameTimeouts = [];
    }
  }
  
  cleanupEventListeners() {
    if (window.gameKeyListeners) {
      window.gameKeyListeners.forEach(({ type, listener }) => {
        document.removeEventListener(type, listener);
      });
      window.gameKeyListeners = [];
    }
  }
  
  resetGlobalStates() {
    if (window.gameStats) {
      const preservedStats = {
        totalScore: window.gameStats.totalScore || 0,
        playerName: window.gameStats.playerName || ''
      };
      
      window.gameStats = {
        ...preservedStats,
        eyesCollected: 0,
        gameCompleted: false,
        startTime: Date.now(),
        levelStartTime: Date.now()
      };
    }
    
    window.levelComplete = false;
    window.gameOver = false;
    
    if (window.gameEnv && window.gameEnv.ctx) {
      const ctx = window.gameEnv.ctx;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }
}

export default GameLevelNether;