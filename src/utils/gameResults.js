/**
 * Result copy is ratio-based (rather than hardcoded to a 10-puzzle game)
 * so it stays correct if the puzzle set ever grows or shrinks.
 * @param {number} correctCount
 * @param {number} total
 */
export function getResultMessage(correctCount, total) {
  if (total <= 0) return 'Good Try!'

  const ratio = correctCount / total
  if (ratio === 1) return 'Puzzle Master!'
  if (ratio >= 0.8) return 'Amazing!'
  if (ratio >= 0.5) return 'Great Job!'
  return 'Good Try!'
}
