<script lang="ts">
  import { onMount } from 'svelte'

  import { initWebGPU, loadTexture } from '@/utils/webgpu'

  import { flag, setMines, sweep } from './minesweeper'
  import { cellVertexArray } from './mine'
  import cellVert from './shaders/cell.vert.wgsl?raw'
  import cellFrag from './shaders/cell.frag.wgsl?raw'

  let { clearedMines = $bindable() } = $props()
  let gameOver = $state(false)

  let mineCanvas: HTMLCanvasElement | null = $state(null)
  let canvasWidth = $state(0)
  let canvasHeight = $state(0)
  let errorMessage: string | null = $state(null)

  let BOARD_COL = $derived(canvasWidth / 24)
  let BOARD_ROW = $derived(canvasHeight / 24)

  let gridArray = $derived(new Float32Array([BOARD_COL, BOARD_ROW]))
  let mineBoardArray = $derived(new Int32Array(BOARD_COL * BOARD_ROW))
  let cellStatusArray = $derived(new Int32Array(BOARD_COL * BOARD_ROW))

  function handleInteraction(clientX: number, clientY: number, button: number) {
    if (!mineCanvas) return

    const rect = mineCanvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top

    const scaleX = mineCanvas.width / rect.width
    const scaleY = mineCanvas.height / rect.height

    const canvasX = x * scaleX
    const canvasY = y * scaleY

    const offsetX = Math.floor(canvasX / 24 / scaleX)
    const offsetY = Math.floor((mineCanvas.height - canvasY) / 24 / scaleY)

    switch (button) {
      case 0: // sweep
        if (cellStatusArray.every((state) => state === 0)) {
          setMines(
            mineBoardArray,
            BOARD_COL,
            BOARD_ROW,
            { x: offsetX, y: offsetY },
            mineBoardArray.length / 4
          )
        }
        gameOver = sweep(
          mineBoardArray,
          cellStatusArray,
          BOARD_COL,
          BOARD_ROW,
          { x: offsetX, y: offsetY }
        )
        break
      case 1: // flag (middle-click or long-press)
        flag(cellStatusArray, BOARD_COL, BOARD_ROW, { x: offsetX, y: offsetY })
      case 2: // flag (right-click)
        break
      default:
        break
    }
  }

  let touchTimer: number | null = null

  const onpointerdown = (e: PointerEvent) => {
    e.preventDefault()
    if (e.pointerType === 'touch') {
      touchTimer = window.setTimeout(() => {
        handleInteraction(e.clientX, e.clientY, 1)
        touchTimer = null
      }, 500)
    } else {
      handleInteraction(e.clientX, e.clientY, e.button)
    }
  }

  const onpointerup = (e: PointerEvent) => {
    e.preventDefault()
    if (e.pointerType === 'touch') {
      if (touchTimer) {
        clearTimeout(touchTimer)
        touchTimer = null
        handleInteraction(e.clientX, e.clientY, 0)
      }
    }
  }

  const onpointerleave = (e: PointerEvent) => {
    if (touchTimer) {
      clearTimeout(touchTimer)
      touchTimer = null
    }
  }

  const oncontextmenu = (e: MouseEvent) => {e.preventDefault()}

  onMount(() => {
    let animationFrameId: number

    const main = async () => {
      if (!mineCanvas) {
        errorMessage = 'cannot find canvas element'
        return
      }

      const gpuResult = await initWebGPU(mineCanvas)
      if (!gpuResult.ok) {
        errorMessage = gpuResult.error.message
        console.error(gpuResult.error)
        return
      }

      const { device, context, format } = gpuResult.value
      const devicePixelRatio = window.devicePixelRatio || 1
      const presentationSize = {
        width: mineCanvas.clientWidth * devicePixelRatio,
        height: mineCanvas.clientHeight * devicePixelRatio,
      }
      mineCanvas.width = presentationSize.width
      mineCanvas.height = presentationSize.height
      context.configure({ device, format, alphaMode: 'opaque' })

      const gridBuffer = device.createBuffer({
        label: 'grid buffer',
        size: gridArray.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      })
      device.queue.writeBuffer(gridBuffer, 0, gridArray)

      const mineBoardBuffer = device.createBuffer({
        label: 'mine board buffer',
        size: mineBoardArray.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      })

      const cellStateBuffer = device.createBuffer({
        label: 'cell status buffer',
        size: cellStatusArray.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      })

      const cellBuffer = device.createBuffer({
        size: cellVertexArray.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      })
      device.queue.writeBuffer(cellBuffer, 0, cellVertexArray)

      const bindGroupLayout = device.createBindGroupLayout({
        label: 'bind group layout',
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: 'uniform' },
          },
          {
            binding: 1,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: 'read-only-storage' },
          },
          {
            binding: 2,
            visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
            buffer: { type: 'read-only-storage' },
          },
        ],
      })
      const uniformBindGroup = device.createBindGroup({
        label: 'bind group',
        layout: bindGroupLayout,
        entries: [
          { binding: 0, resource: gridBuffer },
          { binding: 1, resource: mineBoardBuffer },
          { binding: 2, resource: cellStateBuffer },
        ],
      })

      const sampler = device.createSampler({
        magFilter: 'nearest',
        minFilter: 'nearest',
      })

      const texture = await loadTexture(device, '/minesweeper_sprite_sheet.png')

      const textureBindGroupLayout = device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {},
          },
          {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {},
          },
        ],
      })

      const textureBindGroup = device.createBindGroup({
        layout: textureBindGroupLayout,
        entries: [
          { binding: 0, resource: texture.createView() },
          { binding: 1, resource: sampler },
        ],
      })

      const pipelineLayout = device.createPipelineLayout({
        label: 'cell pipeline layout',
        bindGroupLayouts: [bindGroupLayout, textureBindGroupLayout],
      })
      const cellPipeline = device.createRenderPipeline({
        label: 'cell pipeline',
        layout: pipelineLayout,
        vertex: {
          module: device.createShaderModule({ code: cellVert }),
          buffers: [
            {
              arrayStride: 4 * 2,
              attributes: [
                {
                  shaderLocation: 0,
                  offset: 0,
                  format: 'float32x2',
                },
              ],
            },
          ],
        },
        fragment: {
          module: device.createShaderModule({ code: cellFrag }),
          targets: [{ format }],
        },
        primitive: {
          topology: 'triangle-strip',
        },
      })

      const frame = () => {
        const renderPassDescriptor: GPURenderPassDescriptor = {
          colorAttachments: [
            {
              view: context.getCurrentTexture().createView(),

              clearValue: [0.5, 0.5, 0.5, 0.8],
              loadOp: 'clear',
              storeOp: 'store',
            },
          ],
        }

        device.queue.writeBuffer(mineBoardBuffer, 0, mineBoardArray)
        device.queue.writeBuffer(cellStateBuffer, 0, cellStatusArray)

        const commandEncoder = device.createCommandEncoder()
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
        passEncoder.setPipeline(cellPipeline)
        passEncoder.setBindGroup(0, uniformBindGroup)
        passEncoder.setBindGroup(1, textureBindGroup)
        passEncoder.setVertexBuffer(0, cellBuffer)
        passEncoder.draw(cellVertexArray.length / 2, BOARD_COL * BOARD_ROW)
        passEncoder.end()
        device.queue.submit([commandEncoder.finish()])

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
  class="mine-container relative w-83 xs-w-89 h-185 sm-w-95 bg-black p-2.5 lg:h-197 lg:w-197"
>
  {#if gameOver}
    <div
      class="mask bg-[(0, 0, 0, 0.5)] absolute inset-2.5 z-1 flex w-78 xs-w-84 h-180 sm-w-90 items-center justify-center backdrop-blur-sm lg:h-192 lg:w-192"
    >
      <div class="message text-4xl font-bold text-white">Game Over</div>
    </div>
  {/if}
  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {:else}
    <canvas
      class="h-full w-full cursor-pointer touch-none"
      bind:this={mineCanvas}
      bind:clientWidth={canvasWidth}
      bind:clientHeight={canvasHeight}
      {onpointerdown}
      {onpointerup}
      {onpointerleave}
      {oncontextmenu}
    ></canvas>
  {/if}
</div>
