import { motion } from 'motion/react'
import styles from './TimerBar.module.css'

const URGENT_THRESHOLD_SECONDS = 3

/** Numeric countdown + progress bar. Pulses (not just recolors) in the final seconds. */
export function TimerBar({ timeRemaining, duration }) {
  const clamped = Math.max(0, timeRemaining)
  const seconds = Math.ceil(clamped)
  const fraction = duration > 0 ? clamped / duration : 0
  const isUrgent = clamped > 0 && clamped <= URGENT_THRESHOLD_SECONDS

  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.number}
        data-urgent={isUrgent || undefined}
        animate={isUrgent ? { scale: [1, 1.18, 1] } : { scale: 1 }}
        transition={isUrgent ? { duration: 0.9, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      >
        {seconds}
      </motion.div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Time remaining"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={Math.round(clamped)}
      >
        <motion.div
          className={styles.fill}
          data-urgent={isUrgent || undefined}
          animate={{ width: `${fraction * 100}%` }}
          transition={{ duration: 0.15, ease: 'linear' }}
        />
      </div>
    </div>
  )
}
