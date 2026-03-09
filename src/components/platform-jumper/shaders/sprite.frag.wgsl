@group(1) @binding(0) var spriteTexture: texture_2d<f32>;
@group(1) @binding(1) var spriteSampler: sampler;

struct FragmentInput {
    @builtin(position) pos: vec4<f32>,
    @location(0) uv: vec2<f32>,
};

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f  {
    return vec4<f32>(0.2, 0.6, 1.0, 1.0);
}