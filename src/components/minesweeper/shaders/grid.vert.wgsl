struct VertexOutput {
    @builtin(position) position : vec4<f32>,
}

@vertex
fn main(@builtin(vertex_index) vertexIndex : u32) -> VertexOutput {
  var pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 3.0, -1.0),
    vec2<f32>(-1.0,  3.0)
  );

  var output : VertexOutput;
  output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  return output;
}