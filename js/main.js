let canvas, c, w, h, scale, human, computerController, u, cannonBall, turn, gameOver, oldY

const TWOPI = 2 * Math.PI

const FRAMES_PER_SECOND = 60

const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5

const $ = _ => document.querySelector(_)

const $c = _ => document.createElement(_)

const init = () => {
  lastFrameTime = 0
  scale = window.devicePixelRatio
  u && cancelAnimationFrame(u)
  canvas = $('canvas')
  w = Math.min(innerWidth, 1920)
  h = Math.min(innerHeight, 1080)
  canvas.width = w * scale
  canvas.height = h * scale
  canvas.style.width = w + 'px'
  canvas.style.height = h + 'px'
  c = canvas.getContext('2d')
  c.scale(scale, scale)
  cannonBall = null
  human = new Cannon({ x: w - 100, y: h - 100 }, 0, true)
  const computer = new Cannon({ x: 100, y: h - 100 }, 1)
  const nn = new Dejavu([4, 2, 2], 0.1, 10)
  computerController = new ComputerController(computer, nn)
  turn = 0
  gameOver = false
  mainLoop(0)
}

const mainLoop = time => {
  if(time - lastFrameTime < FRAME_MIN_TIME){
    u = requestAnimationFrame(mainLoop)
    return
  }
  lastFrameTime = time
  if (turn === human.turn)
    human.update()
  else
    computerController.update()
  cannonBall && cannonBall.update()
  draw()
  u = requestAnimationFrame(mainLoop)
}

const draw = () => {
  c.clearRect(0, 0, w, h)
  cannonBall && cannonBall.show()
  human.show()
  computerController.player.show()
  c.textAlign = 'left'
  c.fillText(turn ? 'Computer' : 'Human', 10, 10)
  if (gameOver) {
    c.textAlign = 'center'
    c.fillText(["Human", "Computer"][turn] + ' wins', w / 2, h / 2)
    c.fillText('Press shoot to restart', w / 2, h / 2 + 40)
  }
}

const changeTurn = () => {
  turn = (turn + 1) % 2
  if (turn) computerController.done = false
}

const bindEvents = () => {
  $('body').addEventListener('keydown', e => {
    switch (e.keyCode) {
      case 32:
        human.shoot()
        if (gameOver) init()
        break
      case 37:
        human.isRotatingDown = true
        break
      case 38:
        human.isIncreasingStrength = true
        break
      case 39:
        human.isRotatingUp = true
        break;
      case 40:
        human.isDecreasingStrength = true
        break
    }
  })
  $('body').addEventListener('keyup', e => {
    switch (e.keyCode) {
      case 37:
        human.isRotatingDown = false
        break
      case 38:
        human.isIncreasingStrength = false
        break
      case 39:
        human.isRotatingUp = false
        break;
      case 40:
        human.isDecreasingStrength = false
        break
    }
  })
  $('body').addEventListener('touchmove', e => {
    const touch = e.changedTouches[0]
    if (!oldY)
      oldY = 0
    const deltaY = oldY - touch.clientY
    if (touch.clientX > w / 2) {
      if (deltaY > 0) {
        human.isRotatingUp = true
        human.isRotatingDown = false
      } else {
        human.isRotatingUp = false
        human.isRotatingDown = true
      }
    } else {
      if (deltaY > 0) {
        human.isIncreasingStrength = true
        human.isDecreasingStrength = false
      } else {
        human.isIncreasingStrength = false
        human.isDecreasingStrength = true
      }
    }
    oldY = touch.clientY
  })
  $('body').addEventListener('touchend', e => {
    human.isRotatingDown = false
    human.isRotatingUp = false
    human.isIncreasingStrength = false
    human.isDecreasingStrength = false
  })
  $('body').addEventListener('click', e => {
    if (scale == 1) return
    human.shoot()
    if (gameOver) init()
  })
}

bindEvents()
init()
