import { hasFullRow, shuffleWithIndex } from '@/utils/util'

const BLOCKS = [
  // I-shape
  [
    [20, 21, 22, 23],
    [2, 12, 22, 32],
    [10, 11, 12, 13],
    [1, 11, 21, 31],
  ],
  // J-shape
  [
    [20, 21, 22, 30],
    [1, 11, 21, 22],
    [2, 10, 11, 12],
    [0, 1, 11, 21],
  ],
  // L-shape
  [
    [20, 21, 22, 32],
    [11, 12, 21, 31],
    [10, 20, 21, 22],
    [11, 21, 30, 31],
  ],
  // O-shape
  [
    [21, 22, 31, 32],
    [21, 22, 31, 32],
    [21, 22, 31, 32],
    [21, 22, 31, 32],
  ],
  // S-shape
  [
    [20, 21, 31, 32],
    [12, 21, 22, 31],
    [10, 11, 21, 22],
    [11, 20, 21, 30],
  ],
  // T-shape
  [
    [20, 21, 22, 31],
    [11, 21, 22, 31],
    [11, 20, 21, 22],
    [11, 20, 21, 31],
  ],
  // Z-shape
  [
    [21, 22, 30, 31],
    [11, 21, 22, 32],
    [11, 12, 20, 21],
    [10, 20, 21, 31],
  ],
]

const generateBlockQueue = (): { value: number[]; originalIndex: number }[] => {
  return shuffleWithIndex(BLOCKS.map((list) => list[0]))
}

const generateBlock = (
  blockQueue: { value: number[]; originalIndex: number }[]
): number[] => {
  if (blockQueue.length === 0) {
    generateBlockQueue().forEach((b) => blockQueue.push(b))
  }

  const block = blockQueue.shift()?.value
  if (!block) {
    throw new Error(
      'Could not generate a new block. The block source is empty.'
    )
  }

  return block.map((num) => num + 163)
}

const rotateBlock = (
  blockType: number,
  activeBlockState: number,
  activeBlock: Uint32Array
) => {
  for (let i = 0; i < 4; ++i) {
    activeBlock[i] -=
      BLOCKS[blockType][activeBlockState][i] -
      BLOCKS[blockType][(activeBlockState + 1) % 4][i]
  }
}

const isAtLeftWall = (activeBlock: Uint32Array): boolean => {
  return Array.from(activeBlock).some((index) => index % 10 === 0)
}

const isAtRightWall = (activeBlock: Uint32Array): boolean => {
  return Array.from(activeBlock).some((index) => index % 10 === 9)
}

const isAtBottom = (activeBlock: Uint32Array): boolean => {
  return Array.from(activeBlock).some((index) => index < 10)
}

const collision = (
  blockState: Int32Array,
  activeBlock: Uint32Array
): boolean => {
  return Array.from(activeBlock).some((index) => blockState[index - 10] > -1)
}

const writeBoard = (
  blockState: Int32Array,
  activeBlock: Uint32Array,
  blockType: number
) => {
  activeBlock.forEach((num) => {
    blockState[num] = blockType
  })
}

const clearLine = (blockState: Int32Array): boolean => {
  return hasFullRow(blockState)
}

export {
  generateBlockQueue,
  generateBlock,
  rotateBlock,
  isAtLeftWall,
  isAtRightWall,
  isAtBottom,
  collision,
  writeBoard,
  clearLine,
}
