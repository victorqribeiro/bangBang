class CannonBall {

  constructor(pos, angle, strength, target){
    this.pos = {
      x: pos.x || 0,
      y: pos.y || 0
    }
    this.angle = angle || 0
    this.strength = strength || 0
    this.target = target
    this.acc = {
      x: Math.cos( this.angle ) * this.strength,
      y: Math.sin( this.angle ) * this.strength
    }
  }

  isGone() {
    return this.pos.y > h
  }
  
  isHit() {
    const dX = this.pos.x - this.target.x
    const dY = this.pos.y - this.target.y
    return Math.sqrt(dX * dX + dY * dY) < 30
  }

  update(){
    if (this.isHit()) {
      return gameOver = true
    }
    if (this.isGone()) {
      if (turn) {
        computerController.fit(this.pos.x)
      }
      changeTurn()
      cannonBall = null
      return
    }
    this.pos.x += this.acc.x
    this.pos.y += this.acc.y
    this.acc.x *= 0.975
    this.acc.y *= 0.975
    this.acc.y += 1
  }

  show(){
    c.beginPath()
    c.arc( this.pos.x, this.pos.y, 5, 0, TWOPI )
    c.fillStyle = "black"
    c.fill()
  }

}
