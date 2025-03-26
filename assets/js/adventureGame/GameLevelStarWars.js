import Background from './Background.js';
import Player from './Player.js';
import Npc from './Npc.js';
import Projectile from './Projectile.js';

class GameLevelStarWars {
  constructor(gameEnv) {
    // Values dependent on GameEnv.create()
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    // Background data
    const image_src_atat = path + "/images/gamify/atat_background.png"; // Default background
    const image_src_alternate = path + "/images/gamify/starwar.png"; // Alternate background (replace this with your path)

    let currentBackground = image_src_atat; // Default background

    // Create the background image element
    const image__data_atat = {
        id: 'AT-AT-Background',
        src: currentBackground,
        pixels: {height: 570, width: 1025}
    };

    // Create the image and append it to the document
    const backgroundImg = document.createElement('img');
    backgroundImg.id = 'AT-AT-Background'; // Set ID for easy access later
    backgroundImg.src = currentBackground;
    backgroundImg.style.position = 'absolute';
    backgroundImg.style.top = '0';
    backgroundImg.style.left = '0';
    backgroundImg.style.width = '100%';  // Set to 100% width of the screen
    backgroundImg.style.height = '100%'; // Set to 100% height of the screen
    document.body.appendChild(backgroundImg);

    // Create the background switch button
    const button = document.createElement('button');
    button.innerText = "Switch Background";

    // Style the button
    button.style.position = 'absolute';
    button.style.top = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#ff4c4c';
    button.style.color = '#fff';
    button.style.border = '2px solid #ff0000';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    button.style.fontSize = '16px';

    // Append button to the body
    document.body.appendChild(button);

    // Handle background switch
    button.addEventListener('click', () => {
      currentBackground = currentBackground === image_src_atat ? image_src_alternate : image_src_atat;
      backgroundImg.src = currentBackground;  // Update the src of the image
    });

    // Player data for snowspeeder
    const sprite_src_snowspeeder = path + "/images/gamify/snowspeeder_sprite2.png";
    const sprite_data_snowspeeder = {
        id: 'Snowspeeder',
        greeting: "Hi I am snowspeeder, the desert wanderer. I am trying to take down the empire's AT-ATs!",
        src: sprite_src_snowspeeder,
        SCALE_FACTOR: 6,
        STEP_FACTOR: 1000,
        ANIMATION_RATE: 50,
        INIT_POSITION: { x: 0, y: 0 },
        pixels: {height: 293, width: 358},
    };

    // NPC Data for Turret Anti-Air
    const sprite_src_turret = path + "/images/gamify/aa_spritesheet1.png";
    const sprite_data_turret = {
      id: 'Turret-Anti-Air',
      greeting: "I am the Anti-Air Turret. I am here to take down the snowspeeder!",
      src: sprite_src_turret,
      SCALE_FACTOR: 3,
      ANIMATION_RATE: 100,
      pixels: {width: 1056, height: 236},
    };

    // Laser data, temporary sprite for testing
    const sprite_src_laser = path + "/images/gamify/laser_bolt.png";
    const sprite_data_laser1 = {
        id: 'AT-AT-Laser-1',
        greeting: "Simulate explosive action!",
        src: sprite_src_laser,
        pixels: {height: 500, width: 500},
        SCALE_FACTOR: 30,
    };

    // List of objects definitions for this level
    this.classes = [
      { class: Background, data: image__data_atat },
      { class: Player, data: sprite_data_snowspeeder },
      { class: Npc, data: sprite_data_turret },
      { class: Projectile, data: sprite_data_laser1 },
    ];
  }
}

export default GameLevelStarWars;
