import GameEnvBackground from './GameEngine/GameEnvBackground.js';
import Player from './GameEngine/Player.js';
import Npc from './GameEngine/Npc.js';
import Projectile from './Projectile.js';

class GameLevelStarWars {
  constructor(gameEnv) {
    let width = gameEnv.innerWidth;
    let height = gameEnv.innerHeight;
    let path = gameEnv.path;

    const image_src_atat = path + "/images/gamify/atat_background.png";
    const image__data_atat = {
      id: 'AT-AT-Background',
      src: image_src_atat,
      pixels: { height: 570, width: 1025 }
    };

    const sprite_src_snowspeeder = path + "/images/gamify/snowspeeder_sprite2.png";
    const SNOWSPEEDER_SCALE_FACTOR = 6;
    const sprite_data_snowspeeder = {
      id: 'Snowspeeder',
      greeting: "Hi I am snowspeeder, the desert wanderer. I am trying to take donwn the empire's AT-ATs!",
      src: sprite_src_snowspeeder,
      SCALE_FACTOR: SNOWSPEEDER_SCALE_FACTOR,
      STEP_FACTOR: 1000,
      ANIMATION_RATE: 50,
      INIT_POSITION: { x: 0, y: 0 },
      pixels: { height: 293, width: 358 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1, rotate: -Math.PI / 2 },
      downRight: { row: 0, start: 0, columns: 1, rotate: -3 * Math.PI / 4 },
      downLeft: { row: 0, start: 0, columns: 1, rotate: -Math.PI / 4 },
      left: { row: 0, start: 0, columns: 1 },
      right: { row: 0, start: 0, columns: 1, rotate: Math.PI },
      up: { row: 0, start: 0, columns: 1, rotate: Math.PI / 2 },
      upLeft: { row: 0, start: 0, columns: 1, rotate: Math.PI / 4 },
      upRight: { row: 0, start: 0, columns: 1, rotate: 3 * Math.PI / 4 },
      hitbox: { widthPercentage: 0.45, heightPercentage: 0.2 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
      reaction: function () {
        alert("We just got hit by a projectile!");
      }
    };

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

    const sprite_src_laser = path + "/images/gamify/laser_bolt.png";
    const sprite_data_laser1 = {
      id: 'AT-AT-Laser-1',
      greeting: "Simulate explosive action!",
      src: sprite_src_laser,
      pixels: { height: 500, width: 500 },
      orientation: { rows: 1, columns: 1 },
      SCALE_FACTOR: 30,
      INIT_POSITION_RATIO: { x: 1 / 1.78, y: 1 / 3.3 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      TRANSLATE_SCALE_FACTOR: 10,
      TRANSLATE_POSITION_RATIO: { x: 1 / 2.78, y: 1 / 2.9 },
      TRANSLATE_SIMULATION: { miliseconds: 500 },
      down: { row: 0, start: 0, columns: 3, spin: 4 },
    };

    const sprite_data_laser2 = {
      id: 'AT-AT-Laser-2',
      greeting: "Simulate explosive action!",
      src: sprite_src_laser,
      pixels: { height: 500, width: 500 },
      orientation: { rows: 1, columns: 1 },
      SCALE_FACTOR: 60,
      INIT_POSITION_RATIO: { x: 1 / 8, y: 1 / 1.95 },
      hitbox: { widthPercentage: 0.1, heightPercentage: 0.2 },
      TRANSLATE_SCALE_FACTOR: 20,
      TRANSLATE_POSITION_RATIO: { x: 1 / 20, y: 1 / 1.9 },
      TRANSLATE_SIMULATION: { miliseconds: 500 },
      down: { row: 0, start: 0, columns: 1, spin: 4 },
    };

    const sprite_data_informant = {
      id: 'Rebel-Informant',
      greeting: "Psst... The Empire is watching. Stay low.",
      src: path + "/images/gamify/rebel_informant.png",
      SCALE_FACTOR: 4,
      INIT_POSITION: { x: 150, y: 150 },
      pixels: { height: 256, width: 128 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      dialogue: {
        text: "Be careful out there.",
        button: null
      }
    };

    const sprite_data_medic = {
      id: 'Rebel-Medic',
      greeting: "Need healing?",
      src: path + "/images/gamify/rebel_medic.png",
      SCALE_FACTOR: 4,
      INIT_POSITION: { x: 300, y: 150 },
      pixels: { height: 256, width: 128 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      dialogue: {
        text: "Press the button to heal.",
        button: {
          label: "Heal Me",
          action: (player) => {
            player.health = Math.min(player.health + 50, 100);
            console.log("Player healed!");
          }
        }
      }
    };

    const sprite_data_enemy = {
      id: 'Enderman',
      src: path + '/images/gamify/ederman.png',
      SCALE_FACTOR: 7,
      pixels: { height: 256, width: 128 },
      INIT_POSITION: { x: width / 2, y: height / 4 },
      orientation: { rows: 1, columns: 1 },
      down: { row: 0, start: 0, columns: 1 },
      zIndex: 10,
      aggroRange: 300,
      update: function () {
        if (this.isKilling) return;

        const players = this.gameEnv.gameObjects.filter(obj =>
          obj.constructor.name === 'Player'
        );

        if (players.length === 0) return;

        let nearest = players[0];
        let minDist = Infinity;
        for (const p of players) {
          const dx = p.position.x - this.position.x;
          const dy = p.position.y - this.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDist) {
            minDist = dist;
            nearest = p;
          }
        }

        if (minDist > this.aggroRange) return;

        this.position.x += Math.sign(nearest.position.x - this.position.x) * 3;
        this.position.y += Math.sign(nearest.position.y - this.position.y) * 3;

        const dx = nearest.position.x - this.position.x;
        const dy = nearest.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < nearest.hitbox.width * 0.5) {
          this.isKilling = true;
          alert('Game Over!');
        }
      }
    };

    // --- CUSTOM PLAYER: Martial Artist ---
    const sprite_src_punch = path + "/images/gamify/punch.png";
    const sprite_src_kick = path + "/images/gamify/kick.png";
    const sprite_src_idle = path + "/images/gamify/idle.png";

    const sprite_data_martial_artist = {
      id: 'Martial-Artist',
      greeting: "I am the Martial Artist. Ready to strike!",
      src: sprite_src_idle,
      SCALE_FACTOR: 4,
      STEP_FACTOR: 800,
      ANIMATION_RATE: 75,
      INIT_POSITION: { x: 100, y: 300 },
      pixels: { height: 49, width: 459 },
      orientation: { rows: 1, columns: 12 },
      idle: { row: 0, start: 0, columns: 12 },
      punch: {
        src: sprite_src_punch,
        pixels: { height: 39, width: 161 },
        orientation: { rows: 1, columns: 5 },
        row: 0, start: 0, columns: 5
      },
      kick: {
        src: sprite_src_kick,
        pixels: { height: 52, width: 375 },
        orientation: { rows: 1, columns: 10 },
        row: 0, start: 0, columns: 10
      },
      hitbox: { widthPercentage: 0.4, heightPercentage: 0.4 },
      keypress: { up: 87, left: 65, down: 83, right: 68 },
      reaction: function () {
        alert("Martial Artist took damage!");
      }
    };

    // Final game objects list
    this.classes = [
      { class: GameEnvBackground, data: image__data_atat },
      { class: Player, data: sprite_data_snowspeeder },
      { class: Player, data: sprite_data_martial_artist },
      { class: Npc, data: sprite_data_turret },
      { class: Projectile, data: sprite_data_laser1 },
      { class: Projectile, data: sprite_data_laser2 },
      { class: Npc, data: sprite_data_informant },
      { class: Npc, data: sprite_data_medic },
      { class: Npc, data: sprite_data_enemy },
    ];
  }
}

export default GameLevelStarWars;
