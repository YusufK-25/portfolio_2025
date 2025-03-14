---
layout: base
title: Ideation
permalink: /navigation/ideation
---


## Platformer Project Ideation

### Game Overview
Since we are not constructing the whole game, we need to be careful about exactly what we are going to be adding. We have been assigned to focus on Parrallaxes, Transitions, Backgrounds, and Code Blocks. We aim to incorparate some of these into our game, starting with a simple menu screen. 

### Game Mechanics

- **Player Movement**: The player can jump, wall-jump, crouch, and double-jump. Implement momentum-based jumping where the character's speed affects the height of the jump.
- **Transitions**: Smooth transitions between different movement states (running to jumping, or falling to landing) to make the gameplay feel natural. Use animation to smoothly transition between idle, running, and jumping states.
- **Parallax**: Background layers move at different speeds, characters can possibly move at different speeds, the gravity of the atmosphere decreases at a certain point in the level, etc. 
- **Code Block Example** (for movement control):
  ```javascript
  let playerSpeed = 5;
  let gravity = 0.5;
  let jumpStrength = 10;


### Visual Style
 The game could have a 2D pixel art style with hand-drawn backgrounds and hand drawn characters . Use darker colors to create a more intense atmosphere and contrasting, vibrant colors for enemies and collectibles.
