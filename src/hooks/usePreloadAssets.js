import { useEffect, useState } from 'react'
import { puzzles } from '../data/puzzles.js'
import { preloadImages } from '../utils/imagePreloader.js'

/**
 * Preloads every puzzle image up front and combines that with sound-loading
 * state (owned separately by useGameSounds, passed in as `soundsReady` so
 * there's only ever one set of Howl instances). The loading screen should
 * not let the game begin until `isReady` is true.
 *
 * @param {{ soundsReady: boolean }} options
 */
export function usePreloadAssets({ soundsReady }) {
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const [imagesTotal, setImagesTotal] = useState(0)
  const [imagesReady, setImagesReady] = useState(false)
  const [failedImages, setFailedImages] = useState(() => new Set())

  useEffect(() => {
    let cancelled = false
    const sources = Array.from(new Set(puzzles.flatMap((puzzle) => [puzzle.leftImage, puzzle.rightImage])))
    setImagesTotal(sources.length)

    preloadImages(sources, (loaded) => {
      if (!cancelled) setImagesLoaded(loaded)
    }).then((statusBySrc) => {
      if (cancelled) return
      const failed = new Set()
      statusBySrc.forEach((ok, src) => {
        if (!ok) failed.add(src)
      })
      setFailedImages(failed)
      setImagesReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [])

  return {
    isReady: imagesReady && soundsReady,
    progress: imagesTotal === 0 ? 0 : imagesLoaded / imagesTotal,
    imagesLoaded,
    imagesTotal,
    failedImages,
  }
}
