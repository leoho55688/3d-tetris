@group(0) @binding(0) var<uniform> board: vec2f;
@group(0) @binding(1) var<storage> mine_board: array<i32>;
@group(0) @binding(2) var<storage> cell_state: array<i32>;

struct VertexInput {
    @builtin(vertex_index) vertex_index: u32,
    @builtin(instance_index) instance_index: u32,
    @location(0) pos: vec2f,
}

struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
    @location(1) @interpolate(flat) texture_index: u32,
}

@vertex
fn main(input: VertexInput) -> VertexOutput {
    let uv = array<vec2f, 4>(
        vec2f(0.0, 1.0),
        vec2f(0.0, 0.0),
        vec2f(1.0, 1.0),
        vec2f(1.0, 0.0),
    );

    let adj_x = (input.pos.x - board.x + 1 + f32(input.instance_index) % board.x * 2) / board.x;
    let adj_y = (input.pos.y - board.y + 1 + trunc(f32(input.instance_index) / board.x) * 2) / board.y;

    var out: VertexOutput;
    out.position = vec4f(adj_x, adj_y, 0, 1);
    out.uv = uv[input.vertex_index];
    if (cell_state[input.instance_index] == 0) {
        out.texture_index = 0;
    } else if (cell_state[input.instance_index] == 2) {
        out.texture_index = 4;
    } else {
        if (mine_board[input.instance_index] == -1) {
            out.texture_index = 1;
        } else if (mine_board[input.instance_index] == 1) {
            out.texture_index = 12;
        } else if (mine_board[input.instance_index] == 2) {
            out.texture_index = 13;
        } else if (mine_board[input.instance_index] == 3) {
            out.texture_index = 14;
        } else if (mine_board[input.instance_index] == 4) {
            out.texture_index = 15;
        } else if (mine_board[input.instance_index] == 5) {
            out.texture_index = 16;
        } else if (mine_board[input.instance_index] == 6) {
            out.texture_index = 17;
        } else if (mine_board[input.instance_index] == 7) {
            out.texture_index = 18;
        } else if (mine_board[input.instance_index] == 8) {
            out.texture_index = 19;
        } else {
            out.texture_index = 11;
        }
    }
    return out;
}