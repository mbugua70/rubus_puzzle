import { AnimatePresence, motion } from 'motion/react'
import { PuzzleCard } from './PuzzleCard.jsx'
import styles from './PuzzleDisplay.module.css'

/**
 * Renders the current puzzle's picture card(s). Most puzzles combine two
 * component-word cards with a "+"; a puzzle with no rightImage is a single
 * whole-picture clue, so it renders alone with no "+". Keyed by puzzle id so
 * AnimatePresence treats each puzzle as a distinct entry — the old card(s)
 * fade out fully before the new one fades in, so the previous puzzle's
 * images are never visible alongside the new one.
 */
export function PuzzleDisplay({ puzzle, shake }) {
  if (!puzzle) return null

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={puzzle.id}
          className={styles.row}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: shake ? [0, -14, 12, -8, 4, 0] : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shake ? 0.45 : 0.25 }}
        >
          <PuzzleCard image={puzzle.leftImage} direction="left" />
          {puzzle.rightImage && (
            <>
              <motion.div
                className={styles.plus}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 18 }}
                aria-hidden="true"
              >
                +
              </motion.div>
              <PuzzleCard image={puzzle.rightImage} direction="right" />
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
