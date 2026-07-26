import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>Page not found</div>
      <p className={styles.message}>
        <Link className={styles.link} to="/">
          Open a game
        </Link>
      </p>
    </div>
  )
}
