<script lang="ts">
  import { initWebGPU } from '@/utils/webgpu'
  import { setMines } from './minesweeper'
  import { cellVertexArray } from './mine'

  import cellVert from './shaders/cell.vert.wgsl?raw'
  import cellFrag from './shaders/cell.frag.wgsl?raw'
  import gridVert from './shaders/grid.vert.wgsl?raw'
  import gridFrag from './shaders/grid.frag.wgsl?raw'

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
      context.configure({ device, format, alphaMode: 'opaque' })

      const BOARD_COL = mineCanvas!.width / 32
      const BOARD_ROW = mineCanvas!.height / 32

      const mineBoardArray = new Int32Array(BOARD_COL * BOARD_ROW)
      setMines(
        mineBoardArray,
        BOARD_COL,
        BOARD_ROW,
        { x: 0, y: 0 },
        mineBoardArray.length / 4
      )

      const gridArray = new Float32Array([BOARD_COL, BOARD_ROW])
      const gridBuffer = device.createBuffer({
        label: 'grid buffer',
        size: gridArray.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      })
      device.queue.writeBuffer(gridBuffer, 0, gridArray)

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
        ],
      })
      const uniformBindGroup = device.createBindGroup({
        label: 'bind group',
        layout: bindGroupLayout,
        entries: [
          { binding: 0, resource: gridBuffer },
        ],
      })

      const gridPipeline = device.createRenderPipeline({
        label: 'grid pipeline',
        layout: 'auto',
        vertex: {
          module: device.createShaderModule({ code: gridVert }),
        },
        fragment: {
          module: device.createShaderModule({ code: gridFrag }),
          targets: [{ format }],
        },
        primitive: {
          topology: 'triangle-list',
        },
      })

      const pipelineLayout = device.createPipelineLayout({
        label: 'cell pipeline layout',
        bindGroupLayouts: [bindGroupLayout],
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

        const commandEncoder = device.createCommandEncoder()
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
        passEncoder.setPipeline(gridPipeline)
        passEncoder.draw(3)
        passEncoder.setPipeline(cellPipeline)
        passEncoder.setBindGroup(0, uniformBindGroup)
        passEncoder.setVertexBuffer(0, cellBuffer)
        passEncoder.draw(4)
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
  class="mine-container relative h-185 w-95 bg-black p-2.5 lg:h-197 lg:w-197"
>
  {#if gameOver}
    <div
      class="mask bg-[(0, 0, 0, 0.5)] absolute inset-2.5 z-1 flex h-180 w-90 items-center justify-center backdrop-blur-sm lg:h-192 lg:w-192"
    >
      <div class="message text-4xl font-bold text-white">Game Over</div>
    </div>
  {/if}
  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {:else}
    <canvas class="h-full w-full touch-none" bind:this={mineCanvas}></canvas>
  {/if}
</div>
