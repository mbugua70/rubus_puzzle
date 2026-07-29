import { motion } from 'motion/react'
import { BrandLogo } from '../components/BrandLogo.jsx'
import styles from './LoadingScreen.module.css'

/** Generic full-screen loading state, used both for the initial REST fetch and while the socket is connecting/joining. */
export function LoadingScreen({ message }) {
  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.badge}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <BrandLogo className={styles.logo} />
      </motion.div>
      <div className={styles.track} role="progressbar" aria-label={message}>
        <div className={styles.fill} />
      </div>
      <div className={styles.message}>{message}</div>
    </div>
  )
}
