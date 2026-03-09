<script lang="ts">
  import { onMount } from 'svelte'

  import { initWebGPU, loadTexture, resizeCanvas } from '@/utils/webgpu'
  import { Player } from './Gamestate.svelte'

  import spriteVert from './shaders/sprite.vert.wgsl?raw'
  import spriteFrag from './shaders/sprite.frag.wgsl?raw'
  import { Camera } from './Camera.svelte'

  let gameCanvas: HTMLCanvasElement | null = $state(null)
  let errorMessage = $state('')

  const camera = new Camera()
  const player = new Player(0, 0, 50, 50, '/gyro.png')
  const numOfEntities = 3
  const entities = new Float32Array(numOfEntities * 4)
  const floor = new Float32Array([3500, 100, 5000, 100])
  const block = new Float32Array([200, -100, 200, 50])
  entities.set(floor, 4)
  entities.set(block, 8)

  const keys = {
    left: false,
    right: false
  }

  const onkeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        keys.right = true
        break
      case 'ArrowLeft':
        keys.left = true
        break
      case 'ArrowUp':
      case ' ':
        if (!player.is_jumping) player.jump()
        break
      default:
        break
    }
  }

  const onkeyup = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        keys.right = false
        break
      case 'ArrowLeft':
        keys.left = false
        break
      case 'ArrowUp':
      case ' ':
        if (!player.is_jumping) player.jump()
        break
      default:
        break
    }
  }

  onMount(() => {
    let animationFrameId: number

    const main = async () => {
      if (!gameCanvas) {
        errorMessage = 'cannot find canvas element'
        return
      }

      const gpuResult = await initWebGPU(gameCanvas)
      if (!gpuResult.ok) {
        errorMessage = gpuResult.error.message
        console.error(gpuResult.error)
        return
      }

      const { device, context, format } = gpuResult.value
      resizeCanvas(gameCanvas)
      context.configure({ device, format, alphaMode: 'opaque' })
      const sampler = device.createSampler({
        magFilter: 'nearest',
        minFilter: 'nearest',
      })

      const cameraBuffer = device.createBuffer({
        size: 4 * 16,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      })

      const playerBuffer = device.createBuffer({
        size: 4 * 4 * numOfEntities,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
      })
      const playerTexture = await loadTexture(device, player.texture)

      const spriteBindGroupLayout = device.createBindGroupLayout({
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
        ],
      })
      const spriteBindGroup = device.createBindGroup({
        layout: spriteBindGroupLayout,
        entries: [
          { binding: 0, resource: cameraBuffer },
          { binding: 1, resource: playerBuffer },
        ],
      })
      const spriteTextureBindGroupLayout = device.createBindGroupLayout({
        entries: [
          {
            binding: 0,
            visibility: GPUShaderStage.FRAGMENT,
            sampler: {},
          },
          {
            binding: 1,
            visibility: GPUShaderStage.FRAGMENT,
            texture: {},
          },
        ],
      })
      const spriteTextureBindGroup = device.createBindGroup({
        layout: spriteTextureBindGroupLayout,
        entries: [
          { binding: 0, resource: sampler },
          { binding: 1, resource: playerTexture.createView() },
        ],
      })

      const spritePipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: [spriteBindGroupLayout, spriteTextureBindGroupLayout],
      })
      const spritePipeline = device.createRenderPipeline({
        label: 'player & platforms pipeline',
        layout: spritePipelineLayout,
        vertex: {
          module: device.createShaderModule({ code: spriteVert }),
          buffers: [],
        },
        fragment: {
          module: device.createShaderModule({ code: spriteFrag }),
          targets: [{ format }],
        },
        primitive: {
          topology: 'triangle-strip',
        },
      })
      const frame = () => {
        if (!gameCanvas) return

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

        player.update(keys)
        entities.set(player.toBuffer(), 0)
        camera.follow(player, gameCanvas.width, gameCanvas.height)
        device.queue.writeBuffer(
          cameraBuffer,
          0,
          camera.getMatrix(gameCanvas.width, gameCanvas.height)
        )
        device.queue.writeBuffer(playerBuffer, 0, entities)

        const commandEncoder = device.createCommandEncoder()
        const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
        passEncoder.setBindGroup(0, spriteBindGroup)
        passEncoder.setBindGroup(1, spriteTextureBindGroup)
        passEncoder.setPipeline(spritePipeline)
        passEncoder.draw(4, numOfEntities)
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

<svelte:window {onkeydown} {onkeyup} />
<canvas class="grow" bind:this={gameCanvas}></canvas>
