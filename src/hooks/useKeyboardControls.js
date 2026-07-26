import { useEffect, useRef } from 'react'

/**
 * The TV display is a read-only view of backend state - it must never send
 * facilitator control events (start/judge/skip/pause/restart all live in the
 * facilitator app). The only keyboard shortcuts that belong here are purely
 * presentational, local-to-this-screen concerns: fullscreen and mute.
 *
 * @param {{ onToggleFullscreen?: () => void, onToggleMute?: () => void }} handlers
 */
export function useKeyboardControls({ onToggleFullscreen, onToggleMute }) {
  const handlersRef = useRef({})
  handlersRef.current = { onToggleFullscreen, onToggleMute }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.repeat) return
      const h = handlersRef.current

      switch (event.key) {
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
