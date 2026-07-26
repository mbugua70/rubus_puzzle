import { motion } from 'motion/react'
import { useState } from 'react'
import { PLACEHOLDER_IMAGE } from '../utils/imagePreloader.js'
import styles from './PuzzleCard.module.css'

const VARIANTS = {
  left: { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0 } },
}

/**
 * A single picture-clue card. Empty alt text is intentional: the image is
 * the clue itself, and announcing the word (e.g. "rain") would hand the
 * answer to a screen-reader user before the game intends to reveal it.
 */
export function PuzzleCard({ image, direction }) {
  const [src, setSrc] = useState(image)

  return (
    <motion.div
      className={styles.card}
      variants={VARIANTS[direction]}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <img className={styles.image} src={src} alt="" onError={() => setSrc(PLACEHOLDER_IMAGE)} draggable={false} />
    </motion.div>
  )
}
