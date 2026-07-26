import { AnimatePresence, motion } from 'motion/react'
import styles from './FeedbackOverlay.module.css'

const CONFETTI_COLORS = ['#ffd166', '#06d6a0', '#ef476f', '#118ab2', '#ffffff']
const CONFETTI_PIECES = 18

function Confetti() {
  return (
    <div className={styles.confetti} aria-hidden="true">
      {Array.from({ length: CONFETTI_PIECES }, (_, index) => {
        const left = (index / CONFETTI_PIECES) * 100 + (Math.random() * 6 - 3)
        const delay = Math.random() * 0.2
        const rotate = Math.random() * 360 - 180
        const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length]
        return (
          <motion.span
            key={index}
            className={styles.confettiPiece}
            style={{ left: `${left}%`, backgroundColor: color }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{ y: 280, opacity: 0, rotate }}
            transition={{ duration: 1.1, delay, ease: 'easeIn' }}
          />
        )
      })}
    </div>
  )
}

// Icon + label are both distinct per outcome (not just color) so the
// feedback still reads correctly without relying on color perception.
const CONTENT_BY_STATUS = {
  correct: { icon: '✓', title: 'CORRECT!', tone: 'correct' },
  wrong: { icon: '✕', title: 'NOT QUITE!', tone: 'wrong' },
  timeout: { icon: '⏱', title: "TIME'S UP!", tone: 'timeout' },
}

/** Shown over the puzzle once the backend has judged it (correct/wrong) or it's timed out; reveals the answer. */
export function FeedbackOverlay({ status, answer }) {
  const content = CONTENT_BY_STATUS[status]
  if (!content) return null

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        data-tone={content.tone}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        role="status"
        aria-live="polite"
      >
        {status === 'correct' && <Confetti />}
        <motion.div
          className={styles.icon}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 16 }}
        >
          {content.icon}
        </motion.div>
        <div className={styles.title}>{content.title}</div>
        {answer && <div className={styles.answer}>{answer}</div>}
        {status === 'correct' && (
          <motion.div
            className={styles.points}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            +10 POINTS
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
