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
