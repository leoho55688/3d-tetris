struct Entity {
    pos: vec2<f32>,
    size: vec2<f32>,
};

@group(0) @binding(0) var<uniform> camera: mat4x4<f32>;
@group(0) @binding(1) var<storage, read> entities: array<Entity>;

struct VertexInput {
    @builtin(vertex_index) v_idx: u32,
    @builtin(instance_index) i_idx: u32,
}

struct VertexOutput {
    @builtin(position) pos: vec4<f32>,
    @location(0) uv: vec2<f32>,
};


@vertex
fn main(in: VertexInput) -> VertexOutput {
    let rect = array<vec2<f32>, 4>(
        vec2(0.0, 0.0), vec2(1.0, 0.0), vec2(0.0, 1.0), vec2(1.0, 1.0)
    );
    let entity = entities[in.i_idx];
    let world_pos = (rect[in.v_idx] * entity.size) - (entity.size) + entity.pos;

    var out: VertexOutput;
    out.pos = vec4f((camera * vec4f(world_pos, 0, 1)).xy, 0, 1);
    out.uv = rect[in.v_idx];
    return out;
}