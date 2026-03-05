import { Ok, Err } from './result'
import type { Result } from './result'

const initWebGPU = async (
  canvas: HTMLCanvasElement
): Promise<
  Result<
    { device: GPUDevice; context: GPUCanvasContext; format: GPUTextureFormat },
    Error
  >
> => {
  if (!navigator.gpu) {
    return Err(new Error('WebGPU not supported!'))
  }

  const adapter = await navigator.gpu.requestAdapter()
  if (!adapter) {
    return Err(new Error('No adapter found!'))
  }

  const device = await adapter.requestDevice()
  const context = canvas.getContext('webgpu')
  if (!context) {
    return Err(new Error('No webgpu context found!'))
  }

  const format = navigator.gpu.getPreferredCanvasFormat()
  context.configure({ device, format })

  return Ok({ device, context, format })
}

const loadTexture = async (device: GPUDevice, url: string) => {
  const response = await fetch(url)
  if (!response.ok)
    throw new Error(`Failed to fetch image: ${response.statusText}`)
  const blob = await response.blob()

  const imageBitmap = await createImageBitmap(blob, {
    colorSpaceConversion: 'none',
  })

  const texture = device.createTexture({
    size: [imageBitmap.width, imageBitmap.height, 1],
    format: 'rgba8unorm',
    usage:
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT,
  })

  device.queue.copyExternalImageToTexture(
    { source: imageBitmap },
    { texture: texture },
    [imageBitmap.width, imageBitmap.height]
  )

  return texture
}

export { initWebGPU, loadTexture }
