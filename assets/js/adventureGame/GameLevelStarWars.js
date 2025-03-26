import Background from './Background.js';
import Player from './Player.js';
import Npc from './Npc.js';
import Projectile from './Projectile.js';

class GameLevelStarWars {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_atat = path + "/images/gamify/atat_background.png"; // Default background
    const image_src_alternate = path + "/images/gamify/starwar.png"; // Alternate background

    let currentBackground = image_src_atat; // Start with default background

    // Create the image element for the background
    const backgroundImg = document.createElement('img');
    backgroundImg.id = 'AT-AT-Background'; // Assign the ID to easily access it later
    backgroundImg.src = currentBackground; // Set the initial background image source
    backgroundImg.style.width = '100%'; // Ensure it takes up the whole screen width
    backgroundImg.style.height = '100vh'; // Ensure it takes up the full viewport height
    document.body.appendChild(backgroundImg); // Append the background image to the body

    // Create the background switch button
    const button = document.createElement('button');
    button.innerText = "Switch Background";
    button.style.position = 'absolute';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#ff4c4c';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    document.body.appendChild(button);

    // Handle background switch
    button.addEventListener('click', () => {
      // Switch the background image
      currentBackground = currentBackground === image_src_atat ? image_src_alternate : image_src_atat;
      backgroundImg.src = currentBackground; // Update the image source
    });

    // Player data for snowspeeder (remains the same as before)
    const sprite_src_snowspeeder = path + "/images/gamify/snowspeeder_sprite2.png"; // be sure to include the path
    const SNOWSPEEDER_SCALE_FACTOR = 6;
    const sprite_data_snowspeeder = {
      id: 'Snowspeeder',
      greeting: "Hi I am snowspeeder, the desert wanderer. I am trying to take down the empire's AT-ATs!",
      src: sprite_src_snowspeeder,
      SCALE_FACTOR: SNOWSPEEDER_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: 0 },
      pixels: { height: 293, width: 358 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1, rotate: -Math.PI / 2 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
      reaction: function () {
        alert("We just got hit by a projectile!");
      }
    };

    // NPC Data for Turret Anti-Air (remains the same as before)
    const sprite_src_turret = path + "/images/gamify/aa_spritesheet1.png";
    const TURRET_SCALE_FACTOR = 3;
    const sprite_data_turret = {
      id: 'Turret-Anti-Air',
      greeting: "I am the Anti-Air Turret. I am here to take down the snowspeeder!",
      src: sprite_src_turret,
      SCALE_FACTOR: TURRET_SCALE_FACTOR,
      ANIMATION_RATE: 100,
      pixels: { width: 1056, height: 236 },
      INIT_POSITION: { x: width - (height / TURRET_SCALE_FACTOR), y: height - .82 * (height / TURRET_SCALE_FACTOR) },
      orientation: { rows: 1, columns: 3 },
      down: { row: 0, start: 0, columns: 3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.1 },
    };

    // List of objects definitions for this level
    this.classes = [
      { class: Background, data: { id: 'AT-AT-Background', src: currentBackground, pixels: { height: 570, width: 1025 } } },
      { class: Player, data: sprite_data_snowspeeder },
      { class: Npc, data: sprite_data_turret },
    ];
  }
}

export default GameLevelStarWars;
