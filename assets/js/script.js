var canvas = document.getElementById("breakoutCanvas");
var ctx = canvas.getContext("2d");

const width = "320";
const height = "480";

canvas.width = width;
canvas.height = height;

const phoneDiv = document.querySelector(".phone");

const win = new Audio('../assets/mp3/win.mp3');
const bounce = new Audio('../assets/mp3/bounce.wav');
const gameover = new Audio('../assets/mp3/game_over.wav');

var ballRadius = 10;

var x = canvas.width / 2;
var y = canvas.height - 30;

var dx = 3;
var dy = -3;

var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var brickRowCount = 1;
var brickColumnCount = 1;
var brickWidth = 80;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var score = 0;
var lives = 3;

var paused = false;

function on() {
    document.getElementById("overlay").style.display = "block";
    paused = true;
}

function off() {
    document.getElementById("overlay").style.display = "none";
    paused = false;
}

var bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1};
    }
}

if (window.innerWidth < 331) {
    phoneDiv.classList.remove("phone");
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
window.addEventListener("devicemotion", motionMoveHandler, false);

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
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    bounce.play();
                    if (score === brickRowCount * brickColumnCount) {
                        win.play();
                        setTimeout(() => {
                            const canvas2 = document.querySelector('canvas');
                            const message2 = document.createElement('div');
                            paused = true;
                            message2.style.font = '20px Arial';
                            message2.textContent = 'You win, click/tap to replay';
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
                alert("GAME OVER | YOUR SCORE: " + score);	
                document.location.reload();
                clearInterval(interval);
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
    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c=0; c<brickColumnCount; c++) {
        for (var r=0; r<brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    if (paused) {
        requestAnimationFrame(draw);
        return;
    }
    
    if (x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        bounce.play();
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        bounce.play();
        dy = -dy;
    }
    else if (y + dy > canvas.height-ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            bounce.play();
        }
        else {
            lives--;
            if (!lives) {
              gameover.play();
              alert("GAME OVER!!! Your score: " + score);
              document.location.reload();
            }
            else {
              x = canvas.width/2;
              y = canvas.height-30;
              dx = 3;
              dy = -3;
              paddleX = (canvas.width-paddleWidth)/2;
            }

        }
    }
    
    if (rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 4;
    }
    else if (leftPressed && paddleX > 0) {
        paddleX -= 4;
    }
    
    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();