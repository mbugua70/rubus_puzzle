import { useCallback, useEffect, useState } from 'react'
import { getGameSession } from '../api/game.api.js'

/**
 * Loads a game session over REST once, up front - this is only ever used to
 * seed the display before the socket connects; Socket.IO supplies every
 * state update after that (this hook never re-polls).
 *
 * @param {string|undefined} gameCode
 */
export function useGameSession(gameCode) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!gameCode) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    getGameSession(gameCode)
      .then((state) => {
        if (!cancelled) setData(state)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [gameCode, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  return { data, loading, error, retry }
}
