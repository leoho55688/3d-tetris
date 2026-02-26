@fragment
fn main(
  @location(0) fragUV: vec2f,
  @location(1) fragPosition: vec4f,
  @location(2) @interpolate(flat) blockType: f32
) -> @location(0) vec4f {
  let edge_thickness = 0.06;

  if (fragUV.x < edge_thickness || fragUV.x > 1.0 - edge_thickness || fragUV.y < edge_thickness || fragUV.y > 1.0 - edge_thickness) {
    return vec4f(10.0/255.0, 25.0/255.0, 47.0/255.0, 1.0);
  } else {
    var base_color: vec3f;

    switch (u32(blockType)) {
      case 1: { // I - Cyan
        base_color = vec3f(0.0/255.0, 240.0/255.0, 240.0/255.0);
      }
      case 2: { // J - Blue
        base_color = vec3f(0.0/255.0, 0.0/255.0, 240.0/255.0);
      }
      case 3: { // L - Orange
        base_color = vec3f(240.0/255.0, 161.0/255.0, 0.0/255.0);
      }
      case 4: { // O - Yellow
        base_color = vec3f(240.0/255.0, 240.0/255.0, 0.0/255.0);
      }
      case 5: { // S - Green
        base_color = vec3f(0.0/255.0, 240.0/255.0, 0.0/255.0);
      }
      case 6: { // T - Purple
        base_color = vec3f(160.0/255.0, 0.0/255.0, 240.0/255.0);
      }
      case 7: { // Z - Red
        base_color = vec3f(240.0/255.0, 0.0/255.0, 0.0/255.0);
      }
      default: {
        return vec4f(0.0, 0.0, 0.0, 0.0);
      }
    }

    return vec4f(base_color, 1.0);
  }
}
