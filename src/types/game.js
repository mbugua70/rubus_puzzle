/**
 * Central shape definitions for the game state machine.
 * Plain JS + JSDoc (no TypeScript) so editors still get intellisense.
 */

/**
 * @typedef {'loading'|'idle'|'countdown'|'playing'|'correct'|'wrong'|'timeout'|'paused'|'finished'} GameStatus
 */

/** Single source of truth for the status values above, to avoid typos scattered through the app. */
export const GameStatus = Object.freeze({
  LOADING: 'loading',
  IDLE: 'idle',
  COUNTDOWN: 'countdown',
  PLAYING: 'playing',
  CORRECT: 'correct',
  WRONG: 'wrong',
  TIMEOUT: 'timeout',
  PAUSED: 'paused',
  FINISHED: 'finished',
})

/**
 * @typedef {Object} Puzzle
 * @property {number} id
 * @property {string} leftImage
 * @property {string} rightImage
 * @property {string} leftWord
 * @property {string} rightWord
 * @property {string} answer
 */

/**
 * @typedef {Object} GameState
 * @property {GameStatus} status
 * @property {number} currentPuzzleIndex
 * @property {number} score
 * @property {number} correctCount
 * @property {number} wrongCount
 * @property {number} skippedCount
 * @property {number} timeRemaining
 * @property {boolean} hasAnsweredCurrentPuzzle
 */

export const PUZZLE_DURATION_SECONDS = 10
export const POINTS_PER_CORRECT_ANSWER = 10
