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

const flag = (status: Int32Array, col: number, row: number, cell: { x: number; y: number }) => {
  status[cell.y * col + cell.x] = 2
}

const sweep = (
  board: Int32Array,
  status: Int32Array,
  col: number,
  row: number,
  cell: { x: number; y: number }
): boolean => {
  board[cell.y * col + cell.x] = 8
  status[cell.y * col + cell.x] = 1

  return false
}

export { setMines, flag, sweep }
