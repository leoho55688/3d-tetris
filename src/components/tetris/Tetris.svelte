<script lang="ts">
  import { initWebGPU } from '@/utils/webgpu'
  import { onMount } from 'svelte'
  import { mat4 } from 'wgpu-matrix'
  import {
    cubePositionOffset,
    cubeUVOffset,
    cubeVertexArray,
    cubeVertexCount,
    cubeVertexSize,
  } from './cube'

  import vert from './shaders/vert.wgsl?raw'
  import frag from './shaders/frag.wgsl?raw'
  import {
    clearLine,
    collision,
    generateBlock,
    generateBlockQueue,
    isAtBottom,
    isAtLeftWall,
    isAtRightWall,
    rotateBlock,
    writeBoard,
  } from '../tetris/tetris'

  const BOARD_COL = 10
  const BOARD_ROW = 20

  const blockStateArray = new Int32Array(BOARD_COL * BOARD_ROW)
  blockStateArray.fill(-1)
  let blockQueue: { value: number[]; originalIndex: number }[] =
    generateBlockQueue()
  let activeBlockType = blockQueue[0].originalIndex
  let activeBlockArray = new Uint32Array(generateBlock(blockQueue))
  let activeBlockState = 0

  export let isCleared = false
  let gameOver = false

  let cubeCanvas: HTMLCanvasElement
  let errorMessage: string | null = null

  let touchStartX = 0
  let touchStartY = 0
  let touchEndX = 0
  let touchEndY = 0

  const handleKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        moveLeft()
        break
      case 'ArrowRight':
        moveRight()
        break
      case 'ArrowUp':
        rotateClockwise()
        break
      case 'ArrowDown':
        moveDown()
        break
      case ' ':
        drop()
        break
      default:
        break
    }
  }

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX
    touchStartY = e.changedTouches[0].screenY
  }

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX
    touchEndY = e.changedTouches[0].screenY
    handleGesture()
  }

  const handleGesture = () => {
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY

    const tapThreshold = 10
    const swipeThreshold = 50

    if (Math.abs(deltaX) < tapThreshold && Math.abs(deltaY) < tapThreshold) {
      rotateClockwise()
      return
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX > 0) {
          moveRight()
        } else {
          moveLeft()
        }
      }
    } else {
      // Vertical swipe
      if (deltaY > swipeThreshold) {
        // A long swipe down for drop
        drop()
      }
    }
  }

  const moveLeft = () => {
    if (!isAtLeftWall(activeBlockArray)) {
      activeBlockArray = activeBlockArray.map((val) => val - 1)
    }
  }

  const moveRight = () => {
    if (!isAtRightWall(activeBlockArray)) {
      activeBlockArray = activeBlockArray.map((val) => val + 1)
    }
  }

  const rotateClockwise = () => {
    rotateBlock(activeBlockType, activeBlockState, activeBlockArray)
    activeBlockState = (activeBlockState + 1) % 4
  }

  const moveDown = () => {
    if (
      !isAtBottom(activeBlockArray) &&
      !collision(blockStateArray, activeBlockArray)
    ) {
      activeBlockArray = activeBlockArray.map((num) => num - 10)
    }
  }

  const drop = () => {
    while (
      !isAtBottom(activeBlockArray) &&
      !collision(blockStateArray, activeBlockArray)
    ) {
      activeBlockArray = activeBlockArray.map((num) => num - 10)
    }
  }

  onMount(async () => {
    const gpuResult = await initWebGPU(cubeCanvas)
    if (!gpuResult.ok) {
      console.error(gpuResult.error)
      return
    }

    const { device, context, format } = gpuResult.value
    const devicePixelRatio = window.devicePixelRatio || 1
    const presentationSize = {
      width: cubeCanvas.clientWidth * devicePixelRatio,
      height: cubeCanvas.clientHeight * devicePixelRatio,
    }
    cubeCanvas.width = presentationSize.width
    cubeCanvas.height = presentationSize.height
    context.configure({ device, format, alphaMode: 'premultiplied' })

    const cubeVertexBuffer = device.createBuffer({
      label: 'vertex buffer',
      size: cubeVertexArray.byteLength,
      usage: GPUBufferUsage.VERTEX,
      mappedAtCreation: true,
    })
    new Float32Array(cubeVertexBuffer.getMappedRange()).set(cubeVertexArray)
    cubeVertexBuffer.unmap()

    const uniformBuffer = device.createBuffer({
      size: 4 * 16 * 200,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })

    const gridArray = new Float32Array([BOARD_COL, BOARD_ROW, 1, 1])
    const gridBuffer = device.createBuffer({
      label: 'grid buffer',
      size: gridArray.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    })
    device.queue.writeBuffer(gridBuffer, 0, gridArray)

    const blockStateBuffer = device.createBuffer({
      label: 'block state buffer',
      size: blockStateArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    })
    const activeBlockBuffer = device.createBuffer({
      label: 'active block buffer',
      size: activeBlockArray.byteLength,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    })
    const activeBlockTypeBuffer = device.createBuffer({
      label: 'active block type buffer',
      size: 4,
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    })

    const bindGroupLayout = device.createBindGroupLayout({
      label: 'bind group layout',
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: 'uniform' },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
          buffer: { type: 'uniform' },
        },
      ],
    })
    const bindGroup = device.createBindGroup({
      label: 'bind group',
      layout: bindGroupLayout,
      entries: [
        { binding: 0, resource: uniformBuffer },
        { binding: 1, resource: gridBuffer },
      ],
    })

    const tetrisBindGroupLayout = device.createBindGroupLayout({
      label: 'tetris bind group layout',
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: 'read-only-storage' },
        },
        {
          binding: 1,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: 'read-only-storage' },
        },
        {
          binding: 2,
          visibility: GPUShaderStage.VERTEX,
          buffer: { type: 'read-only-storage' },
        },
      ],
    })
    const tetrisBindGroup = device.createBindGroup({
      label: 'tetris bind group',
      layout: tetrisBindGroupLayout,
      entries: [
        { binding: 0, resource: blockStateBuffer },
        { binding: 1, resource: activeBlockBuffer },
        { binding: 2, resource: activeBlockTypeBuffer },
      ],
    })

    const pipelineLayout = device.createPipelineLayout({
      label: 'render pipeline layout',
      bindGroupLayouts: [bindGroupLayout, tetrisBindGroupLayout],
    })
    const pipeline = device.createRenderPipeline({
      label: 'render pipeline',
      layout: pipelineLayout,
      vertex: {
        module: device.createShaderModule({ code: vert }),
        buffers: [
          {
            arrayStride: cubeVertexSize,
            attributes: [
              {
                shaderLocation: 0,
                offset: cubePositionOffset,
                format: 'float32x4',
              },
              {
                shaderLocation: 1,
                offset: cubeUVOffset,
                format: 'float32x2',
              },
            ],
          },
        ],
      },
      fragment: {
        module: device.createShaderModule({ code: frag }),
        targets: [
          {
            format,
            blend: {
              color: {
                srcFactor: 'src-alpha',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
              alpha: {
                srcFactor: 'one',
                dstFactor: 'one-minus-src-alpha',
                operation: 'add',
              },
            },
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
        cullMode: 'back',
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: 'depth24plus',
      },
    })

    let depthTexture = device.createTexture({
      size: [cubeCanvas.width, cubeCanvas.height],
      format: 'depth24plus',
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    })

    const orthoMatrix = mat4.ortho(-256, 256, -512, 512, -200, 200)
    const viewMatrixArray = new Float32Array(4 * 4 * BOARD_COL * BOARD_ROW)

    function getTransformationMatrix() {
      let offset = 0

      const viewMatrix = mat4.identity()
      mat4.rotateX(viewMatrix, (-4 * Math.PI) / 180, viewMatrix)
      mat4.rotateY(viewMatrix, (-12 * Math.PI) / 180, viewMatrix)
      mat4.scale(viewMatrix, [23, 23, 23], viewMatrix)
      mat4.translate(viewMatrix, [-11.5, -20, 0], viewMatrix)

      for (let i = 0; i < BOARD_ROW; ++i) {
        for (let j = 0; j < BOARD_COL; ++j) {
          const modelViewProjectionMatrix = mat4.create()

          mat4.translate(viewMatrix, [2.1, 0, 0], viewMatrix)
          mat4.multiply(orthoMatrix, viewMatrix, modelViewProjectionMatrix)

          viewMatrixArray.set(modelViewProjectionMatrix, offset)
          offset += 16
        }
        mat4.translate(viewMatrix, [-21, 2.1, 0], viewMatrix)
      }
    }

    let diff = 0
    let prev = Date.now()

    // const observer = new ResizeObserver((entries) => {
    //   for (const entry of entries) {
    //     const canvas = entry.target as HTMLCanvasElement
    //     const width = entry.contentBoxSize[0].inlineSize
    //     const height = entry.contentBoxSize[0].blockSize
    //     canvas.width = Math.max(
    //       1,
    //       Math.min(width, device.limits.maxTextureDimension2D)
    //     )
    //     canvas.height = Math.max(
    //       1,
    //       Math.min(height, device.limits.maxTextureDimension2D)
    //     )
    //     depthTexture = device.createTexture({
    //       size: [canvas.width, canvas.height],
    //       format: 'depth24plus',
    //       usage: GPUTextureUsage.RENDER_ATTACHMENT,
    //     })
    //   }
    // })
    // observer.observe(cubeCanvas)

    function frame() {
      let curr = Date.now()
      diff += curr - prev
      prev = curr

      if (diff > 500) {
        diff -= 500
        if (
          isAtBottom(activeBlockArray) ||
          collision(blockStateArray, activeBlockArray)
        ) {
          writeBoard(blockStateArray, activeBlockArray, activeBlockType)
          if (blockQueue.length === 0) blockQueue = generateBlockQueue()
          activeBlockType = blockQueue[0].originalIndex
          activeBlockState = 0
          activeBlockArray = new Uint32Array(generateBlock(blockQueue))
          if (collision(blockStateArray, activeBlockArray)) {
            gameOver = true
            return
          }
        } else {
          activeBlockArray = activeBlockArray.map((num) => num - 10)
        }
      }
      device.queue.writeBuffer(blockStateBuffer, 0, blockStateArray)
      device.queue.writeBuffer(activeBlockBuffer, 0, activeBlockArray)
      device.queue.writeBuffer(
        activeBlockTypeBuffer,
        0,
        new Uint32Array([activeBlockType])
      )

      getTransformationMatrix()
      device.queue.writeBuffer(uniformBuffer, 0, viewMatrixArray)
      const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
          {
            view: context.getCurrentTexture().createView(),

            clearValue: [0.5, 0.5, 0.5, 0.8],
            loadOp: 'clear',
            storeOp: 'store',
          },
        ],
        depthStencilAttachment: {
          view: depthTexture.createView(),

          depthClearValue: 1.0,
          depthLoadOp: 'clear',
          depthStoreOp: 'store',
        },
      }

      const commandEncoder = device.createCommandEncoder()
      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
      passEncoder.setPipeline(pipeline)
      passEncoder.setBindGroup(0, bindGroup)
      passEncoder.setBindGroup(1, tetrisBindGroup)
      passEncoder.setVertexBuffer(0, cubeVertexBuffer)
      passEncoder.draw(cubeVertexCount, BOARD_COL * BOARD_ROW)
      passEncoder.end()
      device.queue.submit([commandEncoder.finish()])

      if (clearLine(blockStateArray)) {
        isCleared = true
        return
      }

      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  })
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="tetris-container relative h-197 w-101 bg-black p-2.5">
  {#if isCleared}
    <div
      class="mask bg-[(0, 0, 0, 0.5)] absolute inset-2.5 z-1 flex h-192 w-96 items-center justify-center backdrop-blur-sm"
    >
      <div class="message text-4xl font-bold text-white">Line Cleared!</div>
    </div>
  {/if}
  {#if gameOver}
    <div
      class="mask bg-[(0, 0, 0, 0.5)] absolute inset-2.5 z-1 flex h-192 w-96 items-center justify-center backdrop-blur-sm"
    >
      <div class="message text-4xl font-bold text-white">Game Over</div>
    </div>
  {/if}
  {#if errorMessage}
    <div class="error">{errorMessage}</div>
  {:else}
    <canvas
      class="h-full w-full touch-none"
      bind:this={cubeCanvas}
      on:touchstart={handleTouchStart}
      on:touchend={handleTouchEnd}
    ></canvas>
  {/if}
</div>
