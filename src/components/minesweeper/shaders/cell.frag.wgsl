@group(1) @binding(0) var spriteTexture: texture_2d<f32>;
@group(1) @binding(1) var spriteSampler: sampler;

struct FragmentInput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
    @location(1) @interpolate(flat) texture_index: u32,
};

@fragment
fn main(input: FragmentInput) -> @location(0) vec4f {
    let grid: vec2<f32> = vec2<f32>(4.0, 6.0); // 4 columns, 6 rows
    
    // Calculate row and column from the flat index
    let col = f32(input.texture_index % 4u);
    let row = f32(input.texture_index / 4u);
    
    // 1. Scale the UVs down to the size of one sprite
    let scaledUV = input.uv / grid;
    
    // 2. Offset the UVs to the correct cell
    let offset = vec2<f32>(col, row) / grid;
    
    let finalUV = scaledUV + offset;

    return textureSample(spriteTexture, spriteSampler, finalUV);
}