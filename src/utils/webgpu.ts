import { Ok, Err } from './result'
import type { Result } from './result'

export async function initWebGPU(
  canvas: HTMLCanvasElement
): Promise<
  Result<
    { device: GPUDevice; context: GPUCanvasContext; format: GPUTextureFormat },
    Error
  >
> {
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
