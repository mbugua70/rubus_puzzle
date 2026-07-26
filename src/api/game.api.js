import { env } from '../config/env.js'

/**
 * Loads an existing game session by its code. The display client only ever
 * reads a session - it never creates or deletes one (the facilitator app owns
 * that) - so this is the only REST call this app makes.
 *
 * @param {string} gameCode
 * @returns {Promise<import('../types/game.js').GameStatePayload>}
 */
export async function getGameSession(gameCode) {
  const response = await fetch(`${env.apiUrl}/api/game-sessions/${encodeURIComponent(gameCode)}`)
  const result = await response.json()

  if (!response.ok || !result.success) {
    throw new Error(result.success ? 'Failed to load game' : result.message)
  }

  return result.data
}
