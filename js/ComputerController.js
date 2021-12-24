class ComputerController {

  constructor(player, neuralNetwork) {
    this.player = player
    this.nn = neuralNetwork
    this._x = null
    this.desiredTarget = null
    this.angleDone = false
    this.strengthDone = false
    this.done = false
  }

  update() {
    if (this.done || this.player.turn !== turn) return
    
    if (this.angleDone && this.strengthDone) {
      this.player.shoot()
      this.done = true
      this.reset()
    }
    
    if (!this.desiredTarget)
      this.getDesiredTarget()
    
    this.adjustAngle()
    this.adjustStrength()
    this.player.update()
  }
  
  getDesiredTarget() {
    this._x = [
      human.pos.x / w,
      human.pos.y / h,
      this.player.angle / (-Math.PI / 2),
      this.player.strength / 100
    ]
    const prediction = this.nn.predict(this._x).data
    const angle = prediction[0] * (-Math.PI / 2)
    const strength = prediction[1] * 100
    this.desiredTarget = {angle, strength}
  }
  
  adjustAngle() {
    const deltaAngle = this.player.angle - this.desiredTarget.angle
    if ( Math.abs(deltaAngle) > 0.1 ) {
      if (deltaAngle > 0)
        this.player.isRotatingUp = true
      else
        this.player.isRotatingDown = true
    } else {
      this.player.angle = this.desiredTarget.angle
      this.player.isRotatingUp = false
      this.player.isRotatingDown = false
      this.angleDone = true
    }
  }
  
  adjustStrength() {
    const deltaStrength = this.player.strength - this.desiredTarget.strength
    if ( Math.abs(deltaStrength) > 1 ) {
      if (deltaStrength < 0)
        this.player.isIncreasingStrength = true
      else
        this.player.isDecreasingStrength = true
    } else {
      this.player.strength = this.desiredTarget.strength
      this.player.isIncreasingStrength = false
      this.player.isDecreasingStrength = false
      this.strengthDone = true
    }
  }
  
  fit(posX) {
    this.nn.fit([[...this._x]], human.pos.x < posX ? [[1, 0]] : [[0, 1]])
  }
  
  reset() {
    this.desiredTarget = null
    this.angleDone = false
    this.strengthDone = false
  }

}
