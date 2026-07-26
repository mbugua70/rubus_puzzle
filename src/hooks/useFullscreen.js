import { useCallback, useEffect, useState } from 'react'

function getFullscreenElement() {
  return document.fullscreenElement ?? document.webkitFullscreenElement ?? null
}

/** Wraps the Fullscreen API; degrades gracefully in browsers that reject or lack it entirely. */
export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(() => Boolean(getFullscreenElement()))
  const [isSupported] = useState(
    () => typeof document !== 'undefined' && Boolean(document.documentElement.requestFullscreen),
  )

  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(getFullscreenElement()))
    document.addEventListener('fullscreenchange', handleChange)
    document.addEventListener('webkitfullscreenchange', handleChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleChange)
      document.removeEventListener('webkitfullscreenchange', handleChange)
    }
  }, [])

  const enter = useCallback(async () => {
    if (!isSupported) return
    try {
      await document.documentElement.requestFullscreen()
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[useFullscreen] Request was rejected:', err)
    }
  }, [isSupported])

  const exit = useCallback(async () => {
    if (!getFullscreenElement()) return
    try {
      await document.exitFullscreen()
    } catch (err) {
      if (import.meta.env.DEV) console.warn('[useFullscreen] Exit was rejected:', err)
    }
  }, [])

  const toggle = useCallback(() => {
    if (getFullscreenElement()) exit()
    else enter()
  }, [enter, exit])

  return { isFullscreen, isSupported, enter, exit, toggle }
}
