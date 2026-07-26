import { useEffect, useRef } from 'react'
import { GameStatus } from '../types/game.js'

/**
 * Single global keydown listener, attached once and never re-attached, that
 * simulates facilitator input. Reads status/handlers from refs rather than
 * effect dependencies so it stays one stable listener for the component's
 * lifetime instead of being torn down and rebuilt on every state change.
 *
 * @param {{
 *   status: import('../types/game.js').GameStatus,
 *   onStart?: () => void,
 *   onCorrect?: () => void,
 *   onWrong?: () => void,
 *   onSkip?: () => void,
 *   onTogglePause?: () => void,
 *   onRestart?: () => void,
 *   onToggleFullscreen?: () => void,
 *   onToggleMute?: () => void,
 * }} handlers
 */
export function useKeyboardControls({
  status,
  onStart,
  onCorrect,
  onWrong,
  onSkip,
  onTogglePause,
  onRestart,
  onToggleFullscreen,
  onToggleMute,
}) {
  const statusRef = useRef(status)
  statusRef.current = status

  const handlersRef = useRef({})
  handlersRef.current = { onStart, onCorrect, onWrong, onSkip, onTogglePause, onRestart, onToggleFullscreen, onToggleMute }

  useEffect(() => {
    function handleKeyDown(event) {
      // A held key must trigger its action once, not repeatedly.
      if (event.repeat) return

      const currentStatus = statusRef.current
      const h = handlersRef.current

      switch (event.key) {
        case 'Enter':
          if (currentStatus === GameStatus.IDLE) h.onStart?.()
          break

        case 'c':
        case 'C':
          if (currentStatus === GameStatus.PLAYING) h.onCorrect?.()
          break

        case 'w':
        case 'W':
          if (currentStatus === GameStatus.PLAYING) h.onWrong?.()
          break

        case 's':
        case 'S':
          if (currentStatus === GameStatus.PLAYING) h.onSkip?.()
          break

        case ' ':
        case 'Spacebar':
          // Prevent page scroll unconditionally, even if pause isn't valid right now.
          event.preventDefault()
          if (currentStatus === GameStatus.PLAYING || currentStatus === GameStatus.PAUSED) h.onTogglePause?.()
          break

        case 'r':
        case 'R':
          if (currentStatus === GameStatus.FINISHED) h.onRestart?.()
          break

        case 'f':
        case 'F':
          h.onToggleFullscreen?.()
          break

        case 'm':
        case 'M':
          h.onToggleMute?.()
          break

        default:
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
}
