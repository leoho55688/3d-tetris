const generateMineVertex = () => {}

const setMines = (
  board: Int32Array,
  col: number,
  row: number,
  origin: { x: number; y: number },
  numberOfMine: number = 99
) => {
  const totalCells = col * row
  const originIndex = origin.y * col + origin.x

  const possibleMineIndices = Array.from(
    { length: totalCells },
    (_, i) => i
  ).filter((i) => i !== originIndex)

  for (let i = possibleMineIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[possibleMineIndices[i], possibleMineIndices[j]] = [
      possibleMineIndices[j],
      possibleMineIndices[i],
    ]
  }

  for (let i = 0; i < numberOfMine; i++) {
    board[possibleMineIndices[i]] = -1
  }
}

export { setMines }
