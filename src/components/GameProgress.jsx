import styles from './GameProgress.module.css'

export function GameProgress({ current, total }) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.text}>
        Puzzle {current} of {total}
      </span>
      <div className={styles.dots} aria-hidden="true">
        {Array.from({ length: total }, (_, index) => (
          <span key={index} className={styles.dot} data-filled={index < current || undefined} />
        ))}
      </div>
    </div>
  )
}
