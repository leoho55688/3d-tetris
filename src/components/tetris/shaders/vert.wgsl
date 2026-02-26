struct Uniforms {
  modelViewProjectionMatrix : array<mat4x4f, 200>,
}

@group(0) @binding(0) var<uniform> uniforms : Uniforms;
@group(0) @binding(1) var<uniform> board: vec2f;

@group(1) @binding(0) var<storage> blockState: array<i32>;
@group(1) @binding(1) var<storage> activeBlock: array<u32>;
@group(1) @binding(2) var<storage> activeBlockType: u32;

struct VertexInput {
  @location(0) position: vec4f,
  @location(1) uv: vec2f,
  @builtin(instance_index) instance: u32,
}

struct VertexOutput {
  @builtin(position) Position: vec4f,
  @location(0) fragUV: vec2f,
  @location(1) fragPosition: vec4f,
  @location(2) @interpolate(flat) blockType: f32
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
  var state = f32(blockState[input.instance]);

  for (var j: u32 = 0; j < 4; j = j + 1) {
    if (activeBlock[j] == input.instance) {
      state = f32(activeBlockType);
    }
  }

  state += 1.0;

  var output : VertexOutput;
  output.Position = uniforms.modelViewProjectionMatrix[input.instance] * input.position * state;
  output.fragUV = input.uv;
  output.fragPosition = 0.5 * (input.position + vec4(1.0, 1.0, 1.0, 1.0));
  output.blockType = state;
  return output;
}
