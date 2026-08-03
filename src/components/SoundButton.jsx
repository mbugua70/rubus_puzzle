import { AnimatePresence, motion } from 'motion/react'
import styles from './IconButton.module.css'

// Standard "speaker + sound waves" glyph (two nested arcs, not one) so "on" reads
// unambiguously at a glance from across a room - a single arc looks half-muted.
const SPEAKER_PATH = 'M3 9v6h4l5 5V4L7 9H3z'
const WAVE_INNER_PATH = 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z'
const WAVE_OUTER_PATH = 'M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'
// Kept separate from the speaker (not a diagonal slash through it) so it stays
// legible at small sizes - same convention as Feather's volume-x. Shifted down
// 3px from Material's standalone close-icon coordinates so its center (y=12)
// lines up with the speaker glyph's vertical center, not the speaker's top edge.
const MUTE_X_PATH =
  'M19 9.41 17.59 8 15 10.59 12.41 8 11 9.41 13.59 12 11 14.59 12.41 16 15 13.41 17.59 16 19 14.59 16.41 12z'

export function SoundButton({ isMuted, onToggle }) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onToggle}
      title={isMuted ? 'Unmute sound' : 'Mute sound'}
      aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={isMuted}
      data-muted={isMuted || undefined}
    >
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true" focusable="false">
        <path fill="currentColor" d={SPEAKER_PATH} />
        <AnimatePresence initial={false} mode="wait">
          {isMuted ? (
            <motion.path
              key="muted"
              fill="currentColor"
              d={MUTE_X_PATH}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              style={{ transformOrigin: '15px 12px' }}
            />
          ) : (
            <motion.g
              key="unmuted"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15 }}
              style={{ transformOrigin: '13px 12px' }}
            >
              <path fill="currentColor" d={WAVE_INNER_PATH} />
              <path fill="currentColor" d={WAVE_OUTER_PATH} />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </button>
  )
}
