/**
 * A tiny inline placeholder shown when a puzzle image fails to load,
 * so a bad asset path never crashes the TV display or leaves a blank gap.
 */
export const PLACEHOLDER_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
      <rect width="100%" height="100%" fill="#1c1730"/>
      <text x="50%" y="50%" font-family="sans-serif" font-size="28" fill="#7d76a8"
            text-anchor="middle" dominant-baseline="middle">?</text>
    </svg>`,
  )

/**
 * Loads a single image and always resolves (never rejects), so a failed
 * load can't abort a larger Promise.all preload batch.
 * @param {string} src
 * @returns {Promise<{ src: string, ok: boolean }>}
 */
export function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ src, ok: true })
    img.onerror = () => {
      if (import.meta.env.DEV) {
        console.warn(`[imagePreloader] Failed to load image, falling back to placeholder: ${src}`)
      }
      resolve({ src, ok: false })
    }
    img.src = src
  })
}

/**
 * Preloads a list of image sources, reporting incremental progress.
 * @param {string[]} sources
 * @param {(loaded: number, total: number) => void} [onProgress]
 * @returns {Promise<Map<string, boolean>>} map of src -> whether it loaded successfully
 */
export async function preloadImages(sources, onProgress) {
  const total = sources.length
  let loaded = 0
  const statusBySrc = new Map()

  await Promise.all(
    sources.map(async (src) => {
      const result = await preloadImage(src)
      statusBySrc.set(result.src, result.ok)
      loaded += 1
      onProgress?.(loaded, total)
    }),
  )

  return statusBySrc
}
