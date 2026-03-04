struct VertexOutput {
    @builtin(position) position: vec4f,
    @location(0) uv: vec2f,
};

@fragment
fn main(in: VertexOutput) -> @location(0) vec4f {
    let uv = in.uv;
    let dark = vec4f(0.5, 0.5, 0.5, 1.0);
    let light = vec4f(0.9, 0.9, 0.9, 1.0);
    let medium = vec4f(0.75, 0.75, 0.75, 1.0);
    let border_width = 0.1;

    // Bottom border
    if (uv.y < border_width) {
        if (uv.x < 1.0 - border_width) {
            return dark;
        }
    }

    // Left border
    if (uv.x < border_width) {
        if (uv.y < 1.0 - border_width) {
            return light;
        }
    }

    // Top border
    if (uv.y > 1.0 - border_width) {
        return light;
    }

    // Right border
    if (uv.x > 1.0 - border_width) {
        return dark;
    }

    return medium;
}