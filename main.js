const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

//variables

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
let paddleHeight = 20;
let paddleWidth = 105;
let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = 30;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 6;
let brickColumnCount = 4;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;
let score = 0;
let lives = 3;

let bricks = [];

for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

//keyboard

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//touch

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

drawScore = () => {
  ctx.font = "16px  Poppins, sans-serif;";
  ctx.fillStyle = "#232323";
  ctx.fillText(`Score: ${score}`, 8, 20);
};

drawLives = () => {
  ctx.font = "16px Poppins, sans-serif";
  ctx.fillStyle = "#232323";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
};

drawBricks = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#CA1414";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
};

drawBall = () => {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#DAEA14";
  ctx.fill();
  ctx.closePath();
};

drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#CA1414";
  ctx.fill();
  ctx.closePath();
};

collisionDetection = () => {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score === brickRowCount * brickColumnCount) {
            alert("you win 🥳! congrats 👍");
            document.location.reload();
          }
        }
      }
    }
  }
};

draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();
  drawScore();
  drawLives();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy > canvas.height || y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - paddleY) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER 😫");
        document.location.reload();
      } else {
        if (lives === 1) {
          alert(`you still have ${lives} live, press OK to restar 👊`);
        } else if (lives >= 1) {
          alert(`you still have ${lives} lives, press OK to restar 👊`);
        }
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
};

draw();
