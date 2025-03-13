import Background from './Background.js';
import Npc from './Npc.js';
import Joker from './Joker.js';
class GameLevelDesert {
    constructor(gameEnv) {
      // Values dependent on this.gameEnv.create()
      let width = gameEnv.innerWidth;
      let height = gameEnv.innerHeight;
      let path = gameEnv.path;
  
      // Background data
      const image_src_boss = path + "/images/gamify/desert.png"; // be sure to include the path
      const image_data_boss = {
          name: 'Boss',          src: image_src_desert,
          pixels: {height: 580, width: 1038}
        
    
      };
      // Joker data
      const data_joker = {
        keypress: {
          left: 65,   // 'A' key for left movement
          right: 68,  // 'D' key for right movement
          attack: 74  // 'J' key for attack
        },
        idleSheet: path + "/images/gamify/JokerIdle.png",
        runningSheet: path + '/images/gamify/JokerRunning.png',
        attackSheet: path + '/images/gamify/JokerBaseAttack.png',
        spriteData: {
          idle: {
            pixels: { width: 58, height: 112 },
            frameCount: 4
          },
          running: {
            pixels: { width: 58, height: 112 },
            frameCount: 4
          },
          attack: {
            pixels: { width: 192, height: 53 },
            frameCount: 4
          }
        }
      };
    }
}