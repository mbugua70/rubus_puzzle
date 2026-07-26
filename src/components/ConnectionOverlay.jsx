import styles from './ConnectionOverlay.module.css'

/**
 * Small non-blocking banner shown on top of the last known screen while the
 * display socket isn't connected. Never hides or replaces the underlying
 * screen - the last authoritative game state stays visible underneath.
 */
export function ConnectionOverlay({ label }) {
  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <span className={styles.dot} aria-hidden="true" />
      {label}
    </div>
  )
}
