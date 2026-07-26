import { AnimatePresence, motion } from 'motion/react'
import { useGameTimer } from '../hooks/useGameTimer.js'
import styles from './CountdownScreen.module.css'

/**
 * Shown while the backend status is "countdown". The backend decides when
 * this phase ends (a new `game:state` will move status to "playing") - this
 * screen only ever renders a number derived from `questionEndsAt`, it never
 * decides to advance on its own.
 */
export function CountdownScreen({ questionStartedAt, questionEndsAt }) {
  const { timeRemaining } = useGameTimer({ questionStartedAt, questionEndsAt })
  const value = questionEndsAt ? String(Math.max(1, Math.ceil(timeRemaining))) : 'Get Ready'

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          className={styles.value}
          data-text={!questionEndsAt || undefined}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
