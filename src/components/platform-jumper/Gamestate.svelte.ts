class GameEntity {
  x = $state(0)
  y = $state(0)
  width: number
  height: number
  texture: string

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    texture: string
  ) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.texture = texture
  }

  toBuffer() {
    return new Float32Array([this.x, this.y, this.width, this.height])
  }

  isCollision(entity: GameEntity) {
    return (
      this.x < entity.x + entity.width &&
      this.x + this.width > entity.x &&
      this.y < entity.y + entity.height &&
      this.y + this.height > entity.y
    )
  }
}

class Player extends GameEntity {
  velocity_x = $state(0)
  velocity_y = $state(0)
  is_jumping = $state(false)
  velocity_x_limit = 8

  jump() {
    if (!this.is_jumping) {
      this.velocity_y = -15
      this.is_jumping = true
    }
  }

  updatePhysics() {
    this.x += this.velocity_x

    if (!this.is_jumping) return
    // 1. Apply Gravity
    this.velocity_y += 0.5
    this.y += this.velocity_y

    // 2. Simple Floor Collision (Crucial!)
    // This prevents the player from falling forever
    if (this.y + this.height > 50) {
      this.y = 50 - this.height
      this.velocity_y = 0
      this.is_jumping = false
    } else {
      this.is_jumping = true
    }
  }

  update(keys: {left: boolean, right: boolean}) {
    if (keys.left) {
      this.velocity_x = Math.max(-1 * this.velocity_x_limit, this.velocity_x - 0.3)
    } else if (this.velocity_x < 0) {
      this.velocity_x += 0.5
    }
    if (keys.right) {
      this.velocity_x = Math.min(this.velocity_x_limit, this.velocity_x + 0.3)
    } else if (this.velocity_x > 0) {
      this.velocity_x -= 0.5
    }
    
    this.updatePhysics()
  }
}

export { GameEntity, Player }
