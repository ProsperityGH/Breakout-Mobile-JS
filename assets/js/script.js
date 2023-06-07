var canvas = document.getElementById('breakoutCanvas');
var ctx = canvas.getContext('2d');

const width = '320';
const height = '480';

canvas.width = width;
canvas.height = height;

const phoneDiv = document.querySelector('.phone');

const win = new Audio('/assets/mp3/win.mp3');
const bounce = new Audio('/assets/mp3/bounce.wav');
const gameover = new Audio('/assets/mp3/game_over.wav');

var ballRadius = 10;

var x = canvas.width / 2;
var y = canvas.height - 30;

var dx = 3;
var dy = -3;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 3;
var brickColumnCount = 3;
var brickWidth = 80;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var bricksVisible;
var level = 1;
var lives = 99;

var paused = false;

function overlayOn() {
  document.getElementById('overlay').style.display = 'block';
  paused = true;
}

function warningOn() {
  document.getElementById('warning').style.display = 'block';
  paused = true;
}

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'hidden') {
    warningOn();
  }
});

function overlayOff() {
  document.getElementById('overlay').style.display = 'none';
  paused = false;
}

function warningOff() {
  document.getElementById('warning').style.display = 'none';
  paused = false;
  document.location.reload();
}

var bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}
bricksVisible = brickRowCount * brickColumnCount;

if (window.innerWidth < 331) {
  phoneDiv.classList.remove('phone');
}

function resetBricks() {
  bricksVisible = brickRowCount * brickColumnCount;
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);
window.addEventListener('devicemotion', motionMoveHandler, false);

function motionMoveHandler(event) {
  const accX = event.accelerationIncludingGravity.x || 0;
  const direction = accX > 0 ? -1 : 1;
  const speed = Math.abs(accX / 100);
  const delta = direction * speed * (canvas.width / 2 - paddleWidth);

  paddleX += delta;
  paddleX = Math.max(0, Math.min(canvas.width - paddleWidth, paddleX));
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = true;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    rightPressed = false;
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    leftPressed = false;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status === 1) {
        if (
          x + ballRadius > b.x &&
          x - ballRadius < b.x + brickWidth &&
          y + ballRadius > b.y &&
          y - ballRadius < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          bricksVisible--;
          score++;
          bounce.play();

          console.log('bricksVisible', bricksVisible);

          if (bricksVisible === 0) {
            if (level === 5) {
              const canvas2 = document.querySelector('canvas');
              const message2 = document.createElement('div');
              message2.id = 'message2';

              paused = true;
              message2.style.font = '19px Arial';
              message2.style.color = '#4F6E22';
              message2.textContent = `THIS GAME IS DONE`;
              message2.style.position = 'absolute';
              message2.style.top = '0';
              message2.style.width = '100%';
              message2.style.height = '100%';
              message2.style.display = 'flex';
              message2.style.alignItems = 'center';
              message2.style.justifyContent = 'center';
              canvas2.parentNode.appendChild(message2, canvas2);
              message2.addEventListener('click', () => {
                message2.parentNode.removeChild(message2);
                document.location.reload();
              });
              clearInterval(interval);

              break;
              return;
            }

            win.play();
            const canvas2 = document.querySelector('canvas');
            const message2 = document.createElement('div');
            message2.id = 'message2';
            paused = true;
            message2.style.font = '19px Arial';
            message2.style.color = '#4F6E22';
            message2.textContent = `You won level ${level}, Click/tap to level up`;
            message2.style.position = 'absolute';
            message2.style.top = '0';
            message2.style.width = '100%';
            message2.style.height = '100%';
            message2.style.display = 'flex';
            message2.style.alignItems = 'center';
            message2.style.justifyContent = 'center';
            canvas2.parentNode.appendChild(message2, canvas2);
            message2.addEventListener('click', () => {
              message2.parentNode.removeChild(message2);
              brickHeight -= 3;
              brickHeight = brickHeight < 7 ? 7 : brickHeight;

              brickWidth =
                (width - 30 * 2 - 10 * (brickColumnCount - 1)) /
                brickColumnCount;

              brickRowCount++;
              resetBricks();
              // brickRowCount = (brickRowCount > 5) ? 5 : brickRowCount;

              brickColumnCount++;
              resetBricks();
              // brickColumnCount = (brickColumnCount > 5) ? 5 : brickColumnCount;

              x = canvas.width / 2;
              y = canvas.height - 30;

              dx = 3;
              dy = -3;

              paused = false;
              level++;

              paddleWidth -= 3;
              paddleWidth = paddleWidth < 30 ? 30 : paddleWidth;

              ballRadius -= 0.75;
              ballRadius = ballRadius < 5 ? 5 : ballRadius;
            });
          }
        }
      }
    }
  }

  if (x > paddleX && x < paddleX + paddleWidth) {
    if (dy > 0 && y + dy > canvas.height - ballRadius - paddleHeight) {
      var diff = x - (paddleX + paddleWidth / 2);
      dx = diff * 0.2;
      dy = -dy;
      bounce.play();
    }
  }

  if (y + dy < ballRadius) {
    dy = -dy;
    bounce.play();
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      dx = leftPressed ? -3 : rightPressed ? 3 : dx;
      bounce.play();
    } else {
      lives--;
      if (!lives) {
        gameover.play();
        setTimeout(() => {
          const canvas2 = document.querySelector('canvas');
          const message2 = document.createElement('div');
          paused = true;
          lives = 0;
          message2.style.font = '20px Arial';
          message2.style.color = '#4F6E22';
          message2.textContent = 'GAME OVER!!! Click/tap to restart';
          message2.style.position = 'absolute';
          message2.style.top = '0';
          message2.style.width = '100%';
          message2.style.height = '100%';
          message2.style.display = 'flex';
          message2.style.alignItems = 'center';
          message2.style.justifyContent = 'center';
          canvas2.parentNode.appendChild(message2, canvas2);
          message2.addEventListener('click', () => {
            document.location.reload();
          });
          clearInterval(interval);
        }, 1);
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) {
    dx = -dx;
    bounce.play();
  }
}

function drawScore() {
  ctx.font = '16px sans-serif';
  ctx.fillStyle = '#4F6E22';
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLevel() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#4F6E22';
  ctx.fillText(`Level: ${level}`, 135, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#4F6E22';
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#EB2114';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#EB2114';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  brickWidth =
    (width - 30 * 2 - 10 * (brickColumnCount - 1)) / brickColumnCount;
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#FC7E19';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

let deltaTime = 0;
let lu = Date.now();

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLevel();
  drawLives();
  collisionDetection();
  deltaTime = (Date.now() - lu) / 16;
  lu = Date.now();

  if (paused) {
    requestAnimationFrame(draw);
    return;
  }

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    bounce.play();
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    bounce.play();
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      bounce.play();
    } else {
      lives--;
      if (!lives) {
        gameover.play();
        alert('GAME OVER!!! Your score: ' + score);
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 4;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 4;
  }

  x += dx * deltaTime;
  y += dy * deltaTime;
  requestAnimationFrame(draw);
}
draw();
