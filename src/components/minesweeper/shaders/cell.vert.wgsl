@group(0) @binding(0) var<uniform> board: vec2f;

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
};

@vertex
fn main(
    @builtin(vertex_index) vertex_index: u32,
    @location(0) pos: vec2f
) -> VertexOutput {
    let uv = array<vec2f, 4>(
        vec2f(0.0, 0.0),
        vec2f(0.0, 1.0),
        vec2f(1.0, 0.0),
        vec2f(1.0, 1.0)
    );

    let cellSize = 24.0;
    let adjPos = (pos - cellSize + 1) / cellSize;

    var out: VertexOutput;
    out.position = vec4f(adjPos, 0, 1);
    out.uv = uv[vertex_index];
    return out;
}