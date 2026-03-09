import type { Player } from './Gamestate.svelte'

export class Camera {
  x = $state(0)
  y = $state(0)
  lerpFactor: number = 0.1

  follow(player: Player, canvasWidth: number, canvasHeight: number) {
    this.x = player.x + canvasWidth / 2 - player.width / 2
    this.y = player.y - canvasHeight / 2 + player.height / 2 - 200
  }

  // A simple 2D Projection Matrix (Simplified for explanation)
  getMatrix(canvasWidth: number, canvasHeight: number) {
    // This matrix converts "World Pixels" to "GPU Clip Space" (-1 to 1)
    // and applies the camera's X/Y offset
    const sx = 2 / canvasWidth
    const sy = -2 / canvasHeight
    const tx = 1 - this.x * sx
    const ty = 1 - this.y * sy

    // prettier-ignore
    return new Float32Array([
      sx,  0,  0,  0,
       0, sy,  0,  0,
       0,  0,  1,  0,
      tx, -0.5,  0,  1,
    ])
  }
}
