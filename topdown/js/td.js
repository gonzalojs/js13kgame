const cvs = document.getElementById('td')
const ctx = cvs.getContext('2d')

//add border to canvas
cvs.style.border = '3px solid #A02B12'

//make line thick when drawing to canvas
ctx.lineWidth = 3

//cons
const PLAYER_WIDTH = 20
const PLAYER_HEIGHT = 20

let leftArrow = false
let rightArrow = false
let upArrow = false
let downArrow = false

//create player
const player = {
  x : cvs.width/2 - PLAYER_WIDTH/2,
  y : cvs.height/2 - PLAYER_HEIGHT/2,
  width : PLAYER_WIDTH,
  height : PLAYER_HEIGHT,
  dx : 5
}

function drawPlayer () {
  ctx.fillStyle = '#2e3548'
  ctx.fillRect(player.x, player.y, player.width, player.height)

  ctx.strokeStyle = '#ffcd05'
  ctx.strokeRect(player.x, player.y, player.width, player.height)
}


//control the player
document.addEventListener('keydown', (e) => {
  if (e.keyCode === 37) {
    leftArrow = true
  } else if (e.keyCode === 39) {
    rightArrow = true
  }

  if (e.keyCode === 38) {
    upArrow = true
  } else if (e.keyCode === 40) {
    downArrow = true
  }
})

document.addEventListener('keyup', e => {
  if (e.keyCode === 37) {
    leftArrow = false
  } else if (e.keyCode === 39) {
    rightArrow = false
  }

  if (e.keyCode === 38) {
    upArrow = false
  } else if (e.keyCode === 40) {
    downArrow = false
  }
})

//move the paddle () {
function movePlayer () {
  if (rightArrow && player.x + player.width <  cvs.width) {
    player.x += player.dx
  } else if (leftArrow && player.x > 0) {
    player.x -= player.dx
  }

  if (upArrow && player.y > 0) {
    player.y -= player.dx
  } else if (downArrow && player.y + player.height < cvs.height) {
    player.y += player.dx
  }
}

function draw () {
  drawPlayer()
}

function update () {
  movePlayer()
}

function loop () {
  ctx.clearRect(0, 0, cvs.width, cvs.height) //clear the canvas
  draw()
  update()
  requestAnimationFrame(loop)
}

loop()