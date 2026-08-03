import { motion } from 'motion/react'
import { HoldingBackdrop } from '../components/HoldingBackdrop.jsx'
import { getResultMessage } from '../utils/gameResults.js'
import styles from './ResultsScreen.module.css'

/** Shown while the backend status is "finished". Every number here is the server's, never computed locally. */
export function ResultsScreen({ score, correctCount, wrongCount, skippedCount, timeoutCount, revealedCount, totalPuzzles }) {
  const message = getResultMessage(correctCount, totalPuzzles)

  return (
    <div className={styles.wrapper}>
      <HoldingBackdrop />

      <div className={styles.content}>
        <motion.h1
          className={styles.heading}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {message}
        </motion.h1>

        <motion.div
          className={styles.score}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 20 }}
        >
          {score}
          <span className={styles.scoreLabel}>points</span>
        </motion.div>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{correctCount}</span>
            <span className={styles.statLabel}>Correct</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{wrongCount}</span>
            <span className={styles.statLabel}>Wrong</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{skippedCount}</span>
            <span className={styles.statLabel}>Skipped</span>
          </div>
          {typeof timeoutCount === 'number' && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{timeoutCount}</span>
              <span className={styles.statLabel}>Timed out</span>
            </div>
          )}
          {typeof revealedCount === 'number' && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{revealedCount}</span>
              <span className={styles.statLabel}>Revealed</span>
            </div>
          )}
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalPuzzles}</span>
            <span className={styles.statLabel}>Total</span>
          </div>
        </div>

        <p className={styles.hint}>Waiting for the facilitator to restart</p>
      </div>
    </div>
  )
}
