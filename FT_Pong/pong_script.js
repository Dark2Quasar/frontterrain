const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 15;
const paddleHeight = 100;
const ballRadius = 12;
const playerX = 20;
const aiX = canvas.width - paddleWidth - 20;

// Game state
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 4;
  for (let i = 0; i < canvas.height; i += 30) {
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, i);
    ctx.lineTo(canvas.width / 2, i + 15);
    ctx.stroke();
  }
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
  // Clear
  drawRect(0, 0, canvas.width, canvas.height, '#000');

  // Net
  drawNet();

  // Left paddle (Player)
  drawRect(playerX, playerY, paddleWidth, paddleHeight, '#fff');

  // Right paddle (AI)
  drawRect(aiX, aiY, paddleWidth, paddleHeight, '#fff');

  // Ball
  drawCircle(ballX, ballY, ballRadius, '#fff');
}

function update() {
  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top/bottom wall collision
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Left paddle collision
  if (
    ballX - ballRadius < playerX + paddleWidth &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = playerX + paddleWidth + ballRadius; // Prevent sticking
    // Optional: change ball angle based on hit location
    let collidePoint = ballY - (playerY + paddleHeight / 2);
    ballSpeedY += collidePoint * 0.1;
  }

  // Right paddle collision (AI)
  if (
    ballX + ballRadius > aiX &&
    ballY > aiY &&
    ballY < aiY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = aiX - ballRadius; // Prevent sticking
    // Optional: change ball angle based on hit location
    let collidePoint = ballY - (aiY + paddleHeight / 2);
    ballSpeedY += collidePoint * 0.1;
  }

  // Left and right wall (score or reset)
  if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
    resetBall();
  }

  // AI paddle movement (simple: follow the ball)
  let aiCenter = aiY + paddleHeight / 2;
  if (aiCenter < ballY - 20) {
    aiY += 5;
  } else if (aiCenter > ballY + 20) {
    aiY -= 5;
  }
  // Clamp AI paddle
  aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Player paddle movement (mouse)
canvas.addEventListener('mousemove', function (e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - paddleHeight / 2;
  // Clamp paddle
  playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Start game
gameLoop();