import { BrandLogo } from '../components/BrandLogo.jsx'
import styles from './GameLoadErrorScreen.module.css'

/** Shown when the initial REST fetch for a game session fails - not found, or the backend is unreachable. */
export function GameLoadErrorScreen({ gameCode, message, onRetry }) {
  return (
    <div className={styles.wrapper}>
      <BrandLogo className={styles.logo} />
      <div className={styles.title}>Couldn&rsquo;t load this game</div>
      <p className={styles.message}>
        <span className={styles.gameCode}>{gameCode}</span> &mdash; {message}
      </p>
      <button type="button" className={styles.retryButton} onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}
