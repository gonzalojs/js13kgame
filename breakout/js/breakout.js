const cvs = document.getElementById('breakout')
const ctx = cvs.getContext('2d')

//add border to canvas
cvs.style.border = '1px solid #0ff'

//make line thick when drawing to canvas
ctx.lineWidth = 3

//constants
const PADDLE_WIDTH = 100
const PADDLE_MARGIN_BOTTOM = 50
const PADDLE_HEIGHT = 20
const BALL_RADIUS = 8
const MAX_LEVEL = 3
let LIFE = 3
let SCORE = 0
const SCORE_UNIT = 10
let LEVEL = 1
let GAME_OVER = false
let leftArrow = false
let rightArrow = false



// Create the paddle
const paddle = {
  x: cvs.width/2 - PADDLE_WIDTH/2,
  y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5
}

//draw paddle
function drawPaddle () {
  ctx.fillStyle = '#2e3548'
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)

  ctx.strokeStyle = '#ffcd05'
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height)
}

//control the paddle
document.addEventListener('keydown', function (e) {
  if (e.keyCode == 37) {
    leftArrow = true
  } else if (e.keyCode == 39) {
    rightArrow = true
  }
})
document.addEventListener('keyup', function (e) {
  if (e.keyCode == 37) {
    leftArrow = false
  } else if (e.keyCode == 39) {
    rightArrow = false
  }
})

//move paddle

function movePaddle () {
  if (rightArrow && paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx
  }
}

//ball
const ball = {
  x: cvs.width/2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3
}

//draw rhe ball
function drawBall () {
  ctx.beginPath()

  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2)
  ctx.fillStyle = '#ffcd05'
  ctx.fill()

  ctx.strokeStyle = '#2e3548'
  ctx.stroke()

  ctx.closePath()
}

//move ball
function moveBall () {
  ball.x += ball.dx
  ball.y += ball.dy
}

//ball and paddle collision
function ballPaddleCollision () {
  if (ball.x < paddle.x + paddle.width && ball.x > paddle.x && paddle.y < paddle.y + paddle.height && ball.y > paddle.y) {

    //sound
    PADDLE_HIT.play()
    //check where the ball hit the paddle
    let collidePoint = ball.x - (paddle.x + paddle.width/2)
    //normalize the values
    collidePoint = collidePoint / (paddle.width/2)
    //calculate the angle of the ball
    let angle = collidePoint * Math.PI/3


    ball.dx = ball.speed * Math.sin(angle)
    ball.dy = - ball.speed * Math.cos(angle)
  }
}

//create the bricks
const brick = {
  row : 1,
  column : 5,
  width : 55,
  height : 20,
  offSetLeft : 20,
  offSetTop : 20,
  marginTop : 40,
  fillColor : '#2e3548',
  strokeColor : '#FFF'
}

let bricks = []

function createBricks () {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = []
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x : c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y : r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
        status : true
      }
    }
  }
}

createBricks()

//draw bricks
function drawBricks () {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c]
      //if the birck isn't broken
      if (b.status) {
        ctx.fillStyle = brick.fillColor
        ctx.fillRect(b.x, b.y, brick.width, brick.height)

        ctx.strokeStyle = brick.strokeColor
        ctx.strokeRect(b.x, b.y, brick.width, brick.height)
      }
    }
  }
}

//ball brick collision
function ballBrickCollision () {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c]
      //if the birck isn't broken
      if (b.status) {
        if (ball.x + ball.radius > b.x && ball.x -ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height)
          {
            BRICK_HIT.play()
            ball.dy = - ball.dy
            b.status = false //brick is broken
            SCORE += SCORE_UNIT
          }
      }
    }
  }
}

//show game stats
function showGameStats (text, textX, textY, img, imgX, imgY) {
  //draw text
  ctx.fillStyle = '#FFF'
  ctx.font = '25px Germania One'
  ctx.fillText(text, textX, textY)

  // draw image
  ctx.drawImage(img, imgX, imgY, width = 25, height = 25)
}


//draw function
function draw () {
  drawPaddle()
  drawBall()
  drawBricks()
  //score lives and level
  showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5)
  showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5)
  showGameStats(LEVEL, cvs.width/2, 25, LEVEL_IMG, cvs.width/2 - 30, 5)
}

//game over
function gameOver () {
  if (LIFE <= 0) {
    showYouLose()
    GAME_OVER = true
  }
}

//level up
function levelUp () {
  let isLevelDone = true

  //check if all the bricks are broken
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      isLevelDone = isLevelDone && ! bricks[r][c].status
    }
  }

  if (isLevelDone) {
    WIN.play()
    if (LEVEL >= MAX_LEVEL) {
      showYouWin()
      GAME_OVER = true
      return
    }
    brick.row++
    createBricks()
    ball.speed += 0.5
    resetBall()
    LEVEL++
  }
}

//ball collision
function ballWallCollision () {
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx = - ball.dx
    WALL_HIT.play()
  }

  if (ball.y - ball.radius < 0) {
    ball.dy = - ball.dy
    WALL_HIT.play()
  }

  if ( ball.y + ball.radius > cvs.height) {
    LIFE--
    LIFE_LOST.play()
    resetBall()
  }
}

//reset the ball
function resetBall () {
  ball.x = cvs.width/2
  ball.y = paddle.y - BALL_RADIUS
  ball.dx = 3 * (Math.random() * 2 - 1)
  ball.dy = -3
}


function update () {
  movePaddle()
  moveBall()
  ballWallCollision()
  ballPaddleCollision()
  ballBrickCollision()
  gameOver()
  levelUp()
}

function loop () {

  ctx.drawImage(BG_IMG, 0, 0)


  draw()
  update()
  if (! GAME_OVER) {
    requestAnimationFrame(loop)
  }

}
loop()


//select sound element
const soundElement = document.getElementById('sound')
soundElement.addEventListener('click', audioManager)

function audioManager () {
  console.log('click')
  let imgSrc = soundElement.getAttribute('src')
  let SOUND_IMG = imgSrc == 'images/SOUND_ON.png' ? 'images/SOUND_OFF.png' : 'images/SOUND_ON.png'


  soundElement.setAttribute('src', SOUND_IMG)

  //mute and unmute sounds
  WALL_HIT.muted = WALL_HIT.muted ? false : true
  PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true
  BRICK_HIT.muted = BRICK_HIT.muted ? false : true
  WIN.muted = WIN.muted ? false : true
  LIFE_LOST.muted = LIFE_LOST.muted ? false : true
}

//show game over message
//select element
const gameover = document.getElementById('gameover')
const youwin = document.getElementById('youwin')
const youlose = document.getElementById('youlose')
const restart = document.getElementById('restart')

//click play again
restart.addEventListener('click', function () {
  location.reload()
})

//show win
function showYouWin () {
  gameover.style.display = 'block'
  youwon.style.display = 'block'
}

//lose the game
function showYouLose () {
  gameover.style.display = 'block'
  youlose.style.display = 'block'
}