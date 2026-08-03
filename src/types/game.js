/**
 * Central shape definitions for the display client. Plain JS + JSDoc (no
 * TypeScript) so editors still get intellisense.
 *
 * These mirror the backend exactly (rubus_puzzle_backend/src/types/game.types.ts
 * and socket.types.ts) - the backend is the single source of truth for game
 * state, this file just documents its shape for the display client.
 */

/**
 * @typedef {'waiting'|'countdown'|'playing'|'correct'|'wrong'|'timeout'|'revealed'|'paused'|'finished'} GameStatus
 */

/** Single source of truth for the status values above, to avoid typos scattered through the app. */
export const GameStatus = Object.freeze({
  WAITING: 'waiting',
  COUNTDOWN: 'countdown',
  PLAYING: 'playing',
  CORRECT: 'correct',
  WRONG: 'wrong',
  TIMEOUT: 'timeout',
  REVEALED: 'revealed',
  PAUSED: 'paused',
  FINISHED: 'finished',
})

/**
 * @typedef {Object} GameStatePayload
 * @property {string} gameCode
 * @property {GameStatus} status
 * @property {string[]} puzzleIds
 * @property {number} currentPuzzleIndex
 * @property {string|null} currentPuzzleId
 * @property {number} score
 * @property {number} correctCount
 * @property {number} wrongCount
 * @property {number} skippedCount
 * @property {number} timeoutCount
 * @property {number} revealedCount
 * @property {boolean} currentPuzzleAnswered
 * @property {string|null} questionStartedAt ISO timestamp
 * @property {string|null} questionEndsAt ISO timestamp
 * @property {string|null} startedAt ISO timestamp
 * @property {string|null} finishedAt ISO timestamp
 * @property {boolean} facilitatorConnected
 * @property {boolean} displayConnected
 */

/**
 * @typedef {{ success: true, data: T }} ApiSuccess<T>
 * @template T
 */

/**
 * @typedef {{ success: false, message: string }} ApiFailure
 */

/**
 * @typedef {ApiSuccess<T>|ApiFailure} ApiResponse<T>
 * @template T
 */

/**
 * @typedef {{ success: true, data: GameStatePayload }|{ success: false, message: string }} SocketAck
 */
