const cubeVertexSize = 4 * 6
const cubePositionOffset = 0
const cubeUVOffset = 4 * 4
const cubeVertexCount = 36

// prettier-ignore
const cubeVertexArray = new Float32Array([
  // float4 position, float2 uv,
  // bottom
   1, -1,  1,  1,   0, 1,
  -1, -1,  1,  1,   1, 1,
  -1, -1, -1,  1,   1, 0,
   1, -1, -1,  1,   0, 0,
   1, -1,  1,  1,   0, 1,
  -1, -1, -1,  1,   1, 0,
  // right
   1,  1,  1,  1,   0, 1,
   1, -1,  1,  1,   1, 1,
   1, -1, -1,  1,   1, 0,
   1,  1, -1,  1,   0, 0,
   1,  1,  1,  1,   0, 1,
   1, -1, -1,  1,   1, 0,
  // top
  -1,  1,  1,  1,   0, 1,
   1,  1,  1,  1,   1, 1,
   1,  1, -1,  1,   1, 0,
  -1,  1, -1,  1,   0, 0,
  -1,  1,  1,  1,   0, 1,
   1,  1, -1,  1,   1, 0,
  // left
  -1, -1,  1,  1,   0, 1,
  -1,  1,  1,  1,   1, 1,
  -1,  1, -1,  1,   1, 0,
  -1, -1, -1,  1,   0, 0,
  -1, -1,  1,  1,   0, 1,
  -1,  1, -1,  1,   1, 0,
  // back
   1,  1,  1,  1,   0, 1,
  -1,  1,  1,  1,   1, 1,
  -1, -1,  1,  1,   1, 0,
  -1, -1,  1,  1,   1, 0,
   1, -1,  1,  1,   0, 0,
   1,  1,  1,  1,   0, 1,
  // front
   1, -1, -1,  1,   0, 1,
  -1, -1, -1,  1,   1, 1,
  -1,  1, -1,  1,   1, 0,
   1,  1, -1,  1,   0, 0,
   1, -1, -1,  1,   0, 1,
  -1,  1, -1,  1,   1, 0,
]);

export {
  cubeVertexSize,
  cubePositionOffset,
  cubeUVOffset,
  cubeVertexCount,
  cubeVertexArray,
}
