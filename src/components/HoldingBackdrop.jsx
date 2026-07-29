import styles from './HoldingBackdrop.module.css'

/**
 * Full-bleed event hero art used behind non-gameplay screens (waiting/setup/results).
 * Purely decorative — a dark scrim keeps foreground text legible on a TV display.
 */
export function HoldingBackdrop() {
  return (
    <div className={styles.backdrop} aria-hidden="true">
      <img src="/image/hackathon-holding-bg.png" alt="" className={styles.image} draggable="false" />
      <div className={styles.scrim} />
    </div>
  )
}
