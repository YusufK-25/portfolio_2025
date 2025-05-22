const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Game settings
const gravity = 0.5;
const friction = 0.8;
// Player object
const player = {
  x: 100,
  y: 0,
  width: 30,
  height: 50,
  velocityX: 0,
  velocityY: 0,
  speed: 4,
  jumpPower: -12,
  onGround: false
};
// Platform data
const platforms = [
  { x: 0, y: 350, width: 800, height: 50 },
  { x: 200, y: 280, width: 100, height: 10 },
  { x: 400, y: 220, width: 150, height: 10 },
  { x: 600, y: 150, width: 100, height: 10 }
];
// Key tracking
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);
// Game loop
function update() {
  // Horizontal movement
  if (keys["ArrowRight"] || keys["KeyD"]) player.velocityX = player.speed;
  else if (keys["ArrowLeft"] || keys["KeyA"]) player.velocityX = -player.speed;
  else player.velocityX *= friction;
  // Jumping
  if ((keys["ArrowUp"] || keys["KeyW"] || keys["Space"]) && player.onGround) {
    player.velocityY = player.jumpPower;
    player.onGround = false;
  }
  // Apply gravity
  player.velocityY += gravity;
  // Update player position
  player.x += player.velocityX;
  player.y += player.velocityY;
  // Collision detection
  player.onGround = false;
  platforms.forEach(platform => {
    if (
      player.x < platform.x + platform.width &&
      player.x + player.width > platform.x &&
      player.y < platform.y + platform.height &&
      player.y + player.height > platform.y
    ) {
      if (player.velocityY > 0) {
        player.y = platform.y - player.height;
        player.velocityY = 0;
        player.onGround = true;
      }
    }
  });
  // Keep player inside canvas
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  draw();
  requestAnimationFrame(update);
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw player
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  // Draw platforms
  ctx.fillStyle = "green";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}
// Start the game
update();