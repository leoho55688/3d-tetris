function hasFullRow(
  flatArray: number[] | Int32Array,
  rowSize: number = 10
): boolean {
  for (let i = 0; i < flatArray.length; i += rowSize) {
    let isFull = true
    for (let j = 0; j < rowSize; j++) {
      if (flatArray[i + j] < 0) {
        isFull = false
        break
      }
    }

    if (isFull) return true
  }
  return false
}

function shuffleWithIndex<T>(
  array: T[]
): { value: T; originalIndex: number }[] {
  const result = array.map((value, originalIndex) => ({ value, originalIndex }))

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }

  return result
}

export { hasFullRow, shuffleWithIndex }
