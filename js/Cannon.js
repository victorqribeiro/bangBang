class Cannon {

	constructor(pos, turn, right = false){
		this.pos = {
			x: pos.x || 0,
			y: pos.y || 0
		}
		this.turn = turn
		this.right = right
		this.angle = right ? Math.PI : 0
		this.dir = right ? -0.05 : 0.05
		this.minLimit = right ? Math.PI : 0
		this.maxLimit = right ? Math.PI+Math.PI/2 : -Math.PI/2
		this.strength = 10
		this.isRotatingUp = false
		this.isRotatingDown = false
		this.isIncreasingStrength = false
		this.isDecreasingStrength = false
		this._min = right ? Math.min : Math.max
		this._max = right ? Math.max : Math.min
	}
	
	update(){
    if( this.isRotatingUp )
	    this.angle = this._min(this.angle-this.dir, this.maxLimit)
    else if( this.isRotatingDown )
	    this.angle = this._max(this.angle+this.dir, this.minLimit)
		if( this.isIncreasingStrength && this.strength < 100)
			this.strength += 0.5
		else if( this.isDecreasingStrength && this.strength > 0)
			this.strength -= 0.5
	}
	
	show(){
		c.save()
		c.translate(this.pos.x, this.pos.y)
		c.fillStyle = "red"
		c.strokeStyle = "black"
		c.fillRect( this.right? 30 : -40, -30, 10, -this.strength )
		c.strokeRect( this.right? 30 : -40, -30, 10, -100)
		c.fillStyle = "black"
		c.beginPath()
		c.arc(0, 0, 30, 0, Math.PI, true)
		c.lineTo(-30, 10)	
		c.lineTo(30, 10)
		c.fillStyle = this.right ? "gray" : "black"
		c.fill()
		c.rotate(this.angle)
		c.fillRect(-5, -7, 50, 14)
		c.restore()
	}
	
	shoot(){
	  if (!cannonBall && turn === this.turn)
		  cannonBall = new CannonBall(this.pos, this.angle, this.strength, this.turn ? human.pos : computerController.player.pos)
	}

}
