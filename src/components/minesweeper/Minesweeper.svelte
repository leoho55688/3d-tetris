<script lang="ts">
  import { initWebGPU } from '@/utils/webgpu'
  import { setMines } from './minesweeper'

  let { clearedMines = $bindable() } = $props()
  let gameOver = $state(false)

  let mineCanvas: HTMLCanvasElement | undefined = $state()
  let errorMessage: string | null = $state(null)

  $effect(() => {
    if (!mineCanvas) return

    let animationFrameId: number

    const main = async () => {
      const gpuResult = await initWebGPU(mineCanvas!)
      if (!gpuResult.ok) {
        errorMessage = gpuResult.error.message
        console.error(gpuResult.error)
        return
      }

      const { device, context, format } = gpuResult.value
      const devicePixelRatio = window.devicePixelRatio || 1
      const presentationSize = {
        width: mineCanvas!.clientWidth * devicePixelRatio,
        height: mineCanvas!.clientHeight * devicePixelRatio,
      }
      mineCanvas!.width = presentationSize.width
      mineCanvas!.height = presentationSize.height
      context.configure({ device, format, alphaMode: 'premultiplied' })

      const BOARD_COL = mineCanvas!.width / 24
      const BOARD_ROW = mineCanvas!.height / 24

      const blockStateArray = new Int32Array(BOARD_COL * BOARD_ROW)
      setMines(
        blockStateArray,
        BOARD_COL,
        BOARD_ROW,
        { x: 0, y: 0 },
        blockStateArray.length / 4
      )

      const frame = () => {
        animationFrameId = requestAnimationFrame(frame)
      }

      animationFrameId = requestAnimationFrame(frame)
    }

    main()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  })
</script>

<div
  class="mine-container relative h-185 w-95 bg-black p-2.5 lg:h-197 lg:w-197"
>
  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {:else}
    <canvas class="h-full w-full touch-none" bind:this={mineCanvas}></canvas>
  {/if}
</div>
