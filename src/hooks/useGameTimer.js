import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Timestamp-based countdown so drift doesn't accumulate across ticks
 * (a naive setInterval(-1) countdown slowly desyncs from wall-clock time).
 * Pausing snapshots the remaining time; resuming recomputes the end
 * timestamp from that snapshot rather than resetting the duration.
 *
 * @param {{ onExpire?: () => void }} [options]
 */
export function useGameTimer({ onExpire } = {}) {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const endTimeRef = useRef(null)
  const remainingAtPauseRef = useRef(0)
  const frameRef = useRef(null)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  const stopLoop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [])

  const tick = useCallback(() => {
    if (endTimeRef.current === null) return
    const secondsLeft = Math.max(0, (endTimeRef.current - Date.now()) / 1000)
    setTimeRemaining(secondsLeft)

    if (secondsLeft <= 0) {
      stopLoop()
      setIsRunning(false)
      onExpireRef.current?.()
      return
    }
    frameRef.current = requestAnimationFrame(tick)
  }, [stopLoop])

  const start = useCallback(
    (seconds) => {
      stopLoop()
      setDuration(seconds)
      setTimeRemaining(seconds)
      endTimeRef.current = Date.now() + seconds * 1000
      setIsRunning(true)
      frameRef.current = requestAnimationFrame(tick)
    },
    [stopLoop, tick],
  )

  const pause = useCallback(() => {
    stopLoop()
    const secondsLeft = endTimeRef.current ? Math.max(0, (endTimeRef.current - Date.now()) / 1000) : 0
    remainingAtPauseRef.current = secondsLeft
    setTimeRemaining(secondsLeft)
    endTimeRef.current = null
    setIsRunning(false)
  }, [stopLoop])

  const resume = useCallback(() => {
    stopLoop()
    endTimeRef.current = Date.now() + remainingAtPauseRef.current * 1000
    setIsRunning(true)
    frameRef.current = requestAnimationFrame(tick)
  }, [stopLoop, tick])

  const stop = useCallback(() => {
    stopLoop()
    endTimeRef.current = null
    setIsRunning(false)
  }, [stopLoop])

  // Belt-and-braces cleanup: covers unmount, StrictMode double-invoke, and
  // any path that forgets to call stop() explicitly.
  useEffect(() => stopLoop, [stopLoop])

  return { timeRemaining, duration, isRunning, start, pause, resume, stop }
}
