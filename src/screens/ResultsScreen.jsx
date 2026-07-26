import { motion } from 'motion/react'
import { getResultMessage } from '../utils/gameResults.js'
import styles from './ResultsScreen.module.css'

export function ResultsScreen({ score, correctCount, wrongCount, skippedCount, totalPuzzles, onRestart }) {
  const message = getResultMessage(correctCount, totalPuzzles)

  return (
    <div className={styles.wrapper}>
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
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalPuzzles}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
      </div>

      <motion.button
        type="button"
        className={styles.restartButton}
        onClick={onRestart}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
      >
        Play Again
      </motion.button>
      <p className={styles.hint}>Press R to restart</p>
    </div>
  )
}
