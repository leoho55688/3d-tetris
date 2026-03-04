@fragment
fn main(@builtin(position) coord : vec4<f32>) -> @location(0) vec4<f32> {
  let cellSize = 32.0; // 32.0 pixels per cell

  // Determine the thickness of the grid lines (e.g., 1 pixel)
  let thickness = 1.0;

  // Check if the current pixel is near the edge of a cell
  let grid_lines = step(thickness, coord.x % cellSize) * step(thickness, coord.y % cellSize);

  // invert the result to color the lines
  if (grid_lines == 0.0) {
    return vec4<f32>(0.5, 0.5, 0.5, 1.0); // Light gray grid lines
  }

  return vec4<f32>(0.8, 0.8, 0.8, 1.0); // Dark background
}