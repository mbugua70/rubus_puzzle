import { motion } from 'motion/react'
import { BrandLogo } from '../components/BrandLogo.jsx'
import { FullscreenButton } from '../components/FullscreenButton.jsx'
import { HoldingBackdrop } from '../components/HoldingBackdrop.jsx'
import { SoundButton } from '../components/SoundButton.jsx'
import { puzzles } from '../data/puzzles.js'
import styles from './WaitingScreen.module.css'

// A handful of puzzle images drift subtly over the event artwork — decorative
// only, so they're aria-hidden and never announced.
const BACKGROUND_IMAGES = puzzles.slice(0, 4).map((puzzle) => puzzle.leftImage)

/** Shown while the backend session status is "waiting" - before the facilitator presses Start. */
export function WaitingScreen({ gameCode, facilitatorConnected, isFullscreen, onToggleFullscreen, isMuted, onToggleMute }) {
  return (
    <div className={styles.wrapper}>
      <HoldingBackdrop />

      <div className={styles.controls}>
        <SoundButton isMuted={isMuted} onToggle={onToggleMute} />
        <FullscreenButton isFullscreen={isFullscreen} onToggle={onToggleFullscreen} />
      </div>

      <div className={styles.background} aria-hidden="true">
        {BACKGROUND_IMAGES.map((src, index) => (
          <motion.img
            key={src}
            src={src}
            className={styles.floatingImage}
            data-slot={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12, y: [0, -18, 0] }}
            transition={{
              opacity: { duration: 1 },
              y: { duration: 7 + index, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <BrandLogo className={styles.logo} />
        </motion.div>

        <p className={styles.title}>Rubus Puzzle</p>

        <motion.p
          className={styles.status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Waiting for the facilitator to start
        </motion.p>

        <div className={styles.gameCode} aria-label={`Game code ${gameCode}`}>
          {gameCode}
        </div>

        <div className={styles.presence} role="status" aria-live="polite">
          <span className={styles.presenceItem}>
            <span className={styles.presenceDot} data-connected={facilitatorConnected} />
            Facilitator {facilitatorConnected ? 'connected' : 'not connected'}
          </span>
        </div>
      </div>
    </div>
  )
}
