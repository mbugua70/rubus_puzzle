import { motion } from 'motion/react'
import styles from './LoadingScreen.module.css'

export function LoadingScreen({ progress }) {
  const percent = Math.round(progress * 100)

  return (
    <div className={styles.wrapper}>
      <motion.div className={styles.badge} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        Picture Puzzle
      </motion.div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Loading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <motion.div className={styles.fill} animate={{ width: `${percent}%` }} transition={{ duration: 0.2 }} />
      </div>
      <div className={styles.percent}>{percent}%</div>
    </div>
  )
}
