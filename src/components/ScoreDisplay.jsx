import { AnimatePresence, motion } from 'motion/react'
import styles from './ScoreDisplay.module.css'

/** Score changes pop the new number in rather than silently swapping the text node. */
export function ScoreDisplay({ score }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Score</span>
      <span className={styles.valueWrapper}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={score}
            className={styles.value}
            initial={{ y: -12, opacity: 0, scale: 1.25 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  )
}
