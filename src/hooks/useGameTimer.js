import { useEffect, useState } from 'react'

const TICK_MS = 100

/**
 * Purely visual countdown derived from the backend's `questionStartedAt`/
 * `questionEndsAt` timestamps. This never decides anything - it doesn't emit
 * a timeout, doesn't touch backend state, and doesn't switch game status.
 * When the backend's own timer actually expires, a new `game:state` (status
 * "timeout") arrives and this hook just stops ticking because
 * `questionEndsAt` goes back to null.
 *
 * @param {{ questionStartedAt: string|null, questionEndsAt: string|null, isPaused?: boolean }} options
 */
export function useGameTimer({ questionStartedAt, questionEndsAt, isPaused }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    setNow(Date.now())

    if (!questionEndsAt || isPaused) return

    const intervalId = setInterval(() => setNow(Date.now()), TICK_MS)
    return () => clearInterval(intervalId)
  }, [questionEndsAt, isPaused])

  if (!questionEndsAt) {
    return { timeRemaining: 0, duration: 0 }
  }

  const endMs = new Date(questionEndsAt).getTime()
  const startMs = questionStartedAt ? new Date(questionStartedAt).getTime() : endMs
  const duration = Math.max(0, (endMs - startMs) / 1000)
  const timeRemaining = Math.max(0, (endMs - now) / 1000)

  return { timeRemaining, duration }
}
