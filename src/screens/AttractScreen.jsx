import { motion } from 'motion/react'
import { FullscreenButton } from '../components/FullscreenButton.jsx'
import { SoundButton } from '../components/SoundButton.jsx'
import { puzzles } from '../data/puzzles.js'
import styles from './AttractScreen.module.css'

// A handful of puzzle images drift subtly in the background — decorative
// only, so they're aria-hidden and never announced.
const BACKGROUND_IMAGES = puzzles.slice(0, 6).map((puzzle) => puzzle.leftImage)

export function AttractScreen({ onStart, isFullscreen, onToggleFullscreen, isMuted, onToggleMute }) {
  return (
    <div className={styles.wrapper}>
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
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Picture Puzzle
        </motion.h1>
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Combine the pictures. Guess the answer.
        </motion.p>

        <motion.button
          type="button"
          className={styles.startButton}
          onClick={onStart}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.96 }}
        >
          Start Game
        </motion.button>

        <p className={styles.hint}>Press Enter to start</p>
      </div>
    </div>
  )
}
