const getIndex = (width: number, coordinate: { x: number; y: number }) =>
  coordinate.y * width + coordinate.x

const setMines = (
  grid: Int32Array,
  width: number,
  height: number,
  origin: { x: number; y: number },
  numberOfMine: number = 99
) => {
  const totalCells = width * height
  const originIndex = getIndex(width, origin)

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
    grid[possibleMineIndices[i]] = -1
  }

  countMines(grid, width, height)
}

const countMines = (grid: Int32Array, width: number, height: number): void => {
  for (let i = 0; i < grid.length; i++) {
    // If the cell is a mine (-1), we don't need to calculate a number for it
    if (grid[i] === -1) continue

    // Convert 1D index to 2D coordinates
    const row = Math.floor(i / width)
    const col = i % width

    let mineCount = 0

    // Check all 8 directions (offsets)
    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        // Skip the current cell itself
        if (dRow === 0 && dCol === 0) continue

        const neighborRow = row + dRow
        const neighborCol = col + dCol

        // Boundary Check: Ensure the neighbor is within the grid
        if (
          neighborRow >= 0 &&
          neighborRow < height &&
          neighborCol >= 0 &&
          neighborCol < width
        ) {
          const neighborIndex = neighborRow * width + neighborCol
          if (grid[neighborIndex] === -1) {
            mineCount++
          }
        }
      }
    }

    grid[i] = mineCount
  }
}

const flag = (
  status: Int32Array,
  width: number,
  height: number,
  cell: { x: number; y: number },
  numOfMines: number
): number => {
  const index = getIndex(width, cell)
  // if cell is unchecked and unflaged, then flag
  if (status[index] === 0) {
    status[getIndex(width, cell)] = 2
    return numOfMines - 1
    // if cell is unchecked and flaged, then unflag
  } else if (status[index] === 2) {
    status[getIndex(width, cell)] = 0
    return numOfMines + 1
  }
  return numOfMines
}

const sweep = (
  board: Int32Array,
  status: Int32Array,
  width: number,
  height: number,
  cell: { x: number; y: number }
): boolean => {
  const index = getIndex(width, cell)
  // return if cell is flaged or checked
  if (status[index] !== 0) {
    return false
  }

  status[index] = 1
  // if the cell is mine, return gameover
  if (board[index] === -1) {
    return true
    // if the cell has 0 mines surround, check the surrounding 8 cells
  } else if (board[index] === 0) {
    // left & right
    if (index % width !== 0) {
      sweep(board, status, width, height, { x: cell.x - 1, y: cell.y })
    }
    if (index % width !== width - 1) {
      sweep(board, status, width, height, { x: cell.x + 1, y: cell.y })
    }
    // bottom & top
    if (index / width !== 0) {
      sweep(board, status, width, height, { x: cell.x, y: cell.y - 1 })
    }
    if (index / width !== height - 1) {
      sweep(board, status, width, height, { x: cell.x, y: cell.y + 1 })
    }
    // four corners
    // bottom-left
    if (index % width !== 0 && index / width !== 0) {
      sweep(board, status, width, height, { x: cell.x - 1, y: cell.y - 1 })
    }
    // bottom-right
    if (index % width !== width - 1 && index / width !== 0) {
      sweep(board, status, width, height, { x: cell.x + 1, y: cell.y - 1 })
    }
    // top-left
    if (index % width !== 0 && index / width !== height - 1) {
      sweep(board, status, width, height, { x: cell.x - 1, y: cell.y + 1 })
    }
    // top-right
    if (index % width !== width - 1 && index / width !== height - 1) {
      sweep(board, status, width, height, { x: cell.x + 1, y: cell.y + 1 })
    }
  }

  return false
}

const checkGameClear = (board: Int32Array, status: Int32Array) => {
  const n = board.length
  for (let i = 0; i < n; ++i) {
    if (board[i] !== -1 && status[i] !== 1) return false
  }
  return true
}

export { setMines, flag, sweep, checkGameClear }
